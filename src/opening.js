// Opening chain door overlay
// Too lazy for now, leaving this instead of integrating properly into threejs

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth
                                            / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#c1')
const renderer = new THREE.WebGLRenderer({alpha:true, canvas});
renderer.setSize( window.innerWidth, window.innerHeight );

// Set up camera and lighting
camera.position.z = 7;

const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.1);
dir.position.set(5, 10, 5);
scene.add(dir);


// Load
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const loader = new GLTFLoader();
import chainGLB from '../public/assets/opening_assets/model/CHAIN.glb';

loader.load(chainGLB , processChain ); 

function processChain (gltf) {
  const chainBase = gltf.scene;

  // Find bounding box
  const box = new THREE.Box3().setFromObject(chainBase);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const clone = chainBase.clone(true);

  let basePosition = new THREE.Vector3(-center.x + 10,
                                       size.y / 2 - center.y * 1.6,
                                       -center.z + 2);
  let cloneBasePosition = new THREE.Vector3(-center.x - 10,
                                            size.y / 2 - center.y * 1.6,
                                            -center.z);
  let t = 0;
  chainBase.position.copy(basePosition);
  clone.position.copy(cloneBasePosition);
  

  // rotate by 90 deg
  const initialRotation = new THREE.Quaternion();
  initialRotation.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);
  chainBase.applyQuaternion(initialRotation);

  const cloneInitialRotation = new THREE.Quaternion();
  cloneInitialRotation.setFromAxisAngle(new THREE.Vector3(0, 0, 1),
                                        -Math.PI / 4);
  clone.applyQuaternion(cloneInitialRotation);
  
  //loop
  const loop = 2 * size.y / 10;
  let curr = 0;
  function animate(delta) {
    const chainVerticalMovementSpeed = 10 * delta;
    chainBase.translateY(chainVerticalMovementSpeed);
    clone.translateY(chainVerticalMovementSpeed);
    curr += chainVerticalMovementSpeed;
    chainBase.rotateOnAxis(chainBase.up, delta * 4);
    clone.rotateOnAxis(clone.up, delta * 4);

    if (loop < curr) {
      curr = 0;
      chainBase.position.copy(basePosition);
      clone.position.copy(cloneBasePosition);
    }
    if (isOpening) {
      const chainHorizontalMovementSpeed = delta * 5;
      chainBase.position.x -= chainHorizontalMovementSpeed;
      clone.position.x += chainHorizontalMovementSpeed;
      basePosition.x -= chainHorizontalMovementSpeed;
      cloneBasePosition.x += chainHorizontalMovementSpeed;
    }

    renderer.render( scene, camera );
  }

  updateArray.push(animate);
  scene.add( chainBase );
  scene.add(clone);
}

let updateArray = [];

const clock = new THREE.Clock();
// update everything in array
function animate() {
  const delta = clock.getDelta();
  for (const element of updateArray) {
    element(delta);
  }
}

import doorGLB from '../public/assets/opening_assets/model/blast_doors.glb';
loader.load(doorGLB , processDoors ); 

let isOpening = false;
canvas.onclick = async () => { 
  isOpening = true; 
  // raw time wait lmao
  await new Promise(r => setTimeout(r, 10000));
  canvas.style.visibility = "hidden";
};

function processDoors (gltf) {
  const doorBase = gltf.scene;
//  console.log(dumpObject(doorBase).join('\n'));

  const box = new THREE.Box3().setFromObject(doorBase);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const basePosition = new THREE.Vector3(-center.x,
                                         size.y / 2 - center.y * 2,
                                         -center.z - 90);

  doorBase.position.copy(basePosition);
  doorBase.rotation.y = Math.PI / 2;

  // individual doors
  let leftDoor, rightDoor;
  leftDoor = doorBase.getObjectByName('LeftDoor');
  rightDoor = doorBase.getObjectByName('RightDoor');

  function animate(delta) {
    if (isOpening) {
      leftDoor.position.z += 50 * delta;
      rightDoor.position.z -= 50 * delta;
      renderer.render( scene, camera );
    }
  }
  updateArray.push(animate);

  scene.add(doorBase);
}

renderer.setAnimationLoop( animate );

