import { Pricing } from './Pricing'

const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, yearly: 0 },
    description: 'Perfect for hobby projects and learning.',
    features: [
      'Up to 3 projects',
      '1 GB storage',
      'Community support',
      'Basic analytics',
      'Custom domains',
    ],
    cta: { label: 'Start Free', href: '#' },
  },
  {
    name: 'Pro',
    price: { monthly: 29, yearly: 290 },
    description: 'For growing teams and businesses.',
    features: [
      'Unlimited projects',
      '100 GB storage',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'Team collaboration',
      'SSO authentication',
    ],
    cta: { label: 'Get Started', href: '#' },
    highlighted: true,
    variant: 'popular',
  },
  {
    name: 'Enterprise',
    price: { monthly: 99, yearly: 990 },
    description: 'For large organizations with custom needs.',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      '24/7 dedicated support',
      'Custom integrations',
      'SLA guarantee',
      'On-premise option',
      'Audit logs',
    ],
    cta: { label: 'Contact Sales', href: '#' },
  },
]

export default function PricingPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Pricing</h2>
      <p className="text-muted-foreground">Pricing table with monthly/yearly toggle and feature comparison.</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Default (Monthly)</h3>
          <div className="border rounded-lg overflow-hidden">
            <Pricing
              title="Simple, Transparent Pricing"
              subtitle="Choose the plan that's right for you. All plans include a 14-day free trial."
              plans={plans}
              defaultPeriod="monthly"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Yearly Period</h3>
          <div className="border rounded-lg overflow-hidden">
            <Pricing
              title="Annual Billing"
              subtitle="Save up to 20% with yearly billing."
              plans={plans}
              defaultPeriod="yearly"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Minimal (No Title)</h3>
          <div className="border rounded-lg overflow-hidden">
            <Pricing
              plans={plans.slice(0, 2)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark border rounded-lg overflow-hidden">
            <Pricing
              title="Dark Mode Pricing"
              subtitle="Pricing tables look great in dark mode too."
              plans={plans}
            />
          </div>
        </div>
      </div>
    </div>
  )
}