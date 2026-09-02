
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateBudgetPrediction } from '../../services/geminiService';
import { BudgetPredictionResult } from '../../types';
import { Icon } from '../Icon';
import { EnhancedTextarea } from '../EnhancedTextarea';

interface BudgetPredictorProps {
    onComplete: () => void;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];

export const BudgetPredictor: React.FC<BudgetPredictorProps> = ({ onComplete }) => {
    const { t, language } = useTranslations();
    const [amount, setAmount] = useState<string>('');
    const [projectType, setProjectType] = useState<string>('budget_type_wedding');
    const [priorities, setPriorities] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<BudgetPredictionResult | null>(null);

    const handleCalculate = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;

        setIsLoading(true);
        try {
            const prediction = await generateBudgetPrediction(
                numAmount, 
                t(projectType), 
                priorities, 
                language
            );
            setResult(prediction);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center p-4 md:p-8 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-6xl">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('tool_budgetPredictor_title')}</h1>
                    <p className="text-zinc-400">{t('tool_budgetPredictor_description')}</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('budget_amount_label')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">â‚¬</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        className="w-full pl-8 p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('budget_type_label')}</label>
                                <select 
                                    value={projectType} 
                                    onChange={(e) => setProjectType(e.target.value)}
                                    className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white"
                                >
                                    <option value="budget_type_wedding">{t('budget_type_wedding')}</option>
                                    <option value="budget_type_tour">{t('budget_type_tour')}</option>
                                    <option value="budget_type_album">{t('budget_type_album')}</option>
                                    <option value="budget_type_marketing">{t('budget_type_marketing')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-300 mb-2">{t('budget_priorities_label')}</label>
                                <EnhancedTextarea 
                                    value={priorities} 
                                    onChange={(e) => setPriorities(e.target.value)} 
                                    placeholder={t('budget_priorities_placeholder')}
                                    className="w-full p-3 h-32 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 text-white resize-none"
                                />
                            </div>

                            <button
                                onClick={handleCalculate}
                                disabled={isLoading || !amount}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Icon className="w-5 h-5 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon>
                                        {t('budget_generating')}
                                    </>
                                ) : (
                                    <>
                                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.231 0-3.058a2.98 2.98 0 0 1 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003.659" /></Icon>
                                        {t('budget_generate_button')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                        {result ? (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Strategic Insight Card */}
                                <div className={`p-6 rounded-xl border ${result.viabilityScore > 75 ? 'bg-green-900/10 border-green-500/30' : result.viabilityScore > 50 ? 'bg-yellow-900/10 border-yellow-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5-.5 1.5m0 0 .5 1.5m-1.5-.5-1.5-1.5m-6-3h12" /></Icon>
                                            {t('budget_insight_title')}
                                        </h3>
                                        <div className="text-right">
                                            <span className="text-xs text-zinc-400 uppercase tracking-wider">{t('budget_viability')}</span>
                                            <div className="text-2xl font-bold text-white">{result.viabilityScore}/100</div>
                                        </div>
                                    </div>
                                    <p className="text-zinc-300 text-sm leading-relaxed">{result.strategicInsight}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Chart */}
                                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 min-h-[300px]">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={result.categories}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="amount"
                                                >
                                                    {result.categories.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip 
                                                    formatter={(value: any) => `â‚¬${value.toLocaleString()}`}
                                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff' }}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Line Items */}
                                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4 max-h-[350px] overflow-y-auto">
                                        <h3 className="font-bold text-white mb-4">{t('budget_results_title')}</h3>
                                        {result.categories.map((cat, idx) => (
                                            <div key={idx} className="group">
                                                <div className="flex justify-between items-center text-sm mb-1">
                                                    <span className="text-white font-medium">{cat.name}</span>
                                                    <span className="text-zinc-400">â‚¬{cat.amount.toLocaleString()} ({cat.percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-zinc-800 rounded-full h-1.5 mb-1">
                                                    <div 
                                                        className="h-1.5 rounded-full" 
                                                        style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                                                    />
                                                </div>
                                                <p className="text-xs text-zinc-500 truncate group-hover:whitespace-normal group-hover:text-zinc-300 transition-colors">
                                                    {cat.rationale}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="text-center pt-4">
                                    <button onClick={onComplete} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold transition-colors">
                                        {t('completeAndContinue')}
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-2xl p-12">
                                <Icon className="w-16 h-16 mb-4 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" /></Icon>
                                <p>{t('budget_placeholder_desc_full')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
