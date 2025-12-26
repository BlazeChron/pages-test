import { defineConfig } from 'vite'

export default defineConfig({
  // change base url
  base: '/pages-test/',
  // moving source code to src folder, and changing output directory
  root: 'src',
  build: {
    outDir: '../dist'
  }
})
