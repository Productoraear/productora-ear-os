import React from 'react';
import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blog-content';
import { ArrowLeft, Clock, User, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
export async function generateStaticParams() {
    return Object.entries(BLOG_POSTS).map(([slug, post]) => ({
        category: post.category.toLowerCase().replace(/ /g, '-'),
        slug,
    }));
}
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = BLOG_POSTS[slug];
    if (!post)
        return { title: 'Post no encontrado' };
    return {
        title: `${post.title} | Blog EAR OS`,
        description: `Expertise institucional: ${post.title}. Documentación técnica y estratégica del ecosistema VIMUME OS.`,
        openGraph: {
            images: [post.image]
        }
    };
}
export default async function BlogPostPage({ params }) {
    const { category, slug } = await params;
    const post = BLOG_POSTS[slug];
    if (!post) {
        notFound();
    }
    return (<main className="bg-[#050505] min-h-screen text-white selection:bg-[#ecb613]/30">
      {/* 🖼️ HERO IMAGE */}
      <div className="relative h-[70vh] w-full">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-60 grayscale-[0.5]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"/>
        
        {/* 🔙 BACK BUTTON */}
        <div className="absolute top-32 left-6 md:left-20">
          <Link href={`/blog/${category}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-white/50 hover:text-[#ecb613] transition-colors bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/5">
            <ArrowLeft size={14}/> Volver a {category.replace(/-/g, ' ')}
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-32 relative z-10 space-y-12 pb-32">
        {/* 📑 HEADER */}
        <header className="space-y-8">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1.5 bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black uppercase tracking-widest border border-[#ecb613]/20 rounded-full">
              {post.category}
            </span>
            <div className="h-[1px] flex-1 bg-white/5"/>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] italic">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white/30 pt-4">
            <span className="flex items-center gap-2"><User size={12} className="text-[#ecb613]"/> {post.author}</span>
            <span className="flex items-center gap-2"><Clock size={12} className="text-[#ecb613]"/> {post.readTime} lectura</span>
            <span className="text-white/10">•</span>
            <span>{post.date}</span>
          </div>
        </header>

        {/* ✍️ CONTENT */}
        <article className="prose prose-invert prose-zinc max-w-none prose-h2:text-3xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tighter prose-h2:italic prose-p:text-lg prose-p:leading-relaxed prose-p:text-white/60 prose-strong:text-[#ecb613] prose-li:text-white/60">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}/>
        </article>

        {/* 🔗 ACTIONS */}
        <footer className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <button className="p-4 bg-white/5 rounded-2xl hover:bg-[#ecb613] hover:text-black transition-all">
              <Share2 size={20}/>
            </button>
            <button className="p-4 bg-white/5 rounded-2xl hover:bg-[#ecb613] hover:text-black transition-all">
              <Bookmark size={20}/>
            </button>
          </div>

          <Link href="/contacto" className="bg-[#ecb613] text-black px-12 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.4em] hover:scale-105 transition-all shadow-xl">
            Solicitar Consultoría Técnica
          </Link>
        </footer>
      </div>
    </main>);
}
