import vertexShader from '../public/assets/target_assets/shaders/vertex.glsl';
import fragmentShader from '../public/assets/target_assets/shaders/fragment.glsl';
import * as THREE from 'three';

export function createTarget() {
  const geometry = new THREE.CircleGeometry();
  const targetMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
  });
  targetMaterial.uniforms.uTime = {value: 0}
  targetMaterial.uniforms.uIsFocused = {value: false};
  
  const plane = new THREE.Mesh(geometry, targetMaterial);
  plane.renderOrder = 10;
//  return [plane, material];

  function update(delta, isFocused) {
    if (isFocused) {
      targetMaterial.uniforms.uTime.value += 0.001 * 5 / 2;
      targetMaterial.uniforms.uIsFocused = {value: true};
    } else {
      targetMaterial.uniforms.uTime.value += 0.001 / 2;
      targetMaterial.uniforms.uIsFocused = {value: false};
    }
  }

  return [plane, update];
}
