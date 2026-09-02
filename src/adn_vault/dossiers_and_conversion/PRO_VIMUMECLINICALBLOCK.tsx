'use client';

import React from 'react';
import { Activity, Brain, FileText, ShieldCheck } from 'lucide-react';

export const VIMUMEClinicalBlock: React.FC<{ ciudad?: string }> = ({ ciudad = "Madrid" }) => {
    return (
        <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
            <div className="max-w-5xl mx-auto px-6">

                {/* HEADLINE CIENTÍFICO */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 mb-4">
                        <Activity size={14} className="text-blue-400" />
                        <span className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Evidencia Clínica Nivel I</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
                        Más que Música: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Neuroestimulación Gamma (40Hz)</span>
                    </h3>
                    <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
                        Implementamos en {ciudad} los protocolos validados por el <strong>Picower Institute for Learning and Memory (MIT)</strong>. No es entretenimiento, es activación de la microglía cerebral para la reducción de patógenos.
                    </p>
                </div>

                {/* GRID DE EVIDENCIA */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* CARD 1: PLACAS AMILOIDES */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                        <Brain className="text-blue-400 mb-4" size={32} />
                        <h4 className="text-xl font-bold text-white mb-2">Limpieza Amiloide</h4>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            La estimulación sensorial a 40Hz promueve la activación de la microglía, reduciendo la carga de placas beta-amiloides en el córtex auditivo e hipocampo.
                        </p>
                        <div className="text-[10px] font-mono text-gray-500 bg-black/30 p-2 rounded">
                            Ref: Iaccarino et al. (Nature, 2016)
                        </div>
                    </div>

                    {/* CARD 2: CONECTIVIDAD */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                        <Activity className="text-emerald-400 mb-4" size={32} />
                        <h4 className="text-xl font-bold text-white mb-2">Sincronización Neural</h4>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            Restauración de la coherencia gamma oscilatoria. Mejora la conectividad funcional en la Red Neuronal por Defecto (DMN), crítica para la memoria autobiográfica.
                        </p>
                        <div className="text-[10px] font-mono text-gray-500 bg-black/30 p-2 rounded">
                            Ref: Adaikkan et al. (Neuron, 2019)
                        </div>
                    </div>

                    {/* CARD 3: ECONOMÍA DE CUIDADOS */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-ear-gold/30 transition-colors">
                        <ShieldCheck className="text-ear-gold mb-4" size={32} />
                        <h4 className="text-xl font-bold text-white mb-2">Impacto Farmacológico</h4>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            Reducción documentada en la necesidad de psicofármacos para el control de la ansiedad y agitación nocturna (Sindrome del Ocaso).
                        </p>
                        <div className="text-[10px] font-mono text-gray-500 bg-black/30 p-2 rounded">
                            Data: VIMUME Pilot Study (2025)
                        </div>
                    </div>
                </div>

                {/* CTA DESCARGA DOSSIER TÉCNICO */}
                <div className="bg-gradient-to-r from-blue-900/20 to-emerald-900/20 rounded-2xl p-8 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2">Dossier Técnico para Intervención Municipal</h4>
                        <p className="text-sm text-gray-400">
                            Descargue el informe de compatibilidad con Fondos NextGenerationEU para la implantación en {ciudad}.
                        </p>
                    </div>
                    <button className="px-6 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:scale-105 transition-transform">
                        <FileText size={16} /> Descargar PDF Técnico
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VIMUMEClinicalBlock;
