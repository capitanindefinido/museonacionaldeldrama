Museo Nacional del Drama — sitio Next.js (App Router) sin JSX

## Desarrollo

1. Instala dependencias

```
npm install
```

2. Levanta el entorno de desarrollo

```
npm run dev
```

Abre http://localhost:3000.

## Estructura principal

- `src/app/layout.js`: layout base (tema `drama`, fuente Montserrat), `Navbar`, `Footer`, `ShopWidget` global.
- `src/app/page.js`: `Hero` + `GalleryScene` (Three.js con R3F).
- `src/app/about/page.js`: texto curatorial.
- `src/app/shop/page.js`: productos ficticios (usa `formatCLP`).
- `src/app/exhibitions/[slug]/page.js`: muestra obra por `slug`.
- `src/components/*`: UI y 3D (`Navbar`, `Footer`, `Hero`, `GalleryScene`, `ArtworkFrame`, `ArtworkModal`, `ShopWidget`).
- `src/data/artworks.js`: datos locales (3 obras).
- `src/lib/*`: utilidades (`formatCLP`, `routes`).

## Notas técnicas

- Sin JSX: todos los componentes usan `React.createElement`.
- Estilo: Tailwind v4; si usas DaisyUI, añade la dependencia y plugin en Tailwind.
- 3D: React Three Fiber + Drei (luces magenta/azul, cámara `position: [0,1.5,5]`).
- Imágenes de obras: `public/ideas/museo{3,5,7}.png`.

## Próximos pasos

- Integrar DaisyUI y definir tema `drama` (si no está instalado).
- Agregar CMS para contenidos (ej. Sanity/Contentful) y assets optimizados.
- Tienda real con Stripe (checkout y webhooks) y estado de carrito global.
- Optimizaciones WebGL, carga progresiva y compresión de imágenes.
