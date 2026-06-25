import { useEffect, useState } from 'react'

// Probes public/media/<folder>/<sub>/ for files named 01, 02, 03 … and returns
// the list of URLs that actually exist (stops at the first gap). This lets the
// user just drop files in — no code or count edits needed.
//
//   folder : "Videography/Brands/Fabia"
//   sub    : "Photos" | "Videos" | "Gifs" | "Models"
//   exts   : ["jpg","jpeg","png"]  (tried in order per index)
export default function useMediaFiles(folder, sub, exts, max = 40) {
  const [urls, setUrls] = useState([])

  useEffect(() => {
    let cancelled = false
    const found = []

    async function exists(url) {
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (!res.ok) return false
        // Dev servers (Vite) serve index.html for missing paths, returning 200.
        // Accept any real asset (image / video / 3D model), reject the HTML fallback.
        const ct = (res.headers.get('content-type') || '').toLowerCase()
        return ct !== '' && !ct.includes('text/html')
      } catch {
        return false
      }
    }

    async function probe() {
      for (let i = 1; i <= max; i++) {
        const name = String(i).padStart(2, '0')
        let hit = null
        for (const ext of exts) {
          const url = encodeURI(`./media/${folder}/${sub}/${name}.${ext}`)
          // eslint-disable-next-line no-await-in-loop
          if (await exists(url)) { hit = url; break }
        }
        if (!hit) break
        found.push(hit)
      }
      if (!cancelled) setUrls(found)
    }

    setUrls([])
    if (folder) probe()
    return () => { cancelled = true }
  }, [folder, sub])

  return urls
}
