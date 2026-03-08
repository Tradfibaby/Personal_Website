import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"

export function TextGenerateEffect({
  words,
  style,
  className = "",
  filter = true,
  duration = 0.6,
  startDelay = 0,
  enabled = true,
  onComplete,
  instant = false,
}) {
  const [scope, animate] = useAnimate()
  const wordsArray = words.trim().split(/\s+/)

  useEffect(() => {
    if (instant) { onComplete?.(); return }
    if (!enabled) return
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(0.12, { startDelay }),
      }
    ).then(() => {
      onComplete?.()
    })
  }, [enabled, instant])

  return (
    <p style={style} className={className}>
      <motion.span ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            style={{
              opacity: instant ? 1 : 0,
              filter: instant ? "none" : (filter ? "blur(6px)" : "none"),
              display: "inline",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.span>
    </p>
  )
}
