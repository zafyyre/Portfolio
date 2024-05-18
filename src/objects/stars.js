// stars.js
import * as THREE from 'three';


function create(scene) {
    function addStar() {  const star = new THREE.Mesh( // mesh together a star
        new THREE.SphereGeometry( 0.25 ), // make the object for the star
        new THREE.MeshStandardMaterial( { color: 0xffffff }) // make the material for the star
        );

        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 150 ) ); // randomly generate an x,y,z position
                                                                    // this helper function generates different numbers between -150 and 150
        star.position.set(x, y, z); // set the position of the star
        scene.add(star); // add star to scene
    }

    Array(1000).fill().forEach(addStar); // create 300 randomly positioned stars

}

export default { create };