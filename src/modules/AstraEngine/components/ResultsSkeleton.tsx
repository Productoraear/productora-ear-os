import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="h-6 w-3/4 bg-zinc-800 rounded-md animate-pulse"></div>
        <div className="space-y-2">
            <div className="h-4 w-full bg-zinc-800 rounded-md animate-pulse"></div>
            <div className="h-4 w-5/6 bg-zinc-800 rounded-md animate-pulse"></div>
            <div className="h-4 w-full bg-zinc-800 rounded-md animate-pulse"></div>
        </div>
        <div className="h-40 w-full bg-zinc-800/50 rounded-xl animate-pulse"></div>
        <div className="space-y-4">
            <div className="h-20 w-full bg-zinc-800 rounded-xl animate-pulse"></div>
            <div className="h-20 w-full bg-zinc-800 rounded-xl animate-pulse"></div>
        </div>
    </div>
);


export const ResultsSkeleton: React.FC<{ personaCount: number }> = ({ personaCount }) => {
    
     const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-zinc-900">
             <div className="mb-8">
                <div className="h-8 w-1/2 bg-zinc-800 rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-zinc-800 rounded-md animate-pulse mt-3"></div>
             </div>
             <motion.div 
                className="grid gap-8"
                style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 450px), 1fr))`}}
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: {},
                }}
            >
                {Array.from({ length: personaCount }).map((_, index) => (
                    <motion.div key={index} variants={cardVariants}>
                        <SkeletonCard />
                    </motion.div>
                ))}
            </motion.div>
        </main>
    );
};