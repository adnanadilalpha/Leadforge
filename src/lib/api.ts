import axios from 'axios';
import type { User, Lead, Campaign, EmailSettings } from './types';
import { aiService } from './ai';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add response interceptor for development
api.interceptors.response.use(
  response => response,
  error => {
    // In development, return mock data if API is not available
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using mock data in development');
      return Promise.resolve({ data: getMockData(error.config) });
    }
    return Promise.reject(error);
  }
);

// Mock data helper
function getMockData(config: any) {
  const mockUser = {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'Sales Manager',
    skills: ['B2B Sales', 'Lead Generation']
  };

  const mockLeads = [
    {
      id: Date.now().toString(),
      companyName: 'Tech Innovators Inc',
      contactName: 'John Smith',
      email: 'john@techinnovators.com',
      status: 'new',
      industry: 'Technology',
      employeeCount: '51-200',
      website: 'www.techinnovators.com',
      notes: 'AI-generated lead based on search criteria'
    }
  ];

  switch (config.url) {
    case '/auth/login':
    case '/auth/signup':
      return mockUser;
    case '/leads':
    case '/leads/generate':
      return mockLeads;
    case '/campaigns':
      return [];
    default:
      return null;
  }
}

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<User> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData) {
        throw new Error('User data not found');
      }
      
      return { ...userData, id: user.uid } as User;
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid email or password');
      }
      throw new Error('Login failed. Please try again.');
    }
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userData: User = {
        id: user.uid,
        email,
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      }
      throw new Error('Signup failed. Please try again.');
    }
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async getSession(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          resolve(userDoc.data() as User);
        } else {
          resolve(null);
        }
        unsubscribe();
      });
    });
  }
};

// Leads API
export const leadsApi = {
  async generate(prompt: string): Promise<Lead[]> {
    const newLeads = await aiService.generateLeads(prompt);
    const leadsCollection = collection(db, 'leads');
    
    const storedLeads = await Promise.all(
      newLeads.map(async (lead) => {
        const leadData = {
          ...lead,
          userId: auth.currentUser?.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'new' as const // Type assertion to narrow the type
        };
        
        const docRef = await addDoc(leadsCollection, leadData);
        return { ...leadData, id: docRef.id };
      })
    );
    
    return storedLeads as Lead[];
  },

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      console.error(`Lead with ID ${id} not found in Firestore`);
      throw new Error('Lead not found');
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(leadRef, updateData);
    
    const updatedDoc = await getDoc(leadRef);
    return { 
      ...updatedDoc.data(),
      id: updatedDoc.id 
    } as Lead;
  },

  async getAll(): Promise<Lead[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadsQuery = query(
      collection(db, 'leads'), 
      where('userId', '==', auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(leadsQuery);
    return snapshot.docs.map(doc => ({ 
      ...doc.data(), 
      id: doc.id 
    } as Lead));
  },

  async delete(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }

    // Verify ownership
    const leadData = leadDoc.data();
    if (leadData.userId !== auth.currentUser.uid) {
      throw new Error('Unauthorized access');
    }

    await deleteDoc(leadRef);
  }
};

// Campaigns API
export const campaignsApi = {
  async create(campaign: Omit<Campaign, 'id'>): Promise<Campaign> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    const campaignRef = await addDoc(collection(db, 'campaigns'), campaign);
    return { ...campaign, id: campaignRef.id } as Campaign;
  },

  async getAll(): Promise<Campaign[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    const campaignsQuery = query(
      collection(db, 'campaigns'),
      where('userId', '==', auth.currentUser.uid)
    );
    const snapshot = await getDocs(campaignsQuery);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Campaign);
  },

  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    const campaignRef = doc(db, 'campaigns', id);
    await updateDoc(campaignRef, { ...data, updatedAt: new Date().toISOString() });
    const updatedDoc = await getDoc(campaignRef);
    return { ...updatedDoc.data(), id: updatedDoc.id } as Campaign;
  },

  async delete(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    await deleteDoc(doc(db, 'campaigns', id));
  }
};

// Email API
export const emailApi = {
  async generateTemplate(lead: Lead, userProfile: User): Promise<string> {
    const { data } = await api.post('/email/generate', { lead, userProfile });
    return data.template;
  },

  async send(campaignId: string, leadId: string, template: string): Promise<void> {
    await api.post('/email/send', { campaignId, leadId, template });
  },

  async analyze(emailContent: string): Promise<{
    sentiment: string;
    suggestedFollowUp: string;
  }> {
    const { data } = await api.post('/email/analyze', { content: emailContent });
    return data;
  },

  async sendEmail(lead: Lead, template: string): Promise<void> {
    const emailRef = doc(collection(db, 'emails'));
    await setDoc(emailRef, {
      to: lead.email,
      template,
      leadId: lead.id,
      userId: auth.currentUser?.uid,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  },

  async updateEmailSettings(settings: EmailSettings): Promise<EmailSettings> {
    const { data } = await api.post('/email/settings', settings);
    return data;
  }
};

