import { useEffect, useState } from 'react'
import { cn } from './lib/utils'

interface PreviewProps {
  component?: string
  view?: 'single' | 'grid' | 'page'
}

function App() {
  const [previewComponent, setPreviewComponent] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'single' | 'grid' | 'page'>('single')
  const [error, setError] = useState<string | null>(null)

  // Listen for preview focus events from the agent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'preview_component') {
        setPreviewComponent(event.data.payload.name)
        setViewMode('single')
      }
      if (event.data?.type === 'set_view_mode') {
        setViewMode(event.data.payload.mode)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

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

  if (viewMode === 'grid') {
    return (
      <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Object.entries(previews).map(([name, Component]) => (
          <div key={name} className="border rounded-lg p-4 bg-card">
            <h3 className="text-sm font-medium mb-2 truncate">{name}</h3>
            <div className="transform scale-75 transform-origin-top-left h-64 overflow-hidden">
              <Component />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (viewMode === 'page') {
    const sectionOrder = ['layout:Header', 'sections:Hero', 'sections:Features', 'sections:Pricing', 'sections:Testimonials', 'sections:FAQ', 'layout:Footer']
    return (
      <div className="w-full">
        {sectionOrder.map((name) => {
          const Component = previews[name]
          if (!Component) return null
          return <div key={name} className="w-full"><Component /></div>
        })}
      </div>
    )
  }

  // Single view
  const Component = previewComponent ? previews[previewComponent] : null

  return (
    <div className="min-h-screen bg-background">
      {/* Error overlay */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg max-w-md">
          <pre className="text-sm">{error}</pre>
        </div>
      )}

      {/* Preview area */}
      <div className="w-full min-h-[calc(100vh-4rem)] p-4">
        {Component ? (
          <div className="w-full max-w-5xl mx-auto">
            <Component />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Live Design Studio</h2>
              <p>Select a component from the sidebar or ask the agent to create one.</p>
              <p className="text-sm mt-2">Available previews: {Object.keys(previews).join(', ') || 'none yet'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Debug info */}
      <div className="fixed bottom-2 right-2 text-xs text-muted-foreground bg-background/80 backdrop-blur p-2 rounded">
        View: {viewMode} | Component: {previewComponent || 'auto'} | Previews: {Object.keys(previews).length}
      </div>
    </div>
  )
}

export default App