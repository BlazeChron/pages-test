/*
main script
Loads threejs scene into the c canvas
*/
import * as THREE from 'three';

const scene = new THREE.Scene();

const canvas = document.querySelector("#c");

// Camera
const fov = 75;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;


import { createShimaebox } from './shimaebox.js';
const [shimaebox, shimaeboxMaterial] = createShimaebox();
shimaebox.scale.copy(new THREE.Vector3(0.8, 0.8, 0.8));
shimaebox.castShadow = true;
scene.add(shimaebox);

// add Target Circle
import { createTarget } from './target.js';
const [target, targetUpdate] = createTarget();
target.position.z = 1;
target.scale.copy(new THREE.Vector3(0.5, 0.5, 0.5));
scene.add(target);

// add Menu popup 
import { createMenu } from './menu.js';
// Font is imported here due to path resolution issues post-build
import xirodFont from '../public/assets/menu_assets/fonts/xirod_regular.json';
const [menuUpdate, onMenuClick, onMenuHover] = createMenu(target, xirodFont,
                                                          1, 1, 0);

// import empty room
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
// workaround for pathing, because after bundling path is different
// must include asset in vite.config.js
import roomModel from '../public/assets/room.glb';
loader.load( roomModel, processRoom ); 
function processRoom(gltf) {
  const room = gltf.scene;
  room.scale.copy(new THREE.Vector3(0.3, 0.3, 0.3));
  room.rotation.y = -Math.PI / 2;
  room.position.copy(new THREE.Vector3(3.3, 1, 12.5));
  scene.add(room);

  // adding shadows
  // due to multiple meshes in room, traversal to add shadows to everything
  room.traverse(function (child) {
    if (child.isMesh) {
      child.receiveShadow = true;
    }
  })
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

  light.castShadow = true;
  light2.castShadow = true;
}

// Raycasting code
/*
Listens to mouse movement and click events.
Adds all intersections to intersections array on mouse move
On click, uses intersections array for logic
*/
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

// on mouse click
let isMenuOpen = false;
const onClick = (event) => {
  if (isMenuOpen) {
    intersections.forEach(x => onMenuClick(x.object));
  }
  if (intersections.map(x => x.object).includes(target)) {
    isMenuOpen = true;
  } else {
    isMenuOpen = false;
  }
}
window.addEventListener('click', onClick);

// Optional orbit controls for debugging
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//const controls = new OrbitControls( camera, renderer.domElement );
//controls.update();

// Uses Clock.getDelta() to calculate delta between render cycles
const clock = new THREE.Clock();
function render(time) {
  time *= 0.001 / 2;
  const delta = clock.getDelta();
    
  shimaebox.rotation.x += 0.5 * delta;
  shimaebox.rotation.y += 0.5 * delta;

  shimaeboxMaterial.uniforms.uTime = {value: time}

  onMenuHover(intersections);

  // check if target is hovered
  let targetIsFocused = intersections.map(x => x.object).includes(target)
                        || isMenuOpen;
  targetUpdate(delta, targetIsFocused);                     
  menuUpdate(delta * 5 * (isMenuOpen ? 1 : -1));

  renderer.render(scene, camera);
  requestAnimationFrame(render);
//  controls.update();
}

requestAnimationFrame(render);
