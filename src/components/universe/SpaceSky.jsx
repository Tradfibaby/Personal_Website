import { useEffect, useRef } from 'react'

const STAR_COUNT = 1300
const MOBILE_STAR_COUNT = 720
const GRID_ROWS = 62
const GRID_COLS = 86
const CAMERA_Y = 1.35
const CAMERA_Z = 4.2
const MIN_PITCH = -0.34
const MAX_PITCH = 0.82

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function buildStars(count) {
  const rand = seededRandom(1439)
  return Array.from({ length: count }, () => {
    const lane = rand()
    const z = -7 - rand() * 72
    const spread = 9 + Math.abs(z) * 0.34
    return {
      x: (rand() - 0.5) * spread * 2,
      y: 1.8 + rand() * 34 + lane * lane * 10,
      z,
      size: 0.45 + rand() * 1.6,
      alpha: 0.24 + rand() * 0.7,
      phase: rand() * Math.PI * 2,
      tint: rand(),
    }
  })
}

function waveHeight(x, z, time) {
  const longSwell = Math.sin(x * 0.35 + z * 0.42 + time * 0.55) * 0.28
  const crossSwell = Math.sin(x * 0.82 - z * 0.18 + time * 0.8) * 0.16
  const chop = Math.sin((x + z) * 1.7 + time * 1.35) * 0.055
  return -1.12 + longSwell + crossSwell + chop
}

function drawBackground(ctx, w, h, pitch) {
  const lift = (pitch - MIN_PITCH) / (MAX_PITCH - MIN_PITCH)
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, `rgba(${10 + lift * 8}, ${12 + lift * 10}, ${22 + lift * 16}, 1)`)
  sky.addColorStop(0.42, 'rgba(2, 3, 8, 1)')
  sky.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  const core = ctx.createRadialGradient(w * 0.5, h * 0.56, 0, w * 0.5, h * 0.56, Math.max(w, h) * 0.72)
  core.addColorStop(0, `rgba(120, 145, 185, ${0.055 + lift * 0.035})`)
  core.addColorStop(0.48, 'rgba(35, 55, 86, 0.035)')
  core.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, w, h)
}

function projectPoint(point, view, w, h, focal) {
  const px = point.x - view.x
  const py = point.y - CAMERA_Y
  const pz = point.z - CAMERA_Z

  const yawCos = Math.cos(view.yaw)
  const yawSin = Math.sin(view.yaw)
  const xz = px * yawCos - pz * yawSin
  const zz = px * yawSin + pz * yawCos

  const pitchCos = Math.cos(view.pitch)
  const pitchSin = Math.sin(view.pitch)
  const yz = py * pitchCos + zz * pitchSin
  const z2 = -py * pitchSin + zz * pitchCos

  if (z2 > -0.12) return null

  const scale = focal / -z2
  return {
    x: w * 0.5 + xz * scale,
    y: h * 0.54 - yz * scale,
    scale,
    depth: -z2,
  }
}

function drawStars(ctx, stars, view, w, h, focal, time, reduce) {
  for (const star of stars) {
    const p = projectPoint(star, view, w, h, focal)
    if (!p || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) continue

    const twinkle = reduce ? 1 : 0.74 + Math.sin(time * 1.6 + star.phase) * 0.26
    const horizonFade = clamp((h * 0.88 - p.y) / (h * 0.28), 0, 1)
    const skyFade = clamp((view.pitch + 0.34) / 0.78, 0.32, 1)
    const alpha = star.alpha * twinkle * horizonFade * skyFade
    const size = clamp(star.size * p.scale * 1.24, 0.45, 2.6)

    const tint = star.tint > 0.72
      ? `rgba(205, 218, 255, ${alpha})`
      : star.tint < 0.18
        ? `rgba(190, 245, 235, ${alpha * 0.82})`
        : `rgba(245, 246, 255, ${alpha})`
    ctx.fillStyle = tint
    ctx.fillRect(p.x, p.y, size, size)
  }
}

function drawMoon(ctx, view, w, h, focal) {
  const p = projectPoint({ x: 12, y: 39, z: -14 }, view, w, h, focal)
  if (!p) return

  const fade = clamp((view.pitch - 0.18) / 0.42, 0, 1)
  if (fade <= 0 || p.x < -100 || p.x > w + 100 || p.y < -100 || p.y > h + 100) return

  const r = clamp(p.scale * 1.58, 15, 42)
  const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2)
  glow.addColorStop(0, `rgba(235, 242, 255, ${0.18 * fade})`)
  glow.addColorStop(0.38, `rgba(135, 170, 225, ${0.075 * fade})`)
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(p.x, p.y, r * 3.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = `rgba(232, 238, 250, ${0.88 * fade})`
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
  ctx.fill()

  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(p.x + r * 0.36, p.y - r * 0.08, r * 0.94, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalCompositeOperation = 'source-over'

  ctx.strokeStyle = `rgba(255, 255, 255, ${0.16 * fade})`
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(p.x, p.y, r, -Math.PI * 0.54, Math.PI * 0.55)
  ctx.stroke()
}

function drawSea(ctx, view, w, h, focal, time, reduce) {
  const seaVisibility = clamp((0.38 - view.pitch) / 0.9, 0, 1)
  if (seaVisibility <= 0.01) return

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let row = 0; row < GRID_ROWS; row++) {
    const z = -2.6 - row * 0.72
    const rowAlpha = Math.pow(1 - row / GRID_ROWS, 0.9) * seaVisibility
    const haze = clamp((row - 8) / 52, 0, 1)
    const lineAlpha = rowAlpha * (0.36 - haze * 0.2)
    if (lineAlpha <= 0.004) continue

    ctx.beginPath()
    let started = false
    for (let col = 0; col < GRID_COLS; col++) {
      const u = col / (GRID_COLS - 1)
      const x = (u - 0.5) * 30
      const drift = reduce ? 0 : time
      const y = waveHeight(x, z, drift)
      const p = projectPoint({ x, y, z }, view, w, h, focal)
      if (!p || p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 120) {
        started = false
        continue
      }

      if (!started) {
        ctx.moveTo(p.x, p.y)
        started = true
      } else {
        ctx.lineTo(p.x, p.y)
      }
    }
    ctx.strokeStyle = `rgba(205, 220, 235, ${lineAlpha})`
    ctx.lineWidth = row < 9 ? 0.95 : 0.7
    ctx.stroke()
  }

  for (let col = 0; col < 29; col++) {
    const u = col / 28
    const x = (u - 0.5) * 29
    ctx.beginPath()
    let started = false

    for (let row = 0; row < 46; row++) {
      const z = -3 - row * 0.88
      const y = waveHeight(x, z, reduce ? 0 : time)
      const p = projectPoint({ x, y, z }, view, w, h, focal)
      if (!p || p.x < -80 || p.x > w + 80 || p.y < -80 || p.y > h + 120) {
        started = false
        continue
      }
      if (!started) {
        ctx.moveTo(p.x, p.y)
        started = true
      } else {
        ctx.lineTo(p.x, p.y)
      }
    }
    ctx.strokeStyle = `rgba(148, 170, 190, ${0.032 * seaVisibility})`
    ctx.lineWidth = 0.7
    ctx.stroke()
  }
}

function drawHorizon(ctx, view, w, h, focal) {
  const left = projectPoint({ x: -80, y: -0.92, z: -50 }, view, w, h, focal)
  const right = projectPoint({ x: 80, y: -0.92, z: -50 }, view, w, h, focal)
  if (!left || !right) return

  const alpha = clamp((0.32 - view.pitch) / 0.72, 0, 0.36)
  if (alpha <= 0.01) return

  const glow = ctx.createLinearGradient(0, left.y - 30, 0, left.y + 44)
  glow.addColorStop(0, 'rgba(0, 0, 0, 0)')
  glow.addColorStop(0.5, `rgba(145, 175, 210, ${alpha * 0.45})`)
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, left.y - 30, w, 74)

  ctx.strokeStyle = `rgba(205, 220, 240, ${alpha})`
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.moveTo(left.x, left.y)
  ctx.lineTo(right.x, right.y)
  ctx.stroke()
}

export default function SpaceSky({ ready = true }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: false })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stars = buildStars(window.innerWidth <= 760 ? MOBILE_STAR_COUNT : STAR_COUNT)
    const view = { x: 0, yaw: 0, targetYaw: 0, pitch: 0.04, targetPitch: 0.04 }
    const touch = { active: false, y: 0 }

    let rafId
    let w = 0
    let h = 0
    let dpr = 1
    let focal = 800

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      focal = Math.min(w, h) * 0.95
    }

    function onWheel(event) {
      view.targetPitch = clamp(view.targetPitch - event.deltaY * 0.00115, MIN_PITCH, MAX_PITCH)
    }

    function onPointerMove(event) {
      view.targetYaw = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 0.22
    }

    function onTouchStart(event) {
      if (!event.touches.length) return
      touch.active = true
      touch.y = event.touches[0].clientY
    }

    function onTouchMove(event) {
      if (!touch.active || !event.touches.length) return
      const nextY = event.touches[0].clientY
      view.targetPitch = clamp(view.targetPitch + (nextY - touch.y) * 0.004, MIN_PITCH, MAX_PITCH)
      touch.y = nextY
    }

    function onTouchEnd() {
      touch.active = false
    }

    function frame(now) {
      const time = reduce ? 0 : now * 0.001
      const ease = reduce ? 1 : 0.065
      view.pitch += (view.targetPitch - view.pitch) * ease
      view.yaw += (view.targetYaw - view.yaw) * 0.07
      view.x = Math.sin(time * 0.06) * 0.28

      drawBackground(ctx, w, h, view.pitch)
      drawStars(ctx, stars, view, w, h, focal, time, reduce)
      drawMoon(ctx, view, w, h, focal)
      drawHorizon(ctx, view, w, h, focal)
      drawSea(ctx, view, w, h, focal, time, reduce)

      rafId = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="space-sky-canvas"
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0 }}
    />
  )
}
