import os

target_path = r"src\app\servicios\[categoria]\[provincia]\page.tsx"
os.makedirs(os.path.dirname(target_path), exist_ok=True)

content = """import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { generateSemanticPageData, resolveGeoLocation } from '@/lib/seo/semantic-engine';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    categoria: string;
    provincia: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const geo = resolveGeoLocation(params.provincia);
  const locationName = geo ? geo.name : params.provincia;
  const catFormatted = params.categoria.replace(/-/g, ' ');

  return {
    title: `${catFormatted.toUpperCase()} en ${locationName} | Producción S-Class & Reserva Homologada`,
    description: `Reserva ${catFormatted} en ${locationName} con infraestructura técnica directa, músicos verificados y garantía de Productora EAR.`,
  };
}

export default function ServicioProvinciaPage({ params }: Props) {
  const geo = resolveGeoLocation(params.provincia);
  
  if (!geo) {
    notFound();
  }

  const categoryName = params.categoria.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-black text-white">
      <BespokeTemplate 
        category={categoryName}
        location={geo.name}
        province={geo.province}
      />
    </div>
  );
}
"""

with open(target_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ Archivo page.tsx de servicios creado correctamente.")
