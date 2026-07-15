import { useEffect, useRef } from 'react'

/* A tol.is-style technical field: a faint blueprint grid that reacts to the cursor.
   Grid nodes near the pointer brighten and lean toward it, thin lines reach out from a
   tracking crosshair, and a coordinate readout follows along. Pure canvas, one rAF loop,
   monochrome - the HUD chrome and navigation are HTML laid over the top of this. */

const GRID = 46        // spacing between nodes, px
const REACH = 190      // cursor influence radius, px
const LINK = 130       // a node must be within this radius of the cursor to be linkable
const MAX_LINKS = 5    // ...and only the nearest few actually get a line, so it stays sparse

export default function HudGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let nodes = []
    let w = 0, h = 0
    // cursor starts at centre so the field looks composed before the mouse moves / in headless
    const cur = { x: 0, y: 0, tx: 0, ty: 0, active: 0, tActive: 0 }
    let rafId
    let t = 0

    function build() {
      nodes = []
      const cols = Math.ceil(w / GRID) + 1
      const rows = Math.ceil(h / GRID) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({ ox: c * GRID, oy: r * GRID, ph: (c + r) * 0.6 })
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cur.x = cur.tx = w / 2
      cur.y = cur.ty = h / 2
      build()
    }

    function onMove(e) {
      cur.tx = e.clientX
      cur.ty = e.clientY
      cur.tActive = 1
    }
    function onLeave() { cur.tActive = 0 }

    function draw() {
      t += 0.016
      cur.x += (cur.tx - cur.x) * 0.12
      cur.y += (cur.ty - cur.y) * 0.12
      cur.active += (cur.tActive - cur.active) * 0.06

      ctx.clearRect(0, 0, w, h)

      const links = []
      for (const n of nodes) {
        // gentle idle bob so the grid breathes without the cursor
        const bob = reduce ? 0 : Math.sin(t * 0.6 + n.ph) * 0.8
        let x = n.ox
        let y = n.oy + bob

        const dx = cur.x - n.ox
        const dy = cur.y - n.oy
        const dist = Math.hypot(dx, dy)

        let a = 0.14 // base node alpha
        let size = 1
        if (dist < REACH) {
          const f = (1 - dist / REACH) * cur.active
          // lean toward the cursor, brighten, grow
          x += (dx / (dist || 1)) * f * 10
          y += (dy / (dist || 1)) * f * 10
          a = 0.14 + f * 0.7
          size = 1 + f * 1.6
          if (dist < LINK) links.push({ x, y, a: f, d: dist })
        }

        ctx.fillStyle = `rgba(225, 225, 230, ${a})`
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }

      // only the nearest few nodes get a line, so the web stays sparse
      links.sort((p, q) => p.d - q.d)
      links.length = Math.min(links.length, MAX_LINKS)

      // lines reaching from the crosshair to nearby nodes
      for (const l of links) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${l.a * 0.35})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cur.x, cur.y)
        ctx.lineTo(l.x, l.y)
        ctx.stroke()
      }

      // tracking crosshair
      if (cur.active > 0.01) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.11 * cur.active})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(cur.x, 0); ctx.lineTo(cur.x, h)
        ctx.moveTo(0, cur.y); ctx.lineTo(w, cur.y)
        ctx.stroke()

        // focus reticle
        ctx.strokeStyle = `rgba(235, 235, 240, ${0.6 * cur.active})`
        ctx.strokeRect(cur.x - 9, cur.y - 9, 18, 18)

        // coordinate readout
        ctx.fillStyle = `rgba(150, 150, 158, ${0.7 * cur.active})`
        ctx.font = "10px 'Space Mono', monospace"
        ctx.textBaseline = 'top'
        const cx = String(Math.round(cur.x)).padStart(4, '0')
        const cy = String(Math.round(cur.y)).padStart(4, '0')
        ctx.fillText(`x:${cx}  y:${cy}`, cur.x + 14, cur.y + 12)
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    rafId = requestAnimationFrame(draw)

    return () => {
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
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  )
}
