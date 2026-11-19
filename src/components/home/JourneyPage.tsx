'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Flame, Moon, Snowflake, Sun, Sparkles } from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { CONNECTORS, DOORS, ECOSYSTEM_SECTORS } from '@/lib/catalog/ecosystem-ontology';
import type { DoorId } from '@/lib/catalog/ecosystem-ontology';
import { JOURNEYS } from '@/lib/catalog/journey-content';
import type { LeadTemp, TempCta } from '@/lib/catalog/journey-content';

type Mode = 'dark' | 'light';

const PALETTE: Record<Mode, Record<string, string>> = {
  dark: {
    '--bg': '#030305', '--card': '#0A0A0E', '--line': '#1E1E26', '--fg': '#FFFFFF', '--muted': '#94A3B8', '--gold': '#D4AF37', '--on-gold': '#030305',
  },
  light: {
    '--bg': '#FAF8F3', '--card': '#FFFFFF', '--line': '#E7E2D6', '--fg': '#14141A', '--muted': '#5B6472', '--gold': '#9A7B1C', '--on-gold': '#FFFFFF',
  },
};

const TEMPS: readonly { id: LeadTemp; label: string; hint: string; Icon: typeof Flame }[] = [
  { id: 'COLD', label: 'Explorando', hint: 'Solo estoy mirando', Icon: Snowflake },
  { id: 'WARM', label: 'Comparando', hint: 'Tengo una idea y quiero precios', Icon: Sun },
  { id: 'HOT', label: 'Listo para cerrar', hint: 'Tengo fecha y quiero reservar', Icon: Flame },
];

const NEXT_ACTION: Record<LeadTemp, string> = {
  COLD: 'Le enseñamos ejemplos reales antes de pedirle nada.',
  WARM: 'Le llevamos al presupuesto con precio en tiempo real.',
  HOT: `Le atendemos por WhatsApp y bloqueamos su fecha con ${DEPOSITO_STRIPE_EUR} € de fianza deducible.`,
};

function waUrl(text: string): string {
  const digits = CENTRALITA_EAR_OS.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

function CtaLink({ cta, className, onClick }: { cta: TempCta; className: string; onClick?: () => void }): React.JSX.Element {
  if (cta.href.startsWith('WA:')) {
    return (
      <a href={waUrl(cta.href.slice(3))} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {cta.label} <ArrowRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <Link href={cta.href} className={className} onClick={onClick}>
      {cta.label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function JourneyPage({ door }: { door: DoorId }): React.JSX.Element {
  const def = DOORS[door];
  const content = JOURNEYS[door];
  const sectors = useMemo(() => ECOSYSTEM_SECTORS.filter((s) => s.primaryDoor === door), [door]);

  const [mode, setMode] = useState<Mode>('dark');
  const [temp, setTemp] = useState<LeadTemp>('COLD');
  const [manualTemp, setManualTemp] = useState(false);
  const [active, setActive] = useState(0);

  const stepRefs = useRef<(HTMLElement | null)[]>([]);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('ear_journey_theme');
    if (saved === 'light' || saved === 'dark') setMode(saved);
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) setMode('light');
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => {
      const next: Mode = m === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem('ear_journey_theme', next);
      return next;
    });
  }, []);

  // Parallax del hero y barra de progreso del viaje.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '25%']);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroOpacity = useTransform(heroProgress, [0, 0.9], [1, 0.25]);

  // Etapa activa por scroll (scrollytelling).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Temperatura inferida por profundidad de viaje, salvo que el visitante la fije.
  useEffect(() => {
    if (manualTemp) return;
    setTemp(active >= 3 ? 'HOT' : active >= 1 ? 'WARM' : 'COLD');
  }, [active, manualTemp]);

  const chooseTemp = useCallback((t: LeadTemp) => {
    setManualTemp(true);
    setTemp(t);
  }, []);

  const goTo = useCallback((idx: number) => {
    stepRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const stage = content.stages[active];
  const style = PALETTE[mode] as React.CSSProperties;
  const gold = 'bg-[var(--gold)] text-[var(--on-gold)]';

  return (
    <div style={style} className="min-h-screen bg-[var(--bg)] text-[var(--fg)] transition-colors duration-500">
      <motion.div style={{ scaleX: progress }} className="fixed left-0 right-0 top-0 z-50 h-[3px] origin-left bg-[var(--gold)]" />

      {/* Barra superior adaptativa */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 text-[13px]">
          <Link href="/" className="font-semibold">EAR OS</Link>
          <Link href="/vimume" className="text-[var(--gold)]">VIMUME</Link>
          <nav aria-label="Menú de sección" className="flex flex-wrap gap-x-5 gap-y-1 text-[var(--muted)]">
            {def.menu.map((m) => (
              <Link key={m.label} href={m.href} className="hover:text-[var(--fg)]">{m.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMode}
              aria-label={mode === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] hover:border-[var(--gold)]"
            >
              {mode === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <a
              href={waUrl('Hola, quiero hablar con EAR OS.')}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-4 py-2 text-[13px] font-medium ${gold}`}
            >
              Hablar ahora
            </a>
          </div>
        </div>
      </header>

      {/* Hero con parallax */}
      <section ref={heroRef} className="relative h-[88vh] min-h-[560px] overflow-hidden">
        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="absolute inset-0">
          <Image src={content.heroImage} alt={content.heroAlt} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/55 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-5 pb-16">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-[12px] uppercase tracking-widest text-[var(--gold)]">
            {def.title}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 max-w-3xl text-[clamp(26px,4.5vw,46px)] font-semibold leading-[1.1] tracking-[-0.02em]"
          >
            {content.headline}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-4 max-w-xl text-[15px] leading-[1.5] text-[var(--muted)]">
            {content.lead}
          </motion.p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" onClick={() => goTo(0)} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium ${gold}`}>
              Empezar el recorrido <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={waUrl(`Hola, quiero que el asistente me guíe para ${def.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--card)]/70 px-5 py-3 text-[13px] font-medium hover:border-[var(--gold)]"
            >
              <Sparkles className="h-4 w-4 text-[var(--gold)]" /> Que me guíe el asistente
            </a>
          </div>
        </div>
      </section>

      {/* Termómetro del visitante */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">¿En qué punto está?</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Momento del visitante">
          {TEMPS.map(({ id, label, hint, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={temp === id}
              onClick={() => chooseTemp(id)}
              className={`rounded-xl border p-4 text-left transition-colors ${temp === id ? 'border-[var(--gold)] bg-[var(--card)]' : 'border-[var(--line)] hover:border-[var(--gold)]'}`}
            >
              <span className="flex items-center gap-2 text-[15px] font-medium"><Icon className="h-4 w-4 text-[var(--gold)]" />{label}</span>
              <span className="mt-1 block text-[13px] leading-[1.5] text-[var(--muted)]">{hint}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={temp} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-[13px] leading-[1.5] text-[var(--muted)]">
            {NEXT_ACTION[temp]}
          </motion.p>
        </AnimatePresence>
      </section>

      {/* Scrollytelling del viaje */}
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="sticky top-28 h-[70vh] overflow-hidden rounded-2xl border border-[var(--line)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image src={stage.image} alt={stage.imageAlt} fill sizes="50vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-5 left-5 text-[12px] uppercase tracking-widest text-white">{stage.kicker}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              {content.stages.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Ir a ${s.title}`}
                  onClick={() => goTo(i)}
                  className={`h-2.5 w-2.5 rounded-full border border-white/70 ${i === active ? 'bg-white' : 'bg-transparent'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-[18vh] lg:py-[10vh]">
          {content.stages.map((s, i) => (
            <motion.article
              key={s.id}
              id={s.id}
              data-idx={i}
              ref={(el) => { stepRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6 }}
              className="scroll-mt-28"
            >
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--line)] lg:hidden">
                <Image src={s.image} alt={s.imageAlt} fill sizes="100vw" className="object-cover" />
              </div>
              <p className="text-[12px] uppercase tracking-widest text-[var(--gold)]">{s.kicker}</p>
              <h2 className="mt-2 text-[clamp(20px,2.4vw,26px)] font-semibold leading-tight tracking-[-0.02em]">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-[1.5] text-[var(--muted)]">{s.body}</p>
              <ul className="mt-4 space-y-2 text-[13px] leading-[1.5]">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />{b}</li>
                ))}
              </ul>
              <div className="mt-6">
                <CtaLink cta={s.ctas[temp]} className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium ${gold}`} />
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Así se ve el trabajo</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {content.gallery.map((g, i) => (
            <motion.div
              key={g.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--card)]"
            >
              <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Categorías y conectores */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-[15px] font-medium tracking-[-0.01em]">Categorías de esta puerta</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {sectors.map((s) => (
            <div key={s.id} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-5">
              <h3 className="text-[15px] font-medium tracking-[-0.01em]">{s.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {s.categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={c.href}
                      className="inline-block rounded-full border border-[var(--line)] px-3 py-1.5 text-[12px] text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--fg)]"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-[15px] font-medium tracking-[-0.01em]">Cómo puede participar</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CONNECTORS.map((k) => (
            <Link key={k.id} href={k.href} className="rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--gold)]">
              <span className="text-[12px] text-[var(--gold)]">{k.label} →</span>
              <p className="mt-1 text-[13px] leading-[1.5] text-[var(--muted)]">{k.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section className="border-t border-[var(--line)] bg-[var(--card)]">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[18px] font-semibold tracking-[-0.02em]">¿Hablamos?</h2>
            <p className="mt-1 text-[13px] leading-[1.5] text-[var(--muted)]">Respuesta humana por WhatsApp. Sin compromiso.</p>
          </div>
          <CtaLink cta={stage.ctas[temp]} className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium ${gold}`} />
        </div>
      </section>
    </div>
  );
}
