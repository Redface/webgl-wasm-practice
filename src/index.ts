import * as THREE from 'three';
// @ts-ignore
import {
  calc_aspect as calcAspect,
  calc_rotation as calcRotation,
} from '../wasm-support/src/lib.rs';
import './index.css';
// @ts-ignore
import backgroundImg from './imgs/wild-style.jpg';

function initRenderer(id: string) {
  const canvas = document.querySelector(`#${id}`);
  if (!canvas) {
    throw new Error('Target ID for canvas does not exist');
  }
  return new THREE.WebGLRenderer({ canvas });
}

function initCamera(fov: number, aspect: number, near: number, far: number) {
  return new THREE.PerspectiveCamera(fov, aspect, near, far);
}

function initScene() {
  return new THREE.Scene();
}

function initBackground() {
  // const backgroundTexture = new THREE.TextureLoader().load("imgs/wild-style.jpg");
  const backgroundTexture = new THREE.TextureLoader().load(backgroundImg);
  backgroundTexture.wrapS = THREE.RepeatWrapping;
  backgroundTexture.wrapT = THREE.RepeatWrapping;

  return backgroundTexture;
}

function initLight() {
  const color = 0xffffff;
  const intensity = 3;
  return new THREE.PointLight(color, intensity);
}

function initSphereGeometry(
  radius: number,
  widthSegments: number,
  heightSegments: number,
) {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
}

function initSphereMesh(sphereGeometry: THREE.SphereGeometry) {
  const sunMaterial = new THREE.MeshNormalMaterial();
  return new THREE.Mesh(sphereGeometry, sunMaterial);
}

function initArm() {
  const armGeometry = new THREE.BoxGeometry(3, 1, 1);
  const armMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(armGeometry, armMaterial);
}

function initLeg() {
  const legGeometry = new THREE.BoxGeometry(3, 1, 1);
  const legMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  return new THREE.Mesh(legGeometry, legMaterial);
}

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
  const canvas = renderer.domElement;
  const { clientWidth, clientHeight, width, height } = canvas;
  const needResize = width !== clientWidth || height !== clientHeight;
  if (needResize) {
    renderer.setSize(clientWidth, clientHeight, false);
  }
  return needResize;
}

function run() {
  const renderer = initRenderer('canvas');

  const camera = initCamera(40, 2, 0.1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(0, 0, 0);

  const scene = initScene();

  const backgroundTexture = initBackground();
  if (backgroundTexture) {
    scene.background = backgroundTexture;
  }
  const light = initLight();
  scene.add(light);

  const sphereGeometry = initSphereGeometry(1, 10, 10);

  const rootObject = new THREE.Object3D();
  rootObject.position.y = -5;
  scene.add(rootObject);

  // head
  const headObject = new THREE.Object3D();
  const headMesh = initSphereMesh(sphereGeometry);
  headObject.add(headMesh);
  rootObject.add(headObject);

  // body
  const bodyObject = new THREE.Object3D();

  const bodyMesh = initSphereMesh(sphereGeometry);
  bodyMesh.scale.set(2, 2, 2);
  bodyObject.add(bodyMesh);
  const leftArmMesh = initArm();
  const rightArmMesh = leftArmMesh.clone();

  leftArmMesh.position.x = 3;
  rightArmMesh.position.x = -3;
  bodyObject.add(leftArmMesh);
  bodyObject.add(rightArmMesh);

  // legs
  const leftLegMesh = initLeg();
  const rightLegMesh = leftArmMesh.clone();

  leftLegMesh.rotation.x = THREE.MathUtils.degToRad(90);
  leftLegMesh.rotation.y = THREE.MathUtils.degToRad(70);
  leftLegMesh.position.x = 1;
  leftLegMesh.position.y = 3;
  bodyObject.add(leftLegMesh);

  rightLegMesh.rotation.x = THREE.MathUtils.degToRad(90);
  rightLegMesh.rotation.y = THREE.MathUtils.degToRad(-70);
  rightLegMesh.position.x = -1;
  rightLegMesh.position.y = 3;
  bodyObject.add(rightLegMesh);

  bodyObject.position.y = 3;
  rootObject.add(bodyObject);

  const divEl = document.createElement('div');
  document.body.appendChild(divEl);

  function render(time: number) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      const { clientWidth, clientHeight } = canvas;
      camera.aspect = calcAspect(clientWidth, clientHeight);
      camera.updateProjectionMatrix();
    }

    const yRotation = calcRotation(time, 0.001);
    divEl.innerHTML = `Y Rotation: ${yRotation}`;

    rootObject.rotation.y = yRotation;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

run();
