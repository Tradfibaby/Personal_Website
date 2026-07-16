import { useState, useRef, useCallback, useEffect, useImperativeHandle, forwardRef } from 'react'

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
const randomChar = (cs) => cs[Math.floor(Math.random() * cs.length)]

/* Scrambles its text, each character settling back to its real value in a left-to-right
   wave. Runs on hover, and can also be fired imperatively via the ref (used when a parent
   card is the real hover target). Pass `revealWhen` to gate an initial scramble-in: the
   text stays hidden until it turns true, then scrambles into place - the nav uses this so
   the links appear once the intro is done. Leave it null for always-visible, hover-only. */
export const ScrambleText = forwardRef(function ScrambleText(
  { text, className = '', style, charset = DEFAULT_CHARSET, stepMs = 30, revealWhen = null, as: Tag = 'span', ...rest },
  ref,
) {
  const gated = revealWhen !== null
  const [display, setDisplay] = useState(gated ? '' : text)
  const [revealed, setRevealed] = useState(!gated)
  const timer = useRef(null)

  const run = useCallback(() => {
    clearInterval(timer.current)
    const chars = text.split('')
    // each character locks in a few frames after the one before it, so it resolves as a wave
    const ends = chars.map((_, i) => i * 2 + 4 + Math.floor(Math.random() * 6))
    const last = Math.max(0, ...ends)
    let frame = 0
    timer.current = setInterval(() => {
      setDisplay(chars.map((c, i) => (c === ' ' || frame >= ends[i] ? c : randomChar(charset))).join(''))
      if (frame++ >= last) { clearInterval(timer.current); setDisplay(text) }
    }, stepMs)
  }, [text, charset, stepMs])

  useImperativeHandle(ref, () => ({ scramble: run }), [run])

  // first reveal: scramble the text in once its gate opens (or immediately when ungated)
  useEffect(() => {
    if (revealWhen && !revealed) { setRevealed(true); run() }
  }, [revealWhen])

  useEffect(() => () => clearInterval(timer.current), [])

  return (
    <Tag className={className} style={style} onMouseEnter={revealed ? run : undefined} {...rest}>
      {display}
    </Tag>
  )
})
