import { ArrowRight } from 'lucide-react'
import { Button } from './Button.square-minimal'

export default function ButtonSquareMinimalPreview() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Button — Square Minimal</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Squarish corners, flat surfaces, quiet hover states. Modern and minimal.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Get started</Button>
            <Button variant="outline">Learn more</Button>
            <Button variant="ghost">Skip for now</Button>
            <Button variant="link">View docs</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Continue"><ArrowRight size={16} /></Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">States</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Enabled</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline">Hover me</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">With icon</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              Continue <ArrowRight size={16} />
            </Button>
            <Button variant="outline">
              <ArrowRight size={16} /> Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
