import React from 'react';

interface BentoGridProps {
  items: React.ReactNode[];
  compact?: boolean;
}

const BentoGrid: React.FC<BentoGridProps> = ({ items, compact }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${compact ? 'gap-2' : ''}`}>
      {items.map((item, index) => (
        <div key={index} className={compact ? 'p-2' : 'p-4'}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default BentoGrid;