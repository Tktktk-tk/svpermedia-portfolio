import { useState } from 'react'

// Bottom of the page — clickable logo that returns to the intro screen,
// plus About / Contact buttons.
export default function Footer({ onOpen, onIntro }) {
  const [logoOk, setLogoOk] = useState(true)
  return (
    <footer className="site-footer">
      <button className="footer-logo" onClick={onIntro} title="back to intro">
        {logoOk ? (
          <img src="./brand/logo/logo.png" alt="svpermedia" onError={() => setLogoOk(false)} />
        ) : (
          <span className="footer-mark">sv<em>per</em>media</span>
        )}
        <span className="footer-logo-caption">intro</span>
      </button>

      <div className="footer-actions">
        <button onClick={() => onOpen('about')}>About</button>
        <button onClick={() => onOpen('contact')}>Contact</button>
      </div>
      <div className="footer-fine">© {new Date().getFullYear()} svpermedia — all forms of media</div>
    </footer>
  )
}
