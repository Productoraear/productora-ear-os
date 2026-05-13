import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Circle, 
  Moon, 
  Sun, 
  Lightbulb, 
  Briefcase, 
  PenTool, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  ArrowLeft,
  GraduationCap,
  Clock,
  Layers,
  Layout,
  BarChart,
  Target,
  Zap,
  Anchor,
  ShieldAlert
} from 'lucide-react';

// --- Types ---

interface LessonContent {
  keyIdea: string;
  example: string;
  activity: string;
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

interface Lesson {
  title: string;
  duration: string;
  isCompleted: boolean;
  content: LessonContent;
}

interface Unit {
  title: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  level: string;
  duration: string;
  totalLessons: number;
  units: Unit[];
}

// --- Mock Data (Enriched from RFP Images) ---
const DEMO_COURSE: Course = {
  title: "Desarrollo de la Marca Artística",
  level: "Master",
  duration: "Fase de Cimentación",
  totalLessons: 6,
  units: [
    {
      title: "Mentalidad del eManager (Shark Mindset)",
      lessons: [
        {
          title: "El Síndrome del Impostor Artístico",
          duration: "20 min",
          isCompleted: false,
          content: {
            keyIdea: "El miedo a ser descubierto como un fraude anula el talento. Es el 'primo hermano' de alguien que ya conoces: Mr. Alien.",
            example: "Un artista exitoso que atribuye sus logros a la suerte y no a su estructura técnica, viviendo en un estado de alerta constante.",
            activity: "Identifica 3 momentos donde sentiste que no merecías el éxito y reescríbelos bajo la óptica de 'Estructura EAR'.",
            quiz: {
              question: "¿Cuál es el antídoto principal contra el síndrome del impostor según la metodología EAR?",
              options: ["Ignorarlo y seguir", "La Cimentación y el Autoconocimiento", "Pedir más valoraciones", "Cambiar de género musical"],
              correctAnswer: 1
            }
          }
        },
        {
          title: "El Síndrome del Objeto Brillante",
          duration: "15 min",
          isCompleted: false,
          content: {
            keyIdea: "Sentir que pierdes el foco por perseguir la última tendencia sin una estrategia de legado sólida. Te mata lentamente.",
            example: "Saltar de TikTok a un nuevo DAW o a un nuevo estilo solo porque es 'viral', abandonando tu núcleo creativo.",
            activity: "Haz una lista de 'distracciones actuales' y pásalas por el filtro de: ¿Esto construye mi legado a 10 años?",
            quiz: {
              question: "¿Qué síntoma define al 'Objeto Brillante'?",
              options: ["Tener muchas ideas", "Falta de energía en un punto concreto", "Comprar instrumentos caros", "Hacer muchas colaboraciones"],
              correctAnswer: 1
            }
          }
        }
      ]
    },
    {
      title: "Arquitectura de Conversión",
      lessons: [
        {
          title: "Tu Primer Embudo: El Sistema AIDA",
          duration: "25 min",
          isCompleted: false,
          content: {
            keyIdea: "Atención, Interés, Deseo, Acción. Es la ingeniería del comportamiento aplicada a tu audiencia.",
            example: "Un Reel impactante (Atención) que lleva a un artículo exclusivo (Interés) donde muestras tu proceso (Deseo) y vendes tu show (Acción).",
            activity: "Diseña un embudo de 4 pasos para tu próximo lanzamiento digital.",
            quiz: {
              question: "¿Qué significa la 'D' en el sistema AIDA?",
              options: ["Datos", "Diferenciación", "Deseo", "Dedicación"],
              correctAnswer: 2
            }
          }
        }
      ]
    }
  ]
};

interface ProfesorIAProps {
  onBack: () => void;
}

const ProfesorIA: React.FC<ProfesorIAProps> = ({ onBack }) => {
  // State
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermedio');
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentUnitIdx, setCurrentUnitIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  
  // Theme Toggle Logic
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Generate Course Logic
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        setCourse(DEMO_COURSE);
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `Actúa como un profesor experto en industria musical y negocios (basado en la metodología de Ami Bondía y el Shark Mindset). Crea un curso estructurado sobre el tema: "${topic}" para un nivel "${level}". Genera al menos 2 unidades con 2 lecciones cada una. El tono debe ser directo, profesional y enfocado en la 'Arquitectura de Legado'.`;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object" as any,
            properties: {
              title: { type: "string" as any },
              level: { type: "string" as any },
              duration: { type: "string" as any },
              totalLessons: { type: "number" as any },
              units: {
                type: "array" as any,
                items: {
                  type: "object" as any,
                  properties: {
                    title: { type: "string" as any },
                    lessons: {
                      type: "array" as any,
                      items: {
                        type: "object" as any,
                        properties: {
                          title: { type: "string" as any },
                          duration: { type: "string" as any },
                          isCompleted: { type: "boolean" as any },
                          content: {
                            type: "object" as any,
                            properties: {
                              keyIdea: { type: "string" as any },
                              example: { type: "string" as any },
                              activity: { type: "string" as any },
                              quiz: {
                                type: "object" as any,
                                properties: {
                                  question: { type: "string" as any },
                                  options: { type: "array" as any, items: { type: "string" as any } },
                                  correctAnswer: { type: "number" as any }
                                },
                                required: ["question", "options", "correctAnswer"]
                              }
                            },
                            required: ["keyIdea", "example", "activity", "quiz"]
                          }
                        },
                        required: ["title", "duration", "isCompleted", "content"]
                      }
                    }
                  },
                  required: ["title", "lessons"]
                }
              }
            },
            required: ["title", "level", "duration", "totalLessons", "units"]
          }
        },
      });

      const response = await result.response;
      const text = response.text();
      if (text) {
        const parsedCourse: Course = JSON.parse(text);
        setCourse(parsedCourse);
      } else {
        throw new Error("No data returned");
      }

    } catch (error) {
      console.error("Error generating course:", error);
      setCourse(DEMO_COURSE);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (uIdx: number, lIdx: number) => {
    setCurrentUnitIdx(uIdx);
    setCurrentLessonIdx(lIdx);
  };

  const markComplete = () => {
    if (!course) return;
    const newCourse = { ...course };
    newCourse.units[currentUnitIdx].lessons[currentLessonIdx].isCompleted = true;
    setCourse(newCourse);
    
    const currentUnit = newCourse.units[currentUnitIdx];
    if (currentLessonIdx < currentUnit.lessons.length - 1) {
      setCurrentLessonIdx(currentLessonIdx + 1);
    } else if (currentUnitIdx < newCourse.units.length - 1) {
      setCurrentUnitIdx(currentUnitIdx + 1);
      setCurrentLessonIdx(0);
    }
  };

  const continueWhereLeftOff = () => {
    if (!course) return;
    for (let u = 0; u < course.units.length; u++) {
      for (let l = 0; l < course.units[u].lessons.length; l++) {
        if (!course.units[u].lessons[l].isCompleted) {
          setCurrentUnitIdx(u);
          setCurrentLessonIdx(l);
          return;
        }
      }
    }
  };

  const calculateProgress = () => {
    if (!course) return 0;
    let completed = 0;
    let total = 0;
    course.units.forEach(u => u.lessons.forEach(l => {
      total++;
      if (l.isCompleted) completed++;
    }));
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  // --- RENDER ---

  if (!course) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
           <button onClick={onBack} className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
             darkMode ? 'text-white hover:bg-slate-800' : 'text-slate-800 hover:bg-slate-200'
           }`}>
              <ArrowLeft size={18} /> Volver
           </button>
           <button 
             onClick={() => setDarkMode(!darkMode)} 
             className={`p-3 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-ear-purple shadow-md'}`}
           >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>

        <div className="w-full max-w-xl p-8 mx-4">
          <div className={`rounded-3xl shadow-2xl p-8 md:p-12 transition-all ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-100'}`}>
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-tr from-ear-purple to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20 transform -rotate-3">
                <GraduationCap className="text-white w-10 h-10" />
              </div>
              <h1 className={`text-4xl font-display font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Profesor<span className="text-purple-500">IA</span>
              </h1>
              <p className={`text-lg font-body ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Construye tu <span className="text-ear-gold font-bold">Mentalidad de Legado</span> con IA.
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-8">
              <div className="space-y-2">
                <label className={`block text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  ¿Qué quieres dominar hoy?
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ej: Marca Personal, Embudos de Venta..."
                    className={`w-full pl-4 pr-4 py-4 rounded-xl outline-none border-2 transition-all font-medium ${
                      darkMode 
                        ? 'bg-slate-900 border-slate-700 text-white focus:border-purple-500 placeholder-slate-600' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-purple-500 placeholder-slate-400'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Nivel de Autoridad
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Principiante', 'Intermedio', 'Master'].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                        level === l 
                          ? 'border-purple-500 bg-purple-500/10 text-purple-500' 
                          : darkMode ? 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="group w-full py-4 bg-gradient-to-r from-ear-purple to-purple-700 hover:to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                    <span>Diseñando Estrategia...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Iniciar Clase Magistral</span>
                    <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentUnit = course.units[currentUnitIdx];
  const currentLesson = currentUnit.lessons[currentLessonIdx];
  const progress = calculateProgress();

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <header className={`h-20 flex-none border-b px-6 flex items-center justify-between z-30 transition-colors ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-6">
          <button onClick={onBack} className={`p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors`}>
            <ArrowLeft size={22} className={darkMode ? 'text-slate-300' : 'text-slate-600'} />
          </button>
          
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl leading-tight tracking-tight">{course.title}</h2>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider opacity-60 mt-1">
              <span className="flex items-center gap-1.5"><Target size={14} className="text-purple-500"/> {course.level}</span>
              <span className="hidden md:flex items-center gap-1.5"><Clock size={14} className="text-purple-500"/> {course.duration}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:block w-64">
             <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Progreso EAR</span>
                <span className="text-ear-gold">{progress}%</span>
             </div>
             <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-ear-gold to-yellow-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                  style={{ width: `${progress}%` }}
                ></div>
             </div>
          </div>

          <button 
             onClick={() => setDarkMode(!darkMode)} 
             className={`p-2.5 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-ear-purple hover:bg-slate-200'}`}
           >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <aside className={`w-80 flex-none border-r overflow-y-auto hidden lg:flex flex-col transition-colors ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="p-6">
            <h3 className="font-body font-bold text-xs uppercase tracking-[0.2em] opacity-40 mb-6">Unidades de Conocimiento</h3>
            <div className="space-y-8">
              {course.units.map((unit, uIdx) => (
                <div key={uIdx} className="relative">
                  <div className={`absolute left-[19px] top-8 bottom-0 w-0.5 ${uIdx === course.units.length - 1 ? 'hidden' : darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-sm shadow-sm border ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-ear-gold' : 'bg-white border-slate-200 text-purple-700'
                    }`}>
                      {uIdx + 1}
                    </div>
                    <h4 className="font-bold text-sm leading-tight flex-1 uppercase tracking-tight">{unit.title}</h4>
                  </div>

                  <div className="space-y-1 pl-4">
                    {unit.lessons.map((lesson, lIdx) => {
                      const isActive = uIdx === currentUnitIdx && lIdx === currentLessonIdx;
                      return (
                        <button
                          key={lIdx}
                          onClick={() => handleLessonSelect(uIdx, lIdx)}
                          className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all group relative overflow-hidden ${
                            isActive 
                              ? 'bg-ear-purple text-white shadow-lg shadow-purple-500/20' 
                              : darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className={`relative z-10 flex-none transition-colors ${
                            isActive ? 'text-white' : lesson.isCompleted ? 'text-green-500' : 'opacity-30'
                          }`}>
                            {lesson.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                          </div>
                          <div className="relative z-10 min-w-0">
                            <span className={`text-sm font-medium block truncate ${isActive ? 'text-white' : ''}`}>
                              {lesson.title}
                            </span>
                          </div>
                          {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-ear-gold"></div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-slate-50 dark:bg-slate-950">
          <div className="max-w-5xl mx-auto p-6 md:p-12 pb-40">
            
            {progress > 0 && progress < 100 && (
              <div 
                onClick={continueWhereLeftOff}
                className={`mb-8 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                darkMode ? 'bg-ear-purple/30 border border-ear-gold/30 hover:bg-ear-purple/40' : 'bg-purple-50 border border-purple-100 hover:bg-purple-100'
              }`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-ear-gold rounded-full text-black animate-pulse">
                    <Play size={16} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${darkMode ? 'text-ear-gold' : 'text-purple-700'}`}>Seguir Arquitectura</h4>
                    <p className="text-xs opacity-70">Salto a la siguiente lección estratégica</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ear-gold" />
              </div>
            )}

            <div className="mb-12 animate-fade-in-up">
               <div className="flex items-center gap-3 mb-4">
                 <span className="px-3 py-1 rounded-full bg-ear-gold text-black text-[10px] font-black uppercase tracking-wider shadow-sm">
                   Unidad {currentUnitIdx + 1}
                 </span>
                 <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                   Módulo {currentLessonIdx + 1}
                 </span>
               </div>
               
               <h1 className={`text-3xl md:text-5xl font-display font-black leading-tight mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                 {currentLesson.title}
               </h1>
               
               <div className={`h-1.5 w-24 rounded-full ${darkMode ? 'bg-ear-gold' : 'bg-ear-purple'}`}></div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              
              <div className={`group relative p-8 rounded-2xl border-l-4 shadow-sm hover:shadow-xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-slate-900 border-l-ear-gold border-t border-r border-b border-slate-800' 
                    : 'bg-white border-l-ear-gold border-t border-r border-b border-slate-100'
              }`}>
                <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <Lightbulb size={64} />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-yellow-400/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                    <Lightbulb size={24} />
                  </div>
                  <h3 className={`text-xl font-display font-bold uppercase tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>Idea Clave EAR</h3>
                </div>
                <p className={`text-lg md:text-2xl leading-relaxed font-medium relative z-10 italic ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  "{currentLesson.content.keyIdea}"
                </p>
              </div>

              <div className={`group p-8 rounded-2xl shadow-sm border hover:shadow-xl transition-all duration-300 ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Anchor size={24} />
                  </div>
                  <h3 className="text-lg font-display font-bold uppercase tracking-wide opacity-80">Referente / Ejemplo</h3>
                </div>
                <div className={`pl-6 border-l-2 ${darkMode ? 'border-blue-500/50 text-slate-300' : 'border-blue-200 text-slate-600'}`}>
                  <p className="text-lg leading-relaxed">{currentLesson.content.example}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className={`p-8 rounded-2xl shadow-sm border hover:shadow-lg transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
                      <PenTool size={22} />
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide opacity-80">Ejercicio Práctico</h3>
                  </div>
                  <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{currentLesson.content.activity}</p>
                </div>

                <div className={`p-8 rounded-2xl shadow-sm border hover:shadow-lg transition-all relative overflow-hidden ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
                }`}>
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <ShieldAlert size={100} />
                   </div>
                   <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className={`p-3 rounded-xl ${darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                      <HelpCircle size={22} />
                    </div>
                    <h3 className="text-lg font-display font-bold uppercase tracking-wide opacity-80">Test de Autoridad</h3>
                  </div>
                  <p className="font-bold mb-6 text-lg relative z-10 leading-snug">{currentLesson.content.quiz.question}</p>
                  <div className="space-y-3 relative z-10">
                    {currentLesson.content.quiz.options.map((opt, i) => (
                      <div key={i} className={`p-3 rounded-lg border text-sm font-medium transition-colors cursor-default ${
                        darkMode ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'
                      }`}>
                         <span className="mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span> {opt}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          <div className={`fixed bottom-0 right-0 left-0 lg:left-80 p-4 md:p-6 border-t flex justify-between items-center z-40 backdrop-blur-xl transition-colors duration-500 ${
            darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
          }`}>
             <div className="hidden md:flex flex-col">
               <span className="text-xs font-bold uppercase tracking-wider opacity-50">Estatus del Plano</span>
               <span className={`text-sm font-bold ${currentLesson.isCompleted ? 'text-green-500' : 'text-ear-gold'}`}>
                 {currentLesson.isCompleted ? "INFRAESTRUCTURA VALIDADA" : "EJECUTANDO OBRA..."}
               </span>
             </div>
             
             {!currentLesson.isCompleted ? (
               <button 
                onClick={markComplete}
                className="w-full md:w-auto px-8 py-4 bg-ear-gold text-black rounded-xl font-black uppercase tracking-widest shadow-lg shadow-ear-gold/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
               >
                 <CheckCircle size={20} /> 
                 <span>Validar y Avanzar</span>
                 <ChevronRight size={18} className="opacity-60" />
               </button>
             ) : (
               <button 
                disabled
                className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold shadow-inner cursor-default flex items-center justify-center gap-3 border ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-green-500' : 'bg-slate-100 border-slate-200 text-green-600'
                }`}
               >
                 <CheckCircle size={20} /> 
                 <span>Lección Completada</span>
               </button>
             )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default ProfesorIA;
