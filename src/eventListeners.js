// eventListeners.js
import * as THREE from "three";
import * as TWEEN from "tween";
import buttonsData from "./data/buttons.json";
import { buttonMeshes } from "./objects/goalButtons";
import { updateGoalButtonsVisibility } from "./objects/goalButtons";
import { sphereBody, setCameraManualControl } from "./objects/football";

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onButtonClick(clickedObject, camera) {
  const buttonIndex = buttonMeshes.indexOf(clickedObject);
  if (buttonIndex !== -1) {
    const buttonData = buttonsData[buttonIndex];
    const isVisible = updateGoalButtonsVisibility();
    console.log("Are goal buttons visible?", isVisible);
    if (buttonData.label === "Games" && isVisible) {
      const targetPosition = { x: 1.5, y: 0.75, z: -36 }; // Replace with the bottom right corner coordinates of your goal
      shootBall(targetPosition, camera);
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

// Function that handles both mouse and touch events to extract the client coordinates.
function getClientCoordinates(event) {
  if (event.touches) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  } else {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }
}


// Add event listener for onMouseDown and onTouchStart
document.addEventListener("mousedown", (e) => {
  const { x, y } = getClientCoordinates(e);
  startX = x;
  startY = y;
  isMouseDown = true;
});

document.addEventListener("touchstart", (e) => {
  const { x, y } = getClientCoordinates(e);
  startX = x;
  startY = y;
  isMouseDown = true;
});

// Add event listener for onMouseUp and onTouchEnd
document.addEventListener("mouseup", (e) => {
  if (isMouseDown) {
    const { x, y } = getClientCoordinates(e);
    const dx = x - startX;
    const dy = y - startY;

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

document.addEventListener("touchend", (e) => {
  if (isMouseDown) {
    const { x, y } = getClientCoordinates(e);
    const dx = x - startX;
    const dy = y - startY;

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
function shootBall(targetPosition, camera) {
  const initialPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };

  // Set manual camera control to true to prevent automatic updates
  setCameraManualControl(true);

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
    .onComplete(() => {
      // Ensure the camera is exactly at the target position
      camera.position.set(
        targetPosition.x,
        targetPosition.y,
        targetPosition.z
      );
    })
    .start();
}

export { onMouseMove, onMouseClick, onWindowResize };
