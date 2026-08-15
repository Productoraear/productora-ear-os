import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';

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
    
    // Tipado estricto con el modelo autogenerado de Prisma (artistProfile)
    const artist = await prisma.artistProfile.findUnique({
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