'use client';

import React, { useState } from 'react';
import type { FincaHomologada } from '@/lib/constants/fincas-catalog';
import { ArrowRight } from 'lucide-react';
import { getFincaImage } from '@/lib/constants/fincas-images';
interface NeuralNavigationProps {
    fincas: FincaHomologada[];
}

export default function NeuralNavigation({ fincas }: NeuralNavigationProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextFinca = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % fincas.length);
    };

    if (fincas.length === 0) return null;

    const currentFinca = fincas[currentIndex];

    return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 space-y-4">
            <h2 className="text-lg font-black uppercase font-syne text-white">Recomendación Neural</h2>
            <div className="flex flex-col items-center gap-4">
                <img
                    src={getFincaImage(currentFinca.id)}
                    alt={currentFinca.name}
                    loading="lazy"
                    className="w-full h-60 object-cover rounded-lg shadow-md"
                />
                <h3 className="font-syne text-xl font-black text-white">{currentFinca.name}</h3>
                <p className="text-sm text-white/60 leading-relaxed max-w-md text-center">
                    {currentFinca.description}
                </p>
                <button
                    type="button"
                    onClick={nextFinca}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-xl hover:bg-amber-300 transition-all"
                >
                    Siguiente Finca <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}