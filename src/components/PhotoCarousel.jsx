import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useMediaFiles from './useMediaFiles.js'

// Shows real photos from <folder>/Photos if present, otherwise placeholder
// tiles sized to `fallbackCount`. A random photo is shown first as the "hero".
export default function PhotoCarousel({ folder, fallbackCount = 0 }) {
  const files = useMediaFiles(folder, 'Photos', ['jpg', 'jpeg', 'png'])
  const count = files.length || fallbackCount
  const hasReal = files.length > 0

  const heroIdx = useMemo(
    () => (count > 0 ? Math.floor(Math.random() * count) : 0),
    [count],
  )
  const [idx, setIdx] = useState(0)
  useEffect(() => setIdx(heroIdx), [heroIdx])

  if (count === 0) return null

  const prev = () => setIdx((i) => (i - 1 + count) % count)
  const next = () => setIdx((i) => (i + 1) % count)
  const isHero = idx === heroIdx

  return (
    <div className="photo-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="carousel-frame"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.22 }}
        >
          {hasReal ? (
            <img src={files[idx]} alt={isHero ? 'hero' : `photo ${idx + 1}`}
                 className={`carousel-img${isHero ? ' hero' : ''}`} />
          ) : (
            <div className="carousel-placeholder always">
              <span>{isHero ? 'hero image' : `photo ${idx + 1}`}</span>
            </div>
          )}
        </motion.div>
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
