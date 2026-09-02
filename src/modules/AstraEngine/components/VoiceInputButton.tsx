import React from 'react';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';

interface VoiceInputButtonProps {
    isListening: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ isListening, onClick, disabled }) => {
    const { t } = useTranslations();
    
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={isListening ? t('stopDictation') : t('startDictation')}
            className={`p-1.5 rounded-full transition-all ${
                isListening 
                ? 'bg-red-500/20 text-red-400 ring-2 ring-red-500/50' 
                : 'text-zinc-400 hover:bg-zinc-700/70 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            <Icon className={`w-4 h-4 transition-transform duration-300 ${isListening ? 'scale-110' : 'scale-100'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m-6 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm2.25 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm13.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-2.25 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            </Icon>
        </button>
    );
};
