import { NODES, CATEGORIES, EXAMPLES } from './data/portfolio'

const deg = (d) => (d * Math.PI) / 180
const polar = (angleDeg, r) => ({ x: Math.cos(deg(angleDeg)) * r, y: Math.sin(deg(angleDeg)) * r })

// Deterministic pseudo-random jitter so the map looks organic but is stable.
function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function jitter(id, range) {
  const h = hash(id)
  const a = (h % 997) / 997
  const b = ((h >>> 9) % 991) / 991
  return { x: (a - 0.5) * 2 * range, y: (b - 0.5) * 2 * range }
}

const NODE_ANGLE = { main: 270, vfx: 30, photo: 150 }

const R_NUCLEUS  = 116  // main nuclei sit near the MIDDLE of the page
const R_CATEGORY = 300  // secondary nodes: between the middle and the edge
const R_EXAMPLE  = 100  // examples fan OUTWARD from each category, toward the edge

// Each node gets its own angular sector — kept narrow enough that the three
// sectors never bleed into each other (they're 120° apart).
const CAT_SPREAD = { main: 112, vfx: 60, photo: 86 }

function fan(centerAngle, count, spread) {
  if (count === 1) return [centerAngle]
  const start = centerAngle - spread / 2
  const step  = spread / (count - 1)
  return Array.from({ length: count }, (_, i) => start + i * step)
}

export function computeLayout() {
  const nuclei = NODES.map((n) => ({ ...n, ...polar(NODE_ANGLE[n.id], R_NUCLEUS) }))

  const categories = []
  for (const node of NODES) {
    const cats   = CATEGORIES.filter((c) => c.node === node.id)
    const angles = fan(NODE_ANGLE[node.id], cats.length, CAT_SPREAD[node.id])
    cats.forEach((c, i) => {
      const a = angles[i]
      const base = polar(a, R_CATEGORY)
      const j = jitter(c.id, 13)
      categories.push({ ...c, angle: a, x: base.x + j.x, y: base.y + j.y })
    })
  }

  const catById = Object.fromEntries(categories.map((c) => [c.id, c]))

  const examples = []
  for (const cat of categories) {
    const exs = EXAMPLES.filter((e) => e.cat === cat.id)
    // Fan examples around the category's OUTWARD direction (cat.angle points
    // away from centre) so they push toward the edge rather than ringing it.
    const spread = Math.min(118, 40 * (exs.length - 1))
    const angles = fan(cat.angle, exs.length, spread)
    exs.forEach((e, i) => {
      const exAngle = angles[i]
      const off = polar(exAngle, R_EXAMPLE)
      const j   = jitter(e.id, 12)
      examples.push({ ...e, angle: exAngle, x: cat.x + off.x + j.x, y: cat.y + off.y + j.y })
    })
  }

  return { nuclei, categories, examples, catById }
}

export const MAP_EXTENT = 470

// ============================================================================
//  FILLER NODES — purely decorative "projects" that fill the page and hint at
//  the sheer volume of work. They are NOT interactive and carry no content.
//  Some cluster around a category (same), some stand alone, and some link
//  across nodes (e.g. a videography dot tied to a photography dot).
// ============================================================================
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NODE_COLOR = Object.fromEntries(NODES.map((n) => [n.id, n.color]))
const MAX_R = 455 // keep fillers mostly on-screen

function clampToRadius(x, y, max) {
  const d = Math.hypot(x, y)
  if (d <= max) return { x, y }
  const k = max / d
  return { x: x * k, y: y * k }
}

export function computeFillers(categories) {
  const rnd = mulberry32(20260625)
  const fillers = []
  const links = []
  let idc = 0

  // 1) clusters scattered around each category (coloured by their node)
  const byNode = { main: [], vfx: [], photo: [] }
  for (const cat of categories) {
    const color = NODE_COLOR[cat.node]
    const count = 4 + Math.floor(rnd() * 4) // 4–7 per category
    const clusterIds = []
    for (let i = 0; i < count; i++) {
      const ang = rnd() * 360
      const rad = 55 + rnd() * 200
      const raw = {
        x: cat.x + Math.cos((ang * Math.PI) / 180) * rad,
        y: cat.y + Math.sin((ang * Math.PI) / 180) * rad,
      }
      const p = clampToRadius(raw.x, raw.y, MAX_R)
      const id = `fill-${idc++}`
      fillers.push({ id, x: p.x, y: p.y, color, size: 11 + rnd() * 18, node: cat.node })
      clusterIds.push(id)
      byNode[cat.node].push(id)
    }
    // connect a few within the cluster ("connected to same")
    for (let i = 1; i < clusterIds.length; i++) {
      if (rnd() < 0.4) links.push([clusterIds[0], clusterIds[i]])
    }
  }

  // 2) a ring of fillers around the perimeter to fill the empty corners
  for (let i = 0; i < 18; i++) {
    const ang = (360 / 18) * i + rnd() * 12
    const rad = 360 + rnd() * 95
    const p = clampToRadius(
      Math.cos((ang * Math.PI) / 180) * rad,
      Math.sin((ang * Math.PI) / 180) * rad,
      MAX_R,
    )
    // colour by nearest nucleus direction
    let node = 'main'
    if (ang > 330 || ang < 90) node = 'vfx'
    else if (ang >= 90 && ang < 210) node = 'photo'
    fillers.push({ id: `fill-${idc++}`, x: p.x, y: p.y, color: NODE_COLOR[node], size: 9 + rnd() * 14, node })
  }

  // 3) cross-node links (e.g. videography <-> photography) — "video to photo"
  const pickCross = (a, b) => {
    const arr1 = byNode[a], arr2 = byNode[b]
    if (!arr1.length || !arr2.length) return
    links.push([arr1[Math.floor(rnd() * arr1.length)], arr2[Math.floor(rnd() * arr2.length)]])
  }
  for (let i = 0; i < 5; i++) pickCross('main', 'photo')
  for (let i = 0; i < 3; i++) pickCross('main', 'vfx')
  for (let i = 0; i < 2; i++) pickCross('photo', 'vfx')

  return { fillers, links }
}
