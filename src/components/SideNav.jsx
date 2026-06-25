import { useNavigate } from 'react-router-dom'

// Vertical About / Contact buttons pinned to the right edge of the screen.
export default function SideNav() {
  const nav = useNavigate()
  return (
    <div className="side-nav">
      <button onClick={() => nav('/about')}>about</button>
      <button onClick={() => nav('/contact')}>contact</button>
    </div>
  )
}
