
// FIX: Implemented the ToolCard component to replace the placeholder content.
import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from './Icon';

interface ToolCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    index: number;
}

export const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, onClick, index }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: index * 0.05 } }
    };

    return (
        <motion.button
            onClick={onClick}
            className="group relative text-left p-6 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-blue-500/50 h-full flex flex-col"
            variants={cardVariants}
            whileHover={{ y: -5 }}
        >
            <div className="mb-4 w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-700/50 transition-colors">
                <Icon className="w-7 h-7 text-white">{icon}</Icon>
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-zinc-400 mt-1 flex-grow">{description}</p>
            <div className="mt-4 text-sm font-semibold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Launch Tool
                <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></Icon>
            </div>
        </motion.button>
    );
};
