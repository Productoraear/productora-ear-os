"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { BentoCard, StatBox, LogEntry, SmallKPI } from '@/modules/SClassScreens/components/SClassUI';

// S-Class Dynamic Icons
const Globe = dynamic(() => import('lucide-react').then(m => m.Globe), { ssr: false });
const Truck = dynamic(() => import('lucide-react').then(m => m.Truck), { ssr: false });
const Package = dynamic(() => import('lucide-react').then(m => m.Package), { ssr: false });
const Navigation = dynamic(() => import('lucide-react').then(m => m.Navigation), { ssr: false });

export const DispatchPanel = () => {
    return (
        <div className="space-y-6 font-montserrat">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Logistics Metrics */}
                <BentoCard title="LOGISTICS OVERVIEW" subtitle="Global Asset Routing">
                    <div className="mt-8 space-y-6">
                        <StatBox label="TOTAL SHIPMENTS" value="1.4k" color="text-white" />
                        <div className="grid grid-cols-2 gap-4">
                            <SmallKPI
                                icon={Globe}
                                label="INTL"
                                value="482"
                                trend="UP"
                                color="text-ear-gold"
                            />
                            <SmallKPI
                                icon={Truck}
                                label="LOCAL"
                                value="923"
                                trend="UP"
                                color="text-white"
                            />
                        </div>
                    </div>
                </BentoCard>

                {/* Active Routes */}
                <BentoCard title="ACTIVE ROUTES" subtitle="Real-time Deployment" className="lg:col-span-2">
                    <div className="mt-8 space-y-4">
                        {[
                            { origin: 'MAD', dest: 'TOL', status: 'IN_TRANSIT', eta: '14:20' },
                            { origin: 'BCN', dest: 'MAD', status: 'DEPARTED', eta: '18:45' },
                            { origin: 'VLC', dest: 'IBZ', status: 'PENDING', eta: '09:00' }
                        ].map((route, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-ear-gold/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <Navigation size={14} className="text-ear-gold animate-pulse" />
                                    <span className="text-xs font-black text-white italic">{route.origin} → {route.dest}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-ear-gold uppercase tracking-widest">{route.status}</p>
                                    <p className="text-[8px] text-white/40 uppercase font-bold">ETA: {route.eta}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>
            </div>

            {/* Dispatch Event Log */}
            <BentoCard title="DISPATCH TELEMETRY" subtitle="Forenisc Routing Logs">
                <div className="mt-8 space-y-2">
                    <LogEntry time="11:43" type="CORE" msg="Asset DISP-482 successfully rerouted to Madrid Hub." color="text-emerald-500" />
                    <LogEntry time="11:20" type="ALERT" msg="Congestion detected in Route BCN-MAD. Calculating alternative." color="text-ear-gold" />
                    <LogEntry time="10:55" type="INFO" msg="S Class Logistics nodes synchronized across 12 zones." color="text-white/40" />
                </div>
            </BentoCard>
        </div>
    );
};

export default DispatchPanel;
