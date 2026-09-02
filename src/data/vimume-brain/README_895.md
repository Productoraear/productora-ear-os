import React, { useState, useMemo } from 'react';
import { Search, X, ChevronRight, Zap, Briefcase, Heart, Speaker, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    path: string;
    category: 'Infraestructura' | 'Talento' | 'Social' | 'Empresarial' | 'Arsenal';
    icon: any;
}

const SEARCH_DATABASE: SearchResult[] = [
    { id: '1', title: 'Producción Audiovisual', description: 'Cine, videoclips y cobertura corporativa de alta gama.', path: '/produccion-audiovisual-cinematica', category: 'Infraestructura', icon: Zap },
    { id: '2', title: 'Protocolo de Ceremonia', description: 'Ingeniería sonora para momentos críticos.', path: '/protocolo-musical-ceremonia', category: 'Infraestructura', icon: Box },
    { id: '3', title: 'Sistemas DJ Hybrid', description: 'Performance avanzado que combina lo analógico y lo digital.', path: '/sistemas-dj-performance-hybrid', category: 'Talento', icon: Speaker },
    { id: '4', title: 'Viaje Musical', description: 'Impacto social y musicoterapia clínica.', path: '/social', category: 'Social', icon: Heart },
    { id: '5', title: 'División Empresarial', description: 'Consultoría estratégica para CEOs y marcas.', path: '/empresarios', category: 'Empresarial', icon: Briefcase },
    { id: '6', title: 'Arsenal Técnico', description: 'Listado completo de infraestructura táctica.', path: '/arsenal', category: 'Arsenal', icon: Box },
    { id: '7', title: 'The Signal', description: 'Portal de acceso y filtro para nuevos talentos.', path: '/the-signal', category: 'Talento', icon: Zap },
    { id: '8', title: 'Profesor IA', description: 'Mentoria personalizada y generación de rutas de formación.', path: '/profesor-ia', category: 'Empresarial', icon: Zap },
];

export const SearchModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');

    const results = useMemo(() => {
        if (!query.trim()) return [];
        const q = query.toLowerCase();
        return SEARCH_DATABASE.filter(item =>
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        );
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Search Input Area */}
                        <div className="p-6 border-b border-white/10 flex items-center gap-4">
                            <Search className="text-ear-gold" size={24} />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Buscar en la Infraestructura EAR..."
                                aria-label="Buscar en la Infraestructura EAR"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white font-display text-xl outline-none placeholder:text-gray-600 italic"
                            />
                            <button onCl