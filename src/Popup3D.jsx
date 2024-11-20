import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';

function Popup3D() {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.z = 5; // Adjust the camera's position as needed
  });

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="red" />
      </mesh>
    </Canvas>
  );
}

export default Popup3D;






//import Box from 'C:/Users/Fred/OneDrive/Documents/GitHub/ShipOfThesis/src/Box'; // Assuming Box.js is in the same directory