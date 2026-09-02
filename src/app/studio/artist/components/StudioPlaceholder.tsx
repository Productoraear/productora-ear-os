import React from 'react';

export default function GenericStudioPage({ title }: { title: string }) {
  return (
    <div className="space-y-12">
      <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">{title}</h1>
      <div className="bg-white/[0.02] border border-white/5 p-20 rounded-[3rem] text-center">
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">Módulo en proceso de materialización operativa</p>
      </div>
    </div>
  );
}
