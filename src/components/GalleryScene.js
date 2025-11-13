'use client';

import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import ArtworkFrame from './ArtworkFrame';
import ArtworkModal from './ArtworkModal';
import GalleryControls from './GalleryControls';
import { artworks } from '../data/artworks';

const GalleryRoom = ({ artworks, onArtworkClick }) => {
  return (
    <>
      {/* Iluminación ambiental reducida para preservar saturación */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Luz direccional principal desde arriba (simula luz de techo) */}
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={1.2} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Luces de ambiente azul y magenta - más intensas */}
      <pointLight position={[-3, 2, 0]} intensity={1.5} color="#00BFFF" distance={10} />
      <pointLight position={[3, 2, 0]} intensity={1.5} color="#FF00A0" distance={10} />
      <pointLight position={[0, 2, -3]} intensity={1.2} color="#00BFFF" distance={10} />
      <pointLight position={[0, 2, 3]} intensity={1.2} color="#FF00A0" distance={10} />
      
      {/* Luces de relleno adicionales para iluminar mejor las obras */}
      <pointLight position={[-4, 1.5, -4]} intensity={0.8} color="#ffffff" distance={6} />
      <pointLight position={[4, 1.5, -4]} intensity={0.8} color="#ffffff" distance={6} />
      <pointLight position={[-4, 1.5, 4]} intensity={0.8} color="#ffffff" distance={6} />
      <pointLight position={[4, 1.5, 4]} intensity={0.8} color="#ffffff" distance={6} />

      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#0A0A1A"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Pared trasera */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.8} />
      </mesh>

      {/* Pared izquierda */}
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.8} />
      </mesh>

      {/* Pared derecha */}
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.8} />
      </mesh>

      {/* Pared frontal */}
      <mesh position={[0, 2.5, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#0f0f1e" roughness={0.8} />
      </mesh>

      {/* Techo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#050510" />
      </mesh>

      {/* Obras de arte */}
      {artworks.map((artwork) => (
        <ArtworkFrame
          key={artwork.id}
          artwork={artwork}
          position={artwork.position}
          onClick={onArtworkClick}
        />
      ))}

      {/* Niebla atmosférica reducida para más claridad */}
      <fog attach="fog" args={['#0A0A1A', 8, 20]} />
    </>
  );
};

export default function GalleryScene() {
  const [selected, setSelected] = useState(null);
  const frames = useMemo(() => artworks, []);

  const onClose = () => setSelected(null);

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{ height: 'calc(100dvh - var(--navbar-height))' }}
    >
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          // Configuraciones para mejor calidad de texturas
          precision: 'highp',
          logarithmicDepthBuffer: false,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        frameloop="always"
      >
        <color attach="background" args={['#0A0A1A']} />
        <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={60} />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
          target={[0, 1.5, 0]}
        />
        <GalleryRoom artworks={frames} onArtworkClick={setSelected} />
      </Canvas>

      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6">
        <a
          href="https://youtu.be/7yFiYSfnURs?si=whn8qCvNWlkDL8n7"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-accent/40 bg-base-100/90 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-base-content shadow-xl shadow-accent/10 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:border-accent hover:bg-accent hover:text-base-100"
        >
          Escuchar álbum completo
        </a>
      </div>

      {/* <GalleryControls /> */}
      {selected && <ArtworkModal artwork={selected} onClose={onClose} />}
    </section>
  );
}


