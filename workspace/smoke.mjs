// One-off smoke render: loads the can1 Button preview through Vite's SSR
// pipeline (aliases resolved) and renders it with react-dom/server.
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'

const server = await createServer({
  logLevel: 'error',
  server: { middlewareMode: true },
})

try {
  const mod = await server.ssrLoadModule('/canvases/can1/src/components/Button.preview.tsx')
  const C = mod.default
  if (typeof C !== 'function') throw new Error('preview default export is not a component')
  const html = renderToString(React.createElement(C))
  const checks = {
    buttonCount: (html.match(/<button/g) || []).length,
    hasPrimaryText: html.includes('Get started'),
    hasOutline: html.includes('Learn more'),
    hasGhost: html.includes('Skip for now'),
    hasSizes: ['Small', 'Medium', 'Large'].every((s) => html.includes(s)),
    hasIconSvg: html.includes('<svg'),
    hasDisabled: html.includes('Disabled'),
    roundedClass: html.includes('rounded-[2px]'),
  }
  console.log('RENDER OK, html length:', html.length)
  for (const [k, v] of Object.entries(checks)) console.log(' ', k, '=>', v)
} catch (err) {
  console.log('RENDER FAILED:', err && err.message ? err.message : err)
  process.exitCode = 1
} finally {
  await server.close()
}
