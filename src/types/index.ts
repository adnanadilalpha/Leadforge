export interface User {
  id: string;
  email: string;
  name: string;
  role: 'freelancer' | 'admin';
  profession?: string;
  expertise?: string[];
  portfolio?: string;
  subscription: SubscriptionStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
  emailSignature?: string;
  settings?: FreelancerSettings;
}

export interface FreelancerSettings {
  hourlyRate?: number;
  availability?: 'available' | 'busy' | 'not_available';
  timezone?: string;
  preferredCommunication?: 'email' | 'phone' | 'messaging';
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

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: string;
  projectType?: string;
  budget?: {
    min: number;
    max: number;
  };
  timeline?: string;
  requirements?: string;
  notes?: string;
  tags: string[];
  isFavorite?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastContactedAt?: string | Date;
  nextFollowUpDate?: string | Date;
}

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'social' | 'ads';
  startDate?: string | Date;
  endDate?: string | Date;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
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
  features: string[];
  limits: {
    leadsPerMonth: number;
    emailsPerDay: number;
    automatedFollowUps: number;
    customTemplates: number;
    aiCredits: number;
  };
  recommended?: boolean;
  description?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

// Add LeadGroup interface
export interface LeadGroup {
  id: string;
  name: string;
  userId: string;
  leadIds: string[];
  createdAt: string | Date;
  updatedAt: string | Date;
}
