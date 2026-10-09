import { Avatar, AvatarGroup } from './Avatar'

export default function AvatarPreview() {
  return (
    <div className="p-8 space-y-8" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Sizes</h3>
        <div className="flex items-end gap-4">
          <Avatar fallback="JD" size="xs" />
          <Avatar fallback="JD" size="sm" />
          <Avatar fallback="JD" size="md" />
          <Avatar fallback="JD" size="lg" />
          <Avatar fallback="JD" size="xl" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With images</h3>
        <div className="flex items-end gap-4">
          <Avatar src="https://i.pravatar.cc/150?u=1" alt="User 1" size="md" />
          <Avatar src="https://i.pravatar.cc/150?u=2" alt="User 2" size="lg" />
          <Avatar src="https://i.pravatar.cc/150?u=3" alt="User 3" size="xl" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Fallback initials</h3>
        <div className="flex items-end gap-4">
          <Avatar fallback="RS" size="md" />
          <Avatar fallback="PT" size="md" />
          <Avatar fallback="AC" size="md" />
          <Avatar fallback="SB" size="md" />
          <Avatar fallback="UB" size="md" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Square shape</h3>
        <div className="flex items-end gap-4">
          <Avatar fallback="RS" size="md" shape="square" />
          <Avatar fallback="PT" size="lg" shape="square" />
          <Avatar src="https://i.pravatar.cc/150?u=4" alt="User 4" size="xl" shape="square" />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">AvatarGroup (stacked)</h3>
        <div className="flex items-center gap-6">
          <AvatarGroup max={4}>
            <Avatar fallback="RS" size="md" />
            <Avatar fallback="PT" size="md" />
            <Avatar fallback="AC" size="md" />
            <Avatar fallback="SB" size="md" />
            <Avatar fallback="UB" size="md" />
            <Avatar fallback="KM" size="md" />
          </AvatarGroup>
          <AvatarGroup max={3}>
            <Avatar src="https://i.pravatar.cc/150?u=1" alt="User 1" size="md" />
            <Avatar src="https://i.pravatar.cc/150?u=2" alt="User 2" size="md" />
            <Avatar src="https://i.pravatar.cc/150?u=3" alt="User 3" size="md" />
            <Avatar src="https://i.pravatar.cc/150?u=4" alt="User 4" size="md" />
          </AvatarGroup>
        </div>
      </section>
    </div>
  )
}