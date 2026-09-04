import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { ApproveDraftClient } from './ApproveDraftClient';
import { ShieldCheck, FileText, Database, Sparkles } from 'lucide-react';

export default async function AprobacionesPage() {
    const basePath = path.join(process.cwd(), 'src', 'data');
    
    let bioStats = null;
    let objStats = null;
    
    try {
        const bioPath = path.join(basePath, 'edwin-true-bio-ssot_draft.json');
        const stat = await fs.stat(bioPath);
        const bioRaw = await fs.readFile(bioPath, 'utf-8');
        const bioJson = JSON.parse(bioRaw);
        const dataArr = Array.isArray(bioJson.data) ? bioJson.data : (Array.isArray(bioJson) ? bioJson : []);
        bioStats = {
            count: dataArr.length,
            sizeKb: Math.round(stat.size / 1024),
            samples: dataArr.slice(0, 4).map((d: any) => ({
                filepath: d.filepath,
                snippet: (d.content_snippet || '').slice(0, 240)
            }))
        };
    } catch (e) {}

    try {
        const objPath = path.join(basePath, 'oraculo-300-objeciones-ssot_draft.json');
        const stat = await fs.stat(objPath);
        const objRaw = await fs.readFile(objPath, 'utf-8');
        const objJson = JSON.parse(objRaw);
        const dataArr = Array.isArray(objJson.data) ? objJson.data : (Array.isArray(objJson) ? objJson : []);
        objStats = {
            count: dataArr.length,
            sizeKb: Math.round(stat.size / 1024),
            samples: dataArr.slice(0, 4).map((d: any) => ({
                filepath: d.filepath,
                snippet: (d.content_snippet || '').slice(0, 240)
            }))
        };
    } catch (e) {}

    return (
        <div className="min-h-screen bg-[#050507] text-white p-6 sm:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase mb-3">
                            <ShieldCheck size={14} />
                            <span>PROTOCOLO ZERO-TRUST // BANDEJA DE CUARENTENA FORENSE</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight uppercase">
                            Bandeja de Aprobación <span className="text-[#ecb613]">Omni-Drive</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl font-light">
                            Los datos minados residen en cuarentena como borrador. Al pulsar &quot;Aprobar y Sellar&quot;, se transforman en el SSOT inmutable del Oráculo de EAR OS.
                        </p>
                    </div>

                    <div className="bg-black/60 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-xs font-mono font-bold text-zinc-300">Escáner Completado</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* BIO CARD */}
                    <div className="border border-white/10 rounded-3xl p-6 sm:p-8 bg-[#08080c] flex flex-col justify-between space-y-6 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 flex items-center justify-center text-[#8b5cf6]">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold font-syne text-white uppercase">Biografía Verdadera SSOT</h2>
                                        <span className="text-[10px] font-mono text-zinc-400">edwin-true-bio-ssot_draft.json</span>
                                    </div>
                                </div>
                                {bioStats && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                                        {bioStats.count} Archivos Minados
                                    </span>
                                )}
                            </div>

                            {bioStats ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-mono text-zinc-400 bg-black/40 p-3 rounded-xl border border-white/5">
                                        <span>Tamaño del Borrador: <strong className="text-white">{(bioStats.sizeKb / 1024).toFixed(1)} MB</strong></span>
                                        <span className="text-[#ecb613] font-bold">ESTADO: CUARENTENA</span>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Muestras Relevantes Extraídas:</span>
                                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                            {bioStats.samples.map((s: any, idx: number) => (
                                                <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                                                    <span className="text-[9px] font-mono text-zinc-400 truncate block font-bold">{s.filepath}</span>
                                                    <p className="text-[11px] text-zinc-300 font-mono italic line-clamp-2">&quot;{s.snippet}...&quot;</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-zinc-500 italic text-sm border border-dashed border-white/10 rounded-2xl">
                                    No hay borradores en cuarentena pendientes de revisión.
                                </div>
                            )}
                        </div>

                        {bioStats && <ApproveDraftClient target="bio" />}
                    </div>
                    
                    {/* OBJ CARD */}
                    <div className="border border-white/10 rounded-3xl p-6 sm:p-8 bg-[#08080c] flex flex-col justify-between space-y-6 shadow-xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#ecb613]/20 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613]">
                                        <Database size={20} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold font-syne text-white uppercase">300 Objeciones & Incubadora</h2>
                                        <span className="text-[10px] font-mono text-zinc-400">oraculo-300-objeciones-ssot_draft.json</span>
                                    </div>
                                </div>
                                {objStats && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                                        {objStats.count} Archivos Minados
                                    </span>
                                )}
                            </div>

                            {objStats ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs font-mono text-zinc-400 bg-black/40 p-3 rounded-xl border border-white/5">
                                        <span>Tamaño del Borrador: <strong className="text-white">{(objStats.sizeKb / 1024).toFixed(1)} MB</strong></span>
                                        <span className="text-[#ecb613] font-bold">ESTADO: CUARENTENA</span>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Muestras Relevantes Extraídas:</span>
                                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                                            {objStats.samples.map((s: any, idx: number) => (
                                                <div key={idx} className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                                                    <span className="text-[9px] font-mono text-zinc-400 truncate block font-bold">{s.filepath}</span>
                                                    <p className="text-[11px] text-zinc-300 font-mono italic line-clamp-2">&quot;{s.snippet}...&quot;</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 text-center text-zinc-500 italic text-sm border border-dashed border-white/10 rounded-2xl">
                                    No hay borradores en cuarentena pendientes de revisión.
                                </div>
                            )}
                        </div>

                        {objStats && <ApproveDraftClient target="obj" />}
                    </div>
                </div>
            </div>
        </div>
    );
}
