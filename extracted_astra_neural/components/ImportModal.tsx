
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, XMarkIcon, UploadIcon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: any[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const { t } = useTranslations();
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState('');

    const processData = () => {
        if (!inputText.trim()) return;

        try {
            // Simple CSV/TSV parser
            const lines = inputText.trim().split('\n');
            if (lines.length < 2) throw new Error("No data found");

            const headers = lines[0].split(/[\t,;]+/).map(h => h.trim().toLowerCase());
            const data = [];

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(/[\t,;]+/);
                if (values.length === headers.length) {
                    const row: any = {};
                    headers.forEach((header, index) => {
                        let key = header;
                        // Map common names to internal keys if needed, or keep raw
                        if (header.includes('nombre') || header.includes('name')) key = 'nombre';
                        if (header.includes('mail') || header.includes('correo')) key = 'email';
                        if (header.includes('tel') || header.includes('phone')) key = 'telefono';
                        
                        row[key] = values[index].trim();
                    });
                    
                    // Simple validation: Needs at least a name or email
                    if (row.nombre || row.email) {
                        // Generate ID if missing
                        if (!row.id) row.id = `import_${Date.now()}_${i}`;
                        data.push(row);
                    }
                }
            }

            if (data.length > 0) {
                onImport(data);
                onClose();
                setInputText('');
                setError('');
            } else {
                setError(t('importer_error'));
            }

        } catch (e) {
            console.error(e);
            setError(t('importer_error'));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b border-white/10">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Icon className="w-5 h-5 text-blue-400">{UploadIcon}</Icon>
                                {t('importer_modal_title')}
                            </h3>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white">
                                <Icon className="w-5 h-5">{XMarkIcon}</Icon>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <p className="text-sm text-zinc-400 mb-4">{t('importer_instructions')}</p>
                            
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t('importer_placeholder')}
                                className="w-full h-40 bg-black/30 border border-zinc-700 rounded-lg p-3 text-xs font-mono text-zinc-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none whitespace-pre"
                            />
                            
                            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                            
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={processData}
                                    disabled={!inputText.trim()}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {t('importer_process')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
