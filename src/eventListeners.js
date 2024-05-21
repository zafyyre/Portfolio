// eventListeners.js
import * as THREE from "three";
import * as TWEEN from "tween";
import buttonsData from "./data/buttons.json";
import { buttonMeshes } from "./objects/goalButtons";
import { updateGoalButtonsVisibility } from "./objects/goalButtons";
import { sphereBody } from "./objects/football";

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.display = 'block';
});

function onButtonClick(clickedObject, camera) {
  const buttonIndex = buttonMeshes.indexOf(clickedObject);
  if (buttonIndex !== -1) {
    const buttonData = buttonsData[buttonIndex];
    const isVisible = updateGoalButtonsVisibility();
    console.log("Are goal buttons visible?", isVisible);
    if (buttonData.label === "Games" && isVisible) {
      const targetPosition = { x: 1.5, y: 0.75, z: -36 }; // Replace with the bottom right corner coordinates of your goal
      animateCamera(targetPosition, camera);
    }
  }
}

function onMouseMove(event, camera) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(buttonMeshes, false);
}

function onMouseClick(event, camera) {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the raycaster
  const intersects = raycaster.intersectObjects(buttonMeshes, false);

  if (intersects.length > 0) {
    onButtonClick(intersects[0].object, camera);
  }
}

function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

let startX, startY;

// Track whether the mouse is down
let isMouseDown = false;

// Add event listener for onMouseDown
document.addEventListener("mousedown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  isMouseDown = true;
});

// Add event listener for onMouseUp
document.addEventListener("mouseup", (e) => {
  if (isMouseDown) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const VELOCITY_FACTOR = 0.015;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    // Apply velocity to the football
    sphereBody.velocity.set(
      -dx * VELOCITY_FACTOR,
      magnitude * VELOCITY_FACTOR,
      -dy * VELOCITY_FACTOR
    );
    isMouseDown = false; // Reset the mouse down flag
  }
});

// Function to animate the camera
function animateCamera(targetPosition, camera) {
  const initialPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };

  new TWEEN.Tween(initialPosition)
    .to(targetPosition, 2000) // 2 seconds transition
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      camera.position.set(
        initialPosition.x,
        initialPosition.y,
        initialPosition.z
      );
    })
    .start();
}

export { onMouseMove, onMouseClick, onWindowResize };
