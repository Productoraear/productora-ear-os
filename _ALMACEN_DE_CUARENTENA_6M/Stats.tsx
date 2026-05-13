
import React from 'react';
import { PERFORMANCE_STATS } from '../../data/stats';

const Stats: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-ear-purple to-black border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {PERFORMANCE_STATS.map((stat, index) => (
            <div key={index} className="text-center p-4">
              <div className="text-4xl md:text-5xl font-display font-black text-white mb-2">{stat.value}</div>
              <div className="text-ear-gold font-body tracking-widest uppercase text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
