import * as THREE from 'three';
import { convertAstronomicalDegreesToCartesian } from './math';
import { Exoplanet, CartesianCoordinates } from './types';

// Rendering of earth inspired by https://riptutorial.com/three-js/example/28900/creating-a-model-earth & https://blog.mastermaps.com/2013/09/creating-webgl-earth-with-threejs.html & https://github.com/fireship-io/threejs-scroll-animation-demo
export function generateEarth(
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

export function generateClouds(
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

export function generateExoplanet(exoplanet: Exoplanet, scene: THREE.Scene) {
  let coords = convertAstronomicalDegreesToCartesian(
    exoplanet.ra,
    exoplanet.dec,
    exoplanet.sy_dist
  );
  addExoplanetToScene(coords, scene);
}

export function addLighting(scene: THREE.Scene) {
  scene.add(new THREE.AmbientLight(0x333333));
  let directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);
}

export function addGrids(scene: THREE.Scene) {
  let gridSize = 1000;
  var xyGrid = new THREE.GridHelper(gridSize, gridSize, 'red');
  scene.add(xyGrid);

  var xzGrid = new THREE.GridHelper(gridSize, gridSize, 'blue');
  xzGrid.geometry.rotateX(Math.PI / 2);
  scene.add(xzGrid);
}

export function addExoplanetToScene(
  coords: CartesianCoordinates,
  scene: THREE.Scene
) {
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: generateRandomColorHexCode(),
  });
  let sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(coords.x, coords.y, coords.z);
  scene.add(sphere);
}

export function generateRandomColorHexCode(): string {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
}
