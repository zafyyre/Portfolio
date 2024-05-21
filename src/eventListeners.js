// eventListeners.js
import * as THREE from 'three';
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
  
  function onButtonClick(clickedObject) {
    const buttonIndex = buttonMeshes.indexOf(clickedObject);
    if (buttonIndex !== -1) {
      const buttonData = buttonsData[buttonIndex];
      alert(`Button ${buttonData.label} clicked!`);
      if (buttonData.label === 'Games') {
        window.location.assign('/src/games/gamesList.html');
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
      onButtonClick(intersects[0].object);
    }
  }
  
  function onWindowResize(camera, renderer) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  export { onMouseMove, onMouseClick, onWindowResize };