"use client";

import React, { useState } from 'react';
import { calculateMariachiRate } from '@/lib/pricing-engine';
import { MapPin, Clock, Info, ShieldCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingCalculator() {
  const [distanciaKm, setDistanciaKm] = useState<number>(0);
  const [horaFin, setHoraFin] = useState<number>(20);
  const [evento, setEvento] = useState<string>('Boda');
  const [provincia, setProvincia] = useState<string>('Madrid');
  const [loading, setLoading] = useState(false);

  const priceDetails = calculateMariachiRate({
    distanciaKm: Number(distanciaKm),
    horaFin: Number(horaFin),
    esPremium: true,
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceDetails.total,
          concept: `Mariachi Premium - ${evento}`,
          provincia: provincia,
          evento: evento,
          artistId: 'edwin-agudelo',
          metadata: {
            km_recorridos: String(distanciaKm),
            necesita_hotel: priceDetails.detalles.hotel > 0 ? 'si' : 'no',
            hora_finalizacion: String(horaFin)
          }
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error al iniciar el pago.');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-2xl max-w-lg mx-auto text-white">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShieldCheck className="text-green-500" /> Calculador S-Class
      </h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Provincia (Destino)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
            <input 
              type="text"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300">Tipo de Evento</label>
          <select 
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="Boda">Boda</option>
            <option value="Cumpleaños">Cumpleaños (Mañanitas)</option>
            <option value="Corporativo">Evento Corporativo</option>
            <option value="Fiestas">Fiestas / Festival</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Distancia (KM desde Madrid)</label>
            <input 
              type="number"
              min="0"
              value={distanciaKm}
              onChange={(e) => setDistanciaKm(Number(e.target.value))}
              className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Hora de Fin (24h)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
              <input 
                type="number"
                min="0"
                max="23"
                value={horaFin}
                onChange={(e) => setHoraFin(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/60 rounded-lg p-4 space-y-2 mb-6 border border-white/10">
        <div className="flex justify-between text-gray-300">
          <span>Tarifa Base (Solista Premium)</span>
          <span>{priceDetails.detalles.tarifaBase.toFixed(2)} €</span>
        </div>
        {priceDetails.detalles.kmExtra > 0 && (
          <div className="flex justify-between text-gray-300">
            <span>Kilometraje (+{distanciaKm}km)</span>
            <span>{priceDetails.detalles.kmExtra.toFixed(2)} €</span>
          </div>
        )}
        {priceDetails.detalles.hotel > 0 && (
          <div className="flex justify-between text-amber-400">
            <span className="flex items-center gap-1"><Info className="w-4 h-4"/> Noche de Hotel</span>
            <span>{priceDetails.detalles.hotel.toFixed(2)} €</span>
          </div>
        )}
        <div className="border-t border-white/20 pt-2 flex justify-between text-gray-400 text-sm">
          <span>IVA (21%)</span>
          <span>{priceDetails.iva.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-1 text-white">
          <span>Total Oficial</span>
          <span>{priceDetails.total.toFixed(2)} €</span>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckout}
        disabled={loading}
        className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <CreditCard className="w-6 h-6" />
        {loading ? 'Procesando S-Class...' : 'Reservar con Klarna / Tarjeta'}
      </motion.button>
    </div>
  );
}
