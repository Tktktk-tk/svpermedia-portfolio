// Faint logo watermark behind everything (25% opacity).
// Drop your logo at /public/logo.png and it appears automatically.
// Until then, a placeholder wordmark shows.
export default function LogoBackdrop() {
  return (
    <div className="logo-backdrop" aria-hidden="true">
      <img
        src="./logo.png"
        alt=""
        onError={(e) => {
          // No logo uploaded yet -> fall back to a text wordmark.
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextSibling.style.display = 'block'
        }}
      />
      <span className="logo-fallback" style={{ display: 'none' }}>svpermedia</span>
    </div>
  )
}
