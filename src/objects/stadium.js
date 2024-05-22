// stadium.js
import * as CANNON from "cannon-es";

const stadiumArea = {
  minX: -18.7,
  maxX: 17.7,
  minZ: -35.6,
  maxZ: 38.5
};

function create(scene, world, loader) {
  // Define the ground material outside the function for reuse
  const groundMaterial = new CANNON.Material("ground");
  groundMaterial.restitution = 0.8;
  // Create the ground body
  const groundBody = new CANNON.Body({
    mass: 0,
    material: groundMaterial,
    shape: new CANNON.Plane()
  });

  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate the ground to lie flat
  world.addBody(groundBody);

  // Create the walls of the stadium area
  const wallMaterial = new CANNON.Material("wall");
  const wallThickness = 1;

  // Left wall
  const leftWallBody = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
    shape: new CANNON.Plane()
  });
  leftWallBody.position.set(stadiumArea.minX - wallThickness / 2, 0, 0);
  leftWallBody.quaternion.setFromEuler(0, Math.PI / 2, 0); // Rotate to be vertical
  world.addBody(leftWallBody);

  // Right wall
  const rightWallBody = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
    shape: new CANNON.Plane()
  });
  rightWallBody.position.set(stadiumArea.maxX + wallThickness / 2, 0, 0);
  rightWallBody.quaternion.setFromEuler(0, -Math.PI / 2, 0); // Rotate to be vertical
  world.addBody(rightWallBody);

  // Front wall
  const frontWallBody = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
    shape: new CANNON.Plane()
  });
  frontWallBody.position.set(0, 0, stadiumArea.minZ - wallThickness / 2);
  frontWallBody.quaternion.setFromEuler(0, 0, 0); // Ensure correct orientation
  world.addBody(frontWallBody);

  // Back wall
  const backWallBody = new CANNON.Body({
    mass: 0,
    material: wallMaterial,
    shape: new CANNON.Plane()
  });
  backWallBody.position.set(0, 0, stadiumArea.maxZ + wallThickness / 2);
  backWallBody.quaternion.setFromEuler(0, Math.PI, 0); // Rotate to be vertical
  world.addBody(backWallBody);

  // Load the stadium model
  loader.load(
    "../../models/stadium/scene.gltf",
    (gltf) => {
      const stadium = gltf.scene;
      const scale = 2;

      stadium.scale.set(scale, scale, scale);
      stadium.position.set(23.5, -1.1, 45);
      stadium.rotation.y = Math.PI / 2;

      scene.add(stadium); // Directly add stadium instead of gltf.scene for clarity
    },
    undefined, // onProgress callback, can be omitted if not needed
    (error) => {
      console.error(
        "An error happened while loading the stadium model:",
        error
      );
    }
  );
}

export default { create };
