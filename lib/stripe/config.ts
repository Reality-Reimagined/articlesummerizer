export const STRIPE_PLANS = {
  PRO: {
    name: 'Summarizer Plan',
    price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    summaries: 25,
    features: [
      'Access to premium sources',
      '25 summaries per month',
      'All export formats',
      'Email notifications'
    ]
  },
  ENTERPRISE: {
    name: 'Summarizer Pro',
    price_id: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    summaries: 50,
    features: [
      'All premium sources',
      '50 summaries per month',
      'Priority processing',
      'Advanced analytics',
      'API access'
    ]
  }
} as const;

export const SUBSCRIPTION_STATUS = {
  active: 'active',
  canceled: 'canceled',
  incomplete: 'incomplete',
  incomplete_expired: 'incomplete_expired',
  past_due: 'past_due',
  trialing: 'trialing',
  unpaid: 'unpaid'
} as const;