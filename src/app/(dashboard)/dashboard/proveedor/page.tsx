'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Sparkles, 
  Crown, 
  TrendingUp, 
  MessageCircle, 
  Calendar, 
  DollarSign, 
  Eye, 
  CheckCircle2, 
  Settings, 
  ExternalLink, 
  Lock, 
  ArrowUpRight, 
  Sliders, 
  Volume2, 
  MapPin, 
  Phone,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDashboardPage() {
  const [vendorName, setVendorName] = useState('Finca Las Tenadas Alta Gama');
  const [location, setLocation] = useState('Pozuelo de Alarcón, Madrid');
  const [phone, setPhone] = useState('+34 693 693 048');
  const [powerPerPax, setPowerPerPax] = useState(12);
  const [maxPax, setMaxPax] = useState(350);
  const [isSaved, setIsSaved] = useState(false);

  const stats = [
    {
      label: 'Impresiones en Catálogo',
      value: '14.820',
      change: '+18.4% este mes',
      icon: Eye,
      color: 'text-[#ecb613]',
      bg: 'bg-[#ecb613]/10',
      border: 'border-[#ecb613]/30'
    },
    {
      label: 'Clics Directos a WhatsApp',
      value: '84',
      change: 'Cero comisiones intermediación',
      icon: MessageCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30'
    },
    {
      label: 'Slots Bloqueados (Price-Lock)',
      value: '6',
      change: 'Depósitos de 0.50€ en Stripe Escrow',
      icon: Calendar,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    },
    {
      label: 'Volumen Contratado Estimado',
      value: '28.500 €',
      change: 'Temporada Bodas & Eventos 2026',
      icon: DollarSign,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    }
  ];

  const recentInboundLeads = [
    {
      id: 'LD-8821',
      client: 'Boda Carmen & Alejandro',
      date: '19 Septiembre 2026',
      pax: '220 pax',
      channel: 'WhatsApp Direct',
      status: 'HOT_LEAD',
      amount: '4.800 €'
    },
    {
      id: 'LD-8794',
      client: 'Evento Corporativo Tech Summit',
      date: '12 Junio 2026',
      pax: '180 pax',
      channel: 'Price-Lock 1-Clic',
      status: 'CONFIRMED',
      amount: '5.200 €'
    },
    {
      id: 'LD-8650',
      client: 'Boda Lucía & Mateo',
      date: '04 Julio 2026',
      pax: '150 pax',
      channel: 'WhatsApp Direct',
      status: 'PENDING_CALL',
      amount: '3.900 €'
    }
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-8 font-sans selection:bg-[#ecb613]/30">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER S-CLASS OLED */}
        <div className="bg-[#09090d] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold uppercase tracking-widest">
                <Crown size={12} /> S-CLASS VERIFIED B2B
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                <CheckCircle2 size={11} /> SUSCRIPCIÓN ACTIVA (49 €/mes)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight font-syne text-white">
              {vendorName}
            </h1>
            <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
              <MapPin size={13} className="text-[#ecb613]" /> {location} • <Phone size={13} className="text-[#ecb613]" /> {phone}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/reclamar-perfil`}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2"
            >
              <ExternalLink size={13} /> Ver Ficha Pública
            </Link>
            <button
              onClick={() => window.open('https://billing.stripe.com/p/login/test_portal', '_blank')}
              className="px-4 py-2.5 rounded-xl bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20"
            >
              <Settings size={13} /> Gestionar Facturación Stripe
            </button>
          </div>
        </div>

        {/* 4 KPIS EN TIEMPO REAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-3xl bg-[#09090d] border ${st.border} space-y-3 shadow-lg`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">
                    {st.label}
                  </span>
                  <div className={`p-2 rounded-xl ${st.bg} ${st.color}`}>
                    <Icon size={16} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className={`text-3xl font-black font-mono tracking-tight ${st.color}`}>
                    {st.value}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-light flex items-center gap-1">
                    <TrendingUp size={11} className="text-emerald-400" /> {st.change}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* GRID DE GESTIÓN TÉCNICA Y SOLICITUDES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TABLA DE LEADS ENTRANTE */}
          <div className="lg:col-span-2 bg-[#09090d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase font-syne text-white">
                  Solicitudes Directas & Price-Locks
                </h3>
                <p className="text-xs text-zinc-400 font-light">
                  Eventos pre-cualificados en ruta hacia tu WhatsApp o con depósito retenido.
                </p>
              </div>
              <span className="text-xs font-mono text-[#ecb613] px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30">
                0% Comisión EAR
              </span>
            </div>

            <div className="space-y-3">
              {recentInboundLeads.map((ld) => (
                <div 
                  key={ld.id} 
                  className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500">{ld.id}</span>
                      <h4 className="text-xs font-bold text-white font-syne uppercase">{ld.client}</h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {ld.date} • {ld.pax} • Canal: {ld.channel}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-mono font-bold text-white">{ld.amount}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase ${
                      ld.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : ld.status === 'HOT_LEAD'
                        ? 'bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                    }`}>
                      {ld.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR DE CONFIGURACIÓN TÉCNICA (12 W/PAX) */}
          <div className="bg-[#09090d] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold uppercase">
                <Sliders size={14} /> RIDER ACÚSTICO SOBERANO
              </div>
              <h3 className="text-lg font-black uppercase font-syne text-white">
                Ficha Técnica
              </h3>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase">Nombre Oficial del Espacio</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase">Ubicación y Provincia</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 text-[10px] uppercase">Teléfono de Reservas (WhatsApp Direct)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ecb613]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase">Rider (W/pax)</label>
                  <input
                    type="number"
                    value={powerPerPax}
                    onChange={(e) => setPowerPerPax(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-[#ecb613] font-bold focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] uppercase">Aforo Máximo</label>
                  <input
                    type="number"
                    value={maxPax}
                    onChange={(e) => setMaxPax(Number(e.target.value))}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#ecb613] hover:bg-[#d4a210] text-black font-bold uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-[#ecb613]/20"
                >
                  {isSaved ? '✓ Configuración Actualizada' : 'Guardar Cambios Técnicos'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
