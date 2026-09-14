import React from 'react';

const JourneyHeatmapLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#030305] text-white min-h-screen">
      <header className="bg-[#050507] p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
};

export default JourneyHeatmapLayout;