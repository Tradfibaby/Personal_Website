import { useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}[]'
const GRID = 40
const RADIUS = 70
const MAX_SHIFT = 18

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

export default function CursorEffect() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (window.innerWidth <= 768) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []
    let cursor = { x: -9999, y: -9999 }
    let rafId

    function buildGrid() {
      particles = []
      const cols = Math.ceil(canvas.width / GRID) + 1
      const rows = Math.ceil(canvas.height / GRID) + 1
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          particles.push({
            x: c * GRID,
            y: r * GRID,
            ox: c * GRID,
            oy: r * GRID,
            char: randomChar(),
            brightness: 0,
          })
        }
      }
    }

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildGrid()
    }

    function onMouseMove(e) {
      cursor.x = e.clientX
      cursor.y = e.clientY
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (const p of particles) {
        const dx = cursor.x - p.ox
        const dy = cursor.y - p.oy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < RADIUS) {
          const force = (RADIUS - dist) / RADIUS
          const angle = Math.atan2(dy, dx)
          const shift = force * MAX_SHIFT
          p.x += (p.ox + Math.cos(angle) * shift - p.x) * 0.15
          p.y += (p.oy + Math.sin(angle) * shift - p.y) * 0.15
          p.brightness = Math.min(1, p.brightness + 0.08)
          if (Math.random() < 0.08) p.char = randomChar()
        } else {
          p.x += (p.ox - p.x) * 0.05
          p.y += (p.oy - p.y) * 0.05
          p.brightness = Math.max(0, p.brightness - 0.04)
        }

        if (p.brightness < 0.005) continue
        ctx.font = `${p.brightness > 0.4 ? 'bold ' : ''}12px 'Space Mono', monospace`
        ctx.fillStyle = `rgba(255, 255, 255, ${p.brightness * 0.55})`
        ctx.fillText(p.char, p.x, p.y)
      }

      rafId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
