

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// FIX: Corrected import paths
import { KnowledgeNugget, KnowledgeCategory } from '../types';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface KnowledgeExplorerModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeBase: KnowledgeNugget[];
    onConfirmSelection: (selectedIds: string[]) => void;
    initiallySelectedIds: string[];
}

export const KnowledgeExplorerModal: React.FC<KnowledgeExplorerModalProps> = ({
    isOpen,
    onClose,
    knowledgeBase,
    onConfirmSelection,
    initiallySelectedIds,
}) => {
    const { t } = useTranslations();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory | 'ALL'>('ALL');
    const [selectedIds, setSelectedIds] = useState<string[]>(initiallySelectedIds);

    const filteredKnowledge = useMemo(() => {
        return knowledgeBase.filter(nugget => {
            const matchesCategory = selectedCategory === 'ALL' || nugget.category === selectedCategory;
            const matchesSearch = nugget.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
                t(`nugget_${nugget.id}_title`).toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [knowledgeBase, searchTerm, selectedCategory, t]);

    const handleToggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        onConfirmSelection(selectedIds);
        onClose();
    };
    
    const categories = useMemo(() => [
        'ALL', ...Object.values(KnowledgeCategory)
    ], []);

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
                                    <Icon className="w-8 h-8 text-blue-500"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></Icon>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{t('knowledgeExplorerTitle')}</h2>
                                        <p className="text-sm text-zinc-400">{t('knowledgeExplorerSubtitle')}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                </button>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('knowledgeExplorerSearchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-zinc-500"
                                />
                                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </Icon>
                            </div>
                        </header>

                        <div className="flex flex-1 overflow-hidden">
                            <nav className="w-48 border-r border-white/10 p-4 overflow-y-auto">
                                <ul className="space-y-1">
                                    {categories.map(category => (
                                        <li key={category}>
                                            <button 
                                                onClick={() => setSelectedCategory(category as KnowledgeCategory | 'ALL')}
                                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedCategory === category ? 'bg-blue-500/10 text-blue-300' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                                            >
                                                {category === 'ALL' ? t('knowledgeExplorerAllCategories') : t(`category_${category}`)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                            <main className="flex-1 p-6 overflow-y-auto">
                                <AnimatePresence>
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.05 } },
                                            hidden: {},
                                        }}
                                    >
                                        {filteredKnowledge.map(nugget => (
                                            <motion.div 
                                                key={nugget.id}
                                                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 }}}
                                                layout
                                            >
                                                <div className={`p-4 rounded-lg h-full flex flex-col justify-between border transition-all duration-200 ${selectedIds.includes(nugget.id) ? 'bg-blue-600/10 border-blue-500/70' : 'bg-zinc-800/50 border-zinc-700/80 hover:border-zinc-600'}`}>
                                                    <div>
                                                        <h4 className="font-bold text-white">{t(`nugget_${nugget.id}_title`)}</h4>
                                                        <p className="text-xs text-zinc-400 mt-1 mb-3">{t(`nugget_${nugget.id}_desc`)}</p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleToggleSelection(nugget.id)}
                                                        className={`w-full mt-2 text-sm font-semibold py-1.5 rounded-md transition-colors ${selectedIds.includes(nugget.id) ? 'bg-blue-500 text-white' : 'bg-zinc-700/80 hover:bg-zinc-700 text-zinc-200'}`}
                                                    >
                                                        {selectedIds.includes(nugget.id) ? t('knowledgeExplorer_added') : t('knowledgeExplorerAddButton')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </main>
                        </div>

                        <footer className="p-4 border-t border-white/10 flex-shrink-0 flex justify-end">
                            <button
                                onClick={handleConfirm}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                {t('knowledgeExplorer_confirm').replace('{count}', selectedIds.length)}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};