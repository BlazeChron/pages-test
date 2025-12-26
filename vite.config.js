import { defineConfig } from 'vite'

export default defineConfig({
  // moving source code to src folder, and changing output directory
  root: 'src',
  build: {
    outDir: '../dist'
  }
})
