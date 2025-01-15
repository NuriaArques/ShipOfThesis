import React, { Suspense } from 'react'
import { Canvas, render, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import statueUrl from './3Dboat2.obj'
import { OrbitControls, Center } from '@react-three/drei'


function Model({url}) {
  const group = useLoader(OBJLoader, url)
  return( <Center>
  <primitive object={group} scale={[0.005, 0.005, 0.005]} />
  </Center>);
}

const Boat = () => {
  return (    
    <Canvas
    camera={{
      position: [0, -40, 10], // Adjust the camera's initial position [x, y, z]
      fov: 50,             // Field of view
    }}>
      <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[20, 20, 20]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Suspense fallback={null}>
        <Model url={statueUrl} rotation={[-0.1, 0, 0]} />
      </Suspense>
      <OrbitControls rotateSpeed={0.5} zoomSpeed={0.8} />
    </Canvas>
  );
}

export default Boat;
