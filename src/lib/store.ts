import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, leadsApi, campaignsApi, emailApi } from './api';
import type { 
  User, 
  Lead, 
  Campaign, 
  EmailSettings,
  SendingSchedule,
  AISettings,
  NotificationSettings} from './types';
import { aiService } from './ai';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface LeadsState {
  leads: Lead[];
  fetchLeads: () => Promise<void>;
  generateLeads: (prompt: string) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  addLeadToList: (leadId: string) => Promise<void>;
  removeLead: (leadId: string) => Promise<void>;
}

interface CampaignsState {
  campaigns: Campaign[];
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
}

interface AppState extends AuthState, LeadsState, CampaignsState {
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  emailSettings: EmailSettings | null;
  updateEmailSettings: (settings: Partial<EmailSettings>) => Promise<void>;
  toggleLeadFavorite: (leadId: string) => Promise<void>;
  addCampaign: (campaign: Omit<Campaign, 'id'>) => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Data State
      leads: [],
      campaigns: [],

      // Auth Actions
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authApi.login(email, password);
          set({ user, isAuthenticated: true });
          await get().fetchLeads();
          await get().fetchCampaigns();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await authApi.signup(email, password, name);
          set({ user, isAuthenticated: true });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Signup failed';
          set({ error: message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authApi.logout();
          set({
            user: null,
            isAuthenticated: false,
            leads: [],
            campaigns: [],
          });
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        try {
          set({ isLoading: true });
          const user = get().user;
          if (!user) throw new Error('No user found');
          // Update user profile through API
          set({ user: { ...user, ...data } });
        } finally {
          set({ isLoading: false });
        }
      },

      // Leads Actions
      fetchLeads: async () => {
        try {
          set({ isLoading: true });
          const leads = await leadsApi.getAll();
          console.log('Fetched leads:', leads.map(lead => ({
            companyName: lead.companyName,
            contactName: lead.contactName,
            contactLinkedIn: lead.socialProfiles?.contactLinkedIn,
            companyLinkedIn: lead.socialProfiles?.companyLinkedIn,
            employeeCount: lead.employeeCount
          })));
          set({ leads });
        } catch (error) {
          set({ error: 'Failed to fetch leads' });
        } finally {
          set({ isLoading: false });
        }
      },

      generateLeads: async (prompt: string) => {
        try {
          set({ isLoading: true, error: null });
          const newLeads = await aiService.generateLeads(prompt);
          set({ leads: [...get().leads, ...newLeads] });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message });
          } else {
            set({ error: 'An unknown error occurred' });
          }
          console.error('Lead generation error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateLead: async (id, data) => {
        try {
          set({ isLoading: true });
          const updatedLead = await leadsApi.update(id, data);
          set({
            leads: get().leads.map((lead) =>
              lead.id === id ? updatedLead : lead
            ),
          });
        } catch (error) {
          set({ error: 'Failed to update lead' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteLead: async (id) => {
        try {
          set({ isLoading: true });
          await leadsApi.delete(id);
          set({
            leads: get().leads.filter((lead) => lead.id !== id),
          });
        } catch (error) {
          set({ error: 'Failed to delete lead' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      addLeadToList: async (leadId: string): Promise<void> => {
        try {
          set({ isLoading: true });
          const lead = get().leads.find(l => l.id === leadId);
          if (!lead) {
            console.error(`Lead with ID ${leadId} not found in local state`);
            throw new Error('Lead not found in local state');
          }

          // Update lead status in Firebase
          const updatedLead = await leadsApi.update(leadId, { 
            status: 'contacted',
            updatedAt: new Date().toISOString()
          });

          // Update local state
          set({
            leads: get().leads.map(l => (l.id === leadId ? updatedLead : l)),
          });
        } catch (error) {
          console.error('Failed to add lead to list:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      removeLead: async (leadId: string) => {
        try {
          set({ isLoading: true });
          // Delete from Firebase
          await leadsApi.delete(leadId);
          
          // Update local state
          set({
            leads: get().leads.filter(l => l.id !== leadId),
          });
        } catch (error) {
          set({ error: 'Failed to remove lead' });
          console.error('Failed to remove lead:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Campaigns Actions
      fetchCampaigns: async () => {
        try {
          set({ isLoading: true });
          const campaigns = await campaignsApi.getAll();
          set({ campaigns });
        } catch (error) {
          set({ error: 'Failed to fetch campaigns' });
        } finally {
          set({ isLoading: false });
        }
      },

      createCampaign: async (campaign) => {
        try {
          set({ isLoading: true });
          const newCampaign = await campaignsApi.create(campaign);
          set({
            campaigns: [...get().campaigns, newCampaign],
          });
        } catch (error) {
          set({ error: 'Failed to create campaign' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateCampaign: async (id: string, data: Partial<Campaign>): Promise<void> => {
        try {
          set({ isLoading: true });
          const updatedCampaign = await campaignsApi.update(id, data);
          set({
            campaigns: get().campaigns.map(campaign => 
              campaign.id === id ? updatedCampaign : campaign
            )
          });
        } catch (error) {
          set({ error: 'Failed to update campaign' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      deleteCampaign: async (id) => {
        try {
          set({ isLoading: true });
          await campaignsApi.delete(id);
          set({
            campaigns: get().campaigns.filter((campaign) => campaign.id !== id),
          });
        } catch (error) {
          set({ error: 'Failed to delete campaign' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Utility Actions
      setError: (error) => set({ error }),

      emailSettings: null,

      updateEmailSettings: async (settings: Partial<EmailSettings>) => {
        try {
          set({ isLoading: true });
          const currentSettings = get().emailSettings;
          const defaultSchedule: SendingSchedule = {
            maxPerDay: 50,
            maxPerHour: 10,
            preferredTimes: [],
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
          };

          const defaultAISettings: AISettings = {
            tone: 'Professional',
            language: 'English',
            creativity: 0.7,
            maxTokens: 2000
          };

          const defaultNotifications: NotificationSettings = {
            emailNotifications: true,
            desktopNotifications: true,
            dailyDigest: true
          };

          const updatedSettings: EmailSettings = {
            ...(currentSettings || {
              userId: get().user?.id || '',
              email: '',
              name: '',
              signature: '',
              sendingSchedule: defaultSchedule,
              aiSettings: defaultAISettings,
              notifications: defaultNotifications,
              templates: [],
              createdAt: new Date().toISOString(),
            }),
            ...settings,
            updatedAt: new Date().toISOString()
          };

          await emailApi.updateEmailSettings(updatedSettings);
          set({ emailSettings: updatedSettings });
        } catch (error) {
          set({ error: 'Failed to update email settings' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      toggleLeadFavorite: async (leadId) => {
        try {
          const lead = get().leads.find(l => l.id === leadId);
          if (!lead) return;

          const updatedLead = await leadsApi.update(leadId, {
            isFavorite: !lead.isFavorite
          });

          set({
            leads: get().leads.map(l => 
              l.id === leadId ? updatedLead : l
            )
          });
        } catch (error) {
          set({ error: 'Failed to update lead' });
          throw error;
        }
      },

      addCampaign: async (campaign: Omit<Campaign, 'id'>): Promise<void> => {
        try {
          set({ isLoading: true });
          const newCampaign = await campaignsApi.create(campaign);
          set({ 
            campaigns: [...get().campaigns, newCampaign]
          });
        } catch (error) {
          set({ error: 'Failed to create campaign' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'leadforge-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
