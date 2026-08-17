import React from 'react';

export const ToolLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4 animate-pulse">
        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm font-mono tracking-wider">
            CARGANDO MÓDULO ESTRATÉGICO...
        </p>
    </div>
);