import { useState } from 'react'
import { Input, SearchInput } from './Input'

export default function InputPreview() {
  const [searchValue, setSearchValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  return (
    <div className="p-8 space-y-8 max-w-2xl" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Basic Input</h3>
        <Input
          placeholder="Enter your name"
          value=""
          onChange={() => {}}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With label and hint</h3>
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          hint="We'll never share your email"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With error state</h3>
        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          error="Password must be at least 8 characters"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With left icon</h3>
        <Input
          label="Website"
          type="url"
          placeholder="https://example.com"
          leftIcon={
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
          }
          hint="Include https://"
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">With right icon (password toggle)</h3>
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          rightIcon={
            <svg className="h-4 w-4 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          }
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">SearchInput (with clear)</h3>
        <SearchInput
          placeholder="Search conversations, contacts, tags..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => setSearchValue('')}
        />
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Disabled state</h3>
        <div className="flex gap-4">
          <Input placeholder="Disabled input" disabled />
          <Input placeholder="Disabled with value" value="Can't edit" disabled />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Required field</h3>
        <Input
          label="Full name"
          placeholder="John Doe"
          required
        />
      </section>
    </div>
  )
}