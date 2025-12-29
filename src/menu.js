import * as THREE from 'three';
import { createFont } from './font.js';
import { createBar } from './bar.js';

export function createMenu(scene, f, x, y, z) {
  const [bar, updateBar, barMat] = createBar(scene, x, y, z);
  const GITHUB_URL = "https://github.com/BlazeChron";
  const [font, updateFont, fontMat, onClick0,
          onHover0] = createFont(f, bar, 'github', GITHUB_URL, 0.2, 1, 0, 0.5);
  const ITCH_URL = "https://blazechron.itch.io/";
  const [font2, updateFont2, fontMat2, onClick1,
          onHover1] = createFont(f, bar, 'itch.io', ITCH_URL, 0.2, 0, 0, 0.5);

  const [font3, updateFont3, fontMat3, onClick2,
          onHover2] = createFont(f, bar, 'blaze', null, -1.7, 0.4, 0, 0.2);
  const [font4, updateFont4, fontMat4, onClick3,
          onHover3] = createFont(f, bar, 'chron', null, -1.7, 0.0, 0, 0.2);
  
  // Each font, bar, child keeps track of their own uTime variable
  // This dictates how far they are filled in.
  // The below update function introduces dependency, some fonts fill up first
  function update(delta) {
    if (delta > 0) {
      // start from bar
      let barVal = barMat.uniforms.uTime.value;
      if (barVal < 1) {
        updateBar(delta);
        updateFont3(delta);
      } else {
        updateFont(delta);
        updateFont2(delta);
        updateFont4(delta);
      }
    } else {
      // start from font
      let fontVal = fontMat.uniforms.uTime.value;
      if (fontVal > 0) {
        updateFont(delta);
        updateFont2(delta);
        updateFont4(delta);
      } else {
        updateBar(delta);
        updateFont3(delta);
      }
    }
  }
  function onClick(mesh) {
    [onClick0, onClick1, onClick2].forEach(c => c(mesh));
  }

  function onHover(intersections) {
    [onHover0, onHover1, onHover2, onHover3].forEach(c => c(intersections));
  }
  return [update, onClick, onHover];
}

