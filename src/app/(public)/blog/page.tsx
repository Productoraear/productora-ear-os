"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, ArrowUpRight, Clock, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

export default function BlogHubPage() {
  const posts = [
    {
      id: 1,
      title: "El Silencio del Alzheimer y la Llave Musical",
      excerpt: "Cómo una canción de Antonio Machín logró que un paciente de 88 años volviera a hablar después de tres meses de mutismo.",
      date: "14 May 2026",
      author: "Edwin Agudelo",
      tag: "Casos de Éxito",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Ingeniería de Sonido en Centros de Día",
      excerpt: "Por qué el ruido de fondo es el mayor enemigo de la terapia de reminiscencia y cómo lo combatimos con aislamiento S-Class.",
      date: "10 May 2026",
      author: "Equipo Técnico EAR",
      tag: "Infraestructura",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "La 'Silver Economy' y el Impacto Social",
      excerpt: "Invertir en bienestar para la tercera edad no es solo filantropía; es la construcción de un nuevo paradigma económico.",
      date: "05 May 2026",
      author: "VIMUME Strategy",
      tag: "Negocio & Impacto",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-20 space-y-24">
        
        {/* 📚 HERO: CENTRO DE PENSAMIENTO */}
        <header className="space-y-8 max-w-4xl">
          <div className="flex items-center gap-4">
            <BookOpen className="text-[#ecb613]" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ecb613]">VIMUME Blog</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
            Archivo de <br />
            <span className="text-white/20">Conocimiento</span>
          </h1>
          <div className="relative pt-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-6 text-white/20">
              <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="BUSCAR EN EL GENOMA VIMUME..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-full py-6 pl-16 pr-8 text-[10px] font-black uppercase tracking-widest focus:border-[#ecb613]/40 outline-none transition-all"
            />
          </div>
        </header>

        {/* 📰 POSTS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="group relative bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden flex flex-col hover:bg-white/[0.04] transition-all">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-[#ecb613]">
                  {post.tag}
                </div>
              </div>
              
              <div className="p-10 flex-1 flex flex-col space-y-6">
                <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-widest text-white/30">
                  <span className="flex items-center gap-2"><Clock size={10} /> {post.readTime}</span>
                  <span className="flex items-center gap-2"><User size={10} /> {post.author}</span>
                </div>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight group-hover:text-[#ecb613] transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-xs text-white/40 leading-relaxed font-medium flex-1">
                  {post.excerpt}
                </p>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black text-white/20">{post.date}</span>
                  <Link 
                    href={ROUTES.blogCasos} 
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ecb613] group-hover:gap-4 transition-all"
                  >
                    LEER MÁS <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* 🏷️ CATEGORÍAS RÁPIDAS */}
        <section className="flex flex-wrap justify-center gap-4">
          {[
            { n: "Casos Clínicos", h: ROUTES.blogCasos },
            { n: "Investigación", h: ROUTES.blogInvestigacion },
            { n: "Técnica Sonora", h: ROUTES.blogTecnica },
            { n: "B2G Strategy", h: ROUTES.blogB2G },
            { n: "Impacto Social", h: ROUTES.blogImpacto },
            { n: "Newsletter", h: "/blog/newsletter" }
          ].map((cat) => (
            <Link 
              key={cat.n} 
              href={cat.h}
              className="px-6 py-2 bg-white/[0.02] border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest hover:border-[#ecb613]/40 hover:text-[#ecb613] transition-all"
            >
              {cat.n}
            </Link>
          ))}
        </section>

      </div>
    </main>
  );
}
