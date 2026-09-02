"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, User, Briefcase, Globe, Lock, ArrowRight, Star, Fingerprint, Building2
} from "lucide-react";
import Link from "next/link";

const AuthPortalSClass = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "artist",
      title: "Artist Sovereign",
      icon: <Star className="text-[#d4af37]" />,
      desc: "Acceso a la academia Astra y embudo The Signal.",
      route: "/astra",
      color: "border-[#d4af37]/20"
    },
    {
      id: "planner",
      title: "Event Architect",
      icon: <Briefcase className="text-blue-500" />,
      desc: "Gestion logistica, Matchmaking y Toolkit B2B.",
      route: "/toolkit-hub",
      color: "border-blue-500/20"
    },
    {
      id: "institution",
      title: "Institutional Protocol",
      icon: <Building2 className="text-green-500" />,
      desc: "Consulados, Embajadas y Proyectos Sociales (Vimume).",
      route: "/vimume",
      color: "border-green-500/20"
    },
    {
      id: "admin",
      title: "Master CEO",
      icon: <Shield className="text-red-500" />,
      desc: "Control total, Valoracion IPO y Protocolo Hunter.",
      route: "/command-center",
      color: "border-red-500/20"
    }
  ];

  return (
    <div className="bg-[#050505] text-white min-h-screen font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-4xl w-full"
      >
        <header className="text-center mb-16">
          <div className="inline-block p-4 bg-white/5 rounded-full mb-6 border border-white/10">
            <Fingerprint className="text-[#d4af37]" size={48} />
          </div>
          <h1 className="text-4xl font-bold tracking-widest uppercase mb-2">EAR OS <span className="text-[#d4af37]">Gatekeeper</span></h1>
          <p className="text-gray-500 text-xs tracking-[0.3em] uppercase">Identity Verification Required</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <motion.div 
              key={role.id}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
              onClick={() => setSelectedRole(role.id)}
              className={`bg-[#0a0c10] border ${role.color} p-8 rounded-3xl cursor-pointer transition-all ${selectedRole === role.id ? 'border-white/40 bg-white/5' : ''}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 rounded-xl">{role.icon}</div>
                {selectedRole === role.id && <motion.div layoutId="check" className="w-2 h-2 bg-white rounded-full animate-pulse" />}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{role.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedRole && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 flex justify-center"
            >
              <Link href={roles.find(r => r.id === selectedRole)?.route || '#' }>
                <button className="bg-white text-black font-black px-12 py-4 rounded-xl text-xs tracking-[0.3em] uppercase flex items-center gap-4 hover:bg-[#d4af37] transition-all group">
                  Confirmar Identidad <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-24 text-center">
          <p className="text-[10px] text-gray-700 uppercase tracking-[0.5em]">System Build: 2026.03.17.GATEKEEPER</p>
        </footer>
      </motion.div>
    </div>
  );
};

export default AuthPortalSClass;