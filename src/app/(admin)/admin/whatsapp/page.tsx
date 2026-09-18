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
  Radio,
  TrendingUp,
  CreditCard,
  Lock,
  Sparkles,
  ExternalLink
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

export default function CentralitaWhatsAppCatminPage() {
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
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* ===================================================================== */}
      {/* 1. HEADER DE PÁGINA CATMÍN                                            */}
      {/* ===================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a24] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Admin</span>
            <span>/</span>
            <span>Ventas & Conversión</span>
            <span>/</span>
            <span className="text-[#ecb613] font-bold">Centralita WhatsApp</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-syne uppercase mt-1">
            Despacho WhatsApp Soberano
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-400">
            <Phone className="w-3.5 h-3.5" />
            <span>{CENTRALITA.display}</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. CATMÍN ROW 1: 4 TARJETAS KPI DE MENSAJERÍA                         */}
      {/* ===================================================================== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        
        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Canal Centralita</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-xl font-bold font-mono text-white">{CENTRALITA.display}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Línea directa oficial España</p>
          <div className="mt-2 flex items-center text-xs font-mono text-emerald-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            WhatsApp Business API Ready
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-[#ecb613]/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Plantillas Canónicas</span>
            <div className="w-8 h-8 rounded-lg bg-[#ecb613]/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#ecb613]" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">4 Flujos</div>
          <p className="text-[11px] text-zinc-400 mt-1">Activación, seguimiento, cierre, B2G</p>
          <div className="mt-2 flex items-center text-xs font-mono text-[#ecb613] font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Alta Conversión Verificada
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Depósito Directo</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">100,00 €</div>
          <p className="text-[11px] text-zinc-400 mt-1">Price-Lock SHA-256 en 1 clic</p>
          <div className="mt-2 flex items-center text-xs font-mono text-cyan-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            Cierre Inmediato 48h
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a24] bg-[#050508] p-5 shadow-sm hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium text-zinc-400">Tiempo de Respuesta</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 3 min</div>
          <p className="text-[11px] text-zinc-400 mt-1">Protocolo de atención inmediata</p>
          <div className="mt-2 flex items-center text-xs font-mono text-purple-400 font-medium">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            92% Retención de Leads
          </div>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* 3. GENERADOR DE MENSAJES CATMÍN (DOS COLUMNAS)                         */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Columna Izquierda: Configuración (Span 5) */}
        <div className="lg:col-span-5 rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-5 shadow-sm">
          <div>
            <h2 className="text-base font-bold font-syne text-white uppercase">
              Configuración del Mensaje
            </h2>
            <p className="text-xs text-zinc-500">Selecciona el perfil de contacto y la plantilla</p>
          </div>

          {/* Tipo de Destinatario */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              1. Tipo de Destinatario
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'proveedor', label: 'Proveedor', icon: <Building2 size={13} /> },
                { id: 'finca', label: 'Finca / Espacio', icon: <Building2 size={13} /> },
                { id: 'artista', label: 'Artista', icon: <Mic2 size={13} /> },
                { id: 'cliente', label: 'Novios / Cliente', icon: <Users size={13} /> }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDestinatario(d.id as Destinatario)}
                  className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all border ${
                    destinatario === d.id
                      ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-md shadow-[#ecb613]/20'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campos de Entrada */}
          <div className="space-y-3 pt-2 border-t border-zinc-900">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                2. Nombre del Contacto
              </label>
              <input
                type="text"
                placeholder="Ej. Laura / Finca El Tomillar"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-9 px-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                3. Teléfono Móvil Destino
              </label>
              <input
                type="text"
                placeholder="Ej. 612 345 678 (o deja en blanco para abrir en Centralita)"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full h-9 px-3 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
              />
            </div>
          </div>

          {/* Selector de Plantilla */}
          <div className="space-y-2 pt-2 border-t border-zinc-900">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              4. Plantilla Comercial
            </label>
            <div className="space-y-1.5">
              {PLANTILLAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPlantilla(p.id)}
                  className={`w-full p-2.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all border ${
                    plantilla === p.id
                      ? 'bg-zinc-900 border-[#ecb613]/50 text-white font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={plantilla === p.id ? 'text-[#ecb613]' : 'text-zinc-500'}>
                      {p.icono}
                    </span>
                    <span>{p.label}</span>
                  </div>
                  {plantilla === p.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ecb613]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa y Despacho (Span 7) */}
        <div className="lg:col-span-7 rounded-2xl border border-[#1a1a24] bg-[#050508] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <div>
              <h2 className="text-base font-bold font-syne text-white uppercase">
                Vista Previa del Mensaje
              </h2>
              <p className="text-xs text-zinc-500">Se enviará a través de la API oficial de WhatsApp Web/App</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LISTO
            </span>
          </div>

          {/* Burbuja Estilo WhatsApp */}
          <div className="p-5 rounded-2xl bg-[#0a1410] border border-emerald-500/20 relative shadow-inner">
            <div className="text-[11px] font-mono text-emerald-400 font-bold mb-2 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Productora EAR // Centralita Oficial</span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap font-sans">
              {mensajeFinal}
            </p>
            <div className="text-[10px] font-mono text-zinc-500 text-right mt-3">
              Hoy · Enviado desde EAR OS
            </div>
          </div>

          {/* Botones de Despacho */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAbrir}
              className="flex-1 py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Abrir en WhatsApp Ahora</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3.5 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              {copiado ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
              <span>{copiado ? '¡Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}