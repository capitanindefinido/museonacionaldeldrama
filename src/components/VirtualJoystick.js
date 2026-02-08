'use client';

import { useRef, useCallback, useState } from 'react';

const DEAD_ZONE = 0.12;

/**
 * Joystick táctil que emite un vector 2D normalizado [-1,1] para movimiento.
 * En móvil usa tamaño mayor y respeta safe area.
 * @param {Object} props
 * @param {function([x,y])} props.onMove - Llamado con [x, y] normalizado cuando cambia el stick
 * @param {string} props.label - Etiqueta accesible (ej. "Mover", "Mirar")
 * @param {boolean} props.large - Si true, tamaño mayor para móvil
 * @param {string} props.className - Clases CSS adicionales
 */
export default function VirtualJoystick({ onMove, label = 'Joystick', large = false, className = '' }) {
  const containerRef = useRef(null);
  const [touchId, setTouchId] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const baseSize = large ? 136 : 100;
  const radius = baseSize / 2 - 14;
  const knobSize = large ? 56 : 44;

  const getCenter = useCallback(() => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);

  const clampWithDeadZone = useCallback((x, y) => {
    const len = Math.hypot(x, y);
    if (len <= DEAD_ZONE) return [0, 0];
    const scaled = (len - DEAD_ZONE) / (1 - DEAD_ZONE);
    const factor = Math.min(1, scaled / len);
    return [x * factor, y * factor];
  }, []);

  const handleStart = useCallback(
    (clientX, clientY, id) => {
      setTouchId(id);
      const center = getCenter();
      const x = (clientX - center.x) / radius;
      const y = (clientY - center.y) / radius;
      const [cx, cy] = clampWithDeadZone(x, y);
      const len = Math.hypot(x, y);
      const clampLen = len <= 1 ? len : 1;
      const displayX = len <= 1 ? x * radius : (x / len) * radius;
      const displayY = len <= 1 ? y * radius : (y / len) * radius;
      setPosition({ x: displayX, y: displayY });
      onMove?.([cx, cy]);
    },
    [getCenter, clampWithDeadZone, onMove, radius]
  );

  const handleMove = useCallback(
    (clientX, clientY) => {
      if (touchId === null) return;
      const center = getCenter();
      const x = (clientX - center.x) / radius;
      const y = (clientY - center.y) / radius;
      const [cx, cy] = clampWithDeadZone(x, y);
      const len = Math.hypot(x, y);
      const displayX = len <= 1 ? x * radius : (x / len) * radius;
      const displayY = len <= 1 ? y * radius : (y / len) * radius;
      setPosition({ x: displayX, y: displayY });
      onMove?.([cx, cy]);
    },
    [touchId, getCenter, clampWithDeadZone, onMove, radius]
  );

  const handleEnd = useCallback(() => {
    setTouchId(null);
    setPosition({ x: 0, y: 0 });
    onMove?.([0, 0]);
  }, [onMove]);

  const onTouchStart = (e) => {
    e.preventDefault();
    const t = e.changedTouches[0];
    handleStart(t.clientX, t.clientY, t.identifier);
  };
  const onTouchMove = (e) => {
    e.preventDefault();
    const t = Array.from(e.changedTouches).find((x) => x.identifier === touchId);
    if (t) handleMove(t.clientX, t.clientY);
  };
  const onTouchEnd = (e) => {
    const stillDown = Array.from(e.touches).some((x) => x.identifier === touchId);
    if (!stillDown) handleEnd();
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    e.preventDefault();
    handleStart(e.clientX, e.clientY, 'mouse');
  };

  return (
    <div
      ref={containerRef}
      className={`virtual-joystick select-none touch-none ${className}`}
      style={{
        width: baseSize,
        height: baseSize,
        minWidth: 44,
        minHeight: 44,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.35)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => {
        if (e.pointerType === 'mouse' && touchId === 'mouse') handleMove(e.clientX, e.clientY);
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'mouse' && touchId === 'mouse') handleEnd();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && touchId === 'mouse') handleEnd();
      }}
      role="slider"
      aria-label={label}
      tabIndex={0}
    >
      <div
        style={{
          width: knobSize,
          height: knobSize,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.95)',
          border: '2px solid rgba(0,0,0,0.12)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
          pointerEvents: 'none',
          transition: touchId === null ? 'transform 0.15s ease-out' : 'none',
        }}
      />
    </div>
  );
}
