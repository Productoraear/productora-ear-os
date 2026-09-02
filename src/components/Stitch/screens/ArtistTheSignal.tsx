'use client';
import React from 'react';

export default function ArtistTheSignal() {
  return (
    <div className="bg-[#221d10] min-h-screen flex flex-col font-sans text-white border-x border-white/5 max-w-md mx-auto">
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD71xH-Qk68nHk31GCylZQ9pYfCv2csaKw6muZYpjYDLOvw4SxffRAKmfaULgNDGS3tUBZpuONeD6dyovZwexpDtFwCjQcddsIakYtfPlUWgr_eityJJUmrNwpx5ihFXMFsD95t2qovLkphCeTjZXiMJXFWSX_jW9B0gCk69y0UzT7ffPO-8eRGCAAyya2niu5egJ47EZjc3nqiwU2kz6H3osdxMZ-2LH9bvlLI_ygU0ldYTJJkX24icS1-RG9kxvOb8_GTYCL_hA")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#221d10] via-transparent to-transparent"></div>
        <div className="absolute bottom-0 p-8">
          <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-widest text-black bg-[#ecb613] rounded">CLASSIFIED ACCESS</span>
          <h1 className="text-white text-4xl font-bold leading-none mb-2 tracking-tighter">UNLOCK YOUR <br/>SONIC TRUTH</h1>
        </div>
      </div>

      <div className="px-8 py-10 space-y-6">
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-[#ecb613] text-3xl">graphic_eq</span>
          <p className="text-gray-400 leading-relaxed">The original forensic audit designed to strip away the noise and reveal your core artistic frequency.</p>
        </div>
        
        <button className="w-full bg-[#ecb613] text-black font-black py-5 rounded-xl uppercase tracking-widest shadow-xl shadow-[#ecb613]/20 flex items-center justify-center gap-3 group">
          Iniciar Auditoría Forense <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">fingerprint</span>
        </button>
      </div>
    </div>
  );
}
