// eventListeners.js
import * as THREE from "three";
import * as TWEEN from "tween";
import buttonsData from "../data/buttons.json";
import { buttonMeshes, updateGoalButtonsVisibility } from "/src/components/goalButtons";
import { sphereBody, setCameraManualControl } from "/src/components/football";
import { loadButtonDetails } from "./goal-details"

// Track whether the mouse is down
let isMouseDown = false;
let startX, startY;

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onButtonClick(clickedObject, camera) {
  const buttonIndex = buttonMeshes.indexOf(clickedObject);
  if (buttonIndex !== -1) {
    // checks if the clickedObject is one of the buttonMeshes
    const buttonData = buttonsData[buttonIndex];
    const isVisible = updateGoalButtonsVisibility();
    // console.log("Are goal buttons visible?", isVisible);
    if (isVisible) {
      const targetPosition = buttonData.clickPosition;
      if (targetPosition) {
        exploreButton(targetPosition, camera);
        loadButtonDetails(buttonData.text);
      }
    }
  }
}

function onClickBack() {
  const goalElement = document.getElementById("goal");
  goalElement.style.display = "none";
  setCameraManualControl(false);
}

function onClick(event, camera) {
  // Calculate mouse position in device coordinates (-1 to +1)
  const { x, y } = getClientCoordinates(event);
  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;

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

/**
 * Extracts clientX and clientY from mouse and touch events.
 * @param {Event} event - The event object (mouse or touch).
 * @returns {Object} - An object containing x and y coordinates.
 */
function getClientCoordinates(event) {
  if (event.touches && event.touches.length > 0) {
    // For touch events, get the coordinates from the first touch point
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  } else if (event.changedTouches && event.changedTouches.length > 0) {
    // For touchend events, get the coordinates from the first changed touch point
    return {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  } else {
    // For mouse events, get the coordinates from the event object
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }
}

/**
 * Handles the start of a mouse or touch event.
 * @param {Event} event - The event object (mouse or touch).
 */
function onStart(event) {

  if (event.type === 'touchstart') {
    event.preventDefault(); // Prevent default behavior (e.g., scrolling) for touch events
  }

  const { x, y } = getClientCoordinates(event);
  startX = x;
  startY = y;
  isMouseDown = true;
}

/**
 * Handles the end of a mouse or touch event.
 * @param {Event} event - The event object (mouse or touch).
 */
function onEnd(event) {

  if (event.type === 'touchend') {
    event.preventDefault(); // Prevent default behavior for touch events
  }
  
  if (isMouseDown) {
    const { x, y } = getClientCoordinates(event);
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
}

// Function to animate the camera into one of the goal bttons
function exploreButton(targetPosition, camera) {
  const initialPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
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
      camera.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
    })
    .start();
}

export default { onClick, onWindowResize, onStart, onEnd, onClickBack };
