import { Link } from 'react-router-dom'
import { useState } from 'react'
import SectionLabel from '../components/SectionLabel'
import { useSubstackFeed } from '../hooks/useSubstackFeed'
import { projects } from '../data/projects'

export default function Home() {
  const { posts, loading } = useSubstackFeed(3)

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
        }}>
          tradfibaby
        </h1>

        <p style={{
          color: '#888',
          fontSize: '0.9rem',
          lineHeight: 1.9,
          maxWidth: '500px',
          marginBottom: '3rem',
        }}>
          Five thousand years of market structure. Same game, different hardware.
          Writing about AI, coordination, and what actually changes when the
          infrastructure does.
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'github ↗', href: 'https://github.com/Tradfibaby', external: true },
            { label: 'substack ↗', href: 'https://incoherentyapping.substack.com', external: true },
            { label: 'about →', to: '/about', external: false },
          ].map((link) =>
            link.external ? (
              <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" style={linkStyle}
                onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
                onMouseLeave={e => (e.target.style.color = '#555')}
              >{link.label}</a>
            ) : (
              <Link key={link.label} to={link.to} style={linkStyle}
                onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
                onMouseLeave={e => (e.target.style.color = '#555')}
              >{link.label}</Link>
            )
          )}
        </div>
      </section>

      {/* Writing preview */}
      <section style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem', borderBottom: '1px solid #181818' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <SectionLabel>writing</SectionLabel>
          <Link to="/writing" style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.target.style.color = '#888')}
            onMouseLeave={e => (e.target.style.color = '#444')}
          >view all →</Link>
        </div>

        {loading ? (
          <p style={{ color: '#333', fontSize: '0.8rem' }}>loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {posts.map((post, i) => (
              <WritingRow key={i} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Projects preview */}
      <section style={{ paddingTop: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <SectionLabel>projects</SectionLabel>
          <Link to="/projects" style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.target.style.color = '#888')}
            onMouseLeave={e => (e.target.style.color = '#444')}
          >view all →</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1px' }}>
          {projects.slice(0, 3).map(project => (
            <MiniProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>
    </div>
  )
}

function WritingRow({ post }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        padding: '1rem 0',
        borderBottom: '1px solid #181818',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? '#f0f0f0' : '#e0e0e0', fontSize: '0.88rem', transition: 'color 0.15s' }}>
          {post.title}
        </span>
        <span style={{ color: '#333', fontSize: '0.72rem', flexShrink: 0 }}>{post.date}</span>
      </div>
      {post.description && (
        <p style={{ color: '#4a4a4a', fontSize: '0.78rem', marginTop: '0.35rem', lineHeight: 1.6 }}>
          {post.description}
        </p>
      )}
    </a>
  )
}

function MiniProjectCard({ project }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? '#333' : '#1e1e1e'}`,
        padding: '1.1rem',
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <span style={{ color: '#e0e0e0', fontSize: '0.82rem' }}>{project.name}</span>
        <a href={project.url} target="_blank" rel="noopener noreferrer"
          style={{ color: '#444', fontSize: '0.82rem' }}>↗</a>
      </div>
      <p style={{ color: '#4a4a4a', fontSize: '0.76rem', lineHeight: 1.6 }}>{project.description}</p>
    </div>
  )
}

const linkStyle = {
  color: '#555',
  fontSize: '0.8rem',
  letterSpacing: '0.05em',
  transition: 'color 0.15s',
  cursor: 'pointer',
}
