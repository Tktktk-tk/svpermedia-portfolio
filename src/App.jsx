import { Routes, Route } from 'react-router-dom'
import LoadingPage from './pages/LoadingPage.jsx'
import MapPage from './pages/MapPage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import BottomLogo from './components/BottomLogo.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/"       element={<LoadingPage />} />
        <Route path="/map"    element={<MapPage />} />
        <Route path="/about"  element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <BottomLogo />
    </div>
  )
}
