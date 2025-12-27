import vertexShader from '../public/assets/shimaebox_assets/shaders/vertex.glsl';
import fragmentShader from '../public/assets/shimaebox_assets/shaders/fragment.glsl';
import shimaenagaTexture from '../public/assets/shimaebox_assets/shimaenaga_frames.png';
import * as THREE from 'three';
import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';

export function createShimaebox() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  material.uniforms.uTime = {value: 0}
  material.uniforms.uTexture = {value: new THREE.TextureLoader().load(shimaenagaTexture)}
  const ico = new THREE.Mesh(geometry, material);
  return [ico, material];
}
