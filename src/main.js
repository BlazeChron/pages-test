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

import { createShimaebox } from './shimaebox.js';
const [shimaebox, shimaeboxMaterial] = createShimaebox();
scene.add(shimaebox);

import { createTarget } from './target.js';
const [target, targetMaterial] = createTarget();
target.position.z = 1;
target.scale.x = 0.5;
target.scale.y = 0.5;
target.scale.z = 0.5;
scene.add(target);

// add target

// import empty room
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
// workaround for pathing, because after bundling path is different
// must include asset in vite.config.js
import roomModel from '../public/assets/room.glb';
loader.load( roomModel, processRoom ); 
function processRoom(gltf) {
  const room = gltf.scene;
  room.scale.x = 0.3;
  room.scale.y = 0.3;
  room.scale.z = 0.3;
  room.rotation.y = -Math.PI / 2;
  room.position.x = 3;
  room.position.y = 1;
  room.position.z = 12.5;
  scene.add(room);
  console.log("loaded scene");
}



// light
{ 
  const color = 0x666666;
  const intensity = 50;
  const light = new THREE.SpotLight(color, intensity);
  light.position.z = 2;
  light.position.y = 1;
  light.angle = Math.PI / 6;
  light.target = shimaebox;
  light.decay = 2;
  light.penumbra = 1;
  light.castShadow = true;
  scene.add(light);
  const light2 = new THREE.DirectionalLight(color, 0.5);
  light2.position.z = 3;
  light2.target = shimaebox;
  light2.penumbra = 1;
  scene.add(light2);
  const ambientColor = 0x222222;
  const ambientLight = new THREE.AmbientLight(ambientColor, 1);
  scene.add(ambientLight);

}

//raycasting code
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

let intersections = [];

const onMouseMove = (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  intersections = intersects;
}
window.addEventListener('mousemove', onMouseMove);


// orbit controls
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const controls = new OrbitControls( camera, renderer.domElement );
//controls.update();

console.log(targetMaterial);

function render(time) {
  time *= 0.001 / 2;
    
  shimaebox.rotation.x += 0.001;
  shimaebox.rotation.y += 0.001;

  shimaeboxMaterial.uniforms.uTime = {value: time}

  // check if target is hovered
  if (intersections.map(x => x.object).includes(target)) {
    targetMaterial.uniforms.uTime.value += 0.001 * 5 / 2;
    targetMaterial.uniforms.uIsFocused = {value: true};
  } else {
    targetMaterial.uniforms.uTime.value += 0.001 / 2;
    targetMaterial.uniforms.uIsFocused = {value: false};
  }

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls.update();
}

requestAnimationFrame(render);
