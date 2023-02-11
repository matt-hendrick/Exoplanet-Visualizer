import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Rendering of earth inspired by https://riptutorial.com/three-js/example/28900/creating-a-model-earth & https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html & https://github.com/fireship-io/threejs-scroll-animation-demo

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

let earthRadius = 1;
let earthSegments = 32;

let earth = generateEarth(earthRadius, earthSegments);
let clouds = generateClouds(earthRadius, earthSegments);

earth.add(clouds);

scene.add(earth);

addLighting(scene);

camera.position.z = 3;

let controls = new OrbitControls(camera, renderer.domElement);
controls.zoomSpeed = 4;

animate();

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0005;
  clouds.rotation.y += 0.0005;

  controls.update();
  renderer.render(scene, camera);
}

function generateEarth(
  earthRadius: number,
  earthSegments: number
): THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial> {
  // earth images pulled from https://github.com/turban/webgl-earth
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius, earthSegments, earthSegments),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('2_no_clouds_4k.jpg'),
      bumpMap: new THREE.TextureLoader().load('elev_bump_4k.jpg'),
      bumpScale: 0.005,
      specularMap: new THREE.TextureLoader().load('water_4k.png'),
      specular: new THREE.Color('grey'),
    })
  );
  return earth;
}

function generateClouds(
  earthRadius: number,
  earthSegments: number
): THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhongMaterial> {
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(earthRadius * 1.01, earthSegments, earthSegments),
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('fair_clouds_4k.png'),
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    })
  );
  return clouds;
}

function addLighting(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0x333333));
  let directionalLight = new THREE.DirectionalLight('red', 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
}
