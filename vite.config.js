import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so it works on Vercel AND GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
})
