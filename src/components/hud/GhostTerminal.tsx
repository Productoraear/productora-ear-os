"use client";
import React, { useEffect, useState } from "react";

export const GhostTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    "[ASTRA] Scanning Knowledge Graph: 1.3M nodes found.",
    "[HUNTER] Target identified: Marriott Madrid (Events Director).",
    "[RAG] Retrieving memory stream for Day 24 leccion...",
    "[STRIPE] Webhook secure handshake initialized.",
    "[VAMPIRE] Competitor price shift detected in Fincas zona Norte.",
    "[EAR OS] System status: S-Class Sovereignty active.",
    "[CUDA] Transcribing video stream via Whisper...",
    "[NASA] Build manifest validated. Ready for deployment."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextLog = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [nextLog, ...prev].slice(0, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-black/80 backdrop-blur-xl border border-[#d4af37]/20 p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-[10px]">
      <div className="flex justify-between items-center mb-2 text-[#d4af37]/50 border-b border-white/5 pb-1">
        <span>EAR_SYSTEM_LOGS</span>
        <span className="animate-pulse">● LIVE</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className={`truncate ${i === 0 ? 'text-[#d4af37]' : 'text-zinc-500'}`}>
            <span className="mr-2 opacity-30">{'>'}</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};