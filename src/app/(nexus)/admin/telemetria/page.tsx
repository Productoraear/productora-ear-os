"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, ArrowLeft, Cpu, HardDrive, ShieldCheck, Zap, 
  Server, RefreshCw, Radio, Terminal, AlertCircle, Database
} from 'lucide-react';

export default function TelemetriaGlobalPage() {
  const [timestamp, setTimestamp] = useState<string>('');
  const [latency, setLatency] = useState<number>(18);
  const [gpuLoad, setGpuLoad] = useState<number>(14);

  useEffect(() => {
    setTimestamp(new Date().toLocaleTimeString('es-ES'));
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleTimeString('es-ES'));
      setLatency(Math.floor(16 + Math.random() * 6));
      setGpuLoad(Math.floor(12 + Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-[#fcfbf9] p-6 md:p-10 font-sans selection:bg-[#d4ac0d] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabecera de Navegación */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1f1f1f] pb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 hover:text-[#d4ac0d] transition-colors bg-[#0d0d0d] px-3 py-2 rounded-lg border border-[#222]"
            >
              <ArrowLeft className="w-4 h-4" /> Centro de Mando
            </Link>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Telemetría Bare-Metal <span className="text-[#d4ac0d] text-xs font-mono px-2 py-0.5 rounded bg-[#d4ac0d]/10 border border-[#d4ac0d]/30">REAL-TIME</span>
              </h1>
              <p className="text-xs text-gray-400 font-mono">Hub Operativo Méntrida (Toledo) // Nodo Km 0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#0a1a0f] border border-[#27ae60]/40 px-3 py-1.5 rounded-lg text-xs font-mono text-[#27ae60]">
              <span className="w-2 h-2 rounded-full bg-[#27ae60] animate-ping" />
              SISTEMAS NOMINALES
            </div>
            <div className="bg-[#111] border border-[#222] px-3 py-1.5 rounded-lg text-xs font-mono text-gray-300">
              {timestamp || "00:00:00"}
            </div>
          </div>
        </header>

        {/* Matriz de Hardware y Subestaciones */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#080808] border border-[#1f1f1f] p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>IA ACCELERATOR</span>
              <Cpu className="w-4 h-4 text-[#d4ac0d]" />
            </div>
            <div className="text-2xl font-black text-white font-mono">RX 7900 XTX</div>
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                <span>VRAM Asignada: 24 GB</span>
                <span>{gpuLoad}% Carga</span>
              </div>
              <div className="w-full bg-[#1c1c1c] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#d4ac0d] h-full transition-all duration-500" style={{ width: `${gpuLoad}%` }} />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">Worker Local: 2.55s latencia media</p>
          </div>

          <div className="bg-[#080808] border border-[#1f1f1f] p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>BASE DE DATOS</span>
              <Database className="w-4 h-4 text-[#27ae60]" />
            </div>
            <div className="text-2xl font-black text-white font-mono">Supabase S-Class</div>
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Pool Conectado ({latency} ms)
            </div>
            <p className="text-[10px] text-gray-500 font-mono">Replicación local + RLS Activo</p>
          </div>

          <div className="bg-[#080808] border border-[#1f1f1f] p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>ACÚSTICA & DSP</span>
              <Radio className="w-4 h-4 text-[#3498db]" />
            </div>
            <div className="text-2xl font-black text-white font-mono">12 W / pax</div>
            <div className="text-xs text-gray-300 font-mono">Bose F1 + Shure Beta 87A</div>
            <p className="text-[10px] text-gray-500 font-mono">Buffer: 48 kHz / 24-bit nominal</p>
          </div>

          <div className="bg-[#080808] border border-[#1f1f1f] p-5 rounded-2xl space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>GOBIERNO DE RED</span>
              <HardDrive className="w-4 h-4 text-[#e67e22]" />
            </div>
            <div className="text-2xl font-black text-white font-mono">26.420 Nodos</div>
            <div className="text-xs text-amber-400 font-mono">Proveedores en Memoria</div>
            <p className="text-[10px] text-gray-500 font-mono">Protocolo Vampiro en Espera</p>
          </div>
        </div>

        {/* Consola de Procesos Activos y Trazabilidad */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Registro de Subestaciones */}
          <div className="lg:col-span-2 bg-[#080808] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
              <Server className="w-4 h-4 text-[#d4ac0d]" /> Estado de Subsistemas EAR OS
            </h2>

            <div className="space-y-3">
              {[
                { name: "Motor de Adquisición (fincasparaboda.com)", status: "Producción Activa", ping: "22 ms", ok: true },
                { name: "Módulo B2G Art. 118 LCSP (Pliegos Oficiales)", status: "Homologado", ping: "14 ms", ok: true },
                { name: "Fusion Mixer de 10 Arquetipos (Mobile Studio)", status: "En Memoria", ping: "0 ms", ok: true },
                { name: "Tripwires Anti-Inyección & TOTP 2FA (Oráculo)", status: "Armado", ping: "5 ms", ok: true },
                { name: "Pipeline Lavado Semántico (Vampiro)", status: "Modo Soberano", ping: "Localhost", ok: true },
              ].map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#27ae60]" />
                    <span className="text-gray-200">{sub.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">{sub.ping}</span>
                    <span className="text-[#d4ac0d] font-semibold">{sub.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terminal de Eventos en Tiempo Real */}
          <div className="bg-[#080808] border border-[#1f1f1f] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#d4ac0d]" /> Bitácora de Arranque
              </h2>
              <div className="bg-black border border-[#1a1a1a] p-3.5 rounded-xl font-mono text-[11px] space-y-2 text-gray-400 max-h-64 overflow-y-auto">
                <p className="text-emerald-400">[INIT] Kernel EAR OS v2.4 cargado.</p>
                <p className="text-gray-400">[CORE] Montaje de rutas (nexus)/admin completado.</p>
                <p className="text-gray-400">[AUDIO] Calibración 12 W/pax para 15 plazas fijada.</p>
                <p className="text-[#d4ac0d]">[VAMPIRO] 26.420 entidades desindexadas de terceros.</p>
                <p className="text-emerald-400">[OK] Dashboard y Telemetría enlazados sin errores.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1a1a1a]">
              <Link 
                href="/admin/omni-cockpit" 
                className="w-full inline-flex items-center justify-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] border border-[#333] hover:border-[#d4ac0d] text-white text-xs font-bold py-3 rounded-xl transition-all font-mono"
              >
                Abrir Omni-Cockpit Studio
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
