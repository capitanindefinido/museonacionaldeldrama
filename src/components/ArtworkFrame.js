'use client';

import { useMemo, useState, useRef } from 'react';
import { Html, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ArtworkFrame({ artwork, position = [0, 1.5, 0], onClick }) {
  const texture = useTexture(artwork.image);
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // ⚙️ Ajustes finos para PNGs saturados y nítidos
  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.generateMipmaps = true;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
    }
  }, [texture]);

  // 🌀 Animación de hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={position} rotation={artwork.rotation || [0, 0, 0]}>
      {/* Marco dorado brillante con reflejos cálidos */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[1.7, 1.3, 0.1]} />
        <meshPhysicalMaterial
          color="#FFD65A" // dorado más cálido
          metalness={0.85} // reflejo metálico fuerte
          roughness={0.25} // mantiene textura
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          envMapIntensity={2}
        />
      </mesh>

      {/* Imagen PNG con más contraste y saturación visual */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0.015]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick && onClick(artwork)}
      >
        <planeGeometry args={[1.5, 1.1]} />
        <meshStandardMaterial
          map={texture}
          transparent={false}
          side={THREE.FrontSide}
          roughness={0.2}
          metalness={0.0}
          // Eliminamos emissive que lava los colores
          emissive="#000000"
          emissiveIntensity={0}
          toneMapped={true}
          // Color neutro para preservar los colores originales de la textura
          color="#ffffff"
        />
      </mesh>

      {/* Luz superior para cuadro - ajustada para no lavar colores */}
      <spotLight
        position={[0, 0.9, 0.5]}
        angle={0.45}
        penumbra={0.5}
        intensity={hovered ? 2.0 : 1.2}
        color="#ffffff"
        castShadow
      />

      {/* Luz lateral cálida para el marco - reducida para no afectar la imagen */}
      <pointLight
        position={[0.6, 0.8, 0.4]}
        intensity={hovered ? 1.0 : 0.5}
        color="#FFD580"
        distance={2.5}
      />

      {/* Tooltip */}
      {hovered && (
        <Html position={[0, -0.8, 0]} center>
          <div className="px-4 py-2 rounded-lg border border-yellow-400/50 shadow-lg bg-black/70 backdrop-blur-sm">
            <p className="text-sm font-semibold text-yellow-400 text-center">{artwork.title}</p>
            <p className="text-xs text-gray-300 text-center">
              {artwork.artist} • {artwork.year}
            </p>
          </div>
        </Html>
      )}
    </group>
  );
}
