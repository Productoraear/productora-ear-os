
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImpactNugget, KnowledgeCategory } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

const NuggetCard: React.FC<{ nugget: ImpactNugget }> = ({ nugget }) => {
    const { t } = useTranslations();
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 space-y-2"
        >
            <h4 className="font-bold text-blue-400">{nugget.title}</h4>
            <p className="text-sm text-zinc-300">{nugget.insight}</p>
            <span className="text-xs font-medium bg-zinc-700 text-zinc-400 px-2 py-1 rounded">
                {t(`category_${nugget.category}`) || nugget.category}
            </span>
        </motion.div>
    );
};

interface WisdomVaultModalProps {
    isOpen: boolean;
    onClose: () => void;
    nuggets: ImpactNugget[];
    onAddNugget: (nugget: ImpactNugget) => void;
}

export const WisdomVaultModal: React.FC<WisdomVaultModalProps> = ({ isOpen, onClose, nuggets, onAddNugget }) => {
    const { t } = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'ALL'>('ALL');
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newInsight, setNewInsight] = useState('');
    const [newCategory, setNewCategory] = useState<KnowledgeCategory>(KnowledgeCategory.FOUNDATIONS);

    const categories = useMemo(() => [
        'ALL', ...Object.values(KnowledgeCategory)
    ], []);

    const filteredNuggets = useMemo(() => {
        return nuggets.filter(nugget => {
            const matchesCategory = selectedCategory === 'ALL' || nugget.category === selectedCategory;
            const matchesSearch = nugget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                nugget.insight.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        }).reverse(); // Show newest first
    }, [nuggets, searchTerm, selectedCategory]);

    const handleSaveNew = () => {
        if (!newTitle.trim() || !newInsight.trim()) return;
        
        onAddNugget({
            title: newTitle,
            insight: newInsight,
            category: newCategory
        });

        // Reset and close form
        setNewTitle('');
        setNewInsight('');
        setNewCategory(KnowledgeCategory.FOUNDATIONS);
        setIsAdding(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[80vh] flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-6 border-b border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Icon className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></Icon>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{t('wisdomVaultTitle')}</h2>
                                        <p className="text-sm text-zinc-400">{t('wisdomVaultSubtitle')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsAdding(!isAdding)}
                                        className={`p-2 rounded-full transition-colors ${isAdding ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                                        title="Añadir Manualmente"
                                    >
                                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                                    </button>
                                    <button onClick={onClose} className="p-2 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                    </button>
                                </div>
                            </div>
                            
                            {!isAdding && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t('knowledgeExplorerSearchPlaceholder')}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                                </div>
                            )}
                        </header>

                        <div className="flex flex-1 overflow-hidden">
                            {!isAdding && (
                                <nav className="w-48 border-r border-white/10 p-4 overflow-y-auto hidden md:block">
                                    <ul className="space-y-1">
                                        {categories.map(category => (
                                            <li key={category}>
                                                <button
                                                    onClick={() => setSelectedCategory(category as KnowledgeCategory | 'ALL')}
                                                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === category ? 'bg-blue-500/10 text-blue-300' : 'text-zinc-400 hover:bg-zinc-800/50'}`}
                                                >
                                                    {category === 'ALL' ? t('knowledgeExplorerAllCategories') : t(`category_${category}`) || category}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}
                            
                            <main className="flex-1 p-6 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {isAdding ? (
                                        <motion.div 
                                            key="add-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700 max-w-lg mx-auto"
                                        >
                                            <h3 className="text-lg font-bold text-white mb-4">Nuevo Conocimiento</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Título</label>
                                                    <input 
                                                        type="text" 
                                                        value={newTitle}
                                                        onChange={(e) => setNewTitle(e.target.value)}
                                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                                                        placeholder="Ej: Regla del 80/20"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Categoría</label>
                                                    <select 
                                                        value={newCategory}
                                                        onChange={(e) => setNewCategory(e.target.value as KnowledgeCategory)}
                                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {Object.values(KnowledgeCategory).map(cat => (
                                                            <option key={cat} value={cat}>{t(`category_${cat}`) || cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Aprendizaje / Insight</label>
                                                    <textarea 
                                                        value={newInsight}
                                                        onChange={(e) => setNewInsight(e.target.value)}
                                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                                        placeholder="Escribe aquí el aprendizaje clave..."
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-3 pt-4">
                                                    <button 
                                                        onClick={() => setIsAdding(false)}
                                                        className="px-4 py-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button 
                                                        onClick={handleSaveNew}
                                                        disabled={!newTitle.trim() || !newInsight.trim()}
                                                        className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors"
                                                    >
                                                        Guardar en Bóveda
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div key="list" className="h-full">
                                            {filteredNuggets.length > 0 ? (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    <AnimatePresence>
                                                        {filteredNuggets.map((nugget, i) => <NuggetCard key={i} nugget={nugget} />)}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <div className="text-center text-zinc-500 h-full flex flex-col items-center justify-center">
                                                    <Icon className="w-16 h-16 mb-4 opacity-20"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></Icon>
                                                    <p>{t('wisdomVaultEmpty')}</p>
                                                    <button 
                                                        onClick={() => setIsAdding(true)}
                                                        className="mt-4 text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        Crear primer nugget
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </AnimatePresence>
                            </main>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
