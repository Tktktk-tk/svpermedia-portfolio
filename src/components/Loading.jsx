import { useState } from 'react'
import { motion } from 'framer-motion'
import { MEDIA_FILES } from '../data/mediaManifest'

// Intro loader. Shows /public/brand/intro/intro.gif (your looping logo
// animation). Clicking Enter preloads ALL media in the background (showing
// progress), then enters the site once everything is ready.
export default function Loading({ onDone }) {
  const [gifOk, setGifOk] = useState(true)
  const total = MEDIA_FILES.length
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(0)

  function enter() {
    if (loading) return
    if (total === 0) { onDone(); return }
    setLoading(true)
    setDone(0)
    Promise.all(
      MEDIA_FILES.map((f) =>
        fetch(encodeURI(f))
          .then((r) => r.blob())          // read fully -> warms the browser cache
          .catch(() => null)
          .finally(() => setDone((d) => d + 1)),
      ),
    ).then(() => onDone())                  // everything cached -> enter the site
  }

  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {gifOk ? (
        <img
          className="loading-gif"
          src="./brand/intro/intro.gif"
          alt="svpermedia"
          onError={() => setGifOk(false)}
        />
      ) : (
        <div className="loading-fallback">sv<em>per</em>media</div>
      )}

      <div className="loading-actions">
        <button className="loading-enter" onClick={enter} disabled={loading}>
          {loading ? `Loading ${done} / ${total}…` : 'Enter'}
        </button>
      </div>
    </motion.div>
  )
}
