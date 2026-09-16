'use client';

import React, { useState, useMemo } from 'react';
import { CENTRALITA } from '@/lib/phone-constants';
import {
  MessageCircle,
  Send,
  Phone,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Mic2,
  Radio
} from 'lucide-react';

type Destinatario = 'proveedor' | 'finca' | 'artista' | 'cliente';
type Plantilla = 'activacion' | 'seguimiento' | 'cierre' | 'licitacion';

interface PlantillaConfig {
  id: Plantilla;
  label: string;
  icono: React.ReactNode;
  texto: string;
}

const PLANTILLAS: PlantillaConfig[] = [
  {
    id: 'activacion',
    label: 'Activación de Ficha',
    icono: <Building2 size={15} />,
    texto:
      'Hola {NOMBRE}, te escribo de Productora EAR (Centralita Oficial). Hemos preparado tu ficha verificada en nuestro sistema y queremos confirmar tus datos para activar tu perfil gratuito en el directorio nacional. ¿Te viene bien ahora una llamada rápida de 2 minutos?',
  },
  {
    id: 'seguimiento',
    label: 'Seguimiento Comercial',
    icono: <Zap size={15} />,
    texto:
      'Hola {NOMBRE}, ¿cómo va todo? Te escribo de nuevo desde Productora EAR para dar seguimiento a la propuesta que te enviamos. Podemos ajustar condiciones y cerrar el servicio con un depósito blindado de 100 €. ¿Lo revisamos juntos?',
  },
  {
    id: 'cierre',
    label: 'Cierre con Depósito',
    icono: <ShieldCheck size={15} />,
    texto:
      'Hola {NOMBRE}, confirmamos disponibilidad para tu fecha. Para bloquear el servicio solo necesitamos el depósito de 100 € (Price-Lock SHA-256, reembolsable según condiciones). El resto se liquida el día del evento. Te envío el enlace de pago seguro ahora mismo.',
  },
  {
    id: 'licitacion',
    label: 'Licitación B2G',
    icono: <Radio size={15} />,
    texto:
      'Hola {NOMBRE}, desde Productora EAR (departamento B2G) queremos informarte de que podemos presentarnos a vuestra licitación menor conforme al Art. 118 LCSP. Nuestro ajuste preventivo garantiza el límite legal de 14.250 € y ecualización < 75 dB SPL. ¿Coordinamos la documentación?',
  },
];

export default function CentralitaWhatsAppPage() {
  const [destinatario, setDestinatario] = useState<Destinatario>('proveedor');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [plantilla, setPlantilla] = useState<Plantilla>('activacion');
  const [copiado, setCopiado] = useState(false);

  const plantillaActiva = PLANTILLAS.find((p) => p.id === plantilla)!;

  const telefonoLimpio = useMemo(() => telefono.replace(/\D/g, ''), [telefono]);

  const mensajeFinal = useMemo(
    () => plantillaActiva.texto.replace(/\{NOMBRE\}/g, nombre.trim() || 'equipo'),
    [plantillaActiva, nombre]
  );

  const waUrl = useMemo(() => {
    // Si hay teléfono destino, se abre el chat directo a ese contacto.
    // Si no, la conversación se abre contra la Centralita Soberana.
    const destino = telefonoLimpio.length >= 9 ? telefonoLimpio : CENTRALITA.raw;
    return `https://wa.me/${destino}?text=${encodeURIComponent(mensajeFinal)}`;
  }, [telefonoLimpio, mensajeFinal]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mensajeFinal);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* clipboard no disponible */
    }
  };

  const handleAbrir = () => {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white pb-24 font-sans">
      <header className="border-b border-white/10 bg-[#030305]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-[#00E5FF]" size={20} />
            <span className="font-bold text-sm tracking-widest uppercase">
              Centralita <span className="text-[#00E5FF]">WhatsApp</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Phone size={13} className="text-[#00E5FF]" />
            <span>{CENTRALITA.display}</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-10">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Despacho de WhatsApp <span className="text-[#00E5FF]">Soberano</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
            Consola de mensajería de 1 clic para proveedores, fincas, artistas y clientes.
            Los mensajes se generan sobre la Centralita Oficial{' '}
            <span className="font-mono text-[#00E5FF]">{CENTRALITA.display}</span> con plantillas
            de activación, seguimiento, cierre y licitación B2G.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CONFIG PANEL */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest font-bold mb-5">
                Destinatario
              </h2>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {(
                  [
                    { id: 'proveedor', label: 'Proveedor', icon: <Building2 size={14} /> },
                    { id: 'finca', label: 'Finca', icon: <Building2 size={14} /> },
                    { id: 'artista', label: 'Artista', icon: <Mic2 size={14} /> },
                    { id: 'cliente', label: 'Cliente', icon: <Users size={14} /> },
                  ] as { id: Destinatario; label: string; icon: React.ReactNode }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDestinatario(d.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      destinatario === d.id
                        ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-white'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/25'
                    }`}
                  >
                    {d.icon}
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400">Nombre del contacto</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Finca Los Olivos / Antonio"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400">
                    Teléfono destino (opcional · si se omite, abre en la Centralita)
                  </label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej. 600 123 456"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#00E5FF] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#050507] border border-white/10 rounded-2xl p-6">
              <h2 className="text-xs font-mono text-[#00E5FF] uppercase tracking-widest font-bold mb-5">
                Plantilla Operativa
              </h2>
              <div className="space-y-2">
                {PLANTILLAS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlantilla(p.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      plantilla === p.id
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF]/60 text-white'
                        : 'bg-black/30 border-white/10 text-zinc-400 hover:border-white/25'
                    }`}
                  >
                    <span className={plantilla === p.id ? 'text-[#00E5FF]' : 'text-zinc-500'}>
                      {p.icono}
                    </span>
                    <span className="text-sm font-bold">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PREVIEW PANEL */}
          <div className="lg:col-span-7">
            <div className="bg-[#050507] border border-[#00E5FF]/25 rounded-2xl p-6 sm:p-8 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                  Vista previa del mensaje
                </span>
                <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/30 px-2 py-0.5 rounded-full uppercase">
                  {destinatario}
                </span>
              </div>

              <div className="bg-black/60 border border-white/10 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center shrink-0">
                    <MessageCircle size={16} className="text-[#00E5FF]" />
                  </div>
                  <div className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {mensajeFinal}
                  </div>
                </div>
              </div>

              <div className="bg-[#050507] rounded-xl p-4 mb-6 border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Enrutado a:</span>
                <span className="text-[#00E5FF]">
                  {telefonoLimpio.length >= 9 ? `+${telefonoLimpio}` : CENTRALITA.display}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAbrir}
                  className="flex items-center justify-center gap-2 bg-[#00E5FF] hover:opacity-90 text-black font-extrabold text-sm py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send size={16} /> Abrir en WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 font-bold text-sm py-3.5 rounded-xl transition-colors"
                >
                  {copiado ? <Check size={16} className="text-[#00E5FF]" /> : <Copy size={16} />}
                  {copiado ? 'Copiado' : 'Copiar texto'}
                </button>
              </div>

              <p className="mt-4 text-[11px] text-zinc-500 font-mono text-center">
                Apertura en 1 clic · encodeURIComponent · Centralita {CENTRALITA.raw}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}