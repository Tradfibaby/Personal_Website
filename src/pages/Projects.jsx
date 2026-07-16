import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import HudGrid from '../components/universe/HudGrid'

/* The open-source page shares the home field: a reactive HUD grid with the repos drifting
   through it as nodes. Each node leans away from the cursor for depth (parallax written
   straight to the DOM) and carries a slow idle drift, so the whole thing crawls gently. */

const ACCENT = '200, 200, 200'

// scatter positions round the field, matching the home layout - desktop (x/y/depth) and a
// stacked mobile fallback (mx/my)
const POS = [
  { x: 22, y: 33, depth: 24, mx: 50, my: 30 },
  { x: 77, y: 30, depth: 32, mx: 50, my: 45 },
  { x: 21, y: 69, depth: 20, mx: 50, my: 60 },
  { x: 79, y: 67, depth: 28, mx: 50, my: 75 },
]

export default function Projects() {
  const wrapRefs = useRef([])
  const mobile = typeof window !== 'undefined' && window.innerWidth <= 768

  // Cursor parallax: ease a normalised pointer toward each node's depth, writing straight to
  // the DOM so we never re-render on mouse move. (Same approach as the home field.)
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
      projects.forEach((_, i) => {
        const el = wrapRefs.current[i]
        if (!el) return
        const d = POS[i % POS.length].depth
        el.style.transform = `translate(-50%, -50%) translate(${-cur.x * d}px, ${-cur.y * d}px)`
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

  return (
    <div className="universe hud">
      <HudGrid />

      <div className="hud-chrome">
        <span className="hud-label" style={{ top: '1.4rem', left: '1.6rem' }}>◻ OPEN_SOURCE</span>
        <span className="hud-label" style={{ top: '1.4rem', right: '1.6rem' }}>REPO_CTL · <span style={{ color: '#9a9a9a' }}>LIVE</span></span>
        <span className="hud-label" style={{ bottom: '1.4rem', right: '1.6rem' }}>SEG {projects.length} / {projects.length}</span>
      </div>

      {/* The core wordmark, sitting at the centre like a small sun */}
      <div className="universe-core">
        <h1>open source</h1>
        <div className="core-sub">code in the open</div>
      </div>

      {/* Each repo drifts through the field as a node / doorway */}
      {projects.map((project, i) => {
        const p = POS[i % POS.length]
        const href = project.appStore ?? project.url ?? project.pubDev
        return (
          <div
            key={project.name}
            ref={(el) => (wrapRefs.current[i] = el)}
            className="u-node-wrap"
            style={{ left: `${mobile ? p.mx : p.x}%`, top: `${mobile ? p.my : p.y}%` }}
          >
            <div className="u-float" style={{ animationDuration: `${8 + i * 1.3}s`, animationDelay: `${i * 0.6}s` }}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="u-node u-node--tile"
                style={{ '--accent': ACCENT }}
              >
                <span className="u-node-head">
                  <span className="u-node-name">{project.name} ↗</span>
                  <span className="u-node-index">{String(i).padStart(2, '0')}</span>
                </span>
                <span className="u-node-desc">{project.description}</span>
              </a>
            </div>
          </div>
        )
      })}

      <div className="universe-hint">{mobile ? 'tap a repo to open' : 'each node is a repo'}</div>
    </div>
  )
}
