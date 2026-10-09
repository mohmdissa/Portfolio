import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import Name from './Name'
import WordReveal from './WordReveal'

const WORD = 'DEVELOPER'
const GUTTER = 20
const STRETCH = 1.17 // horizontal stretch of DEVELOPER on desktop

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function Hero() {
  const root = useRef(null)
  const dev = useRef(null)
  const devText = useRef(null)
  const fig = useRef(null)
  const svg = useRef(null)
  const wire = useRef(null)
  const anchor = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cancelled = false
    let drawn = false

    /** Stretch the word to fill its slot and route the wire: bottom guide → left guide line → nav. */
    const layout = () => {
      const text = devText.current
      text.style.setProperty('--sx', 1)
      const fit = clamp((dev.current.clientWidth - GUTTER) / text.offsetWidth, 0.5, 2.8)
      const sx = window.matchMedia('(max-width: 800px)').matches ? fit : Math.min(fit, STRETCH)
      text.style.setProperty('--sx', sx)

      const w = root.current.clientWidth
      const h = root.current.clientHeight
      const y = anchor.current.offsetTop
      const x = anchor.current.offsetLeft

      svg.current.setAttribute('viewBox', `0 0 ${w} ${h}`)
      wire.current.setAttribute('d', `M0 ${y} H${x} V0`)
      const at = (sel, cx, cy) => {
        const el = svg.current.querySelector(sel)
        el.setAttribute('cx', cx)
        el.setAttribute('cy', cy)
      }
      at('.wire__corner', x, y)
      at('.wire__top', x, 0)
      at('.wire__pulse', x, y)
      if (drawn) gsap.set(wire.current, { strokeDasharray: 'none' })
    }

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.set('.dev__ch > span', { yPercent: 110 })
        gsap.set('.portrait__reveal', { clipPath: 'inset(100% 0% 0% 0%)' })
        gsap.set(['.name', '.meta > *'], { opacity: 0, y: 24 })
        gsap.set('.wire__node', { opacity: 0, scale: 0, transformOrigin: '50% 50%' })
      }

      const play = () => {
        layout()
        if (reduce) {
          drawn = true
          gsap.set(wire.current, { strokeDasharray: 'none' })
          return
        }

        const len = wire.current.getTotalLength()
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(
          wire.current,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
              drawn = true
              gsap.set(wire.current, { strokeDasharray: 'none' })
            },
          },
          0.2,
        )
          .to('.dev__ch > span', { yPercent: 0, duration: 1.1, stagger: 0.05 }, 0.15)
          .to('.portrait__reveal', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' }, 0.35)
          .fromTo('.portrait', { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0.35)
          .to('.name', { opacity: 1, y: 0, duration: 1 }, 1.2)
          .to('.meta > *', { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 1.2)
          .to('.wire__node', { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(3)' }, 2)
          .add(() => {
            // slow signal travelling along the wire
            const pulse = svg.current.querySelector('.wire__pulse')
            const total = wire.current.getTotalLength()
            const p = { t: 0 }
            gsap.set(pulse, { opacity: 1 })
            gsap.to(p, {
              t: 1,
              duration: 5,
              ease: 'power1.inOut',
              repeat: -1,
              repeatDelay: 1.2,
              onUpdate: () => {
                const pt = wire.current.getPointAtLength(p.t * total)
                pulse.setAttribute('cx', pt.x)
                pulse.setAttribute('cy', pt.y)
              },
            })
          }, 2)

        // subtle idle float on the portrait
        gsap.to('.portrait__float', { y: -8, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      }

      layout()
      Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]).then(() => {
        if (!cancelled) play()
      })

      // pointer parallax
      if (!reduce && window.matchMedia('(hover: hover)').matches) {
        const figX = gsap.quickTo(fig.current, 'x', { duration: 1.1, ease: 'power3.out' })
        const figY = gsap.quickTo(fig.current, 'y', { duration: 1.1, ease: 'power3.out' })
        const devX = gsap.quickTo(devText.current, 'x', { duration: 1.4, ease: 'power3.out' })
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          figX(nx * -8)
          figY(ny * -5)
          devX(nx * 14)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      }
    }, root)

    const ro = new ResizeObserver(layout)
    ro.observe(root.current)

    return () => {
      cancelled = true
      ro.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section className="hero" ref={root}>
      <svg className="wire" ref={svg} aria-hidden="true">
        <path className="wire__path" ref={wire} />
        <circle className="wire__node wire__corner" r="3.5" />
        <circle className="wire__node wire__top" r="5" />
        <circle className="wire__pulse" r="2.5" opacity="0" />
      </svg>

      <span className="wire-anchor" ref={anchor} aria-hidden="true" />

      <div className="dev" ref={dev} aria-label={WORD.toLowerCase()}>
        <span className="dev__text" ref={devText} aria-hidden="true">
          {[...WORD].map((c, i) => (
            <span className="dev__ch" key={i}>
              <span>{c}</span>
            </span>
          ))}
        </span>
      </div>

      <figure className="figure" ref={fig}>
        <Name />
        <div className="portrait__reveal">
          <div className="portrait__float">
            <img
              className="portrait"
              src="/portrait.webp"
              alt="Mohammad Issa photographing with a Canon camera"
              width="1024"
              height="1536"
              decoding="async"
              draggable="false"
            />
          </div>
        </div>
      </figure>

      <aside className="meta">
        <div className="meta__top">
          <span>(Index) 001</span>
          <span>Edition 2026</span>
        </div>
        <WordReveal className="meta__lead" text="I build complete digital experiences — from intuitive interfaces to reliable backend systems, combining clean design with powerful technology." />
        <dl className="meta__list">
          <div>
            <dt>Based</dt>
            <dd>Beirut, Lebanon</dd>
          </div>
          <div>
            <dt>Coords</dt>
            <dd>33.8938° N, 35.5018° E</dd>
          </div>
          <div>
            <dt>Focus</dt>
            <dd>Full-stack, Interfaces, Experiences</dd>
          </div>
        </dl>
      </aside>
    </section>
  )
}
