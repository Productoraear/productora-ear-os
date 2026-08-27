import React from 'react';
import Link from 'next/link';

export interface FeatureCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  link: string;
  category?: string;
}

interface DarkFeatureGridProps {
  items: FeatureCardItem[];
  columns?: 2 | 3 | 4;
}

export const DarkFeatureGrid: React.FC<DarkFeatureGridProps> = ({ 
  items,
  columns = 4 
}) => {
  const colClass = columns === 2 
    ? 'grid-cols-1 sm:grid-cols-2' 
    : columns === 3 
    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="w-full max-w-[1200px] mx-auto py-20 px-4">
      <div className={`grid ${colClass} gap-6`}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group relative h-[420px] rounded-[8px] overflow-hidden bg-charcoal flex flex-col justify-end p-8 transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Imagen de Fondo a Sangre */}
            <img
              src={item.imageSrc}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

            {/* Contenido Editorial */}
            <div className="relative z-10">
              {item.category && (
                <span className="text-[11px] font-sans uppercase tracking-widest text-ash mb-2 block">
                  {item.category}
                </span>
              )}
              <h3 className="font-sans font-light text-[20px] leading-[1.2] tracking-[-0.02em] text-paper mb-2">
                {item.title}
              </h3>
              <p className="font-sans font-normal text-[13px] leading-[1.4] text-ash mb-4 line-clamp-2">
                {item.description}
              </p>
              <div className="flex justify-end">
                <span className="text-paper text-lg font-light group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DarkFeatureGrid;
