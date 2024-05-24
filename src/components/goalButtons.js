// goalButtons.js
import * as THREE from "three";
import buttonsData from "../../src/data/buttons.json";
import { TextGeometry } from "three/examples/jsm/Addons.js";
import { sphereBody, isBallInPenaltyArea } from "./football";

export const buttonMeshes = [];

function create(scene, loader) {
  loader.load("./fonts/EA Logo_Regular.json", function (font) {
    buttonsData.forEach((buttonData) => {
      const shape = new THREE.Shape();

      if (buttonData.label === "About") {
        shape.absarc(0, 0, 1.05, 0, Math.PI * 2, false);
      } else {
        shape.moveTo(2.5, 1.25);
        shape.lineTo(-1.5, 1.25);
        shape.lineTo(-1.5, -1);
        shape.lineTo(2.5, -1);
      }

      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({ color: buttonData.color });
      const buttonMesh = new THREE.Mesh(geometry, material);

      scene.add(buttonMesh);
      buttonMesh.visible = false;
      buttonMesh.position.set(
        buttonData.buttonPosition.x,
        buttonData.buttonPosition.y,
        buttonData.buttonPosition.z
      );

      buttonMeshes.push(buttonMesh);

      const textGeometry = new TextGeometry(buttonData.label, {
        font: font,
        size: 0.3,
        depth: 0.01,
      });

      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      // Position the text mesh on the button mesh
      if (buttonData.label != "About") {
        textMesh.position.set(0.4, 0.2, 0.1); // Slightly above the button mesh
      } else {
        textMesh.position.set(0, 0, 0.1); // Slightly above the button mesh
      }

      buttonMesh.add(textMesh);
    });
  });
}

export function updateGoalButtonsVisibility() {
  let anyVisible = false;
  buttonMeshes.forEach((mesh) => {
    const checkBallInPenaltyArea = isBallInPenaltyArea(sphereBody);
    mesh.visible = checkBallInPenaltyArea;
    if (checkBallInPenaltyArea) anyVisible = true;
  });
  return anyVisible;
}

function animate() {
  buttonsData.forEach((buttonData, index) => {
    if (buttonMeshes[index]) {
      buttonMeshes[index].position.set(
        buttonData.buttonPosition.x,
        buttonData.buttonPosition.y,
        buttonData.buttonPosition.z
      );
    }
  });
  updateGoalButtonsVisibility();
}

export default { create, animate, updateGoalButtonsVisibility };
