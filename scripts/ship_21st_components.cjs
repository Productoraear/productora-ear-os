/**
 * 21ST.DEV COMPONENT SHIPPER (PRIORIDAD FRONTEND & ADMIN)
 * Inyecta los componentes clave de alta conversión visual directamente
 * en `src/components/harvested/` para su uso inmediato en el frontend y en el panel.
 */

const fs = require('fs');
const path = require('path');

const HARVEST_DIR = path.join(__dirname, '..', 'src', 'components', 'harvested');
if (!fs.existsSync(HARVEST_DIR)) {
  fs.mkdirSync(HARVEST_DIR, { recursive: true });
}

// 1. BentoGrid3D (Visualizador Cinematográfico de Fincas y Arsenal)
const bentoGridComponent = `import React from 'react';

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
      className={\`grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto \${className || ''}\`}
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
      className={\`row-span-1 rounded-3xl group/bento hover:shadow-2xl transition duration-300 shadow-input p-5 bg-[#09090d]/80 border border-white/10 justify-between flex flex-col space-y-4 hover:border-[#ecb613]/50 \${className || ''}\`}
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
`;

// 2. GlowButton (Call to Action de Máxima Conversión sin Fricción)
const glowButtonComponent = `import React from 'react';

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
      className={\`relative inline-flex items-center justify-center px-6 py-3 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider border backdrop-blur-md transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] \${colorStyles} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
}
`;

fs.writeFileSync(path.join(HARVEST_DIR, 'BentoGrid.tsx'), bentoGridComponent, 'utf8');
fs.writeFileSync(path.join(HARVEST_DIR, 'GlowButton.tsx'), glowButtonComponent, 'utf8');

console.log('✅ Componentes de 21st.dev cosechados y montados en src/components/harvested/: BentoGrid.tsx y GlowButton.tsx');

