'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';

const BOUNDS = { min: -4.3, max: 4.3 };
const SPEED = 2.2;
const TURN_SPEED = 1.8;
const EYE_HEIGHT = 1.55;

function clamp(value, minVal, maxVal) {
  return Math.max(minVal, Math.min(maxVal, value));
}

/**
 * Actualiza la cámara en cada frame para que siga posición y yaw del maniquí (vista primera persona).
 * Si pointerLockRef.current es true, no sobrescribe la rotación (la controla PointerLockControls).
 */
export function FirstPersonCamera({ position, yaw, pitch = 0, pointerLockRef }) {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  useFrame(() => {
    camera.position.set(position[0], position[1] + EYE_HEIGHT, position[2]);
    if (!pointerLockRef?.current) {
      euler.current.set(pitch, yaw, 0);
      camera.quaternion.setFromEuler(euler.current);
    }
  });
  return null;
}

const LOOK_SENSITIVITY = 0.8;
const MAX_PITCH = Math.PI / 2 - 0.1;

/**
 * Lee teclado, joystick y sincroniza yaw con la cámara (PointerLock la rota). Actualiza posición cada frame.
 * lookSensitivityRef: multiplicador de sensibilidad al mirar (ej. 1.4 en móvil).
 */
export function WalkController({
  viewMode,
  setWalkState,
  keysRef,
  joystickMoveRef,
  joystickLookRef,
  pointerLockRef,
  lookSensitivityRef,
}) {
  const { camera } = useThree();
  const sens = lookSensitivityRef?.current ?? 1;

  useFrame((_, delta) => {
    if (viewMode !== 'walk') return;

    const k = keysRef?.current || { forward: 0, back: 0, left: 0, right: 0, turnL: 0, turnR: 0 };
    const joy = joystickMoveRef?.current || [0, 0];
    const look = joystickLookRef?.current || [0, 0];

    const forward = k.forward - k.back + joy[1];
    const strafe = k.right - k.left + joy[0];
    const turn = (k.turnR - k.turnL) * TURN_SPEED * delta;

    const moveSpeed = SPEED * delta;

    setWalkState((prev) => {
      let newYaw = prev.yaw + turn;
      let newPitch = prev.pitch;
      if (pointerLockRef?.current) {
        newYaw = camera.rotation.y;
        newPitch = camera.rotation.x;
      } else {
        newYaw += look[0] * LOOK_SENSITIVITY * sens * delta;
        newPitch += look[1] * LOOK_SENSITIVITY * sens * delta;
        newPitch = clamp(newPitch, -MAX_PITCH, MAX_PITCH);
      }
      const cos = Math.cos(newYaw);
      const sin = Math.sin(newYaw);
      let x = prev.position[0] + (-sin * forward + cos * strafe) * moveSpeed;
      let z = prev.position[2] + (-cos * forward - sin * strafe) * moveSpeed;
      x = clamp(x, BOUNDS.min, BOUNDS.max);
      z = clamp(z, BOUNDS.min, BOUNDS.max);
      return {
        position: [x, 0, z],
        yaw: newYaw,
        pitch: newPitch,
      };
    });
  });

  return null;
}

/**
 * Mantiene pointerLockRef actualizado cuando el usuario entra/sale de pointer lock.
 */
export function PointerLockRefSync({ viewMode, pointerLockRef }) {
  const { gl } = useThree();
  useEffect(() => {
    if (viewMode !== 'walk' || !pointerLockRef) return;
    const canvas = gl.domElement;
    const onLockChange = () => {
      pointerLockRef.current = document.pointerLockElement === canvas;
    };
    canvas.addEventListener('pointerlockchange', onLockChange);
    return () => canvas.removeEventListener('pointerlockchange', onLockChange);
  }, [viewMode, gl, pointerLockRef]);
  return null;
}

/**
 * PointerLockControls: al hacer click en el canvas en modo walk se bloquea el puntero.
 * Solo en desktop: en móvil no se soporta bien y provoca el aviso "Unable to use Pointer Lock API".
 */
export function WalkPointerLock({ viewMode, isTouchDevice }) {
  if (viewMode !== 'walk' || isTouchDevice) return null;
  return <PointerLockControls pointerSpeed={1.2} />;
}
