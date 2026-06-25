import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { computeLayout, computeFillers, MAP_EXTENT } from '../layout'
import { NODE_BY_ID, EXAMPLE_BY_ID, CATEGORY_BY_ID, LINKS } from '../data/portfolio'
import { MEDIA_MANIFEST } from '../data/mediaManifest'
import Nucleus from '../components/Nucleus.jsx'
import SideNav from '../components/SideNav.jsx'
import FocusView from '../components/FocusView.jsx'
import CategoryFocus from '../components/CategoryFocus.jsx'
import useSize from '../components/useSize.js'

// Quadratic bezier path — curves perpendicular to the midpoint
function curvePath(x1, y1, x2, y2) {
  const mx  = (x1 + x2) / 2
  const my  = (y1 + y2) / 2
  const dx  = x2 - x1
  const dy  = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  if (len < 1) return `M${x1} ${y1}L${x2} ${y2}`
  const bow = Math.min(75, len * 0.26)
  // Control point offset perpendicular to the chord
  const cpx = mx + (-dy / len) * bow
  const cpy = my + (dx  / len) * bow
  return `M${x1} ${y1} Q${cpx} ${cpy} ${x2} ${y2}`
}

// Repulsion offset — pushes a node at (nx,ny) away from the hovered node at (hx,hy)
function repel(nx, ny, hx, hy, strength = 58) {
  const dx   = nx - hx
  const dy   = ny - hy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 5) return { x: 0, y: 0 }
  const force = Math.max(0, (330 - dist) / 330) * strength
  return { x: (dx / dist) * force, y: (dy / dist) * force }
}

export default function MapPage() {
  const nav = useNavigate()
  const [wrapRef, { w, h }] = useSize()
  const { nuclei, categories, examples } = useMemo(() => computeLayout(), [])
  const { fillers, links: fillerLinks } = useMemo(() => computeFillers(categories), [categories])
  const fillerById = useMemo(() => Object.fromEntries(fillers.map((f) => [f.id, f])), [fillers])

  const [hoveredExId, setHoveredExId] = useState(null)
  const [focusCatId,  setFocusCatId]  = useState(null)
  const [focusExId,   setFocusExId]   = useState(null)

  const scale = (Math.min(w || 1000, h || 800) / (MAP_EXTENT * 2)) * 0.81
  const cx    = (w || 0) / 2
  const cy    = (h || 0) / 2
  const spx   = (vx) => cx + vx * scale
  const spy   = (vy) => cy + vy * scale

  // Cursor parallax — all nodes float together
  const rawMx = useMotionValue(0)
  const rawMy = useMotionValue(0)
  const pmx   = useSpring(rawMx, { stiffness: 50, damping: 16 })
  const pmy   = useSpring(rawMy, { stiffness: 50, damping: 16 })

  function onMouseMove(e) {
    const r = e.currentTarget.getBoundingClientRect()
    rawMx.set((e.clientX - (r.left + r.width  / 2)) / 22)
    rawMy.set((e.clientY - (r.top  + r.height / 2)) / 22)
  }
  function onMouseLeave() { rawMx.set(0); rawMy.set(0) }

  // Undirected adjacency over all links (built once)
  const adjacency = useMemo(() => {
    const adj = {}
    for (const [a, b] of LINKS) {
      ;(adj[a] ||= []).push(b)
      ;(adj[b] ||= []).push(a)
    }
    return adj
  }, [])

  // Full connected component of the hovered node (transitive — so hovering ANY
  // Fabia node highlights Videography + VFX + Photography together).
  const connectedIds = useMemo(() => {
    if (!hoveredExId) return new Set()
    const seen = new Set([hoveredExId])
    const stack = [hoveredExId]
    while (stack.length) {
      const cur = stack.pop()
      for (const nb of adjacency[cur] || []) {
        if (!seen.has(nb)) { seen.add(nb); stack.push(nb) }
      }
    }
    return seen
  }, [hoveredExId, adjacency])

  // Screen-space position of the hovered example (for repulsion calc)
  const hovEx  = hoveredExId ? examples.find((e) => e.id === hoveredExId) : null
  const hovSX  = hovEx ? spx(hovEx.x) : 0
  const hovSY  = hovEx ? spy(hovEx.y) : 0

  // Active link keys — every link whose BOTH ends sit in the component
  const activeLinks = useMemo(() => {
    if (!hoveredExId) return new Set()
    const s = new Set()
    for (const [a, b] of LINKS) {
      if (connectedIds.has(a) && connectedIds.has(b)) s.add(`${a}::${b}`)
    }
    return s
  }, [hoveredExId, connectedIds])

  const anyFocus = !!(focusExId || focusCatId)

  // Escape key — peel back: example → category → map → loading
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (focusExId)  { setFocusExId(null);  return }
      if (focusCatId) { setFocusCatId(null); return }
      nav('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focusExId, focusCatId, nav])

  function goBack() {
    if (focusExId)  { setFocusExId(null);  return }
    if (focusCatId) { setFocusCatId(null); return }
    nav('/')
  }

  return (
    <div
      ref={wrapRef}
      className="page map-page"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <button className="go-back" onClick={goBack}>← go back</button>
      <SideNav />

      {/* ── parallax wrapper: everything inside drifts with the cursor ── */}
      <motion.div
        className="parallax-layer"
        style={{ x: pmx, y: pmy }}
      >
        {/* SVG connection lines */}
        <svg
          className="links-svg"
          style={{ position: 'absolute', left: 0, top: 0, width: w, height: h, overflow: 'visible' }}
        >
          <defs>
            <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* decorative filler connections (behind everything) */}
          {fillerLinks.map(([a, b], i) => {
            const fa = fillerById[a]
            const fb = fillerById[b]
            if (!fa || !fb) return null
            return (
              <motion.path
                key={`fl-${i}`}
                d={curvePath(spx(fa.x), spy(fa.y), spx(fb.x), spy(fb.y))}
                className="filler-path"
                animate={{ opacity: anyFocus || hoveredExId ? 0 : 0.5 }}
                transition={{ duration: 0.28 }}
              />
            )
          })}

          {LINKS.map(([a, b]) => {
            const ea = examples.find((e) => e.id === a)
            const eb = examples.find((e) => e.id === b)
            if (!ea || !eb) return null
            const key      = `${a}::${b}`
            const isActive = activeLinks.has(key)
            const opac     = anyFocus ? 0 : (hoveredExId ? (isActive ? 1 : 0) : 0.55)
            return (
              <motion.path
                key={key}
                d={curvePath(spx(ea.x), spy(ea.y), spx(eb.x), spy(eb.y))}
                className={`link-path${isActive ? ' active' : ''}`}
                animate={{ opacity: opac }}
                transition={{ duration: 0.28 }}
                filter={isActive ? 'url(#glow-line)' : undefined}
              />
            )
          })}
        </svg>

        {/* ── Decorative filler nodes (non-interactive) ── */}
        {fillers.map((f) => {
          const size = f.size * scale
          const opac = anyFocus || hoveredExId ? 0 : 0.6
          return (
            <motion.div
              key={f.id}
              className="node-anchor filler-node"
              style={{ left: spx(f.x), top: spy(f.y), zIndex: 6 }}
              animate={{ opacity: opac }}
              transition={{ duration: 0.3 }}
            >
              <Nucleus color={f.color} size={size} level="example" />
            </motion.div>
          )
        })}

        {/* ── Nuclei ── */}
        {nuclei.map((n) => {
          const size = 168 * scale
          const opac = anyFocus ? 0 : (hoveredExId ? 0.12 : 1)
          return (
            <motion.div
              key={n.id}
              className="node-anchor"
              style={{ left: spx(n.x), top: spy(n.y) }}
              animate={{ opacity: opac }}
              transition={{ duration: 0.3 }}
            >
              <div className="blob-wrap" style={{ width: size, height: size }}>
                <Nucleus color={n.color} size={size} level="nucleus" />
                <span className="center-label nucleus-center">{n.title}</span>
              </div>
            </motion.div>
          )
        })}

        {/* ── Category secondary nodes ── */}
        {categories.map((c) => {
          const node = NODE_BY_ID[c.node]
          const size = 90 * scale
          const push = hovEx
            ? repel(spx(c.x), spy(c.y), hovSX, hovSY, 45)
            : { x: 0, y: 0 }
          const opac = anyFocus ? 0 : (hoveredExId ? 0 : 1)
          return (
            <motion.div
              key={c.id}
              data-id={c.id}
              className="node-anchor cat-node"
              style={{ left: spx(c.x), top: spy(c.y) }}
              animate={{ x: push.x, y: push.y, opacity: opac }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              onClick={() => !hoveredExId && setFocusCatId(c.id)}
            >
              <div className="blob-wrap" style={{ width: size, height: size }}>
                <Nucleus color={node.color} size={size} level="category" />
                <span className="center-label cat-center">{c.title}</span>
              </div>
            </motion.div>
          )
        })}

        {/* ── Example sub-nodes ── */}
        {examples.map((e) => {
          const node       = NODE_BY_ID[e.node]
          const hasFiles   = !!MEDIA_MANIFEST[e.id]?.hasFiles  // brighter if real media
          const size       = (hasFiles ? 48 : 34) * scale
          const isHovered  = hoveredExId === e.id
          const isConnected = connectedIds.has(e.id)
          const push       = hovEx && !isConnected
            ? repel(spx(e.x), spy(e.y), hovSX, hovSY)
            : { x: 0, y: 0 }
          const opac       = anyFocus ? 0 : (hoveredExId ? (isConnected ? 1 : 0) : 1)
          const nodeScale  = isHovered ? 2.2 : (isConnected && hoveredExId ? 1.3 : 1)

          return (
            <motion.div
              key={e.id}
              data-id={e.id}
              className={`node-anchor ex-node${hasFiles ? ' has-media' : ''}`}
              style={{ left: spx(e.x), top: spy(e.y), zIndex: isHovered ? 30 : (hasFiles ? 12 : 8) }}
              animate={{ x: push.x, y: push.y, opacity: opac }}
              transition={{ type: 'spring', stiffness: 230, damping: 22 }}
              onMouseEnter={() => setHoveredExId(e.id)}
              onMouseLeave={() => setHoveredExId(null)}
              onClick={() => setFocusExId(e.id)}
            >
              {/* only the blob scales — the label stays a fixed, small size */}
              <motion.div
                className={`ex-blob${hasFiles ? ' filled' : ''}`}
                animate={{ scale: nodeScale }}
                transition={{ type: 'spring', stiffness: 230, damping: 22 }}
              >
                <Nucleus color={node.color} size={size} level={hasFiles ? 'filled' : 'example'} />
              </motion.div>
              <span className={`node-label${isHovered ? ' show' : ''}`}>{e.title}</span>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Overlays rendered outside parallax so they're stable ── */}
      <AnimatePresence>
        {focusCatId && !focusExId && (
          <CategoryFocus
            key={focusCatId}
            category={CATEGORY_BY_ID[focusCatId]}
            onClose={() => setFocusCatId(null)}
            onSelectExample={(id) => { setFocusCatId(null); setFocusExId(id) }}
          />
        )}
        {focusExId && (
          <FocusView
            key={focusExId}
            example={EXAMPLE_BY_ID[focusExId]}
            onClose={() => setFocusExId(null)}
            onNavigate={(id) => setFocusExId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
