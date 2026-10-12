import React from 'react';
import Link from 'next/link';
import {
  Radio, Users, Wallet, Video, Check, MessageCircle,
  ShieldCheck, Globe2, BadgeCheck, TrendingUp, Filter
} from 'lucide-react';

/**
 * Centralita de mariachis + oferta de captación para grupos.
 *
 * TESIS DE DOMINANCIA (10x): en España hay cientos de músicos que se anuncian
 * como "mariachi", pero el sector funciona con una paradoja — muchos de ellos
 * viven de otra actividad y solo se visten de charro en momentos puntuales;
 * muy pocas agrupaciones ensayan de verdad y representan el género con rigor.
 *
 * La centralita de EAR OS convierte esa dispersión en una red verificada:
 * solo entran grupos con audio/vídeo y documentación auditada. No vendemos
 * promesas de flota: vendemos un único número nacional que filtra a los
 * profesionales reales y entrega bolos ya pagados a los directores serios.
 */

const VALUE_STACK: { icon: React.ReactNode; title: string; text: string }[] = [
  { icon: <Radio size={18} />, title: 'Clientes que ya han pagado', text: 'Te pasamos eventos con depósito de 100 € cobrado. Sin curiosos, sin regateo, sin subastas a la baja.' },
  { icon: <Wallet size={18} />, title: 'Tarifa digna y cerrada', text: 'Pago por músico acordado antes del evento. La red protege el caché del sector frente a la precariedad.' },
  { icon: <Users size={18} />, title: 'Comisión por recomendación', text: 'Tu enlace de afiliado genera saldo por cada reserva que traigas. Convertimos tu agenda en ingresos recurrentes.' },
  { icon: <Video size={18} />, title: 'Saldo canjeable en la productora', text: 'Fotos, vídeos, grabaciones y videoclips a precio especial, pagados con tu saldo. Tu talento se profesionaliza.' },
  { icon: <BadgeCheck size={18} />, title: 'Sello de red verificada', text: 'Auditamos audio/vídeo y documentación antes de activar tu grupo. Solo profesionales reales representan la marca.' },
  { icon: <Globe2 size={18} />, title: 'Expansión por país o región', text: 'España primero. Después, landings de captación por país que llevan a /mariachis/unirse.' },
];

const REALITY_GAPS = [
  {
    icon: <Filter size={16} />,
    title: 'Muchos se anuncian, pocos ensayan',
    text: 'El cliente acepta a menudo grupos que no representan el sector. Nuestra centralita filtra antes de publicar.',
  },
  {
    icon: <ShieldCheck size={16} />,
    title: 'Precio cerrado y verificado',
    text: 'Sin promesas de "despacho en 30 minutos". El tiempo de llegada se confirma caso a caso según ciudad y hora.',
  },
  {
    icon: <TrendingUp size={16} />,
    title: 'Del bolo suelto al pipeline',
    text: 'Cada evento con depósito pagado se transforma en masa crítica: más fechas, más grupos reales, más mercado digno.',
  },
];

export default function MariachiCentralita() {
  return (
    <div id="centralita" className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LADO CLIENTE */}
        <div className="rounded-3xl bg-[#060609] border border-white/10 p-6 md:p-8 space-y-5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">Para clientes</span>
          <h3 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white">
            Una sola centralita de mariachis para toda España
          </h3>
          <p className="text-sm text-white/60">
            Escríbenos a cualquier hora por WhatsApp. Un coordinador confirma qué grupo de la red verificada puede
            llegar a tu dirección y en cuánto tiempo. Para serenatas de última hora, la disponibilidad se comprueba
            ciudad por ciudad y hora por hora — nunca vendemos falsas garantías de flota que no existen.
          </p>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li className="flex gap-2"><Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />Un número para toda España: +34 693 693 048</li>
            <li className="flex gap-2"><Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />Precio cerrado antes de confirmar, sin subastas</li>
            <li className="flex gap-2"><Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />Fecha bloqueada con 100 € descontables del total</li>
            <li className="flex gap-2"><Check size={14} className="text-[#ecb613] shrink-0 mt-0.5" />Solo grupos con audio/vídeo y documentación auditados</li>
          </ul>
          <a
            href="https://wa.me/34693693048?text=Hola,%20necesito%20un%20mariachi.%20Ciudad,%20fecha%20y%20hora:%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all"
          >
            <MessageCircle size={14} /> Escribir a la centralita
          </a>
        </div>

        {/* LADO PROVEEDOR / MÚSICO */}
        <div className="rounded-3xl bg-gradient-to-b from-[#13121d] to-[#07070b] border border-[#ecb613]/30 p-6 md:p-8 space-y-5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">Para directores de grupo y músicos</span>
          <h3 className="text-2xl sm:text-3xl font-black font-syne uppercase text-white">
            Recibe bolos ya pagados sin perseguir clientes
          </h3>
          <div className="space-y-3">
            {VALUE_STACK.map((s) => (
              <div key={s.title} className="flex gap-3 p-3 rounded-2xl bg-black/30 border border-white/5">
                <span className="text-[#ecb613] shrink-0">{s.icon}</span>
                <div>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-white/60">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50">
            Alta gratuita. Revisamos audio/vídeo y documentación antes de activar tu grupo en la red. La expansión
            arranca en España y se replica por país o región con landings de captación hacia <code className="text-[#ecb613]">/mariachis/unirse</code>.
          </p>
          <Link
            href="/mariachis/unirse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all"
          >
            <Users size={14} /> Dar de alta mi grupo
          </Link>
        </div>
      </div>

      {/* BARRA DE REALIDAD DEL SECTOR (por qué ganamos la dominancia) */}
      <div className="rounded-3xl bg-[#050508] border border-white/10 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {REALITY_GAPS.map((g) => (
          <div key={g.title} className="space-y-2">
            <span className="text-[#ecb613]">{g.icon}</span>
            <h4 className="text-sm font-bold font-syne text-white">{g.title}</h4>
            <p className="text-xs text-white/60 leading-relaxed">{g.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}