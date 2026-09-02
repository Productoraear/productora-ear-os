import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../Icon';

interface IkigaiQuestionHelperProps {
  title: string;
  questions: string;
}

export const IkigaiQuestionHelper: React.FC<IkigaiQuestionHelperProps> = ({ title, questions }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex items-center" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      <Icon className="w-4 h-4 text-zinc-400 hover:text-blue-300 cursor-help transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </Icon>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md p-3 z-20 shadow-lg"
          >
            <h4 className="font-bold text-white mb-2">{title}</h4>
            <p className="whitespace-pre-line">{questions}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};