"use client";

import { useState, Suspense, Component, ReactNode, ErrorInfo } from 'react';
import {
  MessageSquare,
  PhoneCall,
  Send,
  Sparkles,
  Music,
  HeartPulse,
  Building2,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import {
  generateWhatsAppDispatchLink,
  CENTRAL_PHONE,
  DISPLAY_PHONE,
  DispatchTemplateType
} from '@/lib/whatsapp/whatsapp-dispatch';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WhatsAppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[EAR OS][WhatsAppDispatch] ErrorBoundary:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#030305] text-white p-6 sm:p-10 flex items-center justify-center">
          <div className="max-w-lg w-full p-6 rounded-3xl bg-[#09090d]/80 border border-red-500/30 backdrop-blur-md space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle size={18} />
              <h2 className="text-sm font-bold font-syne uppercase tracking-wider">
                Error en Centralita WhatsApp
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400">
              {this.state.error?.message ?? 'Se produjo un error inesperado al generar el despacho.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-4 py-2 rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono transition-all"
            >
              Reintentar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function WhatsAppDispatchSkeleton(): ReactNode {
  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 sm:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-3">
          <div className="h-5 w-48 rounded-full bg-white/5 animate-pulse" />
          <div className="h-8 w-80 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-3 w-96 rounded bg-white/5 animate-pulse" />
        </div>
        <div className="h-10 w-40 rounded-xl bg-white/5 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-5">
          <div className="h-4 w-40 rounded bg-white/5 animate-pulse" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
          </div>
          <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
          <div className="h-10 rounded-xl bg-white/5 animate-pulse" />
        </div>
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 space-y-6">
          <div className="h-4 w-56 rounded bg-white/5 animate-pulse" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-14 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 text-zinc-500 font-mono text-xs">
        <Loader2 size={14} className="animate-spin" />
        Cargando Centralita WhatsApp...
      </div>
    </div>
  );
}

function WhatsAppDispatchContent(): ReactNode {
  const [templateType, setTemplateType] = useState<DispatchTemplateType>('solista');
  const [clientName, setClientName] = useState<string>('');
  const [province, setProvince] = useState<string>('Madrid');
  const [eventDate, setEventDate] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number>(350);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatchData = generateWhatsAppDispatchLink({
    type: templateType,
    clientName: clientName || undefined,
    province,
    eventDate: eventDate || undefined,
    totalEur: customPrice
  });

  const handleCopyText = (): void => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(dispatchData.rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 sm:p-10 space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-wider mb-2">
            <Sparkles size={12} />
            Centralita SSOT WhatsApp
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-syne text-white">
            Despacho Central WhatsApp ({DISPLAY_PHONE})
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Plantillas contractuales deterministas para Solista (350 €), Mariachi, VIMUME y Licitaciones B2G.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${CENTRAL_PHONE}`}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2 transition-all"
          >
            <PhoneCall size={14} className="text-[#ecb613]" />
            Llamar Centralita
          </a>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Formulario de Configuración */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md space-y-5 shadow-2xl">
          <h2 className="text-sm font-bold font-syne text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={16} className="text-[#ecb613]" />
            Configurar Plantilla
          </h2>

          {/* Selector de Plantilla */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono text-zinc-400">Tipo de Contrato / Servicio</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setTemplateType('solista'); setCustomPrice(350); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${templateType === 'solista'
                  ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
              >
                <Music size={14} />
                Solista 350 €
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('mariachi'); setCustomPrice(450); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${templateType === 'mariachi'
                  ? 'bg-[#ecb613]/10 border-[#ecb613] text-[#ecb613]'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
              >
                <Sparkles size={14} />
                Mariachi
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('vimume'); setCustomPrice(0); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${templateType === 'vimume'
                  ? 'bg-violet-950/30 border-violet-500 text-violet-400'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
              >
                <HeartPulse size={14} />
                VIMUME 14D
              </button>

              <button
                type="button"
                onClick={() => { setTemplateType('b2g'); setCustomPrice(14250); }}
                className={`p-3 rounded-xl border text-left font-mono text-xs flex items-center gap-2 transition-all ${templateType === 'b2g'
                  ? 'bg-cyan-950/30 border-cyan-500 text-cyan-400'
                  : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
              >
                <Building2 size={14} />
                B2G Licitación
              </button>
            </div>
          </div>

          {/* Campos de Entrada */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Nombre del Cliente / Entidad</label>
              <input
                type="text"
                placeholder="Ej: Carmen Gómez / Ayto. de Toledo"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Provincia</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Fecha del Evento</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
              />
            </div>

            {templateType !== 'vimume' && (
              <div>
                <label className="text-[11px] font-mono text-zinc-400 block mb-1">Importe Total (€)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white focus:border-[#ecb613] focus:outline-none font-mono"
                />
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Vista Previa y Disparo Directo */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md space-y-6 flex flex-col justify-between shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613] flex items-center gap-1.5">
                <ShieldCheck size={14} /> Vista Previa del Mensaje SSOT
              </span>
              <button
                type="button"
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-300 flex items-center gap-1 transition-all"
              >
                {copied ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copiado' : 'Copiar Texto'}
              </button>
            </div>

            <pre className="p-5 rounded-3xl bg-[#09090d]/80 border border-white/10 text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {dispatchData.rawText}
            </pre>
          </div>

          <div className="space-y-3 pt-4 border-t border-white/10">
            <a
              href={dispatchData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold font-mono text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#25D366]/20 transition-all"
            >
              <Send size={18} />
              Abrir y Enviar por WhatsApp (+34 693 693 048)
              <ExternalLink size={14} />
            </a>
            <p className="text-[10px] text-center font-mono text-zinc-500">
              Garantía Price-Lock 100 € Stripe · Split Soberano 80/10/10 · Telemetría Auditoría EAR OS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WhatsAppDispatchPage(): ReactNode {
  return (
    <WhatsAppErrorBoundary>
      <Suspense fallback={<WhatsAppDispatchSkeleton />}>
        <WhatsAppDispatchContent />
      </Suspense>
    </WhatsAppErrorBoundary>
  );
}