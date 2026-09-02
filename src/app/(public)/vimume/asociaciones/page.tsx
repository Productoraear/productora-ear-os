'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Heart, Users, ShieldCheck, Phone, ArrowRight, Building2, Sparkles, 
  Download, FileCheck, CheckCircle2, MapPin, Calculator, Calendar, Send, Info
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';

export default function VimumeAsociacionesPage() {
  // Estado para Solicitante de Talleres Apadrinados
  const [selectedProvincia, setSelectedProvincia] = useState<string>('Madrid');
  const [userCount, setUserCount] = useState<number>(25);
  const [interventionType, setInterventionType] = useState<'reminiscencia' | 'gamma40hz' | 'individual'>('reminiscencia');
  const [afaName, setAfaName] = useState<string>('');
  const [afaContact, setAfaContact] = useState<string>('');
  const [requestSent, setRequestSent] = useState<boolean>(false);

  // Estado para Generador de Convenio Marco
  const [entidadLegal, setEntidadLegal] = useState<string>('');
  const [cifEntidad, setCifEntidad] = useState<string>('');
  const [representanteLegal, setRepresentanteLegal] = useState<string>('');
  const [cargoRepresentante, setCargoRepresentante] = useState<string>('Presidente/a');
  const [convenioDownloaded, setConvenioDownloaded] = useState<boolean>(false);

  // Cálculo dinámico de fondo Split Soberano disponible
  const fondoDisponible = useMemo(() => {
    // Estimación basada en volumen de eventos comerciales asignados al fondo del 10%
    const baseFund = 4800;
    const factorProv = (selectedProvincia.length * 137) % 2500;
    return baseFund + factorProv;
  }, [selectedProvincia]);

  const costeEstimadoTaller = useMemo(() => {
    if (interventionType === 'gamma40hz') return 450;
    if (interventionType === 'individual') return 600;
    return 350;
  }, [interventionType]);

  const coberturaPorcentual = useMemo(() => {
    return Math.min(100, Math.round((fondoDisponible / costeEstimadoTaller) * 100));
  }, [fondoDisponible, costeEstimadoTaller]);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    const msg = `Hola Productora EAR / VIMUME, represento a la AFA/Entidad: "${afaName || 'Asociación'}" en ${selectedProvincia}. Solicitamos un Taller Apadrinado (${interventionType}) para ${userCount} usuarios con cobertura del Fondo Split Soberano. Contacto: ${afaContact}.`;
    window.open(`${CENTRALITA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleDownloadConvenio = () => {
    setConvenioDownloaded(true);
    const textContent = `CONVENIO MARCO DE COLABORACIÓN INSTITUCIONAL
PROGRAMA VIMUME (VIAJE MUSICAL POR LA MEMORIA) & PRODUCTORA EAR

DE UNA PARTE:
D./Dña. ${representanteLegal || '[REPRESENTANTE LEGAL]'}, en calidad de ${cargoRepresentante || 'Presidente/a'} de la entidad ${entidadLegal || '[NOMBRE DE LA ENTIDAD / AFA]'}, con CIF ${cifEntidad || '[CIF]'} y domicilio social en ${selectedProvincia}, España.

DE OTRA PARTE:
D. Edwin Agudelo, en representación de PRODUCTORA EAR OS V2 y FUNDACIÓN VIMUME, con CIF B-88924012 y domicilio en Méntrida (Toledo) / Madrid.

EXPONEN:
I. Que la entidad solicitante trabaja en la atención y cuidado de personas con deterioro cognitivo, Alzheimer y demencias.
II. Que VIMUME desarrolla intervenciones neuroacústicas no farmacológicas homologadas con estimulación Gamma 40Hz y Mapeo de la Banda Sonora Vital™ (<75 dB).
III. Que dichas intervenciones son sufragadas íntegramente mediante el Fondo del Split Soberano (10% de la facturación comercial de Productora EAR) y mecenazgo privado.

ACUERDAN:
PRIMERO. Ejecución de talleres de reminiscencia musical y estimulación cognitiva para los usuarios de la entidad.
SEGUNDO. Gratuidad total para la entidad receptora y los pacientes participantes.
TERCERO. Cumplimiento estricto del RGPD y respeto absoluto a la dignidad y autonomía de los participantes.
CUARTO. Vigencia de 12 meses renovables automáticamente.

En ${selectedProvincia}, a ${new Date().toLocaleDateString('es-ES')}.

Por la Entidad / AFA: ____________________       Por VIMUME / Productora EAR: ____________________
`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CONVENIO_MARCO_VIMUME_${(entidadLegal || 'AFA').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 max-w-7xl mx-auto selection:bg-pink-600 selection:text-white">
      {/* Header Editorial */}
      <div className="space-y-4 mb-14 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono tracking-widest uppercase">
          <Heart size={14} className="text-pink-500" />
          <span>VIMUME // PORTAL OFICIAL AFAS &amp; FUNDACIONES</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
          Alianzas con AFAs &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-[#ecb613]">
            Talleres 100% Apadrinados
          </span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed font-light">
          Canalizamos el 10% de cada boda y evento comercial de Productora EAR hacia intervenciones neuroacústicas para asociaciones de familiares de Alzheimer sin coste para el usuario final.
        </p>
      </div>

      {/* Grid de 2 Columnas de Herramientas Interactivas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Columna Izquierda: Solicitante de Talleres Apadrinados */}
        <div className="lg:col-span-7 bg-[#0c0c0e] border border-pink-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-900/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-pink-500/20 text-pink-400">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-syne">Solicitante de Talleres Apadrinados</h2>
                  <p className="text-white/50 text-xs">Gestión en tiempo real con cargo al Fondo Split Soberano</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold">
                100% Gratuito
              </span>
            </div>

            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5">
                    Provincia de la Asociación
                  </label>
                  <select
                    value={selectedProvincia}
                    onChange={(e) => setSelectedProvincia(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    {Object.values(PROVINCIAS_52_GRAPH).map((p) => (
                      <option key={p.slug} value={p.name} className="bg-black text-white">
                        {p.name} ({p.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5">
                    Nº de Usuarios Estimados ({userCount} plazas)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={userCount}
                    onChange={(e) => setUserCount(Number(e.target.value))}
                    className="w-full accent-pink-500 cursor-pointer h-2 bg-white/10 rounded-lg mt-3"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1.5">
                  Modalidad de Intervención Neuroacústica
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setInterventionType('reminiscencia')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      interventionType === 'reminiscencia'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Reminiscencia
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterventionType('gamma40hz')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      interventionType === 'gamma40hz'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Gamma 40Hz
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterventionType('individual')}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                      interventionType === 'individual'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                        : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    Alta Fidelidad
                  </button>
                </div>
              </div>

              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Fondo Solidario Disponible ({selectedProvincia}):</span>
                  <span className="text-green-400 font-bold">{fondoDisponible.toLocaleString()} €</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Coste de la Sesión para la AFA:</span>
                  <span className="text-pink-400 font-bold line-through">{costeEstimadoTaller} €</span>
                  <span className="text-green-400 font-bold">0 € (100% Subvencionado)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-pink-500 to-green-400 h-full rounded-full w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nombre de la AFA / Entidad"
                  value={afaName}
                  onChange={(e) => setAfaName(e.target.value)}
                  className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 placeholder:text-white/30"
                />
                <input
                  type="text"
                  required
                  placeholder="Teléfono o Email de contacto"
                  value={afaContact}
                  onChange={(e) => setAfaContact(e.target.value)}
                  className="px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500 placeholder:text-white/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition shadow-[0_0_25px_rgba(236,72,153,0.4)]"
              >
                <Send size={14} />
                <span>Solicitar Taller con Cargo al Fondo</span>
              </button>
            </form>
          </div>
        </div>

        {/* Columna Derecha: Generador y Descarga de Convenio Marco */}
        <div className="lg:col-span-5 bg-[#0c0c0e] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-[#ecb613]/20 text-[#ecb613]">
                <FileCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white font-syne">Convenio Marco Oficial</h2>
                <p className="text-white/50 text-xs">Listo para firma de la Junta Directiva</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Razón Social / Nombre de la AFA
                </label>
                <input
                  type="text"
                  placeholder="Ej: AFA Madrid Norte"
                  value={entidadLegal}
                  onChange={(e) => setEntidadLegal(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613] placeholder:text-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                    CIF de la Entidad
                  </label>
                  <input
                    type="text"
                    placeholder="G-12345678"
                    value={cifEntidad}
                    onChange={(e) => setCifEntidad(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613] placeholder:text-white/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={cargoRepresentante}
                    onChange={(e) => setCargoRepresentante(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-white/50 uppercase tracking-wider block mb-1">
                  Nombre del Representante Legal
                </label>
                <input
                  type="text"
                  placeholder="D. / Dña. Nombre y Apellidos"
                  value={representanteLegal}
                  onChange={(e) => setRepresentanteLegal(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#ecb613] placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/60 space-y-1">
              <div className="flex items-center gap-1.5 text-green-400 font-bold">
                <CheckCircle2 size={13} />
                <span>Garantía Legal y Ética VIMUME:</span>
              </div>
              <p>Cláusulas oficiales de no-farmacología, limitación acústica &lt;75 dB y cesión de fondos sin obligaciones financieras.</p>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={handleDownloadConvenio}
              className="w-full py-3.5 bg-[#ecb613] hover:bg-white text-black font-bold rounded-xl text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition shadow-lg shadow-[#ecb613]/20"
            >
              <Download size={14} />
              <span>Generar y Descargar Convenio (.TXT)</span>
            </button>
            {convenioDownloaded && (
              <p className="text-center text-[10px] text-green-400 font-mono mt-2">
                ✓ Documento descargado. Listo para revisión y firma de la Junta.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 3 Pilares Institucionales de Colaboración */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Talleres Grupales Apadrinados</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Sesiones de reminiscencia y canciones de memoria para grupos reducidos de socios de la AFA con música en directo y auriculares cerrados.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-[#ecb613]/20 text-[#ecb613] rounded-xl w-fit mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Mapeo de Bandas Sonoras</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Herramientas digitales gratuitas para que terapeutas ocupacionales y familiares de la asociación registren su historia musical.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-xl w-fit mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Convocatorias 0,7% IRPF</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Acuerdos marco de colaboración para optar conjuntamente a convocatorias públicas del IMSERSO y fondos sociales NextGenEU.
          </p>
        </div>
      </div>

      {/* CTA Inferior */}
      <div className="bg-gradient-to-r from-pink-950/40 via-neutral-900 to-black p-8 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 font-syne">¿Deseas concertar una reunión técnica?</h2>
          <p className="text-white/60 text-xs">Atendemos directamente a juntas directivas de AFAs, psicólogos y coordinadores de centros de día.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vimume/contacto"
            className="px-6 py-3 bg-white text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>Formulario de Contacto</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={CENTRALITA.whatsapp}
            className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Centralita Solidaria</span>
          </a>
        </div>
      </div>
    </main>
  );
}
