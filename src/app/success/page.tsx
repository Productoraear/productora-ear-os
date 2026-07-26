"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, FileText, Download, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const provincia = searchParams.get('provincia') || 'tu ciudad';
  const [contractReady, setContractReady] = useState(false);
  const [contractUrl, setContractUrl] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      // Disparar Pixel SEO/Conversión (Simulado)
      console.log(`[SEO-TELEMETRY] Conversión de Venta Exitosa registrada. Session: ${sessionId}, Provincia: ${provincia}`);
      
      // Llamada al endpoint para generar el contrato S-Class
      fetch('/api/contracts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, provincia })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContractReady(true);
          setContractUrl(data.downloadUrl);
        }
      })
      .catch(err => console.error("Error generando contrato", err));
    }
  }, [sessionId, provincia]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold mb-2">¡Reserva Confirmada!</h1>
        <p className="text-gray-400 mb-8">
          Tu servicio logístico en <span className="text-white font-bold">{provincia.toUpperCase()}</span> ha sido asegurado.
        </p>

        <div className="bg-black/40 border border-white/10 rounded-xl p-6 text-left mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-green-500" /> Garantía EAR OS
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Nuestro oráculo S-Class ha verificado la disponibilidad, trazado la ruta óptima y bloqueado la fecha para tu evento.
          </p>

          {contractReady ? (
            <motion.a
              href={contractUrl || '#'}
              download
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 transition rounded-lg text-white font-medium border border-white/20"
            >
              <Download className="w-5 h-5" />
              Descargar Pre-Contrato y Rider Técnico
            </motion.a>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-5 h-5 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
              Generando Smart Contract legal...
            </div>
          )}
        </div>

        <a 
          href="/dashboard"
          className="text-gray-400 hover:text-white transition text-sm underline decoration-white/30"
        >
          Volver al Centro de Mando
        </a>
      </motion.div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
