// football.js
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export let sphereBody;
export let football;

function create(scene, world, loader) {
    // Define material for the football
    const footballMaterial = new CANNON.Material();
    footballMaterial.restitution = 0.5;

    // Create the football body
    sphereBody = new CANNON.Body({
        mass: 5,
        shape: new CANNON.Sphere(0.13),
        material: footballMaterial,
        position: new CANNON.Vec3(0, 100, 0),
        angularVelocity: new CANNON.Vec3(10, 0, 0),
        linearDamping: 0.2,
        angularDamping: 0.5
    });
      
    world.addBody(sphereBody);

    // Load the football model
    loader.load('../../models/football/scene.gltf', (gltf) => {
        football = gltf.scene;
        const scale = 0.003;
        football.scale.set(scale, scale, scale);
        scene.add(gltf.scene);
    });
}

const cameraOffset = new THREE.Vector3(0, 0.5, 1.2);

function animate(camera) {
    if (football && sphereBody) {
        football.position.copy(sphereBody.position);
        football.quaternion.copy(sphereBody.quaternion);

        camera.position.copy(sphereBody.position).add(cameraOffset);
    }
}

let startX, startY;

// Track whether the mouse is down
let isMouseDown = false;

// Add event listener for onMouseDown
document.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isMouseDown = true;
});

// Add event listener for onMouseUp
document.addEventListener('mouseup', (e) => {
    if (isMouseDown) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        const VELOCITY_FACTOR = 0.015;
        const magnitude = Math.sqrt(dx * dx + dy * dy);

        // Apply velocity to the football
        sphereBody.velocity.set(-dx * VELOCITY_FACTOR, magnitude * VELOCITY_FACTOR, -dy * VELOCITY_FACTOR);
        isMouseDown = false; // Reset the mouse down flag
    }
});

export default { create, animate };
