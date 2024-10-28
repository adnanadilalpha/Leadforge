// Previous types remain the same, adding new subscription types
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    leadsPerMonth: number;
    emailsPerDay: number;
    campaigns: number;
    teamMembers: number;
    customTemplates: number;
  };
  recommended?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Rest of the types remain the same...