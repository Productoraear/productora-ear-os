"use client";

import React, { useState } from 'react';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Phone,
  MessageSquare,
  Sparkles,
  Calendar,
  Users,
  ChevronRight,
  Send,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Bot
} from 'lucide-react';

interface Solicitud {
  id: string;
  idNumber: string;
  novios: string;
  fechaEvento: string;
  fechaSolicitud: string;
  horaSolicitud: string;
  estado: 'ATENDIDA' | 'CONTRATADA' | 'DESCARTADA' | 'NUEVA';
  comensales?: string;
  ultimoMensaje: string;
  telefono?: string;
  presupuestoEstimado?: string;
  lugar?: string;
}

export const ProSolicitudesTab: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<string>('TODAS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [aiTone, setAiTone] = useState<'concierge' | 'urgencia' | 'tecnico'>('concierge');
  const [generatedReply, setGeneratedReply] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  // 10 Solicitudes reales documentadas de la cuenta de Productora EAR
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([
    {
      id: 'sol-1',
      idNumber: '51491563',
      novios: 'Isabel',
      fechaEvento: '17 Jun 2026',
      fechaSolicitud: '21/04/2026',
      horaSolicitud: '13:29',
      estado: 'ATENDIDA',
      ultimoMensaje: 'hola buena tardes, aun esta interesada?',
      telefono: '+34600000001',
      comensales: '100 pax',
      lugar: 'Madrid / Toledo'
    },
    {
      id: 'sol-2',
      idNumber: '46454979',
      novios: 'Noelia Hidalgo Callejón',
      fechaEvento: '28 Ago 2027',
      fechaSolicitud: '08/03/2025',
      horaSolicitud: '11:00',
      estado: 'ATENDIDA',
      comensales: '70-110 comensales',
      ultimoMensaje: '¿En qué momento os viene mejor hablar? O hacer una videollamada.',
      telefono: '+34600000002',
      lugar: 'Finca Toledo'
    },
    {
      id: 'sol-3',
      idNumber: '46543145',
      novios: 'David Mendoza',
      fechaEvento: '03 May 2025',
      fechaSolicitud: '13/03/2025',
      horaSolicitud: '21:28',
      estado: 'ATENDIDA',
      ultimoMensaje: 'Mi nombre es Edwin, David encantado de saludarte',
      telefono: '+34600000003',
      comensales: '120 pax',
      lugar: 'Madrid'
    },
    {
      id: 'sol-4',
      idNumber: '46380021',
      novios: 'Diego Gutiérrez Sagüillo',
      fechaEvento: '04 Oct 2025',
      fechaSolicitud: '03/03/2025',
      horaSolicitud: '13:55',
      estado: 'ATENDIDA',
      ultimoMensaje: 'Genial , donde vives?',
      telefono: '+34600000004',
      comensales: '85 pax',
      lugar: 'Toledo'
    },
    {
      id: 'sol-5',
      idNumber: '46302995',
      novios: 'Alba',
      fechaEvento: '18 Abr 2026',
      fechaSolicitud: '26/02/2025',
      horaSolicitud: '00:40',
      estado: 'ATENDIDA',
      ultimoMensaje: 'Mi número de teléfono es 693 693 048, disponible 24 horas',
      telefono: '+34693693048',
      comensales: '95 pax',
      lugar: 'Madrid'
    },
    {
      id: 'sol-6',
      idNumber: '46179619',
      novios: 'Felipe Borges',
      fechaEvento: '25 Abr 2026',
      fechaSolicitud: '18/02/2025',
      horaSolicitud: '23:20',
      estado: 'ATENDIDA',
      comensales: '70 comensales',
      ultimoMensaje: 'No estuvo muy receptivo al inicio, pendiente de llamada de cierre.',
      telefono: '+34600000006',
      lugar: 'Madrid'
    },
    {
      id: 'sol-7',
      idNumber: '46332651',
      novios: 'Berta',
      fechaEvento: '07 Jun 2025',
      fechaSolicitud: '27/02/2025',
      horaSolicitud: '20:03',
      estado: 'ATENDIDA',
      ultimoMensaje: 'No tenemos la idea de un concierto heavy, más bien una voz con guitarra acústica de gala...',
      telefono: '+34600000007',
      comensales: '60 pax',
      lugar: 'Madrid'
    },
    {
      id: 'sol-8',
      idNumber: '46199193',
      novios: 'Antonia',
      fechaEvento: '09 May 2025',
      fechaSolicitud: '19/02/2025',
      horaSolicitud: '22:52',
      estado: 'ATENDIDA',
      ultimoMensaje: 'Dime cuál es el horario que mejor os viene y agendamos sin compromiso...',
      telefono: '+34600000008',
      comensales: '110 pax',
      lugar: 'Toledo'
    },
    {
      id: 'sol-9',
      idNumber: '46572049',
      novios: 'Lidia Pecci Rosendi',
      fechaEvento: '25 Dic 2025',
      fechaSolicitud: '19/03/2025',
      horaSolicitud: '20:42',
      estado: 'CONTRATADA',
      ultimoMensaje: 'Muchas gracias Edwin, fecha confirmada y bloqueada.',
      telefono: '+34600000009',
      comensales: '140 pax',
      lugar: 'Madrid (Navidad)'
    },
    {
      id: 'sol-10',
      idNumber: '46101365',
      novios: 'Pareja Toledo (Cerrolén)',
      fechaEvento: '24 Feb 2025',
      fechaSolicitud: '19/02/2025',
      horaSolicitud: '09:46',
      estado: 'DESCARTADA',
      ultimoMensaje: 'Fecha ocupada previamente por otro evento S-Class.',
      telefono: '+34600000010',
      comensales: '90 pax',
      lugar: 'Toledo'
    }
  ]);

  // Conteos
  const totalCount = 223;
  const atendidasCount = 208;
  const contratadasCount = 1;
  const descartadasCount = 14;

  const filteredList = solicitudes.filter((s) => {
    const matchFolder =
      activeFolder === 'TODAS' ||
      (activeFolder === 'ATENDIDAS' && s.estado === 'ATENDIDA') ||
      (activeFolder === 'CONTRATADAS' && s.estado === 'CONTRATADA') ||
      (activeFolder === 'DESCARTADAS' && s.estado === 'DESCARTADA');

    const matchSearch =
      searchQuery.trim() === '' ||
      s.novios.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fechaEvento.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ultimoMensaje.toLowerCase().includes(searchQuery.toLowerCase());

    return matchFolder && matchSearch;
  });

  const handleGenerateReply = (item: Solicitud) => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      let reply = '';
      if (aiTone === 'concierge') {
        reply = `Hola ${item.novios}, un placer saludarte. Soy Edwin Agudelo de Productora EAR. Para tu fecha del ${item.fechaEvento}${item.comensales ? ` (${item.comensales})` : ''}, tenemos disponibilidad y nuestro rider acústico Bose F1 812 (< 75 dB SPL) está homologado para garantizar cero problemas de ruido. La tarifa de solista de gala es de 350,00 € con Split 80/10/10. ¿Te viene bien una breve llamada de 5 minutos hoy a las 18:00 para resolver dudas?`;
      } else if (aiTone === 'urgencia') {
        reply = `Hola ${item.novios}, te escribo personalmente porque la fecha del ${item.fechaEvento} es de altísima demanda y solo mantenemos un evento por jornada para asegurar excelencia acústica S-Class. Para congelar la tarifa oficial de 350,00 € y bloquear la fecha, operamos con un depósito protegido de 100,00 € en Stripe (Price-Lock). ¿Cuándo podemos hablar 5 minutos?`;
      } else {
        reply = `Hola ${item.novios}, gracias por tu contacto. Nuestra propuesta para el ${item.fechaEvento} incluye show de 1 hora en directo (2 pases de 30 min), microfonía Shure Beta 87A y sonorización Bose F1 812 (12 W/pax). Además, el 10% del importe se destina a sesiones terapéuticas VIMUME con certificado oficial deducible hasta el 80% en IRPF (Ley 49/2002). Puedes contactarme directo al +34 693 693 048.`;
      }
      setGeneratedReply(reply);
      setIsGeneratingAi(false);
    }, 700);
  };

  const handleStatusChange = (newStatus: 'ATENDIDA' | 'CONTRATADA' | 'DESCARTADA') => {
    if (!selectedSolicitud) return;
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === selectedSolicitud.id ? { ...s, estado: newStatus } : s))
    );
    setSelectedSolicitud((prev) => (prev ? { ...prev, estado: newStatus } : null));
  };

  return (
    <div className="space-y-6 font-sans text-zinc-200">
      {/* 1. Header & Telemetría de Respuesta */}
      <div className="p-6 rounded-3xl bg-[#09090b] border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              CRM DE NOVIOS &bull; BANDEJA DE ENTRADA
            </span>
            <span className="text-xs font-mono text-zinc-500">223 Solicitudes Históricas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-syne text-white uppercase tracking-tight">
            Gestión de Solicitudes &bull; Parejas de Boda
          </h2>
          <p className="text-xs text-zinc-400">
            Filtra, atiende y redacta respuestas con IA local para despachar por WhatsApp en menos de 15 minutos.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Velocidad de Respuesta S-Class</span>
            <span className="text-xs font-mono font-bold text-white">&lt; 15 min recomendada</span>
          </div>
        </div>
      </div>

      {/* 2. Carpetas Reales & Buscador */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFolder('TODAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeFolder === 'TODAS'
                ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Entrada ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFolder('ATENDIDAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeFolder === 'ATENDIDAS'
                ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Atendidas ({atendidasCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFolder('CONTRATADAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeFolder === 'CONTRATADAS'
                ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Contratadas ({contratadasCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFolder('DESCARTADAS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeFolder === 'DESCARTADAS'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            Descartadas ({descartadasCount})
          </button>
        </div>

        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar novios, fecha o texto..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
          />
        </div>
      </div>

      {/* 3. Grid: Lista de Solicitudes a la Izquierda & Detalle/Copiloto a la Derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Lista de Solicitudes (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {filteredList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center text-zinc-500 font-mono text-xs">
              No se encontraron solicitudes en esta carpeta.
            </div>
          ) : (
            filteredList.map((item) => {
              const isSelected = selectedSolicitud?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedSolicitud(item);
                    setGeneratedReply('');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-zinc-900/90 border-[#ecb613] shadow-[0_0_20px_rgba(236,182,19,0.15)]'
                      : 'bg-[#09090b] border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white font-syne truncate">
                        {item.novios}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        #{item.idNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold ${
                          item.estado === 'CONTRATADA'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : item.estado === 'DESCARTADA'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30'
                        }`}
                      >
                        {item.estado}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-1 italic font-sans">
                      &ldquo;{item.ultimoMensaje}&rdquo;
                    </p>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1 text-[#ecb613]">
                        <Calendar className="w-3 h-3" /> {item.fechaEvento}
                      </span>
                      {item.comensales && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> {item.comensales}
                        </span>
                      )}
                      <span>{item.fechaSolicitud} {item.horaSolicitud}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-[#ecb613]' : 'text-zinc-600'}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Panel Detalle & Copiloto IA (5 cols) */}
        <div className="lg:col-span-5">
          {selectedSolicitud ? (
            <div className="p-6 rounded-3xl bg-[#09090b] border border-zinc-800 shadow-2xl space-y-6 sticky top-24">
              <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#ecb613]">Expediente Nupcial</span>
                  <h3 className="text-xl font-bold font-syne text-white">{selectedSolicitud.novios}</h3>
                  <span className="text-xs font-mono text-zinc-500">Solicitud #{selectedSolicitud.idNumber} &bull; {selectedSolicitud.fechaSolicitud}</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange('CONTRATADA')}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono"
                    title="Marcar como Contratada"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange('DESCARTADA')}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono"
                    title="Marcar como Descartada"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Datos del Evento */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block">Fecha Boda</span>
                  <span className="font-bold text-[#ecb613]">{selectedSolicitud.fechaEvento}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block">Invitados</span>
                  <span className="font-bold text-white">{selectedSolicitud.comensales || 'Por definir'}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block">Ubicación</span>
                  <span className="font-bold text-white">{selectedSolicitud.lugar || 'Madrid'}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase block">Tarifa SSOT</span>
                  <span className="font-bold text-emerald-400">350,00 &euro; Base</span>
                </div>
              </div>

              {/* Último Mensaje */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">Última interacción registrada:</span>
                <p className="text-xs text-zinc-300 italic font-sans">&ldquo;{selectedSolicitud.ultimoMensaje}&rdquo;</p>
              </div>

              {/* Copiloto IA de Respuesta Rápida (Ollama 11434) */}
              <div className="space-y-3 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-[#ecb613]" /> Copiloto IA S-Class (Ollama Local)
                  </span>
                  <div className="flex gap-1 text-[10px] font-mono">
                    <button
                      type="button"
                      onClick={() => setAiTone('concierge')}
                      className={`px-2 py-1 rounded ${aiTone === 'concierge' ? 'bg-[#ecb613] text-black font-bold' : 'bg-zinc-900 text-zinc-400'}`}
                    >
                      Concierge
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiTone('urgencia')}
                      className={`px-2 py-1 rounded ${aiTone === 'urgencia' ? 'bg-[#ecb613] text-black font-bold' : 'bg-zinc-900 text-zinc-400'}`}
                    >
                      Urgencia
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiTone('tecnico')}
                      className={`px-2 py-1 rounded ${aiTone === 'tecnico' ? 'bg-[#ecb613] text-black font-bold' : 'bg-zinc-900 text-zinc-400'}`}
                    >
                      Técnico
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateReply(selectedSolicitud)}
                  disabled={isGeneratingAi}
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 border border-zinc-700 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" />
                  {isGeneratingAi ? 'Redactando propuesta a medida...' : 'Generar Respuesta con IA'}
                </button>

                {generatedReply && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <textarea
                      rows={4}
                      value={generatedReply}
                      onChange={(e) => setGeneratedReply(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-xs text-zinc-200 font-sans focus:outline-none focus:border-[#ecb613]"
                    />

                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/34693693048?text=${encodeURIComponent(generatedReply)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      >
                        <Send className="w-3.5 h-3.5" /> Enviar WhatsApp
                      </a>
                      <a
                        href="tel:+34693693048"
                        className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all flex items-center justify-center"
                        title="Llamar"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#09090b] border border-zinc-800 text-center space-y-3">
              <Inbox className="w-8 h-8 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold font-syne text-zinc-400 uppercase">Ninguna Solicitud Seleccionada</h4>
              <p className="text-xs text-zinc-500 font-sans">
                Haz clic sobre cualquiera de las 223 solicitudes de la lista para ver su expediente y redactar una propuesta con IA en 1 clic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
