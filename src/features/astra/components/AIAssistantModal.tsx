"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIAssistantAction } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { generateAIAssistantResponse } from '../services/geminiService';
import {
  SparklesIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataContextString?: string;
  onGenerate?: (text: any, action: any) => Promise<string>;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  dataContextString = ''
}) => {
  const { t, language } = useTranslations();
  const [inputText, setInputText] = useState('');
  const [action, setAction] = useState<AIAssistantAction>(AIAssistantAction.SUMMARIZE);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await generateAIAssistantResponse(inputText, action, language);
      setResponse(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-zinc-900 to-indigo-950/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <SparklesIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Astra Strategic Copilot</h3>
                  <p className="text-xs text-zinc-400">Executive AI reasoning powered by Gemini</p>
                </div>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-white">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase text-zinc-400">
                  Strategic Query / Raw Context
                </label>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Paste dilemma, contract clause, strategic dilemma, or draft copy..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.values(AIAssistantAction).map(act => (
                  <button
                    key={act}
                    onClick={() => setAction(act)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      action === act
                        ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-600/30'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {act.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              <button
                onClick={handleAsk}
                disabled={loading || !inputText.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Generating Strategic Synthesis...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-4 h-4" />
                    Synthesize with Astra AI
                  </>
                )}
              </button>

              {/* Response Display */}
              {response && (
                <div className="mt-4 p-5 bg-black/50 border border-white/10 rounded-2xl space-y-2">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    Astra Strategic Output
                  </span>
                  <div className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
