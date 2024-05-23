// stars.js
import * as THREE from 'three';

function create(scene) {
    const stars = [];

    function addStar() {  
        const starGeometry = new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.05, 0.1), 24, 24); // random size
        const starMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 75%)`), // random color
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.5
        }); 

        const star = new THREE.Mesh(starGeometry, starMaterial);

        // Ensure stars are positioned mainly in the sky
        const [x, y, z] = [
            THREE.MathUtils.randFloatSpread(125),
            THREE.MathUtils.randFloat(25, 125), // Position stars at a height above the stadium
            THREE.MathUtils.randFloatSpread(125)
        ];

        star.position.set(x, y, z);
        scene.add(star);

        // Store the initial position
        stars.push({
            mesh: star,
            initialPosition: new THREE.Vector3(x, y, z)
        });
    }

    Array(1000).fill().forEach(addStar);
}

export default { create };
