import { motion } from 'framer-motion'
import { MEDIUMS, SOFTWARE } from '../data/structure'

// "Muddled words" collage:
//   bold white words  = software / tools
//   italic accent words = mediums (clickable -> scroll to that section)
// Items are interleaved with varying sizes for an editorial, packed look.
const SIZES = ['s2', 's1', 's3', 's1', 's2', 's1', 's2']

export default function Hero({ onJump }) {
  // Interleave software + mediums into one flowing sequence.
  const items = []
  let si = 0
  const pushSoft = (n) => { for (let k = 0; k < n && si < SOFTWARE.length; k++, si++) items.push({ type: 'soft', text: SOFTWARE[si] }) }
  pushSoft(1); items.push({ type: 'medium', m: MEDIUMS[0] })
  pushSoft(2); items.push({ type: 'medium', m: MEDIUMS[1] })
  pushSoft(2); items.push({ type: 'medium', m: MEDIUMS[2] })
  pushSoft(SOFTWARE.length)

  return (
    <section className="hero">
      <div className="hero-kicker">svpermedia — a body of work</div>
      <motion.div
        className="word-cloud"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {items.map((it, i) => (
          <motion.span
            key={i}
            variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
            className={
              it.type === 'soft'
                ? `word soft ${SIZES[i % SIZES.length]}`
                : `word medium ${it.m.label === 'VFX' ? 's3' : 's3'}`
            }
            onClick={it.type === 'medium' ? () => onJump(it.m.id) : undefined}
          >
            {it.type === 'soft' ? it.text : it.m.label}
          </motion.span>
        ))}
      </motion.div>
      <div className="hero-scroll-hint">scroll, or tap a discipline above</div>
    </section>
  )
}
