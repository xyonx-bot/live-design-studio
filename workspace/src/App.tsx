import { useEffect, useState, useRef } from 'react'
import { cn } from './lib/utils'
import { Send, MessageSquare, LayoutGrid, FileText, ChevronLeft, ChevronRight, Settings, X, RotateCw, Download } from 'lucide-react'

interface PreviewProps {
  component?: string
  view?: 'single' | 'grid' | 'page'
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tools_used?: string[]
}

function App() {
  const [previewComponent, setPreviewComponent] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'single' | 'grid' | 'page'>('single')
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatSidebarOpen, setChatSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-discover preview components
  const [previews, setPreviews] = useState<Record<string, React.ComponentType>>({})

  useEffect(() => {
    const modules = import.meta.glob<{ default: React.ComponentType }>('./**/*.preview.tsx', { eager: true })
    const discovered: Record<string, React.ComponentType> = {}
    for (const [path, mod] of Object.entries(modules)) {
      const name = path.replace('./', '').replace('.preview.tsx', '').replace(/\//g, ':')
      if (mod.default) {
        discovered[name] = mod.default
      }
    }
    setPreviews(discovered)
  }, [])

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message to Hermes Agent via backend
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return
    
    const userMessage = inputValue.trim()
    setInputValue('')
    setIsLoading(true)
    
    // Add user message immediately
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMessage])
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userMessage, session_id: sessionId })
      })
      
      const data = await response.json()
      
      if (data.session_id) {
        setSessionId(data.session_id)
      }
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        tools_used: data.tools_used
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Failed to send message'}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setSessionId(null)
  }

  if (viewMode === 'grid') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card/50 backdrop-blur px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Component Gallery</h1>
          <button onClick={() => setViewMode('single')} className="p-2 hover:bg-accent rounded transition">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 overflow-auto p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(previews).map(([name, Component]) => (
            <div key={name} className="border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-medium mb-2 truncate">{name}</h3>
              <div className="transform scale-75 transform-origin-top-left h-64 overflow-hidden">
                <Component />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (viewMode === 'page') {
    const sectionOrder = ['layout:Header', 'sections:Hero', 'sections:Features', 'sections:Pricing', 'sections:Testimonials', 'sections:FAQ', 'layout:Footer']
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b bg-card/50 backdrop-blur px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-semibold">Page View</h1>
          <button onClick={() => setViewMode('single')} className="p-2 hover:bg-accent rounded transition">
            <FileText className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 overflow-auto w-full">
          {sectionOrder.map((name) => {
            const Component = previews[name]
            if (!Component) return null
            return <div key={name} className="w-full"><Component /></div>
          })}
        </div>
      </div>
    )
  }

  // Single view with chat sidebar
  const Component = previewComponent ? previews[previewComponent] : null

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="border-b bg-card/50 backdrop-blur px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 hover:bg-accent rounded transition lg:hidden"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Live Design Studio</h1>
          <div className="flex items-center gap-2 border-l pl-4 ml-2">
            <select 
              value={viewMode} 
              onChange={(e) => setViewMode(e.target.value as 'single' | 'grid' | 'page')}
              className="bg-background border rounded px-2 py-1 text-sm"
            >
              <option value="single">Single</option>
              <option value="grid">Grid</option>
              <option value="page">Page</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setChatSidebarOpen(!chatSidebarOpen)} className="p-2 hover:bg-accent rounded transition">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button onClick={clearChat} className="p-2 hover:bg-accent rounded transition" title="Clear chat">
            <RotateCw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component List */}
        <aside className={cn(
          'w-64 border-r bg-card/50 backdrop-blur flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}>
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium">Components</h2>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-3 space-y-1">
            {Object.keys(previews).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No components yet</p>
            ) : (
              Object.entries(previews).map(([name, _]) => (
                <button
                  key={name}
                  onClick={() => {
                    setPreviewComponent(name)
                    setViewMode('single')
                  }}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded text-sm transition hover:bg-accent',
                    previewComponent === name ? 'bg-primary text-primary-foreground' : ''
                  )}
                >
                  {name}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Preview Toolbar */}
          <div className="border-b bg-card/50 backdrop-blur px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {previewComponent ? previewComponent : 'Select a component or start chatting'}
              </span>
              {previewComponent && (
                <button 
                  onClick={() => setPreviewComponent(null)} 
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select 
                value={viewMode} 
                onChange={(e) => setViewMode(e.target.value as 'single' | 'grid' | 'page')}
                className="bg-background border rounded px-2 py-1 text-sm"
              >
                <option value="single">Single</option>
                <option value="grid">Grid</option>
                <option value="page">Page</option>
              </select>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-4 relative">
            {error && (
              <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-md mb-4">
                <pre className="text-sm">{error}</pre>
              </div>
            )}

            {Component ? (
              <div className="w-full max-w-5xl mx-auto">
                <Component />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h2 className="text-xl font-medium mb-2">Live Design Studio</h2>
                  <p>Select a component from the sidebar or ask the agent to create one.</p>
                  <p className="text-sm mt-2">Available previews: {Object.keys(previews).join(', ') || 'none yet'}</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar - Chat with Hermes Agent */}
        <aside className={cn(
          'w-96 border-l bg-card/50 backdrop-blur flex flex-col transition-all duration-300',
          chatSidebarOpen ? 'w-96' : 'w-0 overflow-hidden'
        )}>
          <div className="p-3 border-b flex items-center justify-between">
            <h2 className="text-sm font-medium">Hermes Agent</h2>
            <button onClick={() => setChatSidebarOpen(false)} className="lg:hidden p-1">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-auto p-3 space-y-4" ref={messagesEndRef}>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Start a conversation with Hermes Agent</p>
                <p className="text-xs mt-1">Ask for UI components, changes, or previews</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div 
                    className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium',
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {msg.role === 'user' ? 'U' : 'H'}
                  </div>
                  <div className={cn(
                    'max-w-[80%] prose prose-sm dark:prose-invert',
                    msg.role === 'user' ? 'text-right' : ''
                  )}>
                    <div className={cn(
                      'p-3 rounded-lg',
                      msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <pre className="whitespace-pre-wrap text-sm">{msg.content}</pre>
                    </div>
                    {msg.tools_used && msg.tools_used.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {msg.tools_used.map((tool, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-accent rounded">🔧 {tool}</span>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Hermes to create a component, modify the preview..."
                className="flex-1 min-h-[60px] max-h-32 px-3 py-2 border rounded bg-background resize-none text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default App