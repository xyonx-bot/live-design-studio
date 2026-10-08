import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from './lib/utils'
import {
  ArrowLeft, Check, ChevronDown, ChevronRight,
  Component as ComponentIcon, Eye, Grid2X2, History, ImagePlus,
  LayoutTemplate, Maximize2, MessageSquareText, Monitor,
  PanelLeft, PanelRight, Search, Send,
  Smartphone, Sparkles, Tablet, WandSparkles, X,
} from 'lucide-react'

type ViewMode = 'single' | 'grid' | 'page'
type Device = 'desktop' | 'tablet' | 'mobile'

const DEVICE_WIDTHS: Record<Device, number> = { desktop: 1440, tablet: 768, mobile: 375 }

interface StageCfg { bg: string; wrapBg: string }
const STAGE_KEY = 'lds_stage'
const defaultStage: StageCfg = { bg: '#f3f0e8', wrapBg: '#1c1c22' }
function loadStage(canvasId: string): StageCfg {
  try { return { ...defaultStage, ...JSON.parse(localStorage.getItem(`${STAGE_KEY}:${canvasId}`) || '{}') } } catch { return defaultStage }
}
function saveStage(canvasId: string, s: StageCfg) { localStorage.setItem(`${STAGE_KEY}:${canvasId}` , JSON.stringify(s)) }

const STAGE_PRESETS: { name: string; bg: string }[] = [
  { name: 'Paper', bg: '#f3f0e8' },
  { name: 'White', bg: '#ffffff' },
  { name: 'Slate', bg: '#1e1e24' },
  { name: 'Ink', bg: '#0f0f12' },
  { name: 'Sage', bg: '#e9efe0' },
  { name: 'Transparent', bg: 'transparent' },
]

function StageControls({ stage }: { stage: StageCfg }) {
  const [open, setOpen] = useState(false)
  const setStage = (window as any).__ldsSetStage as ((s: StageCfg) => void) | undefined
  return (
    <span className="stage-ctl">
      <button className="toolbar-icon" onClick={() => setOpen(!open)} title="Stage background" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 12, height: 12, borderRadius: 2, background: stage.bg === 'transparent' ? 'repeating-conic-gradient(#555 0 25%, #999 0 50%) 0/6px 6px' : stage.bg, border: '1px solid #444' }} />
        BG
      </button>
      {open && (
        <div className="stage-menu">
          {STAGE_PRESETS.map((p) => (
            <button key={p.name} onClick={() => { setStage?.({ ...stage, bg: p.bg }); setOpen(false) }}>
              <span className="swatch" style={{ background: p.bg === 'transparent' ? 'repeating-conic-gradient(#555 0 25%, #999 0 50%) 0/6px 6px' : p.bg }} />
              {p.name}
            </button>
          ))}
          <label className="custom">
            <span>Custom</span>
            <input type="color" value={stage.bg.startsWith('#') ? stage.bg : '#f3f0e8'} onChange={(e) => setStage?.({ ...stage, bg: e.target.value })} />
          </label>
        </div>
      )}
    </span>
  )
}

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
const CANVAS_KEY = 'lds_canvas'
const getToken = () => localStorage.getItem(TOKEN_KEY)
const getSavedCanvas = () => localStorage.getItem(CANVAS_KEY) || 'default'
const saveCanvas = (id: string) => localStorage.setItem(CANVAS_KEY, id)

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

/**
 * Load a canvas's preview modules directly via /@fs/<abs>… (Vite transform on hit).
 * No static glob — pieces appear live as the agent writes them.
 */
function useCanvasPreviews(canvasId: string) {
  const [previews, setPreviews] = useState<Record<string, React.ComponentType>>({})
  const [htmlPieces, setHtmlPieces] = useState<Record<string, string>>({})

  const load = async () => {
    const found: Record<string, React.ComponentType> = {}
    const htmls: Record<string, string> = {}

    // canvas-scoped stylesheet — raw static path; set once per canvas, never cache-busted
    // (cache-bust each load = stylesheet unloads/reloads mid-frame → the collapse you saw)
    const linkId = 'canvas-globals'
    let link = document.getElementById(linkId) as HTMLLinkElement | null
    const want = `/canvases/${encodeURIComponent(canvasId)}/src/styles/globals.css`
    if (!link) {
      link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      document.head.appendChild(link)
    }
    if (link.dataset.canvasId !== canvasId) {
      link.dataset.canvasId = canvasId
      link.href = want
    }

    try {
      const res = await api(`/api/canvases/${encodeURIComponent(canvasId)}/pieces`)
      if (res.ok) {
        const pieces: { name: string; group: string; file: string; kind: 'tsx' | 'jsx' | 'html' }[] = await res.json()
        for (const p of pieces) {
          const key = `${p.group}:${p.name}`
          try {
            if (p.kind === 'html') {
              const r = await fetch(`/canvases/${encodeURIComponent(canvasId)}/src/${p.group}/${p.file}`)
              if (r.ok) htmls[key] = await r.text()
            } else {
              // /@fs/abs — no cache-bust; Vite serves the current module from its graph.
              const mod = await import(/* @vite-ignore */ `/@fs/app/canvases/${encodeURIComponent(canvasId)}/src/${p.group}/${p.file}`)
              if (mod?.default) found[key] = mod.default
            }
          } catch (e) {
            console.warn('preview load failed', key, e)
          }
        }
      }
    } catch { /* backend down */ }
    setPreviews(found)
    setHtmlPieces(htmls)
  }

  useEffect(() => { load() }, [canvasId])
  return { previews, htmlPieces, reload: load }
}

function LogoMark() {
  return <div className="logo-mark"><span /><span /><span /><span /></div>
}

function Sidebar({
  previews, htmlPreviews = {}, selected, setSelected,
}: {
  previews: Record<string, React.ComponentType>
  htmlPreviews?: Record<string, string>
  selected: string
  setSelected: (v: string) => void
}) {
  const allPreviews = useMemo(() => {
    const merged: Record<string, React.ComponentType> = { ...previews }
    for (const key of Object.keys(htmlPreviews)) {
      if (!merged[key]) merged[key] = () => null // placeholder so it lists; render handled by PreviewContent
    }
    return merged
  }, [previews, htmlPreviews])
  const pieceTotal = Object.keys(allPreviews).length
  const [open, setOpen] = useState<Record<string, boolean>>({ components: true, layout: true, sections: true })
  const toggle = (key: string) => setOpen((v) => ({ ...v, [key]: !v[key] }))

  const groups = useMemo(() => {
    const g: Record<string, string[]> = { components: [], layout: [], sections: [] }
    for (const name of Object.keys(allPreviews).sort()) {
      const [group] = name.includes(':') ? name.split(':') : ['components', name]
      ;(g[group] ??= []).push(name)
    }
    return g
  }, [allPreviews])

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
      <div className="library-search"><Search size={14} /><span>{pieceTotal} pieces</span><kbd>⌘ K</kbd></div>
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
        <span style={{ color: '#51515a', fontSize: 10, padding: '4px 8px' }}>{pieceTotal} pieces in workspace</span>
      </div>
    </aside>
  )
}

function PreviewCanvas({
  previews, htmlPreviews = {}, selected, device, setDevice, view, setSelected, stage,
}: {
  previews: Record<string, React.ComponentType>
  htmlPreviews?: Record<string, string>
  selected: string
  device: Device
  setDevice: (d: Device) => void
  view: ViewMode
  setSelected: (v: string) => void
  stage: StageCfg
}) {
  const label =
    selected === '__page__' ? 'Full page' : selected ? (selected.includes(':') ? selected.split(':')[1] : selected) : 'Nothing selected'

  return (
    <section className="preview-column">
      <div className="preview-toolbar">
        <div className="breadcrumbs">
          <ArrowLeft size={14} /><span>Preview</span><ChevronRight size={13} />
          <strong>{label}</strong>
        </div>
        <div className="toolbar-actions">
          <div className="device-toggle">
            {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([name, Icon]) => (
              <button key={name} aria-label={name} onClick={() => setDevice(name)} className={cn(device === name && 'active')} title={`${name} · ${DEVICE_WIDTHS[name]}px`}>
                <Icon size={15} />
              </button>
            ))}
          </div>
          <StageControls stage={stage} />
        </div>
      </div>
      <div className="canvas-wrap" style={{ background: stage.wrapBg }}>
        <ResizableFrame device={device} bg={stage.bg}>
          <PreviewContent previews={previews} htmlPreviews={htmlPreviews} selected={selected} view={view} setSelected={setSelected} device={device} />
        </ResizableFrame>
      </div>
      <div className="preview-footer">
        <span><span className="live-dot" /> Live preview connected</span>
        <span>{view === 'single' ? label : view === 'grid' ? `${Object.keys(previews).length + Object.keys(htmlPreviews).length} pieces` : 'Page view'}</span>
      </div>
    </section>
  )
}

/**
 * Renders children at the true device pixel width; scales down with transform
 * when the canvas area is narrower, so a 1440px section looks exactly like a
 * real 1440px browser. Scrolls only inside the frame.
 */
function ResizableFrame({ device, bg, children }: { device: Device; bg: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [frameH, setFrameH] = useState(600)
  const width = DEVICE_WIDTHS[device]

  useEffect(() => {
    const host = ref.current?.closest('.canvas-wrap') as HTMLElement | null
    if (!host) return
    const measure = () => {
      const avail = host.clientWidth - 50
      setScale(Math.min(1, avail / width))
      // stage height = real available height of the wrapper (accounting for scaled width)
      const availH = host.clientHeight - 50
      setFrameH(Math.round(availH / Math.min(1, avail / width)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(host)
    return () => ro.disconnect()
  }, [width])

  return (
    <div className="device-frame-scaler" style={{ width: width * scale, height: frameH * scale, overflow: 'hidden' }}>
      <div
        ref={ref}
        className="device-frame"
        style={{
          width,
          height: frameH,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          background: bg === 'transparent' ? 'transparent' : bg,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function PreviewContent({
  previews, htmlPreviews = {}, selected, view, setSelected,
}: {
  previews: Record<string, React.ComponentType>
  htmlPreviews?: Record<string, string>
  selected: string
  view: ViewMode
  setSelected: (v: string) => void
  device: Device
}) {
  const allNames = Object.keys({ ...previews, ...htmlPreviews }).sort()

  if (view === 'grid') {
    return (
      <div className="frame-real">
        {allNames.length === 0 ? (
          <EmptyStage text="Nothing here yet — ask the agent to create your first piece." />
        ) : (
          <div className="grid-stage" style={{ height: 'auto', minHeight: '100%', background: 'transparent' }}>
            {allNames.map((name) => (
              <div key={name} className={cn('grid-card', selected === name && 'selected')} onClick={() => setSelected(name)}>
                <div className="grid-card-bar" />
                <strong>{name.includes(':') ? name.split(':')[1] : name}</strong>
                <span>{name.split(':')[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (view === 'page' || selected === '__page__') {
    // Dynamic page order: headers first, then sections in library order, then footers.
    const names = allNames
    const headers = names.filter((n) => n.startsWith('layout:') && /header|nav/i.test(n))
    const footers = names.filter((n) => n.startsWith('layout:') && /footer/i.test(n))
    const sections = names.filter((n) => n.startsWith('sections:'))
    const order = [...headers, ...sections, ...footers]
    const any = order.length > 0
    return (
      <div className="page-stack">
        {any ? order.map((name) => <Piece key={name} name={name} previews={previews} htmlPreviews={htmlPreviews} inline />) : <EmptyStage text="No sections yet — ask the agent for a hero, a features section, a footer…" />}
      </div>
    )
  }

  if (!selected) return (
    <div className="frame-real centered">
      <EmptyStage text="Pick a piece from the library, or ask the agent to create one." />
    </div>
  )
  const isSection = selected.startsWith('sections:') || selected.startsWith('layout:')
  return (
    <div className={cn('frame-real', !isSection && 'centered')}>
      <Piece name={selected} previews={previews} htmlPreviews={htmlPreviews} />
    </div>
  )
}

function Piece({ name, previews, htmlPreviews = {}, inline }: { name: string; previews: Record<string, React.ComponentType>; htmlPreviews?: Record<string, string>; inline?: boolean }) {
  const C = previews[name]
  if (C) return <C />
  const html = htmlPreviews[name]
  if (html != null) {
    return (
      <iframe
        title={name}
        srcDoc={html}
        style={{ width: '100%', height: inline ? 'auto' : '100%', minHeight: inline ? 120 : '100%', border: 0, background: '#fff', display: 'block' }}
        sandbox="allow-same-origin"
      />
    )
  }
  return inline ? null : <EmptyStage text={`“${name.split(':')[1] ?? name}” isn't built yet — ask the agent to create it.`} />
}

function EmptyStage({ text }: { text: string }) {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 40, textAlign: 'center' }}>
      <div>
        <Sparkles size={28} color="#7c7d75" style={{ marginBottom: 12 }} />
        <p style={{ color: '#7c7d75', fontSize: 12, maxWidth: 320, lineHeight: 1.5 }}>{text}</p>
      </div>
    </div>
  )
}

function ActivityPanel({
  messages, activities, isLoading, loadingStartedAt, prompt, setPrompt, onSend, onClear, onRetry,
  currentModel, onModelChange, onImagePick, attachedImage,
}: {
  messages: ChatMessage[]
  activities: ActivityEvent[]
  isLoading: boolean
  loadingStartedAt?: number | null
  prompt: string
  setPrompt: (v: string) => void
  onSend: () => void
  onClear: () => void
  onRetry: () => void
  currentModel: string
  onModelChange: (m: string) => Promise<void>
  onImagePick?: (files: FileList | null) => void
  attachedImage?: File | null
}) {
  const [tab, setTab] = useState<'inbox' | 'activity'>('inbox')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, tab])

  // elapsed timer while a job runs
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!isLoading) return
    const t = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [isLoading])
  const elapsed = loadingStartedAt ? Math.max(0, Math.round((Date.now() - loadingStartedAt) / 1000)) : 0
  const longWait = elapsed > 45

  return (
    <aside className="activity-panel right-panel">
      <div className="panel-heading">
        <div>
          <div className="eyebrow-label">AGENT ACTIVITY</div>
          <h2>{tab === 'inbox' ? 'Agent inbox' : 'Building in real time'}</h2>
        </div>
        <div className={cn('agent-status', !isLoading && 'idle')}>
          <span className="pulse" /> {isLoading ? `Working · ${elapsed}s` : 'Idle'}
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
        {isLoading && longWait && (
          <div className="long-wait-note">
            Agent's still on it ({elapsed}s) — free models can take a minute. You can keep browsing; the reply lands in the inbox when done.
          </div>
        )}
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
          <span className="prompt-controls">
            <ModelPicker currentModel={currentModel} onChange={onModelChange} />
            <label className="attach" title="Attach image">
              <ImagePlus size={13} />
              <input type="file" accept="image/*" hidden onChange={(e) => onImagePick?.(e.target.files)} />
            </label>
            {attachedImage && <span className="attach-chip" title={attachedImage.name}>🖼 {attachedImage.name.slice(0, 18)}</span>}
          </span>
          <span><kbd>↵</kbd> to send</span>
          <span style={{ display: 'flex', gap: 6 }}>
            {isLoading && <button aria-label="Retry" onClick={onRetry} title="Retry last message" style={{ background: 'transparent', border: '1px solid #34343a', color: '#8b8a92', width: 'auto', padding: '0 8px', borderRadius: 4 }}>Retry</button>}
            <button aria-label="Clear chat" onClick={onClear} style={{ background: 'transparent', border: '1px solid #34343a', color: '#8b8a92', width: 'auto', padding: '0 8px', borderRadius: 4 }}><X size={13} /></button>
            <button aria-label="Send prompt" disabled={!prompt.trim() || isLoading} onClick={onSend}><Send size={15} /></button>
          </span>
        </div>
      </div>
    </aside>
  )
}

function ModelPicker({ currentModel, onChange }: { currentModel: string; onChange: (m: string) => Promise<void> }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const r = await api('/api/models')
    if (r.ok) {
      const d = await r.json()
      setOptions(d.models ?? [])
      setDraft(d.current ?? '')
    }
  }
  useEffect(() => { if (open) { void load(); setDraft(currentModel) } }, [open]) // eslint-disable-line

  const apply = async (m: string) => {
    if (!m.trim()) return
    setBusy(true); setError('')
    try {
      // validate against api_server list when available
      if (options.length && !options.includes(m)) {
        setError(`not in api_server list`)
        setBusy(false)
        return
      }
      await onChange(m.trim())
      setOpen(false)
    } catch (e) { setError(String(e)) } finally { setBusy(false) }
  }

  return (
    <span className="model-picker">
      <button type="button" onClick={() => setOpen(!open)} title="Set chat model">{currentModel || 'model'}</button>
      {open && (
        <div className="model-menu">
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="model id, e.g. hermes-agent"
            onKeyDown={(e) => { if (e.key === 'Enter') apply(draft); if (e.key === 'Escape') setOpen(false) }} />
          {error && <div className="model-error">{error}</div>}
          {options.length > 0 && (
            <div className="model-list">
              {options.slice(0, 30).map((o) => (
                <button key={o} type="button" className={cn(o === currentModel && 'active')} onClick={() => apply(o)}>{o}</button>
              ))}
            </div>
          )}
          <button disabled={busy || !draft.trim()} onClick={() => apply(draft)}>{busy ? 'Saving…' : 'Use model'}</button>
        </div>
      )}
    </span>
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
  const [canvasId, setCanvasId] = useState<string>(getSavedCanvas())
  const [canvases, setCanvases] = useState<{ id: string; name: string; archived?: boolean }[]>([])
  const [selected, setSelectedRaw] = useState<string>('')
  const [device, setDevice] = useState<Device>('desktop')
  const [view, setView] = useState<ViewMode>('single')
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCanvas, setShowNewCanvas] = useState(false)
  const [currentModel, setCurrentModel] = useState<string>('')
  const [stage, setStageInternal] = useState<StageCfg>(defaultStage)
  const [attachedImage, setAttachedImage] = useState<File | null>(null)
  const lastMessageRef = useRef<Record<string, string>>({})

  const { previews, htmlPieces, reload } = useCanvasPreviews(canvasId)

  // chat state scoped per canvas
  const messagesRef = useRef<Record<string, ChatMessage[]>>({})
  const sessionsRef = useRef<Record<string, string | null>>({})
  const [messageTick, setMessageTick] = useState(0)
  const messages = messagesRef.current[canvasId] ?? []
  const sessionId = sessionsRef.current[canvasId] ?? null
  const [activities, setActivities] = useState<ActivityEvent[]>([])

  const setMessagesFor = (id: string, fn: (m: ChatMessage[]) => ChatMessage[]) => {
    messagesRef.current[id] = fn(messagesRef.current[id] ?? [])
    setMessageTick((t) => t + 1)
  }
  void messageTick // rerender trigger

  // load canvas list once authed
  useEffect(() => {
    if (!authed) return
    api('/api/canvases').then(async (r) => {
      if (!r.ok) return
      const list = await r.json()
      setCanvases(list)
      // fresh load lands on default unless a saved canvas exists in the list
      let next = getSavedCanvas()
      if (!list.find((c: any) => c.id === next)) {
        next = list.find((c: any) => c.id === 'default')?.id ?? list[0]?.id ?? 'default'
      }
      switchCanvas(next, /* skip save */ true)
    }).catch(() => {})
  }, [authed]) // eslint-disable-line react-hooks/exhaustive-deps

  const setSelected = (name: string) => { setSelectedRaw(name); setView('single') }
  const jumpToPiece = (name: string) => { setSelectedRaw(name); setView('single') }

  // ── per-canvas session/status ────────────────────────────────────────────
  const loadingFor = useRef<Record<string, { jobId: string | null; startedAt: number }>>({})
  const [, setStatusTick] = useState(0)
  const loadStatus = loadingFor.current[canvasId] // {jobId, startedAt} | undefined

  // resume any running job + restore history whenever a canvas activates
  const hydrateCanvas = async (id: string) => {
    try {
      const r = await api(`/api/canvases/${encodeURIComponent(id)}/history`)
      if (!r.ok) return
      const data = await r.json()
      messagesRef.current[id] = (data.history ?? []).map((h: any) => ({ role: h.role, content: h.content, timestamp: new Date(h.timestamp) }))
      if (data.session_id) sessionsRef.current[id] = data.session_id
      if (data.model) setCurrentModel(data.model)
      setMessageTick((t) => t + 1)
      // resume polling an in-flight job
      if (data.running_job && loadingFor.current[id]?.jobId !== data.running_job.job_id) {
        loadingFor.current[id] = { jobId: data.running_job.job_id, startedAt: Date.parse(data.running_job.started_at + 'Z') || Date.now() }
        setIsLoading(true)
        setStatusTick((t) => t + 1)
        pollJob(id, data.running_job.job_id)
      } else {
        setIsLoading(!!loadingFor.current[id]?.jobId)
      }
    } catch { /* ignore */ }
  }

  const pollJob = async (cid: string, jobId: string) => {
    const deadline = Date.now() + 10 * 60 * 1000
    let delay = 1500
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, delay))
      const jr = await api(`/api/chat/jobs/${jobId}`)
      if (!jr.ok) { delay = Math.min(delay * 1.5, 8000); continue }
      const job = await jr.json()
      if (job.status === 'done' || job.status === 'error') {
        const reply = job.response || '(no response)'
        setMessagesFor(cid, (m) => [...m, { role: 'assistant', content: reply, timestamp: new Date() }])
        loadingFor.current[cid] = { jobId: null, startedAt: 0 }
        if (cid === canvasId) { setIsLoading(false); reload() }
        pushActivity({ title: 'Agent responded', detail: 'chat turn complete', state: 'success' })
        return
      }
      delay = Math.min(delay * 1.3, 6000)
      if (cid === canvasId) reload() // live pieces may land while job runs
      setStatusTick((t) => t + 1) // keep timer ticking for the Working · Ns label
    }
    // timed out waiting
    setMessagesFor(cid, (m) => [...m, { role: 'assistant', content: 'Agent is still working after 10 minutes — check back shortly, or press Retry below.', timestamp: new Date() }])
    loadingFor.current[cid] = { jobId: null, startedAt: 0 }
    if (cid === canvasId) setIsLoading(false)
  }

  const confirmNewCanvas = async (name: string) => {
    const res = await api('/api/canvases', { method: 'POST', body: JSON.stringify({ name: name || 'New canvas' }) })
    if (res.ok) {
      const c = await res.json()
      setCanvases((prev) => [...prev, c])
      switchCanvas(c.id)
    }
  }

  const switchCanvas = (id: string, save = true) => {
    if (id === canvasId) { void hydrateCanvas(id); return }
    setCanvasId(id)
    if (save) saveCanvas(id)
    setSelectedRaw('')
    setActivities([])
    setStage(loadStage(id))
    void hydrateCanvas(id)
  }
  const newCanvas = () => setShowNewCanvas(true)

  // stage setter exposed to StageControls (defined above App for hoistability)
  const setStage = (s: StageCfg) => { setStageInternal(s); saveStage(canvasId, s) }
  useEffect(() => { (window as any).__ldsSetStage = setStage; return () => { delete (window as any).__ldsSetStage } })
  useEffect(() => { setStageInternal(loadStage(canvasId)) }, [canvasId])

  // auth check
  useEffect(() => {
    const token = getToken()
    if (!token) { setAuthed(false); return }
    api('/api/auth/me').then((r) => setAuthed(r.ok)).catch(() => setAuthed(false))
  }, [])

  // WebSocket: live activity feed + auto-jump to the touched piece
  useEffect(() => {
    if (!authed) return
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    const token = getToken()
    const ws = new WebSocket(`${proto}://${location.host}/ws${token ? `?token=${token}` : ''}`)
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        if (msg.type === 'file_changed') {
          const p = msg.payload.path as string
          // only react to the active canvas's files
          const cv = p.match(/canvases\/([^/]+)\/src\/(components|sections|layout)\/([^/]+)\.preview\.tsx$/)
            ?? p.match(/canvases\/([^/]+)\/src\/(components|sections|layout)\/([^./]+)\.(tsx|jsx|html)$/)
          pushActivity({ title: `${msg.payload.action === 'edit' ? 'Editing' : msg.payload.action === 'delete' ? 'Deleted' : 'Wrote'} ${p.split('/').slice(-2).join('/')}`, detail: 'hot reload', state: 'working' })
          if (cv && cv[1] === canvasId) {
            jumpToPiece(`${cv[2]}:${cv[3]}`)
            reload()
          }
        } else if (msg.type === 'git_commit') {
          pushActivity({ title: 'Version saved', detail: msg.payload.message ?? msg.payload.sha, state: 'saved' })
          reload()
        }
      } catch { /* ignore */ }
    }
    return () => ws.close()
  }, [authed, canvasId]) // eslint-disable-line react-hooks/exhaustive-deps

  const pushActivity = (a: Omit<ActivityEvent, 'time'>) =>
    setActivities((prev) => [...prev.slice(-19), { ...a, time: new Date().toLocaleTimeString('en-GB') }])

  const sendMessage = async () => {
    const text = prompt.trim()
    if (!text || isLoading) return
    lastMessageRef.current[canvasId] = text
    setPrompt('')
    setIsLoading(true)
    loadingFor.current[canvasId] = { jobId: null, startedAt: Date.now() }

    // if an image is attached, upload it to R2 first and include the public URL
    let imageUrl: string | null = null
    if (attachedImage) {
      try {
        const fd = new FormData()
        fd.append('file', attachedImage)
        fd.append('canvas_id', canvasId)
        const upRes = await api('/api/uploads', { method: 'POST', body: fd })
        const up = await upRes.json()
        imageUrl = up.url
      } catch (e) {
        setMessagesFor(canvasId, (m) => [...m, { role: 'assistant', content: `Upload failed: ${e instanceof Error ? e.message : 'upload error'}`, timestamp: new Date() }])
        setIsLoading(false)
        loadingFor.current[canvasId] = { jobId: null, startedAt: 0 }
        return
      }
    }

    setMessagesFor(canvasId, (m) => [...m, { role: 'user', content: text + (imageUrl ? `\n\n[${attachedImage?.name}](${imageUrl})` : ''), timestamp: new Date() }])
    try {
      const res = await api('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, image_url: imageUrl, session_id: sessionId, canvas_id: canvasId }),
      })
      setAttachedImage(null)
      const start = await res.json()
      const jobId = start.session_id
      if (!jobId) throw new Error(start.response || 'no job id')

      // the backend may pick/own a canvas for the turn (e.g. "next-biz"); follow it so
      // the visible library + chat always match what the agent actually wrote
      const backendCanvas = start.canvas_id
      if (backendCanvas && backendCanvas !== canvasId) {
        switchCanvas(backendCanvas)
      }

      sessionsRef.current[backendCanvas ?? canvasId] = jobId
      loadingFor.current[backendCanvas ?? canvasId] = { jobId, startedAt: Date.now() }
      void pollJob(backendCanvas ?? canvasId, jobId)
    } catch (err) {
      loadingFor.current[canvasId] = { jobId: null, startedAt: 0 }
      setIsLoading(false)
      setMessagesFor(canvasId, (m) => [...m, { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'failed'}`, timestamp: new Date() }])
    }
  }

  const setModel = async (m: string) => {
    await api(`/api/canvases/${encodeURIComponent(canvasId)}/model`, { method: 'POST', body: JSON.stringify({ model: m }) })
    setCurrentModel(m)
  }

  const retry = () => {
    const last = lastMessageRef.current[canvasId]
    if (!last || isLoading) return
    setPrompt(last)
    // send on next tick after prompt update
    setTimeout(sendMessage, 0)
  }

  const clearChat = async () => {
    const sid = sessionsRef.current[canvasId]
    if (sid) await api('/api/chat/reset', { method: 'POST', body: JSON.stringify({ session_id: sid, canvas_id: canvasId }) }).catch(() => {})
    messagesRef.current[canvasId] = []
    sessionsRef.current[canvasId] = null
    setMessageTick((t) => t + 1)
  }

  if (authed === null) return null
  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  const viewLabel = view === 'single' ? 'Single view' : view === 'grid' ? 'Grid view' : 'Page view'
  const pieceCount = Object.keys(previews).length + Object.keys(htmlPieces).length

  return (
    <main className="studio-shell">
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-toggle" onClick={() => setShowLeft(!showLeft)}><PanelLeft size={16} /></button>
          <button className="project-title"><span className="project-status" /> <span>Live Design Studio</span></button>
          <span className="slash">/</span>
          <div className="canvas-switcher">
            <select value={canvasId} onChange={(e) => switchCanvas(e.target.value)} title="Active canvas">
              {canvases.filter((c) => !c.archived).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button onClick={newCanvas} title="New canvas">+ New</button>
          </div>
        </div>
        <div className="topbar-center">
          <div className="view-switcher">
            <button onClick={() => setView('single')} className={cn(view === 'single' && 'active')}><Eye size={14} /> Single</button>
            <button onClick={() => setView('grid')} className={cn(view === 'grid' && 'active')}><Grid2X2 size={14} /> Grid</button>
            <button onClick={() => { setView('page'); setSelectedRaw('__page__') }} className={cn(view === 'page' && 'active')}><LayoutTemplate size={14} /> Page</button>
          </div>
        </div>
        <div className="topbar-right">
          <span className="saved"><Check size={13} /> {pieceCount} pieces</span>
          <button className="share-button" onClick={() => { localStorage.removeItem(TOKEN_KEY); setAuthed(false) }}>Sign out</button>
          <button className="mobile-toggle" onClick={() => setShowRight(!showRight)}><PanelRight size={16} /></button>
        </div>
      </header>
      <div className="workspace">
        <div className={cn('panel-slot', !showLeft && 'hidden-panel')}>
          <Sidebar previews={previews} htmlPreviews={htmlPieces} selected={selected} setSelected={setSelected} />
        </div>
        <div className="main-stage">
          <div className="stage-topline"><span>{viewLabel}</span><span>⌘ ⇧ F <Maximize2 size={12} /></span></div>
          <PreviewCanvas previews={previews} htmlPreviews={htmlPieces} selected={selected} device={device} setDevice={setDevice} view={view} setSelected={setSelected} stage={stage} />
        </div>
        <div className={cn('panel-slot right-slot', !showRight && 'hidden-panel')}>
          <ActivityPanel
            messages={messages}
            activities={activities}
            isLoading={isLoading}
            loadingStartedAt={loadStatus?.startedAt ?? null}
            prompt={prompt}
            setPrompt={setPrompt}
            onSend={sendMessage}
            onClear={clearChat}
            onRetry={retry}
            currentModel={currentModel}
            onModelChange={setModel}
            attachedImage={attachedImage}
            onImagePick={(files) => setAttachedImage(files?.[0] ?? null)}
          />
        </div>
      </div>
      {showNewCanvas && (
        <NewCanvasModal onClose={() => setShowNewCanvas(false)} onCreate={confirmNewCanvas} />
      )}
    </main>
  )
}

function NewCanvasModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => Promise<void> }) {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>New canvas</h3>
        <p className="modal-sub">Each canvas keeps its own pieces, chat and style tokens.</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Acme landing, NextBizStudio…"
          onKeyDown={(e) => { if (e.key === 'Enter' && !busy) { setBusy(true); onCreate(name || 'New canvas').finally(onClose) } if (e.key === 'Escape') onClose() }}
        />
        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>Cancel</button>
          <button disabled={busy} onClick={() => { setBusy(true); onCreate(name || 'New canvas').finally(onClose) }}>{busy ? 'Creating…' : 'Create canvas'}</button>
        </div>
      </div>
    </div>
  )
}
