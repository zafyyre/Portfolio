// welcomeText.js
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

function create(scene, loader) {
    loader.load('./fonts/Roboto_Regular.json', function(font){
        const zaafGeometry = new TextGeometry(`Hello! Welcome to Zaaf's World`, {
            font: font,
            size: 2,
            depth: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });
        
        const zaafMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const zaafMesh = new THREE.Mesh(zaafGeometry, zaafMaterial);

        const goalTextGeometry = new TextGeometry(`Dribble to the Penalty Area and take a shot!`, {
            font: font,
            size: 1,
            depth: 0.1,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        })

        const goalTextMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const goalTextMesh = new THREE.Mesh(goalTextGeometry, goalTextMaterial);

        goalTextMesh.position.set(-13.5, 7.5, -35)
        zaafMesh.position.set(-19.25, 20, -40);
        scene.add(zaafMesh, goalTextMesh);
    });  
}

export default { create };