'use client';

import React, { useState } from 'react';
import { createCheckoutSession } from '@/lib/payments';

interface BookingCalculatorProps {
  baseFare: number;
  distanceFromMadrid: number;
  eventEndTime: string;
}

const BookingCalculator = ({ baseFare, distanceFromMadrid, eventEndTime }: BookingCalculatorProps) => {
  const [distance, setDistance] = useState(distanceFromMadrid);
  const [endTime, setEndTime] = useState(eventEndTime);

  const calculateTotal = () => {
    let total = baseFare;
    total += distance * 2; // Additional fare per km
    if (distance > 200 && new Date(endTime).getHours() > 22) {
      total += 150; // Accommodation fee
    }
    return total;
  };

const handleReservation = async () => {
  const totalFare = calculateTotal();
  try {
    await createCheckoutSession({ amount: totalFare, concept: 'Mariachi Reservation' });
  } catch (error) {
    console.error('Error creating checkout session:', error);
  }
};

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Calculadora de Reservas</h2>
      <div className="mb-4">
        <label htmlFor="distance" className="block text-sm font-medium mb-1">Distancia desde Madrid (km):</label>
        <input
          type="number"
          id="distance"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="endTime" className="block text-sm font-medium mb-1">Hora de finalización del evento:</label>
        <input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Desglose de costos:</h3>
        <p>Tarifa base: {baseFare}€</p>
        <p>Kilometraje ({distance} km): {distance * 2}€</p>
        {new Date(endTime).getHours() > 22 && distance > 200 ? (
          <p>Hospedaje (+150km & después de 22:00h): 150€</p>
        ) : null}
      </div>
      <button
        onClick={handleReservation}
        className="bg-gold text-black font-bold py-3 px-6 rounded-lg hover:bg-gold-hover transition-colors"
      >
        Reservar con Stripe
      </button>
    </div>
  );
};

export default BookingCalculator;