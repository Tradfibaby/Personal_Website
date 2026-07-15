import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/* The home backdrop, on WebGL. A deep starfield sits behind two layers of glowing
   sparkles that drift in real 3D depth; the whole field spins slowly and leans away
   from the cursor for parallax. Everything is GPU-drawn, so it stays smooth. The
   HTML nodes and wordmark render on top of this canvas. */

function Field({ reduce, mobile }) {
  const parallax = useRef()  // the whole field leans gently toward the cursor, nothing more
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  useEffect(() => {
    if (reduce || mobile) return
    const onMove = (e) => {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5
      mouse.current.ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduce, mobile])

  useFrame(() => {
    const m = mouse.current
    m.x += (m.tx - m.x) * 0.04
    m.y += (m.ty - m.y) * 0.04
    if (parallax.current) {
      parallax.current.rotation.y = THREE.MathUtils.lerp(parallax.current.rotation.y, m.x * 0.22, 0.06)
      parallax.current.rotation.x = THREE.MathUtils.lerp(parallax.current.rotation.x, m.y * 0.22, 0.06)
    }
  })

  const starCount = mobile ? 1400 : 3200

  return (
    <group ref={parallax}>
      {/* a calm, near-still starfield - just a slow twinkle, no rotation */}
      <Stars
        radius={80}
        depth={45}
        count={starCount}
        factor={2.6}
        saturation={0}
        fade
        speed={reduce ? 0 : 0.25}
      />
      {/* a few faint violet motes for depth - subtle, not busy */}
      <Sparkles
        count={mobile ? 14 : 26}
        scale={[18, 12, 10]}
        size={mobile ? 2.5 : 3.5}
        speed={reduce ? 0 : 0.12}
        opacity={0.35}
        color="#9d8cff"
        noise={0.6}
      />
    </group>
  )
}

export default function ParticleField() {
  const { reduce, mobile } = useMemo(() => ({
    reduce: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    mobile: typeof window !== 'undefined' && window.innerWidth <= 768,
  }), [])

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 2]}
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
      frameloop={reduce ? 'demand' : 'always'}
    >
      <Suspense fallback={null}>
        <Field reduce={reduce} mobile={mobile} />
      </Suspense>
    </Canvas>
  )
}
