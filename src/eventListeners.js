// eventListeners.js
import * as THREE from 'three';
import * as TWEEN from 'tween';
import buttonsData from './data/buttons.json'
import { buttonMeshes } from './objects/goalButtons'; 
import { sphereBody } from './objects/football';


// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onButtonHover(hoveredObject) {
    // First, make all button meshes invisible smoothly
    buttonMeshes.forEach(mesh => {
      mesh.visible = false;
    });
  
    // Make only the intersected button mesh visible smoothly
    if (hoveredObject) {
      hoveredObject.visible = true;
    }
  }
  
  function onButtonClick(clickedObject, camera) {
    const buttonIndex = buttonMeshes.indexOf(clickedObject);
    if (buttonIndex !== -1) {
      const buttonData = buttonsData[buttonIndex];
      if (buttonData.label === 'Games') {
        const targetPosition = { x: 1.5, y: 0.75, z:-36 }; // Replace with the bottom right corner coordinates of your goal
        animateCamera(targetPosition, camera);
      }
    }
  }
  
  function onMouseMove(event, camera) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObjects(buttonMeshes, false);
  
    if (intersects.length > 0) {
      onButtonHover(intersects[0].object);
    } else {
      onButtonHover(null);
    }
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

  // Function to animate the camera
function animateCamera(targetPosition, camera) {
  const initialPosition = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };

  const tween = new TWEEN.Tween(initialPosition)
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