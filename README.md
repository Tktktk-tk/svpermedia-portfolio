# svpermedia — interactive portfolio

A Vite + React mind-map portfolio. Three glowing nuclei (Main Client Work,
VFX + Animation, Photography) with category and example nodes orbiting them,
connection lines between linked projects, and a focus view per project.

No backend, no AI, no uploads, no recurring cost — it's a static site.

## Run locally
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs /dist for deploy
```

## Where things live
- `src/data/portfolio.js` — **edit titles, engagement, media counts, links here.**
- `src/layout.js` — node positions / spacing.
- `src/styles.css` — all styling (colours, glow).
- `public/logo.png` — drop your logo here (shows at 25% behind everything).
- `public/media/<example-id>/` — real media for each project (see below).

## Adding real media (Stage 2)
Each project has an id (e.g. `main-fabia`). Put files under
`public/media/<id>/` and set `real: true` for that example in `portfolio.js`.
Recommended structure:
```
public/media/main-fabia/
  videos/   final.mp4
  photos/   01.jpg 02.jpg ...
  gifs/     process1.gif ...
  models/   model.glb
  description.txt
  engagement.txt
```
Keep videos compressed (1080p H.264, a few MB each) so the repo stays light.

## Pages
1. **Loading** — 3 nuclei follow the cursor; click & hold 6s to enter.
2. **Map** — full mind-map. Hover a node to enlarge + reveal its title; click an
   example to focus it. Connection lines join linked projects.
3. **Focus** — description, software used, engagement, media, and clickable links
   to connected work. `Esc` or "go back" to exit.

## Deploy
- **Vercel:** import the repo, framework = Vite, build = `npm run build`, output = `dist`.
- **GitHub Pages:** uses HashRouter + relative `base`, so the built `dist` works as-is.
