import React from 'react';

interface EarLogoProps {
  className?: string;
}

const EarLogo: React.FC<EarLogoProps> = ({ className = "w-20 h-auto" }) => (
  <svg
    viewBox="0 0 400 300"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Productora EAR Logo"
  >
    <defs>
      {/* Gold Gradients matching website aesthetic */}
      <linearGradient id="gradGoldLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF7CC" />
        <stop offset="50%" stopColor="#F9E076" />
        <stop offset="100%" stopColor="#D4AF37" />
      </linearGradient>
      
      <linearGradient id="gradGoldDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
      
      <linearGradient id="gradText" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#F9E076" />
        <stop offset="100%" stopColor="#B8860B" />
      </linearGradient>

      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <g transform="translate(0, 20)">
        {/* Diamond Lower Body (Pavilion) - Emerging from center */}
        <polygon points="200,260 100,140 300,140" fill="url(#gradGoldDark)" stroke="#B8860B" strokeWidth="1" />

        {/* Diamond Upper Body (Crown) - Clean Table Cut (No top noise) */}
        {/* Left Facet */}
        <polygon points="100,140 140,90 200,140" fill="url(#gradGoldLight)" opacity="0.8" />
        {/* Right Facet */}
        <polygon points="300,140 260,90 200,140" fill="url(#gradGoldLight)" opacity="0.6" />
        {/* Top Table Facet (Flat top) */}
        <polygon points="140,90 260,90 200,140" fill="url(#gradGoldLight)" opacity="0.9" />
        
        {/* Subtle facet strokes for 3D depth */}
        <path d="M140 90 L100 140" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <path d="M260 90 L300 140" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
        <path d="M200 140 L200 260" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    </g>

    {/* Brand Text - Centered, Cinzel Font, Gold */}
    <text
      x="200"
      y="185"
      fontFamily="'Cinzel', serif"
      fontSize="80"
      fontWeight="900"
      textAnchor="middle"
      fill="url(#gradText)"
      stroke="#000"
      strokeWidth="1.5"
      filter="url(#glow)"
      style={{ letterSpacing: '0.1em' }}
    >
      EAR
    </text>
  </svg>
);

export default EarLogo;
