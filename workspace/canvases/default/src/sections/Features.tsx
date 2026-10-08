import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '../components/Card'

interface Feature {
  title: string
  description: string
  icon?: React.ReactNode
}

interface FeaturesProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  features: Feature[]
  variant?: 'default' | 'compact' | 'detailed'
  columns?: 2 | 3 | 4
}

const Features = forwardRef<HTMLElement, FeaturesProps>(
  ({ className, title, subtitle, features, variant = 'default', columns = 3, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn('py-16 md:py-24', className)}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-6">
          {(title || subtitle) && (
            <div className="text-center max-w-3xl mx-auto mb-16">
              {title && <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>}
              {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
            </div>
          )}
          <div className={cn(
            'grid gap-6 md:gap-8',
            variant === 'compact' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
            variant === 'default' && `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`,
            variant === 'detailed' && 'grid-cols-1 md:grid-cols-2'
          )}>
            {features.map((feature, index) => (
              <Card key={index} className={cn(
                'transition-shadow hover:shadow-lg',
                variant === 'detailed' && 'p-6'
              )}>
                <CardContent className={cn(
                  'pt-6',
                  variant === 'detailed' && 'pt-0'
                )}>
                  <div className="space-y-3">
                    {feature.icon && (
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {feature.icon}
                      </div>
                    )}
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {children}
        </div>
      </section>
    )
  }
)
Features.displayName = 'Features'

export { Features }