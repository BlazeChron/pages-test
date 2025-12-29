// Font creator with a clickable hitbox.
// Assumes that fonts have clickable URLs.

import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import vertex from '../public/assets/menu_assets/shaders/font_vertex.glsl';
import fragment from '../public/assets/menu_assets/shaders/font_fragment.glsl';
import fontHitboxVertex from '../public/assets/menu_assets/shaders/font_hitbox_vertex.glsl';
import fontHitboxFragment from '../public/assets/menu_assets/shaders/font_hitbox_fragment.glsl';

export function createFont(f, scene, text, url, x, y, z, fontSize) {
  const loader = new FontLoader();
  const font = loader.parse(f);
  const fontMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
  });
  let textMesh = null;
  let hitBoxMesh = null
  let hitBoxMaterial = null;
  fontMaterial.uniforms.uTime = {value: 0};
  onFontLoad(font, text);
  function onFontLoad(font, text) {
    const message = text;
    const shapes = font.generateShapes(message, fontSize);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    fontMaterial.uniforms.leftEndPosition = {value: geometry.boundingBox.min.x};
    fontMaterial.uniforms.rightEndPosition = {value: geometry.boundingBox.max.x};
    fontMaterial.uniforms.uIsFocused = {value: false};
    textMesh = new THREE.Mesh(geometry, fontMaterial);
    textMesh.position.copy(new THREE.Vector3(x, y, z));
    scene.add(textMesh);

    //add hitbox for clicking
    let l = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    const hitBoxGeometry = new THREE.PlaneGeometry(l, fontSize);
    hitBoxMaterial = new THREE.ShaderMaterial({
      vertexShader: fontHitboxVertex,
      fragmentShader: fontHitboxFragment,
      transparent: true,
    });
    hitBoxMesh = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
    hitBoxMaterial.uniforms.uIsFocused = {value: false};
    hitBoxMesh.position.copy(new THREE.Vector3(x + l / 2, y + fontSize / 2, z));
    scene.add(hitBoxMesh);
  }
  function onClick(mesh) {
    if (mesh == hitBoxMesh) {
      if (url !== null) {
        window.open(url);
      }
    }
  }
  
  function onHover(intersections) {
    if (intersections.map(x => x.object).includes(hitBoxMesh)) {
      if (url !== null) {
        hitBoxMaterial.uniforms.uIsFocused.value = true;
        fontMaterial.uniforms.uIsFocused.value = true;
      }
    } else {
      hitBoxMaterial.uniforms.uIsFocused.value = false;
      fontMaterial.uniforms.uIsFocused.value = false;
    }
  }

  function update(delta) {
    let value = fontMaterial.uniforms.uTime.value;
    value += delta;
    value = Math.max(0, Math.min(1, value)); //clamp value
    fontMaterial.uniforms.uTime.value = value;
  }

  return [textMesh, update, fontMaterial, onClick, onHover];
}

