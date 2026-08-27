"use client";

import * as React from "react";
import { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";

export interface SignIn2Props {
  onSuccess?: (email: string) => void;
  className?: string;
}

const SignIn2: React.FC<SignIn2Props> = ({ onSuccess, className }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Por favor, introduce tu email y contraseña.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Introduce una dirección de email válida.");
      return;
    }
    setError("");
    if (onSuccess) {
      onSuccess(email);
    } else {
      alert("¡Inicio de sesión completado! (EAR OS Partner Demo)");
    }
  };

  return (
    <div className={`w-full flex items-center justify-center p-4 z-1 ${className || ''}`}>
      <div className="w-full max-w-sm bg-gradient-to-b from-neutral-900 via-[#0a0a0f] to-[#050505] rounded-3xl shadow-2xl p-8 flex flex-col items-center border border-white/10 text-white">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ecb613] mb-6 shadow-lg shadow-[#ecb613]/20">
          <LogIn className="w-7 h-7 text-black" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-center text-white font-syne">
          Acceso de Clientes & Partners
        </h2>
        <p className="text-white/60 text-xs mb-6 text-center leading-relaxed">
          Accede a tu panel de cotizaciones, gestión de fechas y reservas verificadas de Productora EAR.
        </p>
        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="tu@email.com"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ecb613]/50 bg-white/5 text-white text-sm placeholder:text-white/30"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="••••••••"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ecb613]/50 bg-white/5 text-white text-sm placeholder:text-white/30"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 cursor-pointer text-xs select-none"></span>
          </div>
          <div className="w-full flex justify-between items-center">
            {error ? (
              <div className="text-xs text-red-400 text-left">{error}</div>
            ) : <span />}
            <button className="text-xs text-[#ecb613] hover:underline font-medium">
              ¿Olvidaste tu clave?
            </button>
          </div>
        </div>
        <button
          onClick={handleSignIn}
          className="w-full bg-[#ecb613] text-black font-bold py-3 rounded-xl shadow-lg hover:brightness-110 cursor-pointer transition mb-4 mt-3 text-xs uppercase tracking-widest font-mono"
        >
          Iniciar Sesión
        </button>
        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-white/10"></div>
          <span className="mx-2 text-[10px] uppercase font-mono text-white/40">O continuar con</span>
          <div className="flex-grow border-t border-dashed border-white/10"></div>
        </div>
        <div className="flex gap-3 w-full justify-center mt-2">
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow">
            <img
              src="https://www.svgrepo.com/show/448224/facebook.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
          </button>
          <button className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grow">
            <img
              src="https://www.svgrepo.com/show/511330/apple-173.svg"
              alt="Apple"
              className="w-5 h-5 invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
export default SignIn2;
