import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { posts } from '../data/posts'

const allTags = [...new Set(posts.flatMap((p) => p.tags ?? []))].sort()

export default function Writing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get('tag')

  const filtered = activeTag
    ? posts.filter((p) => p.tags?.includes(activeTag))
    : posts

  function toggleTag(tag) {
    if (activeTag === tag) {
      setSearchParams({})
    } else {
      setSearchParams({ tag })
    }
  }

  return (
    <section style={{ paddingTop: '4rem' }}>
      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'var(--bg)', padding: '0.1rem 0' }}>
        <h1 style={heading}>writing</h1>
        <a
          href="https://incoherentyapping.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#444', fontSize: '0.8rem', letterSpacing: '0.05em' }}
          onMouseEnter={e => (e.target.style.color = '#888')}
          onMouseLeave={e => (e.target.style.color = '#444')}
        >
          substack ↗
        </a>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            style={{
              background: 'none',
              border: `1px solid ${activeTag === tag ? '#555' : '#222'}`,
              color: activeTag === tag ? '#e0e0e0' : '#555',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              padding: '0.15rem 0.5rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { if (activeTag !== tag) { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#444' } }}
            onMouseLeave={e => { if (activeTag !== tag) { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#222' } }}
          >
            {tag}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {filtered.map((post, i) => (
          <PostRow key={post.slug ?? post.link ?? i} post={post} />
        ))}
      </div>
    </section>
  )
}

function PostRow({ post }) {
  const [hovered, setHovered] = useState(false)
  const isInternal = !!post.slug
  const href = isInternal ? `/writing/${post.slug}` : post.link

  const inner = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? '#f0f0f0' : '#e0e0e0', fontSize: '0.9rem', transition: 'color 0.15s' }}>
          {post.title}{!isInternal ? ' ↗' : ''}
        </span>
        <span style={{ color: '#333', fontSize: '0.75rem', flexShrink: 0 }}>{post.date}</span>
      </div>
      {post.description && (
        <p style={{ color: '#4a4a4a', fontSize: '0.8rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
          {post.description}
        </p>
      )}
    </>
  )

  const sharedStyle = {
    display: 'block',
    padding: '1.1rem 0',
    borderBottom: '1px solid #181818',
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: 'var(--bg)',
  }

  return isInternal ? (
    <Link
      to={href}
      style={sharedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </Link>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={sharedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </a>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: 0,
}
