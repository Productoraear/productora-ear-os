'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import publicCatalog from '../../../../scripts/vampire_public_catalog_zk.json';
import { useEventCart, CartItem } from '@/context/EventCartContext';

// Activos de Infraestructura Propia (Tier 0 - Margen >75%)
const TIER_ZERO_ARSENAL: CartItem[] = [
  {
    slug: 'bose-f1-array-pack',
    rawName: 'Sistema PA Bose F1 Model 812 + Subwoofers (2000W)',
    category: 'Sonido Profesional',
    itemType: 'HARDWARE_RIDER',
    estimatedPrice: 450,
    technicalWatts: 2000,
  },
  {
    slug: 'behringer-xr18-air-pack',
    rawName: 'Mesa Digital Behringer XR18 + Microfonía Shure Beta 87A',
    category: 'Manejo de Señal',
    itemType: 'HARDWARE_RIDER',
    estimatedPrice: 220,
    technicalWatts: 0,
  },
  {
    slug: 'edwin-agudelo-tenor-mariachi',
    rawName: 'Edwin Agudelo - Tenor & Mariachi Show Especial (Vocal Direct)',
    category: 'Actuación Principal',
    itemType: 'ARTIST_DIRECT',
    estimatedPrice: 750,
    technicalWatts: 0,
  }
];

export default function UnifiedMatchmakerPage() {
  const { cart, addToCart, removeFromCart, totalBudget, totalWatts, hardwareMargin } = useEventCart();
  const router = useRouter();

  const [atmosphere, setAtmosphere] = useState('elegante');
  const [guests, setGuests] = useState<number>(150);
  const [priceLockActive, setPriceLockActive] = useState(false);

  // Autocalculadora de potencia acústica según aforo (12W por persona en exterior/gala)
  const requiredWatts = useMemo(() => guests * 12, [guests]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white font-mono pb-36">
      <div className="mb-6 border-b border-slate-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">MOTOR UNIFICADO DE MATCHMAKING & BESPOKE</h1>
          <p className="text-xs text-slate-400">Diseño de Atmósfera + Inyección Automática de Arsenal Tier 0</p>
        </div>
        <button
          onClick={() => setPriceLockActive(!priceLockActive)}
          className={`px-4 py-2 rounded text-xs font-bold border transition ${
            priceLockActive
              ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-500'
          }`}
        >
          {priceLockActive ? '🔒 Tarifa Congelada (SHA-256 72h Active)' : '🔓 Activar Price-Lock 72h'}
        </button>
      </div>

      {/* DIÁLOGO TÁCTICO DE ATMÓSFERA Y AFORO */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-xl">
        <div>
          <label className="text-xs text-amber-400 font-bold block mb-2">1. SELECCIONA LA ATMÓSFERA DEL EVENTO</label>
          <div className="grid grid-cols-2 gap-2">
            {['Elegante / Gala', 'Fiesta Rompedora', 'Institucional / B2G', 'Íntimo / Acústico'].map((atm) => (
              <button
                key={atm}
                onClick={() => setAtmosphere(atm.toLowerCase())}
                className={`p-2 text-xs rounded border text-left font-bold transition ${
                  atmosphere === atm.toLowerCase()
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {atm}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-amber-400 font-bold">2. AFORO ESTIMADO (INVITADOS)</span>
            <span className="text-white font-bold">{guests} PAX → Requeridos ~{requiredWatts}W PA</span>
          </div>
          <input
            type="range"
            min="30"
            max="1000"
            step="10"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full accent-amber-500 bg-slate-950 h-2 rounded cursor-pointer mt-4"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-2">
            <span>30 PAX (Acústico)</span>
            <span>500 PAX (Concierto)</span>
            <span>1000 PAX (Festival)</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: INYECTADOR DE ARSENAL PROPIO (TIER 0) */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>⚡ INFRAESTRUCTURA TÉCNICA & ARTISTAS RECOMENDADOS (TIER 0)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIER_ZERO_ARSENAL.map((item) => {
            const isInCart = cart.some((i) => i.slug === item.slug);
            return (
              <div key={item.slug} className="bg-slate-900 border border-amber-500/30 p-4 rounded-lg flex flex-col justify-between shadow-lg">
                <div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-2">{item.rawName}</h3>
                  {item.technicalWatts ? (
                    <p className="text-xs text-cyan-400 mt-1">Potencia: {item.technicalWatts}W RMS</p>
                  ) : null}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-bold text-white">{item.estimatedPrice} €</span>
                  <button
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(item.slug);
                      } else {
                        addToCart(item);
                        router.push('/cotizador');
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                      isInCart ? 'bg-red-900/50 text-red-300 border border-red-500' : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {isInCart ? 'Quitar' : '+ Inyectar al Paquete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: BARAJA DE PROVEEDORES INDEXADOS B2B */}
      <div>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          🌐 RED DE PROVEEDORES COMPLEMENTARIOS INDEXADOS ({(publicCatalog as any[]).length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(publicCatalog as any[]).slice(0, 18).map((vendor: any) => {
            const isInCart = cart.some((i) => i.slug === vendor.slug);
            return (
              <div key={vendor.slug} className="bg-slate-900/60 border border-slate-800 p-4 rounded-lg flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <h3 className="font-bold text-sm text-slate-200 truncate">{vendor.rawName}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">{vendor.description || 'Proveedor verificado en el ecosistema.'}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                  <Link href={`/proveedores/${vendor.slug}`} className="text-xs text-amber-400 underline">
                    Ver Ficha →
                  </Link>
                  <button
                    onClick={() => {
                      if (isInCart) {
                        removeFromCart(vendor.slug);
                      } else {
                        addToCart({
                          slug: vendor.slug,
                          rawName: vendor.rawName,
                          category: 'Servicio B2B',
                          itemType: 'VENDOR_SERVICE',
                          estimatedPrice: 500,
                          technicalWatts: 0,
                        });
                        router.push('/cotizador');
                      }
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                      isInCart ? 'bg-red-900/50 text-red-300' : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                  >
                    {isInCart ? 'Quitar' : '+ Añadir y Cotizar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DOCK BAR FLOTANTE DEL PAQUETE HÍBRIDO */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl bg-slate-950 border border-amber-500/50 p-4 rounded-xl shadow-2xl flex items-center justify-between z-50 backdrop-blur-lg bg-slate-950/95">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-400">Total Cotizado:</span>
              <p className="text-lg font-bold text-amber-400">{totalBudget.toLocaleString()} €</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Suministro Acústico:</span>
              <p className="text-lg font-bold text-cyan-400">{totalWatts.toLocaleString()}W RMS</p>
            </div>
            <div className="hidden md:block">
              <span className="text-xs text-slate-400">Margen Directo Estimado:</span>
              <p className="text-sm font-bold text-emerald-400">~{hardwareMargin.toLocaleString()} €</p>
            </div>
          </div>
          <Link
            href="/checkout/presupuesto"
            className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg hover:bg-amber-400 transition"
          >
            Bloquear Reserva & Pagar (€{totalBudget}) →
          </Link>
        </div>
      )}
    </div>
  );
}
