import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectStatus } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';

interface SaveSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, projectId: string | null) => void;
    projects: Project[];
    onAddProject: (project: Omit<Project, 'id'>) => Project;
    currentProblem: string;
}

export const SaveSessionModal: React.FC<SaveSessionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    projects,
    onAddProject,
    currentProblem
}) => {
    const { t } = useTranslations();
    const [title, setTitle] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [isCreatingProject, setIsCreatingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    useEffect(() => {
        if (isOpen) {
            const suggestedTitle = currentProblem.length > 50 ? currentProblem.substring(0, 47) + '...' : currentProblem;
            setTitle(suggestedTitle || `Analysis - ${new Date().toLocaleDateString()}`);
            setSelectedProjectId(null);
            setIsCreatingProject(false);
            setNewProjectName('');
        }
    }, [isOpen, currentProblem]);
    
    const handleSave = () => {
        onSave(title, selectedProjectId);
    };

    const handleCreateProject = () => {
        if (newProjectName.trim()) {
            const newProject = onAddProject({ name: newProjectName, description: '', status: ProjectStatus.IN_PROGRESS });
            setSelectedProjectId(newProject.id);
            setIsCreatingProject(false);
            setNewProjectName('');
        }
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
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex-shrink-0 p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">{t('saveSessionModalTitle')}</h2>
                            <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                            </button>
                        </header>
                        <main className="p-6 space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-2 block">{t('sessionTitleLabel')}</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-zinc-300 mb-2 block">{t('linkToProjectLabel')}</label>
                                {!isCreatingProject ? (
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedProjectId || ''}
                                            onChange={(e) => setSelectedProjectId(e.target.value || null)}
                                            className="w-full p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">{t('noProjectOption')}</option>
                                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                        <button onClick={() => setIsCreatingProject(true)} className="p-2 bg-white/10 rounded-md hover:bg-white/20">
                                            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newProjectName}
                                            onChange={(e) => setNewProjectName(e.target.value)}
                                            placeholder={t('projectNameLabel')}
                                            className="w-full p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button onClick={handleCreateProject} className="p-2 bg-blue-600 rounded-md hover:bg-blue-500">
                                            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                                        </button>
                                        <button onClick={() => setIsCreatingProject(false)} className="p-2 bg-white/10 rounded-md hover:bg-white/20">
                                             <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </main>
                        <footer className="p-4 bg-zinc-950/50 border-t border-white/10 flex justify-end gap-3">
                             <button onClick={onClose} className="px-5 py-2 text-sm font-semibold text-zinc-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                                {t('cancelButton')}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!title.trim()}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 disabled:bg-zinc-600 disabled:opacity-50"
                            >
                                {t('saveButton')}
                            </button>
                        </footer>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
