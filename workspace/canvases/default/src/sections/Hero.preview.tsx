import { Hero } from './Hero'
import { Card, CardContent } from '@/components/Card'

export default function HeroPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Hero</h2>
      <p className="text-muted-foreground">Hero section with headline, subheadline, and call-to-action buttons.</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Default</h3>
          <div className="border rounded-lg overflow-hidden">
            <Hero
              headline="Build Better Products Faster"
              subheadline="The modern toolkit for developers who want to ship beautiful, performant applications without the complexity."
              primaryAction={{ label: 'Get Started', href: '#' }}
              secondaryAction={{ label: 'View Demo', href: '#' }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Centered</h3>
          <div className="border rounded-lg overflow-hidden">
            <Hero
              variant="centered"
              headline="Centered Hero Variant"
              subheadline="Perfect for landing pages with a clear, single call to action."
              primaryAction={{ label: 'Start Free Trial', href: '#' }}
              secondaryAction={{ label: 'Learn More', href: '#' }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Split Layout</h3>
          <div className="border rounded-lg overflow-hidden">
            <Hero
              variant="split"
              headline="Split Layout with Visual"
              subheadline="Show your product alongside compelling copy. Great for SaaS landing pages."
              primaryAction={{ label: 'Try Now', href: '#' }}
              secondaryAction={{ label: 'Watch Demo', href: '#' }}
              image={
                <Card className="aspect-video bg-muted flex items-center justify-center">
                  <CardContent className="text-center text-muted-foreground">
                    Product Screenshot / Illustration
                  </CardContent>
                </Card>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Minimal</h3>
          <div className="border rounded-lg overflow-hidden">
            <Hero
              variant="minimal"
              headline="Minimal Hero"
              subheadline="Clean and simple, focusing on the essential message."
              primaryAction={{ label: 'Get Started', href: '#' }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark border rounded-lg overflow-hidden">
            <Hero
              headline="Dark Mode Hero"
              subheadline="Works beautifully in both light and dark themes."
              primaryAction={{ label: 'Get Started', href: '#' }}
              secondaryAction={{ label: 'Learn More', href: '#' }}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Large Size</h3>
          <div className="border rounded-lg overflow-hidden">
            <Hero
              size="xl"
              headline="Extra Large Hero"
              subheadline="Maximum impact for your most important pages."
              primaryAction={{ label: 'Get Started', href: '#' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}