"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Percent, ArrowLeft, ShieldCheck, QrCode, 
  Settings, CreditCard, Activity, Link as LinkIcon, 
  Gift, AlertTriangle, ChevronRight, Zap, Target
} from 'lucide-react';

export default function AffiliateEngineV12() {
  const [activeTab, setActiveTab] = useState<'rules' | 'attribution' | 'fraud' | 'payouts'>('rules');

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Cabecera Táctica */}
        <header className="flex justify-between items-center border-b border-[#1f1f1f] pb-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#8e44ad] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Centro de Mando
          </Link>
          <div className="flex items-center gap-2 bg-[#121212] border border-[#222] px-3 py-1 rounded-lg text-xs font-mono text-[#8e44ad]">
            <Zap className="w-3.5 h-3.5 text-[#d4ac0d] animate-pulse" /> Motor V12 Operativo
          </div>
        </header>

        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8e44ad] bg-[#8e44ad]/10 px-3 py-1 rounded-full mb-3 border border-[#8e44ad]/30">
            <Percent className="w-3.5 h-3.5" /> Affiliate Core Restaurado
          </div>
          <h1 className="text-3xl font-black text-white">EAR OS // Affiliate Core</h1>
          <p className="text-gray-400 text-sm mt-1 max-w-3xl">
            Control absoluto de reglas de comisionamiento, atribución offline por cupones/QR, detección de anomalías y compensación Stripe Connect.
          </p>
        </div>

        {/* Pestañas de Navegación del Motor */}
        <div className="flex border-b border-[#1f1f1f] gap-6">
          {[
            { id: 'rules', label: 'Smart Rules & Tiers', icon: Target },
            { id: 'attribution', label: 'Cupones & QR (Offline)', icon: QrCode },
            { id: 'fraud', label: 'Escudo Anti-Fraude', icon: ShieldCheck },
            { id: 'payouts', label: 'Clearing & Stripe', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab.id ? 'border-[#8e44ad] text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Smart Rules */}
        {activeTab === 'rules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
            <div className="bg-[#080808] border border-[#1f1f1f] p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Multi-Level Tiers</h3>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono px-2 py-1 rounded border border-emerald-500/20">ACTIVO</span>
              </div>
              <div className="space-y-3">
                <div className="bg-[#0e0e0e] border border-[#1a1a1a] p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-[#d4ac0d]">S-Class Partner</div>
                    <div className="text-xs text-gray-500 font-mono">Fincas Fundadoras</div>
                  </div>
                  <div className="text-xl font-black text-white">10% <span className="text-xs text-gray-500 font-normal">fijo</span></div>
                </div>
                <div className="bg-[#0e0e0e] border border-[#1a1a1a] p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-white">Tier 1 Elite</div>
                    <div className="text-xs text-gray-500 font-mono">Wedding Planners &gt; 10 leads/año</div>
                  </div>
                  <div className="text-xl font-black text-white">8% <span className="text-xs text-gray-500 font-normal">fijo</span></div>
                </div>
              </div>
              <button className="w-full text-xs text-[#8e44ad] font-bold mt-2 hover:text-white transition-colors text-left">+ Añadir Regla de Volumen (Performance Bonus)</button>
            </div>

            <div className="bg-[#080808] border border-[#1f1f1f] p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">LTV & Comisiones Condicionales</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <input type="checkbox" defaultChecked className="mt-1 accent-[#8e44ad] w-4 h-4" />
                  <div>
                    <div className="text-sm font-bold text-white">Lifetime Commission (Retención)</div>
                    <div className="text-xs text-gray-400 leading-relaxed">El afiliado cobra un 5% recurrente de los eventos secundarios (Aniversarios, Bautizos) si el lead original convierte en el futuro.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

