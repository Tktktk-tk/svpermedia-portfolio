import { useState, lazy, Suspense, useEffect } from 'react'
import { motion } from 'framer-motion'
import { EXAMPLE_BY_ID, NODE_BY_ID } from '../data/portfolio'
import PhotoCarousel from './PhotoCarousel.jsx'
import GifCarousel from './GifCarousel.jsx'
import useMediaFiles from './useMediaFiles.js'

const Model3D = lazy(() => import('./Model3D.jsx'))
const fmt = (n) => n?.toLocaleString('en-US')
const MEDIUM_LABEL = { main: 'Videography', vfx: 'VFX', photo: 'Photography' }

export default function ProjectDetail({ example, onClose, onNavigate }) {
  const m = example.media || {}
  const eng = example.engagement
  // index of the single video currently unmuted (null = all muted).
  // Unmuting one mutes the rest, so audio never overlaps.
  const [unmutedIdx, setUnmutedIdx] = useState(null)

  const videoFiles = useMediaFiles(example.folder, 'Videos', ['mp4', 'webm'])
  const videoCount = videoFiles.length || m.videos || 0
  const modelFiles = useMediaFiles(example.folder, 'Models', ['glb', 'gltf'])
  const modelCount = modelFiles.length || m.models || 0

  // close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="detail-overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="detail-card"
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="detail-close" onClick={onClose} aria-label="close">✕</button>

        {/* scrolling content (close button stays fixed on the card) */}
        <div className="detail-scroll">
        {/* media column */}
        <div>
          <div className="detail-tag">{MEDIUM_LABEL[example.node]}</div>
          <h2 className="detail-title">{example.title}</h2>

          {Array.from({ length: videoCount }).map((_, i) => {
            const isMuted = unmutedIdx !== i
            return (
              <div className="media-tile video" key={`v${i}`}>
                <span className="tile-label">video {i + 1}</span>
                {videoFiles[i] ? (
                  <video className="tile-video" src={videoFiles[i]} autoPlay loop muted={isMuted} playsInline />
                ) : (
                  <div className="tile-placeholder"><em>insert video</em></div>
                )}
                <button
                  className="audio-btn"
                  title={isMuted ? 'unmute' : 'mute'}
                  onClick={() => setUnmutedIdx((cur) => (cur === i ? null : i))}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>
            )
          })}

          {m.photos ? <PhotoCarousel folder={example.folder} fallbackCount={m.photos} /> : null}

          {m.gifs ? (
            <GifCarousel folder={example.folder} fallbackCount={m.gifs} descriptions={example.gifDescriptions || []} />
          ) : null}

          {Array.from({ length: modelCount }).map((_, i) => (
            <div className={`media-tile model${example.id === 'vfx-backrooms' ? ' compact' : ''}`} key={`m${i}`}>
              <span className="tile-label">3D model {i + 1} · drag to rotate</span>
              {modelFiles[i] ? (
                <Suspense fallback={<div className="tile-placeholder"><em>loading 3D…</em></div>}>
                  <Model3D url={modelFiles[i]} />
                </Suspense>
              ) : (
                <div className="tile-placeholder"><em>drop a .glb in the Models folder</em></div>
              )}
            </div>
          ))}
        </div>

        {/* mobile-only close, centred under the media */}
        <button className="detail-close-mobile" onClick={onClose} aria-label="close">✕</button>

        {/* info column */}
        <div>
          <p className="detail-desc">{example.description}</p>

          {example.software?.length ? (
            <div className="detail-block">
              <h4>made with</h4>
              <div className="chips">{example.software.map((s) => <span className="chip" key={s}>{s}</span>)}</div>
            </div>
          ) : null}

          {eng && (
            <div className="detail-block">
              <h4>engagement</h4>
              <div className="stats">
                <div><strong>{fmt(eng.views)}</strong><span>views</span></div>
                <div><strong>{fmt(eng.likes)}</strong><span>likes</span></div>
              </div>
            </div>
          )}

          {example.links?.length ? (
            <div className="detail-block">
              <h4>connected work</h4>
              <div className="chips">
                {example.links.map((id) => {
                  const t = EXAMPLE_BY_ID[id]
                  if (!t) return null
                  return (
                    <button key={id} className="chip link" onClick={() => onNavigate(id)}>
                      → {MEDIUM_LABEL[t.node]}: {t.title}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}

          <p className="detail-folder">media folder: <code>public/media/{example.folder}/</code></p>
        </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
