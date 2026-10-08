import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/Button'

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  headline: string
  subheadline?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
  image?: React.ReactNode
  variant?: 'default' | 'centered' | 'split' | 'minimal'
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Hero = forwardRef<HTMLElement, HeroProps>(
  ({ className, headline, subheadline, primaryAction, secondaryAction, image, variant = 'default', size = 'lg', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-20',
      lg: 'py-20 md:py-28',
      xl: 'py-28 md:py-36',
    }

    return (
      <section
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto px-6">
          {variant === 'split' && image ? (
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{headline}</h1>
                {subheadline && <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl">{subheadline}</p>}
                <div className="mt-8 flex flex-wrap gap-4">
                  {primaryAction && <Button size="lg" asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button>}
                  {secondaryAction && <Button variant="outline" size="lg" asChild><a href={secondaryAction.href}>{secondaryAction.label}</a></Button>}
                </div>
              </div>
              <div className="relative">{image}</div>
            </div>
          ) : variant === 'centered' ? (
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{headline}</h1>
              {subheadline && <p className="mt-6 text-lg md:text-xl text-muted-foreground">{subheadline}</p>}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                {primaryAction && <Button size="lg" asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button>}
                {secondaryAction && <Button variant="outline" size="lg" asChild><a href={secondaryAction.href}>{secondaryAction.label}</a></Button>}
              </div>
            </div>
          ) : variant === 'minimal' ? (
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">{headline}</h1>
              {subheadline && <p className="mt-4 text-lg text-muted-foreground">{subheadline}</p>}
              {primaryAction && (
                <div className="mt-8">
                  <Button size="lg" asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl">{headline}</h1>
              {subheadline && <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">{subheadline}</p>}
              <div className="mt-8 flex flex-wrap gap-4">
                {primaryAction && <Button size="lg" asChild><a href={primaryAction.href}>{primaryAction.label}</a></Button>}
                {secondaryAction && <Button variant="outline" size="lg" asChild><a href={secondaryAction.href}>{secondaryAction.label}</a></Button>}
              </div>
              {image && <div className="mt-12">{image}</div>}
            </div>
          )}
          {children}
        </div>
      </section>
    )
  }
)
Hero.displayName = 'Hero'

export { Hero }