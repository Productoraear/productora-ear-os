"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ProveedorDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Simulación activa para prueba
  const [providerPhone, setProviderPhone] = useState("+34693693048");

  // Lista de bolos asignados de prueba
  const [gigs, setGigs] = useState([
    {
      id: "EAR-2026-CHINCHON",
      ocasion: "Cumpleaños Sorpresa",
      formato: "Solista Premium Edwin Agudelo",
      municipio: "Chinchón (Madrid)",
      direccion: "Plaza Mayor, 1",
      fecha: "2026-11-28",
      hora: "17:00",
      duracion: "1 hora",
      netIncome: 440, // 80% del Split Soberano
      status: "CONFIRMADO_PAGADO",
      arrivalNotes: "Sorpresa total. Entrar con 'Las Mañanitas' sonando.",
    },
  ]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-zinc-950 border border-amber-500/30 text-center space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-black uppercase tracking-widest">
              Acceso Proveedores Oficiales
            </span>
            <h1 className="text-2xl font-black mt-3">Centro de Mando Artistas</h1>
            <p className="text-xs text-zinc-400 mt-1">Acceso rápido, seguro y sin contraseñas difíciles</p>
          </div>

          <div className="space-y-3">
            {/* Acceso Google */}
            <button
              onClick={() => setIsAuthenticated(true)}
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

            {/* Acceso Apple */}
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.73-7.85-12.08-14.41-6.73-10.15-12-21.84-15.82-35.08-3.8-13.23-5.71-25.75-5.71-37.55 0-14.28 3.59-26.24 10.77-35.88 7.18-9.64 16.32-14.54 27.43-14.72 4.9 0 10.33 1.34 16.29 4.02 5.95 2.68 9.77 4.09 11.45 4.23 1.9-.27 5.92-1.74 12.07-4.42 6.14-2.68 11.53-3.88 16.17-3.6 12.2.65 21.93 5.3 29.21 13.97-10.76 6.53-16.03 15.69-15.82 27.48.22 9.4 3.91 17.26 11.08 23.59 7.17 6.32 15.64 9.94 25.42 10.85-2.17 6.53-4.89 13.43-8.14 20.73zM119.22 31.84c0-7.18 2.61-13.97 7.83-20.37 5.23-6.41 11.75-10.45 19.57-12.13.22 1.09.33 2.07.33 2.94 0 7.07-2.67 13.92-8.02 20.55-5.35 6.63-11.96 10.5-19.82 11.62-.22-.87-.33-1.69-.33-2.61z" />
              </svg>
              Continuar con Apple
            </button>

            {/* Acceso Meta */}
            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-3 hover:bg-blue-500 transition"
            >
              <span>f</span> Continuar con Meta / Facebook
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabecera del Centro de Mando */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                ● Conexión Segura Activa
              </span>
              <span className="text-xs text-zinc-400 font-mono">WhatsApp: {providerPhone}</span>
            </div>
            <h1 className="text-2xl font-black mt-2">Centro de Mando del Artista</h1>
            <p className="text-xs text-zinc-400">Panel de actuaciones oficiales y liquidación de fianza (Split Soberano 80/10/10)</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`[suspicious link removed]`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs uppercase hover:bg-emerald-400 transition inline-flex items-center gap-2"
            >
              <span>💬</span> WhatsApp Centralita
            </a>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold transition border border-zinc-800"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Resumen Financiero Rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Tu Parte Neta (80% Split)</span>
            <span className="text-2xl font-black text-amber-400">440 €</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">● Fianza retenida y protegida</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Bolos Activos Este Mes</span>
            <span className="text-2xl font-black text-white">1</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Disponibilidad 100% activa</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <span className="text-[10px] text-zinc-500 uppercase font-bold block">Garantía de Cobro</span>
            <span className="text-sm font-bold text-white mt-1 block">Cero Cobros en Mano</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5">Liquidación directa a cuenta</span>
          </div>
        </div>

        {/* Lista de Actuaciones Asignadas */}
        <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              📋 Próxima Actuación Asignada
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Confirmado y Pagado
            </span>
          </div>

          {gigs.map((gig) => (
            <div key={gig.id} className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
                <div>
                  <h3 className="text-base font-black text-white">{gig.formato}</h3>
                  <p className="text-xs text-amber-300 font-semibold">{gig.ocasion} • {gig.municipio}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs text-zinc-400 block">{gig.fecha} a las {gig.hora} ({gig.duracion})</span>
                  <span className="text-sm font-black text-emerald-400">Tu Cobro Neto: {gig.netIncome} €</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Dirección del Evento</span>
                  <p className="font-semibold text-white mt-0.5">{gig.direccion}, {gig.municipio}</p>
                  <a
                    href={`[suspicious link removed]{encodeURIComponent(gig.direccion + " " + gig.municipio)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[11px] text-amber-400 hover:underline font-bold"
                  >
                    🗺️ Abrir en Google Maps / GPS
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Señas e Instrucciones Secretas</span>
                  <p className="text-zinc-300 mt-0.5">{gig.arrivalNotes}</p>
                </div>
              </div>

              {/* Botón WhatsApp de Respuesta Rápida */}
              <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3">
                <span className="text-[11px] text-zinc-400">
                  ¿Incidencia en carretera o cambio de hora?
                </span>
                <a
                  href={`[suspicious link removed]{gig.id}%20en%20${gig.municipio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider transition inline-flex items-center gap-2"
                >
                  <span>💬</span> Notificar a Centralita vía WhatsApp (+34693693048)
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}