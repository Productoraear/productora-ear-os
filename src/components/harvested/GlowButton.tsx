import React from 'react';

export interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'gold' | 'cyan' | 'ruby';
}

export function GlowButton({
  children,
  variant = 'gold',
  className = '',
  ...props
}: GlowButtonProps) {
  const colorStyles = {
    gold: 'border-[#ecb613]/40 bg-[#ecb613]/10 text-[#ecb613] hover:bg-[#ecb613] hover:text-black shadow-[0_0_25px_rgba(236,182,19,0.2)]',
    cyan: 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black shadow-[0_0_25px_rgba(0,229,255,0.2)]',
    ruby: 'border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44] hover:bg-[#FF2B44] hover:text-white shadow-[0_0_25px_rgba(255,43,68,0.2)]',
  }[variant];

  return (
    <button
      className={`relative inline-flex items-center justify-center px-6 py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider border backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] ${colorStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
