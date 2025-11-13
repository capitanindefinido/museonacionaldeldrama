import { notFound } from 'next/navigation';
import { artworks } from '@/data/artworks';
import ExhibitionDetails from '@/components/ExhibitionDetails';

export function generateStaticParams() {
  return artworks.map((artwork) => ({
    id: String(artwork.id),
  }));
}

export default async function ExhibitionPage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  const artwork = artworks.find((a) => a.id === numericId);

  if (!artwork) {
    notFound();
  }

  return <ExhibitionDetails artwork={artwork} />;
}