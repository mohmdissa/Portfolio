import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

/** how strongly a word lights up, by distance (in words) from the one under the cursor */
const falloff = (d) => (d === 0 ? 1 : d === 1 ? 0.55 : d === 2 ? 0.25 : 0)

/**
 * Quiet sentence that reveals itself word by word under the cursor:
 * muted by default; the hovered word turns ink-blue with a hairline underline and a faint glow,
 * and its neighbours trail behind it.
 */
export default function WordReveal({ text, className }) {
  const reduce = useReducedMotion()
  const [inside, setInside] = useState(false)
  const [at, setAt] = useState(-1)
  const words = text.split(' ')

  const t = (d = 0.55) => (reduce ? { duration: 0 } : { duration: d, ease })

  return (
    <p
      className={className}
      onPointerEnter={() => setInside(true)}
      onPointerLeave={() => {
        setInside(false)
        setAt(-1)
      }}
    >
      <motion.span className="wr" initial={false} animate={{ opacity: inside ? 1 : 0.8 }} transition={t(0.7)}>
        {words.map((word, i) => {
          const f = at < 0 ? 0 : falloff(Math.abs(i - at))
          const here = i === at
          return (
            <span key={i}>
              <span
                className="wr__word"
                onPointerEnter={() => setAt(i)}
                onPointerDown={(e) => e.pointerType !== 'mouse' && setAt(i)}
              >
                <motion.span className="wr__glow" aria-hidden="true" initial={false} animate={{ opacity: here ? 1 : 0, scale: here ? 1 : 0.8 }} transition={t(0.6)} />
                <span className="wr__base">{word}</span>
                <motion.span className="wr__ink" aria-hidden="true" initial={false} animate={{ opacity: f }} transition={t(0.45)}>
                  {word}
                </motion.span>
                <motion.span className="wr__line" aria-hidden="true" initial={false} animate={{ scaleX: here ? 1 : 0 }} transition={t(0.5)} />
              </span>
              {i < words.length - 1 ? ' ' : null}
            </span>
          )
        })}
      </motion.span>
    </p>
  )
}
