'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="min-h-[calc(100dvh-var(--navbar-height))] max-h-[calc(100dvh-var(--navbar-height))] w-full flex flex-col items-center justify-center bg-background from-base-100 via-base-100 to-primary/10 relative overflow-hidden">
      {/* Efectos de luz de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="mb-10 flex justify-center">
          <Image
            src="/ideas/LOGO%20MUSEO.png"
            alt="Museo Nacional del Drama"
            width={800}
            height={300}
            className="w-full max-w-2xl h-auto drop-shadow-[0_0_30px_rgba(0,191,255,0.5)]"
            priority
          />
        </div>

        <p className="text-xl md:text-2xl text-foreground mb-8 font-light text-accent">
        Una exposición de 8 canciones dramáticas.
        </p>
        {/* <p className="text-lg md:text-xl text-foreground mb-12 font-light">
          Obras exclusivas de Drama26
        </p> */}

        <Link
          href="/museo"
          className="btn btn-primary btn-lg px-12 py-6 text-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(0,191,255,0.5)] hover:shadow-[0_0_50px_rgba(0,191,255,0.7)] rounded-lg"
        >
          Ingresar al Museo
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>

        {/* Decoraciones */}
        {/* <div className="mt-16 flex justify-center gap-8 text-base-content/70 text-sm">
          <div className="flex flex-col items-center group cursor-default">
            <div className="w-16 h-16 border-2 border-primary/50 rounded-lg mb-2 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all duration-300 group-hover:scale-110">
              <span className="text-primary text-2xl font-bold">3</span>
            </div>
            <span className="group-hover:text-primary transition-colors font-medium">Obras</span>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="w-16 h-16 border-2 border-secondary/50 rounded-lg mb-2 flex items-center justify-center group-hover:border-secondary group-hover:bg-secondary/10 transition-all duration-300 group-hover:scale-110">
              <span className="text-secondary text-2xl font-bold">3D</span>
            </div>
            <span className="group-hover:text-secondary transition-colors font-medium">Experiencia</span>
          </div>
          <div className="flex flex-col items-center group cursor-default">
            <div className="w-16 h-16 border-2 border-accent/50 rounded-lg mb-2 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300 group-hover:scale-110">
              <span className="text-accent text-2xl font-bold">∞</span>
            </div>
            <span className="group-hover:text-accent transition-colors font-medium">Inmersivo</span>
          </div>
        </div> */}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-base-content/60 text-sm">
        <p>Artista: Drama26 • Chile • 2025</p>
      </div>
    </section>
  );
}


