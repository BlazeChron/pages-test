import { defineConfig } from 'vite'

export default defineConfig(({command}) => ({
  // change base url
  base: command === 'build'
    ? '/pages-test/'
    : '/',
  // include glb files
  assetsInclude: ["**/*.glb"],
  // moving source code to src folder, and changing output directory
  root: 'src',
  build: {
    outDir: '../dist'
  }
}));

//export default defineConfig({
//  // include glb files
//  assetsInclude: ["**/*.glb"],
//  // moving source code to src folder, and changing output directory
//  root: 'src',
//  build: {
//    outDir: '../dist'
//  }
//});
