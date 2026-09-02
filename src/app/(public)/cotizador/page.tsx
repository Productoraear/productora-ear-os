import MultiPricer from "@/components/pricing/MultiPricer";

export const metadata = {
  title: "Cotizador S-Class & MultiPricer | Productora EAR",
  description: "Calculadora interactiva en tiempo real para eventos, festivales, bodas y contratos municipales con Price-Lock garantizado 72h."
};

export default function CotizadorPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <MultiPricer />
      </div>
    </main>
  );
}
