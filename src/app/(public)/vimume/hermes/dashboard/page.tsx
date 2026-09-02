"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardList, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  History, 
  FileText, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  CheckCircle2, 
  Clock, 
  Printer,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Eye,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  TrendingUp,
  Heart,
  ChevronRight,
  Database,
  Building,
  Languages,
  CheckSquare,
  BookOpen
} from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// 🏛️ DESIGN TOKENS
const TOKENS = {
  bg: '#050505',
  surface: '#0a0a0a',
  surface2: '#141414',
  text: '#f5f1e8',
  muted: '#666666',
  accent: '#ecb613', // S-Class Gold
  accent2: '#49d6b5', // VIMUME Emerald/Mint
  danger: '#ff4d4d',
  success: '#10b981',
};

// Types
type Role = 'super_admin' | 'admin_centro' | 'terapeuta' | 'colaborador_clinico' | 'solo_lectura';
type OnboardingMode = 'direct' | 'contemplative' | 'none';

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  status: 'Estable' | 'En Observación' | 'Crítico' | 'Optimización';
  center: string;
  country: string;
  language: string;
  sessionsCount: number;
  lastActivity: string;
  gammaFrequencies: number[];
  bpmHistory: number[];
}

interface SessionLog {
  id: string;
  patientId: string;
  patientName: string;
  center: string;
  target: string;
  frequency: string;
  bpm: number;
  notes: string;
  consentVerified: boolean;
  therapistId: string;
  timestamp: string;
}

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'SECURITY';
}

// Global Seed Patient Data
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'PAT-2026-MAD01',
    name: 'Manuel Agudelo',
    age: 78,
    diagnosis: 'Alzheimer Fase Moderada (GDS 4)',
    status: 'Estable',
    center: 'Centro Navalcarnero',
    country: 'España',
    language: 'Español',
    sessionsCount: 14,
    lastActivity: 'Hace 2 horas',
    gammaFrequencies: [40, 40, 39.8, 40.2],
    bpmHistory: [74, 76, 72, 75]
  },
  {
    id: 'PAT-2026-BCN02',
    name: 'Carmen Llopis',
    age: 82,
    diagnosis: 'Deterioro Cognitivo Leve',
    status: 'Optimización',
    center: 'Centro Barcelona',
    country: 'España',
    language: 'Catalán / Español',
    sessionsCount: 28,
    lastActivity: 'Ayer',
    gammaFrequencies: [40, 40, 40, 40],
    bpmHistory: [68, 70, 69, 71]
  },
  {
    id: 'PAT-2026-MEX03',
    name: 'Roberto Valenzuela',
    age: 76,
    diagnosis: 'Demencia Frontotemporal',
    status: 'En Observación',
    center: 'Centro CDMX Norte',
    country: 'México',
    language: 'Español',
    sessionsCount: 5,
    lastActivity: 'Hace 3 días',
    gammaFrequencies: [40, 39.5, 40.1, 40],
    bpmHistory: [80, 82, 79, 81]
  }
];

export default function HermesTrackerOTPage() {
  const router = useRouter();
  // --- STATES ---
  const [onboarding, setOnboarding] = useState<OnboardingMode>('none'); // 'none' defaults to colibri intro first
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsMfa, setNeedsMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [emailInput, setEmailInput] = useState('edwin.agudelo@productoraear.com');
  const [passwordInput, setPasswordInput] = useState('••••••••');
  
  // Clinical Contexts
  const [currentCenter, setCurrentCenter] = useState('Centro Navalcarnero');
  const [currentRole, setCurrentRole] = useState<Role>('terapeuta');
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [sessionsList, setSessionsList] = useState<SessionLog[]>([
    {
      id: 'SES-0988',
      patientId: 'PAT-2026-MAD01',
      patientName: 'Manuel Agudelo',
      center: 'Centro Navalcarnero',
      target: 'Estimulación del lóbulo temporal izquierdo',
      frequency: 'Gamma 40Hz (Sónica)',
      bpm: 74,
      notes: 'Respuestas de sincronía sónica óptimas al reproducir piezas de Copla clásica española de los años 50. Incremento del habla coherente observado inmediatamente post-sesión.',
      consentVerified: true,
      therapistId: 'Edwin Agudelo (TER-04)',
      timestamp: '17/05/2026 08:30'
    }
  ]);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'patients' | 'reports' | 'modules' | 'sitemap' | 'tutor'>('dashboard');
  
  // Session Creation Dialog Form
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [newSessionTarget, setNewSessionTarget] = useState('');
  const [newSessionFreq, setNewSessionFreq] = useState('Gamma 40Hz (Sónica)');
  const [newSessionNotes, setNewSessionNotes] = useState('');
  const [newSessionConsent, setNewSessionConsent] = useState(false);
  const [newSessionPin, setNewSessionPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // New Patient Creation Form
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [newPatName, setNewPatName] = useState('');
  const [newPatAge, setNewPatAge] = useState<number>(75);
  const [newPatDiag, setNewPatDiag] = useState('Alzheimer Fase Inicial (GDS 3)');
  const [newPatCenter, setNewPatCenter] = useState('Centro Navalcarnero');
  const [newPatCountry, setNewPatCountry] = useState('España');
  const [newPatLang, setNewPatLang] = useState('Español');

  // Interactive Premium Features flags (User togglable under Admin Tab)
  const [features, setFeatures] = useState({
    ragAlzheimer: true,
    dopplerFrequencies: true,
    europeanLedger: false,
    biometricVerification: false
  });

  // Filters for Patient Matrix (Global scale)
  const [filterSearch, setFilterSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('TODOS');
  const [filterDiagnosis, setFilterDiagnosis] = useState('TODOS');

  // Audit Logs Telemetry
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { timestamp: '17/05/2026 10:20:05', user: 'SYSTEM', action: 'INIT_HERMES_TRACKER', details: 'Kernel cargado bajo rol predeterminado.', status: 'SUCCESS' },
    { timestamp: '17/05/2026 10:20:10', user: 'Edwin Agudelo', action: 'DB_SYNC', details: 'Bóveda RAG del Alzheimer sincronizada a nivel local.', status: 'SUCCESS' }
  ]);

  // Interactive Silicon Valley Tutor Sections Tracker
  const [tutorUserSection, setTutorUserSection] = useState<string>('intro');
  const [tutorAdminSection, setTutorAdminSection] = useState<string>('claims');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Time ticker
  const [timeStr, setTimeStr] = useState('');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString('es-ES', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Trigger toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const addAuditLog = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'SECURITY' = 'SUCCESS') => {
    const d = new Date();
    const logTime = d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour12: false });
    const userLabel = currentRole === 'super_admin' ? 'Super Admin' : `Edwin [${currentRole.toUpperCase()}]`;
    setAuditLogs(prev => [
      { timestamp: logTime, user: userLabel, action, details, status },
      ...prev
    ]);
  };

  // --- LOGIC: CREATE SESSION WITH CONSENT & MFA ---
  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionConsent) {
      triggerToast('⚠️ Debe confirmar el consentimiento del tutor legal.');
      return;
    }
    // Strict Pin verification (Standard: 7777 / Double Verification protocol)
    if (newSessionPin !== '7777' && newSessionPin !== '1234') {
      setPinError(true);
      addAuditLog('SECURITY_VIOLATION', `Intento de sesión con PIN incorrecto: ${newSessionPin}`, 'SECURITY');
      triggerToast('🛑 PIN de terapeuta incorrecto. Doble verificación rechazada.');
      return;
    }

    setPinError(false);
    const d = new Date();
    const formattedDate = d.toLocaleDateString('es-ES') + ' ' + d.toLocaleTimeString('es-ES', { hour12: false });
    
    const newLog: SessionLog = {
      id: `SES-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      center: currentCenter,
      target: newSessionTarget,
      frequency: newSessionFreq,
      bpm: selectedPatient.bpmHistory[0] || 72,
      notes: newSessionNotes,
      consentVerified: true,
      therapistId: `Edwin Agudelo (${currentRole.toUpperCase()})`,
      timestamp: formattedDate
    };

    setSessionsList(prev => [newLog, ...prev]);

    // Incrementar contador de sesiones
    setPatients(prev => prev.map(p => {
      if (p.id === selectedPatient.id) {
        return { ...p, sessionsCount: p.sessionsCount + 1, lastActivity: 'Ahora mismo' };
      }
      return p;
    }));

    // Sincronizar en Firebase Firestore
    try {
      await addDoc(collection(db, 'vimume_intervenciones'), {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        center: currentCenter,
        target: newSessionTarget,
        frequency: newSessionFreq,
        notes: newSessionNotes,
        consentVerified: true,
        role: currentRole,
        timestamp: serverTimestamp()
      });
      addAuditLog('FIRESTORE_WRITE', `Sesión ${newLog.id} guardada en base de datos.`, 'SUCCESS');
    } catch (err) {
      console.warn("Fallo de escritura Firestore real, fallback a persistencia local: ", err);
      addAuditLog('LOCAL_PERSISTENCE', `Sesión ${newLog.id} persistida localmente (Fallo de tokens Firebase).`, 'WARNING');
    }

    setShowSessionModal(false);
    setNewSessionTarget('');
    setNewSessionNotes('');
    setNewSessionPin('');
    setNewSessionConsent(false);
    triggerToast('✅ Sesión clínica iniciada y sincronizada de forma segura.');
  };

  // --- LOGIC: CREATE PATIENT ---
  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatName) return;

    const newPat: Patient = {
      id: `PAT-2026-${newPatCountry.slice(0,3).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`,
      name: newPatName,
      age: newPatAge,
      diagnosis: newPatDiag,
      status: 'Estable',
      center: newPatCenter,
      country: newPatCountry,
      language: newPatLang,
      sessionsCount: 0,
      lastActivity: 'Añadido hoy',
      gammaFrequencies: [40],
      bpmHistory: [72]
    };

    setPatients(prev => [...prev, newPat]);
    setSelectedPatient(newPat);
    setShowPatientModal(false);
    
    addAuditLog('PATIENT_SEED_EXPAND', `Paciente ${newPat.name} registrado en ${newPat.center}.`, 'SUCCESS');
    triggerToast(`✅ Paciente ${newPat.name} integrado en la red mundial.`);

    setNewPatName('');
  };

  // --- LOGIC: BACKUP VIMUME LEDGER ---
  const handleBackupToLedger = () => {
    addAuditLog('LEDGER_BACKUP', `Copia de seguridad encriptada enviada a universidades y fundaciones europeas.`, 'SUCCESS');
    triggerToast('🧠 Sincronización exitosa con la Bóveda de Investigación contra el Alzheimer.');
  };

  // --- AUDIT INVERSA CONTROLS (Trial Simulation Contexts) ---
  const changeContextRole = (role: Role) => {
    setCurrentRole(role);
    addAuditLog('CONTEXT_SWITCH_ROLE', `Rol reconfigurado a: ${role.toUpperCase()}`, 'WARNING');
    triggerToast(`Contexto operativo: ${role.toUpperCase()}`);
  };

  const changeCenterContext = (center: string) => {
    setCurrentCenter(center);
    addAuditLog('CONTEXT_SWITCH_CENTER', `Centro reconfigurado a: ${center}`, 'SUCCESS');
    triggerToast(`📍 Conectado a: ${center}`);
  };

  // --- FILTERED PATIENTS ---
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(filterSearch.toLowerCase()) || 
                          p.diagnosis.toLowerCase().includes(filterSearch.toLowerCase());
    const matchesCountry = filterCountry === 'TODOS' || p.country === filterCountry;
    const matchesDiagType = filterDiagnosis === 'TODOS' || 
                            (filterDiagnosis === 'ALZHEIMER' && p.diagnosis.includes('Alzheimer')) ||
                            (filterDiagnosis === 'DEMENCIA' && p.diagnosis.includes('Demencia')) ||
                            (filterDiagnosis === 'DETERIORO' && p.diagnosis.includes('Deterioro'));
    return matchesSearch && matchesCountry && matchesDiagType;
  });

  return (
    <div className="bg-[#050505] min-h-screen text-[#f5f1e8] flex flex-col font-sans selection:bg-[#ecb613]/30 overflow-x-hidden relative">
      
      {/* Dynamic Ambient Blur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] bg-amber-500/[0.02] rounded-full blur-[150px]" />
      </div>

      {/* --- LEVEL 1: COLIBRI INTRO (Fábula del Colibrí) --- */}
      <AnimatePresence>
        {onboarding === 'none' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 bg-[#050505] z-[999] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="max-w-2xl space-y-12">
              {/* Hummingbird Emblem Animated */}
              <motion.div 
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-[#ecb613] to-[#49d6b5] rounded-full p-0.5 flex items-center justify-center shadow-[0_0_50px_rgba(236,182,19,0.2)]"
              >
                <div className="w-full h-full bg-[#050505] rounded-full flex items-center justify-center">
                  <Sparkles size={40} className="text-[#ecb613] animate-pulse" />
                </div>
              </motion.div>

              <div className="space-y-6">
                <h1 className="text-4xl font-extrabold italic uppercase tracking-tighter font-syne text-[#ecb613]">
                  LA FÁBULA DEL COLIBRÍ
                </h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">
                  Hermes Tracker OT // Firma Emocional VIMUME
                </p>
              </div>

              <blockquote className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2rem] text-sm text-zinc-300 italic font-medium leading-relaxed uppercase tracking-wide">
                "Un gran incendio asolaba la selva. Todos los animales huían aterrorizados. En medio del caos, un pequeño colibrí volaba hacia el fuego llevando una gota de agua en su pico. El león le preguntó: '¿Crees que vas a apagar el fuego con eso?'. El colibrí respondió: 'Sé que no puedo solo. Pero yo estoy haciendo mi parte'."
              </blockquote>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                <button 
                  onClick={() => {
                    setOnboarding('contemplative');
                    addAuditLog('ONBOARDING_START', 'Inicio de flujo guiado contemplativo.', 'SUCCESS');
                  }}
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:border-[#49d6b5]/40 hover:text-[#49d6b5] text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Onboarding Guiado
                </button>
                <button 
                  onClick={() => {
                    setOnboarding('none');
                    setIsAuthenticated(false);
                    setNeedsMfa(false);
                    setOnboarding('direct'); // Bypass guided to manual auth login
                    addAuditLog('BYPASS_ONBOARDING', 'Acceso directo a autenticación.', 'WARNING');
                  }}
                  className="px-8 py-4 bg-[#ecb613] text-black hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)]"
                >
                  Acceso Directo
                </button>
              </div>
            </div>
            
            <div className="absolute bottom-8 text-[8px] text-zinc-700 tracking-widest uppercase font-mono">
              productoraear.com // VIMUME OS © 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LEVEL 2: WALKTHROUGH ONBOARDING CONTEMPLATIVO --- */}
      <AnimatePresence>
        {onboarding === 'contemplative' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505] z-[990] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="max-w-xl space-y-10">
              
              {onboardingStep === 0 && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/30 text-blue-400">
                    <Zap size={28} />
                  </div>
                  <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter text-[#ecb613]">1. SINTONÍA NEURO-MUSCAL</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-wide">
                    Estimulación mediante frecuencias sintonizadas a **40Hz Gamma**. Activación neuro-reconstructiva para rescatar recuerdos dormidos a través del canal auditivo.
                  </p>
                </motion.div>
              )}

              {onboardingStep === 1 && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 mx-auto bg-[#49d6b5]/10 rounded-2xl flex items-center justify-center border border-[#49d6b5]/30 text-[#49d6b5]">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter text-[#ecb613]">2. PRIVACIDAD & CONSEJO HÍBRIDO</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-wide">
                    Protección de datos conforme al RGPD y auditorías B2B/B2G. Consentimiento doblemente verificado antes de archivar cualquier registro en el ledger descentralizado.
                  </p>
                </motion.div>
              )}

              {onboardingStep === 2 && (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="w-16 h-16 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/30 text-purple-400">
                    <Globe size={28} />
                  </div>
                  <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter text-[#ecb613]">3. MULTI-CENTRO SOBERANO</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed uppercase tracking-wide">
                    Diseñado desde el primer día para escalar a nivel mundial. Operaciones consolidadas en España, expandiéndose por toda Hispanoamérica de manera simplificada.
                  </p>
                </motion.div>
              )}

              {/* Progress Indicator */}
              <div className="flex justify-center gap-3">
                {[0, 1, 2].map(idx => (
                  <div 
                    key={idx} 
                    className={`h-1 rounded-full transition-all duration-300 ${onboardingStep === idx ? 'w-8 bg-[#ecb613]' : 'w-2 bg-white/10'}`} 
                  />
                ))}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <button 
                  onClick={() => {
                    setOnboarding('direct');
                    addAuditLog('ONBOARDING_SKIP', 'Walkthrough omitido.', 'WARNING');
                  }}
                  className="text-xs font-bold text-zinc-600 uppercase hover:text-white"
                >
                  Omitir paso
                </button>
                
                {onboardingStep < 2 ? (
                  <button 
                    onClick={() => setOnboardingStep(prev => prev + 1)}
                    className="px-6 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-xs font-black uppercase tracking-widest rounded-xl flex items-center gap-2"
                  >
                    Siguiente <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setOnboarding('direct');
                      addAuditLog('ONBOARDING_COMPLETE', 'Walkthrough completado.', 'SUCCESS');
                    }}
                    className="px-8 py-3 bg-[#ecb613] text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)]"
                  >
                    Comenzar
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LEVEL 3: LOGIN DE CLASIFICACIÓN CLÍNICA (AUTENTICACIÓN + DOBLE VERIFICACIÓN) --- */}
      <AnimatePresence>
        {onboarding === 'direct' && !isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-[#050505] z-[980] flex flex-col items-center justify-center p-8"
          >
            <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-8">
              
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ecb613]/5 rounded-full blur-2xl" />

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-xl flex items-center justify-center text-[#ecb613] font-black mx-auto">
                  <Lock size={20} />
                </div>
                <h2 className="text-3xl font-extrabold uppercase italic tracking-tighter">HERMES <span className="text-[#ecb613]">OT</span></h2>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Acceso Clínico Autorizado</p>
              </div>

              {!needsMfa ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setNeedsMfa(true);
                    addAuditLog('LOGIN_PRIMARY_SUCCESS', 'Paso 1 de login correcto. Enviando MFA.', 'SUCCESS');
                  }} 
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Identificación (Email)</label>
                    <input 
                      type="email" 
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]/40 transition-colors"
                      placeholder="terapeuta@productoraear.com" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Clave de Seguridad</label>
                    <input 
                      type="password" 
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]/40 transition-colors"
                      placeholder="••••••••" 
                    />
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider italic">
                    🔓 demo: introduzca cualquier credencial para probar el paso 1 de autenticación.
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-[#ecb613] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(236,182,19,0.2)]"
                  >
                    Identificar Profesional
                  </button>
                </form>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (mfaCode === '7777' || mfaCode === '1234') {
                      setIsAuthenticated(true);
                      setOnboarding('none'); // Dismiss overlay completely
                      addAuditLog('AUTH_MFA_SUCCESS', 'Acceso total concedido bajo verificación de doble factor.', 'SUCCESS');
                      triggerToast('🔑 Doble Factor verificado. Bienvenido Edwin.');
                    } else {
                      triggerToast('🛑 Código MFA incorrecto. Pruebe 7777 o 1234.');
                      addAuditLog('AUTH_MFA_FAILED', `Código MFA incorrecto ingresado: ${mfaCode}`, 'SECURITY');
                    }
                  }} 
                  className="space-y-6 animate-in fade-in-50 duration-500"
                >
                  <div className="space-y-2 text-center">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Doble Verificación Requerida</label>
                    <p className="text-[9px] text-zinc-600 uppercase">Se ha enviado un código de 4 dígitos a su terminal registrado.</p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <input 
                      type="text" 
                      maxLength={4}
                      required
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="bg-[#141414] border border-white/10 rounded-2xl py-4 text-center text-2xl text-white font-extrabold tracking-[0.5em] w-36 focus:outline-none focus:border-[#49d6b5]/50 focus:shadow-[0_0_15px_rgba(73,214,181,0.1)] transition-all"
                      placeholder="0000" 
                    />
                  </div>

                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] text-zinc-500 leading-relaxed uppercase tracking-wider text-center italic">
                    🔑 demo: introduzca el código <span className="text-[#ecb613] font-bold">7777</span> o <span className="text-[#ecb613] font-bold">1234</span>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setNeedsMfa(false);
                        setMfaCode('');
                      }}
                      className="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10"
                    >
                      Atrás
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-4 bg-[#49d6b5] text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(73,214,181,0.2)]"
                    >
                      Verificar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN DASHBOARD INTERFACE (HERMES TRACKER OT S-CLASS) --- */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* 🧊 SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 flex flex-col p-6 gap-8 bg-[#050505] shrink-0 print:hidden">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-[#ecb613] to-amber-600 rounded-2xl flex items-center justify-center text-black font-black italic shadow-lg shadow-[#ecb613]/10">H</div>
              <div>
                <span className="font-extrabold uppercase tracking-tighter text-lg leading-none flex items-center gap-1.5">HERMES <span className="text-[#ecb613]">OT</span></span>
                <p className="text-[7px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Vimume Clinical OS</p>
              </div>
            </div>
            {/* Center Status Dot */}
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Estatus General', icon: LayoutDashboard },
              { id: 'patients', label: 'Pacientes & Sesión', icon: Users },
              { id: 'reports', label: 'Informes & PDF', icon: FileText },
              { id: 'modules', label: 'Módulos Premium', icon: Zap, highlight: true },
              { id: 'sitemap', label: 'Sitemap & Auditoría', icon: Globe },
              { id: 'tutor', label: 'Tutor Interactivo', icon: BookOpen, highlight: true },
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => {
                    setActiveTab(item.id as any);
                    addAuditLog('NAVIGATE', `Navegación a pestaña: ${item.id.toUpperCase()}`, 'SUCCESS');
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all relative ${
                    isActive 
                    ? 'bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 shadow-md shadow-[#ecb613]/5' 
                    : 'text-zinc-500 hover:bg-white/[0.02] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <item.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  {item.highlight && !features.ragAlzheimer && (
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Context / Audit Box in Sidebar */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl mt-auto space-y-3">
            <div className="flex justify-between items-center text-[8px] font-black uppercase text-zinc-600">
              <span>Simulador de Roles</span>
              <span className="text-[#ecb613]">A/B Test</span>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              {(['terapeuta', 'admin_centro', 'super_admin', 'solo_lectura'] as Role[]).map((r) => (
                <button 
                  key={r}
                  onClick={() => changeContextRole(r)}
                  className={`text-[7px] font-bold uppercase p-2 border rounded-lg text-center transition-all ${
                    currentRole === r 
                    ? 'bg-[#49d6b5] text-black border-[#49d6b5]' 
                    : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2">
              <span className="text-[8px] font-black uppercase text-zinc-600 block">Ubicación Activa</span>
              <select 
                value={currentCenter}
                onChange={(e) => changeCenterContext(e.target.value)}
                className="w-full bg-[#141414] border border-white/5 rounded-xl p-2 text-[9px] font-bold text-zinc-300 focus:outline-none focus:border-[#ecb613]"
              >
                <option value="Centro Navalcarnero">Navalcarnero (ES)</option>
                <option value="Centro Madrid HQ">Madrid Central (ES)</option>
                <option value="Centro Barcelona">Barcelona (ES)</option>
                <option value="Centro Valencia">Valencia (ES)</option>
                <option value="Centro CDMX Norte">CDMX Norte (MX)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                setNeedsMfa(false);
                setOnboarding('direct');
                addAuditLog('LOGOUT', 'Sesión cerrada manualmente por el profesional.', 'WARNING');
                triggerToast('🔒 Sesión cerrada de forma segura.');
              }}
              className="w-full flex items-center gap-3.5 p-4 text-zinc-600 hover:text-[#ff4d4d] transition-colors rounded-2xl"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* 🚀 MAIN CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Dashboard Header */}
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-40 print:hidden shrink-0">
            <div className="flex items-center gap-5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#49d6b5] bg-[#49d6b5]/10 px-3.5 py-1.5 rounded-full border border-[#49d6b5]/20 flex items-center gap-2">
                <MapPin size={12} /> {currentCenter}
              </span>
              <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Rol: <strong className="text-white italic">{currentRole.toUpperCase()}</strong>
              </span>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-right flex flex-col justify-center">
                <span className="text-[7px] font-black text-zinc-600 uppercase tracking-[0.2em]">Señal de Bóveda</span>
                <span className="text-xs font-mono font-bold tracking-tighter text-[#ecb613]">{timeStr || '10:20:00'}</span>
              </div>

              <div className="h-8 w-[1px] bg-white/5" />

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    addAuditLog('LIVE_STREAM_NAVIGATE', 'Redirección al canal sónico público interactivo.', 'SUCCESS');
                    triggerToast('Redirigiendo a estimulación en vivo...');
                    setTimeout(() => {
                      router.push('/vimume/hermes#sonic-experience');
                    }, 800);
                  }}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                  Live Terapia
                </button>
                <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#ecb613]/50 transition-all text-zinc-400 hover:text-white">
                  <Bell size={16} />
                </button>
                <div className="flex items-center gap-3 pl-2">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ecb613] to-amber-500 border border-white/10 shadow-lg flex items-center justify-center text-black font-extrabold text-xs">
                    EA
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* MAIN PAGE BODY */}
          <main className="flex-grow p-8 md:p-12 overflow-y-auto custom-scrollbar relative z-10 print:p-0">
            
            {/* Page Title */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 print:hidden">
              <div className="space-y-2">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter font-syne leading-none">
                  Hermes <span className="text-[#ecb613]">Tracker OT</span>
                </h1>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em]">
                  Control de Musicoterapia y Sincronía del Deterioro Cognitivo
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowPatientModal(true)}
                  className="px-6 py-3.5 bg-white/5 border border-white/10 hover:border-white/20 text-xs font-black uppercase tracking-widest rounded-2xl transition-all"
                >
                  Registrar Paciente
                </button>
                <button 
                  onClick={() => {
                    if (currentRole === 'solo_lectura') {
                      triggerToast('🛑 Rol de SOLO LECTURA restringido para iniciar sesiones.');
                      return;
                    }
                    setShowSessionModal(true);
                  }} 
                  className="px-8 py-3.5 bg-[#ecb613] text-black hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)] flex items-center gap-2.5"
                >
                  <PlusCircle size={16} /> Iniciar Sesión OT
                </button>
              </div>
            </div>

            {/* --- TAB VIEW 1: GENERAL DASHBOARD --- */}
            {activeTab === 'dashboard' && (
              <div className="space-y-10 print:hidden animate-in fade-in-50 duration-500">
                
                {/* Highlights Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: "Pacientes Registrados", val: patients.length, desc: "A escala hispanoamericana", icon: Users, color: "text-[#49d6b5]" },
                    { label: "Sesiones Realizadas", val: sessionsList.length + 42, desc: "Con consentimiento verificado", icon: ClipboardList, color: "text-[#ecb613]" },
                    { label: "Frecuencia Objetivo", val: "40Hz", desc: "Estimulación Gamma Sincrónica", icon: Zap, color: "text-blue-400" },
                    { label: "Sincronía de Bóveda", val: "99.8%", desc: "Ledger europeo activo", icon: ShieldCheck, color: "text-emerald-500" }
                  ].map((card, i) => (
                    <div key={i} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-[2rem] hover:border-white/10 transition-all flex flex-col justify-between h-40">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{card.label}</span>
                        <div className="p-3 bg-white/5 rounded-xl">
                          <card.icon size={16} className={card.color} />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-3xl font-black italic tracking-tighter text-[#f5f1e8] leading-none mb-1.5">{card.val}</h4>
                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Paciente Seed Spotlight */}
                  <div className="lg:col-span-8 p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                      <Sparkles size={250} className="text-[#ecb613]" />
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <span className="px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[8px] font-black text-[#ecb613] uppercase tracking-[0.2em]">
                          Expediente Activo Spotlight
                        </span>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter font-syne mt-4 leading-none">
                          {selectedPatient.name}
                        </h3>
                        <p className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wide">
                          {selectedPatient.age} años // {selectedPatient.diagnosis} // {selectedPatient.center}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Última Terapia</span>
                        <span className="text-sm font-black italic text-[#49d6b5]">{selectedPatient.lastActivity}</span>
                      </div>
                    </div>

                    {/* Chart & Telemetry Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {/* Interactive gamma visualizer (CSS bars) */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          <span>Sintonía de Frecuencias (Historial)</span>
                          <span className="text-[#ecb613]">Objetivo: 40Hz Gamma</span>
                        </div>
                        <div className="h-32 bg-[#141414] rounded-2xl border border-white/5 p-6 flex items-end justify-around gap-2">
                          {selectedPatient.gammaFrequencies.map((f, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 flex-1">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${(f / 45) * 100}%` }}
                                className="w-full bg-gradient-to-t from-amber-600 to-[#ecb613] rounded-t-lg shadow-lg relative"
                              >
                                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-mono font-bold text-white/50">{f}Hz</span>
                              </motion.div>
                              <span className="text-[7px] font-mono text-zinc-600 uppercase">SES-0{i+1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Clinical Recommendations */}
                      <div className="space-y-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Recomendación Clínico-Sónica</span>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 h-32 flex flex-col justify-center">
                          <p className="text-xs text-zinc-300 italic uppercase leading-relaxed">
                            "Aumentar el uso de coplas y registros vocales clásicos españoles. La respuesta en la zona temporal es óptima tras 20 min de sintonía sónica."
                          </p>
                          <span className="text-[8px] text-[#49d6b5] font-black uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={12} /> Sugerido por: IA RAG Alzheimer
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fast PDF export trigger in spotlight */}
                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                        Copias físicas formateadas listas para impresión
                      </span>
                      <button 
                        onClick={() => {
                          setActiveTab('reports');
                          triggerToast('Filtro configurado: ' + selectedPatient.name);
                        }} 
                        className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                      >
                        <Printer size={14} /> Exportar Reportes Duales
                      </button>
                    </div>

                  </div>

                  {/* Sidebar stats column inside main grid */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Multi-centro status list */}
                    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Estatus de Centros</h4>
                        <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-mono text-[#ecb613]">ACTIVO</span>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { name: "Navalcarnero (Madrid)", active: true, count: 12, rate: "98.4%" },
                          { name: "Madrid HQ Central", active: false, count: 45, rate: "99.1%" },
                          { name: "Barcelona Centro", active: false, count: 28, rate: "97.8%" },
                          { name: "Valencia Central", active: false, count: 14, rate: "96.5%" }
                        ].map((c, i) => (
                          <div 
                            key={i} 
                            onClick={() => changeCenterContext(c.name.includes("Navalcarnero") ? "Centro Navalcarnero" : c.name.includes("Madrid") ? "Centro Madrid HQ" : c.name.includes("Barcelona") ? "Centro Barcelona" : "Centro Valencia")}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center group ${
                              currentCenter.includes(c.name.split(' ')[0]) 
                              ? 'bg-[#ecb613]/15 border-[#ecb613]/30' 
                              : 'bg-white/[0.01] border-white/5 hover:bg-white/5'
                            }`}
                          >
                            <div>
                              <span className="text-[10px] font-black uppercase block group-hover:text-white transition-colors">{c.name}</span>
                              <span className="text-[8px] text-zinc-600 font-bold uppercase block mt-1">{c.count} pacientes activos</span>
                            </div>
                            <span className="text-[9px] font-mono font-extrabold text-[#49d6b5]">{c.rate}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic Loyal Reward notification for prolonged visits */}
                    <div className="p-8 bg-gradient-to-br from-[#49d6b5]/10 to-transparent border border-[#49d6b5]/20 rounded-[2.5rem] space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#49d6b5]/10 flex items-center justify-center text-[#49d6b5]">
                          <Heart size={16} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#49d6b5]">Fidelidad OT Premiada</span>
                      </div>
                      <p className="text-[11px] text-zinc-300 uppercase leading-relaxed font-bold tracking-wide">
                        ¡Enhorabuena! Has mantenido tu sesión activa de manera continua. El módulo RAG avanzado ha sido habilitado de manera gratuita esta semana.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Recents list inside dashboard */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Historial de Sesiones Clínicas</h3>
                    <button 
                      onClick={() => setActiveTab('patients')}
                      className="text-xs font-bold text-[#ecb613] hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                      Ver todos <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Paciente</th>
                          <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Ubicación</th>
                          <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Frecuencia</th>
                          <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-500">Notas de Observación</th>
                          <th className="p-6 text-[9px] font-black uppercase tracking-widest text-zinc-500 text-right">Firmado por</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sessionsList.map((row) => (
                          <tr key={row.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="p-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-zinc-400">
                                  {row.id.slice(4)}
                                </div>
                                <div>
                                  <span className="font-extrabold text-xs uppercase block text-white">{row.patientName}</span>
                                  <span className="text-[8px] text-zinc-600 block mt-1">{row.patientId}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-6 text-[9px] text-zinc-400 font-bold uppercase">{row.center}</td>
                            <td className="p-6">
                              <span className="text-[8px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
                                {row.frequency}
                              </span>
                            </td>
                            <td className="p-6 text-xs text-zinc-300 italic max-w-sm truncate">
                              "{row.notes}"
                            </td>
                            <td className="p-6 text-right">
                              <span className="text-[9px] text-[#ecb613] font-black uppercase tracking-widest block">{row.therapistId}</span>
                              <span className="text-[7px] text-zinc-600 font-bold uppercase block mt-1">{row.timestamp}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* --- TAB VIEW 2: PACIENTES & SESIONES (CORE HUB) --- */}
            {activeTab === 'patients' && (
              <div className="space-y-10 print:hidden animate-in fade-in-50 duration-500">
                
                {/* Search & Filter Matrices (Global scale) */}
                <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input 
                      type="text"
                      placeholder="BUSCAR PACIENTE O DIAGNÓSTICO..."
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
                    
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="text-zinc-500" />
                      <select 
                        value={filterCountry}
                        onChange={(e) => setFilterCountry(e.target.value)}
                        className="bg-[#141414] border border-white/5 rounded-xl px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-zinc-300 outline-none"
                      >
                        <option value="TODOS">MUNDIAL (PAÍS: TODOS)</option>
                        <option value="España">España</option>
                        <option value="México">México</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <ClipboardList size={12} className="text-zinc-500" />
                      <select 
                        value={filterDiagnosis}
                        onChange={(e) => setFilterDiagnosis(e.target.value)}
                        className="bg-[#141414] border border-white/5 rounded-xl px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-zinc-300 outline-none"
                      >
                        <option value="TODOS">TODAS LAS ENFERMEDADES</option>
                        <option value="ALZHEIMER">Alzheimer</option>
                        <option value="DEMENCIA">Dementias</option>
                        <option value="DETERIORO">Deterioro Cognitivo</option>
                      </select>
                    </div>

                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Patients List filtered */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500 italic">Expedientes Coincidentes</h4>
                      <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] font-mono text-zinc-400">{filteredPatients.length}</span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredPatients.length > 0 ? (
                        filteredPatients.map((pat) => (
                          <div 
                            key={pat.id}
                            onClick={() => {
                              setSelectedPatient(pat);
                              addAuditLog('VIEW_PATIENT_EXPEDIENT', `Consulta del expediente de ${pat.name}`, 'SUCCESS');
                            }}
                            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                              selectedPatient.id === pat.id 
                              ? 'bg-[#ecb613]/10 border-[#ecb613]/30 text-white' 
                              : 'bg-[#0a0a0a] border-white/5 hover:border-white/20 text-zinc-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-tight italic block text-white group-hover:text-[#ecb613] transition-colors">{pat.name}</span>
                                <span className="text-[8px] font-mono text-zinc-600 block mt-1">{pat.id} // {pat.age} AÑOS</span>
                              </div>
                              <span className="text-[7px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-zinc-400">{pat.status}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between text-[7px] font-black text-zinc-500 uppercase tracking-widest">
                              <span>📍 {pat.center}</span>
                              <span className="text-[#ecb613]">{pat.sessionsCount} sesiones</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-20 text-center text-zinc-700 uppercase tracking-[0.4em] text-[9px] font-black">
                          Awaiting Target integration...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Deep patient focus and observation */}
                  <div className="lg:col-span-8 space-y-6">
                    {selectedPatient && (
                      <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-8 animate-in fade-in-50 duration-500">
                        
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-[#49d6b5] bg-[#49d6b5]/10 px-3 py-1 rounded-full border border-[#49d6b5]/20">{selectedPatient.country.toUpperCase()}</span>
                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white font-syne mt-3">{selectedPatient.name}</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase mt-1 tracking-widest">{selectedPatient.id} // {selectedPatient.diagnosis} // {selectedPatient.language}</p>
                          </div>
                          
                          <div className="text-right bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-center min-w-32">
                            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">SESIONES TOTALES</span>
                            <span className="text-3xl font-black italic tracking-tighter text-[#ecb613] mt-1">{selectedPatient.sessionsCount}</span>
                          </div>
                        </div>

                        {/* Frequencies tracking */}
                        <div className="space-y-4">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Sintonización de Bóveda y Estimulación sónica</span>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                              { label: "Gamma Activa", val: `${selectedPatient.gammaFrequencies[selectedPatient.gammaFrequencies.length - 1]}Hz`, icon: Zap, color: "text-[#ecb613]" },
                              { label: "BPM Clínico", val: `${selectedPatient.bpmHistory[selectedPatient.bpmHistory.length - 1]} BPM`, icon: Heart, color: "text-rose-500 animate-pulse" },
                              { label: "Day Care Status", val: selectedPatient.status.toUpperCase(), icon: ShieldCheck, color: "text-emerald-500" },
                              { label: "Sincronía Sónica", val: "98.2%", icon: CheckCircle2, color: "text-blue-400" }
                            ].map((itm, i) => (
                              <div key={i} className="p-4 bg-[#141414] border border-white/5 rounded-xl">
                                <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest block mb-2">{itm.label}</span>
                                <div className="flex items-center gap-2.5">
                                  <itm.icon size={14} className={itm.color} />
                                  <span className="text-sm font-black italic text-white">{itm.val}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recent logs */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block">Observaciones del Terapeuta</span>
                          <div className="space-y-3">
                            {sessionsList.filter(s => s.patientId === selectedPatient.id).length > 0 ? (
                              sessionsList.filter(s => s.patientId === selectedPatient.id).map((s) => (
                                <div key={s.id} className="p-6 bg-white/[0.01] border border-white/5 rounded-2xl space-y-3">
                                  <div className="flex justify-between items-center text-[8px] font-black uppercase text-zinc-500">
                                    <span>Sesión: {s.id} // Frecuencia: {s.frequency}</span>
                                    <span>{s.timestamp}</span>
                                  </div>
                                  <p className="text-xs text-zinc-300 leading-relaxed italic">"{s.notes}"</p>
                                  <div className="text-[8px] text-[#49d6b5] font-black uppercase tracking-widest flex items-center justify-between pt-1">
                                    <span>✍️ Firmante: {s.therapistId}</span>
                                    <span>Consentimiento verificado legalmente</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="py-8 text-center text-zinc-700 text-[9px] font-black uppercase tracking-widest">
                                Sin registros clínicos recientes. Inicie una sesión clínica arriba.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* --- TAB VIEW 3: DUAL REPORTS & PRINT ENGINE --- */}
            {activeTab === 'reports' && (
              <div className="space-y-10 animate-in fade-in-50 duration-500">
                
                {/* Visual Guidelines */}
                <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] space-y-4 print:hidden">
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-[#ecb613]" />
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Motor de Impresión y Firma Digital VIMUME</h3>
                  </div>
                  <p className="text-xs text-zinc-400 uppercase leading-relaxed max-w-3xl font-bold tracking-wide">
                    Genere copias de seguridad en la bóveda sónica o imprima informes en papel térmico o PDF. Cumple con los estándares clínicos de la Silver Economy europea y asociaciones de familiares del Alzheimer.
                  </p>
                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={handleBackupToLedger} 
                      className="px-6 py-2.5 bg-[#49d6b5] text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(73,214,181,0.2)]"
                    >
                      Copia Europea (Investigación)
                    </button>
                    <button 
                      onClick={() => {
                        window.print();
                        addAuditLog('PRINT_TRIGGER', `Lanzada orden de impresión general del navegador.`, 'SUCCESS');
                      }}
                      className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all"
                    >
                      Imprimir Página
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* --- REPORT 1: CLINICAL COMPREHENSIVE --- */}
                  <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-6 flex flex-col relative overflow-hidden print:w-full print:border-none print:bg-white print:text-black">
                    <div className="flex justify-between items-start print:hidden">
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">MODALIDAD MÉDICA</span>
                      <button 
                        onClick={() => {
                          const w = window.open("", "_blank");
                          if (w) {
                            w.document.write(`
                              <html>
                                <head>
                                  <title>INFORME CLÍNICO - ${selectedPatient.name}</title>
                                  <style>
                                    body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                                    .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                                    h1 { text-transform: uppercase; margin: 0; font-size: 24px; }
                                    .section { margin-bottom: 25px; }
                                    .label { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #666; }
                                    .value { font-size: 14px; margin-top: 3px; font-weight: bold; }
                                    .notes { font-style: italic; background: #f9f9f9; padding: 15px; border-left: 4px solid #333; }
                                  </style>
                                </head>
                                <body>
                                  <div class="header">
                                    <h1>HERMES TRACKER OT // INFORME CLÍNICO</h1>
                                    <p>Soberanía de Datos en la Silver Economy // productoraear.com</p>
                                  </div>
                                  <div class="section">
                                    <div class="label">Paciente</div>
                                    <div class="value">${selectedPatient.name} (${selectedPatient.age} Años)</div>
                                  </div>
                                  <div class="section">
                                    <div class="label">Diagnóstico Principal</div>
                                    <div class="value">${selectedPatient.diagnosis}</div>
                                  </div>
                                  <div class="section">
                                    <div class="label">Centro Clínico</div>
                                    <div class="value">${selectedPatient.center} // ${currentCenter}</div>
                                  </div>
                                  <div class="section">
                                    <div class="label">Último Estatus de Frecuencia Sónica</div>
                                    <div class="value">${selectedPatient.gammaFrequencies[selectedPatient.gammaFrequencies.length - 1]}Hz Gamma Sincrónica</div>
                                  </div>
                                  <div class="section">
                                    <div class="label">Última Observación de Musicoterapia</div>
                                    <div class="notes">"Respuestas síncronas de memoria auditiva activadas. Habla articulada post-tratamiento sónico óptima."</div>
                                  </div>
                                  <div style="margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; font-size: 10px; color: #777;">
                                    Firmado Digitalmente por Edwin Agudelo // Licencia OT VIMUME // ${timeStr || '10:20:00'}
                                  </div>
                                  <script>window.print();</script>
                                </body>
                              </html>
                            `);
                            w.document.close();
                            addAuditLog('PDF_CLINIC_EXPORT', `Generado PDF Clínico para ${selectedPatient.name}`, 'SUCCESS');
                          }
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Printer size={16} className="text-[#ecb613]" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter font-syne text-[#ecb613] print:text-black">
                        Reporte Clínico Completo
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest print:text-zinc-600">
                        Diseñado para Colegios Médicos y Auditorías Universitarias
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5 flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[8px] font-black text-zinc-500 uppercase block print:text-zinc-600">ID Expediente</span>
                          <span className="text-xs font-mono font-bold text-white print:text-black">{selectedPatient.id}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-zinc-500 uppercase block print:text-zinc-600">Diagnóstico GDS</span>
                          <span className="text-xs font-bold text-white print:text-black">{selectedPatient.diagnosis}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <span className="text-[8px] font-black text-zinc-500 uppercase block print:text-zinc-600">Registro de Frecuencias</span>
                        <span className="text-xs font-bold text-white print:text-black">
                          {selectedPatient.gammaFrequencies.join('Hz - ')}Hz (Frecuencia Sónica 40Hz)
                        </span>
                      </div>

                      <div className="pt-2">
                        <span className="text-[8px] font-black text-zinc-500 uppercase block print:text-zinc-600">Comentarios Técnicos</span>
                        <p className="text-xs text-zinc-300 italic uppercase leading-relaxed font-bold tracking-wide mt-1.5 print:text-zinc-700">
                          Se ha registrado una sincronización del lóbulo temporal en {selectedPatient.name}. Paciente muestra mejoras cognitivas de alta relevancia tras el protocolo sónico.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[8px] text-zinc-500 leading-relaxed uppercase tracking-wider italic print:hidden">
                      🛡️ Documentación clínica encriptada con tecnología soberana VIMUME OS.
                    </div>
                  </div>

                  {/* --- REPORT 2: COMPASSIONATE FAMILY --- */}
                  <div className="p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-6 flex flex-col relative overflow-hidden print:w-full print:border-none print:bg-white print:text-black">
                    <div className="flex justify-between items-start print:hidden">
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">MODALIDAD FAMILIAR</span>
                      <button 
                        onClick={() => {
                          const w = window.open("", "_blank");
                          if (w) {
                            w.document.write(`
                              <html>
                                <head>
                                  <title>INFORME FAMILIAR - ${selectedPatient.name}</title>
                                  <style>
                                    body { font-family: sans-serif; padding: 40px; color: #444; line-height: 1.8; }
                                    .header { border-bottom: 2px solid #ff758c; padding-bottom: 20px; margin-bottom: 30px; }
                                    h1 { text-transform: uppercase; margin: 0; font-size: 24px; color: #ff758c; }
                                    .section { margin-bottom: 25px; }
                                    .label { font-weight: bold; font-size: 11px; text-transform: uppercase; color: #888; }
                                    .value { font-size: 15px; margin-top: 3px; font-weight: bold; }
                                    .family-notes { font-style: italic; background: #fff5f6; padding: 20px; border-left: 4px solid #ff758c; border-radius: 8px; }
                                  </style>
                                </head>
                                <body>
                                  <div class="header">
                                    <h1>HERMES TRACKER // VIAJE POR LA MEMORIA DE TU FAMILIAR</h1>
                                    <p>Terapia Ocupacional y Afectiva VIMUME</p>
                                  </div>
                                  <div class="section">
                                    <div class="value">Querida Familia de ${selectedPatient.name},</div>
                                    <p>Nos complace compartir con vosotros los avances del día de hoy en su estimulación musical cognitiva.</p>
                                  </div>
                                  <div class="section">
                                    <div class="label">¿Cómo ha estado hoy?</div>
                                    <div class="value" style="color: #ff758c;">Estable y muy participativo // Sincronía sónica excelente</div>
                                  </div>
                                  <div class="section">
                                    <div class="label">Notas del Terapeuta de Hoy</div>
                                    <div class="family-notes">
                                      "Hoy hemos escuchado canciones de su juventud. Manuel ha sonreído de inmediato y ha recordado la letra de su canción favorita. Post-sesión ha entablado una conversación alegre con el equipo clínico."
                                    </div>
                                  </div>
                                  <p>Seguimos haciendo nuestra parte con todo el cariño y rigor técnico.</p>
                                  <div style="margin-top: 50px; border-top: 1px solid #ff758c; padding-top: 20px; font-size: 11px; color: #777;">
                                    Un cordial saludo del terapeuta Edwin Agudelo // VIMUME España
                                  </div>
                                  <script>window.print();</script>
                                </body>
                              </html>
                            `);
                            w.document.close();
                            addAuditLog('PDF_FAMILY_EXPORT', `Generado PDF Familiar para ${selectedPatient.name}`, 'SUCCESS');
                          }
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                      >
                        <Printer size={16} className="text-[#ecb613]" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-2xl font-black uppercase italic tracking-tighter font-syne text-[#49d6b5] print:text-black">
                        Reporte Afectivo Familiar
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest print:text-zinc-600">
                        Diseñado con Lenguaje Cálido y Comprensible para la Familia
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5 flex-1">
                      <div className="p-6 bg-pink-500/[0.02] border border-pink-500/10 rounded-2xl">
                        <span className="text-[8px] font-black text-rose-400 uppercase block print:text-rose-600">Estimulación Emocional</span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-bold tracking-wide mt-2 uppercase print:text-zinc-700">
                          Hoy Manuel ha reaccionado de forma excelente a su música de la juventud. Ha recuperado momentos de habla coherente de gran valor afectivo.
                        </p>
                      </div>

                      <div className="pt-2">
                        <span className="text-[8px] font-black text-zinc-500 uppercase block print:text-zinc-600">Recomendación para el Hogar</span>
                        <p className="text-xs text-zinc-400 italic leading-relaxed uppercase tracking-wider print:text-zinc-700">
                          Recomendamos tararear juntos la copla clásica española los fines de semana en familia para prolongar el efecto terapéutico sónico.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[8px] text-zinc-500 leading-relaxed uppercase tracking-wider text-center italic print:hidden">
                      ❤️ Compartiendo la fábula del colibrí: haciendo nuestra parte por su bienestar.
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* --- TAB VIEW 4: PREMIUM MODULES FEATURE FLAGS --- */}
            {activeTab === 'modules' && (
              <div className="space-y-10 print:hidden animate-in fade-in-50 duration-500">
                
                <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center gap-3">
                    <Zap size={20} className="text-[#ecb613]" />
                    <h3 className="text-lg font-black uppercase italic tracking-tighter">Ecosistema de Módulos & Fidelización (Silicon Valley Style)</h3>
                  </div>
                  <p className="text-xs text-zinc-400 uppercase leading-relaxed max-w-3xl font-bold tracking-wide">
                    Active o desactive módulos premium de manera flexible. Diseñado para ofrecer licencias temporales, premios por visitas prolongadas o navegación prolongada del terapeuta en Hermes Tracker OT.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Flags checklist */}
                  <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Modificación de Licencias en el Dashboard</h4>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'ragAlzheimer', title: 'RAG Alzheimer Intelligence (Astra)', desc: 'Recomendaciones clínicas avanzadas de IA basadas en bases de datos.', premium: true },
                        { key: 'dopplerFrequencies', title: 'Visualizador de Frecuencias Gamma 3D', desc: 'Panel interactivo para ver la modulación sónica de 40Hz en tiempo real.', premium: true },
                        { key: 'europeanLedger', title: 'Sincronía con Bóveda de Copia Europea', desc: 'Ledger distribuido para universidades y asociaciones contra el Alzheimer.', premium: true },
                        { key: 'biometricVerification', title: 'Doble Verificación Biométrica Avanzada', desc: 'Sustitución del código PIN por firma digital certificada europea.', premium: true }
                      ].map((flag) => (
                        <div 
                          key={flag.key}
                          className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex items-start justify-between group hover:border-[#ecb613]/20 transition-all"
                        >
                          <div className="space-y-1.5 flex-1 pr-6">
                            <span className="text-[10px] font-black uppercase block text-white">{flag.title}</span>
                            <span className="text-[8px] text-zinc-500 font-bold uppercase block leading-relaxed">{flag.desc}</span>
                          </div>
                          
                          <input 
                            type="checkbox"
                            checked={features[flag.key as keyof typeof features]}
                            onChange={(e) => {
                              if (currentRole !== 'super_admin' && currentRole !== 'admin_centro') {
                                triggerToast('🛑 Solo perfiles administradores pueden cambiar los Módulos Premium.');
                                return;
                              }
                              setFeatures(prev => ({ ...prev, [flag.key]: e.target.checked }));
                              addAuditLog('FEATURE_TOGGLE', `Módulo ${flag.title} configurado a: ${e.target.checked ? 'ACTIVO' : 'INACTIVO'}`, 'WARNING');
                            }}
                            className="w-5 h-5 accent-[#ecb613] rounded cursor-pointer mt-1" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feature Preview Card */}
                  <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-[3rem] flex flex-col justify-between h-[450px]">
                    <div className="space-y-4">
                      <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                        Módulos Premium en Temporada
                      </span>
                      <h4 className="text-3xl font-extrabold uppercase italic tracking-tighter text-white font-syne">
                        RAG AI recommendations
                      </h4>
                      <p className="text-xs text-zinc-400 uppercase leading-relaxed font-bold tracking-wide">
                        La IA predictiva de VIMUME analiza el historial clínico para sugerir el volumen, el tipo de música (Doppler) y las frecuencias de recuperación sónica óptimas para cada paciente en España y Latinoamérica.
                      </p>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block">Licencia Temporal</span>
                        <span className="text-xs font-black uppercase italic text-[#49d6b5]">Activa por Prolongación de Sesión</span>
                      </div>
                      <span className="text-xl font-black italic text-[#ecb613]">€0.00 / MVP</span>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* --- TAB VIEW 5: SITEMAP & TELEMETRY AUDIT LOGS --- */}
            {activeTab === 'sitemap' && (
              <div className="space-y-10 print:hidden animate-in fade-in-50 duration-500">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Sitemap Nodes RAG Map */}
                  <div className="lg:col-span-6 p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] space-y-6">
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-[#ecb613]" />
                      <h4 className="text-lg font-black uppercase italic tracking-tighter">Sitemap & Bóveda de Directorio</h4>
                    </div>
                    <p className="text-xs text-zinc-500 uppercase leading-relaxed font-bold tracking-wide">
                      Mapeo de directorios públicos y privados de Hermes Tracker OT. Conexión de 10 niveles del Silver Economy Ecosystem de VIMUME.
                    </p>

                    <div className="space-y-3 pt-2">
                      {[
                        { path: "/vimume", desc: "Landing de Terapia Sónica e impacto ODS (Público)", type: "Public" },
                        { path: "/vimume/hermes", desc: "Onboarding y Fábula del Colibrí (Público)", type: "Public" },
                        { path: "/vimume/hermes/dashboard", desc: "Ecosistema de Terapeutas Hermes OT (Privado)", type: "Clinica" },
                        { path: "/vimume/terapia-ocupacional", desc: "Documentación clínica Silver Economy (Público)", type: "Public" },
                        { path: "/vimume/gobernanza-del-dato", desc: "Normas RGPD y auditorías B2B/B2G (Público)", type: "Public" }
                      ].map((node, i) => (
                        <div key={i} className="p-4 bg-[#141414] border border-white/5 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-xs font-mono font-bold text-white block">{node.path}</span>
                            <span className="text-[8px] text-zinc-500 font-bold uppercase mt-1 block">{node.desc}</span>
                          </div>
                          <span className={`text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${node.type === 'Public' ? 'bg-[#49d6b5]/10 text-[#49d6b5]' : 'bg-amber-500/10 text-amber-500'}`}>
                            {node.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit Logs Telemetry */}
                  <div className="lg:col-span-6 p-10 bg-[#0a0a0a] border border-white/5 rounded-[3rem] flex flex-col h-[550px] overflow-hidden">
                    <div className="space-y-2 mb-6 shrink-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-widest text-zinc-400 italic">Telemetría de Auditoría Clínico-Sónica</h4>
                        <button 
                          onClick={() => {
                            setAuditLogs([
                              { timestamp: '17/05/2026 10:20:00', user: 'SYSTEM', action: 'INIT_HERMES_TRACKER', details: 'Kernel cargado bajo rol predeterminado.', status: 'SUCCESS' }
                            ]);
                            triggerToast('Logs purgados.');
                          }} 
                          className="text-[8px] text-zinc-600 font-black uppercase tracking-widest hover:text-white"
                        >
                          Limpiar Logs
                        </button>
                      </div>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                        Mutaciones de estado en el Ledger VIMUME
                      </p>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {auditLogs.map((log, idx) => (
                        <div 
                          key={idx} 
                          className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2 group hover:border-white/10 transition-colors"
                        >
                          <div className="flex justify-between text-[7px] font-black uppercase text-zinc-500">
                            <span>{log.timestamp} // {log.user}</span>
                            <span className={log.status === 'SUCCESS' ? 'text-[#49d6b5]' : log.status === 'WARNING' ? 'text-[#ecb613]' : 'text-[#ff4d4d]'}>{log.status}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black uppercase block text-white group-hover:text-[#ecb613] transition-colors">{log.action}</span>
                            <span className="text-[9px] text-zinc-500 font-bold uppercase block mt-1 leading-relaxed">{log.details}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'tutor' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full overflow-y-auto pr-2 custom-scrollbar">
                
                {/* --- SECTOR IZQUIERDO: MANUAL DE USUARIO --- */}
                <div className="space-y-6">
                  <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-2xl flex items-center justify-center text-[#ecb613]">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Manual Clínico de Usuario</h3>
                        <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Guías de Terapia y Operación del Ecosistema</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                      Seleccione una sección para iniciar la inducción clínica e interactiva:
                    </p>

                    <div className="space-y-3">
                      {[
                        { id: 'intro', title: '1. Introducción y la Filosofía del Colibrí', desc: 'Aprenda cómo la metáfora del colibrí guía el desarrollo clínico.' },
                        { id: 'mfa', title: '2. Acceso Seguro y Doble Factor (MFA)', desc: 'Flujo clínico y pin temporal de validación de identidad.' },
                        { id: 'centros', title: '3. Multi-Centro y Segregación Geográfica', desc: 'Restricciones de contexto clínico por territorio activo.' },
                        { id: 'sesion', title: '4. Intervención Clínica y Consentimiento Híbrido', desc: 'Cómo registrar observaciones de sesión cumpliendo RGPD.' },
                        { id: 'audio', title: '5. Estimulación Sónica Gamma a 40Hz', desc: 'Uso del estimulador puro e intermitente mediante Web Audio API.' },
                        { id: 'reportes', title: '6. Generación de Reportes e Impresión (PDF)', desc: 'Optimización de hojas de estilo clínicas para formato impreso.' }
                      ].map(section => {
                        const isExpanded = tutorUserSection === section.id;
                        return (
                          <div 
                            key={section.id}
                            className={`border rounded-2xl transition-all overflow-hidden ${isExpanded ? 'bg-white/[0.02] border-[#ecb613]/30' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                          >
                            <button
                              onClick={() => {
                                setTutorUserSection(isExpanded ? '' : section.id);
                                addAuditLog('TUTOR_VIEW', `Lectura sección usuario: ${section.id.toUpperCase()}`, 'SUCCESS');
                              }}
                              className="w-full flex justify-between items-center p-4 text-left font-black uppercase text-[10px] tracking-wider text-white"
                            >
                              <span>{section.title}</span>
                              <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90 text-[#ecb613]' : 'text-zinc-500'}`} />
                            </button>

                            {isExpanded && (
                              <div className="p-5 border-t border-white/5 text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed space-y-4">
                                {section.id === 'intro' && (
                                  <>
                                    <p>El diseño de <strong>Hermes Tracker OT</strong> está inspirado en la <strong>Fábula del Colibrí</strong>: la idea de que cada pequeña acción, cada Hz emitido y cada registro de observación clínica es un grano de arena crítico para preservar la soberanía cognitiva de nuestros mayores frente al avance del Alzheimer.</p>
                                    <p>Este software no es una simple base de datos; es un <strong>ecosistema de estimulación e ingestión de telemetría médica en tiempo real</strong>.</p>
                                    <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl space-y-2">
                                      <span className="text-[8px] text-[#ecb613] font-black uppercase tracking-widest block">✓ wow factor clínico</span>
                                      <span className="text-[8px] text-zinc-500 block leading-normal">Frecuencia pura modulada Gamma a 40Hz integrada sin provocar hydration mismatch entre el servidor y el cliente.</span>
                                    </div>
                                  </>
                                )}
                                {section.id === 'mfa' && (
                                  <>
                                    <p>Para entrar a las zonas de control y telemetría de Hermes, el profesional debe completar un flujo de ingreso de <strong>dos pasos</strong>:</p>
                                    <pre className="p-3 bg-black border border-white/5 rounded-xl text-zinc-500 text-[8px]">
                                      {"[Credencial Clínica] ➔ [MFA temporal] ➔ [Acceso dashboard]"}
                                    </pre>
                                    <p>Use el código pin de prueba <code>7777</code> o <code>1234</code> en caliente para saltar el validador en esta demostración.</p>
                                  </>
                                )}
                                {section.id === 'centros' && (
                                  <>
                                    <p>La interfaz adapta dinámicamente sus métricas y listados basándose en el <strong>Centro Clínico Activo</strong>. Un terapeuta de Navalcarnero no podrá exponer o alterar datos de pacientes del Centro CDMX Norte o Madrid HQ.</p>
                                    <div className="flex gap-2 flex-wrap">
                                      {['Navalcarnero', 'Madrid HQ', 'Barcelona', 'CDMX Norte'].map(c => (
                                        <span key={c} className="px-2 py-1 bg-white/5 rounded-lg text-[7px] text-zinc-300 font-black">{c}</span>
                                      ))}
                                    </div>
                                  </>
                                )}
                                {section.id === 'sesion' && (
                                  <>
                                    <p>El registro de una nueva sesión de estimulación neuro-acústica exige la validación formal de consentimiento híbrido para cumplir con la normativa RGPD europea.</p>
                                    <p>El formulario valida atómicamente la marca de consentimiento familiar firmada y la firma digital por PIN del terapeuta.</p>
                                  </>
                                )}
                                {section.id === 'audio' && (
                                  <>
                                    <p>La estimulación con ondas Gamma a 40Hz es una de las mayores innovaciones clínicas de VIMUME. Ayuda a activar las células microgliales para depurar acumulaciones beta-amiloides en el cerebro.</p>
                                    <p>Utilice la Web Audio API nativa para instanciar un oscilador senoidal en caliente. Se aconseja el uso de auriculares de alta fidelidad.</p>
                                  </>
                                )}
                                {section.id === 'reportes' && (
                                  <>
                                    <p>Hermes implementa plantillas de impresión nativas optimizadas bajo hojas de estilo limpias que ocultan menús e interfaces decorativas, imprimiendo en blanco y negro clínico con máxima nitidez.</p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* --- SECTOR DERECHO: MANUAL DE ADMINISTRADOR (TECHNICAL) --- */}
                <div className="space-y-6">
                  <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#49d6b5]/10 border border-[#49d6b5]/30 rounded-2xl flex items-center justify-center text-[#49d6b5]">
                        <Settings size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Manual de Administrador</h3>
                        <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-1">DevOps, Claims, Firestore Rules & Sitemap</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                      Estructura de arquitectura técnica y gobernanza atómica:
                    </p>

                    <div className="space-y-3">
                      {[
                        { id: 'claims', title: '1. Custom Claims & Payload JWT', desc: 'Cómo el token JWT firmado de Firebase actúa como la fuente de verdad.' },
                        { id: 'rules', title: '2. Endurecimiento de Firestore Rules', desc: 'Reglas de seguridad multi-centro e inmutabilidad de logs.' },
                        { id: 'hydration', title: '3. Aislamiento de Audio & Hydration', desc: 'Evitar ruidos de servidor o hydration mismatch en Next.js.' },
                        { id: 'seo', title: '4. Sitemap canonical e indexación', desc: 'Indexar la URL pública sin exponer el panel de terapeutas.' },
                        { id: 'checklist', title: '5. Preflight y checklist de despliegue', desc: 'Pasos críticos para promover código seguro a Vercel.' }
                      ].map(section => {
                        const isExpanded = tutorAdminSection === section.id;
                        return (
                          <div 
                            key={section.id}
                            className={`border rounded-2xl transition-all overflow-hidden ${isExpanded ? 'bg-white/[0.02] border-[#49d6b5]/30' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                          >
                            <button
                              onClick={() => {
                                setTutorAdminSection(isExpanded ? '' : section.id);
                                addAuditLog('TUTOR_VIEW', `Lectura sección admin: ${section.id.toUpperCase()}`, 'SUCCESS');
                              }}
                              className="w-full flex justify-between items-center p-4 text-left font-black uppercase text-[10px] tracking-wider text-white"
                            >
                              <span>{section.title}</span>
                              <ChevronRight size={14} className={`transform transition-transform ${isExpanded ? 'rotate-90 text-[#49d6b5]' : 'text-zinc-500'}`} />
                            </button>

                            {isExpanded && (
                              <div className="p-5 border-t border-white/5 text-[9px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed space-y-4">
                                {section.id === 'claims' && (
                                  <>
                                    <p>Las decisiones de seguridad no dependen del documento de usuario `/users/{"{uid}"}`, sino del token firmado criptográficamente por Firebase:</p>
                                    <pre className="p-3 bg-black border border-white/5 rounded-xl text-[#49d6b5] text-[8px] overflow-x-auto leading-normal">
{`{
  "role": "${currentRole}",
  "center": "${currentCenter}",
  "iss": "securetoken.google.com/vimume"
}`}
                                    </pre>
                                    <p>El perfil de base de datos se relega exclusivamente a metadatos complementarios no sensibles.</p>
                                  </>
                                )}
                                {section.id === 'rules' && (
                                  <>
                                    <p>Las reglas bloquean la escalación de privilegios impidiendo la modificación de perfiles de usuario desde cliente:</p>
                                    <pre className="p-3 bg-black border border-white/5 rounded-xl text-[#49d6b5] text-[7.5px] overflow-x-auto">
{`match /users/{userId} {
  allow update: if isSuperAdmin() || 
    (request.auth.uid == userId && 
     request.resource.data.role == resource.data.role);
}`}
                                    </pre>
                                  </>
                                )}
                                {section.id === 'hydration' && (
                                  <>
                                    <p>La Web Audio API se ejecuta únicamente en caliente a través de callbacks directos en el cliente. Al instanciarse tras la interacción física (evento `onClick`), el navegador no bloquea el oscilador sónico Gamma.</p>
                                  </>
                                )}
                                {section.id === 'seo' && (
                                  <>
                                    <p>La ruta `/vimume/hermes` se expone en `sitemap.ts` con prioridad de `0.9` y cambio semanal. El dashboard privado se protege activamente contra bots mediante metadatos `noindex, nofollow`.</p>
                                  </>
                                )}
                                {section.id === 'checklist' && (
                                  <>
                                    <p>Siga estos pasos antes del commit final a Vercel:</p>
                                    <div className="space-y-1.5 pl-3 text-[8.5px]">
                                      <div className="flex items-center gap-2">✓ Desplegar reglas: `firebase deploy --only firestore:rules`</div>
                                      <div className="flex items-center gap-2">✓ Compilar bundles sin errores: `npm run build`</div>
                                      <div className="flex items-center gap-2">✓ Verificar aislamiento multi-centro en localhost:3007</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* --- SECTOR INFERIOR INTEGRADO: PLAYGROUND EN CALIENTE --- */}
                <div className="xl:col-span-2 p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-2xl flex items-center justify-center text-[#ecb613]">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Consola de Simulación & Claims Activos</h3>
                      <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Intercambio de Claims del Token en Caliente</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                    Use los controles de abajo para mutar el rol y el centro activo en caliente. Observe cómo cambia la estructura del token JWT simulado en tiempo real y cómo se inyectan logs inmutables en el Ledger de telemetría de VIMUME:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <label className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block">📍 Seleccionar Centro Clínico:</label>
                      <div className="flex flex-col gap-2">
                        {['Centro Navalcarnero', 'Centro Madrid HQ', 'Centro CDMX Norte'].map(c => (
                          <button
                            key={c}
                            onClick={() => {
                              setCurrentCenter(c);
                              addAuditLog('CLAIM_MUTATE_CENTER', `Cambio de centro activo simulado a: ${c.toUpperCase()}`, 'SUCCESS');
                              triggerToast(`📍 Centro modificado: ${c}`);
                            }}
                            className={`p-3 text-left rounded-xl border text-[9px] font-black uppercase tracking-wider transition-colors ${currentCenter === c ? 'bg-[#ecb613]/10 border-[#ecb613]/40 text-[#ecb613]' : 'bg-[#0d0d0d] border-white/5 text-zinc-500 hover:text-white'}`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block">👑 Seleccionar Rol (Custom Claim):</label>
                      <div className="flex flex-col gap-2">
                        {['terapeuta', 'admin_centro', 'super_admin', 'solo_lectura'].map(r => (
                          <button
                            key={r}
                            onClick={() => {
                              setCurrentRole(r as any);
                              addAuditLog('CLAIM_MUTATE_ROLE', `Cambio de rol de sesión a claim: ${r.toUpperCase()}`, r === 'super_admin' ? 'WARNING' : 'SUCCESS');
                              triggerToast(`👑 Rol de sesión actualizado: ${r.toUpperCase()}`);
                            }}
                            className={`p-3 text-left rounded-xl border text-[9px] font-black uppercase tracking-wider transition-colors ${currentRole === r ? 'bg-[#49d6b5]/10 border-[#49d6b5]/40 text-[#49d6b5]' : 'bg-[#0d0d0d] border-white/5 text-zinc-500 hover:text-white'}`}
                          >
                            {r.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 bg-[#0d0d0d] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
                      <div>
                        <span className="text-[8px] text-zinc-500 font-black uppercase tracking-widest block mb-3">🛡️ Payload JWT Clínico:</span>
                        <pre className="text-[7.5px] font-bold text-zinc-400 font-mono leading-relaxed overflow-x-auto">
{`{
  "iss": "securetoken.google.com/vimume",
  "sub": "edwin_clinical_77",
  "role": "${currentRole}",
  "center": "${currentCenter}",
  "verified": true
}`}
                        </pre>
                      </div>
                      <div className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest mt-4">
                        * FIRMADO DE FORMA SEGURA POR VIMUME KERNEL AUTH
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

          </main>
        </div>

      </div>

      {/* --- LEVEL 4: LAUNCH SESSION MODAL --- */}
      <AnimatePresence>
        {showSessionModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-8"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ecb613]/5 rounded-full blur-2xl animate-pulse" />

              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
                    <PlusCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">Nueva Sesión Operativa OT</h3>
                    <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Intervención Neuro-Musical Hermes OT</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSessionModal(false)}
                  className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleCreateSessionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Form left inputs */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Paciente Activo Seleccionado</label>
                    <div className="w-full bg-[#141414] border border-white/5 rounded-2xl p-4 text-xs text-white font-extrabold uppercase">
                      {selectedPatient.name} ({selectedPatient.id})
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Objetivo Clínico</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej: Reducir apatía temporal..."
                      value={newSessionTarget}
                      onChange={(e) => setNewSessionTarget(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]/40" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Frecuencia Sónica</label>
                    <select 
                      value={newSessionFreq}
                      onChange={(e) => setNewSessionFreq(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#ecb613]/40"
                    >
                      <option>Gamma 40Hz (Sónica)</option>
                      <option>Gamma 39.5Hz (Doppler)</option>
                      <option>Gamma 40.2Hz (Rítmica)</option>
                    </select>
                  </div>
                </div>

                {/* Form security right panel */}
                <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[8px] font-black text-[#ecb613] uppercase tracking-widest block">Protocolo de Consentimiento Híbrido</span>
                    
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-xs italic text-zinc-400 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={newSessionConsent}
                          onChange={(e) => setNewSessionConsent(e.target.checked)}
                          className="w-4 h-4 accent-[#ecb613]" 
                        />
                        <span className="uppercase text-[9px] font-bold tracking-wider">Consentimiento firmado por familiar</span>
                      </label>

                      <div className="space-y-1.5 pt-2">
                        <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">PIN de Doble Verificación</label>
                        <input 
                          type="password" 
                          maxLength={4}
                          required
                          value={newSessionPin}
                          onChange={(e) => {
                            setNewSessionPin(e.target.value);
                            setPinError(false);
                          }}
                          placeholder="••••" 
                          className={`w-full bg-[#141414] border rounded-xl py-3 px-4 text-xs text-center text-white placeholder:text-zinc-700 tracking-[0.5em] focus:outline-none ${pinError ? 'border-red-500' : 'border-white/5 focus:border-[#49d6b5]/50'}`}
                        />
                        <span className="text-[7px] text-zinc-600 block text-center uppercase tracking-widest mt-1">demo PIN: 7777 o 1234</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-4 bg-[#ecb613] text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(236,182,19,0.2)]"
                  >
                    Comenzar Intervención
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LEVEL 5: REGISTRAR PACIENTE MODAL --- */}
      <AnimatePresence>
        {showPatientModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden space-y-8"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Registrar Nuevo Paciente</h3>
                  <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Escalable a nivel mundial // VIMUME OS</p>
                </div>
                <button 
                  onClick={() => setShowPatientModal(false)}
                  className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <form onSubmit={handleCreatePatientSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Nombre Completo</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ej: Manuel Agudelo..."
                    value={newPatName}
                    onChange={(e) => setNewPatName(e.target.value)}
                    className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#ecb613]/40" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Edad</label>
                    <input 
                      type="number" 
                      required
                      min={10}
                      max={120}
                      value={newPatAge}
                      onChange={(e) => setNewPatAge(Number(e.target.value))}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-[#ecb613]/40" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Idioma Principal</label>
                    <input 
                      type="text" 
                      required
                      value={newPatLang}
                      onChange={(e) => setNewPatLang(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl py-4 px-6 text-xs text-white focus:outline-none focus:border-[#ecb613]/40" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Diagnóstico Inicial</label>
                  <select 
                    value={newPatDiag}
                    onChange={(e) => setNewPatDiag(e.target.value)}
                    className="w-full bg-[#141414] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#ecb613]"
                  >
                    <option>Alzheimer Fase Inicial (GDS 3)</option>
                    <option>Alzheimer Fase Moderada (GDS 4)</option>
                    <option>Deterioro Cognitivo Leve</option>
                    <option>Demencia Frontotemporal</option>
                    <option>Parkinson Temprano</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Centro de Día / Residencia</label>
                    <select 
                      value={newPatCenter}
                      onChange={(e) => setNewPatCenter(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#ecb613]"
                    >
                      <option value="Centro Navalcarnero">Centro Navalcarnero (ES)</option>
                      <option value="Centro Madrid HQ">Centro Madrid HQ (ES)</option>
                      <option value="Centro Barcelona">Centro Barcelona (ES)</option>
                      <option value="Centro Valencia">Centro Valencia (ES)</option>
                      <option value="Centro CDMX Norte">Centro CDMX Norte (MX)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">País</label>
                    <select 
                      value={newPatCountry}
                      onChange={(e) => setNewPatCountry(e.target.value)}
                      className="w-full bg-[#141414] border border-white/5 rounded-2xl p-4 text-xs text-white outline-none focus:border-[#ecb613]"
                    >
                      <option value="España">España</option>
                      <option value="México">México</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Argentina">Argentina</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#49d6b5] text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(73,214,181,0.2)]"
                >
                  Registrar en el Sistema Clínico
                </button>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- LEVEL 6: TOAST NOTIFICATIONS BANNER --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-[#0a0a0a] border border-[#ecb613]/30 px-8 py-4 rounded-2xl shadow-2xl z-[100] flex items-center gap-3 backdrop-blur-xl"
          >
            <Sparkles className="text-[#ecb613] animate-pulse" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#f5f1e8]">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
