import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import vertex from '../public/assets/menu_assets/shaders/font_vertex.glsl';
import fragment from '../public/assets/menu_assets/shaders/font_fragment.glsl';

export function createFont(f, scene, text, url, x, y, z) {
  const FONT_SIZE = 0.5;
  const loader = new FontLoader();
  //const font = loader.load(f, (font) => onFontLoad(font, text));
  const font = loader.parse(f);
  const fontMaterial = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
  });
  let textMesh = null;
  let hitBoxMesh = null
  fontMaterial.uniforms.uTime = {value: 0};
  onFontLoad(font, text);
  function onFontLoad(font, text) {
    console.log("Font Loaded");
    const message = text;
    const shapes = font.generateShapes(message, FONT_SIZE);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    fontMaterial.uniforms.leftEndPosition = {value: geometry.boundingBox.min.x};
    fontMaterial.uniforms.rightEndPosition = {value: geometry.boundingBox.max.x};
    console.log(fontMaterial);
    textMesh = new THREE.Mesh(geometry, fontMaterial);
    textMesh.position.copy(new THREE.Vector3(x, y, z));
    scene.add(textMesh);

    //add hitbox for clicking
    let l = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    const hitBoxGeometry = new THREE.PlaneGeometry(l, FONT_SIZE);
    const hitBoxMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.0,
    });
    hitBoxMesh = new THREE.Mesh(hitBoxGeometry, hitBoxMaterial);
    hitBoxMesh.position.copy(new THREE.Vector3(x + l / 2, y + FONT_SIZE / 2, z));
    scene.add(hitBoxMesh);
  }
  function onClick(mesh) {
    if (mesh == hitBoxMesh) {
      //console.log(`Font ${text} has been clicked`);

      window.open(url);
    }
  }

  function update(delta) {
    let value = fontMaterial.uniforms.uTime.value;
    value += delta;
    value = Math.max(0, Math.min(1, value)); //clamp value
    fontMaterial.uniforms.uTime.value = value;
  }

  return [textMesh, update, fontMaterial, onClick];
}

