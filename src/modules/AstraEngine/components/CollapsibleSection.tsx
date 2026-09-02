import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
import { Tooltip } from './Tooltip';

interface CollapsibleSectionProps {
  title: string;
  tooltip: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const CollapsibleSectionComponent: React.FC<CollapsibleSectionProps> = ({ title, tooltip, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-white/10 pb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors">{title}</h3>
            <Tooltip text={tooltip} />
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </Icon>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', marginTop: '1rem' },
              collapsed: { opacity: 0, height: 0, marginTop: '0rem' },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CollapsibleSection = React.memo(CollapsibleSectionComponent);