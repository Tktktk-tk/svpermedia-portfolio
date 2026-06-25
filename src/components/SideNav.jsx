import { MEDIUMS } from '../data/structure'

// Vertical jump buttons — scroll back to a medium's section.
export default function SideNav({ active, onJump }) {
  return (
    <nav className="side-nav">
      {MEDIUMS.map((m) => (
        <button
          key={m.id}
          className={active === m.id ? 'active' : ''}
          onClick={() => onJump(m.id)}
        >
          {m.label}
        </button>
      ))}
    </nav>
  )
}
