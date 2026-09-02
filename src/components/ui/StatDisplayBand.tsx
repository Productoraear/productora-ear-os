import React from 'react';

export interface StatItem {
  value: string;
  superscript?: string;
  label: string;
}

interface StatDisplayBandProps {
  stats: StatItem[];
  title?: string;
}

export const StatDisplayBand: React.FC<StatDisplayBandProps> = ({ stats, title }) => {
  return (
    <section className="w-full bg-obsidian text-paper py-20 px-6 border-y border-white/5">
      <div className="max-w-[1200px] mx-auto space-y-12">
        {title && (
          <div className="text-center">
            <span className="font-sans font-normal text-[12px] uppercase tracking-widest text-ash">
              {title}
            </span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-baseline mb-2">
                <span className="font-sans font-light text-[80px] md:text-[100px] leading-none tracking-[-0.06em] text-paper">
                  {stat.value}
                </span>
                {stat.superscript && (
                  <span className="font-sans font-light text-2xl md:text-4xl text-ash ml-1">
                    {stat.superscript}
                  </span>
                )}
              </div>
              <span className="font-sans font-normal text-[12px] uppercase tracking-wider text-ash">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatDisplayBand;
