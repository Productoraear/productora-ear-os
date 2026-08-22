import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { generateDiscProfileAnalysis, generateProfileQuestions } from '../../services/geminiService';
import { Icon } from '../Icon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PsychometricQuestion } from '../../types';

interface StrategicProfileLabProps {
  onComplete: (analysis: string) => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const progress = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="w-full bg-zinc-700/50 rounded-full h-2.5 mb-6">
            <motion.div
                className="bg-gradient-to-r from-blue-500 to-fuchsia-500 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
};

export const StrategicProfileLab: React.FC<StrategicProfileLabProps> = ({ onComplete }) => {
    const { t, language } = useTranslations();
    
    const [answers, setAnswers] = useLocalStorage<{ [key: number]: string }>('astra_profile_answers', {});
    const [step, setStep] = useLocalStorage<'intro' | 'generating' | 'questions' | 'loading' | 'results'>('astra_profile_step', 'intro');
    const [result, setResult] = useLocalStorage<string>('astra_profile_result', '');
    const [questions, setQuestions] = useLocalStorage<PsychometricQuestion[]>('astra_profile_questions', []);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const answeredCount = Object.keys(answers).length;
        if (questions.length > 0) {
            if (answeredCount < questions.length) {
                setCurrentQuestionIndex(answeredCount);
            } else {
                setCurrentQuestionIndex(questions.length - 1);
            }
        }
    }, [answers, questions.length]);

    const startTest = async () => {
        setStep('generating');
        setError('');
        
        if (questions.length > 0 && Object.keys(answers).length > 0) {
             setStep('questions');
             return;
        }

        try {
            // Increased timeout to 45s for question generation
            const timeoutPromise = new Promise<PsychometricQuestion[]>((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 45000)
            );
            
            const generatedQuestions = await Promise.race([
                generateProfileQuestions(language),
                timeoutPromise
            ]);

            if (generatedQuestions && generatedQuestions.length > 0) {
                const shuffled = generatedQuestions.map(q => ({
                    ...q,
                    options: [...q.options].sort(() => Math.random() - 0.5)
                }));
                setQuestions(shuffled);
                setAnswers({});
                setStep('questions');
            } else {
                throw new Error("No questions generated");
            }
        } catch (e) {
            console.error("Failed to generate dynamic questions, falling back to static:", e);
            const staticQuestions = t('strategicProfileLab_questions');
            
            if (Array.isArray(staticQuestions)) {
                 const formattedStatic = staticQuestions.map((q: any) => ({
                    question: q.question,
                    options: q.options.map((o: any) => ({ text: o.text, value: o.value }))
                }));
                setQuestions(formattedStatic);
                setAnswers({});
                setStep('questions');
            } else {
                console.error("Static questions translation missing or invalid type:", staticQuestions);
                setError("Error de configuración: No se pudieron cargar las preguntas base. Reinicia la aplicación.");
                setStep('intro');
            }
        }
    };

    const handleAnswer = (questionId: number, optionValue: string) => {
        const newAnswers = { ...answers, [questionId]: optionValue };
        setAnswers(newAnswers);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            setStep('intro');
        }
    };
    
    const handleAnalyze = async () => {
        setStep('loading');
        setError('');
        
        try {
            const answerCounts = Object.values(answers).reduce((acc, value) => {
                acc[value] = (acc[value] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number });

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("Timeout")), 90000)
            );

            const analysisPromise = generateDiscProfileAnalysis(answerCounts, language);

            const analysis = await Promise.race([analysisPromise, timeoutPromise]) as string;
            
            setResult(analysis);
            setStep('results');
        } catch(e) {
            console.error("Error generating DISC profile:", e);
            setError("El análisis está tardando más de lo esperado. Es un proceso complejo. Por favor, inténtalo de nuevo.");
            setStep('questions');
        }
    };

    const handleReset = () => {
        if(window.confirm(t('lab_reset_confirm'))) {
            setAnswers({});
            setQuestions([]);
            setStep('intro');
            setResult('');
            setCurrentQuestionIndex(0);
        }
    };

    const renderIntro = () => (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-2xl mx-auto pt-10 pb-32"
        >
            <Icon className="w-20 h-20 mx-auto mb-6 text-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </Icon>
            <h2 className="text-4xl font-bold mb-4 text-white">{t('lab_intro_title')}</h2>
            <p className="text-lg text-zinc-300 mb-10 leading-relaxed">{t('lab_intro_desc')}</p>
            
            <div className="mt-8 flex justify-center w-full">
                <button
                    onClick={startTest}
                    className="py-4 px-10 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 transform hover:scale-105"
                >
                    {questions.length > 0 && Object.keys(answers).length > 0 ? 'Continuar Evaluación' : t('lab_intro_button')}
                </button>
            </div>
            {error && <p className="text-red-400 mt-4">{error}</p>}
        </motion.div>
    );

    const renderGenerating = () => (
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center min-h-[60vh]">
            <div className="relative w-24 h-24 mb-8">
                <motion.span className="block w-24 h-24 border-4 border-zinc-700 rounded-full" />
                <motion.span
                    className="absolute top-0 left-0 block w-24 h-24 border-4 border-fuchsia-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" />
                </Icon>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('lab_generating_title')}</h3>
            <p className="text-zinc-400 max-w-md animate-pulse">{t('lab_generating_desc')}</p>
        </div>
    );

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center flex-1 px-4 text-center min-h-[60vh]">
            <div className="relative w-24 h-24 mb-8">
                <motion.span className="block w-24 h-24 border-4 border-zinc-700 rounded-full" />
                <motion.span
                    className="absolute top-0 left-0 block w-24 h-24 border-4 border-blue-500 rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('analyzing')}...</h3>
            <p className="text-zinc-400 max-w-md animate-pulse">{t('dashboard_generating_next_action')}</p>
        </div>
    );
    
    const renderQuestions = () => {
        const safeIndex = Math.min(currentQuestionIndex, questions.length - 1);
        const q = questions[safeIndex];
        if (!q) return null;
        const progress = Object.keys(answers).length;
        const isLastQuestion = progress === questions.length;

        return (
            <div className="w-full max-w-3xl mx-auto pt-4 flex flex-col h-full">
                 <div className="flex-shrink-0">
                    <div className="flex justify-between items-center mb-2 text-sm text-zinc-400">
                        <span>{t('lab_question_label')} {safeIndex + 1} {t('lab_of')} {questions.length}</span>
                        <button onClick={handleReset} className="text-red-400 hover:text-red-300">{t('lab_reset')}</button>
                    </div>
                    <ProgressBar current={safeIndex + 1} total={questions.length} />
                 </div>
                 
                 <div className="flex-1 overflow-y-auto pb-32">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={safeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                             <h3 className="font-bold text-2xl md:text-3xl text-white mb-8 leading-tight">{q.question}</h3>
                             <div className="space-y-4">
                                {q.options.map(option => {
                                    const isSelected = answers[safeIndex] === option.value;
                                    return (
                                        <button 
                                            key={option.value}
                                            onClick={() => handleAnswer(safeIndex, option.value)} 
                                            className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 group
                                                ${isSelected ? 'bg-blue-900/30 border-blue-500 ring-1 ring-blue-500' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                                ${isSelected ? 'border-blue-400 bg-blue-500' : 'border-zinc-600 group-hover:border-zinc-400'}`}
                                            >
                                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <span className={`text-lg ${isSelected ? 'text-white font-medium' : 'text-zinc-300'}`}>{option.text}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                     </AnimatePresence>
                     
                     {error && (
                        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-center">
                            <p>{error}</p>
                        </div>
                     )}
                 </div>

                 <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center z-30 gap-4 mt-auto">
                    <button onClick={handleBack} disabled={currentQuestionIndex === 0} className="px-6 py-3 text-zinc-400 font-medium hover:text-white disabled:opacity-30 transition-colors">Atrás</button>
                    {isLastQuestion ? (
                        <button onClick={handleAnalyze} className="flex-1 md:flex-none md:w-64 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl hover:shadow-lg hover:shadow-green-900/20 transition-all transform hover:scale-105">
                            {t('lab_analyze_button')}
                        </button>
                    ) : (
                        <div className="text-zinc-500 text-sm font-medium italic">{t('lab_select_option')}</div>
                    )}
                 </div>
            </div>
        )
    };
    
    const renderResults = () => (
        <div className="w-full max-w-4xl mx-auto pt-4 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-zinc-800/50 p-6 border-b border-zinc-700 flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-2xl font-bold text-white">{t('lab_results_title')}</h2>
                        <button onClick={handleReset} className="text-sm text-zinc-400 hover:text-white flex items-center gap-2">
                            <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691v4.992" /></Icon>
                            {t('lab_reset')}
                        </button>
                    </div>
                    <div className="p-8 prose prose-invert prose-zinc max-w-none prose-headings:text-blue-300 prose-strong:text-white prose-li:marker:text-blue-500">
                        {typeof result === 'string' ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                        ) : (
                            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
                                <p>
                                    ⚠️ {t('lab_format_error')}
                                    <br />
                                    <span className="text-xs opacity-70">
                                        {JSON.stringify(result).slice(0, 100)}...
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex justify-center z-30 mt-auto shrink-0">
                <button 
                    onClick={() => onComplete(result)} 
                    className="py-3 px-8 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/30 transform hover:scale-105 flex items-center gap-2"
                >
                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
                    {t('lab_save_and_complete')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col items-center h-full relative bg-zinc-950 overflow-hidden">
            {step === 'intro' && renderIntro()}
            {step === 'generating' && renderGenerating()}
            {step === 'questions' && renderQuestions()}
            {step === 'loading' && renderLoading()}
            {step === 'results' && renderResults()}
        </div>
    );
}