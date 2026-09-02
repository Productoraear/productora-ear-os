"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { GlassCard } from "@/components/ui/glassCard";
import { Lock, ShieldCheck, Zap, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import EarCommandCenter from "./EarCommandCenter";

export default function DashboardPage() {
  const { user, isPaid, loading } = useAuth();
  const router = useRouter();
  const [accessVerified, setAccessVerified] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!isPaid) {
        // El usuario está logueado pero no ha pagado
        setAccessVerified(false);
      } else {
        setAccessVerified(true);
      }
    }
  }, [user, isPaid, loading, router]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-4 border-[#d4a855]/20 border-t-[#d4a855] rounded-full animate-spin" /></div>;

  if (!accessVerified) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full relative z-10">
          <GlassCard className="p-8 border-[#d4a855]/20 text-center space-y-6 backdrop-blur-2xl">
            <div className="w-20 h-20 bg-[#d4a855]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#d4a855]/30">
              <Lock className="text-[#d4a855] w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Acceso <span className="text-[#d4a855]">Restringido</span></h1>
            <div className="pt-4 space-y-3">
              <button onClick={() => router.push("/precios")} className="w-full bg-[#d4a855] text-black font-black py-4 rounded-xl flex items-center justify-center gap-2">
                <CreditCard size={18} />ACTIVAR LICENCIA GOLD
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    );
  }
  return <EarCommandCenter />;
}
