
import React from "react";
import { CourseUnit } from "../../../types";
import { useTranslations } from "../../../contexts/LanguageContext";

type Props = {
  units: CourseUnit[];
  activeLessonId?: string;
  completed: Set<string>;
  onSelectLesson: (lessonId: string) => void;
  className?: string;
};

export const Sidebar: React.FC<Props> = ({ units, activeLessonId, completed, onSelectLesson, className = "" }) => {
  const { t } = useTranslations();
  return (
    <aside className={`w-80 border-r border-zinc-900 bg-black flex-shrink-0 flex flex-col ${className} font-mono`}>
      <div className="p-8 border-b border-zinc-900">
        <h3 className="text-[9px] tracking-[0.3em] text-gold-500 uppercase opacity-80">
          {t('architecture_index')}
        </h3>
      </div>
      
      <div className="overflow-y-auto flex-1 custom-scrollbar p-6 space-y-12">
        {units.map((u, i) => (
          <div key={u.id} className="group">
            <div className="flex items-baseline gap-3 mb-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] text-zinc-500">0{i + 1} //</span>
               <h4 className="text-zinc-300 text-xs tracking-[0.1em] uppercase">
                {u.title}
              </h4>
            </div>
            
            <div className="space-y-1 border-l border-zinc-900 ml-2 pl-6">
              {u.lessons.map((l) => {
                const active = l.id === activeLessonId;
                const done = completed.has(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => onSelectLesson(l.id)}
                    className={`
                      w-full text-left py-3 flex items-center justify-between group/btn
                      transition-all duration-300
                      ${active ? "translate-x-2" : "hover:translate-x-1"}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`
                        w-1 h-1 rounded-full transition-all duration-300
                        ${active ? "bg-gold-500 scale-150" : done ? "bg-zinc-800" : "bg-zinc-900 border border-zinc-800"}
                      `}/>
                      <span className={`
                        text-xs tracking-wide transition-colors duration-300
                        ${active ? "text-white font-bold" : "text-zinc-600 group-hover/btn:text-zinc-400"}
                        ${done && !active ? "line-through decoration-zinc-800 opacity-50" : ""}
                      `}>
                        {l.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-6 border-t border-zinc-900">
        <div className="text-[9px] text-zinc-700 tracking-[0.2em] uppercase flex justify-between">
          <span>{t('system_status')}</span>
          <span className="text-matrix animate-pulse">{t('online')}</span>
        </div>
      </div>
    </aside>
  );
};
