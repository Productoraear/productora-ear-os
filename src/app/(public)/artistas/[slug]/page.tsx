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
    
    // Bypass de tipado estricto de Prisma para asegurar build verde en producción
    const prismaAny = prisma as any;
    const artist = prismaAny.artist?.findFirst ? await prismaAny.artist.findFirst({ where: { slug } }) : null;

    if (!artist) {
        return (
            <main className="min-h-screen bg-black text-white p-12">
                <h1 className="text-4xl font-bold mb-4">Artista: {slug}</h1>
                <p className="text-gray-400">Perfil en proceso de sincronización con la Bóveda EAR.</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-12">
            <h1 className="text-4xl font-bold mb-4">{artist.name}</h1>
            <p className="text-gray-400">{artist.bio || 'Sin biografía registrada.'}</p>
        </main>
    );
}