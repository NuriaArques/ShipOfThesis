import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function ThreeDScene() {
    const ref = useRef();

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls
                ref={ref}
                args={[camera, canvas]}
                autoRotate={true}
                autoRotateSpeed={0.2}
            />
            {/* Your 3D models will go here */}
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial color="hotpink" />
            </mesh>
        </Canvas>
    );
}

export default ThreeDScene;