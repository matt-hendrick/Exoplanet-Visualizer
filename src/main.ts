import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import {
  generateEarth,
  generateClouds,
  addExoplanetToScene,
  addLighting,
  redirectToExoplanetsNASAPage,
  addTooltip,
  toggleGrid,
} from './rendering';
import { exoplanets } from './data';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let earthRadius = 0.25;
let earthSegments = 32;

let earth = generateEarth(earthRadius, earthSegments);
let clouds = generateClouds(earthRadius, earthSegments);

earth.add(clouds);

scene.add(earth);

addLighting(scene);

camera.position.z = 2;

let controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 4;

for (let i = 0; i < exoplanets.length; i++) {
  addExoplanetToScene(exoplanets[i], scene);
}

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('pointerdown', onMouseDown);

let resetPositionButton = document.getElementsByClassName(
  'reset-position'
)[0] as HTMLButtonElement;
resetPositionButton.addEventListener('click', resetPosition, false);

let toggleGridButton = document.getElementsByClassName(
  'toggle-grid'
)[0] as HTMLButtonElement;
toggleGridButton.addEventListener('click', () => toggleGrid(scene), false);

animate();

function resetPosition() {
  controls.reset();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseDown(event: MouseEvent) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length && intersects[0]?.object?.userData?.pl_name) {
    if (event.button === 1 || event.button === 2) {
      redirectToExoplanetsNASAPage(intersects[0].object);
    } else {
      addTooltip(intersects[0].object, scene);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.001;

  controls.update();
  renderer.render(scene, camera);
}
