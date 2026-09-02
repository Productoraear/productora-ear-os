"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, Loader2 } from "lucide-react";

const PricingSClass = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(null);
    }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen p-8 font-mono">
      <header className="text-center mb-20">
        <h1 className="text-5xl font-bold tracking-tighter mb-4 uppercase">Inversion en <span className="text-[#d4af37]">Autoridad</span></h1>
        <p className="text-gray-500">Selecciona tu nivel de despliegue en el ecosistema EAR OS.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <PriceCard 
          id="price_standard"
          title="Artist Pro"
          price="49€"
          features={["Acceso a Astra OS", "Dashboard Basico", "10 Clics Semanales"]}
          icon={<Zap />}
          loading={loading === "price_standard"}
          onBuy={() => handleCheckout("price_standard")}
        />
        <PriceCard 
          id="price_elite"
          title="Elite Master"
          price="1.500€"
          features={["Mentoría 1-a-1 Edwin Agudelo", "Acceso Total 99 Clics", "Protocolo Hunter Activo"]}
          icon={<Star className="text-[#d4af37]" />}
          highlight={true}
          loading={loading === "price_elite"}
          onBuy={() => handleCheckout("price_elite")}
        />
        <PriceCard 
          id="price_agency"
          title="Agency S-Class"
          price="Consultar"
          features={["Infraestructura Multi-Inquilino", "Soporte T11", "Custom RAG"]}
          icon={<Shield className="text-blue-500" />}
          loading={loading === "price_agency"}
          onBuy={() => (window.location.href = "/contact")}
        />
      </div>
    </div>
  );
};

const PriceCard = ({ title, price, features, icon, highlight = false, onBuy, loading }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className={`bg-[#0a0c10] border ${highlight ? 'border-[#d4af37]' : 'border-white/5'} p-8 rounded-3xl relative overflow-hidden`}
  >
    {highlight && <div className="absolute top-0 right-0 bg-[#d4af37] text-black text-[8px] font-bold px-4 py-1 uppercase tracking-widest">Recomendado</div>}
    <div className="mb-8">{icon}</div>
    <h3 className="text-2xl font-bold mb-2 uppercase">{title}</h3>
    <div className="text-4xl font-bold mb-8 text-[#d4af37]">{price}</div>
    <ul className="space-y-4 mb-12">
      {features.map((f: string) => (
        <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
          <Check size={12} className="text-[#d4af37]" /> {f}
        </li>
      ))}
    </ul>
    <button 
      onClick={onBuy}
      disabled={loading}
      className="w-full bg-white text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#d4af37] transition-all flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : "Iniciar Despliegue"}
    </button>
  </motion.div>
);

export default PricingSClass;