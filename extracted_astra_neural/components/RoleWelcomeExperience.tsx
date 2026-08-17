import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';
import { roleExperienceData } from '../data/roleExperienceData';
import { TOOL_REGISTRY } from '../utils/toolRegistry';

interface RoleWelcomeExperienceProps {
    userRole: UserRole;
    onNavigateToHub: () => void;
    onNavigateToTool: (toolId: string) => void;
}

const FeaturedToolCard: React.FC<{ toolId: string; onClick: () => void; }> = ({ toolId, onClick }) => {
    const { t } = useTranslations();
    const config = TOOL_REGISTRY[toolId];
    if (!config) return null;

    return (
        <button
            onClick={onClick}
            className="group relative text-left p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-blue-500/50"
        >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 flex-shrink-0">
                    <Icon className="w-6 h-6 text-zinc-300">{config.icon}</Icon>
                </div>
                <div>
                    <h4 className="font-bold text-white">{t(config.titleKey)}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{t(config.descriptionKey)}</p>
                </div>
            </div>
        </button>
    );
};


export const RoleWelcomeExperience: React.FC<RoleWelcomeExperienceProps> = ({ userRole, onNavigateToHub, onNavigateToTool }) => {
    const { t } = useTranslations();
    const experienceData = roleExperienceData[userRole];

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950 overflow-y-auto">
            <motion.div
                className="w-full max-w-3xl text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">
                        <Icon className="w-9 h-9 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20.25h4m-4 0v-4.5m4 4.5v-4.5m0 0h-4m4 0h4m-4 0v-4.5m4 4.5v-4.5m-4 0h-4m4 0v-4.5m0 0h-4" /></Icon>
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 tracking-tighter">
                    {t(experienceData.welcome_key)}
                </h1>
                <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">{t('welcome_artist_subtitle')}</p>

                <div className="mt-8">
                    <button
                        onClick={onNavigateToHub}
                        className="flex items-center justify-center gap-3 mx-auto py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
                    >
                        {t('start_journey_button')}
                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></Icon>
                    </button>
                </div>

                <div className="text-left mt-12">
                    <h3 className="font-semibold text-zinc-300 mb-4">{t('featured_tools_title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {experienceData.featured_tools.map(toolId => (
                            <FeaturedToolCard key={toolId} toolId={toolId} onClick={() => onNavigateToTool(toolId)} />
                        ))}
                    </div>
                </div>

                <div className="mt-10 p-4 bg-black/20 border border-zinc-800 rounded-lg">
                    <p className="text-sm text-zinc-400"><strong className="text-zinc-200">{t('did_you_know_title')}</strong> {t(experienceData.did_you_know_key)}</p>
                </div>

            </motion.div>
        </div>
    );
};