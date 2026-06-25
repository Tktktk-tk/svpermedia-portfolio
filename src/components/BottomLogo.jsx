// Persistent logo/wordmark pinned to the bottom centre of every page.
// Drop logo.png into /public/ — if missing it falls back to the wordmark text.
export default function BottomLogo() {
  return (
    <div className="bottom-logo" aria-label="svpermedia">
      <img
        src="./logo.png"
        alt="svpermedia"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.nextSibling.style.display = 'block'
        }}
      />
      <span style={{ display: 'none' }}>svpermedia</span>
    </div>
  )
}
