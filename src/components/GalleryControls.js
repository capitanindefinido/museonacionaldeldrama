'use client';

export default function GalleryControls({ viewMode = 'orbit', mobileWithJoysticks = false }) {
  const isWalk = viewMode === 'walk';
  const bottomClass = isWalk && mobileWithJoysticks
    ? 'bottom-[11rem]' // por encima de los joysticks en móvil
    : 'bottom-24';
  const posClass = isWalk ? 'left-1/2 -translate-x-1/2' : 'left-6';
  return (
    <div
      className={`absolute z-10 card bg-base-200/90 backdrop-blur-md border border-primary/30 shadow-2xl ${bottomClass} ${posClass}`}
    >
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <div className="text-primary text-xl">ℹ️</div>
          <div className="text-sm space-y-2">
            <p className="font-bold text-primary mb-2">
              {isWalk ? 'Controles (recorrer)' : 'Controles de Navegación'}
            </p>
            {isWalk ? (
              <div className="space-y-1.5 text-base-content/80">
                <p className="flex items-center gap-2">
                  <span className="badge badge-primary badge-sm">⌨️</span>
                  WASD o flechas para mover
                </p>
                <p className="flex items-center gap-2">
                  <span className="badge badge-secondary badge-sm">🖱️</span>
                  Click en la escena para mirar con el ratón (ESC para salir)
                </p>
                <p className="flex items-center gap-2">
                  <span className="badge badge-accent badge-sm">📱</span>
                  {mobileWithJoysticks
                    ? 'Mueve los joysticks: izquierdo para andar, derecho para mirar'
                    : 'En móvil: joystick izquierdo mover, derecho mirar'}
                </p>
                <p className="flex items-center gap-2">
                  <span className="badge badge-accent badge-sm">👆</span>
                  Click en obra para detalles
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 text-base-content/80">
                <p className="flex items-center gap-2">
                  <span className="badge badge-primary badge-sm">🖱️</span>
                  Click y arrastra para rotar
                </p>
                <p className="flex items-center gap-2">
                  <span className="badge badge-secondary badge-sm">🔍</span>
                  Scroll para hacer zoom
                </p>
                <p className="flex items-center gap-2">
                  <span className="badge badge-accent badge-sm">👆</span>
                  Click en obra para detalles
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

