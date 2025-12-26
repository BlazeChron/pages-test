import * as THREE from 'three';

const scene = new THREE.Scene();

const canvas = document.querySelector("#c");

const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

import vertexShader from '../shaders/vertex.glsl';
import fragmentShader from '../shaders/fragment.glsl';

// meshes
import shimaenagaTexture from '../public/shimaenaga_frames.png';
//const geometry = new THREE.PlaneGeometry(2, 2, 2, 2);
const geometry = new THREE.BoxGeometry();
console.log(geometry);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
//  wireframe: true,
});
material.uniforms.uTime = {value: 0}
material.uniforms.uTexture = {value: new THREE.TextureLoader().load(shimaenagaTexture)}
console.log(material);
const ico = new THREE.Mesh(geometry, material);
scene.add(ico);


// light
{ 
  const color = 0xFFFFFF;
  const intensity = 500;
  const light = new THREE.PointLight(color, intensity);
  light.position.z = 5;
  scene.add(light);
}


// orbit controls
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls( camera, renderer.domElement );
//controls.update();

function render(time) {
  time *= 0.001 / 2;
    
  ico.rotation.x += 0.001;
  ico.rotation.y += 0.001;

  material.uniforms.uTime = {value: time}

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls.update();
}

requestAnimationFrame(render);
