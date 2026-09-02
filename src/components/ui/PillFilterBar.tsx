'use client';

import React, { useState } from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

interface PillFilterBarProps {
  options: FilterOption[];
  onSelect: (id: string) => void;
  defaultActiveId?: string;
}

export const PillFilterBar: React.FC<PillFilterBarProps> = ({ 
  options, 
  onSelect,
  defaultActiveId
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId || options[0]?.id || '');

  const handleSelect = (id: string) => {
    setActiveId(id);
    onSelect(id);
  };

  return (
    <div className="w-full overflow-x-auto py-6 no-scrollbar flex justify-center">
      <div className="flex items-center gap-2 px-4 bg-transparent">
        {options.map((option) => {
          const isActive = option.id === activeId;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`px-[18px] py-[8px] rounded-[100px] text-[14px] font-sans transition-all duration-200 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-fog text-obsidian font-medium'
                  : 'bg-transparent text-paper/80 hover:bg-fog/20 font-normal'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillFilterBar;
