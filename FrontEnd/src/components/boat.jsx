import React, { Suspense } from 'react'
import { Canvas, render, useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import statueUrl from './3Dboat.obj'
import { OrbitControls } from '@react-three/drei'


function Model({url}) {
  const group = useLoader(OBJLoader, url)
  return <primitive object={group} scale={[0.025, 0.025, 0.025]} />
}

const Boat = () => {
  return (    
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
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