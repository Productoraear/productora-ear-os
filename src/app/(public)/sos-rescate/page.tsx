"use client";

import React, { useState } from "react";
import { AlertOctagon, ShieldCheck, Truck, Clock, Zap } from "lucide-react";
import SosEquipmentRescueModal from "@/components/logistics/SosEquipmentRescueModal";
import { RESCUE_FLEET } from "@/lib/logistics/rescueFleetEngine";

export default function SosRescuePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-white pt-16">
      {/* ── HERO ── */}
      <section className="relative border-b border-white/10 py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF2B44]/10 border border-[#FF2B44]/30 rounded-full text-[#FF2B44] text-[11px] font-mono uppercase tracking-[0.3em]">
            <Zap size={14} />
            Respuesta inmediata en evento
          </div>

          <div className="max-w-4xl space-y-6">
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[0.95]">
              Tu evento no se <span className="text-[#FF2B44]">para</span>. EAR
              SOS Rescue llega antes de que se note.
            </h1>
            <p className="font-body text-lg sm:text-xl text-white/60 leading-relaxed max-w-3xl">
              Caída de una etapa, refuerzo de sonido o crecimiento inesperado de
              PAX: calcula el despacho de la flota táctica y recibe una
              cotización con cubicaje, ETA y coste logístico desde Méntrida.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF2B44] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_0_30px_rgba(255,43,68,0.45)] transition-all"
              >
                <AlertOctagon size={18} />
                Activar rescate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLOTA ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FF2B44]">
              Flota táctica EAR SOS
            </p>
            <h2 className="font-syne text-2xl sm:text-3xl font-black uppercase tracking-tight">
              Cubicaje calibrado para cada incidente
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {RESCUE_FLEET.map((vehicle) => (
              <article
                key={vehicle.id}
                className="bg-[#050507] border border-white/10 rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Truck size={24} className="text-[#FF2B44]" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    {vehicle.fleetClass}
                  </span>
                </div>
                <h3 className="font-syne text-xl font-black uppercase tracking-tight">
                  {vehicle.name}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                      Cubicaje
                    </p>
                    <p className="font-mono text-lg font-bold">
                      {vehicle.capacityM3} m³
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                      Carga útil
                    </p>
                    <p className="font-mono text-lg font-bold">
                      {vehicle.payloadKg} kg
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── GARANTÍAS ── */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-[#050507]/50 border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Clock size={22} className="text-[#FF2B44]" />
            <h3 className="font-syne text-lg font-black uppercase tracking-tight">
              ETA en minutos
            </h3>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              Cálculo haversine de distancia ortodrómica con velocidad media de
              75 km/h.
            </p>
          </div>
          <div className="space-y-3">
            <ShieldCheck size={22} className="text-[#FF2B44]" />
            <h3 className="font-syne text-lg font-black uppercase tracking-tight">
              Coste soberano
            </h3>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              Logística desde Méntrida a partir del km 50 con tarifa por
              vehículo y movilización base.
            </p>
          </div>
          <div className="space-y-3">
            <Truck size={22} className="text-[#FF2B44]" />
            <h3 className="font-syne text-lg font-black uppercase tracking-tight">
              Equipo embarcado
            </h3>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              Bose F1 812, S1 Pro, Shure Beta 87A y line array según la clase de
              flota seleccionada.
            </p>
          </div>
        </div>
      </section>

      <SosEquipmentRescueModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </main>
  );
}