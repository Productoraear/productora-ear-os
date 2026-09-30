import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Phone,
  MessageCircle,
  Lock,
  Star,
  MapPin
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';

export const revalidate = 900; // 15 min ISR

export const metadata: Metadata = {
  title: 'DJ para Bodas ® | Contratación Directa de DJs Homologados (Depósito 100€ Price-Lock) | Productora EAR',
  description: 'Los mejores DJs para bodas en España con cabina Pioneer, sonido Bose calibrado a 12 W/pax, iluminación robótica y garantía 0% cancelaciones. Congela tu fecha con 100 € en Stripe (Split Soberano 80/10/10). Contacto directo: +34 693 693 048.',
  keywords: [
    'dj para bodas',
    'dj bodas espana',
    'contratar dj boda',
    'dj para bodas precios',
    'dj profesional bodas madrid',
    'musica barra libre boda',
    'discoteca movil bodas'
  ],
  alternates: {
    canonical: 'https://productoraear.com/bodas/dj'
  },
  openGraph: {
    title: 'DJ para Bodas ® | Pista Llena Garantizada y Sonido de Festival | Productora EAR',
    description: 'Cabina Pioneer, sonido Bose 12 W/pax, microfonía Shure y repertorio a la carta. Reserva con depósito protegido de 100 €.',
    url: 'https://productoraear.com/bodas/dj',
    siteName: 'Productora EAR',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'DJ Profesional para Bodas y Eventos'
      }
    ],
    locale: 'es_ES',
    type: 'website'
  }
};

// Carga de DJs reales desde el data lake
function getCuratedDJs(): any[] {
  try {
    const musicaPath = path.join(process.cwd(), 'public', 'data', 'providers', 'musica.json');
    if (fs.existsSync(musicaPath)) {
      const data = JSON.parse(fs.readFileSync(musicaPath, 'utf8'));
      return data
        .filter((p: any) =>
          (p.gremioTag === 'dj') ||
          (p.category && p.category.toLowerCase().includes('dj')) ||
          (p.name && p.name.toLowerCase().includes('dj'))
        )
        .slice(0, 18);
    }
  } catch (err) {
    console.warn('Error leyendo musica.json:', err);
  }
  return [];
}

export default async function DjParaBodasMasterPage() {
  const djs = getCuratedDJs();
  const provinces = Object.entries(PROVINCIAS_52_GRAPH).map(([slug, data]) => ({
    slug,
    name: data.name
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Servicio de DJ Profesional para Bodas',
    description: 'Contratación de DJs profesionales para bodas con cabina Pioneer, sonorización 12 W/pax y depósito de 100 €.',
    url: 'https://productoraear.com/bodas/dj',
    telephone: '+34 693 693 048',
    email: 'productoraear@gmail.com',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Productora EAR OS',
      telephone: '+34 693 693 048',
      email: 'productoraear@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ES'
      }
    },
    areaServed: {
      '@type': 'Country',
      name: 'España'
    },
    offers: {
      '@type': 'Offer',
      price: '450',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      description: 'Pack Completo de DJ para Bodas (4h barra libre + sonido Bose + puente luces)'
    }
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black font-sans pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 👑 BREADCRUMB CANÓNICO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-4">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/bodas" className="hover:text-zinc-300 transition-colors">Bodas</Link>
          <span>/</span>
          <span className="text-[#ecb613] font-bold">DJs para Bodas</span>
        </nav>
      </div>

      {/* ⚡ HERO / HOOK HORMOZI ($100M OFFER) */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-12">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#08080c] p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Badges de Urgencia & Confianza */}
          <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              GRAND SLAM OFFER // COBERTURA NACIONAL
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              GARANTÍA 0% CANCELACIONES (RELEVO UBER)
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-black/60 backdrop-blur-md text-white border border-white/20">
              DEPÓSITO 100 € PRICE-LOCK
            </span>
          </div>

          {/* Titular de Máximo Deseo (Dream Outcome) */}
          <div className="relative z-10 max-w-4xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-mono uppercase leading-tight">
              DJs PARA BODAS CON <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-amber-200">PISTA LLENA</span> DE 00:00 A 06:00
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed max-w-3xl">
              Olvídate del DJ que vacía la fiesta poniendo sus temas favoritos. Contrata a un DJ profesional homologado con 
              <strong className="text-white"> psicología de pista en tiempo real</strong>, cabina Pioneer, sonorización Bose calibrada para no atronar en las mesas, iluminación robótica y música a la carta sin interrupciones.
            </p>
          </div>

          {/* Barra de Acciones Directas */}
          <div className="relative z-10 flex flex-wrap items-center gap-4 pt-8">
            <a
              href="/checkout/presupuesto?servicio=dj"
              className="px-8 py-4 rounded-xl bg-[#ecb613] hover:bg-[#d8a510] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#ecb613]/25 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Bloquear DJ con 100 € (Stripe)
            </a>

            <a
              href={`https://wa.me/34693693048?text=${encodeURIComponent('Hola Edwin, deseo consultar disponibilidad y presupuesto para un DJ de boda.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Directo (+34 693 693 048)
            </a>

            <a
              href="tel:+34693693048"
              className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#ecb613]" />
              Centralita 24h
            </a>
          </div>

          {/* Métricas de Rendimiento */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-6 border-t border-white/10 text-xs font-mono">
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">TARIFA COMPLETA</span>
              <span className="text-xl sm:text-2xl font-bold text-[#ecb613]">Desde 450 €</span>
              <span className="text-[10px] text-zinc-400 block">4h barra libre + sonido</span>
            </div>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">SEÑAL BLINDADA</span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-400">100 €</span>
              <span className="text-[10px] text-zinc-400 block">Stripe Price-Lock 72h</span>
            </div>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">POTENCIA ACÚSTICA</span>
              <span className="text-xl sm:text-2xl font-bold text-white">12 W / pax</span>
              <span className="text-[10px] text-zinc-400 block">Bose F1 / Shure Beta</span>
            </div>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5">
              <span className="text-zinc-500 block text-[10px] uppercase">GARANTÍA RELEVO</span>
              <span className="text-xl sm:text-2xl font-bold text-white">0% Fallos</span>
              <span className="text-[10px] text-zinc-400 block">Sustitución en &lt; 45 min</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 BENTO GRID: LOS 3 DOLORES DE LOS NOVIOS RESUELTOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="border-b border-white/10 pb-4 mb-8">
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold block mb-1">
            INTENCIÓN RESUELTA // ANTI-ESTRÉS NUPCIAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white uppercase">
            LO QUE REALMENTE TE PREOCUPA DE CONTRATAR UN DJ, 100% BLINDADO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-[#08080c] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              ¿Y si el DJ pone su música y vacía la pista?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Reunión previa de gustos musicales, lista de canciones imprescindibles y <strong className="text-white">lista negra de canciones prohibidas</strong>. En cabina, el DJ lee la edad y energía del público minuto a minuto para mantener la pista encendida.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pista llena garantizada
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#08080c] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              ¿Y si el sonido atrona o salta el limitador de la finca?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Calibramos a <strong className="text-white">12 W/pax con sistemas Bose</strong>. El sonido tiene pegada cristalina en la zona de baile pero permite conversar cómodamente en las mesas, cumpliendo rigurosamente los decibelios de la normativa municipal.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cero multas ni cortes de luz
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[#08080c] border border-white/10 space-y-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold font-mono text-white">
              ¿Y si cancela a última hora por una fiesta mejor?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Contrato con Productora EAR y depósito inmutable de 100 € en Stripe. Si surgiese cualquier imprevisto médico o de fuerza mayor, se activa el <strong className="text-white">Protocolo de Relevo Homologado</strong> con un DJ sustituto de igual caché en menos de 45 min.
            </p>
            <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 0% cancelaciones
            </div>
          </div>
        </div>
      </section>

      {/* 📦 EL GRAND SLAM VALUE STACKER ($100M OFFER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl border border-[#ecb613]/40 bg-[#08080c] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5" />
              EL VALOR COMPLETO DEL SERVICIO (HORMOZI STACK)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white uppercase">
              TODO LO QUE ESTÁ INCLUIDO EN TU BODA
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Desglose transparente del equipo y los servicios sin costes sorpresa
            </p>
          </div>

          <ul className="space-y-3">
            {[
              { label: 'DJ Especialista en Bodas (4h completas de barra libre con mezclas en directo)', value: 850 },
              { label: 'Cabina de DJ Profesional Pioneer Nexus / Denon Prime con mesa de mezclas', value: 450 },
              { label: 'Sonorización Bose F1 / ShowMatch 12 W/pax (Sonido envolvente sin fatiga auditiva)', value: 600 },
              { label: 'Puente de Iluminación Robótica LED DMX & Focos Par para ambientación de pista', value: 400 },
              { label: 'Pareja de Micrófonos Shure Beta 58 Inalámbricos para discursos y momentos clave', value: 200 },
              { label: 'Póliza de Responsabilidad Civil de 1.000.000 € y calibración de limitador acústico', value: 200 },
              { label: 'Sesión de asesoría musical previa + confección de playlist personalizada', value: 200 }
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-black/50 border border-white/5 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] text-[10px] font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-zinc-200">{item.label}</span>
                </div>
                <span className="text-white font-bold shrink-0">{item.value.toLocaleString('es-ES')} €</span>
              </li>
            ))}
          </ul>

          {/* Sumatorio y Comparativa */}
          <div className="mt-6 p-5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
            <div>
              <span className="text-xs text-zinc-400 uppercase tracking-widest block">VALOR ACUMULADO DEL PAQUETE</span>
              <span className="text-2xl sm:text-3xl font-black text-zinc-400 line-through">2.900 €</span>
            </div>
            <div className="sm:text-right">
              <span className="text-xs text-[#ecb613] uppercase tracking-widest font-bold block">TARIFA S-CLASS EAR OS</span>
              <span className="text-3xl sm:text-4xl font-black text-white">Desde 450 €</span>
              <span className="text-[10px] text-emerald-400 block font-bold">Reserva hoy con depósito de 100 €</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🌍 SELECTOR DE PROVINCIAS (52 PROVINCIAS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
            SELECCIONA TU PROVINCIA PARA ENCONTRAR DJS LOCALES
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Cobertura nacional en toda España con tarifas logísticas fijadas desde 0€
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {provinces.map((prov) => (
            <Link
              key={prov.slug}
              href={`/bodas/${prov.slug}/dj`}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-[#ecb613] hover:text-[#ecb613] text-xs font-mono text-zinc-300 transition-colors"
            >
              {prov.name}
            </Link>
          ))}
        </div>
      </section>

      {/* 🎧 ROSTER DE DJS HOMOLOGADOS EN ACTIVO */}
      {djs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="border-b border-white/10 pb-4 mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
                DJS HOMOLOGADOS DISPONIBLES ({djs.length})
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Perfiles verificados de la red nacional Productora EAR
              </p>
            </div>
            <Link
              href="/proveedores?gremio=dj"
              className="text-xs font-mono text-[#ecb613] hover:underline font-bold"
            >
              Ver Directorio Completo →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {djs.map((dj: any, i: number) => {
              const coverImg = (dj.imageUrls && dj.imageUrls[0]) || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop';
              const locationText = dj.location?.province || dj.province || 'España';
              const rating = dj.rating || 4.9;

              return (
                <div
                  key={dj.id || dj.slug || i}
                  className="rounded-2xl bg-[#08080c] border border-white/10 overflow-hidden hover:border-[#ecb613]/50 transition-all flex flex-col justify-between p-5 space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                      <img
                        src={coverImg}
                        alt={dj.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> VERIFICADO
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#ecb613]" /> {locationText}</span>
                        <span className="flex items-center gap-1 text-amber-300 font-bold"><Star className="w-3 h-3 fill-amber-300" /> {rating}</span>
                      </div>
                      <h3 className="text-base font-bold font-mono text-white truncate">{dj.name}</h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-sans">
                        {dj.description || 'Especialista en bodas de gala, sesiones de barra libre y animación de pista con equipo propio Bose y Pioneer.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="font-mono">
                      <span className="text-[10px] text-zinc-500 block">TARIFA DESDE</span>
                      <span className="text-sm font-bold text-[#ecb613]">{dj.basePrice ? `${dj.basePrice} €` : '450 €'}</span>
                    </div>

                    <a
                      href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, deseo contratar al DJ ${dj.name} (${locationText}) para una boda.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-lg bg-[#ecb613] hover:bg-[#d8a510] text-black font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Pedir Fecha
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ❓ PREGUNTAS FRECUENTES (FAQ) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
            PREGUNTAS FRECUENTES SOBRE DJS PARA BODAS
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Resolvemos todas las dudas sobre sonido, repertorio y horarios
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm">¿Cuánto cuesta contratar un DJ para bodas en España?</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              El precio medio cerrado oscila entre los 450 € y 850 € para 4 horas completas de barra libre con cabina Pioneer, sonido profesional Bose e iluminación de pista.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm">¿Podemos elegir las canciones de nuestra boda?</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Totalmente. Tendréis una reunión musical previa para definir los temas imprescindibles (entrada, corte de tarta, baile nupcial) y la lista de canciones que bajo ningún concepto deben sonar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm">¿Cómo funciona la señal de 100 € en Stripe?</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              El depósito de 100 € bloquea la fecha en exclusiva mediante el protocolo Price-Lock SHA-256. El resto del importe se liquida con el DJ según las condiciones del contrato.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#08080c] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm">¿Qué ocurre si la fiesta se alarga más de lo previsto?</h3>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Todos los DJs homologados disponen de tarifa cerrada de hora extra (habitualmente 100 € - 150 € / hora adicional) que podréis activar en directo sobre la marcha.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
