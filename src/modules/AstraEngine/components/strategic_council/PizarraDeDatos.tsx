import React from 'react';
import { useTranslations } from '../../contexts/LanguageContext';
import { Icon } from '../Icon';
import { motion } from 'framer-motion';
import { GroundingSource } from '../../types';

interface PizarraDeDatosProps {
  facts: { title: string; content: string }[];
  sources: { uri: string; title: string }[];
}

export const PizarraDeDatos: React.FC<PizarraDeDatosProps> = ({ facts, sources }) => {
  const { t } = useTranslations();

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-6 h-full overflow-y-auto">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 sticky top-0 bg-zinc-900/50 backdrop-blur-sm py-2 -mt-4 -mx-4 px-4 border-b border-zinc-800">
        <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.97-2.122L7.5 15.25v-2.55a2.25 2.25 0 0 1 .97-1.898l4.053-2.702a.75.75 0 0 1 1.06 0l4.053 2.702a2.25 2.25 0 0 1 .97 1.898v2.55L14.03 16.135a3 3 0 0 1-.97 2.122v1.007" /></Icon>
        {t('dataWhiteboardTitle')}
      </h3>
      
      <div>
        <h4 className="font-semibold text-zinc-300 mb-2">{t('keyFactsTitle')}</h4>
        {facts.length > 0 ? (
          <div className="space-y-3">
            {facts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-800/60 p-3 rounded-md border border-zinc-700"
              >
                <p className="font-bold text-sm text-blue-400">{fact.title}</p>
                <p className="text-xs text-zinc-400">{fact.content}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">{t('noFactsAvailable')}</p>
        )}
      </div>

      <div>
        <h4 className="font-semibold text-zinc-300 mb-2">{t('relevantSourcesTitle')}</h4>
        {sources.length > 0 ? (
          <div className="space-y-2">
            {sources.map((source, index) => (
              <motion.a
                key={index}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (facts.length + index) * 0.1 }}
                className="block bg-zinc-800/60 p-3 rounded-md border border-zinc-700 hover:border-blue-500 transition-colors"
              >
                <p className="font-medium text-sm text-blue-400 truncate" title={source.title}>{source.title || new URL(source.uri).hostname}</p>
                <p className="text-xs text-zinc-500 truncate">{source.uri}</p>
              </motion.a>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500 italic">{t('noSourcesAvailable')}</p>
        )}
      </div>
    </div>
  );
};