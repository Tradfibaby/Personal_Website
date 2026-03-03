import { motion } from "motion/react"
import { useEffect, useState } from "react"

export const TypewriterEffect = ({
  text,
  style,
  className,
  cursorClassName,
  enabled = true,
  onComplete,
  charDelay = 35,
}) => {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let current = 0
    const interval = setInterval(() => {
      current += 1
      setCount(current)
      if (current >= text.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, charDelay)
    return () => clearInterval(interval)
  }, [enabled])

  return (
    <span style={style} className={className}>
      {text.slice(0, count)}
      {enabled && !done && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          style={{
            display: 'inline-block',
            borderRadius: '2px',
            width: '2px',
            height: '0.85em',
            background: '#555',
            verticalAlign: 'middle',
            marginLeft: '2px',
          }}
          className={cursorClassName}
        />
      )}
    </span>
  )
}
