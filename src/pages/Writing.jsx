import { Link } from 'react-router-dom'
import SectionLabel from '../components/SectionLabel'
import { posts } from '../content/posts/index'

export default function Writing() {
  const sorted = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>writing</h1>
      <SectionLabel>all posts</SectionLabel>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {sorted.map((post) => (
          <Link
            key={post.slug}
            to={`/writing/${post.slug}`}
            style={cardBase}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#333'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#181818'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{post.title}</span>
              <span style={{ color: '#444', fontSize: '0.75rem', flexShrink: 0 }}>{post.date}</span>
            </div>
            {post.description && (
              <p style={{ color: '#555', fontSize: '0.8rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
                {post.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '2rem',
}

const cardBase = {
  padding: '1.1rem 0',
  borderBottom: '1px solid #181818',
  cursor: 'pointer',
  transition: 'border-color 0.15s',
  display: 'block',
}
