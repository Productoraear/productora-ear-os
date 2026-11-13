"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function ProveedorDashboardPage() {
  const { data: session, status } = useSession();

  // Pantalla de Carga
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400 font-mono tracking-wider">Cargando Centro de Mando...</p>
        </div>
      </div>
    );
  }

  // PANTALLA 1: Selector de Cuenta (Google, Apple, Meta)
  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 text-center space-y-6 shadow-2xl">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-widest">
              Acceso Proveedores Oficiales
            </span>
            <h1 className="text-2xl font-black mt-3 text-white">Centro de Mando Artistas</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Acceso rápido, seguro y verificado. Selecciona tu cuenta para identificarte:
            </p>
          </div>

          <div className="space-y-3">
            {/* 1. Google Auth Real */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/proveedores/dashboard" })}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-3 hover:bg-zinc-200 transition shadow"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continuar con Google
            </button>

            {/* 2. Apple Auth Real */}
            <button
              onClick={() => signIn("apple", { callbackUrl: "/proveedores/dashboard" })}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition shadow"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.73-7.85-12.08-14.41-6.73-10.15-12-21.84-15.82-35.08-3.8-13.23-5.71-25.75-5.71-37.55 0-14.28 3.59-26.24 10.77-35.88 7.18-9.64 16.32-14.54 27.43-14.72 4.9 0 10.33 1.34 16.29 4.02 5.95 2.68 9.77 4.09 11.45 4.23 1.9-.27 5.92-1.74 12.07-4.42 6.14-2.68 11.53-3.88 16.17-3.6 12.2.65 21.93 5.3 29.21 13.97-10.76 6.53-16.03 15.69-15.82 27.48.22 9.4 3.91 17.26 11.08 23.59 7.17 6.32 15.64 9.94 25.42 10.85-2.17 6.53-4.89 13.43-8.14 20.73zM119.22 31.84c0-7.18 2.61-13.97 7.83-20.37 5.23-6.41 11.75-10.45 19.57-12.13.22 1.09.33 2.07.33 2.94 0 7.07-2.67 13.92-8.02 20.55-5.35 6.63-11.96 10.5-19.82 11.62-.22-.87-.33-1.69-.33-2.61z" />
              </svg>
              Continuar con Apple
            </button>

            {/* 3. Meta / Facebook Auth Real */}
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/proveedores/dashboard" })}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-blue-500 transition shadow"
            >
              <span className="font-serif font-black text-sm">f</span> Continuar con Meta / Facebook
            </button>
          </div>

          <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-500">
            ¿Eres músico colaborador y necesitas asistencia?{" "}
            <a
              href="[suspicious link removed]"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-bold"
            >
              Escríbenos por WhatsApp (+34 693 69 30 48)
            </a>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA 2: Panel de Control del Proveedor (Una vez autenticado)
  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabecera del Panel con Cierre de Sesión */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                ● Conexión Segura Activa
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {session.user?.email || session.user?.name || "Proveedor Oficial"}
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2 text-white">Centro de Mando del Artista</h1>
            <p className="text-xs text-zinc-400">
              Gestión directa de actuaciones, telemetría y liquidación de fianza (Split Soberano 80/10/10)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="[suspicious link removed]"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs uppercase hover:bg-emerald-400 transition inline-flex items-center gap-2 shadow"
            >
              <span>💬</span> WhatsApp Centralita
            </a>
            <button
              onClick={() => signOut({ callbackUrl: "/proveedores/dashboard" })}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition border border-zinc-700"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Resumen Financiero Transparente */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Tu Liquidación Neta (80% Split)</span>
            <span className="text-2xl font-black text-amber-400">440 €</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">● Fianza retenida en custodia oficial</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Actuaciones Activas</span>
            <span className="text-2xl font-black text-white">1</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Disponibilidad en ruta confirmada</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Protección Salarial</span>
            <span className="text-sm font-bold text-white mt-1 block">Cero Cobros en Mano</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Transferencia directa asegurada</span>
          </div>
        </div>

        {/* Actuación Asignada en Curso */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              📋 Próxima Actuación Asignada
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
              Fianza Pagada y Confirmada
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
              <div>
                <h3 className="text-base font-black text-white">Solista Premium Edwin Agudelo</h3>
                <p className="text-xs text-amber-300 font-semibold">Cumpleaños Sorpresa • Chinchón (Madrid)</p>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-zinc-400 block">28 Nov 2026 a las 17:00 (1 hora)</span>
                <span className="text-sm font-black text-emerald-400">Tu Cobro Neto: 440 €</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Ubicación del Evento</span>
                <p className="font-semibold text-white mt-0.5">Plaza Mayor, 1, Chinchón</p>
                <a
                  href="[suspicious link removed]"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[11px] text-amber-400 hover:underline font-bold"
                >
                  🗺️ Abrir Ruta en Google Maps / Waze
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Instrucciones y Modo Sorpresa</span>
                <p className="text-zinc-300 mt-0.5">Sorpresa absoluta. Entrar por el lateral entonando "Las Mañanitas".</p>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-zinc-400">
                ¿Incidencia en carretera o consulta de repertorio?
              </span>
              <a
                href="[suspicious link removed]"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition inline-flex items-center gap-2 shadow"
              >
                <span>💬</span> WhatsApp con Centralita (+34 693 69 30 48)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}