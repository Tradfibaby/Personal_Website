import { useState, useEffect, useRef } from 'react'
import { portfolio } from '../data/portfolio'

export default function Portfolio() {
  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>portfolio</h1>
      <p style={{ color: '#4a4a4a', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '480px', marginBottom: '3rem', backgroundColor: 'var(--bg)' }}>
        selected product work - apps designed, built and shipped end to end.
      </p>

      {portfolio.map((item, i) => (
        <CaseStudy key={item.slug} item={item} last={i === portfolio.length - 1} />
      ))}
    </section>
  )
}

function CaseStudy({ item, last }) {
  return (
    <section style={{
      paddingBottom: '3.5rem',
      marginBottom: '3.5rem',
      borderBottom: last ? 'none' : '1px solid #181818',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '400', color: '#f0f0f0', letterSpacing: '-0.01em', backgroundColor: 'var(--bg)', padding: '0.1rem 0' }}>
          {item.name}
        </h2>
        <span style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em', backgroundColor: 'var(--bg)', padding: '0.1rem 0.3rem' }}>{item.year}</span>
      </div>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem', backgroundColor: 'var(--bg)', display: 'inline-block' }}>{item.tagline}</p>

      {/* Text + phone loop */}
      <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div style={{ flex: '1 1 280px' }}>
          <p style={{ color: '#888', fontSize: '0.95rem', lineHeight: 1.9, margin: '0 0 1.5rem', backgroundColor: 'var(--bg)' }}>
            {item.description}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {item.stack.map(tag => (
              <span key={tag} style={{
                color: '#555',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                border: '1px solid #1e1e1e',
                padding: '0.25rem 0.6rem',
                backgroundColor: 'var(--bg)',
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <PhoneLoop src={item.loopVideo} caption={item.loopCaption} landscape={item.loopLandscape} />
      </div>

      {/* Wide showcase video */}
      {item.scrubVideo ? (
        <ScrollyFilm item={item} />
      ) : (
        <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} caption={item.mainCaption} aspect={item.mainAspect} />
      )}
    </section>
  )
}

function ScrollyFilm({ item }) {
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [showFull, setShowFull] = useState(false)

  if (prefersReduced) {
    return <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} caption={item.mainCaption} aspect={item.mainAspect} />
  }
  return (
    <div>
      <ScrollScrub src={item.scrubVideo} poster={item.mainPoster} chapters={item.chapters} duration={item.scrubDuration} />
      <div style={{ marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ color: '#3a3a3a', fontSize: '0.7rem', letterSpacing: '0.05em', margin: 0, backgroundColor: 'var(--bg)', display: 'inline-block' }}>
          scroll to scrub · click to skip ahead
        </p>
        {!showFull && (
          <button
            onClick={() => setShowFull(true)}
            style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.05em', background: 'var(--bg)', border: 'none', cursor: 'pointer', padding: '0.1rem 0.3rem' }}
            onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
            onMouseLeave={e => (e.target.style.color = '#555')}
          >
            watch the full film with sound ▶
          </button>
        )}
      </div>
      {showFull && (
        <div style={{ marginTop: '1.5rem' }}>
          <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} caption={item.mainCaption} aspect={item.mainAspect} autoPlay />
        </div>
      )}
    </div>
  )
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
  const chapter = chapters[idx]
  const isTitle = idx === 0

  // scroll-linked chapter transitions: everything is a pure function of scrub time
  const chapterEnd = chapters[idx + 1]?.start ?? duration
  const local = Math.min(1, Math.max(0, (t - chapter.start) / Math.max(0.1, chapterEnd - chapter.start)))
  const fadeIn = idx === 0 ? 1 : Math.min(1, local / 0.14)
  const fadeOut = idx === chapters.length - 1 ? 1 : Math.min(1, (1 - local) / 0.14)
  const vis = Math.max(0, Math.min(fadeIn, fadeOut))
  const slideX = (1 - fadeIn) * 42 - (1 - fadeOut) * 42
  const introVis = isTitle ? Math.max(0, 1 - local * 1.25) : 0

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
          backgroundColor: '#080808',
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

        {/* Intro: dark scrim + brand title over the opening space shot */}
        {introVis > 0 && (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(8, 8, 8, 0.62) 0%, rgba(8, 8, 8, 0.86) 100%)',
              opacity: introVis,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: introVis,
              transform: `scale(${1 + local * 0.18})`,
              pointerEvents: 'none',
            }}>
              <span style={{
                fontFamily: "'Orbitron', 'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(2.6rem, 8vw, 5rem)',
                letterSpacing: '0.04em',
                color: '#4be8e2',
                textShadow: '0 0 22px rgba(75, 232, 226, 0.45), 0 0 70px rgba(75, 232, 226, 0.18)',
              }}>own.fun</span>
            </div>
            <div style={{
              position: 'absolute',
              left: '50%',
              bottom: '5vh',
              transform: 'translateX(-50%)',
              opacity: introVis,
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
          </>
        )}

        {/* Chapter title, scroll-linked slide + fade */}
        {!isTitle && vis > 0 && (
          <>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: '38vh',
              background: 'linear-gradient(to top, rgba(8, 8, 8, 0.8) 0%, rgba(8, 8, 8, 0) 100%)',
              opacity: vis,
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              left: 'clamp(1.5rem, 6vw, 5rem)',
              bottom: '10vh',
              maxWidth: '440px',
              opacity: vis,
              transform: `translateX(${slideX}px)`,
              pointerEvents: 'none',
            }}>
              <span style={{
                display: 'block',
                color: '#555',
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                marginBottom: '0.5rem',
              }}>{String(idx).padStart(2, '0')}</span>
              <span style={{
                display: 'block',
                fontFamily: "'Orbitron', 'Space Mono', monospace",
                fontWeight: 500,
                fontSize: 'clamp(1.2rem, 2.6vw, 1.7rem)',
                lineHeight: 1.35,
                color: '#4be8e2',
                textShadow: '0 0 18px rgba(75, 232, 226, 0.35)',
              }}>{chapter.title}</span>
            </div>
          </>
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

function PhoneLoop({ src, caption, landscape }) {
  return (
    <div style={{ flex: '0 0 auto', margin: '0 auto' }}>
      <div style={{
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
      <p style={{ color: '#3a3a3a', fontSize: '0.7rem', letterSpacing: '0.05em', textAlign: 'center', marginTop: '0.6rem', backgroundColor: 'var(--bg)' }}>
        {caption}
      </p>
    </div>
  )
}

function ShowcaseVideo({ src, poster, caption, aspect, autoPlay = false }) {
  const [playing, setPlaying] = useState(autoPlay)
  const [hovered, setHovered] = useState(false)

  return (
    <div>
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
      <p style={{ color: '#3a3a3a', fontSize: '0.7rem', letterSpacing: '0.05em', marginTop: '0.6rem', backgroundColor: 'var(--bg)', display: 'inline-block' }}>
        {caption}
      </p>
    </div>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '1rem',
  backgroundColor: 'var(--bg)',
  display: 'inline-block',
  padding: '0.1rem 0',
}
