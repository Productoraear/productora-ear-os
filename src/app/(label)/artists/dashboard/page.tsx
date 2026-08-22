// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Users, 
  FileText, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Tv, 
  MessageSquare, 
  FolderPlus, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  Disc, 
  FileDown, 
  Plus, 
  RefreshCw,
  LogOut,
  Bell,
  BookOpen
} from 'lucide-react';

import { SEED_ARTISTS, ArtistProfileData, ArtistRelease, ArtistContract, CalendarEvent, CampaignNode } from '@/lib/artists/schema';
import { LabelRole, ROLE_PERMISSIONS, hasPermission } from '@/lib/artists/permissions';
import { getSimulatedToken, verifyLabelToken } from '@/lib/artists/claims';
import { createAuditLog, LabelAuditLog } from '@/lib/artists/audit';

// Visual Components
import { ArtistHero } from '@/components/artists/ArtistHero';
import { ArtistTabs, SubTabId } from '@/components/artists/ArtistTabs';
import { ArtistCarousel } from '@/components/artists/ArtistCarousel';
import { ArtistMediaGrid } from '@/components/artists/ArtistMediaGrid';
import { ArtistBioEditor } from '@/components/artists/ArtistBioEditor';
import { ArtistReleaseList } from '@/components/artists/ArtistReleaseList';
import { ArtistContractsPanel } from '@/components/artists/ArtistContractsPanel';
import { ArtistAnalytics } from '@/components/artists/ArtistAnalytics';
import { ArtistTimeline } from '@/components/artists/ArtistTimeline';
import { ArtistSEOSwarm } from '@/components/artists/ArtistSEOSwarm';

export default function LabelDashboardPage() {
  // Session Simulation
  const [activeRole, setActiveRole] = useState<LabelRole>('super_admin');
  const [activeArtistIndex, setActiveArtistIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>('bio');
  const [artists, setArtists] = useState<ArtistProfileData[]>(SEED_ARTISTS);
  const [auditLogs, setAuditLogs] = useState<LabelAuditLog[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedArtist = artists[activeArtistIndex];
  const activeTokenClaims = getSimulatedToken(activeRole, selectedArtist.id);

  // Initialize with some seed audits
  useEffect(() => {
    setAuditLogs([
      createAuditLog('Edwin Agudelo', 'super_admin', 'INITIALIZE_SYSTEM', 'EAR-GLOBAL', 'SUCCESS', 'Consola del sello discográfico cargada con éxito.'),
      createAuditLog('System Kernel', 'super_admin', 'SYNC_METRICS', 'ART-WAG-001', 'SUCCESS', 'Métricas de streams de Spotify y Apple Music actualizadas.'),
    ]);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRoleChange = (role: LabelRole) => {
    setActiveRole(role);
    // Log audit
    const newLog = createAuditLog(
      'Edwin Agudelo',
      role,
      'ROLE_ELEVATION',
      'SIMULATOR-JWT',
      'SUCCESS',
      `Rol simulado cambiado a [${role.toUpperCase()}]. Claims de seguridad re-evaluados.`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    triggerToast(`Claims actualizados a: ${role.toUpperCase()}`);

    // Adjust sub-tab if permission restricted
    const perms = ROLE_PERMISSIONS[role];
    if (role === 'artist') {
      setActiveSubTab('bio');
    }
  };

  const handleSaveBio = (updated: Partial<ArtistProfileData>) => {
    setArtists(prev => prev.map((a, i) => {
      if (i === activeArtistIndex) {
        return { ...a, ...updated };
      }
      return a;
    }));
    const newLog = createAuditLog(
      'Edwin Agudelo',
      activeRole,
      'UPDATE_BIO',
      selectedArtist.id,
      'SUCCESS',
      `Biografía del artista [${selectedArtist.displayName}] actualizada.`
    );
    setAuditLogs(prev => [newLog, ...prev]);
    triggerToast('Biografía del artista actualizada con éxito.');
  };

  // Check if active sub-tab is permitted
  const hasAccessToTab = (tab: SubTabId) => {
    if (activeRole === 'super_admin' || activeRole === 'label_admin') return true;
    if (activeRole === 'artist_manager') {
      return ['bio', 'media', 'releases', 'schedule', 'analytics', 'seo_matrix'].includes(tab);
    }
    if (activeRole === 'artist') {
      return ['bio', 'media', 'releases', 'contracts', 'schedule', 'analytics', 'notes', 'seo_matrix'].includes(tab);
    }
    if (activeRole === 'viewer') {
      return ['bio', 'media', 'releases', 'schedule', 'analytics', 'seo_matrix'].includes(tab);
    }
    return false;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613]/30 overflow-hidden font-sans pt-12 pb-24">
      {/* Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#ecb613] text-black px-6 py-4 rounded-xl font-black uppercase tracking-wider text-xs shadow-2xl flex items-center gap-3 animate-bounce">
          <ShieldCheck size={16} /> {toastMessage}
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* HEADER BRANDING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
                Talent OS V2
              </span>
              <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
                SECURE ACCESS
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white font-syne flex items-center gap-3">
              <Disc className="text-[#ecb613] animate-spin" size={36} /> Label & Management Workspace
            </h1>
          </div>

          {/* SIMULATOR SWITCHER */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div>
              <span className="text-[8px] font-black uppercase tracking-widest text-white/30 block mb-1">
                Selector de Claims (Simulación JWT)
              </span>
              <div className="flex gap-2">
                {(['super_admin', 'label_admin', 'artist_manager', 'artist', 'viewer'] as LabelRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      activeRole === r 
                        ? 'bg-[#ecb613] text-black' 
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT PANELS: ACTIVE ROSTER & JWT VISOR */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* ACTIVE ROSTER SELECTOR */}
            {activeRole !== 'artist' && (
              <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-syne">Roster Activo</h3>
                <div className="space-y-3">
                  {artists.map((artist, idx) => {
                    const isSelected = activeArtistIndex === idx;
                    return (
                      <button
                        key={artist.id}
                        onClick={() => {
                          setActiveArtistIndex(idx);
                          triggerToast(`Cargado artista: ${artist.displayName}`);
                        }}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
                          isSelected 
                            ? 'bg-white/5 border-[#ecb613]/40' 
                            : 'bg-white/[0.01] border-white/5 hover:bg-white/5'
                        }`}
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-black uppercase text-white tracking-wider block">
                            {artist.displayName}
                          </span>
                          <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            {artist.role} · {artist.homeBase}
                          </span>
                        </div>
                        {isSelected && <div className="w-2 h-2 bg-[#ecb613] rounded-full" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* INTERACTIVE JWT DATA VISOR */}
            <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight text-white font-syne flex items-center gap-2">
                <ShieldCheck className="text-[#ecb613]" size={18} /> Payload JWT (Custom Claims)
              </h3>
              <div className="bg-black/60 rounded-2xl p-6 border border-white/5">
                <pre className="text-[10px] font-mono text-white/60 overflow-x-auto leading-relaxed">
                  {JSON.stringify(activeTokenClaims, null, 2)}
                </pre>
              </div>
              <p className="text-[8px] text-white/20 uppercase tracking-widest leading-relaxed">
                El motor de permisos evalúa de forma estricta el token claims en la base de datos para impedir cualquier acción no autorizada.
              </p>
            </div>

            {/* LIVE AUDIT TELEMETRY */}
            <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight text-white font-syne">Registro de Auditoría S-Class</h3>
              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 divide-y divide-white/5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                      <span>{log.id}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      <span className="font-black uppercase text-white/80">{log.actor} ({log.role})</span>: {log.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANELS: PROFILE BANNER & DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* HERO IDENTITY BANNER */}
            <ArtistHero artist={selectedArtist} activeRole={activeRole.toUpperCase()} />

            {/* NESTED SUB-NAVIGATION TABS */}
            <ArtistTabs 
              activeTab={activeSubTab} 
              onChange={setActiveSubTab} 
              allowedTabs={
                activeRole === 'artist' 
                  ? ['bio', 'media', 'releases', 'contracts', 'schedule', 'analytics', 'notes']
                  : undefined
              }
            />

            {/* SUB-PANEL DYNAMIC RENDER WITH GRACEFUL ACCESS CONTROL */}
            {hasAccessToTab(activeSubTab) ? (
              <div className="space-y-6">
                {activeSubTab === 'bio' && (
                  <ArtistBioEditor 
                    artist={selectedArtist} 
                    canEdit={activeRole === 'super_admin' || activeRole === 'label_admin' || activeRole === 'artist'}
                    onSave={handleSaveBio}
                  />
                )}
                {activeSubTab === 'media' && (
                  <ArtistMediaGrid displayName={selectedArtist.displayName} />
                )}
                {activeSubTab === 'releases' && (
                  <div className="space-y-8">
                    <ArtistCarousel releases={selectedArtist.releases} />
                    <ArtistReleaseList releases={selectedArtist.releases} />
                  </div>
                )}
                {activeSubTab === 'contracts' && (
                  <ArtistContractsPanel contracts={selectedArtist.contracts} />
                )}
                {activeSubTab === 'schedule' && (
                  <ArtistTimeline events={selectedArtist.calendar} />
                )}
                {activeSubTab === 'analytics' && (
                  <ArtistAnalytics analytics={selectedArtist.analytics} />
                )}
                {activeSubTab === 'notes' && (
                  <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-6">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white font-syne">Notas de Sala Internas</h3>
                    <div className="space-y-4">
                      {selectedArtist.notes.map((note, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/5 p-6 rounded-2xl text-xs text-white/70 leading-relaxed italic">
                          "{note}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeSubTab === 'seo_matrix' && (
                  <ArtistSEOSwarm />
                )}
              </div>
            ) : (
              <div className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center mx-auto">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-black uppercase text-white font-syne">Acceso Restringido</h3>
                <p className="text-white/40 text-xs max-w-md mx-auto leading-relaxed">
                  Tu rol de simulación actual [{activeRole.toUpperCase()}] no tiene asignadas políticas de lectura/escritura para la pestaña de [{activeSubTab.toUpperCase()}].
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
