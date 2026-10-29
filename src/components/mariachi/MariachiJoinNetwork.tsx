"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Globe2, CheckCircle2, ArrowRight, Send, Sparkles, Award, Check,
  Lock, Music, Users, Zap, TrendingUp, AlertCircle, BadgeCheck, Wallet,
  CreditCard, MessageCircle, PhoneCall,
} from 'lucide-react';
import { MARIACHI_FORMATS } from '@/lib/mariachi/mariachi-formats';
import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import { submitMariachiNetworkApplication } from '@/app/actions/mariachiNetworkActions';

type FormationId = 'solista' | 'trio' | 'cuarteto' | 'gala' | 'monumental' | 'otros';

interface FormState {
  groupName: string;
  leaderName: string;
  phone: string;
  province: string;
  city: string;
  formation: FormationId;
  repertoireNote: string;
}

type SubmitStatus = 'idle' | 'sending' | 'done' | 'error';

const FORMATION_OPTIONS: readonly { id: FormationId; label: string }[] = Object.freeze([
  { id: 'solista', label: 'Solista (1 músico)' },
  { id: 'trio', label: 'Trío (3 músicos)' },
  { id: 'cuarteto', label: 'Cuarteto (4 músicos)' },
  { id: 'gala', label: 'Formación de gala (6 músicos)' },
  { id: 'monumental', label: 'Monumental (8 músicos)' },
  { id: 'otros', label: 'Otra formación' },
]);

const COMPARISON_ROWS: readonly {
  label: string;
  traditional: string;
  sovereign: string;
  critical: boolean;
}[] = Object.freeze([
  {
    label: 'Cuota fija',
    traditional: '79 € el primer mes y 208–250 €/mes después, cierre o no cierre.',
    sovereign: '0 € fijos. Ni alta, ni mensualidad, ni permanencia.',
    critical: true,
  },
  {
    label: 'Coste por contacto',
    traditional: '4 € por lead aceptado en el plan gratuito.',
    sovereign: '0 € por lead. No vendemos atención: vendemos reservas cerradas.',
    critical: true,
  },
  {
    label: 'Cierre de la fecha',
    traditional: 'Formulario y espera. Nadie bloquea el calendario.',
    sovereign: `Depósito de ${DEPOSITO_STRIPE_EUR} € Price-Lock y bloqueo atómico de fecha.`,
    critical: true,
  },
  {
    label: 'Tiempo de respuesta',
    traditional: 'Promesa de «hasta 24 horas» y presupuestos a ciegas.',
    sovereign: 'Cotización con precio cerrado en 60 segundos.',
    critical: false,
  },
  {
    label: 'Cobro al cliente',
    traditional: 'Sin pasarela: el grupo persigue el pago tras el bolo.',
    sovereign: 'Cobro en Stripe antes del evento. El depósito se descuenta íntegro.',
    critical: true,
  },
  {
    label: 'Reparto económico',
    traditional: 'La cuota se paga aunque no entre ninguna actuación.',
    sovereign: `${Math.round(SPLIT_SOBERANO.artista * 100)} % neto al artista; ${Math.round(SPLIT_SOBERANO.earOs * 100)} % de infraestructura solo sobre bolo cobrado.`,
    critical: true,
  },
  {
    label: 'Rider acústico',
    traditional: 'Sin ficha técnica ni control de decibelios.',
    sovereign: 'Rider adaptado al límite del recinto (Ley 37/2003) y medición in situ.',
    critical: false,
  },
  {
    label: 'Visibilidad',
    traditional: 'Orden de resultados según el plan que pagas.',
    sovereign: 'Perfil verificado por auditoría real de audio, vídeo y documentación.',
    critical: false,
  },
  {
    label: 'Plantones y cancelaciones',
    traditional: 'Riesgo alto: sin fianza no hay compromiso.',
    sovereign: 'Depósito deducible = compromiso mutuo. Cero mirones.',
    critical: true,
  },
]);

const FLOW_STEPS: readonly {
  title: string;
  text: string;
  icon: 'quote' | 'lock' | 'calendar' | 'wallet';
}[] = Object.freeze([
  {
    title: '1 · El cliente cotiza',
    text: 'Elige formato, dirección y hora. El motor SSOT devuelve precio cerrado con logística y rider en 60 segundos.',
    icon: 'quote',
  },
  {
    title: '2 · Deposita 100 €',
    text: 'Stripe Price-Lock con hash SHA-256. El importe es 100 % deducible del total del evento.',
    icon: 'lock',
  },
  {
    title: '3 · La fecha se bloquea',
    text: 'El lock atómico reserva el día. La centralita asigna la formación verificada de tu provincia.',
    icon: 'calendar',
  },
  {
    title: '4 · Cobras tu 80 %',
    text: 'Liquidación del Split Soberano sobre base imponible. El 10 % restante sostiene infraestructura y obra social.',
    icon: 'wallet',
  },
]);

const euro = (value: number): string => `${value.toLocaleString('es-ES')} €`;

interface MariachiJoinNetworkProps {
  /** Provincia de origen cuando el alta llega desde una plaza de red. */
  defaultProvince?: string;
  /** Código opaco de la plaza: viaja al expediente, no es una marca. */
  invitationCode?: string | null;
}

export default function MariachiJoinNetwork({
  defaultProvince = '',
  invitationCode = null,
}: MariachiJoinNetworkProps) {
  const [form, setForm] = useState<FormState>({
    groupName: '',
    leaderName: '',
    phone: '',
    province: defaultProvince,
    city: '',
    formation: 'cuarteto',
    repertoireNote: invitationCode ? `Invitación de plaza ${invitationCode}` : '',
  });
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    applicationId: string;
    persisted: boolean;
    automationDispatched: boolean;
  } | null>(null);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]): void => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setFeedback(null);

    try {
      const result = await submitMariachiNetworkApplication(form);
      if (!result.ok) {
        setStatus('error');
        setFeedback(result.error);
        return;
      }

      setStatus('done');
      setReceipt({
        applicationId: result.applicationId,
        persisted: result.persisted,
        automationDispatched: result.automationDispatched,
      });
      setFeedback(result.message);
      window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error: unknown) {
      console.error('MARIACHI_NETWORK_SUBMIT_ERROR:', error);
      setStatus('error');
      setFeedback('No se pudo completar el alta. Escríbenos por WhatsApp y lo resolvemos al momento.');
    }
  };

  return (
    <div className="w-full overflow-x-hidden max-w-6xl mx-auto space-y-16 py-4">
      {/* 1. CABECERA: CERO CUOTAS, CERO LEADS FRÍOS */}
      <header className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[11px] font-mono uppercase tracking-[0.3em]">
          <Globe2 size={14} />
          Centralita Nacional de Mariachis · Red de directores
        </div>
        <h1 className="font-syne text-4xl sm:text-6xl font-black uppercase tracking-tight leading-tight">
          Cero Cuotas. Cero Leads Fríos. <br />
          <span className="text-[#ecb613]">80 % Directo a Tu Bolsillo.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl mx-auto leading-relaxed">
          Edwin Agudelo no te vende una cuota: dirige la red. Él firma la voz tenor y la dirección
          artística; tú aportas la formación local de élite en tu provincia. El cliente paga un
          depósito de {euro(DEPOSITO_STRIPE_EUR)} con Stripe y la fecha se bloquea antes de que
          nadie toque un instrumento.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-[11px] font-mono">
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-[#ecb613] text-xl font-black">0 €</span>
            <span className="text-white/50 uppercase tracking-wider">Cuota fija</span>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-[#ecb613] text-xl font-black">0 €</span>
            <span className="text-white/50 uppercase tracking-wider">Por lead</span>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-[#ecb613] text-xl font-black">
              {Math.round(SPLIT_SOBERANO.artista * 100)} %
            </span>
            <span className="text-white/50 uppercase tracking-wider">Neto artista</span>
          </div>
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
            <span className="block text-[#ecb613] text-xl font-black">60 s</span>
            <span className="text-white/50 uppercase tracking-wider">Cotización</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3 text-xs font-mono">
          <Link
            href="/studio/artist"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white/90 hover:text-white transition-all duration-300 ease-out group"
          >
            <Lock size={13} className="text-[#ecb613]" />
            <span>Área privada de artista</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#alta-red"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ecb613]/15 hover:bg-[#ecb613]/25 border border-[#ecb613]/30 text-[#ecb613] transition-all duration-300 ease-out"
          >
            <Sparkles size={13} />
            <span>Dar de alta mi agrupación</span>
          </a>
        </div>
      </header>

      {/* 2. COMPARATIVA DEMOLEDORA */}
      <section id="comparativa" className="space-y-6 scroll-mt-24">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <TrendingUp size={13} />
            Auditoría comparativa · 27/10/2026
          </span>
          <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase text-white">
            Directorio de cuotas vs Centralita soberana
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto">
            Los datos del directorio tradicional proceden de su página pública de planes para
            grupos. No son una opinión: son su tarifa publicada.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#07070b] overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/[0.03] border-b border-white/10 text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">
            <span className="col-span-3">Concepto</span>
            <span className="col-span-4">Directorio tradicional</span>
            <span className="col-span-5 text-[#ecb613]">Centralita EAR OS</span>
          </div>

          {COMPARISON_ROWS.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-5 sm:px-6 py-4 border-b border-white/5 last:border-0 transition-all duration-300 ease-out hover:bg-white/[0.02]"
            >
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/80">
                  {row.label}
                </span>
                {row.critical ? (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF2B44]/15 border border-[#FF2B44]/30 text-[#FF2B44]">
                    P0
                  </span>
                ) : null}
              </div>
              <div className="md:col-span-4 flex items-start gap-2 text-xs text-zinc-400">
                <span aria-hidden="true" className="mt-0.5 shrink-0 font-bold text-[#FF2B44]">
                  ✕
                </span>
                <span>{row.traditional}</span>
              </div>
              <div className="md:col-span-5 flex items-start gap-2 text-xs text-zinc-100">
                <Check size={14} className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>{row.sovereign}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-mono text-white/35 leading-relaxed">
          Fuente interna: <code className="text-white/50">reports/INFORME_FORENSE_MARIACHIS_ES_PLANES_B2B_2026.md</code>.
          Su propia página declara 79 € de bienvenida, 208 €/mes en la cabecera y 250 €/mes en la
          tarjeta: la contradicción está documentada con captura de texto y fecha de consulta.
        </p>
      </section>

      {/* 3. ECONOMÍA REAL: TARIFAS SSOT Y SPLIT SOBERANO */}
      <section id="economia" className="space-y-6 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              <Wallet size={13} />
              Tarifas cerradas del SSOT
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-black uppercase text-white">
              Lo que cobra el cliente, sin regateo
            </h2>
          </div>
          <p className="text-xs font-mono text-white/40 max-w-md">
            Precios base sin IVA. El depósito de {euro(DEPOSITO_STRIPE_EUR)} se descuenta íntegro de
            la liquidación final.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {MARIACHI_FORMATS.map((format) => (
            <article
              key={format.id}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5 space-y-3 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/25 text-[#ecb613]">
                  <Music size={16} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/45">
                  {format.members} {format.members === 1 ? 'músico' : 'músicos'}
                </span>
              </div>
              <h3 className="font-syne text-base font-bold uppercase text-white leading-tight">
                {format.name}
              </h3>
              <p className="font-syne text-3xl font-black text-[#ecb613]">{euro(format.basePrice)}</p>
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Depósito {euro(format.depositAmount)} · deducible
              </p>
              <p className="text-xs text-white/60 leading-relaxed">{format.recommendedFor}</p>
            </article>
          ))}
        </div>

        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 font-syne text-lg font-bold uppercase text-white">
              <Zap size={16} className="text-[#ecb613]" />
              Split Soberano 80 / 10 / 10
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
              Sobre base imponible (pre-IVA)
            </span>
          </div>

          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-white/5"
            role="img"
            aria-label={`Reparto: ${Math.round(SPLIT_SOBERANO.artista * 100)} % artista, ${Math.round(SPLIT_SOBERANO.earOs * 100)} % infraestructura, ${Math.round(SPLIT_SOBERANO.vimume * 100)} % obra social`}
          >
            <div className="bg-[#ecb613]" style={{ width: `${SPLIT_SOBERANO.artista * 100}%` }} />
            <div className="bg-[#00E5FF]/70" style={{ width: `${SPLIT_SOBERANO.earOs * 100}%` }} />
            <div className="bg-emerald-500/80" style={{ width: `${SPLIT_SOBERANO.vimume * 100}%` }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-mono">
            <div className="rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20 p-4">
              <span className="block text-[#ecb613] text-lg font-black">
                {Math.round(SPLIT_SOBERANO.artista * 100)} %
              </span>
              <span className="text-white/60">Artista ejecutante, el mismo día del bolo.</span>
            </div>
            <div className="rounded-2xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 p-4">
              <span className="block text-[#00E5FF] text-lg font-black">
                {Math.round(SPLIT_SOBERANO.earOs * 100)} %
              </span>
              <span className="text-white/60">Stripe, lock de fecha, telemetría y soporte.</span>
            </div>
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4">
              <span className="block text-emerald-400 text-lg font-black">
                {Math.round(SPLIT_SOBERANO.vimume * 100)} %
              </span>
              <span className="text-white/60">Obra social VIMUME y certificado RSC.</span>
            </div>
          </div>

          <p className="flex items-start gap-2 text-[11px] text-white/50 leading-relaxed">
            <CreditCard size={14} className="mt-0.5 shrink-0 text-[#ecb613]" aria-hidden="true" />
            <span>
              Logística S-Class: {euro(LOGISTICA_EUR_PER_KM).replace('.', ',')} / km a partir del km{' '}
              {LOGISTICA_KM_EXENTOS} desde la base fiscal del proveedor hasta el evento. El Hub
              Méntrida solo aplica a Edwin Agudelo y empresas con base en Méntrida.
            </span>
          </p>
        </div>
      </section>

      {/* 4. FLUJO DE 60 SEGUNDOS */}
      <section className="rounded-3xl bg-[#07070b] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              <Zap size={13} />
              Despacho matemático
            </span>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              De la consulta al depósito en 4 pasos
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            Sin llamadas a ciegas
          </span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {FLOW_STEPS.map((step) => (
            <li
              key={step.title}
              className="rounded-2xl bg-white/[0.02] border border-white/5 p-5 space-y-3 transition-all duration-300 ease-out hover:bg-white/[0.04] hover:border-[#ecb613]/25"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/25 text-[#ecb613]">
                {step.icon === 'lock' ? (
                  <Lock size={15} />
                ) : step.icon === 'wallet' ? (
                  <Wallet size={15} />
                ) : step.icon === 'calendar' ? (
                  <ShieldCheck size={15} />
                ) : (
                  <Sparkles size={15} />
                )}
              </span>
              <h3 className="text-sm font-bold text-white">{step.title}</h3>
              <p className="text-[11px] text-white/55 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. RECLAMACIÓN DE PERFIL VERIFICADO */}
      <section className="rounded-3xl border border-[#ecb613]/25 bg-gradient-to-r from-[#0d0d14] via-[#09090f] to-[#0d0d14] p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <BadgeCheck size={14} />
            Reclamación de perfil · sin coste
          </span>
          <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
            ¿Diriges una agrupación? Reclama tu ficha oficial
          </h2>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Si tu grupo ya aparece en el mapa de la centralita, reclama la ficha para pasar de
            &quot;perfil básico&quot; a <strong className="text-white">verificado</strong>: teléfono
            propio visible, auditoría de audio/vídeo y acceso a bolos con depósito ya cobrado.
            Mantienes tu nombre y tu repertorio; la centralita aporta la demanda y el blindaje.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-white/60">
            <li className="flex items-start gap-2">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>Sin cuota de alta ni permanencia.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>Conservas el 80 % neto de cada actuación.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>Ficha con tu provincia, formatos y repertorio real.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>Los clientes llegan con la fecha ya blindada.</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
          <a
            href="#alta-red"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#ecb613] hover:bg-amber-300 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all duration-300 ease-out shadow-lg shadow-[#ecb613]/20"
          >
            <Award size={14} />
            Reclamar mi perfil
          </a>
          <a
            href="https://wa.me/34693693048?text=Hola,%20quiero%20reclamar%20el%20perfil%20verificado%20de%20mi%20agrupaci%C3%B3n%20en%20la%20Centralita%20Nacional%20de%20Mariachis"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out"
          >
            <MessageCircle size={14} className="text-emerald-400" />
            Dudas por WhatsApp
          </a>
        </div>
      </section>

      {/* 6. ALTA EN LA RED (ESCRITURA REAL) */}
      <section
        id="alta-red"
        className="scroll-mt-24 rounded-[2.5rem] bg-[#030305] border border-[#ecb613]/30 shadow-2xl p-6 sm:p-10 relative overflow-hidden"
      >
        <div className="absolute -top-28 -right-20 h-64 w-64 rounded-full bg-[#ecb613]/10 blur-[110px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
              <Users size={13} />
              Alta en la red nacional
            </span>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase text-white">
              Conecta tu agrupación a la Centralita
            </h2>
            <p className="text-xs text-white/55 leading-relaxed">
              Revisamos tu audio y tu documentación antes de activar el perfil. Sin coste de alta y
              sin permanencia: si no recibes bolos, no pagas nada porque nunca hubo cuota.
            </p>
          </div>

          {status === 'done' ? (
            <div className="rounded-2xl bg-[#ecb613]/10 border border-[#ecb613] p-6 sm:p-8 text-center space-y-4">
              <CheckCircle2 size={40} className="mx-auto text-[#ecb613]" aria-hidden="true" />
              <h3 className="font-syne text-xl font-bold text-white">Alta registrada</h3>
              <p className="text-xs text-white/70 leading-relaxed">{feedback}</p>
              {receipt ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-mono text-left">
                  <div className="rounded-xl bg-black/30 border border-white/10 p-3">
                    <span className="block text-white/40 uppercase tracking-wider">Expediente</span>
                    <span className="text-white break-all">{receipt.applicationId}</span>
                  </div>
                  <div className="rounded-xl bg-black/30 border border-white/10 p-3 space-y-1">
                    <span className="block text-white/40 uppercase tracking-wider">Estado</span>
                    <span className="flex items-center gap-1.5 text-white">
                      <Check
                        size={12}
                        className={receipt.persisted ? 'text-emerald-400' : 'text-amber-400'}
                      />
                      {receipt.persisted ? 'Persistido en base de datos' : 'Reintento de persistencia'}
                    </span>
                    <span className="flex items-center gap-1.5 text-white">
                      <Check
                        size={12}
                        className={receipt.automationDispatched ? 'text-emerald-400' : 'text-amber-400'}
                      />
                      {receipt.automationDispatched ? 'Despachado a n8n' : 'Cola n8n no disponible'}
                    </span>
                  </div>
                </div>
              ) : null}
              <div className="pt-1 flex flex-wrap justify-center gap-3">
                <Link
                  href="/studio/artist"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs uppercase tracking-wider hover:bg-amber-300 transition-all duration-300 ease-out"
                >
                  <Lock size={14} />
                  Ir al área privada
                </Link>
                <a
                  href="https://wa.me/34693693048?text=Hola,%20acabo%20de%20registrar%20mi%20agrupaci%C3%B3n%20en%20la%20Centralita%20Nacional%20de%20Mariachis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all duration-300 ease-out"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  Abrir WhatsApp
                </a>
              </div>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className={`space-y-4 text-xs font-mono ${status === 'done' ? 'hidden' : ''}`}
          >
            {invitationCode ? (
              <p className="inline-flex items-center gap-2 rounded-xl border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-2 text-[10px] uppercase tracking-wider text-[#ecb613]">
                <BadgeCheck size={13} aria-hidden="true" />
                Plaza {defaultProvince || 'de red'} · invitación {invitationCode} · se adjunta a tu expediente
              </p>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="red-group" className="block text-zinc-300 mb-1">
                  Nombre de la agrupación *
                </label>
                <input
                  id="red-group"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="organization"
                  placeholder="Ej. Mariachi de Gala Edwin Agudelo"
                  value={form.groupName}
                  onChange={(event) => updateField('groupName', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                />
              </div>
              <div>
                <label htmlFor="red-leader" className="block text-zinc-300 mb-1">
                  Director o portavoz *
                </label>
                <input
                  id="red-leader"
                  type="text"
                  required
                  minLength={2}
                  maxLength={120}
                  autoComplete="name"
                  placeholder="Nombre y apellidos"
                  value={form.leaderName}
                  onChange={(event) => updateField('leaderName', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="red-phone" className="block text-zinc-300 mb-1">
                  Teléfono propio / WhatsApp *
                </label>
                <input
                  id="red-phone"
                  type="tel"
                  required
                  minLength={9}
                  maxLength={24}
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+34 600 000 000"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                />
              </div>
              <div>
                <label htmlFor="red-province" className="block text-zinc-300 mb-1">
                  Provincia base *
                </label>
                <input
                  id="red-province"
                  type="text"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Ej. Toledo"
                  value={form.province}
                  onChange={(event) => updateField('province', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="red-city" className="block text-zinc-300 mb-1">
                  Municipio
                </label>
                <input
                  id="red-city"
                  type="text"
                  maxLength={80}
                  placeholder="Ej. Méntrida"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                />
              </div>
              <div>
                <label htmlFor="red-formation" className="block text-zinc-300 mb-1">
                  Formación habitual *
                </label>
                <select
                  id="red-formation"
                  required
                  value={form.formation}
                  onChange={(event) => updateField('formation', event.target.value as FormationId)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40"
                >
                  {FORMATION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="red-repertoire" className="block text-zinc-300 mb-1">
                Repertorio, vídeos o notas de auditoría
              </label>
              <textarea
                id="red-repertoire"
                rows={3}
                maxLength={500}
                placeholder="Enlaces a audio/vídeo, instrumentos disponibles, repertorio propio…"
                value={form.repertoireNote}
                onChange={(event) => updateField('repertoireNote', event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-[#ecb613] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/40 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full min-h-[50px] py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-300 disabled:opacity-60 disabled:cursor-wait text-black font-black font-syne uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all duration-300 ease-out shadow-xl shadow-[#ecb613]/20"
            >
              <Send size={16} aria-hidden="true" />
              {status === 'sending' ? 'Registrando alta…' : 'Activar mi perfil en la red'}
            </button>

            <div aria-live="polite" className="min-h-[20px]">
              {feedback ? (
                <p
                  className={`flex items-start gap-2 text-[11px] leading-relaxed ${
                    status === 'error' ? 'text-[#FF2B44]' : 'text-emerald-300'
                  }`}
                >
                  <AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{feedback}</span>
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-[10px] text-white/40">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Split {Math.round(SPLIT_SOBERANO.artista * 100)} % garantizado
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={13} className="text-[#ecb613]" />
                Depósito {euro(DEPOSITO_STRIPE_EUR)} deducible
              </span>
              <a
                href="tel:+34693693048"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <PhoneCall size={13} className="text-[#ecb613]" />
                +34 693 693 048
              </a>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
