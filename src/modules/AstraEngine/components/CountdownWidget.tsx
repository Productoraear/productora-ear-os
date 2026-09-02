
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Icon } from './Icon';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export const CountdownWidget: React.FC = () => {
    const { t } = useTranslations();
    const [targetDate, setTargetDate] = useLocalStorage<string>('astra-countdown-date', '');
    const [targetLabel, setTargetLabel] = useLocalStorage<string>('astra-countdown-label', '');
    const [isConfiguring, setIsConfiguring] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Calculate time left
    useEffect(() => {
        if (!targetDate) return;

        const calculateTime = () => {
            const difference = +new Date(targetDate) - +new Date();
            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const handleSave = () => {
        setIsConfiguring(false);
    };

    if (isConfiguring || !targetDate) {
        return (
            <div className="flex flex-col gap-3 p-2 h-full justify-center">
                <input
                    type="text"
                    value={targetLabel}
                    onChange={(e) => setTargetLabel(e.target.value)}
                    placeholder={t('countdown_target_label')}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
                <button 
                    onClick={handleSave}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded transition-colors"
                >
                    {t('countdown_save')}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-between relative group">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-xs text-zinc-500 font-bold tracking-wider uppercase mb-1">{t('countdown_title')}</p>
                    <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{targetLabel || 'Mission Target'}</h3>
                </div>
                <button 
                    onClick={() => setIsConfiguring(true)}
                    className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></Icon>
                </button>
            </div>

            <div className="flex justify-between items-end mt-4">
                <div className="text-center">
                    <span className="block text-3xl font-mono font-bold text-white leading-none">{timeLeft.days}</span>
                    <span className="text-[10px] text-zinc-500 font-bold">{t('countdown_days')}</span>
                </div>
                <span className="text-xl text-zinc-700 mb-2">:</span>
                <div className="text-center">
                    <span className="block text-3xl font-mono font-bold text-white leading-none">{timeLeft.hours}</span>
                    <span className="text-[10px] text-zinc-500 font-bold">{t('countdown_hours')}</span>
                </div>
                <span className="text-xl text-zinc-700 mb-2">:</span>
                <div className="text-center">
                    <span className="block text-3xl font-mono font-bold text-white leading-none">{timeLeft.minutes}</span>
                    <span className="text-[10px] text-zinc-500 font-bold">{t('countdown_minutes')}</span>
                </div>
            </div>
        </div>
    );
};
