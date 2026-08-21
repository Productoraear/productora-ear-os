"use client";

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { translations } from '../locales/translations';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = React.useState<'config' | 'about'>('about');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-neutral-900 border-l border-white/10 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-heading font-bold text-white">{translations.en.settings.title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex border-b border-white/10 px-6 space-x-6">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {translations.en.settings.aboutTab}
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'config'
                    ? 'border-yellow-500 text-yellow-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {translations.en.settings.configTab}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'about' ? (
                <div className="prose prose-invert prose-yellow max-w-none">
                  <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                     <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-xl font-bold text-yellow-500 mt-8 mb-4" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-white mt-6 mb-3" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-4" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-4" {...props} />,
                          li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                          code: ({node, className, children, ...props}: any) => {
                             const isInline = !className?.includes('language-');
                             return isInline ? (
                               <code className="bg-white/10 text-yellow-400 rounded px-1 py-0.5 text-xs font-mono" {...props}>
                                 {children}
                               </code>
                             ) : (
                               <code className="block bg-black/50 p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                                 {children}
                               </code>
                             );
                          }
                        }}
                     >
                        {translations.en.aboutAstraTechnical}
                     </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <h3 className="font-medium text-white mb-2">Interface Preferences</h3>
                    <p className="text-sm text-gray-400">Settings mockups would go here...</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                     <h3 className="font-medium text-white mb-2">API Configuration</h3>
                     <p className="text-sm text-gray-400">Gemini model settings would be configured here.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-white/10 bg-black/20 text-xs text-gray-500 text-center">
              Astra OS v2.1.0 • Build 2025.07.23
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;