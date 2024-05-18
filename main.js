// main.js
import './style.css';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stadium from './src/objects/stadium';
import Football from './src/objects/football'
import GoalButtons from './src/objects/goalButtons';
import WelcomeText from './src/objects/welcomeText';
import Stars from './src/objects/stars';
import { onMouseMove, onMouseClick, onWindowResize } from './src/eventListeners';

// DEBUGGING
// import CannonDebugger from 'cannon-es-debugger';
// import { OrbitControls } from 'three/examples/jsm/Addons.js';


// Initialize Scene, Camera, Renderer
const gltfLoader = new GLTFLoader();
const fontLoader = new FontLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({ // renders the actual graphics to the scene
  canvas: document.querySelector( '#background' ) // needs to know which dom element to use
}); 

camera.position.set(0, 100, 0) // Set camera to this point so it doesn't show the loaded objects first

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight ); // makes it a full screen canvas

renderer.render( scene, camera ); // passing the scene and camera to render it to the screen


// DEFINE GRAVITY
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0)
});

// FOOTBALL BALL
Football.create(scene, world, gltfLoader);

// WELCOME TEXT
WelcomeText.create(scene, fontLoader);

// FOOTBALL STADIUM
Stadium.create(scene, world, gltfLoader);

// GOAL BUTTONS
GoalButtons.create(scene, fontLoader);

// // STARS GENERATION
// Stars.create(scene);

// LIGHTING
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // reduced intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // reduced intensity
scene.add(directionalLight);
directionalLight.position.set(0, 10, 0);

// EVENT LISTENERS
window.addEventListener('mousemove', (event) => onMouseMove(event, camera), false);
window.addEventListener('click', (event) => onMouseClick(event, camera), false);
window.addEventListener('resize', () => onWindowResize(camera, renderer), false);

// DEBUGGING
// const controls = new OrbitControls( camera, renderer.domElement ); // listens to dom events on the mouse and updates the camera accordingly
// const cannonDebugger = new CannonDebugger(scene, world);


// ANIMATE
// recursive function that calls the render function automatically (game loop)
function animate() {
  requestAnimationFrame( animate );

  Football.animate(camera);
  GoalButtons.animate();

  world.fixedStep();
  renderer.render( scene, camera );
}

animate();