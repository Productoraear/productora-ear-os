
// FIX: Implemented the DeliberationView component to replace the placeholder content.
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Added PersonaAnalysis to imports to resolve TypeScript error.
import { Persona, DeliberationChunk, AnalysisParameters, AllAnalysisResults, GroundingSource, PersonaAnalysis, UserRole } from '../../types';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { PERSONA_CONFIG } from '../../constants';
import { generateAnalysis, generateFollowUp, generateNextStepSuggestions } from '../../services/geminiService';
import { PizarraDeDatos } from './PizarraDeDatos';

interface DeliberationViewProps {
    dilemma: string;
    context: string;
    advisors: Persona[];
    onComplete: (results: AllAnalysisResults) => void;
    userRole: UserRole;
}

const MessageBubble: React.FC<{ chunk: DeliberationChunk, onFollowUp: (prompt: string, persona: Persona) => void }> = ({ chunk, onFollowUp }) => {
    const { t } = useTranslations();
    const personaConfig = chunk.persona ? PERSONA_CONFIG[chunk.persona] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className={`w-full flex my-4 ${chunk.type === 'moderator' ? 'justify-center' : ''}`}
        >
            <div className={`flex items-start gap-3 max-w-3xl ${chunk.type === 'moderator' ? 'text-center' : ''}`}>
                {personaConfig && (
                    <div className="flex-shrink-0 w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
                        <Icon className="w-6 h-6 text-white">{personaConfig.icon}</Icon>
                    </div>
                )}
                <div className="flex-1">
                    {chunk.persona && <p className="font-bold text-white">{t(`personaName${chunk.persona}`)}</p>}
                    <div className={`p-4 rounded-lg ${chunk.type === 'moderator' ? 'bg-transparent' : 'bg-zinc-800'}`}>
                        <p className="text-zinc-300 whitespace-pre-wrap">{chunk.message}</p>
                    </div>
                    <div className="mt-2 pl-2 space-y-2">
                        {chunk.isGeneratingSuggestions && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-zinc-400 italic">
                                <Icon className="w-4 h-4 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                {t('deliberation_suggesting_steps')}
                            </motion.div>
                        )}
                        <AnimatePresence>
                            {chunk.suggestions?.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => onFollowUp(suggestion, chunk.persona!)}
                                    className="text-left text-sm text-blue-400 hover:text-blue-300 bg-blue-900/20 hover:bg-blue-900/40 p-2 rounded-md border border-blue-500/20 w-full"
                                >
                                    {suggestion}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


export const DeliberationView: React.FC<DeliberationViewProps> = ({ dilemma, context, advisors, onComplete, userRole }) => {
    const { t, language } = useTranslations();
    const [chunks, setChunks] = useState<DeliberationChunk[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [allResults, setAllResults] = useState<AllAnalysisResults>({});
    const scrollRef = useRef<HTMLDivElement>(null);

    const allSources = Object.values(allResults)
        .flatMap(res => (res as PersonaAnalysis)?.sources || [])
        .filter((source, index, self) => 
            index === self.findIndex(s => s.web.uri === source.web.uri)
        )
        .map(s => ({ uri: s.web.uri, title: s.web.title || s.web.uri })); // Added fallback for title

    useEffect(() => {
        const runDeliberation = async () => {
            setChunks([{ type: 'moderator', message: t('deliberation_start').replace('{dilemma}', dilemma) }]);
            const results: AllAnalysisResults = {};

            for (const advisor of advisors) {
                await new Promise(res => setTimeout(res, 500));
                setChunks(prev => [...prev, { type: 'moderator', message: t('deliberation_turn').replace('{persona}', t(`personaName${advisor}`)) }]);
                await new Promise(res => setTimeout(res, 200));
                
                const analysis = await generateAnalysis({} as AnalysisParameters, advisor, language, dilemma, context, userRole);
                results[advisor] = analysis;
                setAllResults(prev => ({...prev, [advisor]: analysis}));
                
                const message = analysis.error ? `Error: ${analysis.error}` : analysis.analysisResult;
                const newChunk: DeliberationChunk = { type: 'persona', persona: advisor, message: message || "No analysis provided.", isGeneratingSuggestions: !analysis.error };
                const chunkId = Date.now(); // Temporary unique ID

                setChunks(prev => [...prev, {...newChunk, message: `${newChunk.message}::${chunkId}`}]); // Add unique ID

                if (!analysis.error) {
                    const suggestions = await generateNextStepSuggestions(message || '', language);
                    setChunks(prev => prev.map(c => 
                        c.message === `${newChunk.message}::${chunkId}` 
                        ? { ...c, message: newChunk.message, suggestions, isGeneratingSuggestions: false } 
                        : c
                    ));
                }
            }
            
            await new Promise(res => setTimeout(res, 1000));
            setChunks(prev => [...prev, { type: 'moderator', message: t('deliberation_end') }]);
            setIsLoading(false);
        };
        runDeliberation();
    }, [dilemma, context, advisors, t, language, userRole]);
    
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chunks]);

    const handleFollowUp = async (prompt: string, persona: Persona) => {
        setIsLoading(true);
        const contextMessageChunks = chunks.filter(c => c.persona === persona);
        const contextMessage = contextMessageChunks[contextMessageChunks.length - 1]?.message || '';

        const followUpMessage = await generateFollowUp(prompt, t(`personaName${persona}`), contextMessage, language);
        
        const newChunk: DeliberationChunk = { type: 'persona', persona: persona, message: `${prompt}\n\n${followUpMessage}`, isGeneratingSuggestions: true };
        const chunkId = Date.now();
        setChunks(prev => [...prev, {...newChunk, message: `${newChunk.message}::${chunkId}`}]);
        setIsLoading(false);
        
        const suggestions = await generateNextStepSuggestions(newChunk.message, language);
        setChunks(prev => prev.map(c => 
            c.message === `${newChunk.message}::${chunkId}` 
            ? { ...c, message: newChunk.message, suggestions, isGeneratingSuggestions: false } 
            : c
        ));
    };

    return (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-zinc-950 overflow-hidden">
            <main ref={scrollRef} className="lg:col-span-2 flex flex-col overflow-y-auto pr-4">
                {chunks.map((chunk, index) => (
                    <MessageBubble key={index} chunk={{...chunk, message: chunk.message.split('::')[0]}} onFollowUp={handleFollowUp} />
                ))}
                 {isLoading && <p className="text-center text-zinc-400 animate-pulse">{t('deliberation_thinking')}</p>}
                 {!isLoading && chunks.length > 0 && (
                     <div className="text-center my-8">
                        <button onClick={() => onComplete(allResults)} className="py-2 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                            {t('deliberation_synthesis_button')}
                        </button>
                    </div>
                 )}
            </main>
            <aside className="hidden lg:block">
                 <PizarraDeDatos facts={[]} sources={allSources} />
            </aside>
        </div>
    );
};