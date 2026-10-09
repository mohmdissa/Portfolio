import { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

// each word arrives from a different direction; `pull` is how strongly it follows the cursor
const WORDS = [
  { text: 'View', from: { x: -110, y: 0 }, pull: 0.55 },
  { text: 'my', from: { x: 0, y: 90 }, pull: 1 },
  { text: 'work', from: { x: 110, y: 0 }, pull: 0.75 },
  { text: '↓', from: { x: 0, y: -90 }, pull: 1.35, arrow: true },
]

function Word({ word, index, shown, sx, sy, hot }) {
  const x = useTransform(sx, (v) => v * word.pull)
  const y = useTransform(sy, (v) => v * word.pull)

  return (
    <span className="vw__line">
      <motion.span
        className="vw__enter"
        initial={false}
        animate={shown ? { x: 0, y: 0, opacity: 1 } : { ...word.from, opacity: 0 }}
        transition={{ duration: shown ? 1.15 : 0.45, ease, delay: shown ? index * 0.14 : 0 }}
      >
        <motion.span className="vw__mag" style={{ x, y }}>
          <motion.span
            className="vw__word"
            initial={false}
            animate={{ opacity: hot ? 1 : 0.62 }}
            transition={{ duration: 0.5, ease }}
          >
            {word.arrow ? (
              <motion.span
                style={{ display: 'inline-block' }}
                animate={shown ? { y: ['0%', '12%', '0%'] } : { y: '0%' }}
                transition={
                  shown ? { duration: 2.6, ease: 'easeInOut', repeat: Infinity, delay: 1.4 } : { duration: 0.3 }
                }
              >
                {word.text}
              </motion.span>
            ) : (
              word.text
            )}
          </motion.span>
        </motion.span>
      </motion.span>
    </span>
  )
}

/** "View / my / work / ↓" — scroll-triggered word-by-word entrance + magnetic hover. */
export default function ViewWork({ shown }) {
  const [hot, setHot] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 110, damping: 16, mass: 0.7 })
  const sy = useSpring(my, { stiffness: 110, damping: 16, mass: 0.7 })

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 46)
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 46)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
    setHot(false)
  }

  return (
    <a
      className="vw"
      href="#work"
      aria-label="View my work"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHot(true)}
      onPointerMove={(e) => e.pointerType === 'mouse' && onMove(e)}
      onPointerLeave={reset}
      onFocus={() => setHot(true)}
      onBlur={reset}
    >
      {WORDS.map((w, i) => (
        <Word key={w.text} word={w} index={i} shown={shown} sx={sx} sy={sy} hot={hot} />
      ))}
    </a>
  )
}
