// ============================================================================
//  svpermedia — portfolio data
//  ---------------------------------------------------------------------------
//  This file is the single source of truth for the whole mind-map.
//  Edit titles / engagement / media counts here. No code changes needed.
//
//  HOW IT WORKS
//  - NODES      = the 3 glowing nuclei (Main Client Work, VFX+Animation, Photography)
//  - CATEGORIES = secondary nodes that orbit each nucleus (Brands, Concerts, ...)
//  - EXAMPLES   = the actual projects (sub-nodes) that orbit each category
//
//  Each example can link to another example by id (the connection lines).
//  e.g. vfx-fabia links to main-fabia  ->  a line is drawn between them.
//
//  `real: true`  -> the app looks for actual media files under /public/media/<id>/
//  `real: false` -> the app shows tasteful "insert media" placeholders, but still
//                   uses the real title, engagement and media COUNTS.
// ============================================================================

export const NODES = [
  {
    id: 'main',
    title: 'Videography',
    color: '#35b8ff',        // glowing blue
    blurb: 'Final delivered work — brands, concerts, events & music videos.',
  },
  {
    id: 'vfx',
    title: 'VFX',
    color: '#b96bff',        // glowing violet
    blurb: 'The process & the magic — compositing, 3D and motion.',
  },
  {
    id: 'photo',
    title: 'Photography',
    color: '#ff9d3a',        // glowing amber
    blurb: 'Stills — concerts, brands and corporate shoots.',
  },
]

// ---------------------------------------------------------------------------
//  CATEGORIES  (secondary nodes)   { id, node, title }
// ---------------------------------------------------------------------------
export const CATEGORIES = [
  // Main Client Work
  { id: 'main-brands',   node: 'main', title: 'Brands' },
  { id: 'main-corp',     node: 'main', title: 'Corporate' },
  { id: 'main-concerts', node: 'main', title: 'Concerts' },
  { id: 'main-events',   node: 'main', title: 'Events' },
  { id: 'main-music',    node: 'main', title: 'Music Videos' },
  { id: 'main-club',     node: 'main', title: 'Club Events' },
  // VFX + Animation
  { id: 'vfx-brands',    node: 'vfx',  title: 'Brands' },
  { id: 'vfx-music',     node: 'vfx',  title: 'Music' },
  // Photography
  { id: 'photo-brands',   node: 'photo', title: 'Brands' },
  { id: 'photo-corp',     node: 'photo', title: 'Corporate' },
  { id: 'photo-concerts', node: 'photo', title: 'Concerts' },
]

// ---------------------------------------------------------------------------
//  EXAMPLES  (sub-nodes)
//  media:   { videos, photos, gifs, models }  -> counts used for placeholders
//  links:   [exampleId, ...]                  -> draws connection lines
//  software:[...]                             -> shown in focus view (VFX)
// ---------------------------------------------------------------------------
export const EXAMPLES = [
  // ===================== MAIN CLIENT WORK =====================
  {
    id: 'main-salient', cat: 'main-brands', node: 'main', title: 'Project Salient',
    media: { videos: 1 }, engagement: { views: 45000, likes: 1360 }, real: false,
    description: 'Clothing brand feature piece. (Placeholder description — update in /public/media or here.)',
  },
  {
    id: 'main-fabia', cat: 'main-brands', node: 'main', title: 'Fabia',
    media: { videos: 2 }, engagement: { views: 1000000, likes: 50000 }, real: true,
    links: ['vfx-fabia', 'photo-fabia'],
    description: 'Flagship clothing campaign — full creative direction, shoot and edit.',
  },
  {
    id: 'main-ces', cat: 'main-corp', node: 'main', title: 'Community Engagement Summit',
    media: { videos: 1 }, real: false,
    links: ['photo-ces'],
    description: 'Corporate event recap video and coverage.',
  },
  {
    id: 'main-neptune', cat: 'main-corp', node: 'main', title: 'Neptune Swimming School',
    media: { videos: 4 }, real: false,
    description: 'Promotional video series for Neptune Swimming School.',
  },
  {
    id: 'main-consulting', cat: 'main-corp', node: 'main', title: 'Consulting 101',
    media: { videos: 1 }, real: false,
    links: ['photo-consulting'],
    description: 'Corporate promotional video for Consulting 101.',
  },
  {
    id: 'main-downunder', cat: 'main-concerts', node: 'main', title: 'YT: Down Under Tour',
    media: { videos: 1 }, engagement: { views: 11800, likes: 850 }, real: false,
    links: ['photo-downunder'],
    description: 'Tour recap — live concert videography.',
  },
  {
    id: 'main-esdeekid', cat: 'main-concerts', node: 'main', title: 'Esdeekid Tour',
    media: { videos: 1 }, engagement: { views: 10000, likes: 542 }, real: false,
    links: ['photo-esdeekid'],
    description: 'Concert recap for the Esdeekid tour.',
  },
  {
    id: 'main-marah', cat: 'main-concerts', node: 'main', title: 'Marah the Scientist',
    media: { videos: 1 }, real: false,
    description: 'Live concert videography for Marah the Scientist.',
  },
  {
    id: 'main-kraniraivu', cat: 'main-events', node: 'main', title: 'Kraniraivu',
    media: { videos: 1 }, engagement: { views: 8000, likes: 370 }, real: false,
    links: ['vfx-kraniraivu'],
    description: 'Cultural event coverage.',
  },
  {
    id: 'main-2nights', cat: 'main-music', node: 'main', title: "'2 Nights' Music Video",
    media: { videos: 1 }, engagement: { views: 6200, likes: 270 }, real: true,
    links: ['vfx-2nights'],
    description: 'Music video — directed, shot and edited, featuring custom VFX.',
  },
  {
    id: 'main-amar', cat: 'main-music', node: 'main', title: "'Amar' Reels",
    media: { videos: 4 }, engagement: { views: 50200, likes: 1500 }, real: false,
    description: 'Reel series for the Amar release.',
  },
  {
    id: 'main-medusa', cat: 'main-music', node: 'main', title: "'Medusa' Music Video",
    media: { videos: 1 }, engagement: { views: 7400, likes: 300 }, real: false,
    description: 'Music video production.',
  },
  {
    id: 'main-eatingme', cat: 'main-club', node: 'main', title: 'Eatingme4live',
    media: { videos: 3 }, engagement: { views: 200000, likes: 50000 }, real: false,
    description: 'Club event series coverage.',
  },
  {
    id: 'main-uts', cat: 'main-club', node: 'main', title: 'UTS Indian Society',
    media: { videos: 4 }, engagement: { views: 500000, likes: 100000 }, real: false,
    description: 'Club / society event coverage series.',
  },

  // ===================== VFX + ANIMATION =====================
  {
    id: 'vfx-fabia', cat: 'vfx-brands', node: 'vfx', title: 'Fabia',
    media: { gifs: 3 }, real: true, links: ['main-fabia'],
    software: ['Adobe After Effects'],
    description: 'Invisibility / glass effect — subject revealed through refracted glass.',
    gifDescriptions: [
      'Base plate — subject isolated against clean background',
      'Refraction mask — simulating glass transparency over the subject',
      'Final composite — invisibility glass reveal with colour grade',
    ],
  },
  {
    id: 'vfx-kraniraivu', cat: 'vfx-brands', node: 'vfx', title: 'Kraniraivu',
    media: { gifs: 1 }, real: false, links: ['main-kraniraivu'],
    description: 'Process breakdown for the Kraniraivu event visuals.',
    gifDescriptions: ['Process breakdown'],
  },
  {
    id: 'vfx-2nights', cat: 'vfx-music', node: 'vfx', title: "'2 Nights' Music Video",
    media: { gifs: 5 }, real: true, links: ['main-2nights'],
    software: ['Adobe After Effects'],
    description: 'Depth map + projection + CC Ball action driving the visual treatment.',
    gifDescriptions: [
      'Source footage — depth map extraction from raw clip',
      'Geometry projection — mapping depth onto 3D plane',
      'CC Ball Action — particle dispersion across the scene',
      'Chromatic aberration + colour grading pass',
      'Final composite — motion blur and output render',
    ],
  },
  {
    id: 'vfx-backrooms', cat: 'vfx-music', node: 'vfx', title: 'Srilankan Flag',
    media: { videos: 1, models: 1 }, real: true,
    software: ['Blender'],
    description: 'A waving 3D Sri Lankan flag — modelled, textured and cloth-simulated in Blender. Rotate the model below to view it from any angle.',
  },

  // ===================== PHOTOGRAPHY =====================
  {
    id: 'photo-fabia', cat: 'photo-brands', node: 'photo', title: 'Fabia',
    media: { photos: 10 }, real: true, links: ['main-fabia'],
    description: 'Brand stills from the Fabia campaign.',
  },
  {
    id: 'photo-fabia2', cat: 'photo-brands', node: 'photo', title: 'FABIA .2',
    media: { photos: 10 }, real: false,
    description: 'Additional brand stills from the Fabia campaign.',
  },
  {
    id: 'photo-ces', cat: 'photo-corp', node: 'photo', title: 'Community Engagement Summit',
    media: { photos: 5 }, real: false, links: ['main-ces'],
    description: 'Corporate event photography.',
  },
  {
    id: 'photo-consulting', cat: 'photo-corp', node: 'photo', title: 'Consulting 101',
    media: { photos: 10 }, real: false, links: ['main-consulting'],
    description: 'Corporate photography for Consulting 101.',
  },
  {
    id: 'photo-uts-pg', cat: 'photo-corp', node: 'photo', title: 'UTS Postgraduate Studio',
    media: { photos: 5 }, real: false,
    description: 'Studio photography for the UTS postgraduate studio.',
  },
  {
    id: 'photo-uts-ug', cat: 'photo-corp', node: 'photo', title: 'UTS Undergraduate Studio0',
    media: { photos: 5 }, real: false,
    description: 'Studio photography for the UTS undergraduate studio.',
  },
  {
    id: 'photo-downunder', cat: 'photo-concerts', node: 'photo', title: 'YT: Down Under Tour',
    media: { photos: 10 }, real: false, links: ['main-downunder'],
    description: 'Concert stills from the Down Under tour.',
  },
  {
    id: 'photo-esdeekid', cat: 'photo-concerts', node: 'photo', title: 'Esdeekid Tour',
    media: { photos: 5 }, real: false, links: ['main-esdeekid'],
    description: 'Concert stills from the Esdeekid tour.',
  },
]

// Convenience lookups -------------------------------------------------------
export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]))
export const EXAMPLE_BY_ID = Object.fromEntries(EXAMPLES.map((e) => [e.id, e]))
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

// ---------------------------------------------------------------------------
//  Human-readable media folder for each example, e.g. "Videography/Brands/Fabia".
//  Drop files into  public/media/<folder>/{Videos,Photos,Gifs,Models}/
//  named 01, 02, 03 … in order (01.mp4, 01.jpg, 01.gif).
// ---------------------------------------------------------------------------
const NODE_FOLDER = { main: 'Videography', vfx: 'VFX', photo: 'Photography' }
// strip characters Windows/URLs dislike, keep spaces for readability
const sanitizeName = (s) =>
  s.replace(/['"]/g, '').replace(/[:<>\\/|?*]/g, '').replace(/\s+/g, ' ').trim()

for (const e of EXAMPLES) {
  const cat = CATEGORY_BY_ID[e.cat]
  e.folder = `${NODE_FOLDER[e.node]}/${sanitizeName(cat.title)}/${sanitizeName(e.title)}`
}

// All unique link pairs (deduped) for drawing connection lines.
export const LINKS = (() => {
  const seen = new Set()
  const pairs = []
  for (const ex of EXAMPLES) {
    for (const target of ex.links || []) {
      const key = [ex.id, target].sort().join('::')
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push([ex.id, target])
    }
  }
  return pairs
})()
