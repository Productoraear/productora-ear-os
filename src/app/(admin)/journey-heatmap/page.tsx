'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const JourneyHeatmapPage = () => {
  const router = useRouter();
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: any) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, target: any) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    // Implement logic to reassign the dragged item to the target
    console.log('Dropped', data, 'on', target);
  };

  return (
    <div className="bg-[#030305] text-white p-8">
      <h1 className="text-2xl font-bold">Journey Heatmap</h1>
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, { id: 1, name: 'Item 1' })}
        className="bg-[#ecb613] p-4 m-2"
      >
        Item 1
      </div>
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, { id: 2, name: 'Target 1' })}
        className="bg-[#FF2B44] p-4 m-2"
      >
        Target 1
      </div>
    </div>
  );
};

export default JourneyHeatmapPage;