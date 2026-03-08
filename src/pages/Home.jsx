import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SectionLabel from '../components/SectionLabel'
import { projects } from '../data/projects'
import { EncryptedText } from '../components/ui/encrypted-text'
import { TypewriterEffect } from '../components/ui/typewriter-effect'

let hasAnimated = false

export default function Home({ onNavReady }) {
  const [heroPhase, setHeroPhase] = useState(hasAnimated ? 4 : 0)

  useEffect(() => {
    if (hasAnimated) {
      onNavReady?.()
      return
    }
    hasAnimated = true
  }, [])
  return (
    <div>
      {/* Hero */}
      <section style={{ paddingTop: '5rem', paddingBottom: '5rem', borderBottom: '1px solid #181818' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '400',
          color: '#f0f0f0',
          letterSpacing: '-0.02em',
          marginBottom: '1.25rem',
          lineHeight: 1.2,
          backgroundColor: 'var(--bg)',
          display: 'inline-block',
        }}>
          <EncryptedText
            text="tradfibaby"
            revealDelayMs={110}
            flipDelayMs={40}
            encryptedClassName="text-neutral-500"
            onComplete={() => { setHeroPhase(4); onNavReady?.() }}
          />
        </h1>

        <p style={{ ...heroPara, opacity: heroPhase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease' }}>i'm a founder, operator, and writer. I love thinking about how markets and technology reshape the way humans organise value and power - and what it does to the people caught inside it.</p>
        <p style={{ ...heroPara, opacity: heroPhase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease 0.15s' }}>in a past life, I worked as a quant/dev at an investment bank and co-founded several projects in crypto, from DeFi to privacy and trading apps. I have been fortunate to surround myself with people far smarter and always generous in sharing their knowledge, wisdom, and perspective.</p>
        <p style={{ ...heroPara, marginBottom: '3rem', opacity: heroPhase >= 1 ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}>most of my time now goes into writing and building around AI, finance, and what happens when old infrastructure meets new incentives. human nature stays legible if you know where to look - dramas, documentaries, and dating shows included.</p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'github ↗', href: 'https://github.com/Tradfibaby' },
            { label: 'substack ↗', href: 'https://incoherentyapping.substack.com' },
            { label: 'x ↗', href: 'https://x.com/tradfibaby' },
          ].map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f0f0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#555')}
            >
              <TypewriterEffect text={link.label} enabled={heroPhase >= 4} />
            </a>
          ))}
        </div>
      </section>

      {/* Currently */}
      <section style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid #181818', opacity: heroPhase >= 4 ? 1 : 0, transition: 'opacity 0.7s ease 0.3s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', backgroundColor: 'var(--bg)', padding: '0.1rem 0' }}>
          <SectionLabel>currently</SectionLabel>
          <Link to="/writing" style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em', backgroundColor: 'var(--bg)', padding: '0.1rem 0.3rem' }}
            onMouseEnter={e => (e.target.style.color = '#888')}
            onMouseLeave={e => (e.target.style.color = '#444')}
          >all writing →</Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.95rem' }}>
          {[
            {
              text: 'AI displacement and the closing escape route',
              href: 'https://incoherentyapping.substack.com/p/the-structural-destruction-of-white',
            },
            {
              text: "privacy infrastructure that doesn't ask for your data",
              href: 'https://github.com/Riten-Zone/Anon-Snap',
            },
            {
              text: 'what happens when AI optimises for its own survival',
              href: 'https://incoherentyapping.substack.com/p/what-would-you-do-to-survive',
            },
            {
              text: 'human adaptation speed in the AI age',
              href: null,
            },
            {
              text: 'five thousand years of market making - the function never changes',
              href: 'https://incoherentyapping.substack.com/p/dancing-with-volatility-abc',
            },
            {
              text: 'mobile apps and the on-chain liquidity explosion',
              href: null,
            },
          ].map(({ text, href }) =>
            href ? (
              <a
                key={text}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#888', textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px', backgroundColor: 'var(--bg)', padding: '0.1rem 0.3rem' }}
              >
                {text} ↗
              </a>
            ) : (
              <span key={text} style={{ color: '#555', backgroundColor: 'var(--bg)', padding: '0.1rem 0.3rem' }}>{text}</span>
            )
          )}
        </div>
      </section>

      {/* Projects preview */}
      <section style={{ paddingTop: '3.5rem', opacity: heroPhase >= 4 ? 1 : 0, transition: 'opacity 0.7s ease 0.5s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', backgroundColor: 'var(--bg)', padding: '0.1rem 0' }}>
          <SectionLabel>projects</SectionLabel>
          <Link to="/projects" style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em', backgroundColor: 'var(--bg)', padding: '0.1rem 0.3rem' }}
            onMouseEnter={e => (e.target.style.color = '#888')}
            onMouseLeave={e => (e.target.style.color = '#444')}
          >view all →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {projects.slice(0, 3).map(project => (
            <MiniProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}


function MiniProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={project.appStore ?? project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="wireframe-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        border: `1px solid ${hovered ? '#333' : '#1e1e1e'}`,
        padding: '1.1rem',
        position: 'relative',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered ? '0 0 20px rgba(80, 60, 200, 0.18)' : '0 0 12px rgba(80, 60, 200, 0.07)',
        textDecoration: 'none',
        backgroundColor: 'var(--bg)',
      }}
    >
      <div className="wireframe-card-inner" aria-hidden="true" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{project.name}</span>
          <span style={{ color: '#444', fontSize: '0.9rem' }}>↗</span>
        </div>
        <p style={{ color: '#4a4a4a', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{project.description}</p>
        {project.appStore && project.url && (
          <div style={{ marginTop: '0.75rem' }}>
            <span
              role="link"
              tabIndex={0}
              style={{ color: '#444', fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(project.url, '_blank', 'noopener,noreferrer') }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); window.open(project.url, '_blank', 'noopener,noreferrer') } }}
            >
              github ↗
            </span>
          </div>
        )}
        {project.pubDev && (
          <div style={{ marginTop: '0.75rem' }}>
            <span
              role="link"
              tabIndex={0}
              style={{ color: '#444', fontSize: '0.9rem', letterSpacing: '0.05em', cursor: 'pointer' }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); window.open(project.pubDev, '_blank', 'noopener,noreferrer') }}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); window.open(project.pubDev, '_blank', 'noopener,noreferrer') } }}
            >
              pub.dev ↗
            </span>
          </div>
        )}
    </a>
  )
}

const heroPara = {
  color: '#888',
  fontSize: '1rem',
  lineHeight: 1.9,
  maxWidth: '540px',
  marginBottom: '1.25rem',
  backgroundColor: 'var(--bg)',
}

const linkStyle = {
  color: '#555',
  fontSize: '1rem',
  letterSpacing: '0.05em',
  transition: 'color 0.15s',
  cursor: 'pointer',
  backgroundColor: 'var(--bg)',
  padding: '0.2rem 0.5rem',
}
