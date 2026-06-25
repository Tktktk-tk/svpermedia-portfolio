import { motion } from 'framer-motion'

// A single glowing nucleus blob. Uses screen blending so overlaps glow
// like a Venn diagram. `level` controls brightness tier:
//   nucleus (75%), category (50%), example (25%), filled (brighter — has media)
const ALPHA = { nucleus: 0.75, category: 0.5, example: 0.25, filled: 0.85 }
// extra glow spread for the "has media" tier
const GLOW = { filled: 0.32 }

export default function Nucleus({ color, size = 150, level = 'nucleus', dim = false, style }) {
  const a = ALPHA[level]
  const spread = GLOW[level] ?? 0.18
  return (
    <motion.div
      className="nucleus"
      animate={{ opacity: dim ? 0.12 : 1 }}
      transition={{ duration: 0.35 }}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 50% 45%, ${color}, ${color}00 70%)`,
        boxShadow: `0 0 ${size * 0.55}px ${size * spread}px ${hexA(color, a * (level === 'filled' ? 0.8 : 0.6))}`,
        ...style,
      }}
    />
  )
}

// helper: append an alpha to a #rrggbb hex
function hexA(hex, alpha) {
  const n = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
  return hex + n.toString(16).padStart(2, '0')
}
