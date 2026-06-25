// Generates the readable media folder tree from the portfolio data.
// Run:  node scripts/make-media-folders.mjs
import { EXAMPLES } from '../src/data/portfolio.js'
import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

let made = 0
for (const e of EXAMPLES) {
  const base = join('public', 'media', ...e.folder.split('/'))
  const m = e.media || {}
  const subs = []
  if (m.videos) subs.push('Videos')
  if (m.photos) subs.push('Photos')
  if (m.gifs)   subs.push('Gifs')
  if (m.models) subs.push('Models')
  if (!subs.length) subs.push('Media')

  for (const s of subs) {
    const dir = join(base, s)
    mkdirSync(dir, { recursive: true })
    const keep = join(dir, '.gitkeep')
    if (!existsSync(keep)) writeFileSync(keep, '')
    made++
  }
  console.log(`  ${e.folder}  ->  [${subs.join(', ')}]`)
}
console.log(`\nDone. Created/ensured ${made} media subfolders.`)
