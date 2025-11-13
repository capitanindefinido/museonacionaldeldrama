'use client';

import Link from 'next/link';
import { useCallback } from 'react';

export default function ExhibitionDetails({ artwork }) {
  if (!artwork) {
    return null;
  }

  const handleShare = useCallback(() => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    const shareData = {
      title: artwork.title,
      text: artwork.summary || artwork.description,
      url,
    };

    if (navigator?.share) {
      navigator.share(shareData).catch(() => {
        /* silencio: el usuario canceló */
      });
      return;
    }

    navigator?.clipboard?.writeText(url);
    alert('Enlace copiado para compartir');
  }, [artwork.description, artwork.summary, artwork.title]);

  const getHighlightColor = () => {
    if (!artwork.year) return 'from-primary/30 via-accent/20 to-secondary/20';

    if (artwork.year >= 2024) {
      return 'from-secondary/30 via-accent/20 to-primary/20';
    }

    if (artwork.year >= 2020) {
      return 'from-accent/30 via-primary/20 to-secondary/20';
    }

    return 'from-primary/25 via-secondary/20 to-accent/20';
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-base-100">
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${getHighlightColor()} opacity-50 blur-3xl`}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <nav className="text-sm breadcrumbs text-base-content/60">
            <ul>
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/museo" className="transition-colors hover:text-accent">
                  Museo
                </Link>
              </li>
              <li className="font-semibold text-accent">{artwork.title}</li>
            </ul>
          </nav>

          <Link
            href="/museo"
            className="btn btn-outline btn-sm md:btn-md border-base-300 text-base-content/70 hover:border-accent hover:text-accent"
          >
            Volver al museo
          </Link>
        </div>

        <div className="flex flex-col gap-12">
          <div className="relative">
            <div className="absolute inset-0 -translate-x-[10%] -translate-y-[18%] rounded-[3rem] bg-gradient-to-tr from-base-200/40 via-accent/10 to-transparent blur-2xl sm:-translate-y-[12%]" />
            <div className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-200/40 shadow-2xl shadow-accent/10">
              <figure className="group relative">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full object-cover transition-all duration-700 group-hover:scale-[1.02] group-hover:contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-base-300/30 via-transparent to-transparent opacity-100 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-80" />
                <div className="absolute inset-x-6 bottom-6 flex items-center justify-between gap-3 rounded-2xl bg-base-100/80 px-4 py-3 text-xs uppercase tracking-wide text-base-content/70 backdrop-blur-md md:text-sm">
                  <span>{artwork.artist}</span>
                  <span className="hidden h-2 w-2 rounded-full bg-accent/80 sm:block" />
                  <span>{artwork.year}</span>
                </div>
              </figure>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <header className="space-y-6">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl font-black leading-tight text-accent md:text-5xl lg:text-6xl">
                  {artwork.title}
                </h1>
                <button
                  type="button"
                  onClick={handleShare}
                  className="btn btn-sm md:btn-md border-none bg-base-200/60 text-base-content/70 hover:bg-accent hover:text-base-100"
                >
                  Compartir
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-lg border-none bg-accent/15 text-accent p-2">
                  {artwork.artist}
                </span>
                <span className="badge badge-lg border-none bg-secondary/20 text-secondary p-2">
                  {artwork.year}
                </span>
                {artwork.feat && (
                  <span className="badge badge-lg border-none bg-primary/15 text-primary p-2">
                    Feat: {artwork.feat}
                  </span>
                )}
              </div>

              {artwork.phrase && (
                <blockquote className="relative overflow-hidden rounded-3xl border border-base-300/60 bg-base-100/90 px-8 py-6 text-lg italic text-base-content/80 shadow-lg shadow-base-300/20">
                  <span className="absolute -top-6 left-10 text-8xl font-black text-accent/10">“</span>
                  <span className="relative z-10 block leading-relaxed">{artwork.phrase}</span>
                </blockquote>
              )}
            </header>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-base-300/60 bg-base-100/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Artista</p>
                <p className="mt-2 text-lg font-semibold text-base-content">{artwork.artist}</p>
              </div>
              <div className="rounded-2xl border border-base-300/60 bg-base-100/80 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary/70">Año</p>
                <p className="mt-2 text-lg font-semibold text-base-content">{artwork.year}</p>
              </div>
            </div>

            {artwork.summary && (
              <section className="rounded-3xl border border-base-300/60 bg-base-100/95 p-8 shadow-lg shadow-base-300/20">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-primary/70">
                  Resumen curatorial
                </h2>
                <p className="mt-4 text-base text-base-content/80 leading-relaxed">{artwork.summary}</p>
              </section>
            )}

            {artwork.iframe && (
              <section className="rounded-3xl border border-accent/40 bg-base-100/95 p-8 shadow-lg shadow-accent/10">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent/80">
                  Escucha la canción
                </h2>
                <p className="mt-2 text-sm text-base-content/60">
                  Reproduce la pista directamente desde la colección curatorial.
                </p>
                <div
                  className="mt-4 overflow-hidden rounded-2xl shadow-inner shadow-base-300/30"
                  dangerouslySetInnerHTML={{ __html: artwork.iframe }}
                />
              </section>
            )}

            <section className="grid gap-6 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] xl:gap-10">
              <div className="rounded-3xl border border-base-300/60 bg-base-100/90 p-8 shadow-md shadow-base-300/15">
                <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent/70">
                  Narrativa de la obra
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-base-content/80">
                  {artwork.description}
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {artwork.credits && (
                  <div className="rounded-3xl border border-base-300/60 bg-base-200/50 p-6 shadow-sm">
                    <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-secondary/80">
                      Créditos principales
                    </h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-base-content/70">
                      {artwork.credits}
                    </p>
                  </div>
                )}

                {artwork.image_3d && (
                  <div className="rounded-3xl border border-dashed border-accent/40 bg-base-100/90 p-6 shadow-sm">
                    <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-accent/80">
                      Experiencia inmersiva
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-base-content/70">
                      Explora la pieza en un visor tridimensional y descubre detalles del montaje virtual.
                    </p>
                    <a
                      href={artwork.image_3d}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-accent mt-4 w-full"
                    >
                      Abrir modelo 3D
                    </a>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-base-300/50 bg-base-100/80 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">
                  Sigue explorando
                </p>
                <p className="mt-1 text-sm text-base-content/70">
                  Vuelve a la colección para descubrir más piezas del Museo Nacional del Drama.
                </p>
              </div>
              <Link href="/museo" className="btn btn-primary btn-sm md:btn-md ml-auto">
                Ir al museo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

