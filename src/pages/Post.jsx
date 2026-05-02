import { useParams, Link, Navigate } from 'react-router-dom'
import { posts } from '../data/posts'
import { postComponents } from '../content/posts/index'

export default function Post() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) return <Navigate to="/writing" replace />

  const Content = postComponents[slug]
  if (!Content) return <Navigate to="/writing" replace />

  const related = posts
    .filter((p) => p.slug !== slug && p.tags?.some((t) => post.tags?.includes(t)))
    .slice(0, 3)

  return (
    <article style={{ paddingTop: '4rem' }}>
      <Link
        to="/writing"
        style={{ color: '#444', fontSize: '0.8rem', display: 'block', marginBottom: '2.5rem' }}
      >
        ← writing
      </Link>

      <header style={{ marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '1px solid #181818' }}>
        <h1 style={{
          fontSize: '1.4rem',
          fontWeight: '400',
          color: '#f0f0f0',
          lineHeight: 1.3,
          marginBottom: '0.75rem',
        }}>
          {post.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: '#444', fontSize: '0.78rem' }}>{post.date}</span>
          {post.substackLink && (
            <a
              href={post.substackLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#444', fontSize: '0.78rem', letterSpacing: '0.04em' }}
              onMouseEnter={e => (e.target.style.color = '#888')}
              onMouseLeave={e => (e.target.style.color = '#444')}
            >
              read on substack ↗
            </a>
          )}
        </div>
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/writing?tag=${encodeURIComponent(tag)}`}
                style={{
                  color: '#555',
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  border: '1px solid #222',
                  padding: '0.15rem 0.5rem',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e0e0e0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#555')}
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </header>

      <Content />

      {related.length > 0 && (
        <section style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #181818' }}>
          <p style={{ color: '#444', fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            related
          </p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {related.map((p) => {
              const href = p.slug ? `/writing/${p.slug}` : p.link
              const isInternal = !!p.slug
              return isInternal ? (
                <Link
                  key={p.slug}
                  to={href}
                  style={relatedItemStyle}
                  onMouseEnter={e => (e.currentTarget.querySelector('.related-title').style.color = '#f0f0f0')}
                  onMouseLeave={e => (e.currentTarget.querySelector('.related-title').style.color = '#e0e0e0')}
                >
                  <span className="related-title" style={{ color: '#e0e0e0', fontSize: '0.9rem', transition: 'color 0.15s' }}>{p.title}</span>
                  <span style={{ color: '#333', fontSize: '0.75rem' }}>{p.date}</span>
                </Link>
              ) : (
                <a
                  key={p.link}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={relatedItemStyle}
                  onMouseEnter={e => (e.currentTarget.querySelector('.related-title').style.color = '#f0f0f0')}
                  onMouseLeave={e => (e.currentTarget.querySelector('.related-title').style.color = '#e0e0e0')}
                >
                  <span className="related-title" style={{ color: '#e0e0e0', fontSize: '0.9rem', transition: 'color 0.15s' }}>{p.title} ↗</span>
                  <span style={{ color: '#333', fontSize: '0.75rem' }}>{p.date}</span>
                </a>
              )
            })}
          </div>
        </section>
      )}
    </article>
  )
}

const relatedItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '1rem',
  padding: '0.9rem 0',
  borderBottom: '1px solid #181818',
  textDecoration: 'none',
  cursor: 'pointer',
}
