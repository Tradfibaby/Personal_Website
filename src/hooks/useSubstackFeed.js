import { useState, useEffect } from 'react'

const FEED_URL = 'https://incoherentyapping.substack.com/feed'
const PROXY_URL = `https://corsproxy.io/?url=${encodeURIComponent(FEED_URL)}`

function formatDate(str) {
  const d = new Date(str)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function stripTags(html) {
  return html?.replace(/<[^>]*>/g, '').trim() || ''
}

// getElementsByTagName is more reliable than querySelector for RSS XML
function getText(el, tag) {
  return el.getElementsByTagName(tag)[0]?.textContent?.trim() || ''
}

async function fetchFeed() {
  // Try direct first (works if Substack allows CORS), fall back to proxy
  try {
    const res = await fetch(FEED_URL)
    if (!res.ok) throw new Error('bad status')
    return await res.text()
  } catch {
    const res = await fetch(PROXY_URL)
    if (!res.ok) throw new Error('proxy failed')
    return await res.text()
  }
}

export function useSubstackFeed(limit) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFeed()
      .then(text => {
        const doc = new DOMParser().parseFromString(text, 'text/xml')
        const items = [...doc.getElementsByTagName('item')]
        const parsed = items.slice(0, limit ?? items.length).map(item => {
          const title = getText(item, 'title')
          // <link> can be tricky in XML — guid is always the canonical URL on Substack
          const link = getText(item, 'guid') || getText(item, 'link')
          const date = formatDate(getText(item, 'pubDate'))
          const description = stripTags(getText(item, 'description')).slice(0, 160)
          return { title, link, date, description }
        })
        setPosts(parsed)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [limit])

  return { posts, loading, error }
}
