import { useState, useEffect } from 'react'

const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent('https://incoherentyapping.substack.com/feed')}`

function formatDate(str) {
  const d = new Date(str)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function stripTags(html) {
  return html?.replace(/<[^>]*>/g, '').trim() || ''
}

export function useSubstackFeed(limit) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(API_URL)
      .then(res => { if (!res.ok) throw new Error('feed failed'); return res.json() })
      .then(data => {
        if (data.status !== 'ok') throw new Error('feed error')
        const parsed = (data.items ?? []).slice(0, limit ?? data.items.length).map(item => ({
          title: item.title,
          link: item.guid || item.link,
          date: formatDate(item.pubDate),
          description: stripTags(item.description).slice(0, 160),
        }))
        setPosts(parsed)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [limit])

  return { posts, loading, error }
}
