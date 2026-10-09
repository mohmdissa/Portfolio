import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LINKS = [
  { n: '01', label: 'Index', href: '#' },
  { n: '02', label: 'Work', href: '#work' },
  { n: '03', label: 'About', href: '#about' },
  { n: '04', label: 'Contact', href: '#contact' },
]

const ease = [0.76, 0, 0.24, 1]

export default function Menu({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          className="menu"
          aria-label="Main"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.7, ease }}
        >
          <ul className="menu__list">
            {LINKS.map((l, i) => (
              <li className="menu__item" key={l.n}>
                <motion.a
                  href={l.href}
                  onClick={onClose}
                  initial={{ y: '110%' }}
                  animate={{ y: 0, transition: { delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ y: '110%', transition: { duration: 0.35, ease } }}
                >
                  <span className="menu__n">{l.n}</span>
                  <span className="menu__label">{l.label}</span>
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
