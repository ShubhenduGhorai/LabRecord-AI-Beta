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
    id: 'pro_yearly',
    name: 'Pro Yearly',
    description: 'Maximum savings with the complete scientific toolset.',
    price: '$8',
    amount: 8,
    period: '/month',
    billedYearly: 'BILLED YEARLY ($96)',
    features: [
      'Unlimited uses per tool',
      'AI Lab Report Writer',
      'Priority AI processing',
      'PDF & DOCX Export',
      'AI Data Analysis',
      'Graph Generator',
      'Viva Preparation',
      'Research Formatting'
    ],
    priceId: 'plan_pro_yearly',
    paypalPlanId: 'P-34W2022987790400UNG2DXJY',
    popular: true,
    limit: 1000, 
  },
];
