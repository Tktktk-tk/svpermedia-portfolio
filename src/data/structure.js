import { CATEGORIES, EXAMPLES } from './portfolio'

// The three central "pages" (mediums) — map to node ids in portfolio.js
export const MEDIUMS = [
  { id: 'main',  label: 'Videography', tagline: 'moving image & story' },
  { id: 'photo', label: 'Photography', tagline: 'stills & stillness' },
  { id: 'vfx',   label: 'VFX',         tagline: 'process & illusion' },
]

// Software / tools — shown as the bold white words in the hero collage.
export const SOFTWARE = [
  'After Effects', 'Blender', 'DaVinci Resolve', 'Premiere Pro',
  'Rhino 6', 'Illustrator', 'InDesign',
]

export const MAX_PER_CATEGORY = 4

export const categoriesFor = (mediumId) => CATEGORIES.filter((c) => c.node === mediumId)
export const examplesFor = (catId) =>
  EXAMPLES.filter((e) => e.cat === catId).slice(0, MAX_PER_CATEGORY)
