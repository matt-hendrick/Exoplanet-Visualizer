import * as THREE from 'three';
// import { Mesh, MeshBasicMaterial } from 'three';
import { convertAstronomicalDegreesToCartesian } from './math';
import { Exoplanet } from './types';

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

let gridDisplayed = false;
let gridSize = 1000;
let xyGrid = new THREE.GridHelper(gridSize, gridSize, 'red');
let xzGrid = new THREE.GridHelper(gridSize, gridSize, 'blue');
xzGrid.geometry.rotateX(Math.PI / 2);

export function toggleGrid(scene: THREE.Scene) {
  if (gridDisplayed) {
    scene.remove(xyGrid);
    scene.remove(xzGrid);
  } else {
    scene.add(xyGrid);
    scene.add(xzGrid);
  }
  gridDisplayed = !gridDisplayed;
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
  context2d.canvas.width = 552;
  context2d.canvas.height = 256;
  context2d.fillStyle = '#FFF';

  const fontSize = 18;
  context2d.font = `bold ${fontSize}pt Arial`;
  context2d.textAlign = 'center';

  const textLines = [
    `Name: ${clickedExoplanet.userData.pl_name}`,
    `Right Ascension: ${clickedExoplanet.userData.ra} degrees`,
    `Declination: ${clickedExoplanet.userData.dec} degrees`,
    `Distance: ${clickedExoplanet.userData.sy_dist} parsecs`,
  ];

  for (let i = 0; i < textLines.length; i++) {
    context2d.fillText(textLines[i], 256, 64 + fontSize * i);
  }

  const map = new THREE.CanvasTexture(context2d.canvas);

  let tooltipColor = 0xffffff;

  // this would make tooltip match exoplanet color, but it is pretty ugly
  //   if (
  //     clickedExoplanet instanceof Mesh &&
  //     clickedExoplanet.material instanceof MeshBasicMaterial &&
  //     clickedExoplanet.material.color
  //   ) {
  //     tooltipColor = clickedExoplanet.material.color.getHex();
  //   }
  let tooltip = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: map, color: tooltipColor })
  );
  tooltip.scale.set(2, 2, 1);
  tooltip.position.x = clickedExoplanet.position.x;
  tooltip.position.y = clickedExoplanet.position.y + 0.25;
  tooltip.position.z = clickedExoplanet.position.z;

  scene.add(tooltip);

  setTimeout(() => {
    scene.remove(tooltip);
  }, 4000);
}
