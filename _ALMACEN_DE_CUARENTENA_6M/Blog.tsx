
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BLOG_ARTICLES } from '../../data/blog';

const Blog: React.FC = () => {
  return (
    <div className="pt-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <span className="text-ear-gold font-body font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
            The Insight Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 uppercase">
            BLOG & <span className="text-ear-gold">NOTICIAS</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explora las últimas tendencias en producción, management artístico y estrategias de negocio de alto impacto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => {
            const Icon = article.icon;
            return (
              <div 
                key={article.id} 
                className={`group bg-[#111] border rounded-2xl overflow-hidden transition-all duration-300 hover:border-ear-gold/50 flex flex-col ${article.featured ? 'md:col-span-2 lg:col-span-2 flex-row border-ear-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-white/10'}`}
              >
                <div className={`relative overflow-hidden ${article.featured ? 'w-2/5' : 'h-64'}`}>
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-[10px] font-black text-ear-gold uppercase tracking-widest">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {article.author}</span>
                  </div>

                  <h2 className={`font-display font-bold text-white mb-4 leading-tight group-hover:text-ear-gold transition-colors ${article.featured ? 'text-3xl' : 'text-xl'}`}>
                    {article.title}
                  </h2>

                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <button className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest group/btn">
                      Leer Artículo <ArrowRight size={14} className="text-ear-gold group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                    <div className="p-2 bg-white/5 rounded-lg text-gray-600 group-hover:text-ear-gold transition-colors">
                      <Icon size={20} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blog;
