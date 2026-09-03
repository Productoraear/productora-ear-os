"use client";

import React, { useState } from 'react';
import { calculateMariachiRate } from '@/lib/pricing-engine';
import { MapPin, Clock, Info, ShieldCheck, CreditCard, Phone, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { CENTRALITA } from '@/lib/phone-constants';
import { generateWhatsAppLink } from '@/lib/whatsapp';

import { SCLASS_ROSTER_14_FORMATS } from '@/lib/constants/pricing-catalog';

interface BookingCalculatorProps {
  initialFormatId?: string;
}

export default function BookingCalculator({ initialFormatId = 'solista-edwin-agudelo' }: BookingCalculatorProps) {
  const [formatoId, setFormatoId] = useState<string>(initialFormatId);
  const [distanciaKm, setDistanciaKm] = useState<number>(0);
  const [horaFin, setHoraFin] = useState<number>(20);
  const [evento, setEvento] = useState<string>('Boda');
  const [provincia, setProvincia] = useState<string>('Madrid');
  const [pax, setPax] = useState<number>(100);
  const [tipoEspacio, setTipoEspacio] = useState<'Interior' | 'Exterior'>('Interior');
  const [loading, setLoading] = useState(false);

  const priceDetails = calculateMariachiRate({
    distanciaKm: Number(distanciaKm),
    horaFin: Number(horaFin),
    esPremium: true,
    evento,
    pax,
    tipoEspacio,
    formatoId
  });

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: priceDetails.total,
          concept: `${priceDetails.formatName || 'Formato S-Class'} - ${evento}`,
          provincia: provincia,
          evento: evento,
          artistId: 'edwin-agudelo',
          metadata: {
            formato_id: formatoId,
            format_name: priceDetails.formatName,
            km_recorridos: String(distanciaKm),
            necesita_hotel: priceDetails.detalles.hotel > 0 ? 'si' : 'no',
            hora_finalizacion: String(horaFin),
            pax: String(pax),
            potencia_acustica_w: String(priceDetails.acousticPower || 0),
            margen_bruto: String(priceDetails.detalles.margenBrutoEstimado)
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-md shadow-2xl max-w-lg mx-auto text-white font-sans">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 font-syne">
        <ShieldCheck className="text-[#ecb613]" /> Calculador S-Class
      </h3>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300 font-mono text-xs uppercase">Formato Homologado (14 Opciones)</label>
          <select 
            value={formatoId}
            onChange={(e) => setFormatoId(e.target.value)}
            className="w-full bg-black/60 border border-[#ecb613]/40 rounded-lg py-2.5 px-3 text-white focus:ring-2 focus:ring-[#ecb613] outline-none font-mono text-xs"
          >
            {SCLASS_ROSTER_14_FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.basePrice} € ({f.members} {f.members === 1 ? 'músico' : 'músicos'})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300 font-mono text-xs uppercase">Provincia (Destino desde Hub Méntrida)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" />
            <input 
              type="text"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              className="w-full bg-black/40 border border-white/20 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-[#ecb613] outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-300 font-mono text-xs uppercase">Tipo de Ocasión / Evento</label>
          <select 
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-[#ecb613] outline-none text-sm"
          >
            <option value="Boda">Boda S-Class Diamond (Suelo 3.800 €)</option>
            <option value="Cumpleaños">Cumpleaños / Serenata / Aniversario</option>
            <option value="Corporativo">Gala Corporativa / Cena de Empresa</option>
            <option value="Fiestas">Fiestas Patronales / Festival Público</option>
          </select>
        </div>


        {evento === 'Boda' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Invitados (Pax)</label>
              <input 
                type="number"
                min="1"
                value={pax}
                onChange={(e) => setPax(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Tipo de Espacio</label>
              <select 
                value={tipoEspacio}
                onChange={(e) => setTipoEspacio(e.target.value as 'Interior' | 'Exterior')}
                className="w-full bg-black/40 border border-white/20 rounded-lg py-2 px-4 text-white focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="Interior">Interior (12W/pax)</option>
                <option value="Exterior">Exterior (18W/pax)</option>
              </select>
            </div>
          </div>
        )}

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
        {priceDetails.isBodaSClass && priceDetails.acousticPower && (
          <div className="flex justify-between text-emerald-400 border-t border-white/10 pt-2 mt-2">
            <span className="flex items-center gap-1"><Info className="w-4 h-4"/> Potencia Acústica Req.</span>
            <span>{priceDetails.acousticPower} W RMS</span>
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

      <div className="mt-4 grid grid-cols-2 gap-3">
        <a 
          href={CENTRALITA.tel}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-lg font-bold transition-colors"
        >
          <Phone className="w-5 h-5 text-gray-400" />
          Llamar
        </a>
        <a 
          href={generateWhatsAppLink({
            profile: 'edwin-agudelo',
            service: `Mariachi Premium - ${evento}`,
            location: provincia,
            intent: `reserva con presupuesto estimado de ${priceDetails.total.toFixed(2)}€`,
            slug: 'calculador'
          }).url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white py-3 rounded-lg font-bold transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
