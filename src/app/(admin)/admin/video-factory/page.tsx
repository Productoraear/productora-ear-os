"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { 
  Film, Wand2, Sliders, Type, Music, Video, 
  Volume2, Download, HardDrive, Cpu, 
  CheckCircle2, Loader2, Palette, Sparkles, Layers,
  Zap, Monitor, Smartphone, Square, RefreshCw,
  FolderOpen, ChevronDown, Dices, Plus, Trash2,
  Subtitles, Copy, ArrowLeft, ArrowRight,
  VolumeX, Play, Pause, Search, Clapperboard,
  Camera, Flame, HeartHandshake, FileCheck, BookmarkCheck
} from "lucide-react";
import { 
  EarOsPromo, 
  EarOsPromoProps, 
  defaultEarOsPromoProps, 
  defaultScenes, 
  SceneItem 
} from "@/remotion/EarOsPromo";
import { 
  REAL_SITUATIONS_CATALOG, 
  NARRATIVE_STORY_ARCS, 
  RealSituation 
} from "@/lib/video-factory/banana-prompts-library";
import { LocalAudioItem } from "@/app/api/admin/video-factory/local-audio/route";
import { FastH3OutputFile } from "@/app/api/admin/video-factory/fasth3/outputs/route";

// Dynamic import del Player para evitar SSR hydration mismatches
const RemotionPlayer = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[#050505] text-[#777] font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#ecb613] mr-3" />
        INICIALIZANDO MOTOR REMOTION NLE 60 FPS...
      </div>
    ),
  }
);

// Presets de Color DaVinci
const COLOR_PRESETS = [
  { id: "gold", name: "Gala Gold VIP", accent: "#ecb613", b: 1, c: 1.1, s: 1.15, temp: 20 },
  { id: "cyber", name: "Cyberpunk 2077", accent: "#00E5FF", b: 1.05, c: 1.25, s: 1.35, temp: -25 },
  { id: "ruby", name: "Ruby Luxury", accent: "#FF2B44", b: 0.95, c: 1.2, s: 1.2, temp: 15 },
  { id: "vimume", name: "VIMUME 40Hz", accent: "#10b981", b: 1, c: 1, s: 0.95, temp: -15 },
  { id: "noir", name: "Titanium Noir", accent: "#ffffff", b: 1, c: 1.3, s: 0.1, temp: 0 },
];

export default function VideoFactoryProDashboard() {
  // 1. Escenas del Storyboard (Secuencia de Situaciones Reales)
  const [scenes, setScenes] = useState<SceneItem[]>(defaultScenes);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);

  // 2. Props Globales para el Renderizador Remotion
  const [videoProps, setVideoProps] = useState<EarOsPromoProps>({
    ...defaultEarOsPromoProps,
    scenes: defaultScenes,
  });

  useEffect(() => {
    setVideoProps((prev) => ({
      ...prev,
      scenes,
    }));
  }, [scenes]);

  // 3. Pestaña Activa del Inspector NLE
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    "situations" | "prompt" | "storyboard" | "localaudio" | "graphics" | "captions" | "color" | "deliver"
  >("situations");

  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:5">("16:9");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // 4. Catálogo de Situaciones Reales & Arcos Narrativos
  const [situationsCategory, setSituationsCategory] = useState<string>("all");
  const [selectedSituation, setSelectedSituation] = useState<RealSituation>(REAL_SITUATIONS_CATALOG[0]);

  // 5. Audios & FX Locales del PC (D:\BRUTOS_AUDIO, etc.)
  const [localAudios, setLocalAudios] = useState<LocalAudioItem[]>([]);
  const [audioSearchQuery, setAudioSearchQuery] = useState("");
  const [audioCategoryFilter, setAudioCategoryFilter] = useState("all");
  const [isLoadingAudios, setIsLoadingAudios] = useState(false);
  const [currentlyPlayingAudio, setCurrentlyPlayingAudio] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Cargar audios locales desde la API
  const fetchLocalAudios = async (query = "", category = "all") => {
    try {
      setIsLoadingAudios(true);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category !== "all") params.set("category", category);
      params.set("limit", "80");

      const res = await fetch(`/api/admin/video-factory/local-audio?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLocalAudios(data.audios || []);
      }
    } catch (e) {
      console.error("Error al cargar audios locales:", e);
    } finally {
      setIsLoadingAudios(false);
    }
  };

  useEffect(() => {
    fetchLocalAudios(audioSearchQuery, audioCategoryFilter);
  }, [audioCategoryFilter]);

  // Reproductor de preescucha de Audio Local
  const togglePlayAudio = (streamUrl: string) => {
    if (!audioPlayerRef.current) return;

    if (currentlyPlayingAudio === streamUrl) {
      audioPlayerRef.current.pause();
      setCurrentlyPlayingAudio(null);
    } else {
      audioPlayerRef.current.src = streamUrl;
      audioPlayerRef.current.play();
      setCurrentlyPlayingAudio(streamUrl);
    }
  };

  // 6. FastH3 Outputs (H:\ComfyUI\output)
  const [fasth3Outputs, setFasth3Outputs] = useState<FastH3OutputFile[]>([]);
  const [isLoadingOutputs, setIsLoadingOutputs] = useState(false);

  const refreshFasth3Outputs = async () => {
    try {
      setIsLoadingOutputs(true);
      const res = await fetch("/api/admin/video-factory/fasth3/outputs");
      if (res.ok) {
        const data = await res.json();
        setFasth3Outputs(data.files || []);
      }
    } catch (e) {
      console.error("Error al escanear FastH3 outputs:", e);
    } finally {
      setIsLoadingOutputs(false);
    }
  };

  useEffect(() => {
    refreshFasth3Outputs();
  }, []);

  // 7. Estado de FastH3 Prompt AI
  const [fasth3Prompt, setFasth3Prompt] = useState(REAL_SITUATIONS_CATALOG[0].bananaPrompt);
  const [fasth3NegativePrompt, setFasth3NegativePrompt] = useState(REAL_SITUATIONS_CATALOG[0].negativePrompt);
  const [fasth3Soundscape, setFasth3Soundscape] = useState(REAL_SITUATIONS_CATALOG[0].bananaSoundscape);
  const [fasth3Music, setFasth3Music] = useState(REAL_SITUATIONS_CATALOG[0].bananaMusic);
  const [fasth3CameraMotion, setFasth3CameraMotion] = useState(REAL_SITUATIONS_CATALOG[0].cameraMotion);
  const [fasth3Duration, setFasth3Duration] = useState(5);
  const [fasth3Seed, setFasth3Seed] = useState(631153434);
  const [fasth3Resolution, setFasth3Resolution] = useState<"1344x768" | "768x1344" | "768x768">("1344x768");
  const [fasth3Status, setFasth3Status] = useState<"idle" | "generating" | "success" | "error">("idle");
  const [fasth3Log, setFasth3Log] = useState("");
  const [comfyConnected, setComfyConnected] = useState(false);

  // Comprobar estado de ComfyUI
  useEffect(() => {
    const checkComfy = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8190/system_stats", { signal: AbortSignal.timeout(2000) });
        if (res.ok) setComfyConnected(true);
      } catch {
        setComfyConnected(false);
      }
    };
    checkComfy();
    const interval = setInterval(checkComfy, 10000);
    return () => clearInterval(interval);
  }, []);

  // 8. Estado de Exportación Master Remotion CLI
  const [outDir, setOutDir] = useState("C:\\Users\\M2-W10\\Desktop");
  const [filename, setFilename] = useState("EDWIN_AGUDELO_SITUACIONES_REALES_60FPS.mp4");
  const [renderStatus, setRenderStatus] = useState<"idle" | "rendering" | "success" | "error">("idle");
  const [renderMessage, setRenderMessage] = useState("");
  const [exportedFilePath, setExportedFilePath] = useState("");

  // Duraciones calculadas
  const totalDurationSeconds = useMemo(() => {
    return scenes.reduce((acc, s) => acc + (s.durationInSeconds || 3), 0);
  }, [scenes]);

  const totalDurationFrames = useMemo(() => {
    return Math.max(120, totalDurationSeconds * 60);
  }, [totalDurationSeconds]);

  const compositionDimensions = useMemo(() => {
    switch (aspectRatio) {
      case "9:16":
        return { width: 1080, height: 1920 };
      case "1:1":
        return { width: 1080, height: 1080 };
      case "4:5":
        return { width: 1080, height: 1350 };
      case "16:9":
      default:
        return { width: 1920, height: 1080 };
    }
  }, [aspectRatio]);

  const activeScene = scenes[selectedSceneIndex] || scenes[0];

  // Actualizar Escena Activa
  const updateActiveScene = (partial: Partial<SceneItem>) => {
    setScenes((prev) => {
      const copy = [...prev];
      copy[selectedSceneIndex] = { ...copy[selectedSceneIndex], ...partial };
      return copy;
    });
  };

  const getSafeMediaUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.includes("commondatastorage.googleapis.com")) return undefined;
    if (url.trim() === "") return undefined;
    return url;
  };

  // Inyectar una Situación Real en la Escena Activa
  const applyRealSituationToActiveScene = (situation: RealSituation) => {
    setSelectedSituation(situation);
    
    // Inyectar prompt en FastH3
    setFasth3Prompt(situation.bananaPrompt);
    setFasth3NegativePrompt(situation.negativePrompt);
    setFasth3Soundscape(situation.bananaSoundscape);
    setFasth3Music(situation.bananaMusic);
    setFasth3CameraMotion(situation.cameraMotion);

    // Actualizar escena activa con la situación real
    updateActiveScene({
      name: situation.title,
      durationInSeconds: situation.durationSeconds,
      titleText: situation.title.toUpperCase(),
      subtitleText: situation.narrativeSubtitle,
      badgeText: `${situation.cameraGear} // ${situation.lensSetup.split(",")[0]}`,
      captionText: situation.storytellingCaption,
      transition: situation.transition,
      accentColor: situation.previewColor,
      mediaUrl: getSafeMediaUrl(situation.previewVideoUrl),
      mediaType: "video",
      mediaOpacity: 0.65,
      kenBurns: true,
      titleFont: situation.category === "vimume-clinico" ? "Cinzel" : "Syne",
      animationStyle: "cinematic",
    });
  };

  // Inyectar un Arco Narrativo Completo (Secuencia de 3-4 Situaciones)
  const applyNarrativeStoryArc = (arc: typeof NARRATIVE_STORY_ARCS[0]) => {
    const matchedSituations = arc.situationIds
      .map((id) => REAL_SITUATIONS_CATALOG.find((s) => s.id === id))
      .filter(Boolean) as RealSituation[];

    if (matchedSituations.length === 0) return;

    const newScenes: SceneItem[] = matchedSituations.map((sit, idx) => ({
      id: `scene-arc-${idx}-${Date.now()}`,
      name: `0${idx + 1}. ${sit.title}`,
      durationInSeconds: sit.durationSeconds,
      titleText: sit.title.toUpperCase(),
      subtitleText: sit.narrativeSubtitle,
      badgeText: `${sit.cameraGear} // ${sit.lensSetup.split(",")[0]}`,
      captionText: sit.storytellingCaption,
      transition: sit.transition,
      accentColor: sit.previewColor,
      mediaUrl: getSafeMediaUrl(sit.previewVideoUrl),
      mediaType: "video",
      mediaOpacity: 0.65,
      kenBurns: true,
      titleFont: sit.category === "vimume-clinico" ? "Cinzel" : "Syne",
      animationStyle: "cinematic",
    }));

    setScenes(newScenes);
    setSelectedSceneIndex(0);
    applyRealSituationToActiveScene(matchedSituations[0]);
  };

  // Asignar Audio Local del PC
  const assignLocalAudio = (audio: LocalAudioItem, target: "bgm" | "fx") => {
    if (target === "bgm") {
      setVideoProps((prev) => ({
        ...prev,
        soundtrackUrl: audio.streamUrl,
        soundtrackMuted: false,
      }));
    } else {
      updateActiveScene({
        audioFxUrl: audio.streamUrl,
      });
    }
  };

  // Reordenar Escenas
  const moveScene = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === scenes.length - 1) return;

    const targetIdx = direction === "left" ? index - 1 : index + 1;
    setScenes((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
    setSelectedSceneIndex(targetIdx);
  };

  // Duplicar Escena
  const duplicateScene = (index: number) => {
    const original = scenes[index];
    const clone: SceneItem = {
      ...original,
      id: `scene-${Date.now()}`,
      name: `${original.name} (Copia)`,
    };
    setScenes((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, clone);
      return copy;
    });
    setSelectedSceneIndex(index + 1);
  };

  // Añadir Escena
  const addScene = () => {
    const sit = REAL_SITUATIONS_CATALOG[scenes.length % REAL_SITUATIONS_CATALOG.length];
    const newIdx = scenes.length + 1;
    const newScene: SceneItem = {
      id: `scene-${Date.now()}`,
      name: `0${newIdx}. ${sit.title}`,
      durationInSeconds: sit.durationSeconds,
      titleText: sit.title.toUpperCase(),
      subtitleText: sit.narrativeSubtitle,
      badgeText: sit.cameraGear,
      captionText: sit.storytellingCaption,
      transition: sit.transition,
      accentColor: sit.previewColor,
      mediaUrl: getSafeMediaUrl(sit.previewVideoUrl),
      mediaType: "video",
      mediaOpacity: 0.65,
      kenBurns: true,
      titleFont: "Syne",
      animationStyle: "cinematic",
    };
    setScenes((prev) => [...prev, newScene]);
    setSelectedSceneIndex(scenes.length);
  };

  // Eliminar Escena
  const removeScene = (index: number) => {
    if (scenes.length <= 1) return;
    setScenes((prev) => prev.filter((_, i) => i !== index));
    if (selectedSceneIndex >= index && selectedSceneIndex > 0) {
      setSelectedSceneIndex(selectedSceneIndex - 1);
    }
  };

  // Disparar Renderizado con Remotion CLI
  const handleTriggerRender = async () => {
    try {
      setRenderStatus("rendering");
      setRenderMessage("Renderizando situaciones reales a 60 FPS con Remotion CLI...");

      const response = await fetch("/api/admin/video-factory/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          props: {
            ...videoProps,
            scenes,
            aspectRatio,
          },
          outDir,
          filename,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Error al renderizar en el servidor");
      }

      setRenderStatus("success");
      setRenderMessage(data.message || "Video exportado con éxito a 60 FPS.");
      setExportedFilePath(data.outputFile || `${outDir}\\${filename}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setRenderStatus("error");
      setRenderMessage(`Error de render: ${msg}`);
    }
  };

  // Disparar Generación Neuronal FastH3 (AMD RX 7900 XTX 24GB)
  const handleTriggerFastH3 = async () => {
    try {
      setFasth3Status("generating");
      setFasth3Log("Disparando Banana Prompt hacia FastH3 en ComfyUI (:8190)...");

      const [w, h] = fasth3Resolution.split("x").map(Number);
      const enhancedPrompt = `${fasth3Prompt}. Camera motion: ${fasth3CameraMotion}. (Negative: ${fasth3NegativePrompt})`;

      const res = await fetch("/api/admin/video-factory/fasth3/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          soundscape: fasth3Soundscape,
          music: fasth3Music,
          width: w,
          height: h,
          durationSeconds: fasth3Duration,
          seed: fasth3Seed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Fallo en la conexión con FastH3");
      }

      setFasth3Status("success");
      setFasth3Log(`Generación iniciada con éxito. ID Ticket: ${data.promptId}. Semilla: ${data.seed}`);
      setTimeout(() => refreshFasth3Outputs(), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al comunicar con FastH3";
      setFasth3Status("error");
      setFasth3Log(msg);
    }
  };

  // Situaciones filtradas por categoría
  const filteredSituations = useMemo(() => {
    if (situationsCategory === "all") return REAL_SITUATIONS_CATALOG;
    return REAL_SITUATIONS_CATALOG.filter((s) => s.category === situationsCategory);
  }, [situationsCategory]);

  return (
    <div 
      className="h-screen bg-[#020202] text-[#A0A0A0] font-sans flex flex-col selection:bg-[#ecb613] selection:text-black overflow-hidden" 
      onClick={() => setActiveMenu(null)}
    >
      {/* Audio oculto para preview */}
      <audio ref={audioPlayerRef} onEnded={() => setCurrentlyPlayingAudio(null)} className="hidden" />

      {/* 1. Header Superior S-Class */}
      <header className="h-12 bg-[#09090c] border-b border-[#1c1c24] flex items-center justify-between px-4 shrink-0 z-40 relative">
        <div className="flex items-center gap-3">
          <Clapperboard className="w-5 h-5 text-[#ecb613]" />
          <span className="font-extrabold text-white tracking-widest text-xs">
            EAR OS // REAL SITUATIONS STUDIO S-CLASS
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30 font-mono">
            BANANA PROMPTS + 1.516 LOCAL FX
          </span>

          {/* Menú de Arcos Narrativos */}
          <div className="hidden lg:flex items-center gap-2 ml-4 text-xs relative" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === "arcs" ? null : "arcs")}
                className="px-2.5 py-1 rounded bg-[#161622] hover:bg-[#202030] text-white border border-[#2a2a3a] text-xs transition-colors flex items-center gap-1.5 font-bold"
              >
                <Layers className="w-3.5 h-3.5 text-[#ecb613]" />
                Arcos Narrativos Reales <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
              {activeMenu === "arcs" && (
                <div className="absolute top-8 left-0 w-80 bg-[#0f0f15] border border-[#262636] rounded-lg shadow-2xl p-1.5 z-50 text-xs text-white space-y-1">
                  {NARRATIVE_STORY_ARCS.map((arc) => (
                    <button 
                      key={arc.id}
                      onClick={() => { applyNarrativeStoryArc(arc); setActiveMenu(null); }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#1f1f2e] text-[#ccc] hover:text-white flex flex-col transition-colors"
                    >
                      <span className="font-bold text-white text-xs">{arc.name}</span>
                      <span className="text-[10px] text-[#888]">{arc.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a 
              href="file:///C:/Users/M2-W10/Desktop" 
              target="_blank" 
              rel="noreferrer"
              className="px-2.5 py-1 rounded hover:bg-white/5 text-[#999] hover:text-white flex items-center gap-1.5 transition-colors"
              title="Abrir carpeta de exportaciones en Desktop"
            >
              <FolderOpen className="w-3.5 h-3.5 text-[#ecb613]" /> Salidas en Desktop
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 bg-[#111116] border border-[#22222a] rounded text-[10px] font-mono flex items-center gap-2 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" /> RX 7900 XTX 24GB
          </div>
          
          <a
            href="http://127.0.0.1:8190"
            target="_blank"
            rel="noreferrer"
            className={`px-2.5 py-1 border rounded text-[10px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
              comfyConnected 
                ? "bg-green-950/40 border-green-500/50 text-green-300 hover:bg-green-900/60" 
                : "bg-red-950/40 border-red-500/50 text-red-300 hover:bg-red-900/60"
            }`}
            title="Abrir ComfyUI FastH3 (Puerto 8190)"
          >
            <div className={`w-2 h-2 rounded-full ${comfyConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span>FASTH3 :8190 {comfyConnected ? "ONLINE" : "OFFLINE"}</span>
          </a>

          <button 
            onClick={() => setActiveInspectorTab("deliver")}
            className="px-3.5 py-1.5 bg-[#ecb613] hover:bg-[#ffe359] text-black text-xs font-black tracking-wider uppercase rounded shadow-[0_0_15px_rgba(236,182,19,0.35)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> RENDER MASTER
          </button>
        </div>
      </header>

      {/* 2. Cuerpo Central */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* PANEL IZQUIERDO: DIRECTOR DE SITUACIONES REALES (BANANA PROMPTS XYZ) */}
        <div className="w-80 bg-[#07070a] border-r border-[#1c1c24] flex flex-col shrink-0 overflow-hidden">
          
          <div className="h-10 bg-[#0c0c10] border-b border-[#1c1c24] flex items-center justify-between px-3">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[#ecb613]" /> Situaciones Reales (Banana)
            </span>
            <span className="text-[9px] font-mono text-[#888]">{filteredSituations.length} situaciones</span>
          </div>

          {/* Filtro por Categoría de Situación */}
          <div className="p-2 border-b border-[#1c1c24] flex gap-1 overflow-x-auto scrollbar-none bg-[#0a0a0f]">
            {[
              { id: "all", label: "Todas" },
              { id: "gala-solista", label: "Gala Piano" },
              { id: "bodas-vip", label: "Bodas VIP" },
              { id: "vimume-clinico", label: "VIMUME 40Hz" },
              { id: "b2b-licitaciones", label: "B2B Contrato" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSituationsCategory(cat.id)}
                className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 transition-colors ${
                  situationsCategory === cat.id
                    ? "bg-[#ecb613] text-black"
                    : "text-[#888] hover:text-white hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lista de Tarjetas de Situaciones Reales */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
            {filteredSituations.map((sit) => {
              const isSelected = selectedSituation.id === sit.id;
              return (
                <div
                  key={sit.id}
                  onClick={() => applyRealSituationToActiveScene(sit)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer space-y-2 group ${
                    isSelected
                      ? "bg-[#141420] border-[#ecb613] shadow-md"
                      : "bg-[#0b0b10] border-[#1c1c28] hover:border-[#333346]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs group-hover:text-[#ecb613] transition-colors leading-snug">
                      {sit.title}
                    </span>
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{ backgroundColor: sit.previewColor }} 
                    />
                  </div>

                  <p className="text-[10px] text-[#888] leading-tight">
                    {sit.narrativeSubtitle}
                  </p>

                  <div className="p-1.5 bg-[#07070a] rounded border border-white/5 text-[9px] font-mono text-[#aaa] space-y-0.5">
                    <div className="text-cyan-400 truncate">🎥 {sit.cameraGear}</div>
                    <div className="text-purple-300 truncate">🔍 {sit.lensSetup}</div>
                    <div className="text-[#888] truncate">💡 {sit.lightingSetup}</div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[9px] text-[#666] font-mono">{sit.durationSeconds}s • LUT: {sit.colorLUT.toUpperCase()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        applyRealSituationToActiveScene(sit);
                        setActiveInspectorTab("prompt");
                      }}
                      className="px-2 py-0.5 bg-purple-900/50 hover:bg-purple-700 text-purple-200 border border-purple-500/30 rounded text-[9px] font-bold flex items-center gap-1"
                    >
                      <Wand2 className="w-2.5 h-2.5" /> Banana Prompt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen del Pie */}
          <div className="p-2.5 bg-[#09090d] border-t border-[#1c1c24] text-[10px] text-[#666] font-mono flex items-center justify-between">
            <span>SITUACIÓN ACTIVA:</span>
            <span className="text-[#ecb613] font-bold truncate max-w-[150px]">{selectedSituation.title}</span>
          </div>

        </div>

        {/* CENTRO: CANVAS MONITOR & MULTI-TRACK TIMELINE */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#030305]">
          
          {/* Barra Superior del Canvas */}
          <div className="h-9 bg-[#08080c] border-b border-[#1c1c24] flex items-center justify-between px-4 text-xs font-mono">
            <div className="flex items-center gap-4 text-[#888]">
              <span className="text-white font-bold flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#ecb613]" /> 
                CANVAS: {compositionDimensions.width}x{compositionDimensions.height} ({aspectRatio})
              </span>
              <span>@ 60 FPS MASTER</span>
              <span className="text-cyan-400">ESCENA {selectedSceneIndex + 1}/{scenes.length}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#121218] p-1 rounded border border-[#22222c]">
              <button
                onClick={() => setAspectRatio("16:9")}
                className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${
                  aspectRatio === "16:9" ? "bg-[#ecb613] text-black font-bold" : "text-[#888] hover:text-white"
                }`}
                title="16:9 Horizontal"
              >
                <Monitor className="w-3 h-3" /> 16:9
              </button>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${
                  aspectRatio === "9:16" ? "bg-[#ecb613] text-black font-bold" : "text-[#888] hover:text-white"
                }`}
                title="9:16 Vertical"
              >
                <Smartphone className="w-3 h-3" /> 9:16
              </button>
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${
                  aspectRatio === "1:1" ? "bg-[#ecb613] text-black font-bold" : "text-[#888] hover:text-white"
                }`}
                title="1:1 Cuadrado"
              >
                <Square className="w-3 h-3" /> 1:1
              </button>
            </div>
          </div>

          {/* Reproductor Remotion en Vivo */}
          <div className="flex-1 relative flex items-center justify-center p-4 bg-[radial-gradient(#151520_1px,transparent_1px)] [background-size:24px_24px] overflow-hidden">
            <div 
              className="relative shadow-[0_0_60px_rgba(0,0,0,0.95)] border border-[#2a2a38] rounded-xl overflow-hidden bg-black flex items-center justify-center"
              style={{
                width: aspectRatio === "9:16" ? "330px" : aspectRatio === "1:1" ? "500px" : "840px",
                maxWidth: "96%",
                maxHeight: "90%",
                aspectRatio: aspectRatio === "9:16" ? "9/16" : aspectRatio === "1:1" ? "1/1" : "16/9",
              }}
            >
              <RemotionPlayer
                component={EarOsPromo}
                inputProps={{
                  ...videoProps,
                  scenes,
                  aspectRatio,
                }}
                durationInFrames={totalDurationFrames}
                compositionWidth={compositionDimensions.width}
                compositionHeight={compositionDimensions.height}
                fps={60}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                controls
                autoPlay
                loop
              />
            </div>
          </div>

          {/* TIMELINE MULTI-TRACK NLE */}
          <div className="h-56 bg-[#09090d] border-t border-[#1c1c24] flex flex-col shrink-0">
            
            {/* Barra de Controles del Timeline */}
            <div className="h-9 border-b border-[#1c1c24] bg-[#0c0c12] flex items-center justify-between px-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <button
                  onClick={addScene}
                  className="px-2.5 py-1 bg-[#1a1a26] hover:bg-[#252538] text-white border border-[#2d2d3e] rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3 text-[#ecb613]" /> Nueva Situación
                </button>
                <button
                  onClick={() => duplicateScene(selectedSceneIndex)}
                  className="px-2 py-1 bg-[#14141e] hover:bg-[#1f1f2e] text-[#ccc] border border-[#242434] rounded text-[11px] flex items-center gap-1"
                  title="Duplicar escena actual"
                >
                  <Copy className="w-3 h-3" /> Duplicar
                </button>
                <button
                  onClick={() => moveScene(selectedSceneIndex, "left")}
                  disabled={selectedSceneIndex === 0}
                  className="p-1 bg-[#14141e] hover:bg-[#1f1f2e] text-[#ccc] border border-[#242434] rounded disabled:opacity-30"
                  title="Mover a la izquierda"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => moveScene(selectedSceneIndex, "right")}
                  disabled={selectedSceneIndex === scenes.length - 1}
                  className="p-1 bg-[#14141e] hover:bg-[#1f1f2e] text-[#ccc] border border-[#242434] rounded disabled:opacity-30"
                  title="Mover a la derecha"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
                {scenes.length > 1 && (
                  <button
                    onClick={() => removeScene(selectedSceneIndex)}
                    className="p-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/40 rounded"
                    title="Eliminar escena"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-[#888]">
                <span>TIMECODE: <strong className="text-white">00:00:00:00</strong></span>
                <span>TOTAL: <strong className="text-[#ecb613]">{totalDurationSeconds}s ({totalDurationFrames}f)</strong></span>
              </div>
            </div>

            {/* Pistas Multi-Track */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono">
              
              {/* PISTA V1: SITUACIONES REALES / FOOTAGE */}
              <div className="flex h-11 bg-[#101017] rounded border border-[#1e1e28] overflow-hidden">
                <div className="w-32 bg-[#151520] border-r border-[#22222e] flex items-center px-2 gap-2 text-[10px] font-bold text-white/80 shrink-0">
                  <Video className="w-3.5 h-3.5 text-cyan-400" /> V1 SITUACIÓN
                </div>
                <div className="flex-1 relative bg-[#07070a] flex items-center px-1 gap-1">
                  {scenes.map((sc, i) => {
                    const widthPercent = (sc.durationInSeconds / totalDurationSeconds) * 100;
                    const isSelected = selectedSceneIndex === i;
                    return (
                      <div
                        key={sc.id || i}
                        onClick={() => setSelectedSceneIndex(i)}
                        style={{ width: `${widthPercent}%` }}
                        className={`h-8 rounded px-2 flex items-center justify-between text-[10px] cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-cyan-900/70 border-cyan-400 text-white font-bold shadow-sm"
                            : "bg-cyan-950/30 border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50"
                        }`}
                      >
                        <div className="truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span className="truncate">{sc.name}</span>
                        </div>
                        <span className="text-[9px] opacity-75">{sc.durationInSeconds}s</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PISTA V2: SUBTÍTULOS NARRATIVOS (CAPTIONS) */}
              <div className="flex h-8 bg-[#101017] rounded border border-[#1e1e28] overflow-hidden">
                <div className="w-32 bg-[#151520] border-r border-[#22222e] flex items-center px-2 gap-2 text-[10px] font-bold text-white/80 shrink-0">
                  <Subtitles className="w-3 h-3 text-[#ecb613]" /> V2 NARRATIVA
                </div>
                <div className="flex-1 relative bg-[#07070a] flex items-center px-1 gap-1">
                  {scenes.map((sc, i) => {
                    const widthPercent = (sc.durationInSeconds / totalDurationSeconds) * 100;
                    return (
                      <div
                        key={sc.id || i}
                        style={{ width: `${widthPercent}%` }}
                        className="h-6 bg-[#ecb613]/15 border border-[#ecb613]/40 rounded px-2 flex items-center text-[9px] text-[#ecb613] truncate"
                      >
                        {sc.captionText || "SIN NARRATIVA"}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PISTA A1: MASTER SOUNDTRACK */}
              <div className="flex h-7 bg-[#101017] rounded border border-[#1e1e28] overflow-hidden">
                <div className="w-32 bg-[#151520] border-r border-[#22222e] flex items-center px-2 gap-2 text-[10px] font-bold text-white/80 shrink-0">
                  <Music className="w-3 h-3 text-green-400" /> A1 MASTER BGM
                </div>
                <div className="flex-1 relative bg-[#07070a] flex items-center px-2">
                  <div className="w-full h-5 bg-green-950/40 border border-green-500/40 rounded px-2 flex items-center justify-between text-[9px] text-green-300">
                    <span className="truncate">Master_Soundtrack_Stereo.wav (Auto-Ducking -14dB)</span>
                    <span className="font-bold">{videoProps.soundtrackMuted ? "MUTED" : "100%"}</span>
                  </div>
                </div>
              </div>

              {/* PISTA A2: FX LOCALES DEL PC POR ESCENA */}
              <div className="flex h-7 bg-[#101017] rounded border border-[#1e1e28] overflow-hidden">
                <div className="w-32 bg-[#151520] border-r border-[#22222e] flex items-center px-2 gap-2 text-[10px] font-bold text-white/80 shrink-0">
                  <Volume2 className="w-3 h-3 text-purple-400" /> A2 LOCAL FX
                </div>
                <div className="flex-1 relative bg-[#07070a] flex items-center px-1 gap-1">
                  {scenes.map((sc, i) => {
                    const widthPercent = (sc.durationInSeconds / totalDurationSeconds) * 100;
                    return (
                      <div
                        key={sc.id || i}
                        style={{ width: `${widthPercent}%` }}
                        className="h-5 bg-purple-950/30 border border-purple-500/30 rounded px-2 flex items-center text-[9px] text-purple-300 truncate"
                      >
                        {sc.audioFxUrl ? sc.audioFxUrl.split("/").pop() : "Sin FX asignado"}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* PANEL DERECHO: INSPECTOR NLE */}
        <div className="w-[450px] bg-[#08080c] border-l border-[#1c1c24] flex flex-col shrink-0 overflow-hidden">
          
          {/* Pestañas del Inspector */}
          <div className="h-11 bg-[#0d0d12] border-b border-[#1c1c24] flex items-center px-2 gap-1 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: "situations", label: "Situación", icon: Camera },
              { id: "prompt", label: "FastH3 Prompt", icon: Wand2, highlight: true },
              { id: "localaudio", label: "Audios PC (D:\\)", icon: Volume2 },
              { id: "storyboard", label: "Ajustes V1", icon: Layers },
              { id: "graphics", label: "Tipografía", icon: Type },
              { id: "captions", label: "Captions", icon: Subtitles },
              { id: "color", label: "Color DaVinci", icon: Palette },
              { id: "deliver", label: "Deliver", icon: Download },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeInspectorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveInspectorTab(tab.id as typeof activeInspectorTab)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? tab.highlight 
                        ? "bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                        : "bg-[#ecb613] text-black shadow-sm"
                      : tab.highlight
                        ? "text-purple-400 border border-purple-500/30 hover:bg-purple-950/40"
                        : "text-[#888] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Contenido Dinámico */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            
            {/* 1. TAB: DETALLE DE LA SITUACIÓN REAL ACTIVA */}
            {activeInspectorTab === "situations" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#11111a] border border-[#222238] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      <Clapperboard className="w-4 h-4 text-[#ecb613]" /> {selectedSituation.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30">
                      SITUACIÓN REAL
                    </span>
                  </div>
                  <p className="text-[11px] text-[#ccc] leading-relaxed">
                    {selectedSituation.narrativeSubtitle}
                  </p>
                </div>

                <div className="space-y-2 p-3 bg-[#0a0a10] border border-[#1a1a24] rounded-lg">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">Ficha Técnica Cinematográfica</span>
                  <div className="text-[11px] space-y-1">
                    <div><strong className="text-cyan-400">Cámara:</strong> {selectedSituation.cameraGear}</div>
                    <div><strong className="text-purple-300">Óptica:</strong> {selectedSituation.lensSetup}</div>
                    <div><strong className="text-yellow-300">Iluminación:</strong> {selectedSituation.lightingSetup}</div>
                    <div><strong className="text-green-300">Movimiento:</strong> {selectedSituation.cameraMotion}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Subtítulo Narrativo (Storytelling)</label>
                  <textarea
                    rows={2}
                    value={activeScene.captionText || selectedSituation.storytellingCaption}
                    onChange={(e) => updateActiveScene({ captionText: e.target.value })}
                    className="w-full bg-[#121218] border border-[#242432] rounded p-2.5 text-white text-xs outline-none focus:border-[#ecb613]"
                  />
                </div>

                <button
                  onClick={() => setActiveInspectorTab("prompt")}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wand2 className="w-4 h-4" /> Inspeccionar Banana Prompt Completo
                </button>
              </div>
            )}

            {/* 2. TAB: PROMPT AI STUDIO (BANANA PROMPTS XYZ EN RX 7900 XTX) */}
            {activeInspectorTab === "prompt" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#11111c] border border-purple-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-400" /> FastH3 Banana Prompt Studio
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                      RDNA3 24GB // 8 PASOS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#999]">
                    Generación directa en AMD RX 7900 XTX 24GB VRAM usando el modelo Minimax FastH3 (38.4 GB en H:).
                  </p>
                </div>

                {/* Banana Prompt Visual */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#ecb613]" /> Banana Prompt Visual (Situación Real)
                  </label>
                  <textarea
                    rows={5}
                    value={fasth3Prompt}
                    onChange={(e) => setFasth3Prompt(e.target.value)}
                    className="w-full bg-[#121218] border border-[#262638] rounded-lg p-3 text-white text-xs outline-none focus:border-purple-500 leading-relaxed font-mono"
                  />
                </div>

                {/* Negative Prompt */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                    Negative Prompt Anti-AI Slop
                  </label>
                  <input
                    type="text"
                    value={fasth3NegativePrompt}
                    onChange={(e) => setFasth3NegativePrompt(e.target.value)}
                    className="w-full bg-[#121218] border border-[#262638] rounded px-3 py-1.5 text-white text-xs font-mono"
                  />
                </div>

                {/* Soundscape & Music */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#888] uppercase">Paisaje Sonoro (Soundscape)</label>
                    <input
                      type="text"
                      value={fasth3Soundscape}
                      onChange={(e) => setFasth3Soundscape(e.target.value)}
                      className="w-full bg-[#121218] border border-[#262638] rounded px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-[#888] uppercase">Música Minimax</label>
                    <input
                      type="text"
                      value={fasth3Music}
                      onChange={(e) => setFasth3Music(e.target.value)}
                      className="w-full bg-[#121218] border border-[#262638] rounded px-2.5 py-1.5 text-white text-xs"
                    />
                  </div>
                </div>

                {/* Parámetros de Generación */}
                <div className="p-3 bg-[#0e0e16] border border-[#1e1e2c] rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#888] uppercase">Resolución FastH3</label>
                      <select 
                        value={fasth3Resolution}
                        onChange={(e) => setFasth3Resolution(e.target.value as typeof fasth3Resolution)}
                        className="w-full bg-[#14141e] border border-[#29293a] rounded p-1.5 text-white text-[11px]"
                      >
                        <option value="1344x768">1344x768 (16:9)</option>
                        <option value="768x1344">768x1344 (9:16)</option>
                        <option value="768x768">768x768 (1:1)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-[#888] uppercase">Duración</label>
                      <select 
                        value={fasth3Duration}
                        onChange={(e) => setFasth3Duration(Number(e.target.value))}
                        className="w-full bg-[#14141e] border border-[#29293a] rounded p-1.5 text-white text-[11px]"
                      >
                        <option value={3}>3s (~49 frames)</option>
                        <option value={5}>5s (~81 frames)</option>
                        <option value={8}>8s (~129 frames)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#888]">Semilla:</span>
                      <span className="font-mono text-white text-xs">{fasth3Seed}</span>
                    </div>
                    <button
                      onClick={() => setFasth3Seed(Math.floor(Math.random() * 900000000) + 100000000)}
                      className="px-2 py-1 bg-[#1a1a26] hover:bg-[#252538] border border-[#333346] rounded text-[10px] text-[#ccc] flex items-center gap-1 cursor-pointer"
                    >
                      <Dices className="w-3 h-3 text-[#ecb613]" /> Aleatoria
                    </button>
                  </div>
                </div>

                {/* Botón Disparar */}
                <button
                  onClick={handleTriggerFastH3}
                  disabled={fasth3Status === "generating"}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {fasth3Status === "generating" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> GENERANDO SITUACIÓN REAL EN RX 7900 XTX...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-yellow-300" /> DISPARAR GENERACIÓN FASTH3 (8 PASOS)
                    </>
                  )}
                </button>

                {fasth3Status === "success" && (
                  <div className="p-3 bg-green-950/40 border border-green-500/60 rounded-lg text-green-300 text-xs space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Generación Disparada
                    </div>
                    <p className="text-[11px] text-green-200/80">{fasth3Log}</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. TAB: EXPLORADOR DE AUDIOS & FX LOCALES DEL PC (D:\ 1.516 CLIPS) */}
            {activeInspectorTab === "localaudio" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#11111c] border border-purple-500/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-purple-400" /> Bóveda de Audios & FX Locales
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-500/30">
                      D:\ 1.516 CLIPS
                    </span>
                  </div>
                  <p className="text-[11px] text-[#999]">
                    Explora y reproduce instantáneamente tus miles de pistas de trabajo, FX y sintetizadores locales de este PC.
                  </p>
                </div>

                {/* Buscador de Audios */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#777]" />
                  <input
                    type="text"
                    value={audioSearchQuery}
                    onChange={(e) => {
                      setAudioSearchQuery(e.target.value);
                      fetchLocalAudios(e.target.value, audioCategoryFilter);
                    }}
                    placeholder="Buscar entre miles de clips (808, brass, bass, gold, ding)..."
                    className="w-full bg-[#121218] border border-[#242432] rounded-lg pl-9 pr-3 py-2 text-white text-xs outline-none focus:border-purple-500"
                  />
                </div>

                {/* Categorías Rápidas de Audio */}
                <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1">
                  {[
                    { id: "all", label: "Todos" },
                    { id: "bass", label: "Bajos / 808" },
                    { id: "keys", label: "Teclas / Chords" },
                    { id: "brass", label: "Metales / Brass" },
                    { id: "drums", label: "Drums" },
                    { id: "fx", label: "FX & Sintes" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setAudioCategoryFilter(c.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold shrink-0 transition-colors ${
                        audioCategoryFilter === c.id
                          ? "bg-purple-600 text-white"
                          : "bg-[#14141e] text-[#888] hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Lista de Clips de Audio Locales */}
                <div className="space-y-1.5 max-h-80 overflow-y-auto">
                  {isLoadingAudios ? (
                    <div className="p-4 text-center text-[#777] text-xs flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      Cargando catálogo local del PC...
                    </div>
                  ) : localAudios.length === 0 ? (
                    <div className="p-4 text-center text-[#777] text-xs">
                      No se encontraron audios que coincidan con la búsqueda.
                    </div>
                  ) : (
                    localAudios.map((audio) => {
                      const isPlaying = currentlyPlayingAudio === audio.streamUrl;
                      return (
                        <div
                          key={audio.fullPath}
                          className="p-2 bg-[#0c0c14] border border-[#1e1e2c] hover:border-purple-500/50 rounded-lg text-xs flex items-center justify-between transition-colors group"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <button
                              onClick={() => togglePlayAudio(audio.streamUrl)}
                              className={`p-1.5 rounded-full transition-colors shrink-0 ${
                                isPlaying ? "bg-purple-500 text-white" : "bg-[#181824] text-[#aaa] group-hover:text-white"
                              }`}
                              title={isPlaying ? "Pausar" : "Escuchar"}
                            >
                              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            </button>
                            <div className="truncate">
                              <div className="font-bold text-white text-[11px] truncate">{audio.filename}</div>
                              <div className="text-[9px] text-[#777] font-mono">{audio.sizeFormatted} • {audio.category.toUpperCase()}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => assignLocalAudio(audio, "fx")}
                              className="px-2 py-1 bg-purple-900/40 hover:bg-purple-800 text-purple-300 border border-purple-500/30 rounded text-[9px] font-bold"
                              title="Asignar como FX a la escena seleccionada"
                            >
                              FX A2
                            </button>
                            <button
                              onClick={() => assignLocalAudio(audio, "bgm")}
                              className="px-2 py-1 bg-green-900/40 hover:bg-green-800 text-green-300 border border-green-500/30 rounded text-[9px] font-bold"
                              title="Asignar como música de fondo master"
                            >
                              BGM A1
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* 4. TAB: AJUSTES DE ESCENA V1 & FOOTAGE */}
            {activeInspectorTab === "storyboard" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#111118] border border-[#222234] rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-xs">{activeScene.name}</h4>
                    <p className="text-[10px] text-[#777]">Escena {selectedSceneIndex + 1} de {scenes.length}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                    V1 ASIGNADO
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Duración (Segundos)</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={activeScene.durationInSeconds}
                      onChange={(e) => updateActiveScene({ durationInSeconds: Number(e.target.value) })}
                      className="w-full bg-[#121218] border border-[#242432] rounded px-3 py-1.5 text-white font-mono text-xs outline-none focus:border-[#ecb613]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Transición</label>
                    <select
                      value={activeScene.transition || "zoom"}
                      onChange={(e) => updateActiveScene({ transition: e.target.value as any })}
                      className="w-full bg-[#121218] border border-[#242432] rounded p-1.5 text-white text-xs outline-none"
                    >
                      <option value="zoom">Zoom Impact (In/Out)</option>
                      <option value="glitch">Glitch Cyberpunk</option>
                      <option value="slide">Slide Anamórfico</option>
                      <option value="fade">Fade Suave</option>
                      <option value="flash">Flash Blanco</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-[#0e0e14] border border-[#222232] rounded-lg space-y-3">
                  <h5 className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5" /> Ajustes de Footage V1
                  </h5>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#888]">
                      <span>Opacidad de Fondo</span>
                      <span>{Math.round((activeScene.mediaOpacity ?? 0.65) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={activeScene.mediaOpacity ?? 0.65}
                      onChange={(e) => updateActiveScene({ mediaOpacity: Number(e.target.value) })}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-white">Efecto Ken Burns (Pan & Scan)</span>
                    <input
                      type="checkbox"
                      checked={activeScene.kenBurns !== false}
                      onChange={(e) => updateActiveScene({ kenBurns: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. TAB: TIPOGRAFÍA */}
            {activeInspectorTab === "graphics" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Título de Escena</label>
                  <input
                    type="text"
                    value={activeScene.titleText}
                    onChange={(e) => updateActiveScene({ titleText: e.target.value })}
                    className="w-full bg-[#121218] border border-[#242432] rounded px-3 py-2 text-white font-bold text-sm outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Familia Tipográfica</label>
                    <select
                      value={activeScene.titleFont || "Syne"}
                      onChange={(e) => updateActiveScene({ titleFont: e.target.value as any })}
                      className="w-full bg-[#121218] border border-[#242432] rounded p-2 text-white text-xs outline-none"
                    >
                      <option value="Syne">Syne (Display Cinema)</option>
                      <option value="Cinzel">Cinzel (Gala Luxury)</option>
                      <option value="Inter">Inter (Clean Modern)</option>
                      <option value="Montserrat">Montserrat (Punchy Bold)</option>
                      <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-white/60 uppercase">Animación</label>
                    <select
                      value={activeScene.animationStyle || "cinematic"}
                      onChange={(e) => updateActiveScene({ animationStyle: e.target.value as any })}
                      className="w-full bg-[#121218] border border-[#242432] rounded p-2 text-white text-xs outline-none"
                    >
                      <option value="cinematic">Cinematic Zoom</option>
                      <option value="kinetic">Kinetic Pop-In</option>
                      <option value="glitch">Glitch Cyber</option>
                      <option value="slide">Slide Up Suave</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Subtítulo Descriptivo</label>
                  <input
                    type="text"
                    value={activeScene.subtitleText}
                    onChange={(e) => updateActiveScene({ subtitleText: e.target.value })}
                    className="w-full bg-[#121218] border border-[#242432] rounded px-3 py-2 text-white text-xs outline-none focus:border-[#ecb613]"
                  />
                </div>
              </div>
            )}

            {/* 6. TAB: SUBTÍTULOS NARRATIVOS (CAPTIONS) */}
            {activeInspectorTab === "captions" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#111116] border border-[#222234] rounded-lg flex items-center justify-between">
                  <span className="text-white font-bold text-xs">Activar Subtítulos Hormozi</span>
                  <input
                    type="checkbox"
                    checked={videoProps.showCaptions ?? true}
                    onChange={(e) => setVideoProps((p) => ({ ...p, showCaptions: e.target.checked }))}
                    className="accent-[#ecb613] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Narrativa Dinámica (Escena Actual)</label>
                  <textarea
                    rows={3}
                    value={activeScene.captionText || ""}
                    onChange={(e) => updateActiveScene({ captionText: e.target.value })}
                    className="w-full bg-[#121218] border border-[#242432] rounded p-2.5 text-white text-xs outline-none focus:border-[#ecb613]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-white/60 uppercase">Color de Resaltado Dinámico</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={videoProps.captionHighlightColor || "#ecb613"}
                      onChange={(e) => setVideoProps((p) => ({ ...p, captionHighlightColor: e.target.value }))}
                      className="w-10 h-10 rounded border border-[#333] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={videoProps.captionHighlightColor || "#ecb613"}
                      onChange={(e) => setVideoProps((p) => ({ ...p, captionHighlightColor: e.target.value }))}
                      className="flex-1 bg-[#121218] border border-[#242432] rounded px-3 py-2 text-white font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 7. TAB: COLOR DAVINCI */}
            {activeInspectorTab === "color" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#0d0d14] border border-[#1e1e2c] rounded-lg space-y-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider block">LUT Presets Rápidos</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {COLOR_PRESETS.map((cp) => (
                      <button
                        key={cp.id}
                        onClick={() => {
                          setVideoProps((p) => ({
                            ...p,
                            accentColor: cp.accent,
                            glowColor: cp.accent,
                            brightness: cp.b,
                            contrast: cp.c,
                            saturation: cp.s,
                            temperature: cp.temp,
                          }));
                        }}
                        className="py-1.5 rounded border border-white/20 text-[10px] font-bold text-center hover:scale-105 transition-transform"
                        style={{ backgroundColor: `${cp.accent}25`, borderColor: cp.accent, color: cp.accent }}
                      >
                        {cp.name.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#888]">
                      <span>Exposición / Brillo</span>
                      <span>{Math.round((videoProps.brightness ?? 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.05"
                      value={videoProps.brightness ?? 1}
                      onChange={(e) => setVideoProps((p) => ({ ...p, brightness: Number(e.target.value) }))}
                      className="w-full accent-[#ecb613]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#888]">
                      <span>Contraste</span>
                      <span>{Math.round((videoProps.contrast ?? 1) * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="1.8"
                      step="0.05"
                      value={videoProps.contrast ?? 1}
                      onChange={(e) => setVideoProps((p) => ({ ...p, contrast: Number(e.target.value) }))}
                      className="w-full accent-[#ecb613]"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-[#888]">
                      <span>Temperatura (Azul vs Oro)</span>
                      <span>{videoProps.temperature ?? 10}</span>
                    </div>
                    <input
                      type="range"
                      min="-40"
                      max="40"
                      value={videoProps.temperature ?? 10}
                      onChange={(e) => setVideoProps((p) => ({ ...p, temperature: Number(e.target.value) }))}
                      className="w-full accent-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#101017] border border-[#1e1e28] rounded-lg">
                    <span className="text-white">Barras Anamórficas 2.39:1 (Letterbox)</span>
                    <input
                      type="checkbox"
                      checked={videoProps.letterbox ?? false}
                      onChange={(e) => setVideoProps((p) => ({ ...p, letterbox: e.target.checked }))}
                      className="accent-[#ecb613] w-4 h-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 8. TAB: DELIVER & EXPORT MASTER */}
            {activeInspectorTab === "deliver" && (
              <div className="space-y-4">
                <div className="p-3 bg-[#12121c] border border-[#232334] rounded-lg space-y-3">
                  <h4 className="text-white font-bold text-xs flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-[#ecb613]" /> Exportación Master Storyboard
                  </h4>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888] uppercase">Carpeta de Destino</label>
                    <input
                      type="text"
                      value={outDir}
                      onChange={(e) => setOutDir(e.target.value)}
                      className="w-full bg-[#0a0a0f] border border-[#22222e] rounded px-2.5 py-1.5 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-[#888] uppercase">Nombre de Archivo (.mp4)</label>
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full bg-[#0a0a0f] border border-[#22222e] rounded px-2.5 py-1.5 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#777] uppercase">Duración Master</label>
                      <div className="w-full bg-[#0a0a0f] border border-[#22222e] rounded p-1 text-[#ecb613] font-bold text-[11px] text-center">
                        {totalDurationSeconds}s ({totalDurationFrames}f)
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-[#777] uppercase">FPS Master</label>
                      <div className="w-full bg-[#0a0a0f] border border-[#22222e] rounded p-1 text-cyan-400 font-bold text-[11px] text-center">
                        60 FPS ANGLE
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleTriggerRender}
                  disabled={renderStatus === "rendering"}
                  className="w-full py-3.5 bg-[#ecb613] hover:bg-[#ffe359] text-black font-black text-xs uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(236,182,19,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {renderStatus === "rendering" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> EXPORTANDO MASTER A 60 FPS...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> EXPORTAR MASTER .MP4 AHORA
                    </>
                  )}
                </button>

                {renderStatus === "success" && (
                  <div className="p-3 bg-green-950/40 border border-green-500/60 rounded-lg text-green-300 text-xs space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Exportación Remotion Exitosa
                    </div>
                    <p className="text-[11px] text-green-200/80">{renderMessage}</p>
                    <div className="pt-1 text-[10px] font-mono text-white/80 bg-black/40 p-1.5 rounded truncate">
                      {exportedFilePath}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Pie del Inspector */}
          <div className="p-3 bg-[#0a0a0f] border-t border-[#1c1c24] flex items-center justify-between text-[11px] text-[#666]">
            <span>STORYBOARD: {scenes.length} ESCENAS</span>
            <span className="font-mono text-cyan-400">MASTER: {totalDurationSeconds}s @ 60FPS</span>
          </div>

        </div>

      </div>

    </div>
  );
}
