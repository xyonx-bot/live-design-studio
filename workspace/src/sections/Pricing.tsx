import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/Card'
import { Check } from 'lucide-react'

interface PricingPlan {
  name: string
  price: { monthly: number; yearly: number }
  description: string
  features: string[]
  cta: { label: string; href: string }
  variant?: 'default' | 'popular'
  highlighted?: boolean
}

interface PricingProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  plans: PricingPlan[]
  defaultPeriod?: 'monthly' | 'yearly'
}

const Pricing = forwardRef<HTMLElement, PricingProps>(
  ({ className, title, subtitle, plans, defaultPeriod = 'monthly', children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-6">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto mb-12">
              {title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>}
              {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={cn(
                  'flex flex-col relative',
                  plan.highlighted && 'border-primary shadow-lg shadow-primary/10',
                  plan.variant === 'popular' && 'border-primary'
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4 flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">${plan.price[defaultPeriod]}</span>
                    <span className="text-muted-foreground">/{defaultPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {plan.price.yearly && defaultPeriod === 'monthly' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${plan.price.yearly}/yr (save {Math.round((1 - plan.price.yearly / (plan.price.monthly * 12)) * 100)}%)
                    </p>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    variant={plan.highlighted || plan.variant === 'popular' ? 'default' : 'outline'}
                    asChild
                  >
                    <a href={plan.cta.href}>{plan.cta.label}</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {children}
        </div>
      </section>
    )
  }
)
Pricing.displayName = 'Pricing'

export { Pricing }