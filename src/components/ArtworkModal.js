'use client';

import Link from 'next/link';
import { EXHIBITION } from '../lib/routes';
import Artwork3DViewer from './Artwork3DViewer';

export default function ArtworkModal({ artwork, onClose }) {
  if (!artwork) return null;

  const has3DModel = artwork.image_3d;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#05050A]/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-[#101123] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 70px rgba(5, 5, 15, 0.65)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#111222]/80 text-white transition-colors duration-200 hover:border-white/20 hover:bg-white/15"
          aria-label="Cerrar detalle de la obra"
        >
          ✕
        </button>

        <div className="flex h-full flex-col md:flex-row">
          <div className="md:w-1/2 border-b border-white/10 bg-[#0F101E] md:border-b-0 md:border-r">
            <div className="relative h-full w-full aspect-[4/3] md:h-full md:min-h-[360px]">
              {has3DModel ? (
                <Artwork3DViewer modelUrl={artwork.image_3d} />
              ) : (
                <>
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 md:p-10">
            <div className="flex h-full flex-col gap-8">
              <header className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                  {artwork.title}
                </h2>
                <p className="text-base md:text-lg text-[#d9d9e0]/80">
                  {artwork.artist} <span className="text-primary/70">•</span> {artwork.year}
                </p>
                {artwork.feat && (
                  <p className="text-sm text-primary/70">
                    Feat: <span className="text-[#ededed]/90">{artwork.feat}</span>
                  </p>
                )}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </header>

              <div className="space-y-4 text-sm md:text-base text-[#ededed]/85 leading-relaxed">
                {artwork.phrase && (
                  <blockquote className="rounded-xl border border-white/10 bg-white/5 p-5 italic text-[#ededed]/90">
                    {artwork.phrase}
                  </blockquote>
                )}

                {artwork.summary && (
                  <section className="rounded-xl border border-white/10 bg-[#16172A] p-5">
                    <h3 className="text-xs uppercase tracking-[0.28em] text-secondary/60 mb-2 font-semibold">
                      Resumen
                    </h3>
                    <p>{artwork.summary}</p>
                  </section>
                )}

                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-primary/70 mb-2 font-semibold">
                      Artista
                    </p>
                    <p className="text-base font-semibold text-white leading-tight">{artwork.artist}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-secondary/70 mb-2 font-semibold">
                      Año
                    </p>
                    <p className="text-base font-semibold text-white leading-tight">{artwork.year}</p>
                  </div>
                </div>

                {artwork.credits && (
                  <section className="rounded-xl border border-white/10 bg-[#16172A] p-5 whitespace-pre-line">
                    <h3 className="text-xs uppercase tracking-[0.28em] text-accent/70 mb-2 font-semibold">
                      Créditos
                    </h3>
                    {artwork.credits}
                  </section>
                )}
              </div>

              <div>
                <Link
                  href={EXHIBITION(artwork.id)}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary/80 to-accent/80 px-6 py-4 text-lg font-semibold text-[#121223] transition duration-200 hover:from-primary hover:to-accent hover:shadow-lg"
                >
                  Ver Más Detalles
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


