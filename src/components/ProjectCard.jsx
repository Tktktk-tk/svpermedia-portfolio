import { motion } from 'framer-motion'
import { MEDIA_MANIFEST } from '../data/mediaManifest'

const SUB = { videos: 'Videos', photos: 'Photos', gifs: 'Gifs' }
const EXT = { videos: 'mp4', photos: 'jpg', gifs: 'gif' }

// Pick a preview file for the card from the media manifest (only the projects
// that actually have files get a visual; the rest are clean title blocks).
function previewFor(ex) {
  const man = MEDIA_MANIFEST[ex.id]
  if (!man || !man.hasFiles) return null
  const order =
    ex.node === 'photo' ? ['photos', 'videos', 'gifs']
    : ex.node === 'vfx' ? ['gifs', 'videos', 'photos']
    : ['videos', 'photos', 'gifs']
  const type = order.find((t) => man[t])
  if (!type) return null
  return { type, url: encodeURI(`./media/${ex.folder}/${SUB[type]}/01.${EXT[type]}`) }
}

export default function ProjectCard({ ex, onOpen }) {
  const preview = previewFor(ex)

  return (
    <motion.button
      type="button"
      className="project-card"
      onClick={() => onOpen(ex.id)}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {preview && (
        <>
          {preview.type === 'videos' ? (
            <video className="card-media" src={preview.url} autoPlay loop muted playsInline />
          ) : (
            <img className="card-media" src={preview.url} alt="" loading="lazy"
                 onError={(e) => { e.currentTarget.style.display = 'none' }} />
          )}
          <div className="card-overlay" />
        </>
      )}
      <span className="card-title">{ex.title}</span>
      {preview ? (
        <span className="card-meta">
          <span>view project</span><span className="card-dot" />
        </span>
      ) : (
        <span className="card-empty-note">coming soon</span>
      )}
    </motion.button>
  )
}
