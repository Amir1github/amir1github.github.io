// Find the latest version by visiting https://unpkg.com/three, currently it's 0.126.1

const EarthHtml = document.getElementById('earth');

// Функция для преобразования 3D-позиции в 2D-координаты экрана
function toScreenPosition(obj, camera) {
  const vector = new THREE.Vector3();

  // Получаем позицию объекта
  obj.getWorldPosition(vector);
  vector.project(camera);

  // Преобразуем координаты в пиксели для отображения на экране
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;
  
  return { x, y };
}

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

import {
  starsTexture,
  sunTexture,
  mercuryTexture,
  venusTexture,
  earthTexture,
  marsTexture,
  jupiterTexture,
  saturnTexture,
  saturnRingTexture,
  uranusRingTexture,
  uranusTexture,
  neptuneTexture,
  plutoTexture,
} from "./images.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.maxDistance = 1000;
camera.position.set(-90, 140, 400);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const textureLoader = new THREE.TextureLoader();

// Сфера с текстурой звёзд
const sphereGeo = new THREE.SphereGeometry(1000, 100, 100); 
const starsTextureMaterial = new THREE.MeshBasicMaterial({
  map: textureLoader.load("./stars.jpg"), 
  side: THREE.BackSide, 
});
const starsSphere = new THREE.Mesh(sphereGeo, starsTextureMaterial);
scene.add(starsSphere); 

// Sun Geometry
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Planets Geometries
function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const meshObj = new THREE.Object3D();
  meshObj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    meshObj.add(ringMesh);
    ringMesh.position.x = position;
    ringMesh.rotation.x = Math.PI * -0.5;
  }

  scene.add(meshObj);
  mesh.position.x = position;

  return { mesh, meshObj };
}

let mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(2.8, plutoTexture, 216);

// Adding Point light refers sunlight
const pointLight = new THREE.PointLight(0xffffff, 2.5, 300);
scene.add(pointLight);

function animate() {
  // Вращение объектов
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);
  
  // Вращение вокруг солнца
  mercury.meshObj.rotateY(0.04);
  venus.meshObj.rotateY(0.015);
  earth.meshObj.rotateY(0.01);
  mars.meshObj.rotateY(0.008);
  jupiter.meshObj.rotateY(0.002);
  saturn.meshObj.rotateY(0.0009);
  uranus.meshObj.rotateY(0.0004);
  neptune.meshObj.rotateY(0.0001);
  pluto.meshObj.rotateY(0.00007);

  const screenPos = toScreenPosition(earth.mesh, camera);
  EarthHtml.style.left = `${screenPos.x}px`;
  EarthHtml.style.top = `${screenPos.y}px`;

  

  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

const earthButton = document.getElementById('earthbut');



animate();
let isHighlighted = false;

// Функция для подсветки Земли
function highlightEarth() {
  if (!isHighlighted) {
    // Если подсветка выключена, включаем её
    earth.mesh.material.emissive.set(0xffff00); // Установить эмиссивный цвет (желтый)
    earth.mesh.material.emissiveIntensity = 0.5; // Устанавливаем интенсивность эмиссии
    isHighlighted = true; // Обновляем состояние
  } else {
    // Если подсветка включена, выключаем её
    earth.mesh.material.emissive.set(0x000000); // Установить эмиссивный цвет на черный (выключить подсветку)
    earth.mesh.material.emissiveIntensity = 0; // Устанавливаем интенсивность эмиссии на 0
    isHighlighted = false; // Обновляем состояние
  }
}

// Событие нажатия на кнопку
earthButton.addEventListener('click', highlightEarth);
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
