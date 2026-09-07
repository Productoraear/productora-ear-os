'use client';

import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  Smartphone,
  Mail,
  Lock,
  AlertTriangle,
} from 'lucide-react';

interface ConfigState {
  notifications: {
    emailBookings: boolean;
    emailPayments: boolean;
    whatsappAlerts: boolean;
    telegramUpdates: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showPhone: boolean;
    showEmail: boolean;
    allowDirectBooking: boolean;
  };
  payments: {
    stripeConnected: boolean;
    autoPayout: boolean;
    payoutFrequency: 'weekly' | 'biweekly' | 'monthly';
    bankIBAN: string;
  };
  preferences: {
    darkMode: boolean;
    language: 'es' | 'en';
    timezone: string;
    maxBookingsPerWeek: number;
  };
}

const DEFAULT_CONFIG: ConfigState = {
  notifications: {
    emailBookings: true,
    emailPayments: true,
    whatsappAlerts: true,
    telegramUpdates: false,
  },
  privacy: {
    publicProfile: true,
    showPhone: false,
    showEmail: false,
    allowDirectBooking: true,
  },
  payments: {
    stripeConnected: false,
    autoPayout: true,
    payoutFrequency: 'biweekly',
    bankIBAN: '',
  },
  preferences: {
    darkMode: true,
    language: 'es',
    timezone: 'Europe/Madrid',
    maxBookingsPerWeek: 3,
  },
};

export default function ArtistConfigPage() {
  const [config, setConfig] = useState<ConfigState>(DEFAULT_CONFIG);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateNotif = (key: keyof ConfigState['notifications']) => {
    setConfig(prev => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));
    setSaved(false);
  };

  const updatePrivacy = (key: keyof ConfigState['privacy']) => {
    setConfig(prev => ({ ...prev, privacy: { ...prev.privacy, [key]: !prev.privacy[key] } }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Configuración</h1>
          <p className="text-white/40 text-sm font-medium italic">Notificaciones, privacidad, pagos y preferencias del estudio.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#ecb613] hover:bg-[#d4a00f] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#ecb613]/10 disabled:opacity-50"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar'}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* NOTIFICACIONES */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]"><Bell size={18} /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Notificaciones</h3>
          </div>

          <ToggleRow icon={<Mail size={14} />} label="Email — Nuevas Reservas" active={config.notifications.emailBookings} onToggle={() => updateNotif('emailBookings')} />
          <ToggleRow icon={<CreditCard size={14} />} label="Email — Pagos y Liquidaciones" active={config.notifications.emailPayments} onToggle={() => updateNotif('emailPayments')} />
          <ToggleRow icon={<Smartphone size={14} />} label="WhatsApp — Alertas Operativas" active={config.notifications.whatsappAlerts} onToggle={() => updateNotif('whatsappAlerts')} />
          <ToggleRow icon={<Globe size={14} />} label="Telegram — Actualizaciones del Sistema" active={config.notifications.telegramUpdates} onToggle={() => updateNotif('telegramUpdates')} />
        </div>

        {/* PRIVACIDAD */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]"><Shield size={18} /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Privacidad</h3>
          </div>

          <ToggleRow icon={<Globe size={14} />} label="Perfil Público (Visible en Directorio)" active={config.privacy.publicProfile} onToggle={() => updatePrivacy('publicProfile')} />
          <ToggleRow icon={<Smartphone size={14} />} label="Mostrar Teléfono en Perfil" active={config.privacy.showPhone} onToggle={() => updatePrivacy('showPhone')} />
          <ToggleRow icon={<Mail size={14} />} label="Mostrar Email en Perfil" active={config.privacy.showEmail} onToggle={() => updatePrivacy('showEmail')} />
          <ToggleRow icon={<CheckCircle2 size={14} />} label="Permitir Booking Directo" active={config.privacy.allowDirectBooking} onToggle={() => updatePrivacy('allowDirectBooking')} />
        </div>

        {/* PAGOS */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]"><CreditCard size={18} /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Pagos</h3>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-white block">Stripe Connect</span>
              <span className="text-[9px] text-white/30">Liquidaciones automáticas del 80%</span>
            </div>
            {config.payments.stripeConnected ? (
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">Conectado</span>
            ) : (
              <button className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/30 px-4 py-1.5 rounded-full hover:bg-[#ecb613]/20 transition">
                Conectar Stripe
              </button>
            )}
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">Frecuencia de Liquidación</label>
            <select
              value={config.payments.payoutFrequency}
              onChange={e => setConfig(prev => ({ ...prev, payments: { ...prev.payments, payoutFrequency: e.target.value as 'weekly' | 'biweekly' | 'monthly' } }))}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition"
            >
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">IBAN (Backup)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={config.payments.bankIBAN}
                onChange={e => setConfig(prev => ({ ...prev, payments: { ...prev.payments, bankIBAN: e.target.value } }))}
                placeholder="ES00 0000 0000 0000 0000 0000"
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-[#ecb613] transition placeholder:text-neutral-700"
              />
            </div>
          </div>
        </div>

        {/* PREFERENCIAS */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#ecb613]/10 rounded-lg text-[#ecb613]"><Settings size={18} /></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Preferencias</h3>
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">Max. Bookings por Semana</label>
            <input
              type="number"
              min={1}
              max={7}
              value={config.preferences.maxBookingsPerWeek}
              onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, maxBookingsPerWeek: parseInt(e.target.value) || 1 } }))}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">Zona Horaria</label>
            <select
              value={config.preferences.timezone}
              onChange={e => setConfig(prev => ({ ...prev, preferences: { ...prev.preferences, timezone: e.target.value } }))}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition"
            >
              <option value="Europe/Madrid">Europa/Madrid (CET)</option>
              <option value="America/Bogota">América/Bogotá (COT)</option>
              <option value="America/Mexico_City">América/México (CST)</option>
            </select>
          </div>

          {/* DANGER ZONE */}
          <div className="mt-8 pt-6 border-t border-red-500/10">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={14} className="text-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Zona de Riesgo</span>
            </div>
            <button className="w-full py-3 border border-red-500/20 rounded-xl text-xs font-bold text-red-500/60 hover:text-red-500 hover:border-red-500/40 hover:bg-red-500/5 transition uppercase tracking-widest">
              Desactivar Perfil Temporalmente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, active, onToggle }: { icon: React.ReactNode; label: string; active: boolean; onToggle: () => void }) {
  return (
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-3">
        <span className="text-white/30">{icon}</span>
        <span className="text-xs font-bold text-white/70">{label}</span>
      </div>
      <button onClick={onToggle} className="text-[#ecb613] transition hover:scale-110">
        {active ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-white/20" />}
      </button>
    </div>
  );
}
