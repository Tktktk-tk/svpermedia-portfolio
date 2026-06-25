import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loading from './components/Loading.jsx'
import Home from './pages/Home.jsx'

export default function App() {
  const [loading, setLoading] = useState(true)

  // lock scroll while the loader is up; when entering, start the page at the top
  useEffect(() => {
    document.body.classList.toggle('no-scroll', loading)
    if (!loading) {
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'   // jump instantly (don't animate from wherever)
      window.scrollTo(0, 0)
      html.style.scrollBehavior = prev
    }
    return () => document.body.classList.remove('no-scroll')
  }, [loading])

  return (
    <>
      <Home onReplayIntro={() => setLoading(true)} />
      <AnimatePresence>
        {loading && <Loading key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>
    </>
  )
}
