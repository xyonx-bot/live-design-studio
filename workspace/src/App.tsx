import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from './lib/utils'
import {
  ArrowLeft, Check, ChevronDown, ChevronRight,
  Component as ComponentIcon, Eye, Grid2X2, History,
  LayoutTemplate, Maximize2, MessageSquareText, Monitor,
  PanelLeft, PanelRight, Search, Send, Settings2,
  Smartphone, Sparkles, Tablet, WandSparkles, X,
} from 'lucide-react'

type ViewMode = 'single' | 'grid' | 'page'
type Device = 'desktop' | 'tablet' | 'mobile'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  tools_used?: string[]
}

interface ActivityEvent {
  time: string
  title: string
  detail: string
  state: 'success' | 'working' | 'saved'
}

/* ── auth ──────────────────────────────────────────────────────── */
const TOKEN_KEY = 'lds_token'
const getToken = () => localStorage.getItem(TOKEN_KEY)

async function api(path: string, init: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(path, { ...init, headers })
}

/* ── static library metadata (matches v0 template) ─────────────── */
const TYPE_META: Record<string, { icon: any; color: string }> = {
  components: { icon: ComponentIcon, color: 'lime' },
  layout: { icon: PanelLeft, color: 'pink' },
  sections: { icon: WandSparkles, color: 'blue' },
}
const COLORS = ['lime', 'blue', 'orange', 'purple', 'pink', 'slate']

function LogoMark() {
  return <div className="logo-mark"><span /><span /><span /><span /></div>
}

function Sidebar({
  previews, selected, setSelected,
}: {
  previews: Record<string, React.ComponentType>
  selected: string
  setSelected: (v: string) => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ components: true, layout: true, sections: true })
  const toggle = (key: string) => setOpen((v) => ({ ...v, [key]: !v[key] }))

  const groups = useMemo(() => {
    const g: Record<string, string[]> = { components: [], layout: [], sections: [] }
    for (const name of Object.keys(previews).sort()) {
      const [group, item] = name.includes(':') ? name.split(':') : ['components', name]
      ;(g[group] ??= []).push(item)
      // keep full name for lookup
      g[group][g[group].length - 1] = name
    }
    return g
  }, [previews])

  const label = (name: string) => (name.includes(':') ? name.split(':')[1] : name)

  let colorIdx = 0
  const renderItem = (name: string) => {
    const meta = TYPE_META[name.split(':')[0]] ?? TYPE_META.components
    const color = COLORS[colorIdx++ % COLORS.length]
    return (
      <button
        key={name}
        onClick={() => setSelected(name)}
        className={cn('library-item', selected === name && 'selected')}
      >
        <span className={cn('item-icon', `tone-${meta.color ?? color}`)}>
          <meta.icon size={14} />
        </span>
        <span>{label(name)}</span>
        <span className="item-state">Ready</span>
      </button>
    )
  }

  return (
    <aside className="sidebar left-panel">
      <div className="brand-row">
        <LogoMark />
        <div>
          <div className="brand-name">live / studio</div>
          <div className="brand-meta">private workspace</div>
        </div>
      </div>
      <div className="sidebar-label">Preview library</div>
      <div className="library-search"><Search size={14} /><span>{Object.keys(previews).length} pieces</span><kbd>⌘ K</kbd></div>
      <div className="library-list">
        {(['components', 'layout', 'sections'] as const).map((group) => (
          <div key={group}>
            <div className="group-heading" onClick={() => toggle(group)}>
              <ChevronDown className={cn('chevron', !open[group] && '-rotate-90')} size={14} />
              <span style={{ textTransform: 'capitalize' }}>{group}</span>
              <span className="count">{String(groups[group]?.length ?? 0).padStart(2, '0')}</span>
            </div>
            {open[group] && (groups[group] ?? []).map(renderItem)}
          </div>
        ))}
      </div>
      <div className="sidebar-bottom">
        <button><History size={15} /> Version history</button>
        <button><Settings2 size={15} /> Workspace settings</button>
      </div>
    </aside>
  )
}

function PreviewCanvas({
  previews, selected, device, setDevice, view, setSelected,
}: {
  previews: Record<string, React.ComponentType>
  selected: string
  device: Device
  setDevice: (d: Device) => void
  view: ViewMode
  setSelected: (v: string) => void
}) {
  return (
    <section className="preview-column">
      <div className="preview-toolbar">
        <div className="breadcrumbs">
          <ArrowLeft size={14} /><span>Preview</span><ChevronRight size={13} />
          <strong>{selected === '__page__' ? 'Full page' : (selected.includes(':') ? selected.split(':')[1] : selected)}</strong>
        </div>
        <div className="toolbar-actions">
          <div className="device-toggle">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([name, Icon]) => (
              <button key={name} aria-label={name} onClick={() => setDevice(name)} className={cn(device === name && 'active')}>
                <Icon size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="canvas-wrap">
        <div className={cn('device-frame', `device-${device}`)}>
          <div className="frame-top">
            <span className="traffic"><i /><i /><i /></span>
            <span className="frame-url">preview.local / {(selected ?? 'page').toLowerCase().replace(':', ' / ')}</span>
            <span className="frame-dots">•••</span>
          </div>
          <PreviewContent previews={previews} selected={selected} view={view} setSelected={setSelected} />
        </div>
      </div>
      <div className="preview-footer">
        <span><span className="live-dot" /> Live preview connected</span>
        <span>Vite HMR · hot reload</span>
      </div>
    </section>
  )
}

function PreviewContent({
  previews, selected, view, setSelected,
}: {
  previews: Record<string, React.ComponentType>
  selected: string
  view: ViewMode
  setSelected: (v: string) => void
}) {
  if (view === 'grid') {
    return (
      <div className="frame-real">
        <div className="grid-stage" style={{ height: 'auto', minHeight: '100%', background: 'transparent' }}>
          {Object.keys(previews).sort().map((name) => (
            <div key={name} className={cn('grid-card', selected === name && 'selected')} onClick={() => setSelected(name)}>
              <div className="grid-card-bar" />
              <strong>{name.includes(':') ? name.split(':')[1] : name}</strong>
              <span>{name.split(':')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (view === 'page' || selected === '__page__') {
    const order = ['layout:Header', 'sections:Hero', 'sections:Features', 'layout:Footer']
    return (
      <div className="page-stack">
        {order.map((name) => {
          const C = previews[name]
          return C ? <C key={name} /> : null
        })}
      </div>
    )
  }

  const C = previews[selected]
  if (!C) {
    return (
      <div className="frame-real centered">
        <div className="stage-label">Nothing selected</div>
        <p style={{ color: '#7c7d75', fontSize: 12 }}>Pick a piece from the library, or ask the agent to create one.</p>
      </div>
    )
  }
  const isSection = selected.startsWith('sections:') || selected.startsWith('layout:')
  return (
    <div className={cn('frame-real', !isSection && 'centered')}>
      {!isSection && <div className="stage-label">{selected.replace(':', ' / ')}</div>}
      <C />
    </div>
  )
}

function ActivityPanel({
  messages, activities, isLoading, prompt, setPrompt, onSend, onClear,
}: {
  messages: ChatMessage[]
  activities: ActivityEvent[]
  isLoading: boolean
  prompt: string
  setPrompt: (v: string) => void
  onSend: () => void
  onClear: () => void
}) {
  const [tab, setTab] = useState<'inbox' | 'activity'>('inbox')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, tab])

  return (
    <aside className="activity-panel right-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow-label">AGENT ACTIVITY</div>
          <h2>{tab === 'inbox' ? 'Agent inbox' : 'Building in real time'}</h2>
        </div>
        <div className={cn('agent-status', !isLoading && 'idle')}>
          <span className="pulse" /> {isLoading ? 'Working' : 'Idle'}
        </div>
      </div>
      <div className="inbox-tabs" role="tablist">
        <button className={cn(tab === 'inbox' && 'active')} onClick={() => setTab('inbox')} role="tab">
          <MessageSquareText size={13} /> Inbox <span>{messages.length}</span>
        </button>
        <button className={cn(tab === 'activity' && 'active')} onClick={() => setTab('activity')} role="tab">
          <History size={13} /> Activity
        </button>
      </div>

      {tab === 'inbox' ? (
        <div className="chat-inbox" role="tabpanel">
          {messages.length === 0 && (
            <div className="chat-message agent">
              <div className="chat-avatar"><Sparkles size={12} /></div>
              <div className="chat-bubble">
                <div className="chat-meta">Agent</div>
                <p>Ready. Describe a component or section and I'll build it live in the workspace.</p>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={cn('chat-message', m.role === 'user' ? 'user' : 'agent')}>
              <div className="chat-avatar">{m.role === 'user' ? 'U' : <Sparkles size={12} />}</div>
              <div className="chat-bubble">
                <div className="chat-meta">{m.role === 'user' ? 'You' : 'Agent'} <time>{m.timestamp.toLocaleTimeString()}</time></div>
                <p>{m.content}</p>
                {m.tools_used && m.tools_used.length > 0 && (
                  <div className="tools">{m.tools_used.map((t, j) => <span key={j}>{t}</span>)}</div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      ) : (
        <div className="activity-feed">
          {activities.length === 0 && <div className="activity-copy" style={{ color: '#676770', fontSize: 11, padding: '12px 0' }}>No activity yet — file changes will appear here live.</div>}
          {activities.map((a, i) => (
            <div className={cn('activity', i === activities.length - 1 && 'current')} key={i}>
              <div className={cn('activity-marker', a.state)}>{a.state === 'success' ? <Check size={11} /> : a.state === 'working' ? <span /> : <History size={11} />}</div>
              <div className="activity-copy">
                <div className="activity-title">{a.title}{i === activities.length - 1 && <span className="now">now</span>}</div>
                <div className="activity-detail">{a.detail}</div>
              </div>
              <time>{a.time}</time>
            </div>
          ))}
        </div>
      )}

      <div className="prompt-box">
        <div className="prompt-label"><WandSparkles size={14} /> Ask for a change</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Message the agent..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault()
              onSend()
            }
          }}
        />
        <div className="prompt-actions">
          <span><kbd>↵</kbd> to send</span>
          <span style={{ display: 'flex', gap: 6 }}>
            <button aria-label="Clear chat" onClick={onClear} style={{ background: 'transparent', border: '1px solid #34343a', color: '#8b8a92', width: 'auto', padding: '0 8px', borderRadius: 4 }}><X size={13} /></button>
            <button aria-label="Send prompt" disabled={!prompt.trim() || isLoading} onClick={onSend}><Send size={15} /></button>
          </span>
        </div>
      </div>
    </aside>
  )
}

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      const body = new URLSearchParams({ username, password })
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? `Login failed (${res.status})`)
      const data = await res.json()
      localStorage.setItem(TOKEN_KEY, data.access_token)
      onLogin(data.access_token)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-row" style={{ padding: '0 0 16px' }}>
          <LogoMark />
          <div>
            <div className="brand-name">live / studio</div>
            <div className="brand-meta">private workspace</div>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" autoFocus />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        <button type="submit" disabled={busy || !username || !password}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [selected, setSelectedRaw] = useState<string>('sections:Hero')
  const [device, setDevice] = useState<Device>('desktop')
  const [view, setView] = useState<ViewMode>('single')
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const setSelected = (name: string) => { setSelectedRaw(name); setView('single') }

  // Auto-discover preview components
  const previews = useMemo(() => {
    const modules = (import.meta as any).glob('./**/*.preview.tsx', { eager: true })
    const discovered: Record<string, React.ComponentType> = {}
    for (const [path, mod] of Object.entries(modules)) {
      const m = mod as { default?: React.ComponentType }
      const name = path.replace('./', '').replace('.preview.tsx', '').replace(/\//g, ':')
      if (m.default) discovered[name] = m.default
    }
    return discovered
  }, [])

  // auth check
  useEffect(() => {
    const token = getToken()
    if (!token) { setAuthed(false); return }
    api('/api/auth/me').then((r) => setAuthed(r.ok)).catch(() => setAuthed(false))
  }, [])

  // WebSocket: live activity feed
  useEffect(() => {
    if (!authed) return
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    const token = getToken()
    const ws = new WebSocket(`${proto}://${location.host}/ws${token ? `?token=${token}` : ''}`)
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'file_changed') {
          pushActivity({ title: `${msg.payload.action === 'edit' ? 'Editing' : msg.payload.action === 'delete' ? 'Deleted' : 'Wrote'} ${msg.payload.path}`, detail: 'hot reload triggered', state: 'working' })
        } else if (msg.type === 'git_commit') {
          pushActivity({ title: 'Version saved', detail: msg.payload.message ?? msg.payload.sha, state: 'saved' })
        }
      } catch { /* ignore */ }
    }
    return () => ws.close()
  }, [authed])

  const pushActivity = (a: Omit<ActivityEvent, 'time'>) =>
    setActivities((prev) => [...prev.slice(-19), { ...a, time: new Date().toLocaleTimeString('en-GB') }])

  const sendMessage = async () => {
    const text = prompt.trim()
    if (!text || isLoading) return
    setPrompt('')
    setIsLoading(true)
    setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: new Date() }])
    try {
      const res = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, session_id: sessionId }),
      })
      const data = await res.json()
      if (data.session_id) setSessionId(data.session_id)
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.response ?? 'No response',
        timestamp: new Date(),
        tools_used: data.tools_used,
      }])
      pushActivity({ title: 'Agent responded', detail: 'chat turn complete', state: 'success' })
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'failed'}`, timestamp: new Date() }])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => { setMessages([]); setSessionId(null) }

  if (authed === null) return null
  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const viewLabel = view === 'single' ? 'Single view' : view === 'grid' ? 'Grid view' : 'Page view'

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-toggle" onClick={() => setShowLeft(!showLeft)}><PanelLeft size={16} /></button>
          <button className="project-title"><span className="project-status" /> <span>Live Design Studio</span></button>
          <span className="slash">/</span>
          <span className="project-subtitle">Design system</span>
        </div>
        <div className="topbar-center">
          <div className="view-switcher">
            <button onClick={() => setView('single')} className={cn(view === 'single' && 'active')}><Eye size={14} /> Single</button>
            <button onClick={() => setView('grid')} className={cn(view === 'grid' && 'active')}><Grid2X2 size={14} /> Grid</button>
            <button onClick={() => { setView('page'); setSelectedRaw('__page__') }} className={cn(view === 'page' && 'active')}><LayoutTemplate size={14} /> Page</button>
          </div>
        </div>
        <div className="topbar-right">
          <span className="saved"><Check size={13} /> {Object.keys(previews).length} pieces</span>
          <button className="share-button" onClick={() => { localStorage.removeItem(TOKEN_KEY); setAuthed(false) }}>Sign out</button>
          <button className="mobile-toggle" onClick={() => setShowRight(!showRight)}><PanelRight size={16} /></button>
        </div>
      </header>
      <div className="workspace">
        <div className={cn('panel-slot', !showLeft && 'hidden-panel')}>
          <Sidebar previews={previews} selected={selected} setSelected={setSelected} />
        </div>
        <div className="main-stage">
          <div className="stage-topline"><span>{viewLabel}</span><span>⌘ ⇧ F <Maximize2 size={12} /></span></div>
          <PreviewCanvas previews={previews} selected={selected} device={device} setDevice={setDevice} view={view} setSelected={setSelected} />
        </div>
        <div className={cn('panel-slot right-slot', !showRight && 'hidden-panel')}>
          <ActivityPanel
            messages={messages}
            activities={activities}
            isLoading={isLoading}
            prompt={prompt}
            setPrompt={setPrompt}
            onSend={sendMessage}
            onClear={clearChat}
          />
        </div>
      </div>
    </main>
  )
}
