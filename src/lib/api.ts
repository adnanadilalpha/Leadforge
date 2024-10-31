import axios from 'axios';
import type { User, Lead, Campaign, EmailSettings, Subscription, LeadGroup } from '../types';
import { aiService } from './ai';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  getAuth
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db, auth } from './firebase';

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
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      return { ...userDoc.data(), id: user.uid } as User;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  async signup(email: string, password: string, name: string): Promise<User> {
    try {
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: User = {
        id: user.uid,
        email,
        name,
        role: 'freelancer',
        subscription: {
          status: 'trial',
          planId: 'FREE'
        },
        settings: {
          notifications: {
            email: true,
            browser: false,
            leadAlerts: true,
            weeklyReport: true
          },
          privacy: {
            shareData: false,
            allowMarketing: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  },

  async logout(): Promise<void> {
    try {
      const auth = getAuth();
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  }
};

// Leads API
export const leadsApi = {
  async generate(prompt: string): Promise<Lead[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const leads = await aiService.generateLeads(prompt);
      const leadsCollection = collection(db, 'leads');
      
      const storedLeads = await Promise.all(
        leads.map(async (lead) => {
          const leadData = {
            ...lead,
            userId: auth.currentUser!.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const docRef = await addDoc(leadsCollection, leadData);
          return { ...leadData, id: docRef.id };
        })
      );
      
      return storedLeads;
    } catch (error) {
      console.error('Lead generation error:', error);
      throw error;
    }
  },

  async update(id: string, data: Partial<Lead>): Promise<Lead> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });

    return this.getById(id);
  },

  async getAll(): Promise<Lead[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'leads'),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as Lead[];
  },

  async delete(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    await deleteDoc(doc(db, 'leads', id));
  },

  async getGroups(): Promise<LeadGroup[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'leadGroups'),
      where('userId', '==', auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as LeadGroup[];
  },

  async createGroup(name: string, leadIds: string[]): Promise<LeadGroup> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const groupData = {
      name,
      leadIds,
      userId: auth.currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'leadGroups'), groupData);
    return { ...groupData, id: docRef.id };
  },

  async toggleFavorite(leadId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', leadId);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }

    const currentData = leadDoc.data();
    await updateDoc(leadRef, {
      isFavorite: !currentData.isFavorite,
      updatedAt: new Date().toISOString()
    });
  },

  async getById(id: string): Promise<Lead> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    const leadDoc = await getDoc(leadRef);
    
    if (!leadDoc.exists()) {
      throw new Error('Lead not found');
    }

    return { ...leadDoc.data(), id: leadDoc.id } as Lead;
  },

  async addNote(id: string, note: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, {
      notes: note,
      updatedAt: new Date().toISOString()
    });
  },

  async scheduleFollowUp(id: string, date: Date): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const leadRef = doc(db, 'leads', id);
    await updateDoc(leadRef, {
      nextFollowUpDate: date.toISOString(),
      updatedAt: new Date().toISOString()
    });
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
