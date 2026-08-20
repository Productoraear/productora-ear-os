import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';

// Configuración explícita para resolver cualquier provincia en tiempo de ejecución
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

interface Props {
  params: Promise<{
    categoria: string;
    provincia: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const categoryFormatted = (resolvedParams?.categoria || 'servicios').replace(/-/g, ' ');
  const provinceFormatted = (resolvedParams?.provincia || 'madrid').replace(/-/g, ' ');

  return {
    title: `${categoryFormatted.toUpperCase()} en${provinceFormatted.toUpperCase()} | Productora EAR`,
    description: `Servicios de ${categoryFormatted} en${provinceFormatted} con infraestructura técnica directa.`,
  };
}

export default async function ServicioProvinciaPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-black text-white">
      <BespokeTemplate 
        category={resolvedParams.categoria}
        location={resolvedParams.provincia}
        province={resolvedParams.provincia}
      />
    </main>
  );
}