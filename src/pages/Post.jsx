import { useParams, Link, Navigate } from 'react-router-dom'
import { posts } from '../content/posts/index'

export default function Post() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) return <Navigate to="/writing" replace />

  const Content = post.component

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
        <span style={{ color: '#444', fontSize: '0.78rem' }}>{post.date}</span>
      </header>

      <div className="prose">
        <Content />
      </div>
    </article>
  )
}
