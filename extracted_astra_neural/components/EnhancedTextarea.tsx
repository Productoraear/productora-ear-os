import React, { useState } from 'react';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { enhanceTextWithAI } from '../services/geminiService';
import { AIEnhancerModal } from './AIEnhancerModal';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { VoiceInputButton } from './VoiceInputButton';

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    // No additional props needed for now, will pass through standard textarea props
}

export const EnhancedTextarea: React.FC<EnhancedTextareaProps> = (props) => {
    const { t, language } = useTranslations();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [originalText, setOriginalText] = useState('');
    const [enhancedText, setEnhancedText] = useState('');
    
    const valueAsString = props.value as string || '';

    const handleTranscript = (transcript: string) => {
         if (props.onChange) {
            const newValue = valueAsString + (valueAsString.endsWith(' ') || valueAsString === '' ? '' : ' ') + transcript;
            const event = {
                target: { ... (props as any).target, value: newValue }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            props.onChange(event);
        }
    };
    
    const { isListening, toggleListening, hasSupport } = useSpeechRecognition(handleTranscript, language);

    const handleEnhanceClick = async () => {
        if (!valueAsString || isEnhancing) return;

        setOriginalText(valueAsString);
        setIsEnhancing(true);
        setIsModalOpen(true);

        try {
            const result = await enhanceTextWithAI(valueAsString, language);
            setEnhancedText(result);
        } catch (e) {
            console.error("Enhancement error:", e);
            setEnhancedText(t('errorUnknown'));
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleAccept = () => {
        if (props.onChange) {
            // Create a synthetic event to match the expected signature of onChange
            const event = {
                target: { ... (props as any).target, value: enhancedText }
            } as React.ChangeEvent<HTMLTextAreaElement>;
            props.onChange(event);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="relative w-full">
            <textarea {...props} />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
                {hasSupport && (
                    <VoiceInputButton isListening={isListening} onClick={toggleListening} disabled={isEnhancing} />
                )}
                <button
                    type="button"
                    onClick={handleEnhanceClick}
                    disabled={!valueAsString || isEnhancing}
                    title={t('enhanceWithAI')}
                    className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800/50 text-zinc-300 text-xs font-semibold rounded-md border border-zinc-700 hover:bg-zinc-700/70 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isEnhancing ? (
                        <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('enhancingText')}
                        </>
                    ) : (
                        <>
                            <Icon className="w-4 h-4 text-blue-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>
                            <span className="hidden sm:inline">{t('enhanceWithAI')}</span>
                        </>
                    )}
                </button>
            </div>
            <AIEnhancerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccept={handleAccept}
                originalText={originalText}
                enhancedText={enhancedText}
                isLoading={isEnhancing}
            />
        </div>
    );
};