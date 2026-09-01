'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  Send, 
  Building2, 
  User, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  Zap, 
  Bot, 
  DollarSign, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  FileText,
  Volume2,
  Calendar,
  Lock
} from 'lucide-react';
import { 
  calculateSovereignQuote, 
  BASE_SOLISTA, 
  DEPOSITO_STRIPE, 
  SPLIT_SOBERANO 
} from '@/lib/pricing/sovereign-pricing';
import { CENTRALITA } from '@/lib/phone-constants';

type StakeholderRole = 'INSTITUCIONES' | 'CLIENTES' | 'ARTISTAS' | 'SIMULADOR';

interface ChatMessage {
  id: string;
  sender: 'user' | 'astra';
  text: string;
  roleContext?: StakeholderRole;
  timestamp: string;
  actionButton?: {
    label: string;
    url: string;
  };
}

const PRESET_QUERIES: Record<StakeholderRole, { label: string; query: string; icon: any }[]> = {
  INSTITUCIONES: [
    { 
      label: '🏛️ Artistas Diáspora Sin Coste Adicional', 
      query: '¿Cómo funciona el apoyo y cesión de equipos para artistas de nuestra comunidad sin coste adicional al contratarlos?',
      icon: Award
    },
    { 
      label: '📜 Contrato Menor Art. 118 LCSP', 
      query: '¿Cómo se tramita la contratación de la gala y rider para FITUR bajo el Art. 118 LCSP sin concurso público?',
      icon: FileText
    },
    { 
      label: '🔊 Rider Acústico Bose F1 & Límites SPL', 
      query: '¿Qué garantía acústica ofrece Productora EAR para recepciones diplomáticas y qué decibelios se homologan?',
      icon: Volume2
    },
    { 
      label: '🇨🇴 Aval del Consulado de Colombia 2014', 
      query: '¿Cuál es la acreditación histórica que certifica la solvencia protocolar de Edwin Agudelo ante cancillerías?',
      icon: ShieldCheck
    }
  ],
  CLIENTES: [
    { 
      label: '💰 Tarifa Solista Edwin Agudelo', 
      query: '¿Cuál es la tarifa base del solista Edwin Agudelo y qué incluye el repertorio?',
      icon: DollarSign
    },
    { 
      label: '🔒 Depósito Stripe 100 € & Price-Lock', 
      query: '¿Cómo funciona la reserva de fecha con depósito Stripe y firma criptográfica Price-Lock?',
      icon: Lock
    },
    { 
      label: '🚗 Cálculo de Desplazamiento desde Méntrida', 
      query: '¿Cómo se calculan los costes de desplazamiento y suplementos hoteleros según el kilometraje?',
      icon: Zap
    },
    { 
      label: '🎶 Repertorio para Bodas y Fiestas', 
      query: '¿Qué formatos existen (Solista, Trío, Quinteto) y cómo se personaliza el repertorio de rancheras y lírica?',
      icon: Sparkles
    }
  ],
  ARTISTAS: [
    { 
      label: '⚖️ Split Soberano Inmutable 80/10/10', 
      query: '¿Cómo se distribuyen los ingresos del evento según el Split Soberano de Productora EAR?',
      icon: DollarSign
    },
    { 
      label: '🎙️ Rider Técnico Homologado (Shure/Bose)', 
      query: '¿Cuáles son los requisitos de microfonía y sonido para formar parte del Roster Oficial S-Class?',
      icon: Volume2
    },
    { 
      label: '🧠 Impacto Clínico VIMUME (10%)', 
      query: '¿A qué se destina el 10% del split soberano y cómo apoya a residencias de mayores con estimulación musical?',
      icon: Brain
    }
  ],
  SIMULADOR: [
    { 
      label: '⚡ Simular Madrid Centro (Solista)', 
      query: 'Cotizar Solista Edwin Agudelo para Madrid Centro (55 km desde Méntrida, 150 invitados).',
      icon: Zap
    },
    { 
      label: '⚡ Simular Toledo (Trío Mariachi)', 
      query: 'Cotizar Trío de Mariachis para Toledo (60 km, sonido Bose F1 incluido).',
      icon: Zap
    },
    { 
      label: '⚡ Simular B2G FITUR (Expediente Completo)', 
      query: 'Desglosar el expediente administrativo de 14.250 € para un pabellón institucional de FITUR 2026.',
      icon: FileText
    }
  ]
};

export default function AdminOraculoPage() {
  const [activeRole, setActiveRole] = useState<StakeholderRole>('INSTITUCIONES');
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'astra',
      roleContext: 'INSTITUCIONES',
      text: `🏛️ **ORÁCULO NEURAL ASTRA — MODO GOBERNANZA ACTIVO**

Bienvenido al centro de inteligencia operativa y estratégica de Productora EAR. 

Estoy sincronizado con el SSOT de tarifas, protocolos diplomáticos FITUR 2026, la memoria histórica de Edwin Agudelo y los expedientes Art. 118 LCSP. 

Selecciona el perfil de consulta (Instituciones, Clientes, Artistas o Simulador) o escribe directamente cualquier requerimiento técnico o de cotización.`,
      timestamp: 'En línea'
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const generateAstraResponse = (query: string, role: StakeholderRole): { text: string; actionButton?: { label: string; url: string } } => {
    const q = query.toLowerCase();

    // 1. INSTITUCIONES / DIPLOMACIA / APOYO ARTISTAS SIN COSTE ADICIONAL
    if (q.includes('sin coste') || q.includes('apoyo') || q.includes('diáspora') || q.includes('comunidad') || (q.includes('artista') && role === 'INSTITUCIONES')) {
      return {
        text: `🏛️ **CLÁUSULA DE RESPALDO Y DIGNIFICACIÓN A ARTISTAS DE LA DIÁSPORA (SIN COSTE ADICIONAL)**

**Resumen Operativo:**
Históricamente, los consulados y embajadas han deseado apoyar a sus artistas locales y en la diáspora, pero se han visto frenados por la falta de partidas presupuestarias para producción técnica y sonido.

**La Solución Soberana EAR:**
Al contratar a Productora EAR para la producción de su gala en FITUR o recepción oficial bajo el régimen de Contrato Menor (14.250 € + IVA):
1. **Infraestructura de Gala Sin Coste Extra:** Ponemos a disposición de hasta 3 artistas o agrupaciones emergentes de su comunidad la infraestructura técnica completa (Columnas Bose F1 12 W/pax, microfonía Shure Axient, iluminación de conservatorio).
2. **Mentoría Artística de Edwin Agudelo:** Ensayos de dicción, repertorio protocolar y etiqueta de Estado con el tenor lírico Edwin Agudelo (+34 años de tablas), resolviendo la brecha de preparación escénica.
3. **Altas Laborales & Póliza de 1M€:** Cobertura de Seguridad Social en Régimen de Artistas y Responsabilidad Civil para todos los intervinientes.

El cónsul o embajador cumple con su delegación y simultáneamente se convierte en mecenas y protector de sus talentos sin desembolsar un solo euro adicional.`,
        actionButton: {
          label: 'Descargar Dossier Oficial B2G (PDF)',
          url: '/dossiers/dossier-embajadores-culturales-fitur-2026.pdf'
        }
      };
    }

    // 2. CONTRATO MENOR ART 118 LCSP
    if (q.includes('lcsp') || q.includes('118') || q.includes('contrato menor') || q.includes('concurso')) {
      return {
        text: `📜 **RÉGIMEN DE CONTRATACIÓN PÚBLICA DIRECTA (ART. 118 LCSP)**

- **Marco Legal:** Ley 9/2017 de Contratos del Sector Público, Art. 118 (Contrato Menor de Servicios Culturales).
- **Importe Base:** 14.250,00 € + IVA (21% = 2.992,50 €) -> Total: 17.242,50 €.
- **Ajuste Preventivo:** Calculado al 95% del umbral de 15.000 € para garantizar adjudicación directa inmediata sin concurso público, sin plazos de alegaciones y sin riesgo de impugnación.
- **Facturación Oficial:** Tramitación a través del Punto General de Entrada de Facturas Electrónicas (**FACe**) con códigos DIR3 de la delegación.`,
        actionButton: {
          label: 'Ver Directorio 217 Entidades FITUR',
          url: '/admin/flota'
        }
      };
    }

    // 3. ACREDITACIÓN HISTÓRICA DEL CONSULADO DE COLOMBIA
    if (q.includes('colombia') || q.includes('2014') || q.includes('acreditacion') || q.includes('latina')) {
      return {
        text: `🇨🇴 **ACREDITACIÓN DIPLOMÁTICA HISTÓRICA (DOCUMENTO SSOT)**

- **Emisor Oficial:** Consulado General Central de Colombia en Madrid.
- **Firmante:** María Margarita Salas Mejía, Cónsul General Central.
- **Evento de Referencia:** Encuentro Cultural e Inauguración Consular en el histórico Teatro de La Latina (Madrid), ante la presencia de la Señora Ministra de Relaciones Exteriores de Colombia, María Ángela Holguín Cuéllar.
- **Testimonio:** Oficio formal de reconocimiento a Edwin Agudelo y sus Mariachis por su excelencia lírica y protocolar ante el cuerpo diplomático de Estado.
- **Garantía para Nuevas Delegaciones:** Demuestra solvencia ininterrumpida de más de una década en recepciones diplomáticas y ferias internacionales (FITUR 2017, 2018, 2019, 2020, 2022).`
      };
    }

    // 4. PRECIOS Y TARIFAS B2C CLIENTES
    if (q.includes('solista') || q.includes('tarifa') || q.includes('cuanto cuesta') || q.includes('precio') || q.includes('presupuesto')) {
      return {
        text: `💰 **MATRIZ DE TARIFAS S-CLASS (SSOT INMUTABLE)**

- **Solista de Autor (Edwin Agudelo):** Tarifa Base de **350,00 €** (incluye microfonía Shure Beta 87A y sonido autónomo Bose S1 Pro).
- **Formatos de Escenario:**
  - Solista Lírico: 350 €
  - Trío Acústico: 650 € (+300 €)
  - Quinteto Mariachi de Gala: 950 € (+600 €)
- **Logística Territorial:** 1,50 €/km desde el Hub Central en Méntrida (Toledo) a partir del km 50.
- **Suplemento Hotelero:** +120 € si la finalización es >= 3:00 AM o la distancia supera los 200 km.
- **Reserva de Fecha:** Depósito de 100,00 € vía Stripe con firma criptográfica Price-Lock SHA-256 válida de 24h a 72h.`,
        actionButton: {
          label: 'Abrir Cotizador Bespoke',
          url: '/cotizador'
        }
      };
    }

    // 5. SPLIT SOBERANO 80/10/10
    if (q.includes('split') || q.includes('80/10/10') || q.includes('porcentaje') || q.includes('liquidacion')) {
      return {
        text: `⚖️ **DIVISIÓN SOBERANA INMUTABLE (80 / 10 / 10)**

Todo euro facturado por Productora EAR se liquida bajo la regla algorítmica inviolable:
- **80% Artistas:** Retribución directa y digna a los músicos ejecutantes.
- **10% Plataforma EAR OS:** Infraestructura técnica, logística, hosting y auditoría legal.
- **10% VIMUME:** Financiación directa de sesiones de estimulación neurocognitiva 40Hz para centros de mayores y residencias de la tercera edad (SROI auditado de 4.85x).`
      };
    }

    // 6. RIDER ACÚSTICO BOSE F1 & DECIBELIOS
    if (q.includes('bose') || q.includes('rider') || q.includes('sonido') || q.includes('decibelios') || q.includes('potencia')) {
      return {
        text: `🔊 **RIDER TÉCNICO Y SONOMETRÍA HOMOLOGADA**

- **Presión Acústica:** Calibración a **12 W/pax** mediante sistemas de dispersión vertical Bose F1 Model 812 (1000W bi-amplificados).
- **Límite de Confort Diplomático y B2G:** Restricción estricta **< 75 dB SPL** en salas de recepción y residencias VIMUME, garantizando conversación nítida sin fatiga auditiva.
- **Microfonía Inalámbrica:** Sistemas Shure Axient Digital y cápsulas Shure Beta 87A de grado broadcast con escaneo RF en tiempo real.`
      };
    }

    // Default Fallback inteligente
    return {
      text: `🧠 **ASTRA REASONING CORE:**

He analizado tu consulta en el marco del contexto **${role}**:
"${query}"

- **Parámetros Validados:** Conforme al protocolo de Productora EAR, todos los servicios operan bajo precio fijado, riders Bose/Shure homologados y póliza de Responsabilidad Civil de 1.000.000 €.
- **Contacto Operativo Centralita:** Si requieres una confirmación técnica inmediata o reunión con Edwin Agudelo, la centralita oficial de retención está disponible en el **${CENTRALITA}** o a través de WhatsApp corporativo.`,
      actionButton: {
        label: 'Contactar por WhatsApp',
        url: `https://wa.me/34693693048?text=${encodeURIComponent('Hola Productora EAR, realizo una consulta a través del Oráculo ASTRA: ' + query)}`
      }
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAstraResponse(text, activeRole);
      const astraMsg: ChatMessage = {
        id: `astra-${Date.now()}`,
        sender: 'astra',
        roleContext: activeRole,
        text: response.text,
        actionButton: response.actionButton,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, astraMsg]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* 1. CABECERA ORÁCULO NEURAL ASTRA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d0d14] via-[#141424] to-[#0d0d14] border border-[#ecb613]/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Brain size={14} className="animate-pulse text-[#ecb613]" />
              <span>ORÁCULO NEURAL ASTRA · MOTOR DE INTELIGENCIA MULTI-STAKEHOLDER</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight font-syne">
              Gemelo Neural <span className="text-[#ecb613]">Astra</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-light mt-1">
              Centralita conversacional, simulador de tarifas SSOT y generador de respuestas técnicas para Administradores, Consulados, Clientes de Boda y Artistas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-zinc-300 font-bold">Astra v4.1 Online</span>
            </div>
          </div>
        </div>

        {/* 2. SELECTOR DE STAKEHOLDER (PESTAÑAS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 relative z-10">
          <button
            onClick={() => setActiveRole('INSTITUCIONES')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRole === 'INSTITUCIONES'
                ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
              <Building2 size={15} className={activeRole === 'INSTITUCIONES' ? 'text-[#ecb613]' : 'text-zinc-500'} />
              <span>Instituciones B2G</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1">
              FITUR, Consulados & Art. 118
            </p>
          </button>

          <button
            onClick={() => setActiveRole('CLIENTES')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRole === 'CLIENTES'
                ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
              <User size={15} className={activeRole === 'CLIENTES' ? 'text-[#ecb613]' : 'text-zinc-500'} />
              <span>Clientes & Bodas</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1">
              Tarifas Edwin & Depósito 100€
            </p>
          </button>

          <button
            onClick={() => setActiveRole('ARTISTAS')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRole === 'ARTISTAS'
                ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
              <Users size={15} className={activeRole === 'ARTISTAS' ? 'text-[#ecb613]' : 'text-zinc-500'} />
              <span>Artistas Roster</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1">
              Split 80/10/10 & Mentoría
            </p>
          </button>

          <button
            onClick={() => setActiveRole('SIMULADOR')}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              activeRole === 'SIMULADOR'
                ? 'bg-[#ecb613]/15 border-[#ecb613] text-white shadow-lg'
                : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase">
              <Zap size={15} className={activeRole === 'SIMULADOR' ? 'text-[#ecb613]' : 'text-zinc-500'} />
              <span>Simulador Tarifas</span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 line-clamp-1">
              Desplazamiento & Logística
            </p>
          </button>
        </div>
      </div>

      {/* 3. CONTENEDOR PRINCIPAL: CHAT CONVERSACIONAL Y ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (1 col): Accesos Tácticos Preconfigurados */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#09090f] border border-white/10 space-y-3 shadow-xl">
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-2">
              <Sparkles size={14} className="text-[#ecb613]" />
              <span>Consultas Frecuentes ({activeRole})</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-mono leading-relaxed">
              Haz clic sobre cualquier directiva para que el Oráculo emita el argumento oficial y la base legal correspondiente.
            </p>

            <div className="space-y-2 pt-2">
              {PRESET_QUERIES[activeRole].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(preset.query)}
                  className="w-full text-left p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#ecb613]/40 text-xs font-mono text-zinc-300 hover:text-white transition-all space-y-1 group cursor-pointer"
                >
                  <div className="font-bold text-white group-hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
                    <preset.icon size={13} className="text-[#ecb613] shrink-0" />
                    <span className="line-clamp-1">{preset.label}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 line-clamp-2">
                    {preset.query}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tarjeta de Gobernanza y Constantes Inmutables */}
          <div className="p-5 rounded-3xl bg-[#09090f] border border-white/10 text-xs font-mono space-y-3">
            <div className="text-zinc-400 uppercase text-[10px] tracking-wider font-bold">
              Reglas Inmutables de Negocio (SSOT)
            </div>
            <div className="space-y-2 text-[11px] text-zinc-300">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">Tarifa Solista Edwin:</span>
                <span className="text-[#ecb613] font-bold">350,00 €</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">Logística km:</span>
                <span className="text-white font-bold">1,50 €/km (&gt;50km)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">Split Soberano:</span>
                <span className="text-emerald-400 font-bold">80% / 10% / 10%</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-zinc-500">Techo LCSP B2G:</span>
                <span className="text-amber-400 font-bold">14.250,00 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Depósito Stripe:</span>
                <span className="text-sky-400 font-bold">100,00 €</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (2 cols): Consola del Chat Conversacional */}
        <div className="lg:col-span-2 flex flex-col h-[650px] bg-[#09090f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Barra superior de la consola */}
          <div className="p-4 border-b border-white/10 bg-[#06060a] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#ecb613]/20 text-[#ecb613]">
                <Bot size={16} />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white">Canal Neural ASTRA</div>
                <div className="text-[10px] font-mono text-zinc-400">Contexto: {activeRole}</div>
              </div>
            </div>
            <button
              onClick={() => setMessages([messages[0]])}
              className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Reiniciar Conversación
            </button>
          </div>

          {/* Mensajes del Chat */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-mono text-xs no-scrollbar">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="text-[10px] text-zinc-500 px-1">
                    {isUser ? 'Tú (Operador)' : 'Gemelo Neural Astra'} · {msg.timestamp}
                  </div>

                  <div
                    className={`max-w-[88%] p-4 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-lg relative group ${
                      isUser
                        ? 'bg-[#ecb613] text-black font-semibold rounded-tr-none'
                        : 'bg-[#0f0f18] text-zinc-200 border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Botón de Copiar Respuesta */}
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copiar texto"
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      </button>
                    )}

                    {/* Botón de Acción Especial si existe */}
                    {msg.actionButton && (
                      <div className="pt-3 mt-3 border-t border-white/10">
                        <a
                          href={msg.actionButton.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ecb613] hover:bg-white text-black font-bold text-[11px] transition-colors"
                        >
                          <span>{msg.actionButton.label}</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono py-2">
                <div className="w-2 h-2 rounded-full bg-[#ecb613] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#ecb613] animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-[#ecb613] animate-bounce delay-200" />
                <span>Astra procesando conocimiento forense...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Caja de Entrada de Texto */}
          <div className="p-3 sm:p-4 border-t border-white/10 bg-[#06060a]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Pregunta a Astra sobre ${activeRole.toLowerCase()} (ej. tarifas, contrato menor, rider, apoyo artistas)...`}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 bg-[#0f0f18] border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613]"
              />
              <button
                type="submit"
                className="p-3 rounded-2xl bg-[#ecb613] hover:bg-white text-black font-bold transition-all shrink-0 cursor-pointer shadow-lg"
                title="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
