"use client";
import React, { useState } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';

export default function OracleSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/oracle/infer?q=${query}`);
        const data = await res.json();
        setResults(data);
    };

    const openNode = (content: string) => {
        // Activación de la Consola de Mando
        alert("DESPLEGANDO NODO S-CLASS:\n\n" + content.substring(0, 500) + "...");
    };

    return (
        <div className="p-6 bg-[#0a0a0a] rounded-[2rem] border border-[#d4a855]/20 shadow-2xl">
            <form onSubmit={handleSearch} className="relative mb-8">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Interrogar al Oráculo..." 
                    className="w-full bg-black/50 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:border-[#d4a855] outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            </form>

            <div className="space-y-4">
                {results.map((res: any) => (
                    <button 
                        key={res.id} 
                        onClick={() => openNode(res.content)}
                        className="w-full group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-[#d4a855]/50 transition-all text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#d4a855]/10 rounded-xl text-[#d4a855]"><FileText size={20}/></div>
                            <div>
                                <p className="text-[10px] font-black text-[#d4a855] uppercase tracking-widest">{res.category}</p>
                                <p className="text-white font-bold">{res.title}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-white/20 group-hover:text-[#d4a855] transition-colors" />
                    </button>
                ))}
            </div>
        </div>
    );
}
