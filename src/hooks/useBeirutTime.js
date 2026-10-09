import { useEffect, useState } from 'react'

const TIME_ZONE = 'Asia/Beirut'

const timeFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

const zoneFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  timeZoneName: 'short',
})

function read() {
  const now = new Date()
  const zone = zoneFmt.formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? ''
  return { time: timeFmt.format(now), zone }
}

/** Live Beirut wall-clock, ticking once per second. */
export default function useBeirutTime() {
  const [now, setNow] = useState(read)

  useEffect(() => {
    let id
    const tick = () => {
      setNow(read())
      id = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    id = setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => clearTimeout(id)
  }, [])

  return now
}
