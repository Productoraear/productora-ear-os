
import React, { useMemo, useState, useEffect } from "react";
import { CourseArchitecture, CourseLesson } from "../../../types";
import { Sidebar } from "./Sidebar";
import { LessonCard } from "./LessonCard";
import { KAIcon } from "./Icon";
import { useTranslations } from "../../../contexts/LanguageContext";

type Props = {
  course: CourseArchitecture;
  onBack: () => void;
};

export const CourseView: React.FC<Props> = ({ course, onBack }) => {
  const { t } = useTranslations();
  const [activeLessonId, setActiveLessonId] = useState<string | undefined>(() => {
    return course.units?.[0]?.lessons?.[0]?.id;
  });
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`prog_${course.title}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setCompleted(new Set(parsed));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, [course.title]);

  useEffect(() => {
    localStorage.setItem(`prog_${course.title}`, JSON.stringify(Array.from(completed)));
  }, [completed, course.title]);

  const allLessons = useMemo(() => {
    const arr: CourseLesson[] = [];
    course.units.forEach((u) => u.lessons.forEach((l) => arr.push(l)));
    return arr;
  }, [course.units]);

  const activeLesson = useMemo(() => {
    return allLessons.find((l) => l.id === activeLessonId) || allLessons[0];
  }, [activeLessonId, allLessons]);

  const toggleComplete = (id?: string) => {
    if (!id) return;
    const s = new Set(completed);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setCompleted(s);
  };

  const doneCount = completed.size;
  const totalCount = allLessons.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-200 font-sans absolute inset-0 z-50">
      
      {/* Mobile Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/90 z-40 lg:hidden backdrop-blur-sm" onClick={() => setMobileMenu(false)}/>
      )}

      {/* Sidebar Navigation */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-500 ease-out
        ${mobileMenu ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar 
          units={course.units} 
          activeLessonId={activeLesson?.id} 
          completed={completed} 
          onSelectLesson={(id) => { setActiveLessonId(id); setMobileMenu(false); }}
          className="h-full"
        />
      </div>

      {/* Main Content - "The Core" */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
        
        {/* Top Bar - "Command Strip" */}
        <header className="h-20 border-b border-zinc-900 flex items-center justify-between px-8 bg-black/50 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-6">
             <button onClick={() => setMobileMenu(true)} className="lg:hidden text-gold-500">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
             </button>
             <button onClick={onBack} className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 hover:text-white transition-colors flex items-center gap-3 uppercase group">
               <span className="text-gold-500 group-hover:-translate-x-1 transition-transform">&lt;</span> {t('abort_protocol')}
             </button>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-matrix animate-pulse"/>
              <span className="text-[9px] font-mono tracking-[0.2em] text-matrix uppercase opacity-80">{t('context_secure')}</span>
            </div>
            <div className="font-serif italic text-zinc-500 text-sm truncate max-w-[300px] border-l border-zinc-800 pl-6">
              {course.title}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-16 scroll-smooth">
          <div className="max-w-5xl mx-auto space-y-24">
            
            {/* Header Block */}
            <section className="space-y-8 border-b border-zinc-900 pb-16 relative">
              <div className="flex items-center gap-4">
                 <span className="px-3 py-1 bg-white text-black font-mono text-[9px] font-bold tracking-[0.2em] uppercase">
                    Protocolo {activeLesson?.id}
                 </span>
                 <span className="text-[9px] font-mono text-gold-500 tracking-[0.2em] uppercase opacity-70">
                   // {doneCount}/{totalCount} {t('active_nodes')}
                 </span>
              </div>
              
              <h1 className="font-serif text-5xl lg:text-7xl text-white leading-[0.9] tracking-tight">
                {activeLesson?.title}
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4">
                <div className="lg:col-span-8">
                    <p className="font-serif text-2xl text-zinc-500 italic leading-relaxed pl-8 border-l border-gold-500/30">
                    "{activeLesson?.summary}"
                    </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-4">
                   <button 
                     onClick={() => toggleComplete(activeLesson?.id)}
                     className={`
                       w-full py-4 px-6 font-mono text-[10px] tracking-[0.2em] uppercase border transition-all duration-500
                       ${completed.has(activeLesson?.id || "") 
                         ? "bg-matrix/10 border-matrix text-matrix shadow-[0_0_20px_rgba(0,255,65,0.1)]" 
                         : "border-zinc-800 text-zinc-500 hover:border-zinc-500 hover:text-white bg-black hover:bg-zinc-900"
                       }
                     `}
                   >
                     {completed.has(activeLesson?.id || "") ? t('node_secured') : t('mark_as_executed')}
                   </button>
                </div>
              </div>
            </section>

            {/* Content Blocks */}
            <section className="space-y-16">
               {activeLesson?.blocks.map((b, i) => (
                 <LessonCard key={i} block={b} />
               ))}
            </section>

            {/* Footer / Evidence Chain */}
            <section className="pt-20 mt-20 border-t border-zinc-900 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h4 className="font-mono text-[9px] text-gold-500 mb-8 tracking-[0.2em] uppercase flex items-center gap-3">
                   <KAIcon name="lock" size={12} />
                   {t('evidence_chain')}
                </h4>
                <ul className="space-y-4 font-mono text-xs text-zinc-600">
                  {course.sources.map((s, i) => (
                    <li key={i} className="flex items-start gap-4 hover:text-zinc-300 transition-colors cursor-pointer group">
                       <span className="text-zinc-800 group-hover:text-gold-500 transition-colors">[{i+1}]</span>
                       <a href={s} target="_blank" rel="noopener noreferrer" className="truncate hover:underline decoration-zinc-700 underline-offset-4">{s}</a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-zinc-900/30 p-10 border border-zinc-800 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/5 blur-3xl rounded-full"></div>
                 <h4 className="font-serif text-2xl text-white mb-4">{t('final_objective')}</h4>
                 <div className="h-px w-12 bg-gold-500 mb-6"/>
                 <p className="font-serif text-zinc-500 text-lg italic mb-8">
                   {t('final_objective_desc')}
                 </p>
                 <div className="w-full h-px bg-zinc-800 relative">
                    <div className="absolute top-0 left-0 h-full bg-gold-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%`, boxShadow: '0 0 10px rgba(197, 160, 40, 0.5)' }}/>
                 </div>
                 <div className="mt-4 text-right font-mono text-[9px] text-gold-500 tracking-[0.2em]">
                    {progress}% {t('synchronized')}
                 </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
};
