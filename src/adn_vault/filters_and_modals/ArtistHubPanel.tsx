"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

// S-Class Dynamic Icons
const User = dynamic(() => import('lucide-react').then(m => m.User), { ssr: false });
const Share2 = dynamic(() => import('lucide-react').then(m => m.Share2), { ssr: false });
const Star = dynamic(() => import('lucide-react').then(m => m.Star), { ssr: false });
const Zap = dynamic(() => import('lucide-react').then(m => m.Zap), { ssr: false });
const Target = dynamic(() => import('lucide-react').then(m => m.Target), { ssr: false });
const TrendingUp = dynamic(() => import('lucide-react').then(m => m.TrendingUp), { ssr: false });

const ArtistSchema = z.object({
    name: z.string(),
    rank: z.string(),
    community: z.number(),
    impact: z.number(),
    conversion: z.number()
});

export const ArtistHubPanel = () => {
    const artist = ArtistSchema.parse({
        name: "Edwin Agudelo",
        rank: "Leyenda / S-Class",
        community: 85240,
        impact: 98.4,
        conversion: 12.8
    });

    return (
        <div className="space-y-6 font-montserrat">
            {/* Artist Profile S-Class Identity */}
            <BentoCard title="ARTIST IDENTITY" subtitle="S-Class Alpha Node">
                <div className="mt-8 flex flex-col md:flex-row gap-10 items-center">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-ear-gold via-ear-gold/30 to-transparent p-1 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                            <div className="w-full h-full rounded-[2.3rem] bg-black flex items-center justify-center overflow-hidden relative">
                                <User className="w-20 h-20 text-ear-gold opacity-20 filter blur-[1px]" />
                                <div className="absolute inset-0 bg-ear-gold/5 group-hover:bg-transparent transition-colors" />
                            </div>
                        </div>
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute -right-3 -bottom-3 bg-ear-gold text-black p-2.5 rounded-2xl shadow-2xl z-10"
                        >
                            <Star className="w-5 h-5 fill-current" />
                        </motion.div>
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <p className="text-ear-gold text-[10px] font-black uppercase tracking-[0.5em] mb-2 leading-none">{artist.rank}</p>
                        <h2 className="text-6xl font-black text-white italic tracking-tighter mb-6 leading-none">{artist.name}</h2>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <span className="bg-white/5 px-5 py-2 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">VIMUME Identity Matrix</span>
                            <span className="bg-ear-gold/10 px-5 py-2 rounded-xl border border-ear-gold/20 text-[9px] font-black uppercase tracking-widest text-ear-gold">Trinity Alpha Tier</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-ear-gold hover:text-black transition-all group shadow-xl">
                            <Share2 className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                        </button>
                        <button className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-ear-gold hover:text-black transition-all group shadow-xl">
                            <Target className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </BentoCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Signal Metrics & ASTRA Recommendation */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <BentoCard title="COMMUNITY" subtitle="Loyal Network Size">
                            <div className="mt-8">
                                <StatBox label="VERIFIED FANS" value={artist.community.toLocaleString()} color="text-white" />
                                <div className="mt-4">
                                    <SmallKPI icon={TrendingUp} label="MONTHLY GROWTH" value="+4.2%" trend="UP" color="text-emerald-500" />
                                </div>
                            </div>
                        </BentoCard>
                        <BentoCard title="IMPACT" subtitle="Viral Penetration Rate">
                            <div className="mt-8">
                                <StatBox label="ATTENTION SCORE" value={`${artist.impact}%`} color="text-ear-gold" />
                                <div className="mt-4">
                                    <SmallKPI icon={Zap} label="SIGNAL STATUS" value="STRONG" trend="UP" color="text-ear-gold" />
                                </div>
                            </div>
                        </BentoCard>
                        <BentoCard title="CONVERSION" subtitle="Commercial Efficiency">
                            <div className="mt-8">
                                <StatBox label="TICKET CONV" value={`${artist.conversion}%`} color="text-emerald-500" />
                                <div className="mt-4">
                                    <SmallKPI icon={Target} label="ARPU INDEX" value="1.2x" trend="UP" color="text-emerald-500" />
                                </div>
                            </div>
                        </BentoCard>
                    </div>

                    <BentoCard title="IA ASTRA RECOMMANDATIONS" subtitle="Tactical Neural Output">
                        <div className="mt-8 space-y-4">
                            <LogEntry
                                time="CRITICAL"
                                type="ALERT"
                                msg="Execute Trinity Showcase in Premium Venue. Inject VIMUME telemetry for lead capture."
                                color="text-ear-gold"
                            />
                            <LogEntry
                                time="ORGANIC"
                                type="CORE"
                                msg="Deploy 'Mentalidad de Guerra' series to S-Class community. Increase average ticket price."
                                color="text-emerald-500"
                            />
                        </div>
                    </BentoCard>
                </div>

                {/* Trinity Catalog Lateral */}
                <BentoCard title="TRINITY CATALOG" subtitle="Production Inventory">
                    <div className="mt-8 space-y-4">
                        {[
                            { name: 'Show Acústico N1', desc: 'Minimalismo VIP' },
                            { name: 'Full Evolution 360', desc: 'Producción Arena' },
                            { name: 'Ultra Lounge Private', desc: 'Exclusividad Curada' }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-ear-gold/30 hover:bg-white/[0.05] transition-all cursor-pointer group">
                                <p className="text-white font-black italic text-base mb-1 group-hover:text-ear-gold transition-colors">{item.name}</p>
                                <p className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-none">{item.desc}</p>
                            </div>
                        ))}
                        <button className="mt-4 w-full py-5 bg-ear-gold text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:scale-[1.03] transition-all">
                            Export S-Class Dossier
                        </button>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
};

export default ArtistHubPanel;
