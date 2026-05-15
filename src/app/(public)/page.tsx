"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  Landmark,
  Network,
  FileText,
  CalendarClock,
  Users,
  Target,
  Sparkles
} from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import DiscoverySearch from "@/app/components/public/DiscoverySearch";

const pillars = [
  {
    icon: Brain,
    title: "Fundamento",
    text: "Un relato respaldado por base científica, sensibilidad humana y arquitectura cognitiva.",
    href: ROUTES.fundacion
  },
  {
    icon: Landmark,
    title: "Credibilidad",
    text: "Diseñado para instituciones, clínicos, fundaciones, socios y financiadores exigentes.",
    href: ROUTES.dossier
  },
  {
    icon: Network,
    title: "Sistema",
    text: "No es una página escaparate; es una estructura pública que ordena narrativa, demanda y alianzas.",
    href: ROUTES.vimume
  },
];

const stakeholderCards = [
  {
    title: "Instituciones públicas",
    text: "Marco claro para programas, subvenciones, ODS y despliegue territorial.",
    href: ROUTES.blogB2G
  },
  {
    title: "Residencias y centros",
    text: "Comprensión rápida del valor operativo, clínico y relacional del sistema.",
    href: ROUTES.blogCasos
  },
  {
    title: "Fundaciones y partners",
    text: "Una narrativa seria para evaluar colaboración, legitimidad e impacto medible.",
    href: ROUTES.blogImpacto
  },
  {
    title: "Financiadores",
    text: "Visión, hoja de ruta y mecanismo de activación presentados con rigor institucional.",
    href: ROUTES.blogInvestigacion
  },
];

export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-[#ecb613]/30">
      {/* 🎬 CINEMATIC DISCOVERY HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden border-b border-white/5">
        {/* 🌌 Atmospheric Backdrop (Pure CSS) */}
        <div className="absolute inset-0 bg-[#050505]" />
        
        {/* Cinematic Gradients & Noise Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-black to-[#050505] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,182,19,0.05),transparent_70%)] z-10" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* Floating Atmospheric Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full animate-pulse pointer-events-none z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center space-y-12">
          {/* Top Label */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[9px] font-black uppercase tracking-[0.5em] backdrop-blur-md mb-8"
          >
            <Sparkles size={10} className="text-[#ecb613]" />
            INFRAESTRUCTURA PÚBLICA
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none"
            >
              Diseña lo
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
              className="text-7xl md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.8] shadow-2xl"
            >
              Inevitable
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed italic font-bold uppercase tracking-widest"
          >
            Alta especialización técnica para proyectos <br className="hidden md:block" />
            institucionales y eventos corporativos de gran envergadura.
          </motion.p>

          {/* Search Component */}
          <div className="pt-12">
            <DiscoverySearch />
          </div>

          {/* Current Trends */}
          <div className="pt-16 flex flex-wrap justify-center gap-8 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            <Link href="/servicios/gala-institucional" className="hover:text-[#ecb613] transition-colors">Gala Institucional</Link>
            <Link href="/servicios/incentivos-corporativos" className="hover:text-[#ecb613] transition-colors">Incentivos Corporativos</Link>
            <Link href="/servicios/destinos-alto-impacto" className="hover:text-[#ecb613] transition-colors">Destinos de Alto Impacto</Link>
          </div>
        </div>

        {/* Decorative divider line from screenshot */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-[#ecb613]/30 to-transparent" />
      </section>

      {/* 📑 DENSITY HUB: TABS SECTION */}
      <section className="py-32 px-6 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <HomeTabs />
        </div>
      </section>

      {/* 🤝 STAKEHOLDERS SECTION */}
      <section id="stakeholders" className="py-32 px-6 border-y border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.02] pointer-events-none">
          <Users size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 max-w-3xl space-y-8">
            <p className="text-[#ecb613] text-[10px] uppercase tracking-[0.6em] font-black">Ecosistema de Alianzas</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85]">Diseñado para <br /> interlocutores serios</h2>
            <p className="text-white/50 text-xl leading-relaxed italic font-medium">
              Cada bloque de esta experiencia está pensado para disminuir dudas, elevar la percepción de madurez y conducir la conversación hacia una validación real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholderCards.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 hover:border-[#ecb613]/20 transition-all block"
              >
                <div className="p-3 bg-white/5 rounded-xl w-fit mb-8 text-[#ecb613]">
                   <Users size={20} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic">{card.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed font-medium italic">{card.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 🗺️ PATHWAY */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 space-y-12">
            <header className="space-y-4">
              <p className="text-[#ecb613] text-[10px] uppercase tracking-[0.6em] font-black">Vertical Institucional</p>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Entender VIMUME</h2>
            </header>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { h: ROUTES.fundacion, i: Brain, t: "Memoria e Identidad", d: "Base científica y marco de valor institucional." },
                { h: ROUTES.protocolo, i: FileText, t: "Protocolo Operativo", d: "Metodología de diagnóstico y curación musical." },
                { h: ROUTES.roadmap, i: CalendarClock, t: "Despliegue Territorial", d: "Hitos de expansión y validación técnica." }
              ].map((link, i) => (
                <Link key={i} href={link.h} className="rounded-3xl border border-white/5 p-8 hover:border-[#ecb613]/40 hover:bg-white/[0.03] transition-all group">
                  <link.i className="text-[#ecb613] mb-6 group-hover:scale-110 transition-transform" size={24} />
                  <p className="font-black text-lg uppercase tracking-tighter italic mb-2 leading-none">{link.t}</p>
                  <p className="text-[10px] text-white/30 uppercase font-black leading-relaxed">{link.d}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-[#ecb613]/10 to-black border border-[#ecb613]/20 rounded-[4rem] p-16 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="p-4 bg-white/5 rounded-2xl w-fit text-[#ecb613]">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">
                La narrativa <br /> ordena el <br /> <span className="text-[#ecb613]">impacto</span>
              </h3>
              <p className="text-white/50 text-sm leading-relaxed italic font-medium">
                El objetivo no es impresionar por estética; es facilitar decisión, confianza y el siguiente movimiento de impacto.
              </p>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <Link
                href={ROUTES.contacto}
                className="px-8 py-5 rounded-full bg-[#ecb613] text-black font-black uppercase tracking-widest text-center hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,182,19,0.2)]"
              >
                Activar contacto
              </Link>
              <Link
                href={ROUTES.vimume}
                className="px-8 py-5 rounded-full border border-white/10 text-white font-black uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all"
              >
                Explorar Documentación
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* 🧬 VIMUME AUTHORITY (RECOVERED FROM SCREENSHOT 2) */}
      <section className="px-6 py-40 bg-white/[0.01] border-t border-white/5 space-y-40">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter">Ejes de Intervención</h2>
            <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Verticales de Impacto Social</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "BANCA & SEGUROS", 
                href: ROUTES.blogImpacto,
                concept: "Longevidad Digna", 
                hook: "Eficiencia sociosanitaria. Nuestra arquitectura reduce la ansiedad en centros y mejora la calidad de vida sin fármacos.",
                targets: "Fundación 'la Caixa', Mapfre, BBVA"
              },
              { 
                title: "TECH & TELCO", 
                href: ROUTES.blogInvestigacion,
                concept: "Conexión Humana", 
                hook: "Reconexión real. En un mundo hiperconectado, nuestros mayores están aislados. Usamos tecnología de audio para reconectar neuronas.",
                targets: "Fundación Telefónica, Vodafone"
              },
              { 
                title: "SANITARIA", 
                href: ROUTES.blogCasos,
                concept: "Terapia Complementaria", 
                hook: "Humanización de marca. Somos el complemento emocional a su tratamiento clínico. Ustedes cuidan el cuerpo; nosotros la identidad.",
                targets: "Cinfa, Sanitas, Laboratorios"
              }
            ].map((v, i) => (
              <Link key={i} href={v.href} className="relative p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] space-y-8 group hover:bg-[#ecb613]/5 hover:border-[#ecb613]/20 transition-all block">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-[#ecb613] transition-colors">{v.title}</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{v.concept}</p>
                </div>
                <p className="text-white/50 text-lg italic leading-relaxed">"{v.hook}"</p>
                <div className="pt-8 border-t border-white/5">
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Interlocutores Institucionales:</p>
                  <p className="text-[#ecb613] font-bold text-sm italic">{v.targets}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bio Section */}
        <div className="max-w-7xl mx-auto p-20 bg-white/[0.01] border border-white/5 rounded-[5rem] grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Director de Intervención</p>
              <h3 className="text-6xl font-black uppercase italic tracking-tighter">Edwin Agudelo</h3>
            </div>
            <p className="text-white/40 text-xl italic leading-relaxed font-medium">
              "He colaborado en grandes proyectos culturales; ahora aplico esa capacidad técnica profesional para generar impacto social allí donde más se necesita."
            </p>
            <Link 
              href={ROUTES.dossier}
              className="px-10 py-5 bg-[#ecb613] text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_50px_rgba(236,182,19,0.3)] inline-block w-fit"
            >
              Consultar Ficha Técnica
            </Link>
          </div>
          <div className="bg-white/5 rounded-[4rem] p-16 space-y-12">
            <h4 className="text-xl font-black uppercase tracking-widest text-white/30">Autoridad & Confianza</h4>
            <div className="space-y-8">
              {[
                { title: "Foso Moral", desc: "Honestidad Radical. No tenemos la burocracia de las grandes ONGs. Cada euro va directo a la intervención." },
                { title: "Autoridad Artística", desc: "Transferencia de competencia desde los escenarios de élite al cuidado humano." },
                { title: "Método Institucional", desc: "No hacemos 'conciertos'. Aplicamos el protocolo Vimume (Diagnóstico, Intervención, Evaluación)." }
              ].map((r, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-1.5 h-1.5 bg-[#ecb613] rounded-full mt-2" />
                  <div className="space-y-1">
                    <p className="font-black text-sm uppercase tracking-widest">{r.title}</p>
                    <p className="text-white/40 text-sm italic font-medium">"{r.desc}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function HomeTabs() {
  const [activeTab, setActiveTab] = React.useState('servicios');

  const tabs = [
    { id: 'servicios', label: 'Servicios', icon: Sparkles },
    { id: 'casos', label: 'Casos Clínicos', icon: FileText },
    { id: 'evidencia', label: 'Evidencia', icon: ShieldCheck },
    { id: 'vimume', label: 'VIMUME', icon: Brain }
  ];

  return (
    <div className="space-y-16">
      <div className="flex flex-wrap justify-center gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? "bg-[#ecb613] text-black shadow-[0_0_30px_rgba(236,182,19,0.3)]" 
                : "bg-white/5 text-white/40 hover:bg-white/10"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid lg:grid-cols-2 gap-12 items-center p-12 bg-white/[0.02] border border-white/5 rounded-[4rem]"
        >
          {activeTab === 'servicios' && (
            <>
              <div className="space-y-8">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  Catálogo de <br/><span className="text-[#ecb613]">Alta Especialización</span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed italic">
                  Desde galas institucionales hasta intervenciones de patrimonio musical. Cada servicio es un nodo de excelencia técnica.
                </p>
                <Link href={ROUTES.servicios} className="inline-block px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613] hover:text-black transition-all">
                  Explorar todos los servicios
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Institucional', 'Corporativo', 'Patrimonio', 'Social'].map((n) => (
                  <div key={n} className="p-8 bg-white/5 border border-white/5 rounded-3xl text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">{n}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === 'casos' && (
            <>
              <div className="space-y-8">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  Historias de <br/><span className="text-[#ecb613]">Éxito Real</span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed italic">
                  Documentación detallada de intervenciones en residencias, hospitales y eventos de alto perfil.
                </p>
                <Link href={ROUTES.blogCasos} className="inline-block px-10 py-5 bg-[#ecb613] text-black rounded-full text-[10px] font-black uppercase tracking-widest">
                  Ver Casos Clínicos
                </Link>
              </div>
              <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 italic text-white/30 text-sm leading-relaxed">
                "La mejora en los niveles de cortisol y la reducción de agitación en pacientes con demencia avanzada tras la intervención VIMUME es nuestra mayor métrica de éxito."
              </div>
            </>
          )}
          {activeTab === 'evidencia' && (
            <>
              <div className="space-y-8">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  Rigor <br/><span className="text-[#ecb613]">Científico</span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed italic">
                  Base técnica respaldada por investigación neurológica y protocolos de intervención auditados.
                </p>
                <Link href={ROUTES.blogInvestigacion} className="inline-block px-10 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Consultar Investigación
                </Link>
              </div>
              <ul className="space-y-6">
                {['Protocolo VIMUME v2.0', 'Validación por Pares', 'Métricas de Impacto'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-white/60">
                    <ShieldCheck size={16} className="text-[#ecb613]" /> {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {activeTab === 'vimume' && (
            <>
              <div className="space-y-8">
                <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  El Buque <br/><span className="text-[#ecb613]">Insignia</span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed italic">
                  VIMUME: Viaje Musical. La infraestructura de memoria que está transformando el sector sociosanitario.
                </p>
                <Link href={ROUTES.vimume} className="inline-block px-10 py-5 bg-[#ecb613] text-black rounded-full text-[10px] font-black uppercase tracking-widest">
                  Entrar en VIMUME OS
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-[#ecb613]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-12 bg-white/5 border border-white/10 rounded-[3rem] text-center">
                  <Brain size={64} className="text-[#ecb613] mx-auto mb-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Arquitectura de Memoria</span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
