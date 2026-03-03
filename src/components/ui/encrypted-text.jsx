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
  onComplete,
}) {
  const [chars, setChars] = useState(
    () => text.split('').map(() => ({ char: randomChar(charset), revealed: false }))
  )
  const intervals = useRef([])
  const timeouts = useRef([])

  useEffect(() => {
    text.split('').forEach((letter, i) => {
      const interval = setInterval(() => {
        setChars(prev => prev.map((c, idx) =>
          idx === i && !c.revealed ? { ...c, char: randomChar(charset) } : c
        ))
      }, flipDelayMs)
      intervals.current[i] = interval

      const timeout = setTimeout(() => {
        clearInterval(intervals.current[i])
        setChars(prev => prev.map((c, idx) =>
          idx === i ? { char: letter, revealed: true } : c
        ))
        if (i === text.length - 1) {
          onComplete?.()
        }
      }, revealDelayMs * (i + 1))
      timeouts.current[i] = timeout
    })

    return () => {
      intervals.current.forEach(clearInterval)
      timeouts.current.forEach(clearTimeout)
    }
  }, [text, revealDelayMs, flipDelayMs, charset])

  return (
    <span className={className}>
      {chars.map((c, i) => (
        <span key={i} className={c.revealed ? revealedClassName : encryptedClassName}>
          {c.char}
        </span>
      ))}
    </span>
  )
}
