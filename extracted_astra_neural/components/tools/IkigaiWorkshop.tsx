
// FIX: Implemented the IkigaiWorkshop component to replace the placeholder content.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateIkigaiResponse } from '../../services/geminiService';
import { IkigaiInputs, UserRole } from '../../types';
import { Icon } from '../Icon';
import { EnhancedTextarea } from '../EnhancedTextarea';
import { IkigaiResultModal } from './IkigaiResultModal';
import { IkigaiQuestionHelper } from './IkigaiQuestionHelper';

interface IkigaiWorkshopProps {
  onComplete: () => void;
  userRole: UserRole; // Added Prop
}

const InputSection: React.FC<{
    title: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder: string;
    helperTitle: string;
    helperText: string;
}> = ({ title, value, onChange, placeholder, helperTitle, helperText }) => (
    <div>
        <label className="flex items-center gap-2 text-lg font-semibold text-zinc-200 mb-2">
            {title}
            <IkigaiQuestionHelper title={helperTitle} questions={helperText} />
        </label>
        <EnhancedTextarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-3 h-32 bg-zinc-900 border border-zinc-700 rounded-md focus:ring-2 focus:ring-blue-500 transition-colors placeholder-zinc-500 resize-none text-base"
        />
    </div>
);

export const IkigaiWorkshop: React.FC<IkigaiWorkshopProps> = ({ onComplete, userRole }) => {
    const { t, language } = useTranslations();
    const [inputs, setInputs] = useState<IkigaiInputs>({
        loves: '',
        goodAt: '',
        worldNeeds: '',
        paidFor: '',
        introspection: {
            milestones: '',
            balance: ''
        }
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    const [isGenerated, setIsGenerated] = useState(false);

    const handleInputChange = (field: keyof Omit<IkigaiInputs, 'introspection'>, value: string) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };
    
    const handleIntrospectionChange = (field: keyof IkigaiInputs['introspection'], value: string) => {
        setInputs(prev => ({ ...prev, introspection: { ...prev.introspection, [field]: value } }));
    };

    const canGenerate = inputs.loves.trim() && inputs.goodAt.trim() && inputs.worldNeeds.trim() && inputs.paidFor.trim() && 
                      inputs.introspection.milestones.trim() && inputs.introspection.balance.trim();

    const handleGenerate = async () => {
        if (!canGenerate) return;
        setIsLoading(true);
        setResult('');
        setError('');
        setIsGenerated(false);
        try {
            const ikigaiResult = await generateIkigaiResponse(inputs, language, userRole);
            setResult(ikigaiResult);
            setIsModalOpen(true);
            setIsGenerated(true);
        } catch (e) {
            console.error("Ikigai generation error:", e);
            setError(t('errorUnknown'));
        } finally {
            setIsLoading(false);
        }
    };

    // Role-specific coaching hints
    const getRoleSpecificHint = () => {
        switch(userRole) {
            case UserRole.ARTIST:
                return t('ikigai_hint_artist');
            case UserRole.MANAGER:
                return t('ikigai_hint_manager');
            case UserRole.ENTREPRENEUR:
                return t('ikigai_hint_entrepreneur');
            default:
                return t('ikigai_hint_default');
        }
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_ikigaiWorkshop_title')}</h1>
                    <p className="text-base md:text-lg text-zinc-400 mb-8">{t('tool_ikigaiWorkshop_description')}</p>
                    
                    <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-8 flex items-start gap-3">
                        <Icon className="w-6 h-6 text-blue-400 mt-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></Icon>
                        <p className="text-blue-200 text-sm italic">{getRoleSpecificHint()}</p>
                    </div>
                </motion.div>
                
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputSection 
                            title={t('ikigai_loves_title')}
                            value={inputs.loves}
                            onChange={(e) => handleInputChange('loves', e.target.value)}
                            placeholder={t('ikigai_loves_placeholder')}
                            helperTitle={t('ikigai_loves_helper_title')}
                            helperText={t('ikigai_loves_helper_text')}
                        />
                         <InputSection 
                            title={t('ikigai_goodAt_title')}
                            value={inputs.goodAt}
                            onChange={(e) => handleInputChange('goodAt', e.target.value)}
                            placeholder={t('ikigai_goodAt_placeholder')}
                            helperTitle={t('ikigai_goodAt_helper_title')}
                            helperText={t('ikigai_goodAt_helper_text')}
                        />
                         <InputSection 
                            title={t('ikigai_worldNeeds_title')}
                            value={inputs.worldNeeds}
                            onChange={(e) => handleInputChange('worldNeeds', e.target.value)}
                            placeholder={t('ikigai_worldNeeds_placeholder')}
                            helperTitle={t('ikigai_worldNeeds_helper_title')}
                            helperText={t('ikigai_worldNeeds_helper_text')}
                        />
                         <InputSection 
                            title={t('ikigai_paidFor_title')}
                            value={inputs.paidFor}
                            onChange={(e) => handleInputChange('paidFor', e.target.value)}
                            placeholder={t('ikigai_paidFor_placeholder')}
                            helperTitle={t('ikigai_paidFor_helper_title')}
                            helperText={t('ikigai_paidFor_helper_text')}
                        />
                    </div>
                     <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
                        <h3 className="text-xl font-bold text-white">{t('ikigai_introspection_title')}</h3>
                         <InputSection 
                            title={t('ikigai_introspection_milestones_title')}
                            value={inputs.introspection.milestones}
                            onChange={(e) => handleIntrospectionChange('milestones', e.target.value)}
                            placeholder={t('ikigai_introspection_milestones_placeholder')}
                            helperTitle={t('ikigai_introspection_milestones_helper_title')}
                            helperText={t('ikigai_introspection_milestones_helper_text')}
                        />
                        <InputSection 
                            title={t('ikigai_introspection_balance_title')}
                            value={inputs.introspection.balance}
                            onChange={(e) => handleIntrospectionChange('balance', e.target.value)}
                            placeholder={t('ikigai_introspection_balance_placeholder')}
                            helperTitle={t('ikigai_introspection_balance_helper_title')}
                            helperText={t('ikigai_introspection_balance_helper_text')}
                        />
                    </div>
                </div>

                <div className="text-center mt-8">
                    {!isGenerated ? (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !canGenerate}
                            className="flex items-center justify-center gap-3 py-3 px-8 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 focus:scale-105 disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60"
                        >
                            {isLoading ? (
                                <>
                                    <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                    {t('ikigai_generating')}
                                </>
                            ) : t('ikigai_generate_button')}
                        </button>
                    ) : (
                         <button 
                            onClick={onComplete}
                            className="py-3 px-8 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors"
                        >
                            {t('completeAndContinue')}
                        </button>
                    )}
                </div>
                {error && <p className="text-red-400 text-center mt-4">{error}</p>}

                <IkigaiResultModal 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    result={result}
                />
            </div>
        </div>
    );
};
