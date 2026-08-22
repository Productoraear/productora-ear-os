import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface Props {
  params: Promise<{
    categoria: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryFormatted = (resolvedParams?.categoria || 'servicios').replace(/-/g, ' ');

  return {
    title: `${categoryFormatted.toUpperCase()} en Madrid y España | Productora EAR`,
    description: `Servicios de ${categoryFormatted} con infraestructura técnica directa, estándar S-Class y cobertura nacional.`,
    alternates: {
      canonical: `https://www.productoraear.com/servicios/${resolvedParams.categoria}`,
    }
  };
}

export default async function ServicioCategoriaPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-black text-white">
      <BespokeTemplate 
        category={resolvedParams.categoria}
        location="Madrid"
        province="Madrid"
      />
    </main>
  );
}
