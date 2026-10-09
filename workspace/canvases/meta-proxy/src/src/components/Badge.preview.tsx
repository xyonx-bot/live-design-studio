import { Badge } from './Badge'

export default function BadgePreview() {
  return (
    <div className="p-8 space-y-8" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Variants (md)</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h3>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Badge variant="default" size="sm">Small</Badge>
            <Badge variant="success" size="sm">Small</Badge>
            <Badge variant="warning" size="sm">Small</Badge>
          </div>
          <div className="flex gap-2">
            <Badge variant="default" size="md">Medium</Badge>
            <Badge variant="success" size="md">Medium</Badge>
            <Badge variant="warning" size="md">Medium</Badge>
          </div>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Removable</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default" removable onRemove={() => alert('removed')}>Lead</Badge>
          <Badge variant="success" removable onRemove={() => alert('removed')}>Customer</Badge>
          <Badge variant="warning" removable onRemove={() => alert('removed')}>Inquiry</Badge>
          <Badge variant="info" removable onRemove={() => alert('removed')}>Instagram Ad</Badge>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With counts (filter tabs style)</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">All <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-muted rounded-full">12</span></Badge>
          <Badge variant="outline">Unread <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-muted rounded-full">4</span></Badge>
          <Badge variant="outline">My Chats <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-muted rounded-full">3</span></Badge>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Status pills</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Connected</Badge>
          <Badge variant="warning">Connecting</Badge>
          <Badge variant="danger">Disconnected</Badge>
          <Badge variant="info">Pending</Badge>
        </div>
      </section>
    </div>
  )
}