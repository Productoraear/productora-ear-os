import React, { useState } from 'react';
import { Icon } from './Icon';

interface TooltipProps {
  text: string;
}

const TooltipComponent: React.FC<TooltipProps> = ({ text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative flex items-center" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      <Icon className="w-4 h-4 text-zinc-500 hover:text-blue-400 cursor-help transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </Icon>
      {visible && (
        <div className="absolute bottom-full mb-2 w-64 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-md p-2 z-10 shadow-lg animate-fade-in">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export const Tooltip = React.memo(TooltipComponent);