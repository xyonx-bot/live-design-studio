import { Footer } from './Footer'

export default function FooterPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Footer</h2>
      <p className="text-muted-foreground">Site footer with navigation links and newsletter signup.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Default</h3>
          <Footer
            links={[
              { label: 'Features', href: '#' },
              { label: 'Pricing', href: '#' },
              { label: 'Docs', href: '#' },
            ]}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Simple</h3>
          <Footer variant="simple" copyright="© 2024 MyApp. All rights reserved." />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Newsletter</h3>
          <Footer variant="newsletter" />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark">
            <Footer
              links={[{ label: 'Link', href: '#' }]}
              copyright="© 2024 Dark Mode"
            />
          </div>
        </div>
      </div>
    </div>
  )
}