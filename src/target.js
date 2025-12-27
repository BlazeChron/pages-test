import vertexShader from '../public/assets/target_assets/shaders/vertex.glsl';
import fragmentShader from '../public/assets/target_assets/shaders/fragment.glsl';
import * as THREE from 'three';

export function createTarget() {
  const geometry = new THREE.CircleGeometry();
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
  });
  material.uniforms.uTime = {value: 0}
  material.uniforms.uIsFocused = {value: false};
  
  const plane = new THREE.Mesh(geometry, material);
  plane.renderOrder = 10;
  return [plane, material];
}
