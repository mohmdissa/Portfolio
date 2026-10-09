import { useState } from 'react'
import { motion } from 'framer-motion'

const transition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] }

const state = (visible, dir) => ({
  opacity: visible ? 1 : 0,
  y: visible ? 0 : dir * 18,
  filter: visible ? 'blur(0px)' : 'blur(10px)',
})

/** Arabic name that morphs into the Latin spelling on hover / focus / tap. */
export default function Name() {
  const [latin, setLatin] = useState(false)

  return (
    <h1
      className="name"
      tabIndex={0}
      aria-label="محمد عيسى — Mohammad Issa"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setLatin(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setLatin(false)}
      onFocus={() => setLatin(true)}
      onBlur={() => setLatin(false)}
    >
      <motion.span
        className="name__ar"
        lang="ar"
        dir="rtl"
        aria-hidden="true"
        initial={false}
        animate={state(!latin, -1)}
        transition={transition}
      >
        محمد عيسى
      </motion.span>
      <motion.span
        className="name__en"
        lang="en"
        aria-hidden="true"
        initial={false}
        animate={state(latin, 1)}
        transition={transition}
      >
        Mohammad Issa
      </motion.span>
    </h1>
  )
}
