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
    id: 'pro_monthly',
    name: 'Pro Monthly',
    description: 'Full scientific power, billed monthly.',
    price: '$8',
    amount: 8,
    period: '/month',
    features: [
      '200 uses per tool per month',
      'AI Data Analysis',
      'Graph Generator',
      'AI Lab Report Writer',
      'Viva Preparation',
      'Research Formatting',
      'Experiment Vault',
      'PDF & DOCX Export',
      'Priority AI processing'
    ],
    priceId: 'plan_pro_monthly',
    popular: false,
    limit: 200,
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    description: 'Maximum savings with the complete scientific toolset.',
    price: '$96',
    originalPrice: '$149',
    discount: '35% OFF',
    amount: 96,
    period: '/year',
    billedYearly: 'billed yearly ($96)',
    features: [
      'Unlimited uses per tool',
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
    limit: 1000, // Effectively unlimited for student use
  },
];
