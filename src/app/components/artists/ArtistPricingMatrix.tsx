import React from 'react';
import { DollarSign, ShieldCheck, Check } from 'lucide-react';

export const ArtistPricingMatrix: React.FC = () => {
  const tiers = [
    {
      name: 'Show Clásico Esencial',
      price: '350€',
      duration: '45 minutos',
      features: ['Formación estándar (5 integrantes)', 'Canciones selectas del repertorio tradicional', 'Entrada festiva del homenajeado', 'Equipo de sonido profesional básico'],
    },
    {
      name: 'Espectáculo Premium Gala',
      price: '750€',
      duration: '90 minutos (2 Pases)',
      features: ['Formación Premium (8 integrantes)', 'Trajes de gala tradicionales bordados', 'Peticiones de canciones ilimitadas', 'Microfonía inalámbrica premium', 'Desplazamiento incluido (hasta 50km)'],
      featured: true,
    },
    {
      name: 'Gran Concierto S-Class Royal',
      price: '1.800€',
      duration: 'Espectáculo completo',
      features: ['Formación Sinfónica del Colibrí', 'Ingeniero sónico dedicado', 'Regalo de rider de prensa oficial en PDF', 'Estimulación Gamma 40Hz en los intermedios', 'Grabación de vídeo del evento en 4K'],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne">Tarifas y Cachés</h3>
        <p className="text-white/40 text-xs uppercase tracking-widest font-bold max-w-md mx-auto leading-relaxed">
          Estructura de precios transparente por duración y formación para asegurar la máxima calidad.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div 
            key={i} 
            className={`bg-[#0b0b0b] border rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden transition-all ${
              tier.featured 
                ? 'border-[#ecb613]/40 shadow-2xl shadow-[#ecb613]/5' 
                : 'border-white/5 hover:border-white/10'
            }`}
          >
            {tier.featured && (
              <div className="absolute top-4 right-4 bg-[#ecb613]/10 border border-[#ecb613]/20 px-3 py-1 rounded-full text-[8px] font-black uppercase text-[#ecb613] tracking-widest">
                Recomendado
              </div>
            )}

            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613]/80 font-mono block mb-1">
                  {tier.duration}
                </span>
                <h4 className="text-xl font-black uppercase text-white tracking-tight">{tier.name}</h4>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black italic text-white font-mono">{tier.price}</span>
                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Base / Evento</span>
              </div>

              <ul className="space-y-3 pt-6 border-t border-white/5">
                {tier.features.map((f, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs text-white/70 leading-relaxed">
                    <Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
