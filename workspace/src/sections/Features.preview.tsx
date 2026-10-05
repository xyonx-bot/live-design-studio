import { Features } from './Features'
import { Card, CardContent } from '@/components/Card'
import { Zap, Shield, Globe, Code, Rocket, BarChart } from 'lucide-react'

const features = [
  { title: 'Lightning Fast', description: 'Built for speed with optimized performance out of the box.', icon: <Zap className="h-6 w-6" /> },
  { title: 'Secure by Default', description: 'Enterprise-grade security with zero configuration required.', icon: <Shield className="h-6 w-6" /> },
  { title: 'Global Scale', description: 'Deploy worldwide with edge network and automatic scaling.', icon: <Globe className="h-6 w-6" /> },
  { title: 'Developer Experience', description: 'Intuitive APIs and powerful tooling for productive teams.', icon: <Code className="h-6 w-6" /> },
  { title: 'Rapid Deployment', description: 'Ship features in minutes, not hours, with CI/CD integration.', icon: <Rocket className="h-6 w-6" /> },
  { title: 'Analytics Built-in', description: 'Real-time insights into performance and user behavior.', icon: <BarChart className="h-6 w-6" /> },
]

export default function FeaturesPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Features</h2>
      <p className="text-muted-foreground">Feature grid section with icons, titles, and descriptions.</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Default (3 columns)</h3>
          <div className="border rounded-lg overflow-hidden">
            <Features
              title="Everything You Need to Build"
              subtitle="Powerful features that help you ship faster and scale further."
              features={features}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Compact (4 columns)</h3>
          <div className="border rounded-lg overflow-hidden">
            <Features
              features={features.slice(0, 4)}
              variant="compact"
              columns={4}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Detailed (2 columns)</h3>
          <div className="border rounded-lg overflow-hidden">
            <Features
              title="Detailed Features"
              subtitle="More space for comprehensive feature descriptions."
              features={features.slice(0, 4)}
              variant="detailed"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Without Title</h3>
          <div className="border rounded-lg overflow-hidden">
            <Features
              features={features.slice(0, 3)}
              variant="default"
              columns={3}
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark border rounded-lg overflow-hidden">
            <Features
              title="Dark Mode Features"
              subtitle="Consistent styling across themes."
              features={features.slice(0, 3)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}