// football.js
import * as THREE from "three";
import * as CANNON from "cannon-es";

export let sphereBody;
export let football;
let isCameraManual = false;
const cameraOffset = new THREE.Vector3(0, 0.5, 1.2);

const penaltyArea = {
  minX: -7.5,
  maxX: 6.5,
  minZ: -35.6,
  maxZ: -28.8
};

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
  loader.load("../../models/football/scene.gltf", (gltf) => {
    football = gltf.scene;
    const scale = 0.003;
    football.scale.set(scale, scale, scale);
    scene.add(gltf.scene);
  });
}

// Function to check if the ball is in the penalty area
export function isBallInPenaltyArea(ball) {
  return (
    ball.position.x >= penaltyArea.minX &&
    ball.position.x <= penaltyArea.maxX &&
    ball.position.z >= penaltyArea.minZ &&
    ball.position.z <= penaltyArea.maxZ
  );
}

export function setCameraManualControl(value) {
  isCameraManual = value;
}

function animate(camera) {
  if (football && sphereBody) {
    football.position.copy(sphereBody.position);
    football.quaternion.copy(sphereBody.quaternion);

    // console.log(sphereBody.position)
    // Modified animate function to only update the camera position if isCameraManual is false.
    if (!isCameraManual) {
      camera.position.copy(sphereBody.position).add(cameraOffset);
    }
  }
}

export default { create, animate, isBallInPenaltyArea, setCameraManualControl };
