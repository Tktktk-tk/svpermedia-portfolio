import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function InfoModal({ kind, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="info-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="info-card"
        initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="detail-close" onClick={onClose} aria-label="close">✕</button>
        {kind === 'about' ? (
          <>
            <h2>about</h2>
            <p>
              svpermedia’s portfolio. Displaying all forms of media from short to
              long form content within various categories — showing talent,
              process and passion.
            </p>
          </>
        ) : (
          <>
            <h2>contact</h2>
            <p className="big">+XX XXXXXXXXX</p>
            <p className="big">XXXXXXXXX@XXXXX.XXX</p>
            <p className="note">(update these in src/components/InfoModal.jsx)</p>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
