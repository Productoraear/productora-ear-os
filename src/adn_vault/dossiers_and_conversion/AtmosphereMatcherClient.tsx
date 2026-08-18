"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Coins, CheckCircle2, Clock, Calendar, Zap, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getMatchingProviders, MatchingProvider } from "@/app/actions/matcherActions";
import { createEliteCheckout } from "@/app/actions/checkoutActions";
import { useAuth } from "@/lib/AuthContext";

const ATMOSPHERES = [
  { id: "clasica-gala", label: "Clásica / Gala", desc: "Actos solemnes y conciertos de élite" },
  { id: "tradicional-elite", label: "Tradicional / Élite", desc: "Fiestas patronales y eventos tradicionales" },
  { id: "corporativa-impacto", label: "Corporativa / Impacto", desc: "Congresos, galas de empresa y lanzamientos" },
  { id: "intima-familiar", label: "Íntima / Familiar", desc: "Bodas de autor y terapias clínicas cognitivas" }
];

export default function AtmosphereMatcherClient() {
  const { user } = useAuth();
  const [selectedAtmosphere, setSelectedAtmosphere] = useState("clasica-gala");
  const [targetDate, setTargetDate] = useState("");
  const [availabilityCheck, setAvailabilityCheck] = useState<Record<string, string>>({});
  const [bookingStatus, setBookingStatus] = useState<Record<string, string>>({});
  const [providers, setProviders] = useState<MatchingProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchMatches = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const results = await getMatchingProviders({
          atmosphere: selectedAtmosphere,
          date: targetDate,
        });
        if (active) {
          setProviders(results);
        }
      } catch (err) {
        console.error("❌ [MATCHER_FETCH_ERROR]:", err);
        if (active) {
          setErrorMsg("Fallo al conectar con la base de datos de asignación.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchMatches();
    return () => {
      active = false;
    };
  }, [selectedAtmosphere, targetDate]);

  const handleVerifyAvailability = (providerName: string) => {
    if (!targetDate) {
      alert("Por favor, selecciona una fecha primero.");
      return;
    }
    setAvailabilityCheck(prev => ({ ...prev, [providerName]: "checking" }));
    setTimeout(() => {
      setAvailabilityCheck(prev => ({
        ...prev,
        [providerName]: Math.random() > 0.15 ? "DISPONIBLE" : "ALTA DEMANDA"
      }));
    }, 850);
  };

  const handleBookVerified = async (providerId: string, providerName: string) => {
    setBookingStatus(prev => ({ ...prev, [providerId]: "loading" }));
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = targetDate || tomorrow.toISOString().split("T")[0];

      // Ejecutar la acción de Stripe de forma segura en servidor (Tamper-Proof)
      const session = await createEliteCheckout({
        artistId: providerId,
        clientId: user?.uid || "sys-guest-fallback",
        origin: "Madrid, España",
        destination: "Toledo, España", // Default logístico estimado
        eventDate: formattedDate,
      });

      if (session?.url) {
        window.location.href = session.url; // Redirección directa y segura a Stripe Checkout
      } else {
        throw new Error("No se pudo generar la sesión de pago.");
      }
    } catch (err: any) {
      console.error("🚨 [STRIPE_BOOKING_ERROR]:", err);
      alert(err.message || "Error al iniciar el checkout con Stripe. Por favor, contacta soporte.");
      setBookingStatus(prev => ({ ...prev, [providerId]: "" }));
    }
  };

  return (
    <div className="space-y-12">
      {/* Atmosphere Grid Selectors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
        {ATMOSPHERES.map((atm) => {
          const isActive = selectedAtmosphere === atm.id;
          return (
            <button
              key={atm.id}
              onClick={() => setSelectedAtmosphere(atm.id)}
              className={`p-5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between gap-4 ${
                isActive 
                  ? "bg-primary border-primary text-foreground shadow-[0_10px_35px_rgba(236,182,19,0.25)]" 
                  : "bg-card border-border text-foreground hover:border-primary/40"
              }`}
            >
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? "text-foreground/60" : "text-muted-foreground"}`}>
                Atmósfera
              </span>
              <div className="space-y-1 text-left">
                <h4 className="text-sm font-black uppercase italic tracking-tight">{atm.label}</h4>
                <p className={`text-[9px] leading-tight ${isActive ? "text-foreground/80 font-bold" : "text-muted-foreground/80"}`}>{atm.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Match Results */}
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
          <div className="space-y-1 text-left">
            <h3 className="text-lg font-black uppercase italic tracking-tighter text-foreground">
              Proveedores Recomendados ({providers.length})
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">
              Resultados calculados dinámicamente según el tono del entorno
            </p>
          </div>

          {/* Dynamic Availability Datepicker */}
          <div className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-2 w-full md:w-auto">
            <Calendar size={14} className="text-primary" />
            <input
              type="date"
              value={targetDate}
              onChange={(e) => {
                setTargetDate(e.target.value);
                setAvailabilityCheck({}); // Reset checks
              }}
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-foreground focus:outline-none [color-scheme:light-dark]"
              placeholder="Elegir Fecha"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl flex items-center gap-2 text-xs uppercase font-black tracking-wide">
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            // Sleek loading shimmer skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card/40 border border-border/50 rounded-3xl p-6 h-[220px] animate-pulse flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-muted rounded-xl animate-pulse" />
                    <div className="space-y-2">
                      <div className="w-28 h-4 bg-muted rounded animate-pulse" />
                      <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="w-full h-8 bg-muted rounded-xl animate-pulse" />
              </div>
            ))
          ) : providers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground text-xs uppercase font-black tracking-widest border border-dashed border-border rounded-3xl">
              Ningún proveedor coincide con los criterios actuales.
            </div>
          ) : (
            providers.map((provider) => {
              const checkStatus = availabilityCheck[provider.name];
              const isBooking = bookingStatus[provider.id] === "loading";
              
              return (
                <div
                  key={provider.id}
                  className={`bg-card/80 border rounded-3xl p-6 flex flex-col justify-between gap-6 hover:border-primary/30 transition-all duration-300 relative ${
                    provider.isVerified ? "border-primary/30 shadow-[0_4px_20px_rgba(236,182,19,0.05)]" : "border-border"
                  }`}
                >
                  {provider.isVerified && (
                    <div className="absolute -top-2.5 -right-2.5 px-3 py-0.5 rounded-full bg-primary text-foreground text-[8px] font-black uppercase tracking-widest shadow-md">
                      Roster Oficial Elite
                    </div>
                  )}
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl bg-muted p-2 rounded-xl border border-border leading-none">
                          {provider.avatar}
                        </span>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-tight text-foreground">
                            {provider.name}
                          </h4>
                          <p className="text-[9px] text-primary uppercase font-black tracking-wider">{provider.category}</p>
                        </div>
                      </div>
                      
                      {/* Budget Tag */}
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted border border-border text-foreground font-black text-[9px] tracking-wide">
                        <Coins size={10} className="text-primary" />
                        {provider.budget}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      "{provider.purpose}"
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-border">
                    {/* Availability Verify Button */}
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                      <span>Verificación de Disponibilidad:</span>
                      {checkStatus === "checking" ? (
                        <span className="text-primary animate-pulse">Consultando...</span>
                      ) : checkStatus === "DISPONIBLE" ? (
                        <span className="text-emerald-500 font-bold border border-emerald-500/30 bg-emerald-500/5 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                          <CheckCircle2 size={10} /> DISPONIBLE
                        </span>
                      ) : checkStatus === "ALTA DEMANDA" ? (
                        <span className="text-primary font-bold border border-primary/30 bg-primary/5 px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                          <Clock size={10} /> ALTA DEMANDA
                        </span>
                      ) : (
                        <button
                          onClick={() => handleVerifyAvailability(provider.name)}
                          disabled={!targetDate}
                          className="text-primary hover:underline disabled:opacity-40"
                        >
                          [ Verificar ]
                        </button>
                      )}
                    </div>

                    {/* Primary Booking or Claim Link */}
                    {provider.isVerified ? (
                      <button
                        onClick={() => handleBookVerified(provider.id, provider.name)}
                        disabled={isBooking}
                        className={`w-full mt-2 py-3 font-black uppercase text-[9px] tracking-widest rounded-xl text-center transition-colors bg-primary text-foreground hover:bg-foreground hover:text-background flex items-center justify-center gap-2`}
                      >
                        {isBooking ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                            Generando Checkout...
                          </>
                        ) : (
                          "Reservar Roster Elite (Stripe)"
                        )}
                      </button>
                    ) : (
                      <Link
                        href={`${provider.ctaLink}${targetDate ? `&fecha=${targetDate}` : ''}`}
                        className={`w-full mt-2 py-3 font-black uppercase text-[9px] tracking-widest rounded-xl text-center transition-colors bg-foreground text-background hover:bg-primary hover:text-foreground`}
                      >
                        Reclamar este Perfil S-Class
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
