import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function BoatModelViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400/300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 300);
    console.log('Scene, Camera, and Renderer created'); // Debug log

    const currentMountRef = mountRef.current;
    // currentMountRef.appendChild(renderer.domElement);
    if (currentMountRef) {
        currentMountRef.appendChild(renderer.domElement);
        console.log('Renderer appended to DOM');
    } else {
        console.error('mountRef is null');
    }

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
        if (currentMountRef){
            currentMountRef.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, []);

//   return (
//     <div ref={mountRef}></div>
//   );
}

export default BoatModelViewer;
