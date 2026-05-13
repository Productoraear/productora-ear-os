import React from 'react';

export default function AvisoLegalPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto glass-panel p-12 lg:p-20 rounded-[4rem] border-white/5 bg-white/[0.01]">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-12">Aviso <span className="text-[#d4a855]">Legal</span></h1>
        <div className="space-y-8 text-white/60 font-medium leading-relaxed">
          <p>Información societaria y legal bajo el estándar de transparencia EAR OS.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">Titularidad del Ecosistema</h3>
          <p>Productora EAR es una entidad dedicada a la ingeniería de eventos y management artístico. Sede central en Méntrida, Toledo.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">Propiedad Intelectual</h3>
          <p>Todo el contenido, arquitectura visual y protocolos 'S-Class' son propiedad exclusiva de Productora EAR. Queda prohibida la replicación sin autorización expresa.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">Responsabilidad Operativa</h3>
          <p>La ejecución de servicios está sujeta a auditoría previa de viabilidad por nuestro departamento técnico.</p>
        </div>
      </div>
    </main>
  );
}
