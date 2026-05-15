"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Share2, Target, FileText, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PathNode {
  title: string;
  description: string;
  href: string;
  icon?: React.ElementType;
  category?: string;
}

interface RecursivePathProps {
  nodes: PathNode[];
  title?: string;
  subtitle?: string;
  className?: string;
}

/**
 * 🛰️ RECURSIVE PATH COMPONENT
 * Enforces the "Infinite Navigation" rule by providing multiple exit points
 * and contextually related nodes for every content surface.
 */
export function RecursivePath({ 
  nodes, 
  title = "Exploración Continua",
  subtitle = "Nodos de autoridad relacionados",
  className 
}: RecursivePathProps) {
  return (
    <div className={cn("py-16 border-t border-white/5 bg-black/20 backdrop-blur-sm", className || '')}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613] mb-2">
            {title}
          </h3>
          <p className="text-2xl font-black tracking-tighter uppercase text-white/90">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodes.slice(0, 3).map((node, i) => (
            <Link 
              key={i} 
              href={node.href}
              className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-[#ecb613]/30 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                {node.icon ? <node.icon size={80} /> : <Target size={80} />}
              </div>

              <div className="relative z-10 space-y-4">
                {node.category && (
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/30 px-2 py-1 bg-white/5 rounded-md">
                    {node.category}
                  </span>
                )}
                
                <h4 className="text-lg font-black uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">
                  {node.title}
                </h4>
                
                <p className="text-xs text-white/40 leading-relaxed line-clamp-2">
                  {node.description}
                </p>

                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#ecb613] pt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                  Profundizar Nodo <ArrowRight size={10} />
                </div>
              </div>

              {/* Animación de borde */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#ecb613] group-hover:w-full transition-all duration-700" />
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link 
            href="/vimume" 
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#ecb613] transition-colors"
          >
            <Globe size={14} />
            Retornar al Ecosistema Maestro
          </Link>
        </div>
      </div>
    </div>
  );
}
