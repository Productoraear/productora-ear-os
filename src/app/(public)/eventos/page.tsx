'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Sliders, 
  Heart, 
  Gift, 
  Cake, 
  Music, 
  Users, 
  Building2, 
  Star, 
  Calendar,
  Flame,
  PhoneCall
} from 'lucide-react';
import { useNeuralTunnelStore } from '@/store/useNeuralTunnelStore';
import { EAR_PALETTE } from '@/lib/brand-palette';

type EventMainTab = 'bodas' | 'cumpleanos' | 'familia' | 'romance' | 'mariachi_semantico';

type CumpleSubTab = 'todos' | 'adultos' | '50_60_70' | 'juvenil';
type FamiliaSubTab = 'todos' | 'madre' | 'padre' | 'abuelos';
type MariachiSemanticFilter = 'todos' | 'emocional' | 'corporativo' | 'fiestas' | 'homenajes';

export default function EventosPage() {
  const [activeTab, setActiveTab] = useState<EventMainTab>('bodas');
  const [cumpleSubTab, setCumpleSubTab] = useState<CumpleSubTab>('todos');
  const [familiaSubTab, setFamiliaSubTab] = useState<FamiliaSubTab>('todos');
  const [mariachiFilter, setMariachiFilter] = useState<MariachiSemanticFilter>('todos');

  const { openTunnel } = useNeuralTunnelStore();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-24 pb-36 px-4 md:px-8 selection:bg-[#f59e0b] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* HEADER DE GALA */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-full text-[#f59e0b] text-[10px] font-mono uppercase tracking-[0.3em]">
            <Sparkles size={12} className="text-[#f59e0b]" />
            PRODUCTORA EAR // EJE OPERATIVO EVENTOS & CELEBRACIONES
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[1.02]">
            Celebraciones de <span className="text-[#f59e0b] italic">Autor</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            Música en vivo que transforma momentos. Desde bodas de alta costura hasta serenatas íntimas y homenajes intergeneracionales con Edwin Agudelo y agrupaciones homologadas.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => openTunnel()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ecb613] text-black font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:scale-105 transition-all cursor-pointer"
            >
              <Sliders size={15} />
              <span>Configurar en Túnel Neural S-Class</span>
            </button>
            <a
              href="tel:+34693693048"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <PhoneCall size={14} className="text-[#f59e0b]" />
              <span>Teléfono Oficial: +34 693 693 048</span>
            </a>
          </div>
        </div>

        {/* SELECTOR MAESTRO DE 5 PESTAÑAS */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#0b0c13] border border-white/10 rounded-2xl max-w-4xl mx-auto shadow-2xl">
          <button
            onClick={() => setActiveTab('bodas')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'bodas'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Heart size={14} />
            <span>Bodas & Ceremonias</span>
          </button>

          <button
            onClick={() => setActiveTab('cumpleanos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'cumpleanos'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cake size={14} />
            <span>Cumpleaños (Unificado)</span>
          </button>

          <button
            onClick={() => setActiveTab('familia')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'familia'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={14} />
            <span>Madre, Padre & Abuelos</span>
          </button>

          <button
            onClick={() => setActiveTab('romance')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'romance'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gift size={14} />
            <span>San Valentín & Serenatas</span>
          </button>

          <button
            onClick={() => setActiveTab('mariachi_semantico')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === 'mariachi_semantico'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music size={14} />
            <span>Universo Semántico Mariachi</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* SECCIÓN 1: BODAS & CEREMONIAS                             */}
        {/* ========================================================= */}
        {activeTab === 'bodas' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
                MOMENTOS INOLVIDABLES DE BODA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                Producción Sonora para tu Enlace
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0c0d14] border border-white/10 hover:border-[#f59e0b]/50 p-6 rounded-3xl space-y-4 transition-all shadow-xl group">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                    <Heart size={20} />
                  </div>
                  <span className="text-xs font-mono text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-1 rounded-full border border-[#ecb613]/30">
                    Desde 350 €
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Ceremonia Religiosa / Civil</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Ave María de Schubert, Hasta Mi Final, Panis Angelicus y piezas personalizadas interpretadas por voz lírica con piano o ensamble de cuerdas.
                </p>
                <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2">✓ Sonido Bose F1 sin cables visibles</div>
                  <div className="flex items-center gap-2">✓ Microfonía Shure para lecturas de votos</div>
                </div>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                >
                  Configurar Ceremonia
                </button>
              </div>

              <div className="bg-[#0c0d14] border border-[#f59e0b]/40 p-6 rounded-3xl space-y-4 shadow-2xl relative">
                <div className="absolute -top-3 right-6 bg-[#f59e0b] text-black text-[9px] font-mono font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  MOMENTO ESTRELLA
                </div>
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/50 flex items-center justify-center text-[#f59e0b]">
                    <Music size={20} />
                  </div>
                  <span className="text-xs font-mono text-[#f59e0b] bg-[#f59e0b]/10 px-2.5 py-1 rounded-full border border-[#f59e0b]/30 font-bold">
                    Desde 650 €
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Entrada Triunfal con Mariachi</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Aparición sorpresa durante el cóctel o apertura del banquete. Edwin Agudelo al frente con traje de gala charro y botonadura de plata.
                </p>
                <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2">✓ Ramo de flores sorpresa en directo</div>
                  <div className="flex items-center gap-2">✓ Sesión de fotos con sombreros de gala</div>
                </div>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg"
                >
                  Pedir Entrada Mariachi
                </button>
              </div>

              <div className="bg-[#0c0d14] border border-white/10 hover:border-[#f59e0b]/50 p-6 rounded-3xl space-y-4 transition-all shadow-xl group">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                    <Sparkles size={20} />
                  </div>
                  <span className="text-xs font-mono text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-1 rounded-full border border-[#ecb613]/30">
                    Desde 1.200 €
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Boda Gala 360° Integral</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cobertura integral: Ceremonia lírica + Cóctel con Mariachi + Sonorización de banquete + Discomóvil con DJ e iluminación robótica.
                </p>
                <div className="space-y-1.5 text-xs text-zinc-300 font-mono">
                  <div className="flex items-center gap-2">✓ Presión acústica calibrada 12 W/pax</div>
                  <div className="flex items-center gap-2">✓ Coordinador de producción presencial</div>
                </div>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                >
                  Ver Pack 360°
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN 2: CUMPLEAÑOS UNIFICADO CON SUBDESPLIEGUE         */}
        {/* ========================================================= */}
        {activeTab === 'cumpleanos' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
                PESTAÑA UNIFICADA DE CUMPLEAÑOS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                Personaliza la Experiencia de Cumpleaños
              </h2>
              <p className="text-xs text-zinc-400">
                Selecciona la categoría para desplegar el repertorio, formato y montaje ideal.
              </p>
            </div>

            {/* Sub-Despliegue Dinámico de Cumpleaños */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl max-w-xl mx-auto">
              <button
                onClick={() => setCumpleSubTab('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  cumpleSubTab === 'todos' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setCumpleSubTab('adultos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  cumpleSubTab === 'adultos' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Adultos VIP
              </button>
              <button
                onClick={() => setCumpleSubTab('50_60_70')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  cumpleSubTab === '50_60_70' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                50 / 60 / 70 / 80 Años
              </button>
              <button
                onClick={() => setCumpleSubTab('juvenil')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  cumpleSubTab === 'juvenil' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Juvenil & Temático
              </button>
            </div>

            {/* Tarjetas de Cumpleaños según subdespliegue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(cumpleSubTab === 'todos' || cumpleSubTab === 'adultos') && (
                <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-4 hover:border-[#f59e0b]/50 transition-all shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                    <Cake size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Cumpleaños Adultos VIP</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Celebración en chalet, restaurante o finca privada. Canciones célebres, brindis con mariachi o solista y dinamización festiva elegante.
                  </p>
                  <div className="text-xs font-mono text-[#ecb613]">Formato: Solista o Trío de Gala (Desde 350 €)</div>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                  >
                    Personalizar Cumpleaños
                  </button>
                </div>
              )}

              {(cumpleSubTab === 'todos' || cumpleSubTab === '50_60_70') && (
                <div className="bg-[#0c0d14] border border-[#f59e0b]/40 p-6 rounded-3xl space-y-4 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                    <Star size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Homenaje 50, 60, 70 u 80 Años</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Un viaje emocional por las canciones que marcaron su vida. Desde boleros clásicos hasta rancheras de oro y baladas memorables. Lágrimas de emoción garantizadas.
                  </p>
                  <div className="text-xs font-mono text-[#f59e0b]">Formato: Cuarteto Imperial con Edwin Agudelo</div>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Diseñar Homenaje de Vida
                  </button>
                </div>
              )}

              {(cumpleSubTab === 'todos' || cumpleSubTab === 'juvenil') && (
                <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-4 hover:border-[#f59e0b]/50 transition-all shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b]">
                    <Flame size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Fiestas Temáticas & 18/25 Años</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Discomóvil con sonido Bose F1, iluminación LED robotizada y DJ para cumpleaños de mayoría de edad o temáticas mexicanas/latinas.
                  </p>
                  <div className="text-xs font-mono text-[#ecb613]">Formato: Discomóvil + Show Mariachi Fusión</div>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                  >
                    Ver Opciones Juveniles
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN 3: DÍA DE LA MADRE, PADRE & ABUELOS               */}
        {/* ========================================================= */}
        {activeTab === 'familia' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
                HOMENAJE A LOS PILARES DE LA FAMILIA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                Día de la Madre, Padre, Abuelo y Abuela
              </h2>
              <p className="text-xs text-zinc-400">
                La forma más profunda y sincera de decirles gracias con música que toca el alma.
              </p>
            </div>

            {/* Selector de Destinatario */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl max-w-lg mx-auto">
              <button
                onClick={() => setFamiliaSubTab('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  familiaSubTab === 'todos' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFamiliaSubTab('madre')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  familiaSubTab === 'madre' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Día de la Madre
              </button>
              <button
                onClick={() => setFamiliaSubTab('padre')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  familiaSubTab === 'padre' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Día del Padre
              </button>
              <button
                onClick={() => setFamiliaSubTab('abuelos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                  familiaSubTab === 'abuelos' ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Abuelo / Abuela
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(familiaSubTab === 'todos' || familiaSubTab === 'madre') && (
                <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-3 hover:border-[#f59e0b]/40 transition-all shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Heart size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Serenata para la Madre</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Repertorio: &quot;Madrecita Querida&quot;, &quot;Amor Eterno&quot;, &quot;Las Mañanitas&quot;, &quot;Señora&quot;. Llegada sorpresa con ramo de rosas incluido.
                  </p>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                  >
                    Reservar Serenata Madre
                  </button>
                </div>
              )}

              {(familiaSubTab === 'todos' || familiaSubTab === 'padre') && (
                <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-3 hover:border-[#f59e0b]/40 transition-all shadow-xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Users size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Homenaje para el Padre</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Repertorio: &quot;Mi Querido Viejo&quot;, &quot;El Rey&quot;, &quot;Camino de Guanajuato&quot;. Fuerza, respeto y emoción para honrar su esfuerzo de vida.
                  </p>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                  >
                    Reservar Homenaje Padre
                  </button>
                </div>
              )}

              {(familiaSubTab === 'todos' || familiaSubTab === 'abuelos') && (
                <div className="bg-[#0c0d14] border border-[#f59e0b]/40 p-6 rounded-3xl space-y-3 shadow-2xl">
                  <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                    <Star size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-syne uppercase">Abuelo y Abuela (Legado de Amor)</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Conexión directa con la memoria autobiográfica (Metodología VIMUME). Boleros, pasodobles y rancheras que devuelven la sonrisa y la luz a sus ojos.
                  </p>
                  <button
                    onClick={() => openTunnel()}
                    className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
                  >
                    Diseñar Homenaje Abuelos
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN 4: SAN VALENTÍN & SERENATAS                       */}
        {/* ========================================================= */}
        {activeTab === 'romance' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
                ROMANCE & PEDIDAS DE MANO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                San Valentín, Serenatas & Reconciliaciones
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0c0d14] border border-[#f59e0b]/40 p-6 rounded-3xl space-y-4 shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                  <Heart size={20} />
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Pedida de Mano de Ensueño</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Aparición en terraza, mirador o restaurante privado. Edwin Agudelo canta su canción favorita justo antes del anillo de compromiso. Imposible decir que no.
                </p>
                <div className="text-xs font-mono text-[#f59e0b]">Coordinación milimétrica y complicidad secreta</div>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-[#f59e0b] hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
                >
                  Planear Pedida de Mano
                </button>
              </div>

              <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-4 hover:border-[#f59e0b]/40 transition-all shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <Gift size={20} />
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">San Valentín & Aniversarios</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Serenata romántica bajo el balcón o en salón privado. Canciones de Los Panchos, Armando Manzanero, Rocío Dúrcal y Vicente Fernández.
                </p>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                >
                  Consultar San Valentín
                </button>
              </div>

              <div className="bg-[#0c0d14] border border-white/10 p-6 rounded-3xl space-y-4 hover:border-[#f59e0b]/40 transition-all shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-lg font-bold text-white font-syne uppercase">Reconciliación de Pareja</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cuando las palabras no alcanzan, la música abre el corazón. Serenata de disculpa y reencuentro con el máximo respeto y delicadeza escénica.
                </p>
                <button
                  onClick={() => openTunnel()}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#f59e0b] hover:text-black text-xs font-mono uppercase tracking-wider transition-all border border-white/10"
                >
                  Serenata de Reconciliación
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECCIÓN 5: UNIVERSO SEMÁNTICO DEL MARIACHI (CRUCE TOTAL)  */}
        {/* ========================================================= */}
        {activeTab === 'mariachi_semantico' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono text-[#f59e0b] tracking-widest uppercase">
                MATRIZ ONTOLÓGICA SEMÁNTICA // OCCASIONS MATRIX
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                ¿Dónde es Necesario, Útil y Emocional un Mariachi?
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                El Mariachi no es sólo folclore: es un conector de alto impacto emocional, social y corporativo. Cruza todos los términos y escenarios de uso:
              </p>
            </div>

            {/* Filtro Semántico */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl max-w-2xl mx-auto">
              {(['todos', 'emocional', 'corporativo', 'fiestas', 'homenajes'] as MariachiSemanticFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setMariachiFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                    mariachiFilter === f ? 'bg-[#f59e0b] text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {f === 'todos' ? 'Todos los Cruces' : f}
                </button>
              ))}
            </div>

            {/* Matriz de Cruces Semánticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {(mariachiFilter === 'todos' || mariachiFilter === 'emocional') && (
                <div className="bg-[#0c0d14] border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#f59e0b]/40 transition-all">
                  <div className="text-[#f59e0b] text-xs font-mono font-bold">EMOCIONAL // DESPEDIDAS</div>
                  <h4 className="font-bold text-white text-sm font-syne">Reencuentros & Bienvenidas</h4>
                  <p className="text-xs text-zinc-400">
                    Recepciones en el aeropuerto, regreso tras años en el extranjero, bienvenida de un hijo o familiar. El shock emocional positivo eleva el lazo familiar.
                  </p>
                </div>
              )}

              {(mariachiFilter === 'todos' || mariachiFilter === 'corporativo') && (
                <div className="bg-[#0c0d14] border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#f59e0b]/40 transition-all">
                  <div className="text-emerald-400 text-xs font-mono font-bold">B2B // JUBILACIÓN VIP</div>
                  <h4 className="font-bold text-white text-sm font-syne">Homenaje a Directivos</h4>
                  <p className="text-xs text-zinc-400">
                    Cierre de convenciones anuales, despedida de directores o socios fundadores que se jubilan. Distinción, agradecimiento y cierre memorable.
                  </p>
                </div>
              )}

              {(mariachiFilter === 'todos' || mariachiFilter === 'fiestas') && (
                <div className="bg-[#0c0d14] border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#f59e0b]/40 transition-all">
                  <div className="text-cyan-400 text-xs font-mono font-bold">FIESTAS // PATRONALES</div>
                  <h4 className="font-bold text-white text-sm font-syne">Peñas, Quintos & Plazas</h4>
                  <p className="text-xs text-zinc-400">
                    Día de las peñas, vermús populares, carpas municipales y festivales comarcales. Canto colectivo de &quot;El Rey&quot;, &quot;Cielito Lindo&quot; y &quot;México Lindo&quot;.
                  </p>
                </div>
              )}

              {(mariachiFilter === 'todos' || mariachiFilter === 'homenajes') && (
                <div className="bg-[#0c0d14] border border-white/10 p-5 rounded-2xl space-y-2 hover:border-[#f59e0b]/40 transition-all">
                  <div className="text-purple-400 text-xs font-mono font-bold">HOMENAJE // MEMORIA</div>
                  <h4 className="font-bold text-white text-sm font-syne">Bodas de Plata y Oro</h4>
                  <p className="text-xs text-zinc-400">
                    25 o 50 años de matrimonio. Los hijos y nietos contratan al Mariachi para revivir el día en que se prometieron amor eterno. Emoción pura.
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 rounded-3xl bg-[#090a10] border border-[#f59e0b]/30 text-center space-y-3">
              <h3 className="text-xl font-bold font-syne text-white uppercase">
                ¿Tienes una ocasión especial en mente?
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl mx-auto">
                El algoritmo del Túnel Neural analiza la fecha, localidad, aforo y atmósfera para asignarte el formato exacto (Solista, Dúo, Trío o Mariachi Monumental).
              </p>
              <button
                onClick={() => openTunnel()}
                className="px-6 py-3 rounded-full bg-[#f59e0b] hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-pointer"
              >
                Activar Túnel Neural para tu Evento
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
