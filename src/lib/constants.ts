export const FREELANCER_PRICING_PLANS = [
  {
    id: 'price_starter',
    name: 'Solo Freelancer',
    price: 29,
    interval: 'month',
    description: 'Perfect for freelancers just starting out',
    features: [
      '100 AI-Generated Leads/month',
      'Email Templates',
      'Basic Analytics',
      'Follow-up Reminders',
      'Email Tracking',
    ],
    limits: {
      leadsPerMonth: 100,
      emailsPerDay: 50,
      automatedFollowUps: 25,
      customTemplates: 3,
      aiCredits: 100,
    },
  },
  {
    id: 'price_pro',
    name: 'Professional',
    price: 79,
    interval: 'month',
    description: 'For established freelancers looking to scale',
    features: [
      'Unlimited AI-Generated Leads',
      'Advanced Lead Scoring',
      'Custom Email Templates',
      'Advanced Analytics',
      'Priority Support',
      'Client Portal',
    ],
    limits: {
      leadsPerMonth: -1, // unlimited
      emailsPerDay: 200,
      automatedFollowUps: 100,
      customTemplates: 10,
      aiCredits: 500,
    },
    recommended: true,
  },
];
