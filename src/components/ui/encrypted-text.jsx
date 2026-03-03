import { useState, useEffect, useRef } from 'react'

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

function randomChar(charset) {
  return charset[Math.floor(Math.random() * charset.length)]
}

export function EncryptedText({
  text,
  revealDelayMs = 50,
  flipDelayMs = 50,
  charset = DEFAULT_CHARSET,
  encryptedClassName = '',
  revealedClassName = '',
  className = '',
  enabled = true,
  onComplete,
}) {
  const [chars, setChars] = useState(
    () => text.split('').map(() => ({ char: randomChar(charset), revealed: false }))
  )
  const flipRef = useRef(null)
  const timeoutsRef = useRef([])

  useEffect(() => {
    if (!enabled) return

    // Single shared interval for all unrevealed chars
    flipRef.current = setInterval(() => {
      setChars(prev => prev.map(c =>
        c.revealed ? c : { ...c, char: randomChar(charset) }
      ))
    }, flipDelayMs)

    // Individual reveal timeouts
    text.split('').forEach((letter, i) => {
      timeoutsRef.current[i] = setTimeout(() => {
        setChars(prev => prev.map((c, idx) =>
          idx === i ? { char: letter, revealed: true } : c
        ))
        if (i === text.length - 1) {
          clearInterval(flipRef.current)
          onComplete?.()
        }
      }, revealDelayMs * (i + 1))
    })

    return () => {
      clearInterval(flipRef.current)
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [enabled])

  return (
    <span className={className} style={{ opacity: enabled ? 1 : 0 }}>
      {chars.map((c, i) => (
        <span key={i} className={c.revealed ? revealedClassName : encryptedClassName}>
          {c.char}
        </span>
      ))}
    </span>
  )
}
