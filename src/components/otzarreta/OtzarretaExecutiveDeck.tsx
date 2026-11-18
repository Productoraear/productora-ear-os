'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  TrendingDown,
  TrendingUp,
  MapPin,
  Car,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Phone,
  Sparkles,
  Zap,
  Building2,
  Lock,
  Handshake,
  Check,
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

interface Slide {
  id: number;
  badge: string;
  tagline: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'BLOQUE 1 · AUTORIDAD MORAL E HISTÓRICA',
    tagline: 'DE LA MACRODISCOTECA A LA GASTRONOMÍA',
    title: 'Confianza Forjada en las Pistas',
    subtitle: 'Edwin Agudelo & Eduardo Martínez · Restaurante Otzarreta (Derio)',
  },
  {
    id: 2,
    badge: 'BLOQUE 2 · DIAGNÓSTICO CONTABLE',
    tagline: '45.000 € EN DIRECTORIOS VS. 6-7 DE MARZO',
    title: 'La Fuga Anual en Portales',
    subtitle: 'Sangría en intermediarios vs. La urgencia de Spacioboda BEC',
  },
  {
    id: 3,
    badge: 'BLOQUE 3 · ALIVIO OPERATIVO',
    tagline: 'CENTRALITA 24/7 & BOTÓN DE ACEPTAR RESERVA',
    title: 'La Máquina Transaccional',
    subtitle: 'Atención en < 60 segundos y cobro de fianza Stripe 100 €',
  },
  {
    id: 4,
    badge: 'BLOQUE 4 · COMPARATIVA CARA A CARA',
    tagline: 'OPCIÓN A (TARIFA PLANA) VS. OPCIÓN B (VARIABLE)',
    title: 'Dos Modelos de Retorno',
    subtitle: 'Garantía contractual de retorno euro a euro en < 90 días',
  },
  {
    id: 5,
    badge: 'BLOQUE 5 · CIERRE PRESENCIAL EN DERIO',
    tagline: 'DECISIÓN EJECUTIVA EN 48 HORAS',
    title: 'Reunión Presencial en Otzarreta',
    subtitle: 'Cierre mano a mano con Edwin Agudelo en el caserío',
  },
];

export function OtzarretaExecutiveDeck(): React.JSX.Element {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [selectedPlan, setSelectedPlan] = useState<'A' | 'B'>('A');

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev > 1 ? prev - 1 : SLIDES.length));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev < SLIDES.length ? prev + 1 : 1));
  };

  const formattedPhone = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    'Hola Edwin, he revisado la propuesta de los 5 bloques para Restaurante Otzarreta (Derio). Sentémonos a cerrar los detalles.'
  )}`;

  return (
    <div className="w-full max-w-md sm:max-w-xl mx-auto flex flex-col items-center">
      {/* Barra superior de estado de la presentación */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-zinc-950/80 border border-white/10 rounded-2xl mb-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
            Dossier Confidencial S-Class · Derio (Bizkaia)
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#ecb613]">
          <span className="font-bold">{currentSlide}</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">{SLIDES.length}</span>
        </div>
      </div>

      {/* Contenedor vertical 9:16 adaptable */}
      <div className="w-full bg-[#07070a] border border-amber-500/20 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(236,182,19,0.06)] relative overflow-hidden flex flex-col justify-between min-h-[640px] sm:min-h-[720px]">
        {/* Glow de fondo */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Cabecera del slide */}
        <div className="relative z-10 space-y-2 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]">
              {SLIDES[currentSlide - 1].badge}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-right">
              {SLIDES[currentSlide - 1].tagline}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {SLIDES[currentSlide - 1].title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium">
            {SLIDES[currentSlide - 1].subtitle}
          </p>
        </div>

        {/* CUERPO INTERACTIVO POR SLIDE */}
        <div className="relative z-10 py-5 flex-1 flex flex-col justify-center">
          {/* BLOQUE 1: AUTORIDAD MORAL E HISTÓRICA */}
          {currentSlide === 1 && (
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-[#ecb613] font-bold">
                  <Flame className="w-4 h-4" />
                  <span>El Vínculo: De la Macrodiscoteca al Asador de Gala</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[13px]">
                  La misma complicidad y potencia con la que llenábamos la macrodiscoteca hasta la bandera con miles de personas, puesta hoy al servicio de llenar los comedores y jardines de <strong>Restaurante Otzarreta</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>Dinastía Familiar Desde 1902</span>
                  <span className="font-mono text-[11px] text-zinc-400">4 Generaciones</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[12px]">
                  Caserío tradicional vasco en el Parque Tecnológico de <strong>Derio (Bizkaia)</strong>, con Eduardo Martínez al frente de las brasas de encina y sarmiento. Cero contaminación con música en la ficha gastronómica.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                    <Car className="w-3.5 h-3.5" />
                    <span>&gt;120 Plazas</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Párking privado cerrado y vigilado.</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                    <Users className="w-3.5 h-3.5" />
                    <span>50 a 350 Pax</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">Salón acristalado y carpa botánica.</div>
                </div>
              </div>
            </div>
          )}

          {/* BLOQUE 2: DIAGNÓSTICO CONTABLE */}
          {currentSlide === 2 && (
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <TrendingDown className="w-4 h-4" />
                  <span>45.000 € Dilapidados en Portales</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[13px]">
                  Pagar miles de euros a Bodas.net o Zankyou para figurar en un directorio masificado junto a 80 competidores que revientan menús es un modelo agotado.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Tiempo medio de respuesta tradicional:</span>
                  <span className="text-rose-400 font-mono font-bold">24 a 48 Horas</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Fuga directa por falta de agilidad:</span>
                  <span className="text-rose-400 font-mono font-bold">3 a 4 Bodas / Año</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="text-white font-bold">Urgencia 6-7 Marzo:</span>
                  <span className="text-[#ecb613] font-mono font-extrabold text-xs sm:text-sm">Spacioboda BEC Barakaldo</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs">
                Entre <strong>600 y 900 parejas de Bizkaia</strong> acudirán al BEC con fecha en mano. Si Otzarreta no tiene la máquina transaccional encendida, esas reservas se cerrarán con fincas competidoras.
              </div>
            </div>
          )}

          {/* BLOQUE 3: ALIVIO OPERATIVO */}
          {currentSlide === 3 && (
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Centralita 24/7 & Maître Digital</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Respuesta inmediata en menos de 60 segundos por WhatsApp y web. Cualificación automática de fecha, nº de comensales y elección entre los <strong>7 Menús Oficiales (145 € - 185 € + IVA)</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/25 space-y-1.5">
                <div className="flex items-center gap-2 text-[#ecb613] font-bold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Botón de «Aceptar Reserva» con Fianza Stripe ({DEPOSITO_STRIPE_EUR} €)</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Eduardo solo tiene que pulsar un botón para validar la fecha. El cliente abona la fianza con tarjeta mediante pasarela bancaria blindada. Cero llamadas zombis y cero cancelaciones de palabra.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Malla Transaccional de 126 Landings en Bizkaia</span>
                </div>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  18 Municipios (Derio, Bilbao, Getxo, Sondika, Zamudio, Durango...) captando reservas de bodas, asador, comuniones y comidas corporativas sin depender de directorios terceros.
                </p>
              </div>
            </div>
          )}

          {/* BLOQUE 4: COMPARATIVA CARA A CARA */}
          {currentSlide === 4 && (
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300">
              {/* Selector de Plan */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedPlan('A')}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                    selectedPlan === 'A'
                      ? 'bg-[#ecb613] text-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  OPCIÓN A (Recomendada)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPlan('B')}
                  className={`py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                    selectedPlan === 'B'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  OPCIÓN B (Variable)
                </button>
              </div>

              {selectedPlan === 'A' ? (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-zinc-900 to-zinc-950 border border-amber-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#ecb613] font-bold">Cuota Única Plana</span>
                    <span className="text-xl font-extrabold text-white font-mono">9.000 € <span className="text-xs text-zinc-400 font-normal">+ IVA / año</span></span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>0% Comisiones</strong> sobre banquetes, menús y bodega.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Exclusividad territorial de 100 km</strong> para Otzarreta en Bizkaia.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Garantía de retorno euro a euro:</strong> se amortiza con 1 solo banquete cerrado.</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-bold">Canon Fijo + Porcentaje</span>
                    <span className="text-xl font-extrabold text-white font-mono">6.000 € <span className="text-xs text-zinc-400 font-normal">+ comisiones</span></span>
                  </div>

                  <ul className="space-y-2 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Desembolso inicial de <strong>6.000 € + IVA</strong>.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>10% Comisión</strong> en cada banquete cerrado.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-400 shrink-0" />
                      <span><strong>5% Comisión</strong> en servicios de producción técnica.</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 text-center">
                Ambas opciones incluyen despliegue completo del clúster de 126 URLs y soporte técnico 24/7.
              </div>
            </div>
          )}

          {/* BLOQUE 5: CIERRE PRESENCIAL EN DERIO */}
          {currentSlide === 5 && (
            <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-zinc-950 border border-emerald-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Handshake className="w-4 h-4" />
                  <span>Cierre Presencial en Derio en 48 Horas</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[13px]">
                  Sin intermediarios ni demoras. Nos sentamos mano a mano en el propio restaurante en Derio, revisamos las fechas libres del calendario y firmamos el acuerdo con garantía por contrato.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#ecb613] font-bold">
                  <span>Garantía Contractual Blindada</span>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-zinc-400 text-[12px] leading-relaxed">
                  Si en los primeros 90 días la máquina transaccional no genera un retorno verificable de reservas, se devuelve la diferencia euro a euro. Riesgo cero para la casa.
                </p>
              </div>

              {/* Botón WhatsApp de Acción Directa */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)]"
              >
                <Phone className="w-4 h-4" />
                <span>Agendar Cierre con Edwin (+34 693 693 048)</span>
              </a>
            </div>
          )}
        </div>

        {/* CONTROLES INFERIORES DE NAVEGACIÓN */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goToPrev}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-semibold transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          {/* Indicadores de bolitas */}
          <div className="flex items-center gap-1.5">
            {SLIDES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(s.id)}
                aria-label={`Ir al bloque ${s.id}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  s.id === currentSlide
                    ? 'w-6 bg-[#ecb613]'
                    : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#ecb613] hover:bg-[#ffe066] text-black text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#ecb613]/20"
          >
            <span>Siguiente</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pie de página corporativo sobrio */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-[11px] font-mono text-zinc-400">
          Alianza Soberana · Restaurante Otzarreta (Derio, Bizkaia) & Productora EAR
        </p>
        <p className="text-[10px] text-zinc-500">
          Ruta canónica: productoraear.com/alianza-otzarreta · Cero intermediarios
        </p>
      </div>
    </div>
  );
}
