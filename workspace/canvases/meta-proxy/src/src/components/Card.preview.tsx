import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'

export default function CardPreview() {
  return (
    <div className="p-8 space-y-8" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Variants</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default</CardTitle>
              <CardDescription>Simple card with background</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Clean card for content grouping</p>
            </CardContent>
          </Card>
          
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Bordered</CardTitle>
              <CardDescription>Card with border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Visible boundary for separation</p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated</CardTitle>
              <CardDescription>Card with shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Shadow for visual hierarchy</p>
            </CardContent>
          </Card>
          
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Interactive</CardTitle>
              <CardDescription>Hoverable card</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Hover for shadow & border change</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Conversation List Item (like the screenshot)</h3>
        <Card variant="interactive" className="max-w-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center font-medium text-muted-foreground">
                  RS
                </div>
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium truncate">Rahul Sharma</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">2:30 PM</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" size="sm">Lead</Badge>
                  <span className="text-sm text-muted-foreground truncate">Thanks for the details, I'll review...</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Contact Detail Card</h3>
        <Card variant="bordered" className="max-w-md">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-medium text-muted-foreground">
                  JD
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">Joydip C.</h4>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  <p className="text-sm text-muted-foreground mt-1">Admin • Acme Studio</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" removable onRemove={() => {}}>Lead</Badge>
                <Badge variant="outline" removable onRemove={() => {}}>Instagram Ad</Badge>
                <Badge variant="info" size="sm">Verified</Badge>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company</span>
                    <p className="font-medium">Acme Construction</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location</span>
                    <p className="font-medium">Mumbai, India</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget</span>
                    <p className="font-medium">₹50L - 1Cr</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Follow Up</span>
                    <p className="font-medium">Tomorrow 10 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Message Bubble Card (incoming)</h3>
        <Card variant="bordered" className="max-w-md">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground flex-shrink-0">
                RS
              </div>
              <div className="flex-1">
                <div className="bg-muted rounded-2xl px-4 py-2 max-w-[70%]">
                  <p className="text-sm">Thanks for the details, I'll review the proposal and get back to you by tomorrow morning.</p>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>2:30 PM</span>
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Rich Preview Card (document/link)</h3>
        <Card variant="bordered" className="max-w-md">
          <CardContent className="p-0 overflow-hidden">
            <div className="aspect-video bg-muted relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Website Plan Details</p>
                  <p className="text-sm text-muted-foreground">Project proposal and specifications</p>
                </div>
                <Button variant="outline" size="sm">View Document</Button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                <span>PDF • 248 KB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">PDF Attachment Card</h3>
        <Card variant="bordered" className="max-w-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-8 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><text x="8" y="16" fontSize="6" fill="white" textAnchor="middle">PDF</text></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Requirements.pdf</p>
                <p className="text-sm text-muted-foreground">248 KB</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Download">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}