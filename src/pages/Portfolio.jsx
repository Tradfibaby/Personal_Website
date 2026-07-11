import { useState, useEffect, useRef } from 'react'
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
      <BarPattern seed={item.slug} dense={item.slug === 'riten'} />
    </Link>
  )
}

/* ornn-style generative bar pattern: seeded, centre-anchored, breathing */
function BarPattern({ seed, dense }) {
  const bars = useRef(null)
  if (!bars.current) {
    let h = 0
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
    const rand = mulberry32(h || 1)
    const count = dense ? 72 : 30
    bars.current = Array.from({ length: count }, (_, i) => {
      const tier = rand()
      const height = tier < 0.18 ? 12 + rand() * 18 : tier < 0.72 ? 34 + rand() * 34 : 74 + rand() * 26
      return {
        height,
        opacity: 0.35 + rand() * 0.65,
        s1: 0.82 + rand() * 0.36,
        dur: 3 + rand() * 3,
        delay: -(rand() * 6),
      }
    })
  }
  return (
    <div className="bar-fig" aria-hidden="true" style={{
      display: 'flex',
      gap: dense ? '3px' : '5px',
      alignItems: 'center',
      height: '210px',
      overflow: 'hidden',
    }}>
      {bars.current.map((b, i) => (
        <span key={i} style={{
          flex: '1 0 auto',
          height: `${b.height}%`,
          backgroundColor: '#222222',
          opacity: b.opacity,
          transformOrigin: 'center',
          '--s1': b.s1,
          animation: `bar-breathe ${b.dur}s ease-in-out ${b.delay}s infinite alternate`,
        }} />
      ))}
    </div>
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
  return (
    <section style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/portfolio" aria-label="back to portfolio" style={{ color: '#555', fontSize: '0.9rem', backgroundColor: 'var(--bg)', display: 'inline-block', padding: '0.1rem 0.3rem' }}
            onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
            onMouseLeave={e => (e.target.style.color = '#555')}
          >←</Link>
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

function ScrollyFilm({ item }) {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    return <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} aspect={item.mainAspect} />
  }
  return <ScrollScrub src={item.scrubVideo} poster={item.mainPoster} chapters={item.chapters} duration={item.scrubDuration} />
}

function ScrollScrub({ src, poster, chapters, duration }) {
  const wrapRef = useRef(null)
  const videoRef = useRef(null)
  const [view, setView] = useState({ t: 0, progress: 0, idx: 0 })

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
        let idx = 0
        for (let i = 0; i < chapters.length; i++) if (target >= chapters[i].start) idx = i
        setView(v => (v.t === target && v.progress === p && v.idx === idx) ? v : { t: target, progress: p, idx })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [chapters])

  const skipToNext = () => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!video.duration) return
    const next = chapters[Math.min(view.idx + 1, chapters.length - 1)]
    const scrollable = wrap.offsetHeight - window.innerHeight
    const top = wrap.getBoundingClientRect().top + window.scrollY + (next.start / video.duration) * scrollable
    window.scrollTo({ top: top + 2, behavior: 'smooth' })
  }

  const { t, progress, idx } = view
  // scroll hint fades out over the first seconds of the film
  const hintVis = Math.max(0, 1 - t / 2.5)

  return (
    <div ref={wrapRef} style={{ height: '520vh', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
      <div
        onClick={skipToNext}
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

        {/* Scroll hint, fades out as the film starts */}
        {hintVis > 0 && (
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '5vh',
            transform: 'translateX(-50%)',
            opacity: hintVis,
            pointerEvents: 'none',
          }}>
            <span style={{
              display: 'block',
              width: '1px',
              height: '26px',
              margin: '0 auto',
              backgroundColor: '#4be8e2',
              animation: 'scrolly-hint 1.6s ease-out infinite',
            }} />
          </div>
        )}

        {/* Progress bar + chapter ticks */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '2px', backgroundColor: '#181818' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: 'rgba(75, 232, 226, 0.55)' }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8px', pointerEvents: 'none' }}>
          {chapters.map((c, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${(c.start / duration) * 100}%`,
              bottom: 0,
              width: '1px',
              height: i === idx ? '8px' : '5px',
              backgroundColor: i === idx ? '#4be8e2' : i < idx ? '#666' : '#2a2a2a',
            }} />
          ))}
        </div>
      </div>
    </div>
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
