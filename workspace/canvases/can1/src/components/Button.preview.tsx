import { Button } from './Button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function ButtonPreview() {
  return (
    <div className="piece-root min-h-[480px] bg-background px-8 py-10 text-foreground">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Button</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Minimal, square-ish 2px corners, flat surfaces, quiet hover states.
        </p>
      </div>

      <div className="space-y-7">
        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Variants</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Get started</Button>
            <Button variant="outline">Learn more</Button>
            <Button variant="ghost">Skip for now</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">With icons</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              Continue <ArrowRight size={16} />
            </Button>
            <Button variant="outline">
              <ArrowLeft size={16} /> Back
            </Button>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">States</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => console.log('clicked')}>Interactive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
