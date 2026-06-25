// One-off: slow the intro gif 3x by tripling each frame's delay.
// Always derives from a kept backup so re-running stays 3x (not 9x).
import sharp from 'sharp'
import { copyFileSync, existsSync } from 'fs'

const src = 'public/brand/intro/intro.gif'
const backup = 'scripts/originals/intro.gif'  // kept out of public/ so it isn't served
const FACTOR = 3

if (!existsSync(backup)) copyFileSync(src, backup)

const meta = await sharp(backup, { animated: true }).metadata()
const orig = meta.delay || []
const delays = orig.map((d) => Math.max(20, Math.round((d || 0) * FACTOR)))

console.log('frames:', meta.pages, '| orig delays(ms):', orig.slice(0, 8), '| new:', delays.slice(0, 8))

await sharp(backup, { animated: true })
  .gif({ delay: delays, loop: 0 })
  .toFile(src)

console.log('Wrote 3x-slower intro.gif (original kept as intro.original.gif)')
