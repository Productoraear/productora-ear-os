'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';

// --- TYPES ---
export interface DiviModule {
  id: string;
  type: 'text' | 'image' | 'button' | 'blurb' | 'pricing' | 'bento-item';
  title?: string;
  content?: string;
  imageUrl?: string;
  iconName?: 'sparkles' | 'shield' | 'zap' | 'activity' | 'none';
  buttonText?: string;
  buttonUrl?: string;
  glassVariant?: 'subtle' | 'medium' | 'strong' | 'gold' | 'neon-blue' | 'neon-purple';
  glow?: boolean;
  shimmer?: boolean;
  borderGradient?: boolean;
  customClass?: string;
}

export interface DiviColumn {
  id: string;
  spanWidth: number; // e.g. 12 (full), 6 (half), 4 (third), 8 (two-thirds)
  modules: DiviModule[];
}

export interface DiviRow {
  id: string;
  columns: DiviColumn[];
  layoutName?: string;
}

export interface DiviSection {
  id: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  backgroundGradient?: string;
  rows: DiviRow[];
}

export interface DiviLayout {
  layoutName: string;
  sections: DiviSection[];
}

// --- UTILS & MAPS ---
const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'sparkles':
      return <Sparkles className="w-5 h-5 text-primary animate-pulse" />;
    case 'shield':
      return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    case 'zap':
      return <Zap className="w-5 h-5 text-amber-400" />;
    case 'activity':
      return <Activity className="w-5 h-5 text-cyan-400" />;
    default:
      return null;
  }
};

const getGlassClasses = (
  variant?: string,
  glow?: boolean,
  shimmer?: boolean,
  borderGrad?: boolean
) => {
  let classes = 'backdrop-filter transition-all duration-500 rounded-2xl border ';

  // Glass intensities / colors
  switch (variant) {
    case 'subtle':
      classes += 'bg-white/[0.02] border-white/[0.04] blur-[10px] saturate-[140%] ';
      break;
    case 'strong':
      classes += 'bg-white/[0.08] border-white/[0.15] blur-[30px] saturate-[200%] ';
      break;
    case 'gold':
      classes += 'bg-[#ecb613]/[0.08] border-[#ecb613]/[0.2] hover:bg-[#ecb613]/[0.12] ';
      break;
    case 'neon-blue':
      classes += 'bg-cyan-500/[0.04] border-cyan-500/[0.2] hover:bg-cyan-500/[0.08] ';
      break;
    case 'neon-purple':
      classes += 'bg-purple-500/[0.04] border-purple-500/[0.2] hover:bg-purple-500/[0.08] ';
      break;
    case 'medium':
    default:
      classes += 'bg-white/[0.04] border-white/[0.08] blur-[20px] saturate-[170%] ';
      break;
  }

  // Hover transitions
  classes += 'hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] ';
  if (variant === 'gold') classes += 'hover:border-[#ecb613]/[0.4] ';
  else if (variant === 'neon-blue') classes += 'hover:border-cyan-400/[0.4] ';
  else if (variant === 'neon-purple') classes += 'hover:border-purple-400/[0.4] ';
  else classes += 'hover:border-white/[0.2] ';

  if (glow) {
    classes += 'relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/[0.05] before:to-transparent before:translate-x-[-100%] hover:before:animate-[shimmer_2s_infinite] ';
  }

  if (shimmer) {
    classes += 'relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-primary/[0.08] after:to-transparent after:animate-[shimmer_3s_infinite] ';
  }

  if (borderGrad) {
    classes += 'relative before:absolute before:inset-0 before:p-[1px] before:bg-gradient-to-br before:from-primary/40 before:to-cyan-400/40 before:rounded-2xl before:-z-10 ';
  }

  return classes;
};

// --- REACT MODULE RENDERER ---
export const DiviModuleRenderer: React.FC<{ module: DiviModule }> = ({ module }) => {
  const glassClasses = getGlassClasses(
    module.glassVariant,
    module.glow,
    module.shimmer,
    module.borderGradient
  );

  switch (module.type) {
    case 'blurb':
      return (
        <div className={`p-6 flex flex-col gap-4 ${glassClasses} ${module.customClass || ''}`}>
          <div className="flex items-center gap-3">
            {getIcon(module.iconName)}
            {module.title && (
              <h4 className="text-[14px] font-black uppercase tracking-[0.2em] text-foreground">
                {module.title}
              </h4>
            )}
          </div>
          {module.content && (
            <p className="text-muted-foreground text-xs leading-relaxed font-manrope">
              {module.content}
            </p>
          )}
        </div>
      );

    case 'pricing':
      return (
        <div className={`p-8 flex flex-col justify-between h-full gap-6 ${glassClasses} ${module.customClass || ''}`}>
          <div className="flex flex-col gap-2">
            {module.title && (
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                {module.title}
              </span>
            )}
            {module.content && (
              <div className="text-3xl font-black text-foreground py-2 font-syne">
                {module.content}
              </div>
            )}
          </div>
          {module.buttonText && (
            <a
              href={module.buttonUrl || '#'}
              className="w-full text-center py-4 bg-foreground text-background hover:bg-primary hover:text-foreground text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 rounded-lg"
            >
              {module.buttonText}
            </a>
          )}
        </div>
      );

    case 'button':
      return (
        <div className="py-2">
          <a
            href={module.buttonUrl || '#'}
            className="inline-flex items-center gap-3 px-8 py-5 border border-border bg-card hover:bg-muted hover:border-primary text-foreground text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 rounded-full"
          >
            {module.buttonText || 'EXPLORAR'}
            <ArrowRight className="w-4 h-4 text-primary" />
          </a>
        </div>
      );

    case 'image':
      return (
        <div className={`overflow-hidden rounded-2xl ${glassClasses} ${module.customClass || ''}`}>
          {module.imageUrl && (
            <img
              src={module.imageUrl}
              alt={module.title || 'Visual Component'}
              className="w-full h-auto max-h-[300px] object-cover hover:scale-105 transition-transform duration-700"
            />
          )}
        </div>
      );

    case 'bento-item':
      return (
        <div className={`p-6 flex flex-col justify-between h-full gap-4 ${glassClasses} ${module.customClass || ''}`}>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              {module.title && (
                <h3 className="text-lg font-black font-syne tracking-tight text-foreground">
                  {module.title}
                </h3>
              )}
              {getIcon(module.iconName)}
            </div>
            {module.content && (
              <p className="text-xs text-muted-foreground leading-relaxed font-manrope">
                {module.content}
              </p>
            )}
          </div>
          {module.buttonText && (
            <a
              href={module.buttonUrl || '#'}
              className="inline-flex items-center gap-2 text-[10px] font-black tracking-widest text-primary hover:text-foreground transition-colors"
            >
              {module.buttonText.toUpperCase()}
              <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      );

    case 'text':
    default:
      return (
        <div className={`p-6 flex flex-col gap-3 ${glassClasses} ${module.customClass || ''}`}>
          {module.title && (
            <h3 className="text-xl font-black font-syne tracking-tight text-foreground">
              {module.title}
            </h3>
          )}
          {module.content && (
            <p className="text-xs text-muted-foreground leading-relaxed font-manrope">
              {module.content}
            </p>
          )}
        </div>
      );
  }
};

// --- REACT LAYOUT TRANSMUTER COMPONENT ---
export const DiviTransmuter: React.FC<{ layout: DiviLayout }> = ({ layout }) => {
  return (
    <div className="flex flex-col gap-12 py-10 w-full">
      {layout.sections.map((section) => (
        <section
          key={section.id}
          className="relative w-full rounded-3xl p-8 overflow-hidden"
          style={{
            background: section.backgroundGradient || 'transparent',
          }}
        >
          {/* Section Header */}
          {(section.sectionTitle || section.sectionSubtitle) && (
            <div className="mb-10 flex flex-col gap-2">
              {section.sectionSubtitle && (
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                  {section.sectionSubtitle}
                </span>
              )}
              {section.sectionTitle && (
                <h2 className="text-3xl font-black font-syne tracking-tight text-foreground">
                  {section.sectionTitle}
                </h2>
              )}
            </div>
          )}

          {/* Rows grid render */}
          <div className="flex flex-col gap-8">
            {section.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-6 w-full"
              >
                {row.columns.map((col) => {
                  // Span translation map to handle Tailwind dynamically
                  const spanClasses: Record<number, string> = {
                    1: 'col-span-12 md:col-span-1',
                    2: 'col-span-12 md:col-span-2',
                    3: 'col-span-12 md:col-span-3',
                    4: 'col-span-12 md:col-span-4',
                    5: 'col-span-12 md:col-span-5',
                    6: 'col-span-12 md:col-span-6',
                    7: 'col-span-12 md:col-span-7',
                    8: 'col-span-12 md:col-span-8',
                    9: 'col-span-12 md:col-span-9',
                    10: 'col-span-12 md:col-span-10',
                    11: 'col-span-12 md:col-span-11',
                    12: 'col-span-12 md:col-span-12',
                  };

                  return (
                    <div
                      key={col.id}
                      className={`flex flex-col gap-6 ${spanClasses[col.spanWidth] || 'col-span-12'}`}
                    >
                      {col.modules.map((mod) => (
                        <DiviModuleRenderer key={mod.id} module={mod} />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
