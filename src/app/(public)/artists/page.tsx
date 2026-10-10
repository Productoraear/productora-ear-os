import type { Metadata } from 'next';
import ArtistasPage from '../artistas/page';

export const metadata: Metadata = {
  title: 'Artistas | Productora EAR',
  description:
    'Catálogo de artistas representados por Productora EAR: perfiles, géneros, próximos shows y disponibilidad para booking.',
  openGraph: {
    title: 'Artistas | Productora EAR',
    description:
      'Catálogo de artistas representados por Productora EAR: perfiles, géneros, próximos shows y disponibilidad para booking.',
    type: 'website',
  },
};

export default function PublicArtistsListPage() {
  return (
    <main
      className="min-h-screen w-full bg-[#030305] text-white antialiased selection:bg-white/10 selection:text-white"
      data-page="public-artists"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <ArtistasPage />
      </div>
    </main>
  );
}