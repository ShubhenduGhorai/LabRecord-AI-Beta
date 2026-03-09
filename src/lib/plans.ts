export const PLANS = [
  {
    name: 'Free',
    description: 'Perfect for getting started.',
    price: '$0',
    features: ['3 reports per month', 'Basic data analysis', 'Community support'],
    priceId: null,
  },
  {
    name: 'Pro',
    description: 'Unlimited reports for serious students.',
    price: '$9',
    period: '/month',
    features: ['Unlimited reports', 'AI report generation', 'PDF download', 'Priority support'],
    priceId: 'price_pro_id', // Placeholder - User to replace
    popular: true,
  },
  {
    name: 'Research',
    description: 'Advanced features for researchers.',
    price: '$99',
    period: '/year',
    features: ['Unlimited reports', 'Advanced AI analysis', 'Viva preparation sheets', 'Priority processing'],
    priceId: 'price_research_id', // Placeholder - User to replace
  },
];
