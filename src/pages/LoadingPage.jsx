import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { computeLayout, MAP_EXTENT } from '../layout'
import Nucleus from '../components/Nucleus.jsx'
import SideNav from '../components/SideNav.jsx'
import useSize from '../components/useSize.js'

const HOLD_MS = 6000

export default function LoadingPage() {
  const nav = useNavigate()
  const [wrapRef, { w, h }] = useSize()
  const { nuclei } = computeLayout()
  const scale = Math.min(w || 1000, h || 800) / (MAP_EXTENT * 1.7)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 55, damping: 18 })
  const sy = useSpring(my, { stiffness: 55, damping: 18 })

  function onMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - (r.left + r.width / 2)) / 16)
    my.set((e.clientY - (r.top + r.height / 2)) / 16)
  }

  const [progress, setProgress] = useState(0)
  const raf   = useRef(0)
  const start = useRef(0)

  function beginHold() {
    start.current = performance.now()
    const tick = (t) => {
      const p = Math.min(100, ((t - start.current) / HOLD_MS) * 100)
      setProgress(p)
      if (p >= 100) { nav('/map'); return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  function endHold() {
    cancelAnimationFrame(raf.current)
    setProgress(0)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div
      ref={wrapRef}
      className="page loading-page"
      onMouseMove={onMove}
      onMouseDown={beginHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
    >
      <SideNav />

      <div className="stage">
        {nuclei.map((n, i) => (
          <ParallaxNucleus
            key={n.id}
            n={n}
            scale={scale}
            sx={sx}
            sy={sy}
            depth={1 + i * 0.4}
            label={n.title}
          />
        ))}
      </div>

      <div className="hold-prompt">
        <p>click &amp; hold to enter</p>
        <div className="hold-bar">
          <div className="hold-fill" style={{ width: `${progress}%` }} />
        </div>
        {progress > 0 && <span className="hold-pct">{Math.round(progress)}%</span>}
      </div>
    </div>
  )
}

function ParallaxNucleus({ n, scale, sx, sy, depth, label }) {
  const tx   = useTransform(sx, (v) => v * depth)
  const ty   = useTransform(sy, (v) => v * depth)
  const size = 184 * scale

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `calc(50% + ${n.x * scale}px)`,
        top:  `calc(50% + ${n.y * scale}px)`,
        marginLeft: -size / 2,
        marginTop:  -size / 2,
        x: tx,
        y: ty,
      }}
    >
      <div style={{ position: 'relative', width: size, height: size }}>
        <Nucleus color={n.color} size={size} level="nucleus" />
        {label && (
          <div className="nucleus-label-wrap">
            <span className="nucleus-label">{label}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
