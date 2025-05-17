
import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

const CubeMesh = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={[Math.PI / 4, Math.PI / 4, 0]}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={hovered ? '#7E69AB' : '#9b87f5'}
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  );
};

const InnovationSphere = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      rotation={[Math.PI / 6, Math.PI / 3, 0]}
    >
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial 
        color={hovered ? '#1EAEDB' : '#D6BCFA'}
        metalness={0.7}
        roughness={0.3}
        wireframe={true}
      />
    </mesh>
  );
};

export default function InnovationCube() {
  return (
    <div className="h-full w-full min-h-[300px]">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <CubeMesh position={[-2, 0, 0]} />
        <InnovationSphere position={[2, 0, 0]} />
        
        <OrbitControls 
          enableZoom={false} 
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
