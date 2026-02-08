'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import ArtworkFrame from './ArtworkFrame';
import ArtworkModal from './ArtworkModal';
import GalleryControls from './GalleryControls';
import VirtualJoystick from './VirtualJoystick';
import {
  FirstPersonCamera,
  WalkController,
  WalkPointerLock,
  PointerLockRefSync,
} from './FirstPersonController';
import { artworks } from '../data/artworks';

const INITIAL_MANNEQUIN_POSITION = [3.2, 0, -1.8];
const INITIAL_MANNEQUIN_YAW = Math.PI / 2;

const mannequinMaterial = { color: '#D8D6D2', metalness: 0.1, roughness: 0.85 };
const suitMaterial = { color: '#1a1a2e', metalness: 0.05, roughness: 0.9 };
const shirtMaterial = { color: '#f5f5f0', metalness: 0, roughness: 0.95 };

const NI_CUENTA_SLUG = 'ni-cuenta';

function MaleMannequin({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick: onMannequinClick,
  artwork: mannequinArtwork,
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (mannequinArtwork && onMannequinClick) onMannequinClick(mannequinArtwork);
  };
  return (
    <group
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (mannequinArtwork) document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Cabeza */}
      <mesh position={[0, 1.58, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial {...mannequinMaterial} />
      </mesh>
      {/* Cuello (visible: camisa) */}
      <mesh position={[0, 1.43, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.12, 12]} />
        <meshStandardMaterial {...shirtMaterial} />
      </mesh>
      {/* Torso (cuerpo bajo la chaqueta) */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.5, 12]} />
        <meshStandardMaterial {...shirtMaterial} />
      </mesh>
      {/* Chaqueta del terno */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <cylinderGeometry args={[0.195, 0.24, 0.48, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Solapa/corte delantero (detalle en V) - pequeño triángulo oscuro */}
      <mesh position={[0, 1.12, 0.2]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.15, 0.25]} />
        <meshStandardMaterial {...suitMaterial} side={THREE.DoubleSide} />
      </mesh>
      {/* Manga izquierda (chaqueta) */}
      <mesh position={[-0.28, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.052, 0.052, 0.28, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      <mesh position={[-0.42, 1.0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.22, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Manga derecha (chaqueta) */}
      <mesh position={[0.26, 1.12, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.052, 0.052, 0.26, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      <mesh position={[0.38, 1.02, 0]} rotation={[0, 0, -Math.PI / 2.2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.2, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Cadera (terno: cintura del pantalón) */}
      <mesh position={[0, 0.72, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.15, 12]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Pierna izquierda - pantalón */}
      <mesh position={[-0.08, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.5, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      <mesh position={[-0.08, -0.08, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.055, 0.48, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Pierna derecha - pantalón */}
      <mesh position={[0.08, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.06, 0.5, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      <mesh position={[0.08, -0.08, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.055, 0.48, 10]} />
        <meshStandardMaterial {...suitMaterial} />
      </mesh>
      {/* Corbata */}
      <mesh position={[0, 1.2, 0.19]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.03, 0.35, 0.02]} />
        <meshStandardMaterial color="#8B0000" metalness={0.1} roughness={0.85} />
      </mesh>
      {/* Nudo de la corbata */}
      <mesh position={[0, 1.38, 0.2]} castShadow>
        <sphereGeometry args={[0.028, 8, 6]} />
        <meshStandardMaterial color="#8B0000" metalness={0.1} roughness={0.85} />
      </mesh>
      {/* Base de soporte */}
      <mesh position={[0, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.08, 12]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.3} roughness={0.6} />
      </mesh>
    </group>
  );
}

function GalleryBench({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation} castShadow receiveShadow>
      <mesh position={[0, 0.22, 0]} castShadow>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#C4B8A8" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh position={[-0.5, 0.11, 0]} castShadow>
        <boxGeometry args={[0.06, 0.22, 0.4]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
      <mesh position={[0.5, 0.11, 0]} castShadow>
        <boxGeometry args={[0.06, 0.22, 0.4]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} />
      </mesh>
    </group>
  );
}

function PottedPlant({ position = [0, 0, 0] }) {
  return (
    <group position={position} castShadow receiveShadow>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.3, 12]} />
        <meshStandardMaterial color="#5D4E37" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <meshStandardMaterial color="#2D5016" roughness={0.95} />
      </mesh>
    </group>
  );
}

// Zócalo y moldura para una pared (museo)
const baseboardHeight = 0.22;
const baseboardDepth = 0.12;
const corniceHeight = 0.18;
const corniceDepth = 0.1;
const trimColor = '#E0DDD8';
const trimMaterial = { color: trimColor, roughness: 0.85, metalness: 0.05 };

function WallTrim({ wall, length }) {
  const isZ = wall === 'back' || wall === 'front';
  const baseOffset = baseboardDepth / 2;
  const corniceOffset = corniceDepth / 2;
  let bx, by, bz, cx, cy, cz;
  let bw, bd, cw, cd;
  if (wall === 'back') {
    bx = 0; by = baseboardHeight / 2; bz = -5 + 0.1 + baseOffset;
    cx = 0; cy = 5 - corniceHeight / 2; cz = -5 + 0.1 + corniceOffset;
    bw = length; bd = baseboardDepth; cw = length; cd = corniceDepth;
  } else if (wall === 'front') {
    bx = 0; by = baseboardHeight / 2; bz = 5 - 0.1 - baseOffset;
    cx = 0; cy = 5 - corniceHeight / 2; cz = 5 - 0.1 - corniceOffset;
    bw = length; bd = baseboardDepth; cw = length; cd = corniceDepth;
  } else if (wall === 'left') {
    bx = -5 + 0.1 + baseOffset; by = baseboardHeight / 2; bz = 0;
    cx = -5 + 0.1 + corniceOffset; cy = 5 - corniceHeight / 2; cz = 0;
    bw = baseboardDepth; bd = length; cw = corniceDepth; cd = length;
  } else {
    bx = 5 - 0.1 - baseOffset; by = baseboardHeight / 2; bz = 0;
    cx = 5 - 0.1 - corniceOffset; cy = 5 - corniceHeight / 2; cz = 0;
    bw = baseboardDepth; bd = length; cw = corniceDepth; cd = length;
  }
  return (
    <group>
      <mesh position={[bx, by, bz]} receiveShadow>
        <boxGeometry args={isZ ? [bw, baseboardHeight, bd] : [bw, baseboardHeight, bd]} />
        <meshStandardMaterial {...trimMaterial} />
      </mesh>
      <mesh position={[cx, cy, cz]} receiveShadow>
        <boxGeometry args={isZ ? [cw, corniceHeight, cd] : [cw, corniceHeight, cd]} />
        <meshStandardMaterial {...trimMaterial} />
      </mesh>
    </group>
  );
}

// Foco de techo (recessed / riel)
function CeilingSpot({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
      </mesh>
      <pointLight position={[0, -0.2, 0]} intensity={0.8} color="#fffef5" distance={6} decay={2} />
    </group>
  );
}

const GalleryRoom = ({
  artworks,
  onArtworkClick,
  mannequinPosition = INITIAL_MANNEQUIN_POSITION,
  mannequinYaw = INITIAL_MANNEQUIN_YAW,
}) => {
  const artworksOnWalls = useMemo(
    () => artworks.filter((a) => a.slug !== NI_CUENTA_SLUG),
    [artworks]
  );
  const niCuentaArtwork = useMemo(
    () => artworks.find((a) => a.slug === NI_CUENTA_SLUG) ?? null,
    [artworks]
  );
  return (
    <>
      {/* Iluminación ambiental para galería clara */}
      <ambientLight intensity={0.6} color="#ffffff" />
      
      {/* Luz direccional principal desde arriba (simula luz de techo) */}
      <directionalLight 
        position={[0, 5, 0]} 
        intensity={1.5} 
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Luces de ambiente suaves (azul y magenta muy tenues) */}
      <pointLight position={[-3, 2, 0]} intensity={0.3} color="#00BFFF" distance={10} />
      <pointLight position={[3, 2, 0]} intensity={0.3} color="#FF00A0" distance={10} />
      <pointLight position={[0, 2, -3]} intensity={0.25} color="#00BFFF" distance={10} />
      <pointLight position={[0, 2, 3]} intensity={0.25} color="#FF00A0" distance={10} />
      
      {/* Luces de relleno para iluminar las obras */}
      <pointLight position={[-4, 1.5, -4]} intensity={0.6} color="#ffffff" distance={6} />
      <pointLight position={[4, 1.5, -4]} intensity={0.6} color="#ffffff" distance={6} />
      <pointLight position={[-4, 1.5, 4]} intensity={0.6} color="#ffffff" distance={6} />
      <pointLight position={[4, 1.5, 4]} intensity={0.6} color="#ffffff" distance={6} />

      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial
          color="#E8E6E3"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Paredes (tono galería) */}
      <mesh position={[0, 2.5, -5]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F2F0EC" roughness={0.85} />
      </mesh>
      <mesh position={[-5, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F2F0EC" roughness={0.85} />
      </mesh>
      <mesh position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F2F0EC" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <boxGeometry args={[14, 5, 0.2]} />
        <meshStandardMaterial color="#F2F0EC" roughness={0.85} />
      </mesh>

      {/* Zócalos y molduras (estilo museo) */}
      <WallTrim wall="back" length={14} />
      <WallTrim wall="front" length={14} />
      <WallTrim wall="left" length={14} />
      <WallTrim wall="right" length={14} />

      {/* Techo con focos */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#F5F4F2" roughness={0.9} />
      </mesh>
      <CeilingSpot position={[0, 4.92, 0]} />
      <CeilingSpot position={[-2.5, 4.92, -2.5]} />
      <CeilingSpot position={[2.5, 4.92, -2.5]} />
      <CeilingSpot position={[-2.5, 4.92, 2.5]} />
      <CeilingSpot position={[2.5, 4.92, 2.5]} />

      {/* Obras de arte (sin Ni cuenta: se abre al hacer click en el maniquí) */}
      {artworksOnWalls.map((artwork) => (
        <ArtworkFrame
          key={artwork.id}
          artwork={artwork}
          position={artwork.position}
          onClick={onArtworkClick}
        />
      ))}

      {/* Maniquí: al hacer click abre el modal de "Ni cuenta" */}
      <MaleMannequin
        position={mannequinPosition}
        rotation={[0, mannequinYaw, 0]}
        artwork={niCuentaArtwork}
        onClick={onArtworkClick}
      />
      <GalleryBench position={[-2.8, 0, 2.2]} rotation={[0, 0, 0]} />
      <PottedPlant position={[3.5, 0, 3.2]} />
      <PottedPlant position={[-3.5, 0, -3]} />

      {/* Niebla atmosférica suave para profundidad */}
      <fog attach="fog" args={['#F0EFEC', 12, 22]} />
    </>
  );
};

function SceneInner({
  viewMode,
  walkState,
  setWalkState,
  keysRef,
  joystickMoveRef,
  joystickLookRef,
  pointerLockRef,
  lookSensitivityRef,
  isTouchDevice,
  artworks,
  onArtworkClick,
}) {
  const mannequinPosition =
    viewMode === 'walk' ? walkState.position : INITIAL_MANNEQUIN_POSITION;
  const mannequinYaw =
    viewMode === 'walk' ? walkState.yaw : INITIAL_MANNEQUIN_YAW;

  return (
    <>
      <color attach="background" args={['#F0EFEC']} />
      {viewMode === 'orbit' && (
        <>
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
        </>
      )}
      {viewMode === 'walk' && (
        <>
          <PerspectiveCamera makeDefault position={[0, 1.6, 5]} fov={60} />
          <FirstPersonCamera
            position={walkState.position}
            yaw={walkState.yaw}
            pitch={walkState.pitch}
            pointerLockRef={pointerLockRef}
          />
          <WalkController
            viewMode={viewMode}
            setWalkState={setWalkState}
            keysRef={keysRef}
            joystickMoveRef={joystickMoveRef}
            joystickLookRef={joystickLookRef}
            pointerLockRef={pointerLockRef}
            lookSensitivityRef={lookSensitivityRef}
          />
          <PointerLockRefSync viewMode={viewMode} pointerLockRef={pointerLockRef} />
          <WalkPointerLock viewMode={viewMode} isTouchDevice={isTouchDevice} />
        </>
      )}
      <GalleryRoom
        artworks={artworks}
        onArtworkClick={onArtworkClick}
        mannequinPosition={mannequinPosition}
        mannequinYaw={mannequinYaw}
      />
    </>
  );
}

export default function GalleryScene() {
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('orbit');
  const [walkState, setWalkState] = useState({
    position: [...INITIAL_MANNEQUIN_POSITION],
    yaw: INITIAL_MANNEQUIN_YAW,
    pitch: 0,
  });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(typeof window !== 'undefined' && 'ontouchstart' in window);
  }, []);
  const keysRef = useRef({
    forward: 0,
    back: 0,
    left: 0,
    right: 0,
    turnL: 0,
    turnR: 0,
  });
  const joystickMoveRef = useRef([0, 0]);
  const joystickLookRef = useRef([0, 0]);
  const pointerLockRef = useRef(false);
  const lookSensitivityRef = useRef(1);
  const frames = useMemo(() => artworks, []);

  useEffect(() => {
    lookSensitivityRef.current = typeof window !== 'undefined' && 'ontouchstart' in window ? 1.5 : 1;
  }, []);

  const onClose = () => setSelected(null);

  const toggleViewMode = useCallback(() => {
    setViewMode((m) => (m === 'orbit' ? 'walk' : 'orbit'));
    if (document.pointerLockElement) document.exitPointerLock();
  }, []);

  useEffect(() => {
    if (viewMode !== 'walk') return;
    const keyMap = {
      KeyW: 'forward',
      KeyS: 'back',
      KeyA: 'left',
      KeyD: 'right',
      ArrowUp: 'forward',
      ArrowDown: 'back',
      ArrowLeft: 'turnL',
      ArrowRight: 'turnR',
    };
    const onKeyDown = (e) => {
      const k = keyMap[e.code];
      if (k && keysRef.current) keysRef.current[k] = 1;
    };
    const onKeyUp = (e) => {
      const k = keyMap[e.code];
      if (k && keysRef.current) keysRef.current[k] = 0;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [viewMode]);

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{ height: 'calc(100dvh - var(--navbar-height))' }}
    >
      <Canvas
        shadows
        style={{ width: '100%', height: '100%' }}
        dpr={
          typeof window !== 'undefined'
            ? Math.min(window.devicePixelRatio || 1, 2)
            : 1
        }
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          precision: 'highp',
          logarithmicDepthBuffer: false,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        frameloop="always"
      >
        <SceneInner
          viewMode={viewMode}
          walkState={walkState}
          setWalkState={setWalkState}
          keysRef={keysRef}
          joystickMoveRef={joystickMoveRef}
          joystickLookRef={joystickLookRef}
          pointerLockRef={pointerLockRef}
          lookSensitivityRef={lookSensitivityRef}
          isTouchDevice={isTouchDevice}
          artworks={frames}
          onArtworkClick={setSelected}
        />
      </Canvas>

      {/* Toggle vista: Recorrer como visitante / Vista libre */}
      <div className="absolute top-4 left-4 z-10">
        <button
          type="button"
          onClick={toggleViewMode}
          className="btn btn-sm btn-primary shadow-lg"
          aria-label={
            viewMode === 'orbit'
              ? 'Recorrer como visitante'
              : 'Volver a vista libre'
          }
        >
          {viewMode === 'orbit'
            ? 'Recorrer como visitante'
            : 'Vista libre'}
        </button>
      </div>

      {/* Controles móvil: joysticks con safe area y tamaño cómodo */}
      {viewMode === 'walk' && isTouchDevice && (
        <div
          className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-4 pb-4 pointer-events-none"
          style={{
            paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
            paddingLeft: 'max(1rem, env(safe-area-inset-left))',
            paddingRight: 'max(1rem, env(safe-area-inset-right))',
          }}
        >
          <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <VirtualJoystick
              label="Mover"
              large
              onMove={(v) => { joystickMoveRef.current = v; }}
            />
            <span className="text-xs font-medium text-base-content/80 drop-shadow-sm">Mover</span>
          </div>
          <div className="flex flex-col items-center gap-2 pointer-events-auto">
            <VirtualJoystick
              label="Mirar"
              large
              onMove={(v) => { joystickLookRef.current = v; }}
            />
            <span className="text-xs font-medium text-base-content/80 drop-shadow-sm">Mirar</span>
          </div>
        </div>
      )}

      <GalleryControls viewMode={viewMode} mobileWithJoysticks={viewMode === 'walk' && isTouchDevice} />

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

      {selected && <ArtworkModal artwork={selected} onClose={onClose} />}
    </section>
  );
}


