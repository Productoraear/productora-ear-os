import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { useAIAssistant } from '../../hooks/useAIAssistant';
import { EnhancedTextarea } from '../EnhancedTextarea';
import { generateProaAnalysis } from '../../services/geminiService';

// Icons wrapper
const BrainIcon = ({ className }: { className?: string }) => <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>;
const MicIcon = ({ className }: { className?: string }) => <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m12 0v-1.5a6 6 0 0 0-6-6v0a6 6 0 0 0-6 6v1.5m-6 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm2.25 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm13.5 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-2.25 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" /></Icon>;
const SparklesIcon = ({ className }: { className?: string }) => <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 1-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 1 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 1 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 1-2.846.813a4.5 4.5 0 0 1-3.09 3.09Z" /></Icon>;
const DocumentIcon = ({ className }: { className?: string }) => <Icon className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></Icon>;

// Components
const DocumentViewer = () => {
    const { t } = useTranslations();
    return (
        <div className="p-8 flex flex-col items-center justify-center h-full text-zinc-500">
            <DocumentIcon className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">{t('gemini_viewer_title')}</p>
            <p className="text-sm opacity-60 mt-2">{t('gemini_viewer_desc')}</p>
            <button className="mt-6 px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 text-zinc-300 transition-colors">
                {t('gemini_select_file')}
            </button>
        </div>
    );
};

const LiveConversation = () => {
    const { t } = useTranslations();
    const { response, isStreaming, generateResponse } = useAIAssistant();
    const [input, setInput] = useState('');
    
    return (
        <div className="flex flex-col h-full min-h-[400px]">
            <div className="flex-1 bg-black/20 p-6 overflow-y-auto">
                {response ? (
                    <div className="bg-blue-900/20 border border-blue-500/20 text-blue-100 p-4 rounded-xl rounded-tl-none inline-block max-w-[90%]">
                        {response}
                        {isStreaming && <span className="inline-block w-2 h-4 ml-1 bg-blue-400 animate-pulse" />}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                        <MicIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p>{t('gemini_live_start')}</p>
                    </div>
                )}
            </div>
            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex gap-3">
                <input 
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t('gemini_input_placeholder')}
                    onKeyDown={e => e.key === 'Enter' && generateResponse(input)}
                />
                <button 
                    onClick={() => generateResponse(input)} 
                    disabled={!input.trim() || isStreaming}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {t('gemini_send')}
                </button>
            </div>
        </div>
    );
};

const ContentUpdater = () => {
    const { t } = useTranslations();
    const [text, setText] = useState('');
    return (
        <div className="p-6 h-full flex flex-col">
            <h3 className="text-zinc-100 font-semibold mb-4 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-400" />
                {t('gemini_updater_title')}
            </h3>
            <div className="flex-1">
                <EnhancedTextarea 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    className="w-full h-full min-h-[300px] bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none leading-relaxed" 
                    placeholder={t('gemini_updater_placeholder')} 
                />
            </div>
        </div>
    );
};

const ComplexReasoning = () => {
    const { t } = useTranslations();
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const handleReason = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        try {
            const res = await generateProaAnalysis(prompt); // Reusing PROA logic for deep reasoning
            setResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="mb-4">
                <label className="block text-zinc-400 text-sm font-medium mb-2">{t('gemini_reasoning_label')}</label>
                <textarea 
                    value={prompt} 
                    onChange={e => setPrompt(e.target.value)} 
                    className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" 
                    placeholder={t('gemini_reasoning_placeholder')} 
                />
            </div>
            
            <div className="flex justify-end mb-6">
                <button 
                    onClick={handleReason} 
                    disabled={loading || !prompt.trim()} 
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-purple-500 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                    {loading ? (
                        <><Icon className="w-4 h-4 animate-spin"><path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" fill="currentColor"/></Icon> {t('gemini_reasoning_loading')}</>
                    ) : (
                        <>{t('gemini_analyze')} <BrainIcon className="w-4 h-4" /></>
                    )}
                </button>
            </div>

            <div className="flex-1 bg-black/30 border border-zinc-800 rounded-xl p-4 overflow-auto">
                {result ? (
                    <div className="space-y-4">
                        <div className="bg-purple-900/10 p-4 rounded-lg border border-purple-500/20">
                            <h4 className="text-purple-300 font-bold mb-2">{t('gemini_assumptions_title')}</h4>
                            <ul className="list-disc list-inside text-zinc-300 space-y-1">
                                {result.assumptionAnalysis?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                        <div className="bg-blue-900/10 p-4 rounded-lg border border-blue-500/20">
                            <h4 className="text-blue-300 font-bold mb-2">{t('gemini_roadmap_title')}</h4>
                            <ol className="list-decimal list-inside text-zinc-300 space-y-1">
                                {result.actionableRoadmap?.steps?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                            </ol>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-zinc-600 italic">
                        {t('gemini_no_results')}
                    </div>
                )}
            </div>
        </div>
    );
};

type Tab = 'live' | 'updater' | 'reasoning' | 'viewer';

interface TabButtonProps {
  tab: Tab;
  label: string;
  children: React.ReactNode;
  activeTab: Tab;
  onClick: (tab: Tab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, label, children, activeTab, onClick }) => (
  <button
    onClick={() => onClick(tab)}
    className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl border ${
      activeTab === tab 
        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'
    }`}
  >
    {children}
    <span className="mt-1 sm:mt-0">{label}</span>
  </button>
);

export const GeminiAdvancedToolkit: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<Tab>('viewer');
  const { t } = useTranslations();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'live': return <LiveConversation />;
      case 'updater': return <ContentUpdater />;
      case 'reasoning': return <ComplexReasoning />;
      case 'viewer': return <DocumentViewer />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-950 overflow-hidden">
      <header className="bg-zinc-900/50 backdrop-blur-sm border-b border-zinc-800 p-6 sticky top-0 z-10 flex-shrink-0">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                {t('tool_geminiToolkit_title')}
            </h1>
            <p className="text-zinc-400 text-sm">{t('tool_geminiToolkit_description')}</p>
          </div>
          <button 
            onClick={onComplete} 
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            {t('completeAndContinue')}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto max-w-6xl p-4 sm:p-6 flex flex-col overflow-hidden">
        <nav className="mb-6 flex flex-col sm:flex-row gap-3 shrink-0">
            <TabButton tab="viewer" label={t('gemini_tab_viewer')} activeTab={activeTab} onClick={setActiveTab}>
                <DocumentIcon className="w-5 h-5" />
            </TabButton>
            <TabButton tab="live" label={t('gemini_tab_live')} activeTab={activeTab} onClick={setActiveTab}>
                <MicIcon className="w-5 h-5" />
            </TabButton>
            <TabButton tab="updater" label={t('gemini_tab_updater')} activeTab={activeTab} onClick={setActiveTab}>
                <SparklesIcon className="w-5 h-5" />
            </TabButton>
            <TabButton tab="reasoning" label={t('gemini_tab_reasoning')} activeTab={activeTab} onClick={setActiveTab}>
                <BrainIcon className="w-5 h-5" />
            </TabButton>
        </nav>
        
        <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden min-h-0"
        >
          {renderTabContent()}
        </motion.div>
      </main>
      
      <footer className="text-center p-4 text-zinc-600 text-xs border-t border-zinc-900 bg-zinc-950">
        {t('gemini_footer')}
      </footer>
    </div>
  );
};