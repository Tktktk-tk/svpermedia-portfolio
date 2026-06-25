import { useState } from 'react'

// Fixed top header. Shows /public/brand/logo/logo.png in the corner,
// replacing the "svpermedia portfolio" wordmark. Falls back to text.
export default function Header() {
  const [logoOk, setLogoOk] = useState(true)
  return (
    <header className="site-header">
      <div className="brand-logo">
        {logoOk ? (
          <img src="./brand/logo/logo.png" alt="svpermedia" onError={() => setLogoOk(false)} />
        ) : (
          <span className="wordmark">svpermedia<span>portfolio</span></span>
        )}
      </div>
      <div className="header-tag">videography · photography · vfx</div>
    </header>
  )
}
