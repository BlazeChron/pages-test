import * as THREE from 'three';
import vertexShader from '../public/assets/menu_assets/shaders/bar_vertex.glsl';
import fragmentShader from '../public/assets/menu_assets/shaders/bar_fragment.glsl';

export function createBar(scene, x, y, z) {
  const geometry = new THREE.PlaneGeometry(0.1, 3);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
  });
  material.uniforms.uTime = {value: 0}
  
  const plane = new THREE.Mesh(geometry, material);
  plane.position.copy(new THREE.Vector3(x, y, z));
  scene.add(plane);

  function update(delta) {
    let value = material.uniforms.uTime.value;
    value += delta;
    value = Math.max(0, Math.min(1, value)); //clamp value
    material.uniforms.uTime.value = value;
  }
  return [plane, update, material];
}
