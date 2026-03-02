import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section style={{ paddingTop: '5rem' }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '400',
        color: '#f0f0f0',
        letterSpacing: '-0.02em',
        marginBottom: '1rem',
        lineHeight: 1.2,
      }}>
        tradfibaby
      </h1>

      <p style={{
        color: '#555',
        fontSize: '0.9rem',
        marginBottom: '3rem',
        lineHeight: 1.7,
      }}>
        builder. writer. tinkerer.
      </p>

      <p style={{
        color: '#888',
        fontSize: '0.9rem',
        lineHeight: 1.9,
        maxWidth: '520px',
        marginBottom: '3.5rem',
      }}>
        I build things for the internet. Interested in open source, distributed systems,
        and writing about what I learn along the way.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'github ↗', href: 'https://github.com/Tradfibaby', external: true },
          { label: 'writing →', to: '/writing', external: false },
          { label: 'projects →', to: '/projects', external: false },
          { label: 'about →', to: '/about', external: false },
        ].map((link) =>
          link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
              onMouseLeave={e => (e.target.style.color = '#555')}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              to={link.to}
              style={linkStyle}
              onMouseEnter={e => (e.target.style.color = '#f0f0f0')}
              onMouseLeave={e => (e.target.style.color = '#555')}
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </section>
  )
}

const linkStyle = {
  color: '#555',
  fontSize: '0.8rem',
  letterSpacing: '0.05em',
  transition: 'color 0.15s',
  cursor: 'pointer',
}
