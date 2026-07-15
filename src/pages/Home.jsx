import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { EncryptedText } from '../components/ui/encrypted-text'

// three.js is heavy, so the universe loads as its own chunk once home mounts
const ParticleField = lazy(() => import('../components/universe/ParticleField'))

/* The home page is a single full-screen field. The four sections of the site drift
   through it as nodes - "about" opens a panel in place, the rest are doorways. The
   wordmark sits at the centre like a small sun; the nodes orbit it and lean away
   from the cursor for depth. */

const NODES = [
  { key: 'about',       index: '00', name: 'about',       desc: 'founder, operator, writer',  accent: '150, 130, 255', x: 22, y: 32, mx: 50, my: 40, depth: 22 },
  { key: 'writing',     index: '01', name: 'writing',     desc: 'essays & field notes',       accent: '110, 220, 255', x: 77, y: 30, mx: 50, my: 53, depth: 30 },
  { key: 'portfolio',   index: '02', name: 'portfolio',   desc: "things i've built",          accent: '225, 150, 255', x: 21, y: 70, mx: 50, my: 66, depth: 26 },
  { key: 'open-source', index: '03', name: 'open source', desc: 'code in the open',           accent: '150, 255, 220', x: 79, y: 68, mx: 50, my: 79, depth: 18 },
]

const BIO = [
  "i'm a founder, operator, and writer. I love thinking about how markets and technology reshape the way humans organise value and power - and what it does to the people caught inside it.",
  'in a past life, I worked as a quant/dev at an investment bank and co-founded several projects in crypto, from DeFi to privacy and trading apps. I have been fortunate to surround myself with people far smarter and always generous in sharing their knowledge, wisdom, and perspective.',
  'most of my time now goes into writing and building around AI, finance, and what happens when old infrastructure meets new incentives. human nature stays legible if you know where to look - dramas, documentaries, and dating shows included.',
]

const SOCIALS = [
  { label: 'github ↗', href: 'https://github.com/Tradfibaby' },
  { label: 'substack ↗', href: 'https://incoherentyapping.substack.com' },
  { label: 'x ↗', href: 'https://x.com/tradfibaby' },
]

let hasAnimated = false

export default function Home({ onNavReady }) {
  const [ready, setReady] = useState(hasAnimated)
  const [aboutOpen, setAboutOpen] = useState(false)
  const navigate = useNavigate()
  const wrapRefs = useRef([])
  const mobile = typeof window !== 'undefined' && window.innerWidth <= 768

  useEffect(() => {
    if (hasAnimated) {
      onNavReady?.()
      return
    }
    hasAnimated = true
  }, [])

  // Cursor parallax on the nodes: ease a normalised pointer toward each node's depth,
  // writing straight to the DOM so we never re-render on mouse move.
  useEffect(() => {
    if (mobile) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf
    const target = { x: 0, y: 0 }
    const cur = { x: 0, y: 0 }
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.06
      cur.y += (target.y - cur.y) * 0.06
      NODES.forEach((n, i) => {
        const el = wrapRefs.current[i]
        if (!el) return
        el.style.transform = `translate(-50%, -50%) translate(${-cur.x * n.depth}px, ${-cur.y * n.depth}px)`
      })
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
    }
  }, [mobile])

  // Esc closes the about panel.
  useEffect(() => {
    if (!aboutOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setAboutOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [aboutOpen])

  const activate = (node) => {
    if (node.key === 'about') setAboutOpen(true)
    else navigate(`/${node.key}`)
  }

  return (
    <div className="universe">
      <Suspense fallback={null}><ParticleField /></Suspense>

      {/* The core wordmark */}
      <div className="universe-core">
        <h1>
          <EncryptedText
            text="tradfibaby"
            revealDelayMs={110}
            flipDelayMs={40}
            encryptedClassName="text-neutral-600"
            onComplete={() => { onNavReady?.(); setTimeout(() => setReady(true), 350) }}
          />
        </h1>
        <div className="core-sub" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}>
          markets · technology · human nature
        </div>
      </div>

      {/* The four drifting nodes */}
      {NODES.map((node, i) => (
        <div
          key={node.key}
          ref={(el) => (wrapRefs.current[i] = el)}
          className="u-node-wrap"
          style={{
            left: `${mobile ? node.mx : node.x}%`,
            top: `${mobile ? node.my : node.y}%`,
            opacity: ready ? 1 : 0,
            pointerEvents: ready ? 'auto' : 'none',
            transition: `opacity 0.7s ease ${0.15 + i * 0.12}s`,
          }}
        >
          <div className="u-float" style={{ animationDuration: `${8 + i * 1.3}s`, animationDelay: `${i * 0.6}s` }}>
            <button
              type="button"
              className="u-node wireframe-card"
              style={{ '--accent': node.accent }}
              onClick={() => activate(node)}
            >
              <span className="wireframe-card-inner" aria-hidden="true" />
              <span className="u-node-head">
                <span className="u-node-name">{node.name}</span>
                <span className="u-node-index">{node.index}</span>
              </span>
              <span className="u-node-desc">{node.desc}</span>
            </button>
          </div>
        </div>
      ))}

      <div className="universe-hint" style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.8s ease 0.9s' }}>
        {mobile ? 'tap a node to enter' : 'each node is a doorway'}
      </div>

      {/* About panel */}
      {aboutOpen && (
        <div className="u-overlay" onClick={() => setAboutOpen(false)}>
          <div className="u-panel" onClick={(e) => e.stopPropagation()}>
            <button className="u-panel-close" onClick={() => setAboutOpen(false)} aria-label="close">✕</button>
            <h2>about</h2>
            {BIO.map((para, i) => <p key={i}>{para}</p>)}
            <div className="u-panel-links">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
