'use client';

import React, { useState } from 'react';

export default function EAR_OS_MasterDashboard() {
  const [activeTab, setActiveTab] = useState<'ear' | 'vimume' | 'pricing' | 'oracle'>('ear');

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      {/* HEADER ECOSISTEMA EROS */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              PRODUCTORA EAR :: OS V2
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Sistema Operativo de Inferencia Soberana & Gestión Multivertical
          </p>
        </div>

        {/* NAVEGACIÓN POR PANELES */}
        <nav className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl gap-2">
          <button
            onClick={() => setActiveTab('ear')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'ear'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Productora EAR
          </button>
          <button
            onClick={() => setActiveTab('vimume')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'vimume'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            VIMUME (Musicoterapia)
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'pricing'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tarificación & Cotizador
          </button>
          <button
            onClick={() => setActiveTab('oracle')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'oracle'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Oráculo AI Local
          </button>
        </nav>
      </header>

      {/* CONTENIDO DINÁMICO */}
      <section className="max-w-7xl mx-auto">
        {activeTab === 'ear' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-cyan-400 mb-2">Producción Musical & Eventos</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Infraestructura 360° para conciertos, eventos privados y mariachi en directo. Cobertura completa de sonido e iluminación profesional.
              </p>
              <div className="text-xs text-slate-500 font-mono">Status: En vivo | Hardware XR18 / Bose Line Array</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Plataforma Fincas para Bodas</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Vertical especializada para gestión de proveedores, espacio de celebración y agendas integradas.
              </p>
              <div className="text-xs text-slate-500 font-mono">Status: Sincronizado con Supabase DB</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-amber-400 mb-2">Bóveda Soberana de Datos</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Más de 569,000 activos y 592 mapas mentales indexados en la Unidad D: para inferencia de bajo nivel.
              </p>
              <div className="text-xs text-slate-500 font-mono">Status: 100% Auditado | Genoma Activo</div>
            </div>
          </div>
        )}

        {activeTab === 'vimume' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-emerald-400">VIMUME :: Viaje Musical por la Memoria</h2>
                <p className="text-slate-400 text-sm">Proyecto de Musicoterapia Estimulante para Adultos Mayores</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full text-xs font-semibold">
                Módulo Clínico Activo
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              VIMUME integra repertorios musicales personalizados, boleros, baladas y rancheras clásicas con dinámicas de estimulación cognitiva para la recuperación de la memoria afectiva y sensorial en centros especializados.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Estructura Operativa</span>
                <span className="text-slate-400 text-xs">Sesiones interactivas con instrumentación acústica e ingesta de datos de impacto emocional.</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Vehículo Jurídico</span>
                <span className="text-slate-400 text-xs">Modelado para gestión bajo Asociación sin Ánimo de Lucro.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-amber-400 mb-2">Calculadora de Presupuestos & Pricing</h2>
            <p className="text-slate-400 text-sm mb-6">Generador dinámico de propuestas comerciales según equipamiento, horas y formato del show.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Formato Dúo / Acústico</div>
                <div className="text-2xl font-black text-amber-400">Desde 350 €</div>
              </div>
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Mariachi Show Completo</div>
                <div className="text-2xl font-black text-amber-400">Desde 750 €</div>
              </div>
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Montaje 360° + Sonido Bose</div>
                <div className="text-2xl font-black text-amber-400">Según Escenario</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oracle' && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-2">Oráculo AI :: Inferencia Soberana Ollama</h2>
            <p className="text-slate-400 text-sm mb-6">Conexión local con Qwen2.5-Coder y DeepSeek-R1 sobre la Unidad H:</p>
            
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-emerald-400">✓ Ollama Server: http://localhost:11434 (Active)</div>
              <div className="text-cyan-400">✓ Target Models: qwen2.5-coder-14b, deepseek-r1-14b, qwen2.5-vl-7b</div>
              <div className="text-slate-500">Endpoint activo en /api/oracle/infer para llamadas asíncronas desde componentes.</div>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER BÚNKER */}
      <footer className="max-w-7xl mx-auto mt-16 pt-6 border-t border-slate-800 flex justify-between text-xs text-slate-500">
        <div>PRODUCTORA EAR © 2026 — Todos los derechos reservados</div>
        <div className="font-mono">EAR_OS_V2 // Target Build: Vercel MVP</div>
      </footer>
    </main>
  );
}