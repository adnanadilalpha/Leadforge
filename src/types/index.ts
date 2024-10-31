import { PRICING_PLANS } from "@/lib/constants";

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'agency';
  subscription?: {
    status: 'trial' | 'active' | 'canceled' | 'expired';
    planId: keyof typeof PRICING_PLANS;
  };
  settings?: UserSettings;
  stripeCustomerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    leadAlerts: boolean;
    weeklyReport: boolean;
  };
  privacy: {
    shareData: boolean;
    allowMarketing: boolean;
  };
  leadPreferences?: {
    industries?: string[];
    projectTypes?: string[];
    budgetRange?: {
      min: number;
      max: number;
    };
  };
}

export interface FreelancerSettings {
  hourlyRate: number;
  availability: 'available' | 'busy' | 'not_available';
  timezone?: string;
  preferredCommunication: 'email' | 'phone' | 'messaging';
  autoResponder?: boolean;
  leadPreferences?: {
    industries?: string[];
    projectTypes?: string[];
    budgetRange?: {
      min: number;
      max: number;
    };
  };
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';
export type LeadSource = 'ai-generated' | 'manual' | 'imported';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  title?: string;
  website?: string;
  companySize?: string;
  industry?: string;
  status: LeadStatus;
  source: LeadSource;
  projectType?: string;
  budget?: {
    min: number;
    max: number;
  };
  requirements?: string;
  notes?: string;
  tags: string[];
  isFavorite?: boolean;
  linkedIn?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  userId: string;
  evidence?: {
    projectSource?: string;
    companyNews?: string;
    jobPostings?: string;
    verificationDate?: string;
  };
}

export interface LeadGroup {
  id: string;
  name: string;
  userId: string;
  leadIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'linkedin';
  userId: string;
  leadIds: string[];
  templateId?: string;
  schedule?: {
    startDate: string;
    endDate?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
  };
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EmailSettings {
  signature?: string;
  defaultTemplate?: string;
  replyTo?: string;
  sendCopy?: boolean;
  trackOpens?: boolean;
  trackClicks?: boolean;
  userId: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    leadsPerMonth: number;
    emailsPerDay: number;
    campaigns: number;
    teamMembers: number;
    customTemplates: number;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}
