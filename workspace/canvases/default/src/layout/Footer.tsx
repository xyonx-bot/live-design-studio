import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'simple' | 'newsletter'
  links?: Array<{ label: string; href: string }>
  socialLinks?: Array<{ label: string; href: string; icon: React.ReactNode }>
  copyright?: string
}

const Footer = forwardRef<HTMLElement, FooterProps>(
  ({ className, variant = 'default', links, socialLinks, copyright, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(
          'border-t bg-muted/50',
          variant === 'default' && 'py-12 px-6',
          variant === 'simple' && 'py-8 px-6 text-center',
          variant === 'newsletter' && 'py-12 px-6',
          className
        )}
        {...props}
      >
        <div className="max-w-7xl mx-auto">
          {variant === 'default' && (
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {links?.map((link) => (
                    <li key={link.href}><a href={link.href} className="hover:text-foreground">{link.label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">About</a></li>
                  <li><a href="#" className="hover:text-foreground">Blog</a></li>
                  <li><a href="#" className="hover:text-foreground">Careers</a></li>
                  <li><a href="#" className="hover:text-foreground">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                  <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                  <li><a href="#" className="hover:text-foreground">Community</a></li>
                  <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground">Privacy</a></li>
                  <li><a href="#" className="hover:text-foreground">Terms</a></li>
                  <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          )}
          {variant === 'simple' && (
            <p className="text-sm text-muted-foreground">{copyright || '© 2024 Company. All rights reserved.'}</p>
          )}
          {variant === 'newsletter' && (
            <div className="text-center max-w-md mx-auto">
              <h4 className="text-xl font-semibold mb-2">Stay Updated</h4>
              <p className="text-muted-foreground mb-4">Get the latest news and updates.</p>
              <form className="flex gap-2 justify-center">
                <input type="email" placeholder="Enter your email" className="flex-1 max-w-xs px-4 py-2 border rounded-md bg-background" />
                <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Subscribe</button>
              </form>
            </div>
          )}
          {children}
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            {copyright || '© 2024 Company. All rights reserved.'}
          </div>
        </div>
      </footer>
    )
  }
)
Footer.displayName = 'Footer'

export { Footer }