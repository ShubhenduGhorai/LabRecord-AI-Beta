export const PLANS = [
  {
    id: 'free',
    name: 'Hobby',
    description: 'Perfect for getting started.',
    price: '$0',
    amount: 0,
    features: [
      'Use each tool 1 time',
      'AI Data Analysis',
      'Graph Generator',
      'AI Lab Report Writer',
      'Viva Preparation',
      'Research Formatting'
    ],
    priceId: null,
    limit: 1, // 1 use per tool
    export: false,
    storage: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Unlimited reports for serious students.',
    price: '$96',
    originalPrice: '$149',
    discount: '35% OFF',
    amount: 96,
    period: '/year',
    monthlyEquivalent: '$8/month',
    features: [
      '200 uses per tool per year',
      'AI Data Analysis',
      'Graph Generator',
      'AI Lab Report Writer',
      'Viva Preparation',
      'Research Formatting',
      'Experiment Vault',
      'PDF & DOCX Export',
      'Priority AI processing'
    ],
    priceId: 'plan_pro_yearly', 
    popular: true,
    limit: 200,
  },
];
