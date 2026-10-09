import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Ticker from './Ticker'

const line = { duration: 0.35, ease: [0.76, 0, 0.24, 1] }

export default function TopBar({ theme, onToggleTheme, menuOpen, onToggleMenu }) {
  const barRef = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('.bar__cell', {
        yPercent: -100,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      })
    }, barRef)
    return () => ctx.revert()
  }, [])

  const dark = theme === 'dark'

  return (
    <header className="bar" ref={barRef}>
      <a className="bar__cell bar__logo" href="#" aria-label="Portfolio 2026 — home">
        Portfolio 2026
      </a>

      <div className="bar__cell bar__ticker">
        <Ticker />
      </div>

      <div className="bar__cell bar__controls">
        <button
          className="theme"
          type="button"
          role="switch"
          aria-checked={dark}
          aria-label="Dark mode"
          onClick={onToggleTheme}
        >
          <span className="theme__label">{dark ? 'DARK' : 'LIGHT'}</span>
          <span className="theme__box" data-on={dark}>
            <motion.span
              className="theme__fill"
              initial={false}
              animate={{ scale: dark ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
        </button>

        <button
          className="burger"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={onToggleMenu}
        >
          <motion.span
            className="burger__line"
            initial={false}
            animate={menuOpen ? { y: 0, rotate: 45 } : { y: -7, rotate: 0 }}
            transition={line}
          />
          <motion.span
            className="burger__line"
            initial={false}
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0.2 : 1 }}
            transition={line}
          />
          <motion.span
            className="burger__line"
            initial={false}
            animate={menuOpen ? { y: 0, rotate: -45 } : { y: 7, rotate: 0 }}
            transition={line}
          />
        </button>
      </div>
    </header>
  )
}
