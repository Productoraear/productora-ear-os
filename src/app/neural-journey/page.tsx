"use client";

import { useState, useEffect } from "react";
import * as Slider from "@radix-ui/react-slider";
import { LockIcon, SparklesIcon, Lock as CandadoIcon } from "lucide-react";
import { motion } from "framer-motion";

const mockProviders = [
  { id: 1, name: "Artista A", category: "Artistas", price: 500, rating: 4.8, image: "/abstract-dark-1.jpg" },
  { id: 2, name: "Logística L", category: "Logística", price: 60, rating: 4.7, image: "/abstract-dark-2.jpg" },
  { id: 3, name: "Artista B", category: "Artistas", price: 800, rating: 4.9, image: "/abstract-dark-3.jpg" },
  // Add more mock providers as needed
];

const NeuralJourney = () => {
  const [deposit, setDeposit] = useState(100);
  const [artists, setArtists] = useState(350);
  const [logistica, setLogistica] = useState(50);
  const [presupuestoTotal, setPresupuestoTotal] = useState(5000);

  const [lockDeposit, setLockDeposit] = useState(true);
  const [lockArtistas, setLockArtistas] = useState(false);
  const [lockLogistica, setLockLogistica] = useState(false);

  useEffect(() => {
    if (lockDeposit) return;
    distributeProportionally("deposit");
  }, [deposit]);

  useEffect(() => {
    if (lockArtistas) return;
    distributeProportionally("artists");
  }, [artists]);

  useEffect(() => {
    if (lockLogistica) return;
    distributeProportionally("logistica");
  }, [logistica]);

  useEffect(() => {
    distributeProportionally("presupuestoTotal");
  }, [presupuestoTotal]);

let distributeProportionally = (changedField: string) => {
    let remainingBudget = presupuestoTotal - deposit - artists - logistica;
    if (remainingBudget === 0) return;

    const freeSliders = [];
    if (!lockArtistas) freeSliders.push({ field: "artists", value: artists, min: 350 });
    if (!lockLogistica) freeSliders.push({ field: "logistica", value: logistica, min: 50 });

    let totalFreeValue = freeSliders.reduce((acc, slider) => acc + slider.value, 0);
    let changeAmount = presupuestoTotal - (deposit + artists + logistica);

    freeSliders.forEach(slider => {
      if (changeAmount > 0) {
        const maxIncrease = Math.min(changeAmount, slider.min - slider.value);
        setSliderValue(slider.field, slider.value + maxIncrease);
        changeAmount -= maxIncrease;
      } else {
        const maxDecrease = Math.max(changeAmount, -(slider.value - slider.min));
        setSliderValue(slider.field, slider.value + maxDecrease);
        changeAmount -= maxDecrease;
      }
    });
  };

const setSliderValue = (field: string, value: number) => {
  switch (field) {
    case "deposit":
      setDeposit(value);
      break;
    case "artists":
      setArtists(value);
      break;
    case "logistica":
      setLogistica(value);
      break;
    default:
      break;
  }
};

  const visibleProviders = mockProviders.filter(provider => provider.price <= (provider.category === "Artistas" ? artists : logistica));

  return (
    <div className="bg-[#050505] text-white grid grid-cols-12 lg:grid-cols-12">
      {/* Panel de Equilibrio Dinámico */}
      <div className="col-span-12 lg:col-span-5 p-8">
        <h1 className="text-4xl font-syne">Panel de Equilibrio Dinámico</h1>
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-lg font-inter mb-2">Depósito (Bloqueado)</label>
            <div className="flex items-center justify-between">
              <span>{deposit}€</span>
              {lockDeposit ? (
                <CandadoIcon onClick={() => setLockDeposit(false)} className="cursor-pointer" />
              ) : (
                <SparklesIcon onClick={() => setLockDeposit(true)} className="cursor-pointer" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-lg font-inter mb-2">Artistas</label>
            <div className="flex items-center justify-between">
              <span>{artists}€</span>
              {lockArtistas ? (
                <CandadoIcon onClick={() => setLockArtistas(false)} className="cursor-pointer" />
              ) : (
                <SparklesIcon onClick={() => setLockArtistas(true)} className="cursor-pointer" />
              )}
            </div>
            {!lockArtistas && (
              <Slider.Root
                value={[artists]}
                onValueChange={(value: number[]) => setArtists(value[0])}
                max={presupuestoTotal - deposit - logistica}
                step={10}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-white/10 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-[#258DCD] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-white/10 hover:border-[#258DCD] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/10" />
              </Slider.Root>
            )}
          </div>
          <div>
            <label className="block text-lg font-inter mb-2">Logística</label>
            <div className="flex items-center justify-between">
              <span>{logistica}€</span>
              {lockLogistica ? (
                <CandadoIcon onClick={() => setLockLogistica(false)} className="cursor-pointer" />
              ) : (
                <SparklesIcon onClick={() => setLockLogistica(true)} className="cursor-pointer" />
              )}
            </div>
            {!lockLogistica && (
              <Slider.Root
                value={[logistica]}
                onValueChange={(value: number[]) => setLogistica(value[0])}
                max={presupuestoTotal - deposit - artists}
                step={10}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-white/10 relative grow rounded-full h-[3px]">
                  <Slider.Range className="absolute bg-[#258DCD] rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-white/10 hover:border-[#258DCD] rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/10" />
              </Slider.Root>
            )}
          </div>
          <div>
            <label className="block text-lg font-inter mb-2">Presupuesto Total</label>
            <input
              type="number"
              value={presupuestoTotal}
              onChange={(e) => setPresupuestoTotal(Number(e.target.value))}
              className="w-full p-2 bg-white/10 border border-white/10 hover:border-[#258DCD] rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/10"
            />
          </div>
        </div>
      </div>

      {/* Panel de Matching Neural */}
      <div className="col-span-12 lg:col-span-7 p-8">
        <h1 className="text-4xl font-syne">Panel de Matching Neural</h1>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visibleProviders.map(provider => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 border border-white/10 hover:border-[#258DCD] rounded-lg p-4"
            >
              <img src={provider.image} alt={provider.name} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="mt-2">
                <h2 className="text-xl font-inter">{provider.name}</h2>
                <p className="text-sm font-mono text-zinc-300">Categoría: {provider.category}</p>
                <p className="text-lg font-inter mt-1">Precio: {provider.price}€</p>
                <p className="text-sm font-inter mt-1">Rating: {provider.rating}/5</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NeuralJourney;