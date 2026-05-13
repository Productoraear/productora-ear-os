
import React, { useState, useEffect, useRef } from 'react';
import { DYNAMIC_STATS, DynamicStat } from '../../data/stats';

const StatItem: React.FC<{ stat: DynamicStat; isVisible: boolean }> = ({ stat, isVisible }) => {
  const [count, setCount] = useState(0);
  const duration = 2000; // 2 segundos

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * stat.value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, stat.value]);

  // SVG Ring Constants
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((stat.percent || 0) / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center p-6 group">
      <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-white/5"
          />
          {/* Animated Progress Ring */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="url(#goldGradient)"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? offset : circumference}
            strokeLinecap="round"
            className="transition-all duration-[2000ms] ease-out"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#F9E076" />
            </linearGradient>
          </defs>
        </svg>

        {/* Counter Value */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-3xl font-display font-black text-white flex items-baseline">
            {count}
            <span className="text-ear-gold text-xl ml-0.5">{stat.suffix}</span>
          </div>
        </div>
      </div>

      <h3 className="text-ear-gold font-display font-bold text-xs uppercase tracking-[0.2em] mb-3 group-hover:text-white transition-colors">
        {stat.label}
      </h3>
      <p className="text-gray-500 font-body text-xs leading-relaxed max-w-[220px]">
        {stat.description}
      </p>
    </div>
  );
};

const AnimatedStats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-black border-y border-white/5 relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ear-purple/10 via-black to-black opacity-40"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {DYNAMIC_STATS.map((stat) => (
            <StatItem key={stat.id} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
