import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

const utilities = [
  {
    slug: 'hash',
    name: 'hash',
    description: 'sha-256 message hash',
  },
]

const EMPTY_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

function bytesToHex(buffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function sha256(message) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto is not available in this browser context.')
  }

  const data = new TextEncoder().encode(message)
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data)
  return bytesToHex(digest)
}

export default function Utility() {
  const { slug } = useParams()

  if (slug === 'hash') return <MessageHash />
  if (slug) return <Navigate to="/utilities" replace />

  return <UtilityIndex />
}

function UtilityIndex() {
  return (
    <section className="utility-page">
      <header className="utility-header">
        <p className="utility-kicker">▪ utilities</p>
        <h1>utilities</h1>
        <p>small tools i am building.</p>
      </header>

      <div className="utility-grid">
        {utilities.map((utility) => (
          <Link key={utility.slug} to={`/utilities/${utility.slug}`} className="utility-card wireframe-card">
            <span className="wireframe-card-inner" aria-hidden="true" />
            <span className="utility-card-top">
              <span className="utility-card-name">{utility.name}</span>
              <span className="utility-card-mark">↗</span>
            </span>
            <span className="utility-card-desc">{utility.description}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function MessageHash() {
  const [message, setMessage] = useState('')
  const [hash, setHash] = useState(EMPTY_SHA256)
  const [cryptoUnavailable, setCryptoUnavailable] = useState(false)

  useEffect(() => {
    let cancelled = false

    sha256(message)
      .then((nextHash) => {
        if (cancelled) return
        setHash(nextHash)
        setCryptoUnavailable(false)
      })
      .catch(() => {
        if (cancelled) return
        setHash('')
        setCryptoUnavailable(true)
      })

    return () => {
      cancelled = true
    }
  }, [message])

  return (
    <section className="utility-page">
      <Link to="/utilities" className="utility-back" aria-label="back to utilities">← utilities</Link>

      <header className="utility-header">
        <p className="utility-kicker">▪ utilities / hash</p>
        <h1>message hash</h1>
        <p>sha-256 digest for any message.</p>
      </header>

      <div className="utility-tool wireframe-card">
        <span className="wireframe-card-inner" aria-hidden="true" />

        <div className="utility-field">
          <label htmlFor="message-hash-input">message</label>
          <textarea
            id="message-hash-input"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            spellCheck="false"
            autoComplete="off"
            placeholder="type or paste text"
          />
        </div>

        <div className="utility-field">
          <label htmlFor="message-hash-output">hash</label>
          <textarea
            id="message-hash-output"
            className="utility-output"
            value={hash}
            readOnly
            placeholder={cryptoUnavailable ? 'web crypto is unavailable in this browser context' : ''}
          />
        </div>
      </div>
    </section>
  )
}
