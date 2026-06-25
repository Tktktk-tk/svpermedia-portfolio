import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MEDIUMS } from '../data/structure'
import { EXAMPLE_BY_ID } from '../data/portfolio'
import Header from '../components/Header.jsx'
import SideNav from '../components/SideNav.jsx'
import Hero from '../components/Hero.jsx'
import MediumSection from '../components/MediumSection.jsx'
import Footer from '../components/Footer.jsx'
import ProjectDetail from '../components/ProjectDetail.jsx'
import InfoModal from '../components/InfoModal.jsx'

export default function Home({ onReplayIntro }) {
  const [active, setActive] = useState(null)     // medium id currently in view
  const [projectId, setProjectId] = useState(null)
  const [info, setInfo] = useState(null)         // 'about' | 'contact'
  const sectionRefs = useRef({})

  const jumpTo = (id) =>
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  // track which section is in view → highlight side-nav
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.dataset.medium)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // lock background scroll while a modal is open — preserve scroll position
  // (plain overflow:hidden would jump the page to the top on open/close)
  useEffect(() => {
    const open = !!projectId || !!info
    if (open) {
      const y = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${y}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.dataset.lockY = String(y)
    } else if (document.body.dataset.lockY != null) {
      const y = parseInt(document.body.dataset.lockY, 10)
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      delete document.body.dataset.lockY
      window.scrollTo(0, y)
    }
  }, [projectId, info])

  return (
    <main className="home">
      <Header />
      <SideNav active={active} onJump={jumpTo} />

      <Hero onJump={jumpTo} />

      {MEDIUMS.map((m) => (
        <MediumSection
          key={m.id}
          medium={m}
          ref={(el) => { sectionRefs.current[m.id] = el }}
          onOpenProject={setProjectId}
        />
      ))}

      <Footer onOpen={setInfo} onIntro={onReplayIntro} />

      <AnimatePresence>
        {projectId && (
          <ProjectDetail
            key={projectId}
            example={EXAMPLE_BY_ID[projectId]}
            onClose={() => setProjectId(null)}
            onNavigate={(id) => setProjectId(id)}
          />
        )}
        {info && <InfoModal key={info} kind={info} onClose={() => setInfo(null)} />}
      </AnimatePresence>
    </main>
  )
}
