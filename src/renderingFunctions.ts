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

export function addExoplanetToScene(exoplanet: Exoplanet, scene: THREE.Scene) {
  let coords = convertAstronomicalDegreesToCartesian(
    exoplanet.ra,
    exoplanet.dec,
    exoplanet.sy_dist
  );
  const geometry = new THREE.SphereGeometry(0.25, 16, 16);
  const material = new THREE.MeshBasicMaterial({
    color: generateRandomColorHexCode(),
  });
  let sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(coords.x, coords.y, coords.z);
  sphere.userData = exoplanet;
  scene.add(sphere);
}

export function generateRandomColorHexCode(): string {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
}

export function redirectToExoplanetsNASAPage(
  clickedExoplanet: THREE.Object3D<THREE.Event>
) {
  window.location.href =
    'https://exoplanetarchive.ipac.caltech.edu/overview/' +
    clickedExoplanet.userData?.pl_name;
}

export function addTooltip(
  clickedExoplanet: THREE.Object3D<THREE.Event>,
  scene: THREE.Scene
) {
  // tooltip rendering inspired by this repo (https://github.com/simondevyoutube/Quick_3D_MMORPG/blob/547884332ca650abe96264f7230702d36481b9bc/client/main.js)
  let canvas = document.createElement('CANVAS') as HTMLCanvasElement;
  let context2d = canvas.getContext('2d') as CanvasRenderingContext2D;
  context2d.canvas.width = 256;
  context2d.canvas.height = 128;
  context2d.fillStyle = '#FFF';
  context2d.font = '18pt Helvetica';
  context2d.shadowOffsetX = 3;
  context2d.shadowOffsetY = 3;
  context2d.shadowColor = 'rgba(0,0,0,0.3)';
  context2d.shadowBlur = 4;
  context2d.textAlign = 'center';
  context2d.fillText(clickedExoplanet.userData.pl_name, 128, 64);

  const map = new THREE.CanvasTexture(context2d.canvas);

  let tooltip = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: map, color: 0xffffff })
  );
  tooltip.scale.set(2, 2, 1);
  tooltip.position.x = clickedExoplanet.position.x;
  tooltip.position.y = clickedExoplanet.position.y + 0.5;
  tooltip.position.z = clickedExoplanet.position.z;

  scene.add(tooltip);

  setTimeout(() => {
    scene.remove(tooltip);
  }, 3000);
}
