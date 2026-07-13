import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { portfolio } from '../data/portfolio'

export default function Portfolio() {
  const { slug } = useParams()

  if (slug) {
    const item = portfolio.find(p => p.slug === slug)
    if (!item) return <Navigate to="/portfolio" replace />
    return <CaseStudy item={item} />
  }

  return (
    <section style={{ paddingTop: '4rem' }}>
      <p style={{ color: '#555', fontSize: '0.7rem', letterSpacing: '0.2em', marginBottom: '2.5rem', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0' }}>
        ▪ portfolio
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
        {portfolio.map(item => (
          <Tile key={item.slug} item={item} />
        ))}
      </div>
    </section>
  )
}

function Tile({ item }) {
  return (
    <Link to={`/portfolio/${item.slug}`} className="bar-tile" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1.4rem', marginBottom: '1.6rem' }}>
        <div>
          <span style={{ color: '#f0f0f0', fontSize: '1rem', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0' }}>
            {item.name}
          </span>
        </div>
        <div>
          <span style={{ color: '#666', fontSize: '0.85rem', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0' }}>
            {item.tagline}
          </span>
        </div>
      </div>
      <LineField seed={item.slug} />
    </Link>
  )
}

const COUNT = 38          // hairlines across the frame
const FOCAL = 0.34        // fraction of the width lit up in the centre

/* Field of dim hairlines with a brighter, ragged-edged cluster at the centre. */
function LineField({ seed }) {
  const lines = useMemo(() => {
    let h = 0
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    const rand = mulberry32(h || 1)

    return Array.from({ length: COUNT }, (_, i) => {
      const x = ((i + 0.5) / COUNT) * 100
      const lit = Math.abs(x - 50) / 50 < FOCAL

      // lit lines sit inside an inset rectangle; the rest run nearly full height
      const top = lit ? 19 + rand() * 5 : 1 + rand() * 5
      const bottom = lit ? 81 - rand() * 5 : 99 - rand() * 5

      return {
        x,
        top,
        bottom,
        opacity: lit ? 0.8 + rand() * 0.2 : 0.07 + rand() * 0.08,
        scale: 0.94 + rand() * 0.12,
        dur: 5 + rand() * 4,
        delay: -(rand() * 9),
      }
    })
  }, [seed])

  return (
    <svg
      className="line-fig"
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: '210px' }}
    >
      {lines.map((l, i) => (
        <line
          key={i}
          className="line-fig-l"
          x1={l.x}
          y1={l.top}
          x2={l.x}
          y2={l.bottom}
          stroke="#ffffff"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: l.opacity,
            '--s': l.scale,
            animation: `line-breathe ${l.dur}s ease-in-out ${l.delay}s infinite alternate`,
          }}
        />
      ))}
    </svg>
  )
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function CaseStudy({ item }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const hero = item.hero === 'ownfun'

  return (
    <section style={{ paddingTop: hero ? 0 : '4rem', paddingBottom: '4rem' }}>
      {hero ? (
        <OwnFunHero />
      ) : (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <BackLink />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '400', color: '#f0f0f0', letterSpacing: '-0.01em', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0' }}>
              {item.name}
            </h2>
          </div>
          <div>
            <p style={{ color: '#555', fontSize: '0.9rem', margin: 0, backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0' }}>
              {item.tagline}
            </p>
          </div>
        </div>
      )}

      {item.scrubVideo ? (
        <ScrollyFilm item={item} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ width: '100%' }}>
            <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} aspect={item.mainAspect} />
          </div>
          {item.loopVideo && <PhoneLoop src={item.loopVideo} landscape={item.loopLandscape} />}
        </div>
      )}
    </section>
  )
}

function BackLink() {
  return (
    <Link to="/portfolio" aria-label="back to portfolio" style={{ color: '#555', fontSize: '0.9rem', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0.3rem' }}
      onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
      onMouseLeave={e => (e.target.style.color = '#555')}
    >←</Link>
  )
}

/* own.fun's launch screen, rebuilt: the app's first screen is the first screen of the case study. */
const OWN_PHRASES = [
  'OWN THEM ALL',
  'OWN YOUR FREEDOM',
  "DON'T TRADE, OWN",
  'OWN SH*T, HAVE FUN',
  'DEGEN DEEP IN THE TRENCHES',
  'OWN BETTER, OWN FOR THE CULTURE',
]

const prefersStill = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function OwnFunHero() {
  // with motion off the sign is simply lit, and stays lit
  const [titleClass, setTitleClass] = useState(() => (prefersStill() ? '' : 'off'))
  const [titleText, setTitleText] = useState(() => (prefersStill() ? 'Own.fun' : 'Own'))
  const [phrase, setPhrase] = useState(OWN_PHRASES[0])
  const [cue, setCue] = useState(1)

  useEffect(() => {
    if (prefersStill()) return

    // the sign warms up, then never quite settles
    const warmUp = setTimeout(() => {
      setTitleClass('')
      setTitleText('Own.fun')
    }, 700)

    const flicker = setInterval(() => {
      const r = Math.random()
      if (r < 0.05) {
        setTitleClass('off')
        setTimeout(() => setTitleClass(''), Math.random() * 150 + 75)
      } else if (r < 0.15) {
        setTitleClass('dim')
        setTimeout(() => setTitleClass(''), Math.random() * 300 + 150)
      } else if (r < 0.35) {
        setTitleClass('flicker')
        setTimeout(() => setTitleClass(''), Math.random() * 75 + 75)
      } else {
        setTitleClass('')
      }
    }, 200)

    // ".fun" drops out at random, the way the app's does
    const drop = setInterval(() => {
      if (Math.random() < 0.5) {
        setTitleText('Own')
        setTimeout(() => setTitleText('Own.fun'), Math.random() * 400 + 150)
      }
    }, 1500)

    const phrases = setInterval(() => {
      setPhrase(p => {
        const rest = OWN_PHRASES.filter(x => x !== p)
        return rest[Math.floor(Math.random() * rest.length)]
      })
    }, 3000)

    return () => {
      clearTimeout(warmUp)
      clearInterval(flicker)
      clearInterval(drop)
      clearInterval(phrases)
    }
  }, [])

  // the cue only belongs on screen while the hero does
  useEffect(() => {
    const onScroll = () => setCue(Math.max(0, 1 - window.scrollY / 180))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      marginLeft: 'calc(50% - 50vw)',
      height: 'calc(100svh - 48px)',   // 48px: the sticky nav above
      minHeight: '420px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: '#000',
    }}>
      <ParticleField />

      <div className="ownfun-lines" aria-hidden="true">
        <div className="ownfun-line ownfun-line-1" />
        <div className="ownfun-line ownfun-line-2" />
        <div className="ownfun-line ownfun-line-3" />
        <div className="ownfun-line ownfun-line-4" />
      </div>

      {/* the mesh is dense enough to fight the type, so sink it behind the centre */}
      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 44% 38% at 50% 48%, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.6) 45%, rgba(0,0,0,0) 100%)',
      }} />

      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 2 }}>
        <BackLink />
      </div>

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 1.5rem' }}>
        <h1 className={`ownfun-title ${titleClass}`}>{titleText}</h1>
        <p
          key={phrase}
          className="ownfun-phrase"
          style={{
            marginTop: '1.5rem',
            color: '#f0f0f0',
            fontSize: 'clamp(0.65rem, 2vw, 0.8rem)',
            letterSpacing: '0.28em',
          }}
        >
          {phrase}
        </p>
      </div>

      {cue > 0 && (
        <div style={{
          position: 'absolute',
          bottom: '6vh',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: cue,
          pointerEvents: 'none',
          textAlign: 'center',
          zIndex: 1,
        }}>
          <span style={{
            display: 'block',
            color: '#9a9a9a',
            fontSize: 'clamp(0.7rem, 1.6vw, 0.82rem)',
            letterSpacing: '0.4em',
            whiteSpace: 'nowrap',
          }}>
            SCROLL DOWN TO EXPLORE
          </span>
          {/* tick and chevron fall together, then fade */}
          <span style={{
            display: 'block',
            width: 'fit-content',
            margin: '1.2rem auto 0',
            animation: 'scrolly-hint 1.6s ease-out infinite',
          }}>
            <span style={{
              display: 'block',
              width: '1px',
              height: '24px',
              margin: '0 auto',
              backgroundColor: 'rgba(255, 255, 255, 0.55)',
            }} />
            <svg
              width="15"
              height="9"
              viewBox="0 0 15 9"
              fill="none"
              aria-hidden="true"
              style={{ display: 'block', margin: '3px auto 0' }}
            >
              <path d="M1 1.5L7.5 7.5L14 1.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.3" />
            </svg>
          </span>
        </div>
      )}
    </div>
  )
}

const LINK_DIST = 165      // long enough that the links close into a web, not a scatter of stars
const PUSH_COUNT = 4       // nodes added per click, matching the app's push quantity
const REPULSE_DIST = 200   // the app's hover radius: the web bends away from the cursor
const REPULSE_FORCE = 2.4  // px per frame at the cursor, easing to nothing at the radius
const RELAX = 0.9          // how fast a shoved node drifts home once the cursor moves on

/* own.fun's login background: a dense teal mesh, drifting and re-triangulating itself. */
function ParticleField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const still = prefersStill()
    let raf, w = 0, h = 0, dots = [], ceiling = 0
    const cursor = { x: -1e4, y: -1e4 }

    // ox/oy is how far the cursor has shoved a node off its drift; it relaxes back to zero
    const spawn = (x, y) => ({
      x,
      y,
      ox: 0,
      oy: 0,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 1.6,
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(170, Math.round((w * h) / 5600))
      ceiling = count + 90
      dots = Array.from({ length: count }, () => spawn(Math.random() * w, Math.random() * h))
    }

    // clicking seeds the web where you tapped, as the app's push does
    const push = e => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      for (let i = 0; i < PUSH_COUNT; i++) {
        dots.push(spawn(x + (Math.random() - 0.5) * 26, y + (Math.random() - 0.5) * 26))
      }
      // the oldest nodes retire so a click-happy visitor can't grind the frame rate down
      if (dots.length > ceiling) dots.splice(0, dots.length - ceiling)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        if (!still) {
          d.x += d.vx
          d.y += d.vy
          d.ox *= RELAX
          d.oy *= RELAX
        }
        if (d.x < 0) d.x += w
        if (d.x > w) d.x -= w
        if (d.y < 0) d.y += h
        if (d.y > h) d.y -= h

        // shoulder the nodes aside as the cursor passes, then let them settle back
        const cx = d.x + d.ox - cursor.x
        const cy = d.y + d.oy - cursor.y
        const c2 = cx * cx + cy * cy
        if (c2 < REPULSE_DIST * REPULSE_DIST && c2 > 0.01) {
          const dist = Math.sqrt(c2)
          const force = REPULSE_FORCE * (1 - dist / REPULSE_DIST)
          d.ox += (cx / dist) * force
          d.oy += (cy / dist) * force
        }

        d.px = d.x + d.ox
        d.py = d.y + d.oy
      }

      ctx.lineWidth = 1
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j]
          const dx = a.px - b.px, dy = a.py - b.py
          const d2 = dx * dx + dy * dy
          if (d2 >= LINK_DIST * LINK_DIST) continue   // skip the sqrt for the pairs that miss
          const near = 1 - Math.sqrt(d2) / LINK_DIST
          ctx.strokeStyle = `rgba(0, 214, 214, ${0.34 * near})`
          ctx.beginPath()
          ctx.moveTo(a.px, a.py)
          ctx.lineTo(b.px, b.py)
          ctx.stroke()
        }
      }

      ctx.fillStyle = 'rgba(80, 240, 240, 0.9)'
      ctx.shadowColor = 'rgba(0, 255, 255, 0.6)'
      ctx.shadowBlur = 6
      for (const d of dots) {
        ctx.beginPath()
        ctx.arc(d.px, d.py, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }

    // pointer events land on the hero, not the canvas: the type and the cue sit on top of it
    const host = canvas.parentElement
    const onPointerDown = e => {
      push(e)
      if (still) draw()   // nothing is animating, so paint the new nodes in
    }
    const onPointerMove = e => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = e.clientX - rect.left
      cursor.y = e.clientY - rect.top
    }
    const onPointerLeave = () => {
      cursor.x = -1e4
      cursor.y = -1e4
    }

    resize()
    window.addEventListener('resize', resize)
    host.addEventListener('pointerdown', onPointerDown)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)

    if (still) draw()
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  )
}

function ScrollyFilm({ item }) {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    return <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} aspect={item.mainAspect} />
  }
  return <ScrollScrub src={item.scrubVideo} poster={item.mainPoster} chapters={item.chapters} />
}

function ScrollScrub({ src, poster, chapters }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    let raf

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        video.preload = 'auto'
        video.load()
        io.disconnect()
      }
    }, { rootMargin: '1200px' })
    io.observe(wrap)

    const tick = () => {
      if (video.duration) {
        const rect = wrap.getBoundingClientRect()
        const scrollable = rect.height - window.innerHeight
        const p = Math.min(1, Math.max(0, -rect.top / scrollable))
        const target = p * (video.duration - 0.05)
        const cur = video.currentTime
        const diff = target - cur
        if (!video.seeking && Math.abs(diff) > 0.02) {
          // big jumps seek directly, small ones ease in for a smoother scrub
          video.currentTime = Math.abs(diff) > 2.5 ? target : cur + diff * 0.22
        }
        let at = 0
        for (let i = 0; i < chapters.length; i++) if (target >= chapters[i].start) at = i
        setIdx(prev => (prev === at ? prev : at))
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [chapters])

  const jumpTo = i => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!video.duration) return
    const chapter = chapters[Math.min(Math.max(i, 0), chapters.length - 1)]
    const scrollable = wrap.offsetHeight - window.innerHeight
    const top = wrap.getBoundingClientRect().top + window.scrollY + (chapter.start / video.duration) * scrollable
    window.scrollTo({ top: top + 2, behavior: 'smooth' })
  }

  return (
    <div ref={wrapRef} style={{ height: '520vh', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
      <div
        onClick={() => jumpTo(idx + 1)}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: 'var(--bg)',
          overflow: 'hidden',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          playsInline
          preload="metadata"
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />

        {/* Chapter rail: one dash per chapter, the one you're in lights up */}
        <nav
          aria-label="chapters"
          onClick={e => e.stopPropagation()}   // the film itself skips on click; the rail shouldn't
          style={{
            position: 'absolute',
            right: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
          }}
        >
          {chapters.map((c, i) => (
            <ChapterDash key={i} n={i} active={i === idx} seen={i < idx} onJump={jumpTo} />
          ))}
        </nav>
      </div>
    </div>
  )
}

function ChapterDash({ n, active, seen, onJump }) {
  const [hovered, setHovered] = useState(false)

  // every dash is the same length; only the light changes
  const colour = active
    ? '#4be8e2'
    : hovered ? 'rgba(255, 255, 255, 0.7)'
    : seen ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.16)'

  return (
    <button
      onClick={() => onJump(n)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`chapter ${n + 1}`}
      aria-current={active ? 'true' : undefined}
      style={{
        display: 'block',
        width: '22px',
        height: '2px',
        padding: 0,
        border: 'none',
        cursor: 'pointer',
        backgroundColor: colour,
        boxShadow: active ? '0 0 8px rgba(75, 232, 226, 0.8)' : 'none',
        transition: 'background-color 0.25s ease, box-shadow 0.25s ease',
      }}
    />
  )
}

function PhoneLoop({ src, landscape }) {
  return (
    <div style={{
      flex: '0 0 auto',
      width: landscape ? '300px' : '170px',
      maxWidth: '100%',
      padding: '7px',
      border: '1px solid #2a2a2a',
      borderRadius: '26px',
      backgroundColor: '#0c0c0c',
      boxShadow: '0 0 24px rgba(80, 60, 200, 0.12)',
    }}>
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{ display: 'block', width: '100%', borderRadius: '19px', backgroundColor: '#000' }}
      />
    </div>
  )
}

function ShowcaseVideo({ src, poster, aspect, autoPlay = false }) {
  const [playing, setPlaying] = useState(autoPlay)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="wireframe-card"
      style={{
        border: `1px solid ${hovered && !playing ? '#333' : '#1e1e1e'}`,
        boxShadow: hovered && !playing ? '0 0 24px rgba(80, 60, 200, 0.18)' : '0 0 12px rgba(80, 60, 200, 0.07)',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        backgroundColor: '#000',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="wireframe-card-inner" aria-hidden="true" />
      {playing ? (
        <video
          src={src}
          controls
          autoPlay
          playsInline
          style={{ display: 'block', width: '100%', aspectRatio: aspect }}
        />
      ) : (
        <button
          onClick={() => setPlaying(true)}
          aria-label="play video"
          style={{
            display: 'block',
            width: '100%',
            padding: 0,
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: '#000',
          }}
        >
          <img src={poster} alt="" style={{ display: 'block', width: '100%', aspectRatio: aspect, objectFit: 'cover', opacity: hovered ? 0.85 : 0.7, transition: 'opacity 0.2s' }} />
          <span style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: `1px solid ${hovered ? '#888' : '#555'}`,
              backgroundColor: 'rgba(8, 8, 8, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: hovered ? '#f0f0f0' : '#999',
              fontSize: '0.9rem',
              paddingLeft: '4px',
              transition: 'color 0.2s, border-color 0.2s',
            }}>▶</span>
          </span>
        </button>
      )}
    </div>
  )
}
