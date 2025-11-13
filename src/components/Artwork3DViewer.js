'use client';

import { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Componente para cargar y mostrar el modelo 3D
function Model3D({ url }) {
  const { scene } = useGLTF(url);
  const groupRef = useRef();

  useEffect(() => {
    if (scene && groupRef.current) {
      // Clonar la escena para no modificar el original
      const clonedScene = scene.clone();
      
      // Configurar el modelo para que se vea bien
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          // Mejorar materiales si es necesario
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => {
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  mat.needsUpdate = true;
                }
              });
            } else if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
              child.material.needsUpdate = true;
            }
          }
        }
      });

      // Calcular el bounding box para centrar el modelo
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1; // Escalar para que quepa bien en la escena

      // Aplicar transformación
      clonedScene.scale.setScalar(scale);
      clonedScene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      // Agregar al grupo
      groupRef.current.clear();
      groupRef.current.add(clonedScene);
    }
  }, [scene]);

  return <group ref={groupRef} />;
}

export default function Artwork3DViewer({ modelUrl }) {
  if (!modelUrl) return null;

  return (
    <div className="relative w-full h-full bg-[#0A0A1A] rounded-lg overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        camera={{ position: [0, 0, 5], fov: 50 }}
      >
        {/* Ambiente oscuro */}
        <color attach="background" args={['#0A0A1A']} />
        <fog attach="fog" args={['#0A0A1A', 10, 20]} />

        {/* Iluminación dramática similar al museo */}
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          color="#ffffff"
          castShadow
        />
        {/* Luces de color para ambiente dramático */}
        <pointLight position={[-3, 2, 3]} intensity={1.2} color="#00BFFF" distance={10} />
        <pointLight position={[3, 2, 3]} intensity={1.2} color="#FF00A0" distance={10} />
        <pointLight position={[0, -2, 3]} intensity={0.8} color="#F9D57E" distance={8} />

        {/* Controles de órbita para rotar el modelo */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotate={false}
        />

        {/* Cámara */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

        {/* Modelo 3D */}
        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#333" wireframe />
            </mesh>
          }
        >
          <Model3D url={modelUrl} />
        </Suspense>
      </Canvas>

      {/* Indicador de que es interactivo */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-primary/30">
        <p className="text-xs text-primary font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Arrastra para rotar • Scroll para zoom
        </p>
      </div>
    </div>
  );
}

