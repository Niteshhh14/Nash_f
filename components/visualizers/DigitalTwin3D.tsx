import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface DigitalTwin3DProps {
  heartRate: number;
  oxygenSat?: number;
  selectedOrgan?: string;
  setSelectedOrgan?: (organ: string) => void;
  autoRotate?: boolean;
  wireVisible?: boolean;
  explode?: boolean;
  organStatuses?: Record<string, 'healthy' | 'warning' | 'high_risk' | 'critical'>;
  riskCategory?: 'low' | 'moderate' | 'high' | 'critical';
  interactiveMode?: boolean;
}

interface OrganData {
  id: string;
  name: string;
  pos: [number, number, number];
  scale: [number, number, number];
  pulse: number;
}

const ORGANS: OrganData[] = [
  { id: 'brain', name: 'Brain', pos: [0, 2.4, 0], scale: [1, 1, 1], pulse: 0.8 },
  { id: 'heart', name: 'Heart', pos: [0.18, 1.45, 0.22], scale: [1, 1, 1], pulse: 1.2 },
  { id: 'lungs', name: 'Lungs', pos: [0, 1.55, -0.15], scale: [1, 1, 1], pulse: 0.45 },
  { id: 'liver', name: 'Liver', pos: [-0.32, 0.95, 0.18], scale: [1, 1, 1], pulse: 0.35 },
  { id: 'kidneys', name: 'Kidneys', pos: [0, 0.42, -0.22], scale: [1, 1, 1], pulse: 0.6 }
];

const STATUS_COLORS = {
  healthy: '#8EA885',    // Soft Sage Green
  warning: '#C7A37E',    // Warm Amber
  high_risk: '#D98A55',  // Muted Orange
  critical: '#D95566'    // Soft Medical Red
};

// Dynamic Camera and Target controller
const CameraController: React.FC<{ 
  selectedOrgan: string | undefined; 
  autoRotate: boolean;
}> = ({ selectedOrgan, autoRotate }) => {
  const { camera, controls } = useThree();

  useFrame(() => {
    if (!controls) return;
    const orbit = controls as any;

    if (selectedOrgan) {
      const organ = ORGANS.find(o => o.id === selectedOrgan);
      if (organ) {
        // Smoothly interpolate orbit controls target to selected organ position
        const targetPos = new THREE.Vector3(organ.pos[0], organ.pos[1] - 0.6, organ.pos[2]);
        orbit.target.lerp(targetPos, 0.08);

        // Zoom camera in towards the organ
        const desiredCamPos = new THREE.Vector3(
          organ.pos[0], 
          organ.pos[1] - 0.3, 
          organ.pos[2] + 1.8
        );
        camera.position.lerp(desiredCamPos, 0.08);
        orbit.autoRotate = false;
      }
    } else {
      // Return to default overview view
      orbit.target.lerp(new THREE.Vector3(0, 0.8, 0), 0.06);
      
      const desiredCamPos = new THREE.Vector3(0, 1.2, 6.2);
      camera.position.lerp(desiredCamPos, 0.05);
      orbit.autoRotate = autoRotate;
    }

    orbit.update();
  });

  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      autoRotate={autoRotate}
      autoRotateSpeed={0.45}
      minDistance={3}
      maxDistance={12}
      maxPolarAngle={Math.PI * 0.75}
      minPolarAngle={Math.PI * 0.25}
    />
  );
};

// Render Loaded Anatomy GLTF model or beautiful fallback structure
const AnatomyScene: React.FC<{
  heartRate: number;
  oxygenSat: number;
  selectedOrgan: string | undefined;
  setSelectedOrgan: (organ: string) => void;
  wireVisible: boolean;
  explode: boolean;
  organStatuses?: Record<string, 'healthy' | 'warning' | 'high_risk' | 'critical'>;
}> = ({ heartRate, oxygenSat = 98, selectedOrgan, setSelectedOrgan, wireVisible, explode, organStatuses = {} }) => {
  const [gltf, setGltf] = useState<THREE.Group | null>(null);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);
  const modelRef = useRef<THREE.Group>(null);
  const organRefs = useRef<Record<string, THREE.Group>>({});

  // Dynamic GLB loading helper
  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      '/models/human_anatomy.glb',
      (gltfModel) => {
        setGltf(gltfModel.scene);
      },
      undefined,
      (err) => {
        console.warn("Failed to load /models/human_anatomy.glb, using premium geometries.", err);
        setLoadFailed(true);
      }
    );
  }, []);

  // Scale and center the loaded GLB model
  useEffect(() => {
    if (!gltf) return;
    const box = new THREE.Box3().setFromObject(gltf);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Scale to standard height ~4.8 units
    const scale = 4.8 / size.y;
    gltf.scale.setScalar(scale);
    gltf.position.set(-center.x * scale, -center.y * scale + 0.8, -center.z * scale);

    // Apply premium translucent glassmorphic material to loaded meshes
    gltf.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          roughness: 0.15,
          metalness: 0.05,
          transmission: 0.75, // High glass transmission
          thickness: 1.0,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false
        });
      }
    });
  }, [gltf]);

  // Handle continuous animations (breathing and organ pulsation)
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const explodeTarget = explode ? 1.0 : 0;

    // Subtle breathing floating movement on the overall body
    if (modelRef.current) {
      modelRef.current.position.y = -0.5 + Math.sin(time * 1.2) * 0.03;
    }

    // Organ-specific beats and status coloring
    ORGANS.forEach((o) => {
      const group = organRefs.current[o.id];
      if (!group) return;

      // Base pulsate speeds (heart uses real heart rate)
      const baseSpeed = o.id === 'heart' ? (heartRate / 60) * 1.2 : o.pulse;
      const pulseFactor = 1.0 + Math.sin(time * baseSpeed * Math.PI * 2) * 0.04;
      
      const isActive = selectedOrgan === o.id;
      const targetScale = isActive ? 1.2 * pulseFactor : 1.0 * pulseFactor;

      // Lerp scale changes smoothly
      group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, 0.15));

      // Explode coordinate math
      const basePos = new THREE.Vector3(...o.pos);
      const dir = basePos.clone().setY(0).normalize();
      const targetPos = basePos.clone().add(dir.multiplyScalar(explodeTarget));
      group.position.lerp(targetPos, 0.08);

      // Interpolate opacity/dimming on highlight
      group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            const status = organStatuses[o.id] || 'healthy';
            const colorHex = STATUS_COLORS[status];
            mat.color.set(colorHex);

            const isDimmed = selectedOrgan && !isActive;
            const targetOpacity = isDimmed ? 0.22 : 0.88;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);
            mat.emissiveIntensity = isActive ? 0.6 + Math.sin(time * 4) * 0.35 : 0.12;
          }
        }
      });
    });
  });

  // Premium fallback procedural shell
  const bodyParts = [
    { geo: new THREE.SphereGeometry(0.7, 32, 32), pos: [0, 2.4, 0], scale: [1, 1.05, 1] },
    { geo: new THREE.CylinderGeometry(0.24, 0.3, 0.4, 16), pos: [0, 1.82, 0], scale: [1, 1, 1] },
    { geo: new THREE.CapsuleGeometry(0.75, 1.1, 14, 28), pos: [0, 1.05, 0], scale: [1.05, 1, 0.62] },
    { geo: new THREE.SphereGeometry(0.6, 24, 24), pos: [0, 0.05, 0], scale: [1.25, 0.65, 0.75] }
  ];

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    document.body.style.cursor = 'default';
  };

  return (
    <group ref={modelRef} position={[0, -0.5, 0]}>
      {/* 1. Body Skin Shell Loader */}
      {!loadFailed && gltf ? (
        <primitive object={gltf} visible={wireVisible} />
      ) : (
        <group visible={wireVisible}>
          {bodyParts.map((p, idx) => (
            <mesh 
              key={`shell-${idx}`} 
              position={p.pos as [number, number, number]} 
              scale={p.scale as [number, number, number]}
            >
              <primitive object={p.geo} />
              <meshPhysicalMaterial 
                color="#6fb8d8" 
                roughness={0.2} 
                metalness={0.05} 
                transmission={0.8}
                thickness={1.2}
                transparent 
                opacity={0.06} 
                side={THREE.DoubleSide} 
                depthWrite={false} 
              />
            </mesh>
          ))}
        </group>
      )}

      {/* 2. Interactive Organs */}
      {ORGANS.map((o) => (
        <group 
          key={o.id}
          ref={(el) => {
            if (el) organRefs.current[o.id] = el;
          }}
          position={o.pos}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedOrgan(o.id);
          }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {o.id === 'brain' && (
            <mesh>
              <sphereGeometry args={[0.34, 24, 24]} />
              <meshStandardMaterial 
                roughness={0.4} 
                metalness={0.1} 
                transparent 
                opacity={0.88}
                emissive={STATUS_COLORS[organStatuses.brain || 'healthy']}
                emissiveIntensity={0.15}
              />
            </mesh>
          )}

          {o.id === 'heart' && (
            <mesh>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshStandardMaterial 
                roughness={0.4} 
                metalness={0.1} 
                transparent 
                opacity={0.88}
                emissive={STATUS_COLORS[organStatuses.heart || 'healthy']}
                emissiveIntensity={0.15}
              />
            </mesh>
          )}

          {o.id === 'lungs' && (
            <group>
              <mesh position={[-0.22, 0, 0]} scale={[0.65, 1.2, 0.65]}>
                <sphereGeometry args={[0.24, 20, 20]} />
                <meshStandardMaterial 
                  roughness={0.4} 
                  metalness={0.1} 
                  transparent 
                  opacity={0.88}
                  emissive={STATUS_COLORS[organStatuses.lungs || 'healthy']}
                  emissiveIntensity={0.15}
                />
              </mesh>
              <mesh position={[0.22, 0, 0]} scale={[0.65, 1.2, 0.65]}>
                <sphereGeometry args={[0.24, 20, 20]} />
                <meshStandardMaterial 
                  roughness={0.4} 
                  metalness={0.1} 
                  transparent 
                  opacity={0.88}
                  emissive={STATUS_COLORS[organStatuses.lungs || 'healthy']}
                  emissiveIntensity={0.15}
                />
              </mesh>
            </group>
          )}

          {o.id === 'liver' && (
            <mesh scale={[1.1, 0.6, 0.55]}>
              <sphereGeometry args={[0.3, 20, 20]} />
              <meshStandardMaterial 
                roughness={0.4} 
                metalness={0.1} 
                transparent 
                opacity={0.88}
                emissive={STATUS_COLORS[organStatuses.liver || 'healthy']}
                emissiveIntensity={0.15}
              />
            </mesh>
          )}

          {o.id === 'kidneys' && (
            <group>
              <mesh position={[-0.2, 0, 0]} scale={[0.7, 1.1, 0.7]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial 
                  roughness={0.4} 
                  metalness={0.1} 
                  transparent 
                  opacity={0.88}
                  emissive={STATUS_COLORS[organStatuses.kidneys || 'healthy']}
                  emissiveIntensity={0.15}
                />
              </mesh>
              <mesh position={[0.2, 0, 0]} scale={[0.7, 1.1, 0.7]}>
                <sphereGeometry args={[0.16, 16, 16]} />
                <meshStandardMaterial 
                  roughness={0.4} 
                  metalness={0.1} 
                  transparent 
                  opacity={0.88}
                  emissive={STATUS_COLORS[organStatuses.kidneys || 'healthy']}
                  emissiveIntensity={0.15}
                />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  );
};

export const DigitalTwin3D: React.FC<DigitalTwin3DProps> = ({
  heartRate,
  oxygenSat,
  selectedOrgan,
  setSelectedOrgan = () => {},
  autoRotate = true,
  wireVisible = true,
  explode = false,
  organStatuses
}) => {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas 
        camera={{ position: [0, 1.2, 6.2], fov: 42 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15
        }}
      >
        <color attach="background" args={['#FAF8F5']} />
        
        {/* soft ambient & clinical key lights */}
        <ambientLight intensity={0.65} color="#e6effa" />
        <directionalLight position={[8, 12, 8]} intensity={1.5} color="#ffffff" castShadow />
        <directionalLight position={[-8, 6, -4]} intensity={0.45} color="#ffb0bb" />
        <pointLight position={[0, 4, -4]} intensity={1.5} distance={15} color="#C7A37E" />
        
        {/* Soft grid background */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
          <ringGeometry args={[2.0, 5.5, 64]} />
          <meshBasicMaterial color="#C7A37E" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.09, 0]}>
          <ringGeometry args={[1.95, 2.0, 80]} />
          <meshBasicMaterial color="#C7A37E" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>

        <Stars radius={90} depth={40} count={150} factor={3} saturation={0.4} fade speed={0.8} />

        <AnatomyScene
          heartRate={heartRate}
          oxygenSat={oxygenSat || 98}
          selectedOrgan={selectedOrgan}
          setSelectedOrgan={setSelectedOrgan}
          wireVisible={wireVisible}
          explode={explode}
          organStatuses={organStatuses || {}}
        />

        <CameraController selectedOrgan={selectedOrgan} autoRotate={autoRotate} />
      </Canvas>
    </div>
  );
};
