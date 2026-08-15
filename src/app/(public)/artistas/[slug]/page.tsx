import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

// Dynamic rendering to avoid build-time database connection requirements during Next.js SSG
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: 'Artista | ' + slug,
        description: 'Perfil oficial en Productora EAR',
    };
}

export default async function ArtistDetailPage({ params }: PageProps) {
    const { slug } = await params;
    
    let artist = null;
    try {
        artist = await prisma.artistProfile.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        name: true,
                        displayName: true,
                    }
                }
            }
        });
    } catch (e) {
        console.warn(`[ARTIST_PAGE] DB query fallback for slug ${slug}:`, e);
    }

    if (!artist) {
        return (
            <main className="min-h-screen bg-black text-white p-12">
                <h1 className="text-4xl font-bold mb-4">Artista: {slug}</h1>
                <p className="text-gray-400">Perfil en proceso de sincronización con la Bóveda EAR.</p>
            </main>
        );
    }

    const artistName = artist.stageName || artist.displayName || artist.user?.displayName || artist.user?.name || slug;

    return (
        <main className="min-h-screen bg-black text-white p-12">
            <h1 className="text-4xl font-bold mb-4">{artistName}</h1>
            <p className="text-gray-400">{artist.bio || 'Sin biografía registrada.'}</p>
        </main>
    );
}