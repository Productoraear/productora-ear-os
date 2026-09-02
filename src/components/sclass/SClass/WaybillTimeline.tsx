"use client";

import React from "react";
import { WaybillData } from "@/app/actions/commandCenterActions";
import { 
  Truck, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  ExternalLink,
  Milestone
} from "lucide-react";
import { motion } from "framer-motion";

interface WaybillTimelineProps {
  waybills: WaybillData[];
  loading: boolean;
  onRefresh: () => void;
}

export default function WaybillTimeline({ waybills, loading, onRefresh }: WaybillTimelineProps) {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "QUEUED":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
          glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]",
          label: "En Cola",
          step: 0
        };
      case "DISPATCHED":
        return {
          bg: "bg-orange-500/10 border-orange-500/30 text-orange-400",
          glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
          label: "Despachado",
          step: 1
        };
      case "IN_TRANSIT":
        return {
          bg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
          label: "En Tránsito",
          step: 2
        };
      case "ARRIVED":
      case "COMPLETED":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
          label: "Completado",
          step: 3
        };
      case "CANCELLED":
        return {
          bg: "bg-red-500/10 border-red-500/30 text-red-400",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
          label: "Cancelado",
          step: -1
        };
      default:
        return {
          bg: "bg-neutral-500/10 border-neutral-500/30 text-neutral-400",
          glow: "",
          label: status,
          step: 0
        };
    }
  };

  const formatDistance = (meters: number | null) => {
    if (!meters) return "Calculando...";
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const steps = ["En Cola", "Despachado", "En Tránsito", "Entregado"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-[#d4a855]">
            Monitoreo Logístico Activo
          </h3>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
            Hojas de ruta de flotas y transporte en tiempo real
          </p>
        </div>
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white hover:bg-[#d4a855] hover:text-black transition-all disabled:opacity-50"
        >
          {loading ? "Sincronizando..." : "Sincronizar"}
        </button>
      </div>

      {loading && waybills.length === 0 ? (
        <div className="p-16 text-center border border-white/5 rounded-[2.5rem] bg-black/40 space-y-4">
          <div className="w-8 h-8 border-2 border-[#d4a855] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
            Accediendo a la red logística S-Class...
          </p>
        </div>
      ) : waybills.length === 0 ? (
        <div className="p-16 text-center border border-white/5 rounded-[2.5rem] bg-black/40 space-y-4">
          <Truck className="w-12 h-12 text-white/10 mx-auto" />
          <div>
            <p className="text-xs font-black text-white uppercase tracking-tight">Cero envíos activos</p>
            <p className="text-[9px] text-white/30 uppercase font-black mt-1">
              No se han registrado dispatches de flotas para este perfil.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {waybills.map((w) => {
            const statusInfo = getStatusStyle(w.status);
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/[0.01] border border-white/5 rounded-[2rem] hover:border-[#d4a855]/20 transition-all group relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-[#d4a855]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Header details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-[#d4a855]/30 transition-colors">
                      <Truck className="text-[#d4a855] group-hover:scale-110 transition-transform" size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-white">
                        {w.referenceCode}
                      </h4>
                      <p className="text-[9px] text-white/30 uppercase font-black mt-0.5">
                        Creado: {new Date(w.createdAt).toLocaleString("es-ES")}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-black border px-3 py-1.5 rounded-lg uppercase tracking-wider ${statusInfo.bg} ${statusInfo.glow}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Logistics Route Map Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-black/40 border border-white/5 rounded-2xl relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                      <MapPin size={12} className="text-[#d4a855]" /> Origen
                    </div>
                    <p className="text-xs font-bold text-white pl-4 truncate">{w.originLabel}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                      <MapPin size={12} className="text-[#d4a855]" /> Destino
                    </div>
                    <p className="text-xs font-bold text-white pl-4 truncate">{w.destinationLabel}</p>
                  </div>
                </div>

                {/* Performer and Trip Analytics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[8px] text-white/35 font-black uppercase tracking-widest mb-1">
                      Artista Asignado
                    </span>
                    <span className="text-[10px] font-black uppercase text-[#d4a855] truncate block">
                      {w.artistName || "No Asignado"}
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[8px] text-white/35 font-black uppercase tracking-widest mb-1">
                      Distancia Física
                    </span>
                    <span className="text-[10px] font-black uppercase text-white flex items-center gap-1">
                      <Milestone size={10} className="text-[#d4a855]" /> {formatDistance(w.distanceMeters)}
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[8px] text-white/35 font-black uppercase tracking-widest mb-1">
                      Proveedor Asociado
                    </span>
                    <span className="text-[10px] font-black uppercase text-white/80 truncate block">
                      {w.providerName || "N/A"}
                    </span>
                  </div>

                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3">
                    <span className="block text-[8px] text-white/35 font-black uppercase tracking-widest mb-1">
                      Cliente / Comprador
                    </span>
                    <span className="text-[10px] font-black uppercase text-white/80 truncate block">
                      {w.clientName || "Invitado Webhook"}
                    </span>
                  </div>
                </div>

                {/* Progress Timeline Stepper */}
                {statusInfo.step >= 0 && (
                  <div className="relative z-10 pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center relative">
                      {/* Connection Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                      <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-[#d4a855] -translate-y-1/2 z-0 transition-all duration-500" 
                        style={{ width: `${(statusInfo.step / (steps.length - 1)) * 100}%` }}
                      />

                      {steps.map((stepLabel, idx) => {
                        const isCompleted = statusInfo.step >= idx;
                        const isActive = statusInfo.step === idx;
                        return (
                          <div key={idx} className="flex flex-col items-center relative z-10">
                            <div 
                              className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all duration-300 ${
                                isCompleted 
                                  ? "bg-[#d4a855] border-[#d4a855] text-black shadow-[0_0_15px_rgba(212,168,85,0.4)]" 
                                  : "bg-black border-white/10 text-white/40"
                              } ${isActive ? "scale-110 ring-4 ring-[#d4a855]/20" : ""}`}
                            >
                              {isCompleted ? <CheckCircle2 size={12} /> : idx + 1}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest mt-2 ${isCompleted ? "text-white" : "text-white/30"}`}>
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {w.notes && (
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-2 relative z-10">
                    <AlertCircle size={12} className="text-[#d4a855] mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-white/50 font-bold italic leading-relaxed">{w.notes}</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
