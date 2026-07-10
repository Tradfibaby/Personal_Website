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
  const [chapterIdx, setChapterIdx] = useState(0)
  const [progress, setProgress] = useState(0)

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
        setProgress(p)
        let idx = 0
        for (let i = 0; i < chapters.length; i++) if (target >= chapters[i].start) idx = i
        setChapterIdx(idx)
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
    const next = chapters[Math.min(chapterIdx + 1, chapters.length - 1)]
    const scrollable = wrap.offsetHeight - window.innerHeight
    const top = wrap.getBoundingClientRect().top + window.scrollY + (next.start / video.duration) * scrollable
    window.scrollTo({ top: top + 2, behavior: 'smooth' })
  }

  const chapter = chapters[chapterIdx]
  const isTitle = chapterIdx === 0

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

        {/* Chapter caption */}
        <div
          key={chapterIdx}
          className="scrolly-caption"
          style={isTitle ? {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          } : {
            position: 'absolute',
            left: 'clamp(1.5rem, 6vw, 5rem)',
            bottom: '14vh',
            maxWidth: '340px',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            display: 'inline-block',
            color: '#f0f0f0',
            fontSize: isTitle ? '2.4rem' : '1.15rem',
            letterSpacing: isTitle ? '-0.02em' : '0',
            backgroundColor: 'rgba(8, 8, 8, 0.82)',
            padding: '0.3rem 0.7rem',
          }}>{chapter.title}</span>
          {chapter.sub && (
            <span style={{
              display: 'inline-block',
              color: '#888',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              backgroundColor: 'rgba(8, 8, 8, 0.82)',
              padding: '0.25rem 0.7rem',
              marginTop: '0.35rem',
            }}>{chapter.sub}</span>
          )}
        </div>

        {/* Progress bar + chapter ticks */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '2px', backgroundColor: '#181818' }}>
          <div style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: '#555' }} />
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '8px', pointerEvents: 'none' }}>
          {chapters.map((c, i) => (
            <span key={i} style={{
              position: 'absolute',
              left: `${(c.start / duration) * 100}%`,
              bottom: 0,
              width: '1px',
              height: i === chapterIdx ? '8px' : '5px',
              backgroundColor: i <= chapterIdx ? '#888' : '#2a2a2a',
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
