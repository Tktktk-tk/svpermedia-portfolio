import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { categoriesFor, examplesFor } from '../data/structure'
import ProjectCard from './ProjectCard.jsx'

// One central "page": big medium title, category jump-buttons, then a block per
// category (subheading + up to 4 project cards).
const MediumSection = forwardRef(function MediumSection({ medium, onOpenProject }, ref) {
  const cats = categoriesFor(medium.id)

  const jumpToCat = (catId) => {
    document.getElementById(`cat-${catId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={ref} id={`medium-${medium.id}`} className="medium-section" data-medium={medium.id}>
      <motion.div
        className="medium-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="medium-title">
          {medium.label}
          <em>{medium.tagline}</em>
        </h2>
        <p className="medium-intro">
          {medium.label} work, grouped by category. Tap a project to see the brief,
          the media, the engagement and how it connects across disciplines.
        </p>
      </motion.div>

      <div className="cat-bar">
        {cats.map((c) => (
          <button key={c.id} onClick={() => jumpToCat(c.id)}>{c.title}</button>
        ))}
      </div>

      {cats.map((c) => {
        const projects = examplesFor(c.id)
        if (!projects.length) return null
        return (
          <div key={c.id} id={`cat-${c.id}`} className="cat-block">
            <h3 className="cat-heading">{c.title} <span>{medium.label}</span></h3>
            <div className="project-grid">
              {projects.map((ex) => (
                <ProjectCard key={ex.id} ex={ex} onOpen={onOpenProject} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
})

export default MediumSection
