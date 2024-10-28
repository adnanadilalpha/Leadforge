export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  skills?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  status: 'new' | 'contacted' | 'responded' | 'converted' | 'archived';
  industry: string;
  employeeCount: string;
  website: string;
  notes: string;
  isFavorite: boolean;
  userId: string;
  verificationDate: string;
  lastContact?: string;
  lastFunding: {
    amount: string;
    date: string;
    round: string;
  } | null;
  socialProfiles: {
    contactLinkedIn?: string;
    companyLinkedIn?: string;
    twitter?: string;
    github?: string;
    blog?: string;
  };
  techStack: string[];
  potentialProject: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  leads: string[];
  emailTemplate: string;
  stats: {
    sent: number;
    opened: number;
    replied: number;
    converted: number;
  };
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SendingSchedule {
  maxPerDay: number;
  maxPerHour: number;
  preferredTimes: string[];
  timezone: string;
  workingDays: string[];
}

export interface AISettings {
  tone: string;
  language: string;
  creativity: number;
  maxTokens: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  desktopNotifications: boolean;
  dailyDigest: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  content: string;
}

export interface EmailSettings {
  userId: string;
  email: string;
  name: string;
  signature: string;
  sendingSchedule: SendingSchedule;
  aiSettings: AISettings;
  notifications: NotificationSettings;
  templates: EmailTemplate[];
  createdAt: string;
  updatedAt: string;
}
