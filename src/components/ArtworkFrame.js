'use client';

import { Suspense, useMemo, useState, useRef, useEffect } from 'react';
import { Html, useTexture, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Contenido del cuadro: imagen 2D (cuando no hay modelo 3D)
function ArtworkContentImage({ artwork, setHovered, onClick }) {
  const texture = useTexture(artwork.image);

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

  return (
    <mesh
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
        emissive="#000000"
        emissiveIntensity={0}
        toneMapped={true}
        color="#ffffff"
      />
    </mesh>
  );
}

// Contenido del cuadro: modelo 3D GLB (cuando existe image_3d)
function ArtworkContentModel({ artwork, setHovered, onClick }) {
  const { scene } = useGLTF(artwork.image_3d);
  const innerRef = useRef(null);

  useEffect(() => {
    if (!scene || !innerRef.current) return;
    const cloned = scene.clone();
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 1.1 / maxDim : 1; // 1.1 = altura del área del marco
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    innerRef.current.clear();
    innerRef.current.add(cloned);
  }, [scene]);

  return (
    <group
      ref={innerRef}
      position={[0, 0, 0.015]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick && onClick(artwork)}
    />
  );
}

function ArtworkContent({ artwork, hovered, setHovered, onClick }) {
  if (artwork.image_3d) {
    return (
      <Suspense
        fallback={
          <mesh position={[0, 0, 0.015]}>
            <planeGeometry args={[1.5, 1.1]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        }
      >
        <ArtworkContentModel
          artwork={artwork}
          setHovered={setHovered}
          onClick={onClick}
        />
      </Suspense>
    );
  }
  return (
    <ArtworkContentImage
      artwork={artwork}
      setHovered={setHovered}
      onClick={onClick}
    />
  );
}

export default function ArtworkFrame({ artwork, position = [0, 1.5, 0], onClick }) {
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.05 : 1.0;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group position={position} rotation={artwork.rotation || [0, 0, 0]}>
      {/* Marco dorado */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[1.7, 1.3, 0.1]} />
        <meshPhysicalMaterial
          color="#FFD65A"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          envMapIntensity={2}
        />
      </mesh>

      {/* Contenido: modelo 3D si existe image_3d, si no imagen */}
      <group ref={groupRef}>
        <ArtworkContent
          artwork={artwork}
          hovered={hovered}
          setHovered={setHovered}
          onClick={onClick}
        />
      </group>

      <spotLight
        position={[0, 0.9, 0.5]}
        angle={0.45}
        penumbra={0.5}
        intensity={hovered ? 2.0 : 1.2}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[0.6, 0.8, 0.4]}
        intensity={hovered ? 1.0 : 0.5}
        color="#FFD580"
        distance={2.5}
      />

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
