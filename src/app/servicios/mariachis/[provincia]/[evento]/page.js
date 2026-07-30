import { getCopyForEvent } from '@/config/seo-matrix';
import { generateJsonLd } from '@/lib/generateJsonLd';
import BookingCalculator from '@/components/BookingCalculator';
import { notFound } from 'next/navigation';
export async function generateMetadata({ params }) {
    const { title, description } = getCopyForEvent(params.provincia, params.evento);
    return {
        title,
        description,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/servicios/mariachis/${params.provincia}/${params.evento}`,
        },
    };
}
export default async function DynamicMariachiPage({ params }) {
    const { provincia, evento } = params;
    const copy = getCopyForEvent(provincia, evento);
    const jsonLd = generateJsonLd(provincia, evento);
    if (!copy)
        return notFound();
    return (<>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>

      <main className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 border-b border-zinc-800 pb-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-green-500 mb-4 uppercase">
              {copy.title}
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              {copy.description}
            </p>
          </header>

          <section className="mb-16 bg-zinc-900 p-1 rounded-2xl border border-zinc-800 shadow-2xl">
             <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                   <span>⚡</span> Reserva tu Mariachi Solista Premium
                </h2>
                <BookingCalculator initialProvincia={provincia} initialEvento={evento}/>
             </div>
          </section>

          <section className="grid md:grid-cols-2 gap-8 text-sm text-zinc-500">
            <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-900">
              <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Garantía EAR OS</h3>
              <p>Músicos verificados mediante Smoke Test S-Class. Pre-contrato legal generado al instante tras la reserva.</p>
            </div>
            <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-900">
              <h3 className="text-white font-bold mb-2 uppercase tracking-widest text-xs">Cobertura Total</h3>
              <p>Servicio disponible en {copy.provCapitalized} y pedanías limítrofes. Logística de transporte y equipo de sonido profesional incluido.</p>
            </div>
          </section>
        </div>
      </main>
    </>);
}
