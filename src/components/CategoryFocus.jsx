import { motion } from 'framer-motion'
import { EXAMPLES, NODE_BY_ID } from '../data/portfolio'

const fmt = (n) => n?.toLocaleString('en-US')

export default function CategoryFocus({ category, onClose, onSelectExample }) {
  const node     = NODE_BY_ID[category.node]
  const projects = EXAMPLES.filter((e) => e.cat === category.id)

  return (
    <motion.div
      className="cat-focus-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="cat-focus-inner"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="cat-focus-node" style={{ color: node.color }}>
          {node.title}
        </span>
        <h2 className="cat-focus-title" style={{ '--c': node.color }}>
          {category.title}
        </h2>
        <ul className="cat-focus-list">
          {projects.map((ex) => (
            <li key={ex.id}>
              <button
                className="cat-focus-item"
                onClick={() => onSelectExample(ex.id)}
              >
                <span className="cfi-title">{ex.title}</span>
                {ex.engagement && (
                  <span className="cfi-stats">
                    {fmt(ex.engagement.views)} views · {fmt(ex.engagement.likes)} likes
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <p className="cat-focus-hint">click a project to explore — esc to close</p>
      </motion.div>
    </motion.div>
  )
}
