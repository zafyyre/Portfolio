import * as THREE from 'three';

function create(scene) {
    function addStar() {  
        const starGeometry = new THREE.SphereGeometry(THREE.MathUtils.randFloat(0.1, 0.4), 24, 24); // random size
        const starMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 75%)`), // random color
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.5
        }); 

        const star = new THREE.Mesh(starGeometry, starMaterial);

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));
        star.position.set(x, y, z);
        scene.add(star);
    }

    Array(1000).fill().forEach(addStar);
}

export default { create };
