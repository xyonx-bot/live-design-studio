import { Button } from './Button'

export default function ButtonPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Button</h2>
      <p className="text-muted-foreground">A versatile button component with multiple variants and sizes.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Variants</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Sizes</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Icon button">+</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">States</h3>
          <div className="flex flex-wrap gap-3">
            <Button>Enabled</Button>
            <Button disabled>Disabled</Button>
            <Button aria-busy="true">Loading</Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark p-4 rounded-lg space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Long Text</h3>
          <Button variant="default">
            This is a button with very long text that should wrap properly
          </Button>
        </div>
      </div>
    </div>
  )
}