'use client';

import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Music,
  Camera,
  Globe,
  Save,
  CheckCircle2,
  Shield,
  Instagram,
  Youtube,
} from 'lucide-react';

interface ArtistProfile {
  name: string;
  stageName: string;
  email: string;
  phone: string;
  bio: string;
  genres: string[];
  baseLocation: string;
  radiusKm: number;
  baseFee: number;
  instagram: string;
  youtube: string;
  website: string;
  profileImage: string;
}

const INITIAL_PROFILE: ArtistProfile = {
  name: 'Edwin Agudelo',
  stageName: 'Edwin Agudelo',
  email: 'productoraear@gmail.com',
  phone: '+34 693 693 048',
  bio: 'Cantante lírico y mariachi profesional con base en Madrid y Toledo. Más de 15 años de experiencia en bodas de gala, eventos institucionales y sesiones VIMUME para personas mayores.',
  genres: ['Mariachi', 'Lírica', 'Pop Latino', 'Ranchera', 'Bolero'],
  baseLocation: 'Méntrida, Toledo',
  radiusKm: 200,
  baseFee: 350,
  instagram: '@productoraear',
  youtube: 'ProductoraEAR',
  website: 'https://productoraear.com',
  profileImage: '/artists/edwin-agudelo.jpg',
};

export default function ArtistProfileManagementPage() {
  const [profile, setProfile] = useState<ArtistProfile>(INITIAL_PROFILE);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateField = <K extends keyof ArtistProfile>(field: K, value: ArtistProfile[K]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulación de guardado — conectar a API cuando esté listo
    await new Promise(resolve => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">Mi Perfil</h1>
          <p className="text-white/40 text-sm font-medium italic">Gestiona tu identidad artística y datos profesionales.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#ecb613] hover:bg-[#d4a00f] text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#ecb613]/10 disabled:opacity-50"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* LEFT: AVATAR & SOCIAL */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 text-center">
            <div className="w-32 h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center border-2 border-[#ecb613]/30 mb-4">
              <Camera size={32} className="text-white/20" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight">{profile.stageName}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">Artista Verificado</p>
            <div className="mt-4 flex items-center justify-center gap-1">
              <Shield size={12} className="text-emerald-400" />
              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Split Soberano 80%</span>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Redes Sociales</h4>
            <InputField icon={<Instagram size={14} />} label="Instagram" value={profile.instagram} onChange={v => updateField('instagram', v)} />
            <InputField icon={<Youtube size={14} />} label="YouTube" value={profile.youtube} onChange={v => updateField('youtube', v)} />
            <InputField icon={<Globe size={14} />} label="Web" value={profile.website} onChange={v => updateField('website', v)} />
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="lg:col-span-2 space-y-6">
          {/* DATOS PERSONALES */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Datos Profesionales</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <InputField icon={<User size={14} />} label="Nombre Completo" value={profile.name} onChange={v => updateField('name', v)} />
              <InputField icon={<Music size={14} />} label="Nombre Artístico" value={profile.stageName} onChange={v => updateField('stageName', v)} />
              <InputField icon={<Mail size={14} />} label="Email" value={profile.email} onChange={v => updateField('email', v)} type="email" />
              <InputField icon={<Phone size={14} />} label="Teléfono" value={profile.phone} onChange={v => updateField('phone', v)} />
              <InputField icon={<MapPin size={14} />} label="Base de Operaciones" value={profile.baseLocation} onChange={v => updateField('baseLocation', v)} />
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">Radio Operativo (km)</label>
                <input
                  type="number"
                  value={profile.radiusKm}
                  onChange={e => updateField('radiusKm', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition"
                />
              </div>
            </div>
          </div>

          {/* BIO */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Biografía Profesional</h3>
            <textarea
              value={profile.bio}
              onChange={e => updateField('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition resize-none"
            />
            <p className="text-[9px] text-white/20">{profile.bio.length}/500 caracteres</p>
          </div>

          {/* TARIFA */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#ecb613] mb-6">Tarifa Base</h3>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">Tarifa Solista Base (€)</label>
                <input
                  type="number"
                  value={profile.baseFee}
                  onChange={e => updateField('baseFee', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-lg font-bold text-[#ecb613] focus:outline-none focus:border-[#ecb613] transition"
                />
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center min-w-[140px]">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/30 block">Tu Neto (80%)</span>
                <span className="text-2xl font-black text-emerald-400">{Math.round(profile.baseFee * 0.8)} €</span>
              </div>
            </div>
            <p className="text-[9px] text-white/20 mt-4">
              Split Soberano: {Math.round(profile.baseFee * 0.8)} € Artista / {Math.round(profile.baseFee * 0.1)} € EAR OS / {Math.round(profile.baseFee * 0.1)} € VIMUME
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ icon, label, value, onChange, type = 'text' }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#ecb613] transition"
        />
      </div>
    </div>
  );
}
