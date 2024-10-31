export const PRICING_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Perfect for trying out LeadForge',
    features: [
      '10 AI-Generated Leads/month',
      'Basic Email Templates',
      'Lead Management',
      'Email Tracking',
    ],
    limits: {
      leadsPerMonth: 10,
      emailsPerDay: 20,
      campaigns: 1,
      teamMembers: 1,
      customTemplates: 2
    }
  },
  FREELANCER: {
    id: 'price_freelancer', // Stripe price ID
    name: 'Freelancer',
    price: 29,
    interval: 'month',
    description: 'For independent freelancers',
    features: [
      '100 AI-Generated Leads/month',
      'Advanced Email Templates',
      'Lead Scoring',
      'Analytics Dashboard',
      'Priority Support',
      'Follow-up Automation'
    ],
    limits: {
      leadsPerMonth: 100,
      emailsPerDay: 50,
      campaigns: 5,
      teamMembers: 1,
      customTemplates: 10
    }
  },
  TEAM: {
    id: 'price_team', // Stripe price ID
    name: 'Team',
    price: 79,
    interval: 'month',
    description: 'For agencies and teams',
    features: [
      'Unlimited AI-Generated Leads',
      'Custom Email Templates',
      'Advanced Analytics',
      'Team Collaboration',
      'API Access',
      'Dedicated Support',
      'White-label Reports'
    ],
    limits: {
      leadsPerMonth: -1, // unlimited
      emailsPerDay: 200,
      campaigns: -1,
      teamMembers: 5,
      customTemplates: -1
    }
  }
};
