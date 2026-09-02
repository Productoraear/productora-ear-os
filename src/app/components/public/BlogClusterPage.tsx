"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, User, ArrowUpRight, Target } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { RecursivePath } from './RecursivePath';

interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tag: string;
  readTime: string;
  image: string;
  href: string;
}

interface BlogClusterPageProps {
  title: string;
  description: string;
  category: string;
  posts: Post[];
}

export default function BlogClusterPage({ title, description, category, posts }: BlogClusterPageProps) {
  return (
    <main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      <div className="max-w-7xl mx-auto px-6 pt-48 pb-20 space-y-24">
        
        {/* 🔙 BACK NAV */}
        <Link 
          href={ROUTES.blog}
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-[#ecb613] transition-colors"
        >
          <ArrowLeft size={14} /> Volver al Archivo
        </Link>

        {/* 📚 HEADER */}
        <header className="space-y-8 max-w-4xl">
          <div className="flex items-center gap-4">
            <BookOpen className="text-[#ecb613]" size={24} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ecb613]">{category}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
            {title}
          </h1>
          <p className="text-xl text-white/40 font-medium italic leading-relaxed max-w-2xl">
            "{description}"
          </p>
        </header>

        {/* 📰 POSTS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={post.href}>
                <article className="group relative bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden flex flex-col h-full hover:bg-white/[0.04] transition-all cursor-pointer">
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
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ecb613] group-hover:gap-4 transition-all">
                        LEER MÁS <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-32 text-center space-y-6 border border-dashed border-white/10 rounded-[3rem]">
              <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">Próximamente</p>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter">Documentación en fase de carga</h3>
              <p className="text-white/40 max-w-sm mx-auto italic">Estamos procesando el histórico de este clúster editorial para su publicación inmediata.</p>
            </div>
          )}
        </section>

        {/* 🧬 RECURSIVE NAVIGATION LOOP */}
        <RecursivePath 
          title="Navegación Institucional"
          subtitle="Profundizar en el Ecosistema VIMUME"
          nodes={[
            { 
              title: "Protocolo Operativo", 
              description: "Metodología de diagnóstico y curación musical para entornos clínicos y residenciales.",
              href: ROUTES.protocolo,
              category: "TÉCNICA",
              icon: BookOpen
            },
            { 
              title: "Fundación e Identidad", 
              description: "El marco filosófico y científico que sustenta la infraestructura VIMUME.",
              href: ROUTES.fundacion,
              category: "FILOSOFÍA",
              icon: User
            },
            { 
              title: "Ejes de Impacto Social", 
              description: "Análisis de retorno social y métricas de humanización en el despliegue territorial.",
              href: ROUTES.blogImpacto,
              category: "RESULTADOS",
              icon: Target
            }
          ]}
        />


      </div>
    </main>
  );
}
