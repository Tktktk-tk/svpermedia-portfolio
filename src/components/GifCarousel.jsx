import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useMediaFiles from './useMediaFiles.js'

// Shows real gifs from <folder>/Gifs if present, otherwise placeholders sized
// to `fallbackCount`. Each step shows a description from `descriptions`.
export default function GifCarousel({ folder, fallbackCount = 0, descriptions = [] }) {
  const files = useMediaFiles(folder, 'Gifs', ['gif'])
  const count = files.length || fallbackCount
  const hasReal = files.length > 0
  const [idx, setIdx] = useState(0)

  if (count === 0) return null

  const prev = () => setIdx((i) => (i - 1 + count) % count)
  const next = () => setIdx((i) => (i + 1) % count)
  const desc = descriptions[idx] || `process step ${idx + 1}`

  return (
    <div className="gif-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="gif-frame"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {hasReal ? (
            <img src={files[idx]} alt={desc} className="gif-img" />
          ) : (
            <div className="carousel-placeholder always">
              <span>process gif {idx + 1}</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.p
          key={`desc-${idx}`}
          className="gif-desc"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.18 }}
        >
          {desc}
        </motion.p>
      </AnimatePresence>

      {count > 1 && (
        <div className="carousel-controls">
          <button onClick={prev} aria-label="previous">←</button>
          <span>{idx + 1} / {count}</span>
          <button onClick={next} aria-label="next">→</button>
        </div>
      )}
    </div>
  )
}
