import { useEffect, useRef } from 'react'

/* A tol.is/typography-style blueprint field for the writing page. One canvas, one rAF loop.

   Everything is built from short orthogonal line segments so it reads like a technical schematic:
     1. a floor-plan MAZE of grid segments on a coarse lattice, drifting in and out at random and
        flaring bright white near the cursor - the signature reactive layer, visible at rest,
     2. the word "writing" digitised onto a finer lattice - each covered node linked to its
        neighbours, with little serif tick-caps at the stroke ends - drawing in left to right,
     3. HUD chrome (GRID_SEGMENT / GLYPH_MAP / DRAW_SEQ / LCK / PRG), a dashed reference box, and
        a cursor crosshair + coordinate readout.
   Monochrome; matches the HUD field used elsewhere on the site. */

const MG = 46          // maze lattice spacing, px (coarse - the floor-plan grid)
const GG = 16          // glyph lattice spacing, px (fine - so the word stays legible)
const REACH = 210      // cursor influence radius, px
const WORD = 'writing'
const MAZE = 150       // drifting background segments kept alive

export default function TypographyField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    let glyphSegs = []
    let gx0 = 0, gx1 = 1, gy0 = 0, gy1 = 1   // wordmark bounding box
    let maze = []
    const cur = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 }
    let rafId, t = 0, reveal = 0, cancelled = false

    // --- wordmark: sample the rendered word onto the fine lattice --------------------------
    function buildGlyph() {
      const off = document.createElement('canvas')
      off.width = w; off.height = h
      const o = off.getContext('2d')
      const size = Math.min(w * 0.16, h * 0.3, 210)
      o.fillStyle = '#fff'; o.textAlign = 'center'; o.textBaseline = 'middle'
      o.font = `700 ${size}px 'Orbitron', 'Space Mono', sans-serif`
      o.fillText(WORD, w / 2, h * 0.42)
      const data = o.getImageData(0, 0, w, h).data
      const cols = Math.ceil(w / GG), rows = Math.ceil(h / GG)
      const hit = (c, r) => {
        const px = c * GG, py = r * GG
        if (px < 0 || py < 0 || px >= w || py >= h) return false
        return data[(py * w + px) * 4 + 3] > 80
      }
      const on = []
      gx0 = Infinity; gx1 = -Infinity; gy0 = Infinity; gy1 = -Infinity
      for (let r = 0; r <= rows; r++) {
        on[r] = []
        for (let c = 0; c <= cols; c++) {
          on[r][c] = hit(c, r)
          if (on[r][c]) {
            gx0 = Math.min(gx0, c * GG); gx1 = Math.max(gx1, c * GG)
            gy0 = Math.min(gy0, r * GG); gy1 = Math.max(gy1, r * GG)
          }
        }
      }
      if (!isFinite(gx0)) { gx0 = 0; gx1 = w; gy0 = 0; gy1 = h }
      const deg = (c, r) =>
        (on[r]?.[c - 1] ? 1 : 0) + (on[r]?.[c + 1] ? 1 : 0) +
        (on[r - 1]?.[c] ? 1 : 0) + (on[r + 1]?.[c] ? 1 : 0)
      glyphSegs = []
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (!on[r][c]) continue
          const x = c * GG, y = r * GG
          if (on[r][c + 1]) glyphSegs.push({ x1: x, y1: y, x2: x + GG, y2: y,
            cap1: deg(c, r) === 1 ? 'v' : null, cap2: deg(c + 1, r) === 1 ? 'v' : null })
          if (on[r + 1]?.[c]) glyphSegs.push({ x1: x, y1: y, x2: x, y2: y + GG,
            cap1: deg(c, r) === 1 ? 'h' : null, cap2: deg(c, r + 1) === 1 ? 'h' : null })
        }
      }
    }

    // --- drifting floor-plan maze ----------------------------------------------------------
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
      buildGlyph(); buildMaze()
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
      t += 1
      cur.x += (cur.tx - cur.x) * 0.12
      cur.y += (cur.ty - cur.y) * 0.12
      cur.active += (cur.tActive - cur.active) * 0.06
      if (reveal < 1) reveal = Math.min(1, reveal + (reduce ? 1 : 0.009))
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'square'

      // 1) drifting maze - fades in/out, flares bright near the cursor
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

      // 2) wordmark - draws in left to right, holds, brighter near the cursor
      const sweep = gx0 + (gx1 - gx0 + GG) * reveal
      for (const s of glyphSegs) {
        const sx = Math.min(s.x1, s.x2)
        if (sx > sweep) continue
        const edge = Math.min(1, (sweep - sx) / (GG * 4))
        const a = Math.min(0.92, (0.3 + glow((s.x1 + s.x2) / 2, (s.y1 + s.y2) / 2) * 0.6) * edge)
        stroke(s.x1, s.y1, s.x2, s.y2, a, 1)
        if (s.cap1) s.cap1 === 'v' ? stroke(s.x1, s.y1 - 2, s.x1, s.y1 + 2, a * 0.75, 0.75)
                                   : stroke(s.x1 - 2, s.y1, s.x1 + 2, s.y1, a * 0.75, 0.75)
        if (s.cap2) s.cap2 === 'v' ? stroke(s.x2, s.y2 - 2, s.x2, s.y2 + 2, a * 0.75, 0.75)
                                   : stroke(s.x2 - 2, s.y2, s.x2 + 2, s.y2, a * 0.75, 0.75)
      }

      // 3) dashed reference box + HUD chrome (kept in the side gutters, clear of the content)
      ctx.setLineDash([2, 4])
      ctx.strokeStyle = `rgba(150, 150, 160, ${0.09 + cur.active * 0.06})`
      ctx.lineWidth = 1
      ctx.strokeRect(gx0 - GG, gy0 - GG, (gx1 - gx0) + 2 * GG, (gy1 - gy0) + 2 * GG)
      ctx.setLineDash([])

      label('◻ GRID_SEGMENT', w / 2, 18, 'center', 0.5)
      label('GLYPH_MAP', 28, gy0 - GG - 2)
      label(`DRAW_SEQ ${String(Math.round(reveal * 100)).padStart(3, '0')}%`, 28, h * 0.44)
      label(`LCK······ ${cur.active > 0.5 ? 1 : 0}`, 28, h * 0.44 + 16)
      label('PRG······ 100%', 28, h - 30)
      label('UI_CTL · LIVE', w - 28, 18, 'right', 0.5)

      // 4) cursor crosshair + reticle + coordinate readout
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
