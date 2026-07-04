import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface DigitalTwin3DProps {
  heartRate: number;
  riskCategory: 'low' | 'moderate' | 'high' | 'critical';
  selectedOrgan?: string;
  setSelectedOrgan?: (organ: string) => void;
  autoRotate?: boolean;
  wireVisible?: boolean;
  explode?: boolean;
  interactiveMode?: boolean;
}

interface OrganData {
  id: string;
  name: string;
  color: number;
  emissive: number;
  pos: [number, number, number];
  rot?: [number, number, number];
  pulse: number;
}

const ORGANS: OrganData[] = [
  { id: 'brain', name: 'Brain', color: 0xffaec6, emissive: 0xff4d7a, pos: [0, 2.4, 0], pulse: 0.8 },
  { id: 'heart', name: 'Heart', color: 0xff5566, emissive: 0xff1f3d, pos: [0.18, 1.45, 0.22], rot: [0, 0, 0.15], pulse: 1.2 },
  { id: 'lungs', name: 'Lungs', color: 0xffb8c8, emissive: 0xff5e88, pos: [0, 1.55, -0.15], pulse: 0.45 },
  { id: 'liver', name: 'Liver', color: 0x9b4a3a, emissive: 0x5a2218, pos: [-0.32, 0.95, 0.18], rot: [0, 0, 0.1], pulse: 0.35 },
  { id: 'stomach', name: 'Stomach', color: 0xffc0a0, emissive: 0xcc6644, pos: [0.3, 0.7, 0.22], rot: [0, 0, 0.5], pulse: 0.3 },
  { id: 'kidneys', name: 'Kidneys', color: 0xa04a4a, emissive: 0x552222, pos: [0, 0.42, -0.22], pulse: 0.6 },
  { id: 'intestines', name: 'Intestines', color: 0xffd0a8, emissive: 0xcc8855, pos: [0, 0.05, 0.2], pulse: 0.4 }
];

const AnatomicalModel: React.FC<{
  heartRate: number;
  selectedOrgan: string;
  setSelectedOrgan: (organ: string) => void;
  wireVisible: boolean;
  explode: boolean;
}> = ({ heartRate, selectedOrgan, setSelectedOrgan, wireVisible, explode }) => {
  const organRefs = useRef<Record<string, THREE.Group>>({});
  const shellRef = useRef<THREE.Group>(null);
  const wireRef = useRef<THREE.Group>(null);

  // Animate organs pulse, hover scaling, and exploded coordinate offsets
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const explodeTarget = explode ? 1.2 : 0;

    ORGANS.forEach((o) => {
      const g = organRefs.current[o.id];
      if (!g) return;

      // Pulse calculations (heart rate affects heart pulse speed)
      const speed = o.id === 'heart' ? (heartRate / 60) * 1.2 : o.pulse;
      const pulse = 1.0 + Math.sin(time * speed * Math.PI * 2) * 0.03;
      
      const isActive = selectedOrgan === o.id;
      const targetScale = isActive ? 1.15 * pulse : 1.0 * pulse;
      
      // Smoothly scale the organ
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.15));

      // Exploded coordinates math
      const basePos = new THREE.Vector3(...o.pos);
      const direction = basePos.clone().normalize();
      // Increase outward offset for lower organs to separate them clearly
      if (basePos.y < 0.5) {
        direction.y -= 0.3;
      }
      const targetPos = basePos.clone().add(direction.multiplyScalar(explodeTarget));
      g.position.lerp(targetPos, 0.08);

      // Emissive breathe on highlighted item
      const mat = (g.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = isActive 
          ? 1.0 + Math.sin(time * speed * Math.PI * 2) * 0.4
          : 0.35;
      }
    });

    // Make the body silhouette vanish if wireframe toggled off
    const shellOpacity = wireVisible ? 0.07 : 0;
    const wireOpacity = wireVisible ? 0.12 : 0;

    if (shellRef.current) {
      shellRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, shellOpacity, 0.1);
      });
    }

    if (wireRef.current) {
      wireRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = THREE.MathUtils.lerp(mat.opacity, wireOpacity, 0.1);
      });
    }
  });

  const bodyParts = [
    { geo: new THREE.SphereGeometry(0.7, 32, 32), pos: [0, 2.4, 0], scale: [1, 1.05, 1] },
    { geo: new THREE.CylinderGeometry(0.26, 0.32, 0.4, 16), pos: [0, 1.82, 0], scale: [1, 1, 1] },
    { geo: new THREE.CapsuleGeometry(0.78, 1.1, 14, 28), pos: [0, 1.05, 0], scale: [1.05, 1, 0.62] },
    { geo: new THREE.SphereGeometry(0.62, 24, 24), pos: [0, 0.05, 0], scale: [1.25, 0.65, 0.75] },
    { geo: new THREE.CapsuleGeometry(0.17, 1.1, 8, 16), pos: [1.05, 1.25, 0], scale: [1, 1, 1], rot: [0, 0, 0.32] },
    { geo: new THREE.CapsuleGeometry(0.17, 1.1, 8, 16), pos: [-1.05, 1.25, 0], scale: [1, 1, 1], rot: [0, 0, -0.32] },
    { geo: new THREE.CapsuleGeometry(0.21, 1.4, 8, 16), pos: [0.42, -0.95, 0], scale: [1, 1, 1], rot: [0, 0, 0.06] },
    { geo: new THREE.CapsuleGeometry(0.21, 1.4, 8, 16), pos: [-0.42, -0.95, 0], scale: [1, 1, 1], rot: [0, 0, -0.06] }
  ];

  return (
    <group position={[0, -0.6, 0]}>
      
      {/* 1. Body Outline shell */}
      <group ref={shellRef}>
        {bodyParts.map((p, idx) => (
          <mesh 
            key={`shell-${idx}`} 
            position={p.pos as [number, number, number]} 
            scale={p.scale as [number, number, number]}
            rotation={p.rot as [number, number, number]}
          >
            <primitive object={p.geo} />
            <meshStandardMaterial 
              color="#6fb8d8" 
              transparent 
              opacity={0.07} 
              roughness={0.25} 
              metalness={0.05} 
              side={THREE.DoubleSide} 
              depthWrite={false} 
            />
          </mesh>
        ))}
      </group>

      {/* 2. Body Outline wireframes */}
      <group ref={wireRef}>
        {bodyParts.map((p, idx) => (
          <mesh 
            key={`wire-${idx}`} 
            position={p.pos as [number, number, number]} 
            scale={p.scale as [number, number, number]}
            rotation={p.rot as [number, number, number]}
          >
            <primitive object={p.geo} />
            <meshBasicMaterial 
              color="#4aa0c4" 
              wireframe 
              transparent 
              opacity={0.12} 
            />
          </mesh>
        ))}
      </group>

      {/* 3. Detailed Organ Geometries */}
      {ORGANS.map((o) => (
        <group 
          key={o.id}
          ref={(el) => {
            if (el) organRefs.current[o.id] = el;
          }}
          position={o.pos}
          rotation={o.rot}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrgan(o.id);
          }}
        >
          {o.id === 'brain' && (
            <>
              <mesh>
                <sphereGeometry args={[0.36, 24, 24]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
              <mesh position={[0.2, 0.15, 0.1]}>
                <sphereGeometry args={[0.14, 12, 12]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
              <mesh position={[-0.2, 0.15, 0.1]}>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'heart' && (
            <>
              <mesh>
                <sphereGeometry args={[0.24, 24, 24]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
              <mesh position={[0.06, 0.22, 0.04]} rotation={[0, 0, -0.3]}>
                <cylinderGeometry args={[0.06, 0.08, 0.24, 10]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'lungs' && (
            <>
              <mesh position={[-0.26, 0, 0]} scale={[0.65, 1.25, 0.65]}>
                <sphereGeometry args={[0.26, 20, 20]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
              <mesh position={[0.26, 0, 0]} scale={[0.65, 1.25, 0.65]}>
                <sphereGeometry args={[0.26, 20, 20]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'liver' && (
            <>
              <mesh scale={[1.1, 0.6, 0.55]}>
                <sphereGeometry args={[0.34, 20, 20]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'stomach' && (
            <>
              <mesh scale={[0.8, 1.2, 0.8]}>
                <capsuleGeometry args={[0.16, 0.24, 10, 20]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'kidneys' && (
            <>
              <mesh position={[-0.22, 0, 0]} scale={[0.7, 1.1, 0.7]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
              <mesh position={[0.22, 0, 0]} scale={[0.7, 1.1, 0.7]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}

          {o.id === 'intestines' && (
            <>
              <mesh scale={[0.75, 0.75, 0.45]}>
                <torusKnotGeometry args={[0.32, 0.1, 100, 16, 3, 4]} />
                <meshStandardMaterial color={o.color} emissive={o.emissive} emissiveIntensity={0.35} roughness={0.42} metalness={0.18} />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
};

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  heartRate,
  riskCategory,
  selectedOrgan = 'brain',
  setSelectedOrgan = () => {},
  autoRotate = true,
  wireVisible = true,
  explode = false,
  interactiveMode = true
}) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0.5, 1.6, 7.0], fov: 42 }}>
        <color attach="background" args={['#FAF8F5']} />
        
        {/* Lights */}
        <ambientLight intensity={0.55} color="#4a5a78" />
        <directionalLight position={[6, 9, 6]} intensity={1.4} color="#9fc0ff" />
        <directionalLight position={[-6, 3, -2]} intensity={0.5} color="#ff7a90" />
        <pointLight position={[0, 4, -5]} intensity={2.2} distance={18} color="#C7A37E" />
        <pointLight position={[0, -3, 3]} intensity={1.0} distance={16} color="#3a6cb0" />

        {/* floor grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
          <ringGeometry args={[2.5, 6, 64]} />
          <meshBasicMaterial color="#C7A37E" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.19, 0]}>
          <ringGeometry args={[2.45, 2.5, 80]} />
          <meshBasicMaterial color="#C7A37E" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>

        {/* Ambient drift particles */}
        <Stars radius={100} depth={50} count={220} factor={4} saturation={0.5} fade speed={1} />

        <AnatomicalModel 
          heartRate={heartRate} 
          selectedOrgan={selectedOrgan} 
          setSelectedOrgan={setSelectedOrgan} 
          wireVisible={wireVisible}
          explode={explode}
        />

        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.55}
          target={[0, 1.2, 0]}
          minDistance={4}
          maxDistance={14}
          maxPolarAngle={Math.PI * 0.82}
          minPolarAngle={Math.PI * 0.18}
        />
      </Canvas>
    </div>
  );
};
