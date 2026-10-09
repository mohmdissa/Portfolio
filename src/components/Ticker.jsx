import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import useBeirutTime from '../hooks/useBeirutTime'

const COPIES = 8 // per half; each half must be wider than the visible window
const SPEED = 55 // px per second

function Half({ time, zone, hidden, innerRef }) {
  return (
    <div className="ticker__half" ref={innerRef} aria-hidden={hidden || undefined}>
      {Array.from({ length: COPIES }, (_, i) => (
        <span className="ticker__seg" key={i}>
          <span className="chip">BEIRUT, LEBANON</span>
          <span className="ticker__time">{time}</span>
          <span className="ticker__zone">{zone}</span>
          <span className="ticker__slash">/</span>
        </span>
      ))}
    </div>
  )
}

/** Infinite right-to-left marquee of the live Beirut clock. */
export default function Ticker() {
  const { time, zone } = useBeirutTime()
  const trackRef = useRef(null)
  const halfRef = useRef(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const half = halfRef.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let tween
    const build = () => {
      tween?.kill()
      gsap.set(track, { x: 0 })
      const w = half.offsetWidth
      if (!w) return
      // Two identical halves: sliding exactly one half left and repeating is seamless.
      tween = gsap.to(track, { x: -w, duration: w / SPEED, ease: 'none', repeat: -1 })
    }

    build()
    const ro = new ResizeObserver(build)
    ro.observe(half)
    document.fonts?.ready.then(build)
    return () => {
      ro.disconnect()
      tween?.kill()
    }
  }, [])

  return (
    <div className="ticker" role="timer" aria-label={`Beirut, Lebanon ${time}`}>
      <div className="ticker__track" ref={trackRef}>
        <Half time={time} zone={zone} innerRef={halfRef} />
        <Half time={time} zone={zone} hidden />
      </div>
    </div>
  )
}
