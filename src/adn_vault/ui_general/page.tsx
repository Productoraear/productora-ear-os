'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Search, 
  Building2, 
  MapPin, 
  Star, 
  Phone, 
  ArrowRight,
  Loader2,
  DollarSign,
  Crown
} from 'lucide-react';
import Link from 'next/link';

function ReclamarPerfilContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Búsqueda manual si no hay token directo
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const verifyUrl = `/api/profiles/verify-claim?id=${encodeURIComponent(id)}${token ? `&token=${encodeURIComponent(token)}` : ''}`;
    
    fetch(verifyUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.vendor) {
          setVendorData(data.vendor);
        } else {
          setError(data.error || 'No se pudo verificar la credencial de este espacio.');
        }
      })
      .catch(() => setError('Error de conexión con la Red Soberana de Productora EAR'))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(searchQuery)}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.providers || []);
      }
    } catch (err) {
      console.error('Error buscando perfiles:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStripeActivation = async () => {
    if (!vendorData) return;
    setIsCheckoutLoading(true);

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 49,
          concept: `Activación Ficha Destacada S-Class: ${vendorData.name} (49 €/mes)`,
          metadata: {
            type: 'VENDOR_SUBSCRIPTION',
            vendor_id: vendorData.id,
            vendor_slug: vendorData.slug,
            vendor_name: vendorData.name,
            is_b2b_claim: 'true'
          }
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('No se pudo generar la sesión de pago: ' + (data.error || 'Error desconocido'));
      }
    } catch (e: any) {
      alert('Error conectando a Stripe: ' + e.message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#ecb613] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-zinc-400">Verificando Credenciales Criptográficas de la Red...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white pt-28 pb-20 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* ENCABEZADO S-CLASS */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck size={14} /> AUTENTICACIÓN SOBERANA B2B // TEMPORADA 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight font-syne text-white">
            Reclamación de <span className="text-[#ecb613]">Perfil Homologado</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-light">
            Toma el control oficial de tu ficha en el mayor directorio de eventos sin comisiones abusivas ni fuga de tráfico.
          </p>
        </div>

        {/* SI TENEMOS PROVEEDOR VERIFICADO VÍA ID/TOKEN */}
        {vendorData ? (
          <div className="bg-[#0b0b10] border border-[#ecb613]/40 rounded-[2.5rem] p-6 sm:p-10 space-y-8 shadow-[0_0_60px_rgba(236,182,19,0.12)]">
            
            {/* CABECERA DE LA FICHA */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <span className="text-[10px] text-[#ecb613] uppercase font-mono font-bold tracking-wider">
                  Ficha Homologada • {vendorData.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                  {vendorData.name}
                </h2>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <MapPin size={12} className="text-[#ecb613]" /> {vendorData.city} ({vendorData.province}) • Tel: {vendorData.phone}
                </p>
              </div>

              <div className="text-left md:text-right bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
                <div className="text-2xl font-black text-emerald-400 font-mono flex items-center gap-1 md:justify-end">
                  <Star size={18} className="fill-emerald-400" /> {vendorData.rating} ★
                </div>
                <p className="text-[10px] font-mono text-slate-400">
                  {vendorData.reviewCount || 24} reseñas auditadas
                </p>
              </div>
            </div>

            {/* BENEFICIOS DE ACTIVACIÓN S-CLASS */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold text-[#ecb613] uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles size={14} /> VENTAJAS AL ACTIVAR LA CONSOLA OFICIAL
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Recepción de Solicitudes Directas (0% Comisión de Intermediación)</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Botón de Reserva Directa con Garantía Stripe</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Canal Directo a tu WhatsApp Corporativo</span>
                </div>
                <div className="flex items-center gap-2.5 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                  <span>Posicionamiento GEO Prioritario en tu Provincia</span>
                </div>
              </div>
            </div>

            {/* BOTÓN DE ACTIVACIÓN CON PASARELA STRIPE */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <button
                onClick={handleStripeActivation}
                disabled={isCheckoutLoading}
                className="w-full py-4 bg-[#ecb613] hover:bg-[#d4a210] text-black font-mono font-black text-xs uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 cursor-pointer active:scale-[0.99]"
              >
                {isCheckoutLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Conectando Pasarela Stripe...
                  </>
                ) : (
                  <>
                    <Lock size={15} /> Activar Ficha Destacada B2B (49 € / mes)
                  </>
                )}
              </button>

              <p className="text-center text-[10px] font-mono text-slate-400">
                Cancelación en 1-clic sin permanencia • Soporte técnico directo 24/7 vía Centralita
              </p>
            </div>

          </div>
        ) : (
          /* BUSCADOR MANUAL SI SE ENTRA SIN TOKEN */
          <div className="bg-[#0b0b10] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 space-y-8 text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center mx-auto text-[#ecb613]">
              <Building2 size={28} />
            </div>
            
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
                Localiza tu Espacio o Empresa
              </h3>
              <p className="text-xs text-slate-400 font-light">
                Introduce el nombre comercial de tu finca, catering, orquesta o servicio para verificar tu ficha en el catálogo de 24.869 registros.
              </p>
            </div>

            <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ej. Finca Las Tenadas, Zalacain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-24 py-3.5 text-xs font-mono text-white focus:outline-none focus:border-[#ecb613]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#ecb613] text-black font-mono font-bold text-[10px] uppercase rounded-xl"
              >
                {isSearching ? '...' : 'Buscar'}
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-4">
                {searchResults.map((p) => (
                  <div key={p.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-syne">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{p.location?.city || 'España'} • {p.category}</p>
                    </div>
                    <Link
                      href={`/reclamar-perfil?id=${p.slug || p.id}&token=claim_${p.slug || p.id}_10x`}
                      className="px-3 py-1.5 bg-[#ecb613] text-black font-mono text-[10px] font-black uppercase rounded-xl hover:bg-[#d4a210]"
                    >
                      Reclamar →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function ReclamarPerfilPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white/40 font-mono text-xs">Cargando Consola de Reclamación...</div>}>
      <ReclamarPerfilContent />
    </Suspense>
  );
}
