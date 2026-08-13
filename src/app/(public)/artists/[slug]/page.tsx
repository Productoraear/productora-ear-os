import ArtistProfilePage, { generateMetadata } from '../../artistas/[slug]/page';

export async function generateStaticParams() {
    // Retorno estático seguro para evitar errores de compilación en build
    return [{ slug: 'default-artist' }];
}

export { generateMetadata };
export default ArtistProfilePage;