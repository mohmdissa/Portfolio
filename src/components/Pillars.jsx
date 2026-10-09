import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ViewWork from './ViewWork'

gsap.registerPlugin(ScrollTrigger)

const PILLARS = [
  { n: '01', label: 'Build' },
  { n: '02', label: 'Design' },
  { n: '03', label: 'Create' },
]

const BASE_ROT = { rotationX: -16, rotationY: 28 }
const REVEAL_AT = 0.76 // scroll progress at which "View my work" starts to arrive

function Cube({ pillar, main }) {
  return (
    <div className={main ? 'slot slot--main' : 'slot'}>
      <span className="slot__shadow leaf" aria-hidden="true" />
      <div className="cube">
        <div className="cube__float">
          <div className="cube__rot">
            <div className="face">
              <div className="face__glass leaf">
                <span className="face__n">{pillar.n}</span>
                <span className="face__plus">+</span>
                <span className="face__label">{pillar.label}</span>
                {main && (
                  <>
                    <img
                      className="showcase"
                      src="/showcase.webp"
                      alt="Mohammad standing in a ruined concrete shelter above snow-covered mountains"
                      width="1280"
                      height="960"
                      decoding="async"
                    />
                    <span className="showcase__cap">
                      <span>Selected work</span>
                      <span>Fig. 01</span>
                    </span>
                  </>
                )}
              </div>
              <span className="flap flap--top leaf" />
              <span className="flap flap--bottom leaf" />
              <span className="flap flap--left leaf" />
              <span className="flap flap--right leaf" />
              <span className="flap flap--back leaf" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Pillars() {
  const root = useRef(null)
  const target = useRef(null)
  const [shown, setShown] = useState(false)

  useLayoutEffect(() => {
    const el = root.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const navH = () => document.querySelector('.bar')?.offsetHeight ?? 76
    let isShown = false
    const setReveal = (v) => {
      if (v !== isShown) {
        isShown = v
        setShown(v)
      }
    }

    const ctx = gsap.context(() => {
      const slots = gsap.utils.toArray('.slot')
      const [main, ...rest] = slots
      const $ = (slot, sel) => slot.querySelector(sel)
      const mainCube = $(main, '.cube')

      // resting pose: every cube is a closed box seen from a 3/4 angle
      gsap.set(slots.map((s) => $(s, '.cube')), { xPercent: -50, yPercent: -50 })
      gsap.set(el.querySelectorAll('.cube__rot'), BASE_ROT)
      gsap.set(el.querySelectorAll('.flap--top'), { rotationX: 90 })
      gsap.set(el.querySelectorAll('.flap--bottom'), { rotationX: -90 })
      gsap.set(el.querySelectorAll('.flap--left'), { rotationY: -90 })
      gsap.set(el.querySelectorAll('.flap--right'), { rotationY: 90 })
      gsap.set($(main, '.showcase'), { scale: 1.35, clipPath: 'inset(32% 32% 32% 32% round 6px)' })

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: reduce
          ? undefined
          : {
              trigger: el,
              start: () => `top ${navH()}px`,
              end: () => `+=${window.innerHeight * 3}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => setReveal(self.progress > REVEAL_AT),
            },
      })

      const dx = () => {
        const s = main.getBoundingClientRect()
        const t = target.current.getBoundingClientRect()
        return t.left + t.width / 2 - (s.left + s.width / 2)
      }
      const dy = () => {
        const s = main.getBoundingClientRect()
        const t = target.current.getBoundingClientRect()
        return t.top + t.height / 2 - (s.top + s.height / 2)
      }

      // 1 — the other two pillars step aside, the first turns to face us and glides to the left
      tl.to(rest.flatMap((s) => [...s.querySelectorAll('.leaf')]), { opacity: 0, duration: 1, ease: 'power1.out' }, 0.1)
        .to(rest.map((s) => $(s, '.cube')), { x: 90, duration: 1.4 }, 0)
        .to(mainCube, { x: dx, y: dy, duration: 1.5 }, 0)
        .to($(main, '.cube__rot'), { rotationX: 0, rotationY: 0, duration: 1.4 }, 0)
        .to(main, { '--float': 0, duration: 1 }, 0)
        .to([$(main, '.face__n'), $(main, '.face__plus'), $(main, '.face__label')], { opacity: 0, duration: 0.5 }, 0.9)

        // 2 — the side faces melt away, leaving one clean pane that opens up into the image frame
        .to([...main.querySelectorAll('.flap')], { opacity: 0, duration: 0.8, ease: 'power1.inOut' }, 0.9)
        .to(
          mainCube,
          {
            width: () => target.current.getBoundingClientRect().width,
            height: () => target.current.getBoundingClientRect().height,
            duration: 1.8,
            ease: 'power3.inOut',
          },
          1.5,
        )
        .to($(main, '.face__glass'), { borderRadius: 18, duration: 1.4 }, 1.6)
        .to($(main, '.showcase'), { opacity: 1, duration: 0.5, ease: 'power1.out' }, 1.6)
        .to(
          $(main, '.showcase'),
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, duration: 1.8, ease: 'power3.inOut' },
          1.6,
        )
        .to($(main, '.showcase__cap'), { opacity: 1, duration: 0.8 }, 2.8)
        .to(
          $(main, '.face__glass'),
          { boxShadow: '0 50px 90px -40px rgba(11,42,107,0.55), 0 0 0 1px rgba(255,255,255,0.4)', duration: 1 },
          2.3,
        )
        .to({}, { duration: 0.6 }, 3.2) // hold on the finished composition

      if (reduce) {
        tl.progress(1)
        setReveal(true)
      }
    }, el)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className="pillars" id="pillars" ref={root}>
      <div className="pillars__head">
        <span>(02) Three pillars</span>
        <span>Scroll to open</span>
      </div>

      <div className="frame-target" ref={target} aria-hidden="true" />

      <div className="cubes">
        {PILLARS.map((p, i) => (
          <Cube key={p.n} pillar={p} main={i === 0} />
        ))}
      </div>

      <ViewWork shown={shown} />
    </section>
  )
}
