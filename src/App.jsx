import { useCallback, useEffect, useState } from 'react'
import TopBar from './components/TopBar'
import Menu from './components/Menu'
import Hero from './components/Hero'
import Pillars from './components/Pillars'
import WorkStub from './components/WorkStub'

export default function App() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <TopBar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((o) => !o)}
      />
      <Menu open={menuOpen} onClose={closeMenu} />
      <main>
        <Hero />
        <Pillars />
        <WorkStub />
      </main>
    </>
  )
}
