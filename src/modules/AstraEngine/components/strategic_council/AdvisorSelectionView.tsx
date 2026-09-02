import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Persona, UserRole } from '../../types';
import { PERSONA_CONFIG, ROLE_CONFIG } from '../../constants';
import { Icon } from '../Icon';
import { useTranslations } from '../../contexts/LanguageContext';

interface AdvisorSelectionViewProps {
    userRole: UserRole;
    onNext: (selectedAdvisors: Persona[]) => void;
    onBack: () => void;
}

const AdvisorCard: React.FC<{
    persona: Persona;
    onSelect: () => void;
    isSelected: boolean;
    isDisabled: boolean;
}> = ({ persona, onSelect, isSelected, isDisabled }) => {
    const { t } = useTranslations();
    const config = PERSONA_CONFIG[persona];

    return (
        <motion.button
            onClick={onSelect}
            disabled={isDisabled && !isSelected}
            className={`group relative text-left p-4 bg-zinc-900 border-2 rounded-2xl overflow-hidden transition-all duration-300 w-full h-full flex flex-col
                ${isSelected ? 'border-blue-500 shadow-2xl shadow-blue-500/20' : 'border-zinc-700 hover:border-zinc-500'}
                ${isDisabled && !isSelected ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
            `}
            whileHover={{ y: isDisabled && !isSelected ? 0 : -5 }}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
        >
            <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-blue-500 border-blue-400' : 'border-zinc-600 group-hover:border-zinc-400'}`}>
                {isSelected && <Icon className="w-4 h-4 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>}
            </div>
            
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-zinc-800 border border-zinc-700 rounded-lg transition-colors ${isSelected ? 'border-blue-500/50' : ''}`}>
                     <Icon className="w-6 h-6 text-white">{config.icon}</Icon>
                </div>
                <h3 className="text-base font-bold text-white flex-1">{t(`personaName${persona}`)}</h3>
            </div>
            <p className="text-xs text-zinc-400 flex-grow">{t(`personaDescription${persona}`)}</p>
        </motion.button>
    );
};


export const AdvisorSelectionView: React.FC<AdvisorSelectionViewProps> = ({ userRole, onNext, onBack }) => {
    const { t } = useTranslations();
    const [selectedAdvisors, setSelectedAdvisors] = useState<Persona[]>([]);
    const maxAdvisors = 5;

    const availablePersonas = ROLE_CONFIG[userRole].availablePersonas;

    const handleSelect = (persona: Persona) => {
        setSelectedAdvisors(prev => {
            if (prev.includes(persona)) {
                return prev.filter(p => p !== persona);
            }
            if (prev.length < maxAdvisors) {
                return [...prev, persona];
            }
            return prev;
        });
    };
    
    const canProceed = selectedAdvisors.length >= 3 && selectedAdvisors.length <= maxAdvisors;


    return (
        <div className="flex-1 flex flex-col items-center p-8 bg-zinc-950 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-7xl text-center"
            >
                <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 absolute top-8 left-8">
                    <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></Icon>
                    {t('backButton')}
                </button>

                <h1 className="text-4xl font-bold text-white mb-2">{t('advisorSelectionTitle')}</h1>
                <p className="text-lg text-zinc-400 mb-8">{t('advisorSelectionSubtitle')}</p>
            
                <motion.div 
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.05 } },
                        hidden: {},
                    }}
                >
                    {availablePersonas.map(persona => (
                        <AdvisorCard 
                            key={persona} 
                            persona={persona} 
                            onSelect={() => handleSelect(persona)}
                            isSelected={selectedAdvisors.includes(persona)}
                            isDisabled={selectedAdvisors.length >= maxAdvisors}
                        />
                    ))}
                </motion.div>

                <div className="mt-8">
                     <motion.button
                        onClick={() => onNext(selectedAdvisors)}
                        disabled={!canProceed}
                        className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                        whileHover={canProceed ? { scale: 1.05 } : {}}
                        whileTap={canProceed ? { scale: 0.98 } : {}}
                    >
                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>
                        {t('initiateSessionButton')} ({selectedAdvisors.length})
                    </motion.button>
                </div>

            </motion.div>
        </div>
    );
};