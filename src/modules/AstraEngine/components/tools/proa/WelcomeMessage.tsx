import React from 'react';
import { useTranslations } from '../../../contexts/LanguageContext';
import { ProaLogo } from './icons';

export const WelcomeMessage: React.FC = () => {
    const { t } = useTranslations();
    return (
        <div className="text-center p-8 bg-zinc-900/40 border border-zinc-800 rounded-xl">
            <ProaLogo className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('proa_welcome_title')}</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
                {t('proa_welcome_desc')}
            </p>
            <div className="text-left max-w-md mx-auto space-y-2 text-zinc-300">
                <p><strong>{t('proa_welcome_list_title')}:</strong></p>
                <ul className="list-disc list-inside text-zinc-400">
                    <li>{t('proa_welcome_list_item_1')}</li>
                    <li>{t('proa_welcome_list_item_2')}</li>
                    <li>{t('proa_welcome_list_item_3')}</li>
                    <li>{t('proa_welcome_list_item_4')}</li>
                    <li>{t('proa_welcome_list_item_5')}</li>
                </ul>
            </div>
        </div>
    );
};