import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl'
import { useEffect, useRef, useState } from 'react'

/* The site's intro: a wireframe terrain rolling toward the camera while a progress
   readout counts up, then the whole thing dissolves into the page. Built on OGL - a
   line-grid whose vertices are displaced by fbm noise in the vertex shader, so the
   ridges move without any per-frame CPU work. The camera leans toward the cursor.
   Plays once per session; honours reduced-motion by finishing near-instantly. */

const COLS = 72
const ROWS = 90
const WIDTH = 14
const DEPTH = 22
const DURATION = 2600 // ms of intro before it dissolves

const vertexShader = `
attribute vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
varying float vFog;
varying float vH;

// value noise + fbm
float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0.0, amp = 0.5;
  for(int i=0;i<5;i++){ v += amp*noise(p); p *= 2.0; amp *= 0.5; }
  return v;
}

void main(){
  vec3 p = position;
  // scroll the sampled noise in z so the ridges roll toward the camera
  float zz = p.z + uTime * 2.2;
  float h = fbm(vec2(p.x*0.32, zz*0.32));
  // flatten the strip nearest the camera so the wordmark has a calm bed to sit on
  float nearFade = smoothstep(-2.0, -7.0, p.z);
  p.y += (h - 0.5) * 3.0 * nearFade;
  vH = h;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vFog = clamp((-mv.z - 2.0) / 16.0, 0.0, 1.0);
  gl_Position = projectionMatrix * mv;
}
`

const fragmentShader = `
precision highp float;
varying float vFog;
varying float vH;
uniform float uFade;   // 1 -> visible, 0 -> dissolved
void main(){
  vec3 lo = vec3(0.22, 0.26, 0.5);
  vec3 hi = vec3(0.62, 0.72, 1.0);
  vec3 col = mix(lo, hi, smoothstep(0.2, 0.8, vH));
  float a = (1.0 - vFog) * 0.85 * uFade;
  gl_FragColor = vec4(col, a);
}
`

function buildGeometry(gl) {
  const positions = new Float32Array(COLS * ROWS * 3)
  let k = 0
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      positions[k++] = (j / (COLS - 1) - 0.5) * WIDTH        // x
      positions[k++] = 0                                     // y (displaced in shader)
      positions[k++] = -(i / (ROWS - 1)) * DEPTH             // z: 0 near camera, -DEPTH far
    }
  }
  // line indices: connect each node to its right and forward neighbour -> grid wireframe
  const idx = []
  const at = (i, j) => i * COLS + j
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (j < COLS - 1) idx.push(at(i, j), at(i, j + 1))
      if (i < ROWS - 1) idx.push(at(i, j), at(i + 1, j))
    }
  }
  return new Geometry(gl, {
    position: { size: 3, data: positions },
    index: { data: new Uint16Array(idx) },
  })
}

export default function TerrainLoader({ onDone }) {
  const mountRef = useRef(null)
  const rootRef = useRef(null)
  const pctRef = useRef(null)
  const barRef = useRef(null)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mount = mountRef.current
    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 42, near: 0.1, far: 60 })
    camera.position.set(0, 2.4, 4)
    camera.lookAt([0, 0.2, -8])

    function resize() {
      renderer.setSize(mount.offsetWidth, mount.offsetHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }
    window.addEventListener('resize', resize)
    resize()

    const scene = new Transform()
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: { uTime: { value: 0 }, uFade: { value: 1 } },
      transparent: true,
      depthTest: false,
    })
    const mesh = new Mesh(gl, { mode: gl.LINES, geometry: buildGeometry(gl), program })
    mesh.setParent(scene)
    mount.appendChild(gl.canvas)

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    function onMove(e) {
      mouse.tx = e.clientX / window.innerWidth - 0.5
      mouse.ty = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)

    const start = performance.now()
    let raf
    let fade = 1

    function frame(now) {
      raf = requestAnimationFrame(frame)
      const elapsed = now - start
      program.uniforms.uTime.value = now * 0.001

      // ease the camera toward the cursor
      mouse.x += (mouse.tx - mouse.x) * 0.05
      mouse.y += (mouse.ty - mouse.y) * 0.05
      scene.rotation.y = mouse.x * 0.4
      scene.rotation.x = -mouse.y * 0.15

      // progress: fast-forward to the end for reduced motion
      const p = reduce ? 1 : Math.min(elapsed / DURATION, 1)
      const shown = Math.round(p * 100)
      if (pctRef.current) pctRef.current.textContent = String(shown).padStart(3, '0')
      if (barRef.current) barRef.current.style.width = `${p * 100}%`

      // once complete, dissolve the mesh and hand off
      if (p >= 1 && !doneRef.current) {
        doneRef.current = true
        setLeaving(true)
        onDone?.()
      }
      if (doneRef.current) fade = Math.max(0, fade - 0.04)
      program.uniforms.uFade.value = fade

      renderer.render({ scene, camera })
      if (fade <= 0) cancelAnimationFrame(raf)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      if (gl.canvas.parentNode === mount) mount.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={rootRef} className={`terrain-loader${leaving ? ' leaving' : ''}`}>
      <div ref={mountRef} className="terrain-canvas" />
      <div className="terrain-hud">
        <div className="terrain-title">tradfibaby</div>
        <div className="terrain-bar"><span ref={barRef} /></div>
        <div className="terrain-status">
          LOADING FIELD · <span ref={pctRef}>000</span>%
        </div>
      </div>
    </div>
  )
}
