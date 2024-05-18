// goalButtons.js
import * as THREE from 'three';
import buttonsData from '../../src/data/buttons.json'
import { TextGeometry } from 'three/examples/jsm/Addons.js';

const positions = [
  new THREE.Vector3(-2.375, 2.75, -35.69),  // Top Left
  new THREE.Vector3(1.5, 2.75, -35.69),   // Top Right
  new THREE.Vector3(0, 1.85, -35.68),    // Middle
  new THREE.Vector3(-2.375, 0.75, -35.69),   // Bottom Left
  new THREE.Vector3(1.5, 0.75, -35.69)     // Bottom Right
];

export const buttonMeshes = [];

function create(scene, loader) {
    loader.load('./fonts/EA Logo_Regular.json', function(font) {
        buttonsData.forEach((buttonData, index) => {
      
          const shape = new THREE.Shape();
      
          if (buttonData.label === 'About') {
            // Create a circular shape for the "About" button
            shape.absarc(0, 0, 1.20, 0, Math.PI * 2, false);
          } else {
            shape.moveTo(2.5, 1.25);
            shape.lineTo(-1.5, 1.25);
            shape.lineTo(-1.5, -1);
            shape.lineTo(2.5, -1);
          } 
      
          const geometry = new THREE.ShapeGeometry(shape); // Circular button
          const material = new THREE.MeshBasicMaterial({ color: buttonData.color });
          const buttonMesh = new THREE.Mesh(geometry, material);
      
          // buttonMesh.scale.z = -1;
      
          // Add the button mesh to the scene
          scene.add(buttonMesh);
      
          // Initially set the button meshes to be invisible
          buttonMesh.visible = false;
      
          // Store the button mesh for later positioning and interaction
          buttonMeshes.push(buttonMesh);
      
          // Create text geometry
          const textGeometry = new TextGeometry(buttonData.label, {
            font: font,
            size: 0.3, // Adjust the size as needed
            height: 0.01,
          });
      
          // Center the text geometry
          textGeometry.center();
      
          // Create text material
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
          // Create text mesh
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      
          // Position the text mesh on the button mesh
          if (buttonData.label != 'About') {
            textMesh.position.set(0.4, 0.2, 0.1); // Slightly above the button mesh
          } else {
            textMesh.position.set(0, 0, 0.1); // Slightly above the button mesh
          }
      
          // Add the text mesh to the button mesh
          buttonMesh.add(textMesh);
        });
      });
      
      
}


// Function to update Three.js button positions
function animate() {
  positions.forEach((pos, index) => {
    if (buttonMeshes[index]) {
        buttonMeshes[index].position.copy(pos);
    }
  });
}



export default { create, animate };