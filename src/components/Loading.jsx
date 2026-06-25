import { useState } from 'react'
import { motion } from 'framer-motion'

// Intro loader. Shows /public/brand/intro/intro.gif (your looping logo
// animation) — it plays on repeat until the visitor clicks to enter.
// Falls back to an animated wordmark if the GIF isn't there yet.
export default function Loading({ onDone }) {
  const [gifOk, setGifOk] = useState(true)

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

      <button className="loading-enter" onClick={onDone}>Enter</button>
    </motion.div>
  )
}
