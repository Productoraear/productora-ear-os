import React from 'react';
import { SendIcon } from './icons';
import { useTranslations } from '../../../contexts/LanguageContext';

interface UserInputFormProps {
  idea: string;
  setIdea: (idea: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ idea, setIdea, onSubmit, isLoading }) => {
  const { t } = useTranslations();
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onSubmit(e as any);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="idea-input" className="block text-lg font-medium text-zinc-300 mb-2">
        {t('proa_form_label')}
      </label>
      <div className="relative">
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('proa_form_placeholder')}
          className="w-full h-40 p-4 bg-zinc-900/70 border border-zinc-700 rounded-lg text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !idea.trim()}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-blue-500"
        >
          {isLoading ? (
            t('proa_analyzing')
          ) : (
            <>
              {t('proa_form_submit')} <SendIcon className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
      <p className="text-sm text-zinc-500 mt-2 text-right">
        {t('proa_form_shortcut_prefix')} <kbd className="font-mono bg-zinc-700 px-1.5 py-0.5 rounded">Ctrl/Cmd</kbd> + <kbd className="font-mono bg-zinc-700 px-1.5 py-0.5 rounded">Enter</kbd> {t('proa_form_shortcut_suffix')}
      </p>
    </form>
  );
};