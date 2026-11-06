'use client';

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Users,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export function SovereignSettingsKitView() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <h3 className="text-base font-bold text-white font-display">Panel de Seguridad & Ajustes Soberanos</h3>
          <p className="text-xs text-zinc-400 font-mono">Control de credenciales, roles de directores y notificaciones VIP</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
          2FA Activo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Seguridad 2FA */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Autenticación de Dos Factores (2FA)</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Protege los expedientes de boda y las liquidaciones del split 80/10/10 con clave de seguridad de un solo uso.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">Estado: Blindado</span>
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-200 text-xs hover:border-amber-400 transition-colors"
            >
              {twoFactorEnabled ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        </div>

        {/* Claves de Desarrollador / Webhooks */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
            <Key className="w-4 h-4 text-[#ecb613]" />
            <span>Claves de API & Webhooks n8n</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Despacho asíncrono para `/webhook/b2b-quote` y pasarelas de fianza Stripe sin bloqueo en cliente.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>n8n.productoraear.com</span>
            <span className="text-emerald-400 font-bold">Online 100%</span>
          </div>
        </div>

        {/* Preferencias de Notificaciones */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-white font-bold">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Conserjería WhatsApp Centralizada</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Línea oficial de la casa: {CENTRALITA_EAR_OS}. Respuestas inmediatas a novios con mensaje pre-cualificado.
          </p>
        </div>

        {/* Zona de Peligro */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-red-500/20 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Zona de Peligro (Gobernanza)</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Prohibido modificar las invariantes del SSOT (suelo 350 €, fianza 100 €, split 80/10/10) sin sanción expresa del CEO.
          </p>
        </div>
      </div>
    </div>
  );
}

