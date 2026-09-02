'use client';
import React from 'react';

export default function ArtistsLanding() {
  return (
    <div className="w-full bg-[#221d10] text-white">
      {/* Hero: Del Talento al Activo */}
      <div className="relative h-[500px] flex flex-col items-center justify-center text-center p-6 rounded-[30px] overflow-hidden mb-8">
        <div className="absolute inset-0 z-0 opacity-60">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUh0g1ymgYDCM_o_04rpFPOoWAwEErmqG9CMeHR33-h9jv5ObDqR9gVJmDWUO8EQqIqI7wDtbgRbH8JCiwfY6TM8J7t3cvaanKHa5iiOV5MyvZ_zHRPNG-tfKKkuIDRhtDtN5kLRCczr5ZvO7_XVv3HvInP6sl3cN2y7tz-5-mG6AE8btWaNDFG7pVV8w9PlbVOW_n4hz7A62J-EDBqSSxeDyBR8jHTa9fZcFaNG0x8G7iy9Cm83sVvLjPCJQktptKVhb15pjS2A" 
            className="w-full h-full object-cover" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-transparent to-black/20" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4 block">Productora EAR</span>
          <h1 className="text-5xl md:text-7xl font-serif italic font-bold mb-6 text-primary">Del Talento <br/><span className="not-italic text-white">Al Activo</span></h1>
          <button className="bg-primary text-black px-10 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Únete al Roster
          </button>
        </div>
      </div>

      {/* Grid de Beneficios */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-12">
        {['Mentalidad', 'Branding', 'Networking', 'Legal', 'Merch', 'Fans'].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary">verified</span>
            </div>
            <h3 className="font-bold uppercase text-xs tracking-widest">{item}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
