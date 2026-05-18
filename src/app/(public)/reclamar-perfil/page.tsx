"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { 
  Search, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw,
  LogOut,
  CreditCard,
  Calendar,
  Truck
} from "lucide-react";
import Link from "next/link";

interface ProviderProfile {
  id: string;
  name: string;
  category: string;
  location: string;
  roiGuaranteeScore: number;
  slug: string;
}

export default function ClaimProfilePage() {
  const { user, signInWithGoogle, logout, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<ProviderProfile[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProviderProfile | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  // Debounce search query
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setProfiles([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (err) {
        console.error("Error searching profiles:", err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleClaim = async () => {
    if (!user || !selectedProfile) return;

    setClaiming(true);
    setClaimStatus(null);

    try {
      const response = await fetch("/api/profiles/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: selectedProfile.id,
          userId: user.uid
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setClaimStatus({
          success: true,
          message: `¡Enhorabuena! Has reclamado el perfil "${selectedProfile.name}" de forma inmutable.`
        });
      } else {
        setClaimStatus({
          error: result.error || "No se ha podido procesar la reclamación de forma segura."
        });
      }
    } catch (err: any) {
      setClaimStatus({
        error: "Fallo crítico en la conexión con el servidor S-Class."
      });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 py-16 px-4 md:px-8 relative overflow-hidden flex flex-col justify-center items-center">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto z-10">
        
        {/* Header Block */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Portal de Soberanía Comercial
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Reclama tu Perfil Profesional
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Asocia tu identidad digital con el roster de Productora EAR para configurar calendarios, recibir depósitos automáticos vía Stripe y emitir hojas de ruta inteligentes.
          </p>
        </div>

        {/* Loading State */}
        {authLoading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl shadow-xl">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Estableciendo conexión segura...</p>
          </div>
        ) : !user ? (
          
          /* AUTH REGISTRATION CARD */
          <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-3xl mx-auto">
            {/* Features list */}
            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 flex flex-col justify-between hover:border-primary/30 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" /> Ventajas del Roster S-Class
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Pasarela Stripe Integrada</h4>
                      <p className="text-xs text-muted-foreground">Recibe reservas y pagos directos con un 0% de intermediación innecesaria.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Hot Availability Roster</h4>
                      <p className="text-xs text-muted-foreground">Sincroniza tus fechas de actuación en tiempo real para clientes corporativos y B2G.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Logística Autónoma (Fleet OS)</h4>
                      <p className="text-xs text-muted-foreground">Emisión automatizada de hojas de ruta oficiales con tracking geográfico.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mt-8 border-t border-border/50 pt-4 text-center">
                <span className="text-xs text-muted-foreground">Más de 5,500 profesionales activos ya registrados.</span>
              </div>
            </div>

            {/* Login Box */}
            <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Paso 1: Tu Identidad</h3>
              <p className="text-sm text-muted-foreground mb-8">
                Inicia sesión de forma segura para validar tus credenciales y vincular tu perfil.
              </p>
              
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-bold py-3.5 px-6 rounded-xl hover:opacity-90 transition-all duration-200 transform active:scale-95 shadow-md text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </button>
            </div>
          </div>
        ) : (
          
          /* LOGGED IN SEARCH & CLAIM FLOW */
          <div className="max-w-2xl mx-auto bg-card/45 backdrop-blur-md border border-border/50 rounded-3xl p-8 shadow-2xl relative">
            
            {/* Logged in User Bar */}
            <div className="flex justify-between items-center pb-6 border-b border-border/40 mb-8">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || "User"} className="w-10 h-10 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Conectado como</p>
                  <p className="text-sm font-bold truncate max-w-[200px]">{user.displayName || user.email}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card hover:bg-red-500/10 hover:text-red-500 border border-border/80 transition-all text-xs font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" /> Salir
              </button>
            </div>

            {/* Step Content */}
            {!claimStatus?.success ? (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" /> Paso 2: Busca tu perfil
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Escribe el nombre de tu grupo, banda, finca o servicio tal como figura en Fander o Bodas.net.
                  </p>
                </div>

                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Ej. Roberto Vicentti, Hotel Orduña, Colibrí..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-border/80 focus:border-primary/70 rounded-xl py-3.5 pl-11 pr-4 text-sm outline-none transition-all"
                  />
                  <Search className="absolute left-4 top-3.5 text-muted-foreground w-5 h-5" />
                  {searching && (
                    <RefreshCw className="absolute right-4 top-3.5 text-primary w-5 h-5 animate-spin" />
                  )}
                </div>

                {/* Profiles Results List */}
                {profiles.length > 0 && !selectedProfile && (
                  <div className="space-y-2 max-h-60 overflow-y-auto mb-6 bg-background/50 rounded-xl p-3 border border-border/40 scrollbar-thin">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProfile(p)}
                        className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all text-left"
                      >
                        <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{p.category} • {p.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.roiGuaranteeScore > 0 && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 text-xs font-medium">
                              ★ {p.roiGuaranteeScore.toFixed(1)}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.trim().length >= 2 && profiles.length === 0 && !searching && !selectedProfile && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No hemos encontrado perfiles unclaimed con ese nombre.
                  </div>
                )}

                {/* Selected Profile Detail Panel */}
                {selectedProfile && (
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6 text-left animate-fadeIn">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                          {selectedProfile.category}
                        </span>
                        <h4 className="text-2xl font-bold mt-2">{selectedProfile.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4 text-primary" /> {selectedProfile.location}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProfile(null);
                          setClaimStatus(null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                      >
                        Cambiar
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-border/30 py-4 mb-6">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">ROI Guarantee Score</p>
                        <p className="text-lg font-bold text-amber-500">★ {selectedProfile.roiGuaranteeScore > 0 ? selectedProfile.roiGuaranteeScore.toFixed(1) : "Auditado"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Disponibilidad</p>
                        <p className="text-lg font-bold text-green-500">Inmediata</p>
                      </div>
                    </div>

                    {/* Claim Button */}
                    <button
                      onClick={handleClaim}
                      disabled={claiming}
                      className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg text-sm"
                    >
                      {claiming ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Procesando Firma...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Reclamar Perfil S-Class
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {claimStatus?.error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm p-4 rounded-xl text-center">
                    {claimStatus.error}
                  </div>
                )}
              </>
            ) : (
              
              /* SUCCESS STATE PANEL */
              <div className="text-center py-8 animate-fadeIn flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-extrabold mb-2 text-green-500">¡Vínculo Completado!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                  {claimStatus.message} Has sido ascendido de forma segura a <strong className="text-foreground">PROVIDER</strong> dentro del ecosistema de Productora EAR.
                </p>

                <div className="space-y-3 w-full">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-md text-sm"
                  >
                    Ir al Panel de Proveedor <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 bg-card hover:bg-card/80 border border-border font-semibold py-3.5 rounded-xl active:scale-95 transition-all text-sm"
                  >
                    Volver a Inicio
                  </Link>
                </div>
              </div>
            )}
            
          </div>
        )}

      </div>
    </main>
  );
}
