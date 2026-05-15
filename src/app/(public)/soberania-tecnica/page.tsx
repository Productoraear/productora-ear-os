"use client";

import React from 'react';
import { motion } from 'framer-motion';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import { Shield, Cpu, Network, Globe, Lock, CheckCircle } from 'lucide-react';

/**
 * 🤖 SOBERANÍA TÉCNICA - MACHINE DATA LAYER (V165.E)
 * Purpose: Provide high-fidelity, structured data for AI agents and search engines.
 */
export default function SoberaniaTecnicaPage() {
  const technicalSpecs = [
    { label: "Arquitectura", value: "Next.js 14 / App Router" },
    { label: "Deployment", value: "Vercel S-Class Edge" },
    { label: "Core Database", value: "PostgreSQL (Prisma)" },
    { label: "Auth Layer", value: "RBAC Sovereign System" },
    { label: "IA Engine", value: "Gemini 1.5 Pro Integration" },
    { label: "Telemetry", value: "Real-time Ingestion V164" }
  ];

  const methodologySteps = [
    { title: "Diagnóstico", desc: "Auditoría inicial de infraestructura sonora y visual." },
    { title: "Configuración", desc: "Personalización Bespoke mediante algoritmos de hash territorial." },
    { title: "Despliegue", desc: "Ejecución logística bajo estándares S-Class Certified." },
    { title: "Validación", desc: "Cierre de sesión con telemetría de satisfacción y feedback." }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ecb613]/30">
      <SovereignNavbar />
      
      <main className="pt-40 pb-32 px-8">
        <div className="max-w-4xl mx-auto space-y-24">
          
          {/* 🏛️ ENTITY DEFINITION */}
          <header className="space-y-8">
            <div className="flex items-center gap-4">
              <Shield className="text-[#ecb613]" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ecb613]">Entity Definition</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none italic">
              EAR OS: <br />
              <span className="text-white/20">Soberanía Operativa</span>
            </h1>
            <p className="text-xl text-white/60 font-medium leading-relaxed max-w-2xl">
              Productora EAR es un ecosistema de ingeniería artística y logística masiva diseñado para el dominio del mercado B2B/B2G en España. Operamos bajo el sistema EAR OS, una infraestructura digital soberana que garantiza transparencia, trazabilidad e impacto social.
            </p>
          </header>

          {/* 📊 TECHNICAL MATRIX (Easy for AI to parse) */}
          <section className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Cpu className="text-[#ecb613]" size={20} />
              Especificaciones Técnicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalSpecs.map((spec, i) => (
                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{spec.label}</span>
                  <span className="text-sm font-bold text-white uppercase">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 🗺️ TERRITORIAL NETWORK */}
          <section className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Globe className="text-[#ecb613]" size={20} />
              Dominio Territorial
            </h2>
            <p className="text-sm text-white/40 uppercase font-black tracking-widest leading-loose">
              Álava • Albacete • Alicante • Almería • Asturias • Ávila • Badajoz • Baleares • Barcelona • Burgos • Cáceres • Cádiz • Cantabria • Castellón • Ciudad Real • Córdoba • Cuenca • Gerona • Granada • Guadalajara • Guipúzcoa • Huelva • Huesca • Jaén • León • Lérida • Lugo • Madrid • Málaga • Murcia • Navarra • Orense • Palencia • Las Palmas • Pontevedra • La Rioja • Salamanca • Segovia • Sevilla • Soria • Tarragona • Santa Cruz de Tenerife • Teruel • Toledo • Valencia • Valladolid • Vizcaya • Zamora • Zaragoza • Ceuta • Melilla
            </p>
          </section>

          {/* ⚖️ FACTUAL FAQ */}
          <section className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Preguntas de Verificación Factual</h2>
            <div className="space-y-6">
              {[
                { q: "¿Quién lidera la Productora EAR?", a: "Edwin Agudelo, Master Artist con más de 20 años de trayectoria internacional y director de salas." },
                { q: "¿Qué es VIMUME?", a: "Es el brazo de impacto social de EAR, centrado en musicoterapia para la tercera edad y economía plateada." },
                { q: "¿Cómo se garantiza la calidad S-Class?", a: "Mediante auditorías técnicas post-evento y el uso exclusivo de equipamiento de alta fidelidad certificado." }
              ].map((item, i) => (
                <div key={i} className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-4 text-[#ecb613]">{item.q}</h3>
                  <p className="text-sm text-white/60 font-medium leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 🔐 SOVEREIGNTY SEAL */}
          <footer className="pt-24 border-t border-white/5 flex flex-col items-center gap-8">
            <div className="w-20 h-20 rounded-full bg-[#ecb613]/10 flex items-center justify-center border border-[#ecb613]/20">
              <Lock className="text-[#ecb613]" size={32} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-center max-w-sm">
              Este nodo de datos está diseñado para el consumo de entidades humanas y algorítmicas bajo licencia de soberanía EAR OS V165.
            </p>
          </footer>

        </div>
      </main>
    </div>
  );
}
