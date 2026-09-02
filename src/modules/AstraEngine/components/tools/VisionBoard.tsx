// FIX: Implemented the VisionBoard component to replace the placeholder content.
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { VisionCardData } from '../../types';
import { generateVisionBoardImage } from '../../services/geminiService';

const VisionCard: React.FC<{ card: VisionCardData }> = ({ card }) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="group relative aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700/80"
        >
            {card.isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Icon className="w-8 h-8 text-white animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                </div>
            )}
            {card.imageUrl && <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
                <h3 className="font-bold text-white text-lg">{card.title}</h3>
                <p className="text-xs text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">{card.prompt}</p>
            </div>
        </motion.div>
    );
};

export const VisionBoard: React.FC<{ onComplete: (visions: VisionCardData[]) => void; initialVisions: VisionCardData[] }> = ({ onComplete, initialVisions }) => {
    const { t } = useTranslations();
    const [visions, setVisions] = useState<VisionCardData[]>(initialVisions || []);
    const [newTitle, setNewTitle] = useState('');
    const [newPrompt, setNewPrompt] = useState('');
    
    const handleAddVision = async () => {
        if (!newTitle.trim() || !newPrompt.trim()) return;

        const newCard: VisionCardData = {
            id: `vision_${Date.now()}`,
            title: newTitle,
            prompt: newPrompt,
            isLoading: true,
        };

        setVisions(prev => [newCard, ...prev]);
        setNewTitle('');
        setNewPrompt('');

        try {
            const imageData = await generateVisionBoardImage(newPrompt);
            const imageUrl = `data:image/jpeg;base64,${imageData}`;

            setVisions(prev => prev.map(card => 
                card.id === newCard.id ? { ...card, imageUrl, isLoading: false } : card
            ));

        } catch (error) {
            console.error("Image generation failed:", error);
             setVisions(prev => prev.map(card => 
                card.id === newCard.id ? { ...card, isLoading: false, prompt: "Error generating image." } : card
            ));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950 text-white">
            <div className="max-w-7xl mx-auto">
                 <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_visionBoard_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 mb-6">{t('visionBoard_description')}</p>
                </motion.div>

                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 mb-8">
                    <h2 className="text-xl font-bold mb-4">{t('visionBoard_add_vision')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-4">
                             <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-2 block">{t('visionBoard_vision_title_label')}</label>
                                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder={t('visionBoard_vision_title_placeholder')} className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-md"/>
                            </div>
                             <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-2 block">{t('visionBoard_prompt_label')}</label>
                                <textarea value={newPrompt} onChange={e => setNewPrompt(e.target.value)} placeholder={t('visionBoard_prompt_placeholder')} className="w-full p-2.5 h-20 bg-zinc-800 border border-zinc-700 rounded-md resize-none"/>
                            </div>
                        </div>
                        <button onClick={handleAddVision} className="flex items-center justify-center gap-2 py-3 px-6 h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50">
                            {t('visionBoard_generate_button')}
                        </button>
                    </div>
                </div>

                {visions.length > 0 ? (
                    <div 
                        className="grid gap-4" 
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
                    >
                        <AnimatePresence>
                            {visions.map(card => <VisionCard key={card.id} card={card} />)}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-2xl">
                         <Icon className="w-16 h-16 mx-auto mb-4 text-zinc-700"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Z" /></Icon>
                         <p className="text-zinc-500 max-w-sm mx-auto">{t('visionBoard_no_visions')}</p>
                    </div>
                )}


                <div className="mt-8 text-center">
                    <button onClick={() => onComplete(visions)} className="py-3 px-8 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-colors">
                        {t('completeAndContinue')}
                    </button>
                </div>
            </div>
        </div>
    );
};