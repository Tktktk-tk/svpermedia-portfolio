import { useState } from 'react'
import { motion } from 'framer-motion'
import { MEDIA_FILES } from '../data/mediaManifest'

// Intro loader. Shows /public/brand/intro/intro.gif (your looping logo
// animation) — it plays on repeat until the visitor clicks Enter.
// A "Preload all media" button under Enter downloads every media file in the
// background so projects open instantly once inside.
export default function Loading({ onDone }) {
  const [gifOk, setGifOk] = useState(true)
  const total = MEDIA_FILES.length
  const [pf, setPf] = useState({ state: 'idle', done: 0 }) // idle | loading | done

  function preloadAll() {
    if (pf.state !== 'idle' || total === 0) return
    setPf({ state: 'loading', done: 0 })
    Promise.all(
      MEDIA_FILES.map((f) =>
        fetch(encodeURI(f))
          .then((r) => r.blob())   // read fully -> warms the browser cache
          .catch(() => null)
          .finally(() => setPf((p) => ({ ...p, done: p.done + 1 }))),
      ),
    ).then(() => setPf((p) => ({ ...p, state: 'done' })))
  }

  const preloadLabel =
    pf.state === 'loading' ? `Loading ${pf.done} / ${total}…`
    : pf.state === 'done' ? 'All media ready ✓'
    : 'Preload all media'

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
        <button className="loading-enter" onClick={onDone}>Enter</button>
        {total > 0 && (
          <button
            className={`preload-btn${pf.state === 'done' ? ' done' : ''}`}
            onClick={preloadAll}
            disabled={pf.state !== 'idle'}
          >
            {preloadLabel}
          </button>
        )}
      </div>
    </motion.div>
  )
}
