import { useState } from 'react'
import SectionLabel from '../components/SectionLabel'
import { useSubstackFeed } from '../hooks/useSubstackFeed'

export default function Writing() {
  const { posts, loading, error } = useSubstackFeed()

  return (
    <section style={{ paddingTop: '4rem' }}>
      <h1 style={heading}>writing</h1>
      <SectionLabel>all posts</SectionLabel>

      {loading && (
        <p style={{ color: '#333', fontSize: '0.8rem' }}>loading...</p>
      )}

      {error && (
        <p style={{ color: '#444', fontSize: '0.8rem' }}>
          couldn't load posts.{' '}
          <a href="https://incoherentyapping.substack.com" target="_blank" rel="noopener noreferrer"
            style={{ textDecoration: 'underline', textDecorationColor: '#333', textUnderlineOffset: '3px' }}>
            read on substack ↗
          </a>
        </p>
      )}

      {!loading && !error && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {posts.map((post, i) => (
            <PostRow key={i} post={post} />
          ))}
        </div>
      )}
    </section>
  )
}

function PostRow({ post }) {
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
        padding: '1.1rem 0',
        borderBottom: '1px solid #181818',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
        <span style={{ color: hovered ? '#f0f0f0' : '#e0e0e0', fontSize: '0.9rem', transition: 'color 0.15s' }}>
          {post.title}
        </span>
        <span style={{ color: '#333', fontSize: '0.75rem', flexShrink: 0 }}>{post.date}</span>
      </div>
      {post.description && (
        <p style={{ color: '#4a4a4a', fontSize: '0.8rem', marginTop: '0.4rem', lineHeight: 1.6 }}>
          {post.description}
        </p>
      )}
    </a>
  )
}

const heading = {
  fontSize: '1.1rem',
  fontWeight: '400',
  color: '#f0f0f0',
  marginBottom: '2rem',
}
