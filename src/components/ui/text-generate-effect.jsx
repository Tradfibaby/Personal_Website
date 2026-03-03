import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"

export function TextGenerateEffect({
  words,
  style,
  className = "",
  filter = true,
  duration = 0.5,
  enabled = true,
  onComplete,
}) {
  const [scope, animate] = useAnimate()
  const wordsArray = words.trim().split(/\s+/)

  useEffect(() => {
    if (!enabled) return
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration,
        delay: stagger(0.08),
      }
    ).then(() => {
      onComplete?.()
    })
  }, [enabled])

  return (
    <p style={style} className={className}>
      <motion.span ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            style={{
              opacity: 0,
              filter: filter ? "blur(6px)" : "none",
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
