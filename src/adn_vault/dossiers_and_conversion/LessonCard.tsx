
import React from "react";
import { CourseLessonBlock, CourseBlockType } from "../../../types";
import { KAIcon } from "./Icon";

const getTheme = (type: CourseBlockType) => {
  switch (type) {
    case "idea":
      return {
        label: "CONCEPTO NUCLEAR",
        borderColor: "border-gold-500/40",
        iconColor: "text-gold-500",
        bgHover: "hover:bg-gold-500/5",
        monoPrefix: "01 // FILOSOFÍA"
      };
    case "ejemplo":
      return {
        label: "CASO DE ESTUDIO",
        borderColor: "border-zinc-800",
        iconColor: "text-zinc-500",
        bgHover: "hover:bg-zinc-900",
        monoPrefix: "02 // EVIDENCIA"
      };
    case "actividad":
      return {
        label: "PROTOCOLO DE EJECUCIÓN",
        borderColor: "border-white/30",
        iconColor: "text-white",
        bgHover: "hover:bg-white/5",
        monoPrefix: "03 // ACCIÓN"
      };
    case "test":
      return {
        label: "AUDITORÍA ESTRATÉGICA",
        borderColor: "border-matrix/40",
        iconColor: "text-matrix",
        bgHover: "hover:bg-matrix/5",
        monoPrefix: "04 // VALIDACIÓN"
      };
    default:
      return {
        label: "NODO",
        borderColor: "border-zinc-800",
        iconColor: "text-zinc-500",
        bgHover: "",
        monoPrefix: "00 // NULO"
      };
  }
};

export const LessonCard: React.FC<{ block: CourseLessonBlock }> = ({ block }) => {
  const theme = getTheme(block.type);

  return (
    <div className={`
      relative group flex flex-col gap-8
      p-10 border-l ${theme.borderColor}
      bg-transparent
      ${theme.bgHover} transition-all duration-700 ease-out
    `}>
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-900 pb-6 group-hover:border-zinc-800 transition-colors duration-500">
        <div className="space-y-2">
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600 uppercase group-hover:text-zinc-400 transition-colors">
            {theme.monoPrefix}
          </span>
          <h3 className="text-3xl font-serif text-zinc-200 leading-tight group-hover:text-white transition-colors duration-300">
            {block.title}
          </h3>
        </div>
        <div className={`${theme.iconColor} opacity-50 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110`}>
           <KAIcon name={block.type} size={28} />
        </div>
      </div>

      {/* Content */}
      <div className="text-zinc-400 font-sans font-light leading-relaxed text-lg whitespace-pre-line group-hover:text-zinc-300 transition-colors duration-500">
         {block.content}
      </div>

      {/* Interactive Elements (Test) */}
      {block.type === "test" && block.question && (
        <div className="mt-6 border border-zinc-800 p-8 bg-black">
          <div className="flex items-center gap-3 mb-8">
             <span className="w-1.5 h-1.5 bg-matrix rounded-full animate-pulse"/>
             <span className="font-mono text-[9px] text-matrix tracking-[0.2em] uppercase">Auditoría Activa</span>
          </div>
          <p className="font-serif text-xl text-white mb-8 italic">
            "{block.question.q}"
          </p>
          <div className="grid gap-3">
            {block.question.options.map((o, i) => (
              <button 
                key={i} 
                className={`
                  w-full text-left px-6 py-4 border transition-all duration-300
                  font-mono text-xs tracking-wide
                  ${i === block.question?.answerIndex 
                    ? "border-matrix bg-matrix/10 text-matrix shadow-[0_0_15px_rgba(0,255,65,0.1)]" 
                    : "border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 hover:bg-zinc-900"
                  }
                `}
              >
                <span className="mr-6 opacity-30">[{String.fromCharCode(65 + i)}]</span>
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
