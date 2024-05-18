// stadium.js
import * as CANNON from 'cannon-es';

function create(scene, world, loader) {

    // Define the ground material outside the function for reuse
    const groundMaterial = new CANNON.Material('ground');
    groundMaterial.restitution = 0.8;
    // Create the ground body
    const groundBody = new CANNON.Body({
        mass: 0,
        material: groundMaterial,
        shape: new CANNON.Plane(),
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate the ground to lie flat
    world.addBody(groundBody);

    // Load the stadium model
    loader.load(
        '../../models/stadium/scene.gltf',
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
            console.error('An error happened while loading the stadium model:', error);
        }
    );
}

export default { create };
