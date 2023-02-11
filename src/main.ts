import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CartesianCoordinates, RightAscension, Declination } from './classes';

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

let rightAscension = new RightAscension(1, 44, 4.091);
let declination = new Declination(-15, 56, 14.89);
let coords = convertAstronomicalToCartesian(rightAscension, declination, 11.9);
addExoplanetToScene(coords, scene);

// not a real exoplanet
let rightAscension1 = new RightAscension(2, 44, 4.091);
let declination1 = new Declination(-15, 56, 14.89);
let coords1 = convertAstronomicalToCartesian(
  rightAscension1,
  declination1,
  11.9
);
addExoplanetToScene(coords1, scene);

let rightAscension2 = new RightAscension(18, 33, 55.808);
let declination2 = new Declination(51, 43, 8.62);
let coords2 = convertAstronomicalToCartesian(
  rightAscension2,
  declination2,
  53.6
);
addExoplanetToScene(coords2, scene);

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
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
}

// Math for this explained here http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
function convertAstronomicalToCartesian(
  rightAscension: RightAscension,
  declination: Declination,
  distance: number
): CartesianCoordinates {
  let rightAscensionDegrees = convertRightAscensionToDegrees(rightAscension);
  console.log('rightAscensionDegrees', rightAscensionDegrees);
  let declinationDegrees = convertDeclinationToDegrees(declination);
  console.log('declinationDegrees', declinationDegrees);

  let x =
    distance *
    Math.cos(toRadians(declinationDegrees)) *
    Math.cos(toRadians(rightAscensionDegrees));
  let y =
    distance *
    Math.cos(toRadians(declinationDegrees)) *
    Math.sin(toRadians(rightAscensionDegrees));
  let z = distance * Math.sin(toRadians(declinationDegrees));

  let coords = new CartesianCoordinates(x, y, z);

  console.log(coords);
  return coords;
}

function toRadians(degrees: number): number {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function convertRightAscensionToDegrees(
  rightAscension: RightAscension
): number {
  return (
    rightAscension.hours * 15 +
    rightAscension.minutes * 0.25 +
    rightAscension.seconds * 0.004166
  );
}

function convertDeclinationToDegrees(declination: Declination): number {
  return (
    (Math.abs(declination.degrees) +
      declination.minutes / 60 +
      declination.seconds / 3600) *
    Math.sign(declination.degrees)
  );
}

function addExoplanetToScene(coords: CartesianCoordinates, scene: THREE.Scene) {
  const geometry = new THREE.SphereGeometry(0.5, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color:
      '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
  });
  let cube = new THREE.Mesh(geometry, material);
  cube.position.set(coords.x, coords.y, coords.z);
  scene.add(cube);
}
