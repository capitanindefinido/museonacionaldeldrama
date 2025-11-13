'use client';

export default function GalleryControls() {
  return (
    <div className="absolute bottom-24 left-6 z-10 card bg-base-200/90 backdrop-blur-md border border-primary/30 shadow-2xl">
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <div className="text-primary text-xl">ℹ️</div>
          <div className="text-sm space-y-2">
            <p className="font-bold text-primary mb-2">Controles de Navegación:</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}

