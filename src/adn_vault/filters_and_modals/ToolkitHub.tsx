
// FIX: Implemented the ToolkitHub component to replace the placeholder content.
import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import { ToolCard } from './ToolCard';
import { ROLE_CONFIG } from '../constants';

interface ToolkitHubProps {
    userRole: UserRole;
    onLaunchTool: (toolId: string) => void;
}

export const ToolkitHub: React.FC<ToolkitHubProps> = ({ userRole, onLaunchTool }) => {
    const { t } = useTranslations();
    const availableTools = Object.entries(TOOL_REGISTRY).filter(([, tool]) => tool.roles.includes(userRole));

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-zinc-950">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-4xl font-bold text-white mb-2">{t('toolkitHub_title')}</h1>
                <p className="text-lg text-zinc-400 mb-10">{t('toolkitHub_subtitle').replace('{role}', t(`role_${userRole}`))}</p>
                
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: { transition: { staggerChildren: 0.05 } },
                        hidden: {},
                    }}
                >
                    {availableTools.map(([toolId, toolConfig], index) => (
                        <ToolCard 
                            key={toolId}
                            title={t(toolConfig.titleKey)}
                            description={t(toolConfig.descriptionKey)}
                            icon={toolConfig.icon}
                            onClick={() => onLaunchTool(toolId)}
                            index={index}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};
