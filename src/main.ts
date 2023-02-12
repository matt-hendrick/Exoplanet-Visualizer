import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  generateEarth,
  generateClouds,
  generateExoplanet,
  addLighting,
  addGrids,
} from './renderingFunctions';
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
  generateExoplanet(exoplanets[i], scene);
}

// addGrids(scene);

animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.0005;

  controls.update();
  renderer.render(scene, camera);
}
