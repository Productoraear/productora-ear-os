"use client";
import React, { useState, useEffect } from 'react';

const FleetHUD = () => {
  const [count, setCount] = useState(94120); // Base de tu JSON
  const [speed, setSpeed] = useState("4.2 assets/sec");

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-50 bg-black/90 backdrop-blur-xl border-l-4 border-emerald-500 p-6 shadow-2xl shadow-emerald-500/10">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-full">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <div>
          <h4 className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em] font-black">Fleet Ingestion Active</h4>
          <div className="text-4xl font-black text-white tracking-tighter tabular-nums">
            {count.toLocaleString()} <span className="text-emerald-500/50 text-xl font-light">PROV</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-mono tracking-widest">
            Bandwidth: {speed} | Est. Value: <span className="text-white">{(count * 150).toLocaleString()}€/yr</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FleetHUD;
