import { writeFileSync } from 'fs'

const res = await fetch('https://incoherentyapping.substack.com/feed')
if (!res.ok) throw new Error(`Failed to fetch feed: ${res.status}`)
writeFileSync('public/feed.xml', await res.text())
console.log('Feed saved to public/feed.xml')
