import { useEffect, useRef } from 'react'

/* A tol.is/typography-style blueprint field for the writing page. One canvas, one rAF loop.

   A floor-plan MAZE of short orthogonal grid segments drifts in and out at random and flares
   bright white near the cursor - visible at rest, the signature reactive layer. Over it sit a
   little HUD chrome (GRID_SEGMENT / LCK / PRG / UI_CTL) and a cursor crosshair + coordinate
   readout. Monochrome; matches the HUD field used elsewhere on the site. The reading column
   stays solid black, so the field lives in the margins and top/bottom around the content. */

const MG = 46          // maze lattice spacing, px
const REACH = 210      // cursor influence radius, px
const MAZE = 150       // drifting segments kept alive

export default function TypographyField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    let maze = []
    const cur = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 }
    let rafId, cancelled = false

    function spawnSeg() {
      const cols = Math.ceil(w / MG), rows = Math.ceil(h / MG)
      const c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows)
      const horiz = Math.random() < 0.5
      const len = 1 + Math.floor(Math.random() * 3)  // 1-3 cells
      return {
        x1: c * MG, y1: r * MG,
        x2: (c + (horiz ? len : 0)) * MG, y2: (r + (horiz ? 0 : len)) * MG,
        life: 0, max: 180 + Math.random() * 320,
      }
    }
    function buildMaze() {
      maze = []
      for (let i = 0; i < MAZE; i++) { const s = spawnSeg(); s.life = Math.random() * s.max; maze.push(s) }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cur.x = cur.tx = w / 2; cur.y = cur.ty = h / 2
      buildMaze()
    }

    const onMove = (e) => { cur.tx = e.clientX; cur.ty = e.clientY; cur.tActive = 1 }
    const onLeave = () => { cur.tActive = 0 }
    const glow = (x, y) => {
      const d = Math.hypot(cur.x - x, cur.y - y)
      return d < REACH ? (1 - d / REACH) * cur.active : 0
    }
    function stroke(x1, y1, x2, y2, a, wdt = 1) {
      ctx.strokeStyle = `rgba(232, 232, 238, ${a})`
      ctx.lineWidth = wdt
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
    }
    function label(txt, x, y, align = 'left', a = 0.4) {
      ctx.fillStyle = `rgba(130, 130, 140, ${a})`
      ctx.font = "10px 'Space Mono', monospace"
      ctx.textBaseline = 'top'; ctx.textAlign = align
      ctx.fillText(txt, x, y)
    }

    function draw() {
      cur.x += (cur.tx - cur.x) * 0.12
      cur.y += (cur.ty - cur.y) * 0.12
      cur.active += (cur.tActive - cur.active) * 0.06
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'square'

      // drifting maze - fades in/out, flares bright near the cursor
      for (let i = 0; i < maze.length; i++) {
        const s = maze[i]
        if (!reduce) s.life++
        if (s.life > s.max) { maze[i] = spawnSeg(); continue }
        const p = s.life / s.max
        const fade = Math.min(1, p * 6) * Math.min(1, (1 - p) * 6)
        const g = glow((s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2)
        const a = (0.09 + g * 0.75) * fade
        if (a > 0.012) stroke(s.x1, s.y1, s.x2, s.y2, a, 1 + g * 0.8)
      }

      // HUD chrome, kept in the gutters clear of the reading column
      label('◻ GRID_SEGMENT', w / 2, 18, 'center', 0.5)
      label(`LCK······ ${cur.active > 0.5 ? 1 : 0}`, 28, h * 0.44)
      label('PRG······ 100%', 28, h - 30)
      label('UI_CTL · LIVE', w - 28, 18, 'right', 0.5)

      // cursor crosshair + reticle + coordinate readout
      if (cur.active > 0.01) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * cur.active})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cur.x, 0); ctx.lineTo(cur.x, h)
        ctx.moveTo(0, cur.y); ctx.lineTo(w, cur.y)
        ctx.stroke()
        ctx.strokeStyle = `rgba(235, 235, 240, ${0.55 * cur.active})`
        ctx.strokeRect(cur.x - 9, cur.y - 9, 18, 18)
        ctx.fillStyle = `rgba(150, 150, 158, ${0.75 * cur.active})`
        ctx.font = "10px 'Space Mono', monospace"; ctx.textBaseline = 'top'; ctx.textAlign = 'left'
        const cx = String(Math.round(cur.x)).padStart(4, '0')
        const cy = String(Math.round(cur.y)).padStart(4, '0')
        ctx.fillText(`x:${cx}  y:${cy}`, cur.x + 14, cur.y + 12)
      }

      rafId = requestAnimationFrame(draw)
    }

    const start = () => {
      if (cancelled) return
      resize()
      window.addEventListener('resize', resize)
      window.addEventListener('mousemove', onMove)
      document.addEventListener('mouseleave', onLeave)
      rafId = requestAnimationFrame(draw)
    }
    if (document.fonts?.ready) document.fonts.ready.then(start); else start()

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
