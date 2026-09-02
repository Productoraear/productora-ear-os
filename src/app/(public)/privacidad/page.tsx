import React from 'react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto glass-panel p-12 lg:p-20 rounded-[4rem] border-white/5 bg-white/[0.01]">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-12">Política de <span className="text-[#d4a855]">Privacidad</span></h1>
        <div className="space-y-8 text-white/60 font-medium leading-relaxed">
          <p>En Productora EAR, la soberanía de tus datos es nuestra prioridad. Esta política detalla cómo orquestamos la información que nos confías.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">1. Recolección de Datos</h3>
          <p>Recopilamos información necesaria para la ejecución de servicios S-Class, incluyendo datos de contacto y métricas de talento para el embudo 'The Signal'.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">2. Uso de la Información</h3>
          <p>Tus datos se utilizan exclusivamente para la personalización de presupuestos, logística táctica y comunicación directa sobre tus proyectos.</p>
          <h3 className="text-xl font-black uppercase tracking-widest text-white">3. Seguridad S-Class</h3>
          <p>Implementamos protocolos de cifrado de vanguardia para asegurar que tu huella digital permanezca protegida contra cualquier intrusión externa.</p>
        </div>
      </div>
    </main>
  );
}
