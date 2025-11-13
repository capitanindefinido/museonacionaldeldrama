'use client';

export default function AboutPage() {
  return (
    <section className="min-h-screen px-4 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-base-content">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Colectivo Ruido Perdido presenta:
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-5xl text-accent">
          "MUSEO NACIONAL DEL DRAMA"
        </h1>
        <p className="text-lg text-accent">
          Una exposición de 8 canciones dramáticas.
        </p>
        <blockquote className="border-l-4 border-secondary pl-4 text-lg italic text-primary/80">
          ¿En qué momento somos nuestra peor versión? ¿Qué puedo hacer con ello?
        </blockquote>
        <p className="text-lg leading-relaxed text-accent">
          Como Museo Nacional del Drama, elegimos responder aquellas interrogantes a través de “DRAMA26”, una
          selección de canciones que buscan introducirnos al universo del artista.
        </p>
        <p className="text-lg leading-relaxed text-accent">
          El proyecto nace como una exploración de la emocionalidad de alguien que ha vuelto su vida un drama:
          excesos, desamores y un conjunto de malas decisiones guiadas por la impulsividad y la resaca.
        </p>
        <p className="text-lg leading-relaxed text-accent">
          Su propósito es hacer una suerte de exorcismo artístico: arrancar el drama de la vida del artista y
          volverlo una performance de la cual poder desapegarse.
        </p>
        <p className="text-lg leading-relaxed text-accent">
          Durante 4 años, a través de la colaboración con diversos músicos, productores y artistas audiovisuales,
          DRAMA26 ha ido construyendo un universo propio, que hoy se apodera de los muros de nuestra institución.
        </p>
        <a
          href="/museo"
          className="btn btn-primary mt-6 w-fit tracking-wide"
        >
          Entrar al museo
        </a>
      </div>
    </section>
  );
}


