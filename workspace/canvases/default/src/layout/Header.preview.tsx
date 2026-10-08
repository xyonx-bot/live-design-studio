import { Header } from './Header'
import { Button } from '@/components/Button'

export default function HeaderPreview() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Header</h2>
      <p className="text-muted-foreground">Navigation header with logo, links, and actions.</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Default</h3>
          <div className="border rounded-lg overflow-hidden h-20">
            <Header
              logo={<span className="font-bold text-xl">Logo</span>}
              navigation={
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-primary">Features</a>
                  <a href="#" className="hover:text-primary">Pricing</a>
                  <a href="#" className="hover:text-primary">About</a>
                </div>
              }
              actions={
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">Sign In</Button>
                  <Button size="sm">Get Started</Button>
                </div>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Bordered</h3>
          <div className="border rounded-lg overflow-hidden h-20">
            <Header
              variant="bordered"
              logo={<span className="font-bold text-xl">Logo</span>}
              navigation={
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-primary">Home</a>
                  <a href="#" className="hover:text-primary">Docs</a>
                  <a href="#" className="hover:text-primary">Blog</a>
                </div>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Elevated (Sticky)</h3>
          <div className="border rounded-lg overflow-hidden h-20 relative">
            <Header
              variant="elevated"
              sticky
              logo={<span className="font-bold text-xl">Sticky</span>}
              navigation={
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-primary">Dashboard</a>
                  <a href="#" className="hover:text-primary">Settings</a>
                </div>
              }
              actions={
                <Button variant="ghost" size="sm">Profile</Button>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Dark Mode</h3>
          <div className="dark border rounded-lg overflow-hidden h-20">
            <Header
              logo={<span className="font-bold text-xl">Dark</span>}
              navigation={
                <div className="flex gap-6 text-sm">
                  <a href="#" className="hover:text-primary">Link 1</a>
                  <a href="#" className="hover:text-primary">Link 2</a>
                </div>
              }
              actions={
                <Button variant="outline" size="sm">Action</Button>
              }
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Minimal</h3>
          <div className="border rounded-lg overflow-hidden h-20">
            <Header
              logo={<span className="font-bold text-xl">Minimal</span>}
              actions={<Button variant="ghost" size="sm">Menu</Button>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}