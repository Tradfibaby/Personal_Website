import { useState } from 'react'
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
        <PhoneLoop src={item.loopVideo} caption={item.loopCaption} />
      </div>

      {/* Wide showcase video */}
      <ShowcaseVideo src={item.mainVideo} poster={item.mainPoster} caption={item.mainCaption} aspect={item.mainAspect} />
    </section>
  )
}

function PhoneLoop({ src, caption }) {
  return (
    <div style={{ flex: '0 0 auto', margin: '0 auto' }}>
      <div style={{
        width: '170px',
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

function ShowcaseVideo({ src, poster, caption, aspect }) {
  const [playing, setPlaying] = useState(false)
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
