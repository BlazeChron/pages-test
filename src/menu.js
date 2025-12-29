import * as THREE from 'three';
import { createFont } from './font.js';
import { createBar } from './bar.js';

export function createMenu(scene, f, x, y, z) {
  const [bar, updateBar, barMat] = createBar(scene, x, y, z);
  const GITHUB_URL = "https://github.com/BlazeChron";
  const [font, updateFont, fontMat, onClick0] = createFont(f, bar, 'github', GITHUB_URL, 0.2, 1, 0);
  const ITCH_URL = "https://blazechron.itch.io/";
  const [font2, updateFont2, fontMat2, onClick1] = createFont(f, bar, 'itch', ITCH_URL, 0.2, 0, 0);
  
  function update(delta) {
    if (delta > 0) {
      // start from bar
      let barVal = barMat.uniforms.uTime.value;
      if (barVal < 1) {
        updateBar(delta);
      } else {
        updateFont(delta);
        updateFont2(delta);
      }
    } else {
      // start from font
      let fontVal = fontMat.uniforms.uTime.value;
      if (fontVal > 0) {
        updateFont(delta);
        updateFont2(delta);
      } else {
        updateBar(delta);
      }
    }
  }
  function onClick(mesh) {
    [onClick0, onClick1].forEach(c => c(mesh));
  }
  return [update, barMat, fontMat, onClick];
}

