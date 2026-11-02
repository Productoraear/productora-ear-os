import React from 'react';

export interface BentoItem {
  title: string;
  description: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ${className || ''}`}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: BentoItem) {
  return (
    <div
      className={`row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-input p-5 bg-[#09090d]/80 border border-white/10 justify-between flex flex-col space-y-4 hover:border-[#ecb613]/50 ${className || ''}`}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        <div className="flex items-center gap-2 mb-2 text-[#ecb613]">
          {icon}
          <div className="font-syne font-bold text-white text-base">
            {title}
          </div>
        </div>
        <div className="font-sans font-normal text-zinc-400 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
}
