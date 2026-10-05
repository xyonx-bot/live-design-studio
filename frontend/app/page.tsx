'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownToLine,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  Component,
  Eye,
  FileCode2,
  Folder,
  Grid2X2,
  History,
  LayoutTemplate,
  Maximize2,
  MessageSquareText,
  Monitor,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Play,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type ViewMode = 'single' | 'grid' | 'page'
type Device = 'desktop' | 'tablet' | 'mobile'

const components = [
  { name: 'Button', type: 'Component', icon: Component, color: 'lime', status: 'Ready' },
  { name: 'Input', type: 'Component', icon: Code2, color: 'blue', status: 'Ready' },
  { name: 'Badge', type: 'Component', icon: Sparkles, color: 'orange', status: 'Ready' },
  { name: 'Card', type: 'Component', icon: LayoutTemplate, color: 'purple', status: 'Ready' },
  { name: 'Header', type: 'Layout', icon: PanelLeft, color: 'pink', status: 'Ready' },
  { name: 'Footer', type: 'Layout', icon: PanelRight, color: 'slate', status: 'Ready' },
]

const sections = [
  { name: 'Hero', icon: WandSparkles, color: 'lime', children: ['Announcement', 'Primary CTA'] },
  { name: 'Features', icon: Grid2X2, color: 'blue', children: ['Feature grid', 'Feature detail'] },
  { name: 'Pricing', icon: Zap, color: 'orange', children: ['Plans', 'Comparison'] },
  { name: 'Testimonials', icon: MessageSquareText, color: 'purple', children: ['Quote', 'Logo wall'] },
  { name: 'FAQ', icon: CircleHelp, color: 'pink', children: ['Questions', 'Contact prompt'] },
]

const pages = [
  { name: 'Landing page', path: '/', icon: LayoutTemplate },
  { name: 'Pricing page', path: '/pricing', icon: Zap },
  { name: 'Documentation', path: '/docs', icon: FileCode2 },
]

const activities = [
  { time: '10:42:18', title: 'Preview updated', detail: 'Hero.tsx · hot reload complete', state: 'success' },
  { time: '10:42:15', title: 'Editing Hero.tsx', detail: 'Adjusting headline rhythm and spacing', state: 'working' },
  { time: '10:41:52', title: 'Screenshot captured', detail: 'desktop · 1440 × 900', state: 'success' },
  { time: '10:41:27', title: 'Build passed', detail: '0 errors · 3 warnings', state: 'success' },
  { time: '10:40:09', title: 'Version saved', detail: 'Initial studio exploration', state: 'saved' },
]

function demoAction(label: string) {
  if (typeof window !== 'undefined') window.alert(`${label} demo action`)
}

function LogoMark() {
  return <div className="logo-mark"><span /><span /><span /><span /></div>
}

function Sidebar({ selected, setSelected }: { selected: string; setSelected: (value: string) => void }) {
  const [open, setOpen] = useState({ components: true, layout: true, sections: true })
  const toggle = (key: keyof typeof open) => setOpen((value) => ({ ...value, [key]: !value[key] }))
  return (
    <aside className="sidebar left-panel">
      <div className="brand-row">
        <LogoMark />
        <div><div className="brand-name">live / studio</div><div className="brand-meta">private workspace</div></div>
      </div>
      <button className="workspace-switcher" onClick={() => demoAction('Workspace switcher')}><div className="workspace-dot" /><span>acme / design-system</span><ChevronDown size={14} /></button>
      <div className="sidebar-label">Preview library <button aria-label="Add component" onClick={() => demoAction('Add component')}><Plus size={14} /></button></div>
      <div className="library-search"><Search size={14} /><span>Search pieces...</span><kbd>⌘ K</kbd></div>
      <div className="library-list">
        <div className="group-heading" onClick={() => toggle('components')}><ChevronDown className={cn('chevron', !open.components && '-rotate-90')} size={14} /><span>Components</span><span className="count">04</span></div>
        {open.components && components.slice(0, 4).map((item) => <LibraryItem key={item.name} item={item} selected={selected} setSelected={setSelected} />)}
        <div className="group-heading" onClick={() => toggle('layout')}><ChevronDown className={cn('chevron', !open.layout && '-rotate-90')} size={14} /><span>Layout</span><span className="count">02</span></div>
        {open.layout && components.slice(4).map((item) => <LibraryItem key={item.name} item={item} selected={selected} setSelected={setSelected} />)}
        <div className="group-heading" onClick={() => toggle('sections')}><ChevronDown className={cn('chevron', !open.sections && '-rotate-90')} size={14} /><span>Sections</span><span className="count">05</span></div>
        {open.sections && sections.map((item) => <div key={item.name} className="nested-library-item"><LibraryItem item={item} selected={selected} setSelected={setSelected} />{selected === item.name && item.children?.map((child: string) => <button key={child} className="library-child" onClick={() => setSelected(child)}><span className="child-mark" />{child}</button>)}</div>)}
        <div className="group-heading"><ChevronDown size={14} /><span>Pages</span><span className="count">03</span></div>
        {pages.map((item) => <LibraryItem key={item.name} item={{ ...item, type: 'Page', color: 'slate' }} selected={selected} setSelected={setSelected} />)}
      </div>
      <div className="sidebar-bottom"><button onClick={() => demoAction('Version history')}><History size={15} /> Version history <span>⌘ H</span></button><button onClick={() => demoAction('Workspace settings')}><Settings2 size={15} /> Workspace settings</button></div>
    </aside>
  )
}

function LibraryItem({ item, selected, setSelected }: { item: any; selected: string; setSelected: (value: string) => void }) {
  const Icon = item.icon
  return <button onClick={() => setSelected(item.name)} className={cn('library-item', selected === item.name && 'selected')}><span className={cn('item-icon', `tone-${item.color}`)}><Icon size={14} /></span><span>{item.name}</span><span className="item-state">{item.status || 'Ready'}</span></button>
}

function PreviewCanvas({ selected, device, setDevice, view }: { selected: string; device: Device; setDevice: (value: Device) => void; view: ViewMode }) {
  return <section className="preview-column">
    <div className="preview-toolbar"><div className="breadcrumbs"><ArrowLeft size={14} /><span>Preview</span><ChevronRight size={13} /><strong>{selected}</strong></div><div className="toolbar-actions"><div className="device-toggle">{([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([name, Icon]) => <button key={name} aria-label={name} onClick={() => setDevice(name)} className={cn(device === name && 'active')}><Icon size={15} /></button>)}</div><button className="toolbar-icon" onClick={() => demoAction('Fullscreen preview')} aria-label="Fullscreen preview"><Maximize2 size={15} /></button><button className="toolbar-icon" onClick={() => demoAction('Preview menu')} aria-label="Preview menu"><MoreHorizontal size={16} /></button></div></div>
    <div className="canvas-wrap"><div className={cn('device-frame', `device-${device}`)}><div className="frame-top"><span className="traffic"><i /><i /><i /></span><span className="frame-url">preview.local / {selected.toLowerCase()}</span><span className="frame-dots">•••</span></div><PreviewContent selected={selected} view={view} /></div></div>
    <div className="preview-footer"><span><span className="live-dot" /> Live preview connected</span><span>Last updated just now</span></div>
  </section>
}

function PreviewContent({ selected, view }: { selected: string; view: ViewMode }) {
  if (view === 'grid') return <div className="grid-stage">{['Hero', 'Features', 'Pricing', 'FAQ'].map((item) => <div key={item} className={cn('grid-card', selected === item && 'selected')}><div className="grid-card-bar" /><strong>{item}</strong><span>Preview ready</span></div>)}</div>
  if (view === 'page' || pages.some((page) => page.name === selected)) return <div className="page-stage"><div className="page-stage-nav"><span className="mock-logo">northstar<span>.</span></span><span>Product</span><span>Journal</span><button onClick={() => demoAction('Get started')}>Get started</button></div><div className="page-stage-hero"><span className="eyebrow">{selected === 'Pricing page' ? '03 / Plans for every team' : '01 / A clearer way forward'}</span><h1>{selected === 'Documentation' ? 'Build with<br /><em>confidence.</em>' : selected === 'Pricing page' ? 'Simple plans.<br /><em>Serious work.</em>' : 'Make space<br /><em>for better work.</em>'}</h1><p>Everything you need to move from idea to a considered, finished experience.</p></div><div className="page-stage-sections"><span>02 / Explore the system</span><span>03 / Built to last</span><span>04 / Questions, answered</span></div></div>
  if (selected === 'Button') return <div className="component-stage"><div className="stage-label">Button / states</div><button className="preview-button" onClick={() => demoAction('Start building')}>Start building <ArrowDownToLine size={15} /></button><button className="preview-button secondary" onClick={() => demoAction('View documentation')}>View documentation</button><button className="preview-button ghost" onClick={() => demoAction('Ghost button')}>Ghost button</button></div>
  if (selected === 'Card') return <div className="component-stage"><div className="stage-label">Card / default</div><div className="demo-card"><div className="demo-card-icon"><Sparkles size={18} /></div><div><h3>Design with intention.</h3><p>Build a system that feels considered from the first interaction.</p></div><ChevronRight size={17} /></div><div className="demo-card muted"><div className="skeleton-line" /><div className="skeleton-line short" /></div></div>
  return <div className="mock-page"><div className="mock-nav"><div className="mock-logo">northstar<span>.</span></div><div className="mock-links"><span>Product</span><span>Manifesto</span><span>Journal</span></div><button className="mock-nav-button" onClick={() => demoAction('Get started')} >Get started <ArrowDownToLine size={12} /></button></div><div className="mock-hero"><div className="eyebrow"><span>01</span> A clearer way forward</div><h1>Make space<br /><em>for better work.</em></h1><p>Northstar is a calm, focused workspace for teams who care about the details.</p><button className="mock-cta" onClick={() => demoAction('Explore the system')}>Explore the system <ArrowDownToLine size={15} /></button></div><div className="mock-bottom"><span>Scroll to explore</span><span className="mock-rule" /><span>© 2024 — 2025</span></div></div>
}

function ActivityPanel() {
  const [prompt, setPrompt] = useState('')
  const [sent, setSent] = useState(false)
  const [inboxOpen, setInboxOpen] = useState(true)
  return <aside className="activity-panel right-panel"><div className="panel-heading"><div><div className="eyebrow-label">AGENT ACTIVITY</div><h2>{inboxOpen ? 'Agent inbox' : 'Building in real time'}</h2></div><div className="agent-status"><span className="pulse" /> Working</div></div><div className="inbox-tabs" role="tablist" aria-label="Agent panel views"><button className={cn(inboxOpen && 'active')} onClick={() => setInboxOpen(true)} role="tab" aria-selected={inboxOpen}><MessageSquareText size={13} /> Inbox <span>2</span></button><button className={cn(!inboxOpen && 'active')} onClick={() => setInboxOpen(false)} role="tab" aria-selected={!inboxOpen}><History size={13} /> Activity</button></div>{inboxOpen ? <div className="chat-inbox" role="tabpanel"><div className="chat-message agent"><div className="chat-avatar"><Sparkles size={12} /></div><div className="chat-bubble"><div className="chat-meta">Agent <time>now</time></div><p>Hero is looking sharper. I tightened the headline rhythm and checked the responsive layout.</p><div className="chat-context"><Check size={12} /> Preview updated</div></div></div><div className="chat-message agent"><div className="chat-avatar"><Sparkles size={12} /></div><div className="chat-bubble"><div className="chat-meta">Agent <time>10:42</time></div><p>The new section structure is ready to review. I kept the spacing system consistent across the page.</p></div></div></div> : <div className="activity-feed">{activities.map((activity, index) => <div className={cn('activity', index === 0 && 'current')} key={activity.time}><div className={cn('activity-marker', activity.state)}>{activity.state === 'success' ? <Check size={11} /> : activity.state === 'working' ? <span /> : <History size={11} />}</div><div className="activity-copy"><div className="activity-title">{activity.title}{index === 0 && <span className="now">now</span>}</div><div className="activity-detail">{activity.detail}</div></div><time>{activity.time}</time></div>)}</div>}<div className="agent-note"><Sparkles size={15} /><span>Agent is checking the preview at 2 viewports.</span></div><div className="prompt-box"><div className="prompt-label"><WandSparkles size={14} /> Ask for a change</div><textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Message the agent..." onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) { event.preventDefault(); setSent(true); setPrompt('') } }} /><div className="prompt-actions"><span><kbd>↵</kbd> to send</span><button aria-label="Send prompt" disabled={!prompt} onClick={() => { setSent(true); setPrompt('') }}><Send size={15} /></button></div></div>{sent && <div className="sent-note"><Check size={13} /> Message sent to the agent <X size={13} onClick={() => setSent(false)} /></div>}<div className="activity-footer"><span><FileCode2 size={13} /> 12 files in workspace</span><button><Undo2 size={13} /> Undo last change</button></div></aside>
}

export default function Page() {
  const [selected, setSelected] = useState('Hero')
  const [device, setDevice] = useState<Device>('desktop')
  const [view, setView] = useState<ViewMode>('single')
  const [showLeft, setShowLeft] = useState(true)
  const [showRight, setShowRight] = useState(true)
  const viewLabel = useMemo(() => view === 'single' ? 'Single view' : view === 'grid' ? 'Grid view' : 'Page view', [view])
  return <main className="studio-shell"><header className="topbar"><div className="topbar-left"><button className="mobile-toggle" onClick={() => setShowLeft(!showLeft)}><PanelLeft size={16} /></button><button className="project-title" onClick={() => demoAction('Project switcher')}><span className="project-status" /> <span>Untitled project</span><ChevronDown size={14} /></button><span className="slash">/</span><span className="project-subtitle">Design system</span></div><div className="topbar-center"><div className="view-switcher"><button onClick={() => setView('single')} className={cn(view === 'single' && 'active')}><Eye size={14} /> Single</button><button onClick={() => setView('grid')} className={cn(view === 'grid' && 'active')}><Grid2X2 size={14} /> Grid</button><button onClick={() => setView('page')} className={cn(view === 'page' && 'active')}><LayoutTemplate size={14} /> Page</button></div></div><div className="topbar-right"><span className="saved"><Check size={13} /> Saved</span><button className="icon-button" onClick={() => demoAction('Reset preview')} aria-label="Reset preview"><RotateCcw size={15} /></button><button className="share-button" onClick={() => demoAction('Export project')}><ArrowDownToLine size={14} /> Export</button><button className="mobile-toggle" onClick={() => setShowRight(!showRight)}><PanelRight size={16} /></button></div></header><div className="workspace"><div className={cn('panel-slot', !showLeft && 'hidden-panel')}><Sidebar selected={selected} setSelected={setSelected} /></div><div className="main-stage"><div className="stage-topline"><span>{viewLabel}</span><span>⌘ ⇧ F <Maximize2 size={12} /></span></div><PreviewCanvas selected={selected} device={device} setDevice={setDevice} view={view} /></div><div className={cn('panel-slot right-slot', !showRight && 'hidden-panel')}><ActivityPanel /></div></div></main>
}

