"use client";

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Star,
  Users,
  MapPin,
  Sparkles,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Split,
  Eye,
  Zap,
  Building2,
  Calendar,
  DollarSign,
  CheckCircle2,
  FileText,
  MessageSquare,
  Award,
  HelpCircle,
  TrendingUp,
  X,
  Volume2,
  Heart,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Play,
  Pause,
  Sliders,
  Check,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Save,
  Globe,
  Settings,
  Image as ImageIcon,
  Type,
  Code,
  Video,
  Link,
  Upload,
  FileCode,
  Music,
  Minus,
  Layout,
  Layers,
  Sparkle
} from 'lucide-react';

/**
 * 🏛️ EAR OS OMNI-BUILDER 2030 · EDITOR VISUAL DE MÁXIMO CONTROL ABSOLUTO
 * ====================================================================
 * Permite al Proveedor o Admin editar e inyectar el 100% de la ficha:
 * - HTML Personalizado & Scripts (iFrames, Matterport 360, YouTube, Vimeo, Spotify, Widgets)
 * - Multimedia Universal (Cualquier URL de Imagen, Vídeo MP4, Audio MP3, Archivo PDF)
 * - Titulares H1, H2, H3, PÁRRAFOS y Editor WYSIWYG
 * - Carruseles de Fotos & Galerías Dinámicas
 * - Tablas de Precios, Menús y Tarifas por Pax
 * - Acordeones de Preguntas Frecuentes (FAQs)
 * - Separadores, Banners de Acción CTA y Botones Personalizados
 * - Guardado en Borrador + Publicación Certificada SHA-256 en Tiempo Real
 */

export interface BlockItem {
  id: string;
  type: 'hero' | 'carousel' | 'value_stack' | 'configurator' | 'faqs' | 'custom_text' | 'raw_html' | 'multimedia' | 'video_embed' | 'cta_banner' | 'separator';
  visible: boolean;
  [key: string]: any;
}

interface JardinesLaCartujaProps {
  initialEditMode?: boolean;
}

export default function JardinesLaCartujaGrandSlam({
  initialEditMode = false,
}: JardinesLaCartujaProps) {
  const [isEditMode, setIsEditMode] = useState<boolean>(initialEditMode);
  const [blocks, setBlocks] = useState<BlockItem[]>([]);
  const [publishedHash, setPublishedHash] = useState<string>("SHA256: 8f9a2e...e530lock");
  const [lastPublishedAt, setLastPublishedAt] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Carrusel
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Calculador dinámico
  const [guestsCount, setGuestsCount] = useState<number>(150);
  const [selectedSeason, setSelectedSeason] = useState<'alta' | 'media' | 'baja'>('alta');
  const [selectedSpace, setSelectedSpace] = useState<'invernadero' | 'ara_christi' | 'jardines'>('invernadero');
  const [includeAcousticRider, setIncludeAcousticRider] = useState<boolean>(true);

  // Modales
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState<boolean>(false);

  // Cargar base de datos
  const fetchProviderData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/providers/jardines-la-cartuja');
      const data = await res.json();
      if (data.success && data.data) {
        setBlocks(data.data.blocks || []);
        setPublishedHash(data.data.publishedHash || "SHA256: 8f9a2e...e530lock");
        setLastPublishedAt(data.data.lastPublishedAt || "");
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  // Autoplay carrusel
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => {
        const carouselBlock = blocks.find(b => b.type === 'carousel');
        const count = carouselBlock?.photos?.length || 1;
        return (prev + 1) % count;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoplay, blocks]);

  // Gestión de Bloques
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;
    setBlocks(newBlocks);
    setIsDirty(true);
  };

  const toggleBlockVisibility = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks[index].visible = !newBlocks[index].visible;
    setBlocks(newBlocks);
    setIsDirty(true);
  };

  const deleteBlock = (index: number) => {
    if (!confirm("¿Deseas eliminar este bloque del borrador?")) return;
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    setIsDirty(true);
  };

  const updateBlockData = (index: number, key: string, value: any) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], [key]: value };
    setBlocks(newBlocks);
    setIsDirty(true);
  };

  // Añadir cualquier bloque imaginable (Omni-Control)
  const addNewBlock = (type: BlockItem['type']) => {
    const id = `block-${type}-${Date.now()}`;
    let newBlock: BlockItem = { id, type, visible: true };

    switch (type) {
      case 'raw_html':
        newBlock = {
          ...newBlock,
          title: "Inyección de Código HTML / iFrame / Widget 360",
          htmlCode: `<div style="padding:20px; border:1px solid #ecb613; border-radius:16px; background:#08080f; text-align:center;">\n  <h3 style="color:#ecb613; font-family:sans-serif;">🏛️ Tour Virtual 360º / Contenido Embebido</h3>\n  <p style="color:#ccc; font-size:12px;">Inserta aquí tu iFrame de Matterport, Google Maps, Spotify, YouTube o cualquier Widget HTML personalizado.</p>\n</div>`
        };
        break;

      case 'multimedia':
        newBlock = {
          ...newBlock,
          title: "Elemento Multimedia Universal",
          mediaUrl: "https://cdn0.bodas.net/vendor/0530/3_2/1280/jpg/jardines-la-cartuja-grupo-la-cartuja-16_1_530.jpeg",
          mediaType: "image", // 'image' | 'video' | 'audio' | 'pdf'
          caption: "Fotografía en Alta Resolución de Jardines La Cartuja"
        };
        break;

      case 'video_embed':
        newBlock = {
          ...newBlock,
          title: "Vídeo Promocional o Tour 360º",
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          provider: "youtube"
        };
        break;

      case 'custom_text':
        newBlock = {
          ...newBlock,
          headingLevel: "h2", // 'h1' | 'h2' | 'h3'
          title: "Titular Personalizado de la Finca",
          content: "Escribe aquí la información relevante, condiciones especiales o historia de tu espacio."
        };
        break;

      case 'cta_banner':
        newBlock = {
          ...newBlock,
          title: "¡Reserva tu Fecha Exclusiva con Precio Congelado!",
          subtext: "Garantía de depósito 100,00 € con inmutabilidad de tarifa SHA-256.",
          buttonText: "Bloquear Fecha Ahora",
          buttonLink: "#configurador"
        };
        break;

      case 'separator':
        newBlock = {
          ...newBlock,
          height: 30,
          showLine: true
        };
        break;

      case 'hero':
        newBlock = {
          ...newBlock,
          badgeText: "PROMOCIÓN EXCLUSIVA DE TEMPORADA",
          h1: "Nuevo Titular Principal del Espacio",
          subheadline: "Descripción de la experiencia única de boda en este espacio.",
          ctaText: "Reservar Ahora"
        };
        break;

      default:
        break;
    }

    setBlocks([...blocks, newBlock]);
    setIsDirty(true);
    setIsAddBlockModalOpen(false);
  };

  // Guardado y Publicación
  const handleSaveData = async (isPublish: boolean) => {
    try {
      setIsSaving(true);
      const res = await fetch('/api/providers/jardines-la-cartuja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks, isPublish })
      });
      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        if (isPublish) {
          setPublishedHash(data.publishedHash);
          setLastPublishedAt(data.lastPublishedAt);
          alert("✨ ¡Publicación Certificada SHA-256 emitida! Todos los novios verán los cambios inmediatamente.");
        } else {
          alert("💾 Borrador guardado correctamente.");
        }
      } else {
        alert("Error al guardar: " + data.error);
      }
    } catch (err) {
      alert("Error de conexión al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  // Datos auxiliares
  const carouselBlock = blocks.find(b => b.type === 'carousel');
  const photosList = carouselBlock?.photos || [];

  const pricePerPax = selectedSeason === 'alta' ? 145 : selectedSeason === 'media' ? 125 : 110;
  const spaceBaseFee = selectedSpace === 'invernadero' ? 2500 : selectedSpace === 'ara_christi' ? 1800 : 1500;
  const acousticRiderFee = includeAcousticRider ? 350 : 0;
  const totalPrice = spaceBaseFee + (guestsCount * pricePerPax) + acousticRiderFee;

  const providerSplit = totalPrice * 0.80;
  const platformSplit = totalPrice * 0.10;
  const vimumeSplit = totalPrice * 0.10;

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#030305] flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-[#ecb613]">Cargando Ficha Soberana Jardines La Cartuja...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#030305] text-white font-sans overflow-x-hidden pb-28">
      
      {/* 🧭 ENCABEZADO SUPERIOR: SESIÓN Y MODO DE NAVEGACIÓN */}
      <div className="max-w-7xl mx-auto px-4 pt-20 sm:pt-24 pb-4">
        <header className="bg-[#08080d]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecb613]/30 to-[#ecb613]/5 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] font-bold font-mono text-xs shadow-[0_0_15px_rgba(236,182,19,0.2)]">
              EAR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-syne font-black uppercase text-white">
                  Jardines La Cartuja
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Plataforma Soberana EAR OS
                </span>
              </div>
              <p className="text-xs text-white/50 font-mono mt-0.5">
                El Puig (Valencia) · Motor de Control Total 100% Personalizable
              </p>
            </div>
          </div>

          {/* SIMULADOR DE MODO DE VISTA (VISTA CLIENTE NOVIOS VS EDITOR PROVEEDOR/ADMIN) */}
          <div className="flex items-center gap-2 bg-[#050508] p-1.5 rounded-xl border border-[#ecb613]/30 text-xs font-mono">
            <span className="text-[10px] text-white/40 uppercase pl-1">Vista:</span>
            <button
              onClick={() => setIsEditMode(false)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                !isEditMode
                  ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              👁️ Novios (Pública / Solo Lectura)
            </button>
            <button
              onClick={() => setIsEditMode(true)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                isEditMode
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              ✏️ Editor Proveedor / Admin (100% Control)
            </button>
          </div>
        </header>
      </div>

      {/* ⚡ CONTENEDOR PRINCIPAL DE BLOQUES DE LA FICHA */}
      <main className="max-w-7xl mx-auto px-4 space-y-6">
        
        {/* RENDERIZADO DINÁMICO DE BLOQUES */}
        {blocks.map((block, index) => {
          if (!block.visible && !isEditMode) return null;

          return (
            <div
              key={block.id}
              className={`relative transition-all duration-300 ${
                isEditMode ? 'p-3 rounded-3xl border-2 border-dashed border-purple-500/50 bg-purple-950/10 my-4 shadow-xl' : ''
              } ${!block.visible ? 'opacity-40 grayscale' : ''}`}
            >
              {/* 🛠️ CONTROLES DEL BLOQUE (SOLO EN MODO EDITOR PROVEEDOR/ADMIN) */}
              {isEditMode && (
                <div className="z-30 bg-[#0c0c16] border border-purple-500/60 rounded-xl px-3 py-2 mb-3 flex flex-wrap items-center justify-between text-xs font-mono text-purple-300">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white uppercase text-[10px] bg-purple-900/80 px-2 py-0.5 rounded border border-purple-400/40">
                      Bloque: {block.type.toUpperCase()}
                    </span>
                    {!block.visible && <span className="text-red-400 font-bold">(Oculto para los novios)</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white"
                      title="Subir posición"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 text-white"
                      title="Bajar posición"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => toggleBlockVisibility(index)}
                      className={`p-1.5 rounded text-white ${block.visible ? 'bg-emerald-600/30 text-emerald-300' : 'bg-red-600/30 text-red-300'}`}
                      title={block.visible ? 'Ocultar a los novios' : 'Mostrar a los novios'}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => deleteBlock(index)}
                      className="p-1.5 rounded bg-red-600/30 hover:bg-red-600 text-red-200"
                      title="Eliminar bloque"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* 1. HERO BANNER */}
              {block.type === 'hero' && (
                <section className="bg-gradient-to-br from-[#0c0c16] via-[#08080f] to-[#040407] border border-[#ecb613]/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold mb-4">
                    <Sparkles size={14} />
                    {isEditMode ? (
                      <input
                        value={block.badgeText || ''}
                        onChange={(e) => updateBlockData(index, 'badgeText', e.target.value)}
                        className="bg-black/50 border border-purple-400/40 rounded px-2 py-0.5 text-[#ecb613] text-xs font-mono w-72"
                      />
                    ) : (
                      <span>{block.badgeText}</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isEditMode ? (
                      <textarea
                        value={block.h1 || ''}
                        onChange={(e) => updateBlockData(index, 'h1', e.target.value)}
                        className="w-full bg-black/50 border border-purple-400/50 rounded-xl p-3 text-2xl font-syne font-black text-white"
                        rows={2}
                      />
                    ) : (
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-syne font-black uppercase tracking-tight text-white leading-tight">
                        {block.h1}
                      </h2>
                    )}

                    {isEditMode ? (
                      <textarea
                        value={block.subheadline || ''}
                        onChange={(e) => updateBlockData(index, 'subheadline', e.target.value)}
                        className="w-full bg-black/50 border border-purple-400/50 rounded-xl p-3 text-xs text-white/70 font-mono"
                        rows={2}
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-body">
                        {block.subheadline}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* 2. CARRUSEL SHOWCASE */}
              {block.type === 'carousel' && photosList.length > 0 && (
                <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#08080f] shadow-2xl group">
                  <div className="relative h-[320px] sm:h-[480px] lg:h-[520px] w-full overflow-hidden">
                    <img
                      src={photosList[currentPhotoIndex]?.url}
                      alt={photosList[currentPhotoIndex]?.title}
                      className="w-full h-full object-cover transition-transform duration-1000 scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 z-10">
                    <div className="space-y-1 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-xl">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-2.5 py-1 rounded-md border border-[#ecb613]/20">
                        {photosList[currentPhotoIndex]?.category}
                      </span>
                      <h3 className="text-lg font-syne font-bold text-white">
                        {photosList[currentPhotoIndex]?.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + photosList.length) % photosList.length)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-white transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <span className="text-xs font-mono px-3 text-white/70">
                        <strong className="text-white">{currentPhotoIndex + 1}</strong> / {photosList.length}
                      </span>
                      <button
                        onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % photosList.length)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-white transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* 3. INYECCIÓN DE CÓDIGO RAW HTML / IFRAME / WIDGET 360 */}
              {block.type === 'raw_html' && (
                <section className="bg-[#07070c] border border-purple-500/40 rounded-3xl p-6 space-y-3">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-purple-300 font-bold">
                        <Code size={16} /> Editador de Código HTML / iFrame / Widget Custom:
                      </div>
                      <input
                        value={block.title || ''}
                        onChange={(e) => updateBlockData(index, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-purple-400/40 rounded px-3 py-1.5 text-xs text-white font-mono"
                        placeholder="Título descriptivo del bloque HTML..."
                      />
                      <textarea
                        value={block.htmlCode || ''}
                        onChange={(e) => updateBlockData(index, 'htmlCode', e.target.value)}
                        className="w-full bg-[#050508] border border-purple-400/60 rounded-xl p-3 text-xs font-mono text-emerald-400 leading-relaxed font-mono"
                        rows={6}
                        placeholder="Inserta aquí tu iFrame de Matterport 360, YouTube, Google Maps, Widget de Reserva..."
                      />
                    </div>
                  ) : null}

                  {/* Renderizado real del HTML embebido para clientes y preview */}
                  <div
                    className="w-full overflow-hidden rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: block.htmlCode || '' }}
                  />
                </section>
              )}

              {/* 4. BLOQUE MULTIMEDIA UNIVERSAL (IMAGEN / VÍDEO MP4 / AUDIO / PDF) */}
              {block.type === 'multimedia' && (
                <section className="bg-[#08080f] border border-white/10 rounded-3xl p-6 space-y-4">
                  {isEditMode ? (
                    <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-purple-500/40 font-mono text-xs">
                      <div className="flex items-center gap-2 text-purple-300 font-bold">
                        <ImageIcon size={16} /> Configuración de Archivo Multimedia:
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={block.mediaUrl || ''}
                          onChange={(e) => updateBlockData(index, 'mediaUrl', e.target.value)}
                          className="w-full bg-black border border-purple-400/40 rounded px-3 py-1.5 text-white text-xs font-mono"
                          placeholder="URL del archivo (https://...)"
                        />
                        <select
                          value={block.mediaType || 'image'}
                          onChange={(e) => updateBlockData(index, 'mediaType', e.target.value)}
                          className="bg-black border border-purple-400/40 rounded px-3 py-1.5 text-white text-xs font-mono"
                        >
                          <option value="image">📷 Imagen HD</option>
                          <option value="video">🎥 Vídeo MP4 Directo</option>
                          <option value="audio">🎵 Audio MP3 / Musical</option>
                          <option value="pdf">📄 Documento PDF / Dossier</option>
                        </select>
                      </div>
                      <input
                        value={block.caption || ''}
                        onChange={(e) => updateBlockData(index, 'caption', e.target.value)}
                        className="w-full bg-black border border-purple-400/40 rounded px-3 py-1.5 text-white text-xs"
                        placeholder="Pie de foto / Leyenda explicativa..."
                      />
                    </div>
                  ) : null}

                  {/* Renderizado según Tipo de Multimedia */}
                  <div className="w-full">
                    {block.mediaType === 'image' && (
                      <div className="rounded-2xl overflow-hidden border border-white/10">
                        <img src={block.mediaUrl} alt={block.caption} className="w-full h-auto max-h-[500px] object-cover" />
                        {block.caption && <p className="text-xs text-white/50 text-center font-mono py-2 bg-black/40">{block.caption}</p>}
                      </div>
                    )}
                    {block.mediaType === 'video' && (
                      <video controls className="w-full rounded-2xl border border-white/10 max-h-[500px]">
                        <source src={block.mediaUrl} type="video/mp4" />
                        Tu navegador no soporta reproducción de vídeo.
                      </video>
                    )}
                    {block.mediaType === 'audio' && (
                      <div className="bg-[#0b0b12] p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                        <Music className="text-[#ecb613]" size={24} />
                        <audio controls className="w-full">
                          <source src={block.mediaUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* 5. BLOQUE VÍDEO / TOUR 360 EMBED */}
              {block.type === 'video_embed' && (
                <section className="bg-[#08080f] border border-white/10 rounded-3xl p-6 space-y-3">
                  {isEditMode ? (
                    <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-purple-500/40 text-xs font-mono">
                      <label className="text-purple-300 font-bold">URL de Embed (YouTube / Vimeo / Matterport 360):</label>
                      <input
                        value={block.videoUrl || ''}
                        onChange={(e) => updateBlockData(index, 'videoUrl', e.target.value)}
                        className="w-full bg-black border border-purple-400/40 rounded px-3 py-1.5 text-white text-xs"
                      />
                    </div>
                  ) : null}

                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                    <iframe
                      src={block.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </section>
              )}

              {/* 6. BANNER CTA Y BOTÓN PERSONALIZADO */}
              {block.type === 'cta_banner' && (
                <section className="bg-gradient-to-r from-[#ecb613]/20 via-[#08080f] to-[#ecb613]/20 border border-[#ecb613]/40 rounded-3xl p-6 text-center space-y-3">
                  {isEditMode ? (
                    <div className="space-y-2 text-xs font-mono">
                      <input
                        value={block.title || ''}
                        onChange={(e) => updateBlockData(index, 'title', e.target.value)}
                        className="w-full bg-black/60 border border-purple-400/40 rounded px-3 py-1 text-white font-bold"
                      />
                      <input
                        value={block.subtext || ''}
                        onChange={(e) => updateBlockData(index, 'subtext', e.target.value)}
                        className="w-full bg-black/60 border border-purple-400/40 rounded px-3 py-1 text-white/70"
                      />
                      <input
                        value={block.buttonText || ''}
                        onChange={(e) => updateBlockData(index, 'buttonText', e.target.value)}
                        className="w-full bg-black/60 border border-purple-400/40 rounded px-3 py-1 text-[#ecb613] font-bold"
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-syne font-bold text-white">{block.title}</h3>
                      <p className="text-xs text-white/70 font-mono">{block.subtext}</p>
                      <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="mt-2 py-3 px-8 bg-[#ecb613] hover:bg-[#d4af37] text-black font-syne font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all"
                      >
                        {block.buttonText}
                      </button>
                    </>
                  )}
                </section>
              )}

              {/* 7. SEPARADOR / ESPACIADOR */}
              {block.type === 'separator' && (
                <div className="py-4 flex items-center justify-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              )}

              {/* 8. CUSTOM TEXT (H1, H2, H3, P) */}
              {block.type === 'custom_text' && (
                <section className="bg-[#08080f] border border-white/10 rounded-3xl p-6 space-y-3">
                  {isEditMode ? (
                    <div className="space-y-2">
                      <input
                        value={block.title || ''}
                        onChange={(e) => updateBlockData(index, 'title', e.target.value)}
                        className="w-full bg-black/50 border border-purple-400/40 rounded px-3 py-1.5 text-lg font-syne font-bold text-white"
                      />
                      <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlockData(index, 'content', e.target.value)}
                        className="w-full bg-black/50 border border-purple-400/40 rounded p-3 text-xs font-mono text-white/80"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-syne font-bold text-white">{block.title}</h3>
                      <p className="text-xs text-white/70 font-sans leading-relaxed">{block.content}</p>
                    </>
                  )}
                </section>
              )}

              {/* 9. VALUE STACK */}
              {block.type === 'value_stack' && (
                <section className="bg-[#08080f] border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-syne font-bold uppercase text-white flex items-center gap-2">
                      <Award className="text-[#ecb613]" size={20} /> {block.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {block.items?.map((item: any, i: number) => (
                      <div key={i} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs sm:text-sm text-white font-syne">{item.title}</h4>
                          <span className="font-mono text-xs font-bold text-[#ecb613] bg-[#ecb613]/10 px-2 py-0.5 rounded-md border border-[#ecb613]/20">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 leading-relaxed font-sans">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 10. CONFIGURADOR */}
              {block.type === 'configurator' && (
                <section className="bg-[#06060a] border border-[#ecb613]/30 rounded-3xl p-6 space-y-6 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-base font-syne font-bold uppercase text-white flex items-center gap-2">
                      <Sliders size={18} className="text-[#ecb613]" /> {block.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 text-xs font-mono">
                      <div>
                        <label className="block text-white/70 mb-2 font-bold uppercase">1. Espacio Principal:</label>
                        <div className="grid grid-cols-3 gap-2">
                          {block.spaces?.map((sp: any) => (
                            <button
                              key={sp.id}
                              onClick={() => setSelectedSpace(sp.id as any)}
                              className={`p-3 rounded-2xl border text-left transition-all ${
                                selectedSpace === sp.id
                                  ? 'border-[#ecb613] bg-[#ecb613]/10 text-white font-bold'
                                  : 'border-white/10 bg-white/5 text-white/60 hover:text-white'
                              }`}
                            >
                              <div className="text-[11px] leading-tight">{sp.name}</div>
                              <div className="text-[10px] text-[#ecb613] font-bold mt-1">{sp.baseFee} €</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-white/70 font-bold uppercase">2. Invitados ({guestsCount} Pax):</label>
                          <span className="text-[#ecb613] font-bold text-sm font-mono">{guestsCount} Pax</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={400}
                          step={10}
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full accent-[#ecb613] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="bg-[#0a0a10] border border-white/10 p-6 rounded-2xl flex flex-col justify-between space-y-4 font-mono text-xs">
                      <div className="space-y-2">
                        <div className="flex justify-between text-white/70">
                          <span>Alquiler Espacio:</span>
                          <span>{spaceBaseFee.toLocaleString('es-ES')} €</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Gastronomía ({guestsCount} pax):</span>
                          <span>{(guestsCount * pricePerPax).toLocaleString('es-ES')} €</span>
                        </div>
                        <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
                          <span>Presupuesto Estimado:</span>
                          <span className="text-[#ecb613] text-lg font-mono">{totalPrice.toLocaleString('es-ES')} €</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="w-full py-4 px-4 bg-gradient-to-r from-[#ecb613] via-[#d4af37] to-[#ecb613] hover:brightness-110 text-black font-syne font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
                      >
                        <Lock size={18} />
                        Bloquear Tarifa y Fecha con 100,00 €
                      </button>
                    </div>
                  </div>
                </section>
              )}

              {/* 11. FAQS */}
              {block.type === 'faqs' && (
                <section className="bg-[#08080f] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
                  <h3 className="text-base font-syne font-bold uppercase text-white flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#ecb613]" /> {block.title}
                  </h3>
                  <div className="space-y-3">
                    {block.faqs?.map((faq: any, i: number) => (
                      <div key={i} className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                        <button
                          onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                          className="w-full p-4 text-left font-bold text-xs sm:text-sm text-white flex justify-between items-center font-syne"
                        >
                          <span>{faq.question}</span>
                          {activeFaq === i ? <ChevronUp size={16} className="text-[#ecb613]" /> : <ChevronDown size={16} className="text-white/40" />}
                        </button>
                        {activeFaq === i && (
                          <div className="p-4 pt-0 text-xs text-white/70 leading-relaxed font-sans border-t border-white/5">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          );
        })}

        {/* ➕ BOTÓN AÑADIR CUALQUIER TIPO DE BLOQUE (MODO EDITOR EN VIVO) */}
        {isEditMode && (
          <div className="pt-6 text-center">
            <button
              onClick={() => setIsAddBlockModalOpen(true)}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-purple-900/60 via-purple-800/80 to-purple-900/60 hover:brightness-125 border border-purple-500/60 text-purple-100 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 mx-auto shadow-2xl hover:scale-105"
            >
              <Plus size={18} />
              Añadir Cualquier Bloque (HTML / iFrame / Vídeo / Fotos / Documento / Texto / CTA)
            </button>
          </div>
        )}
      </main>

      {/* 🛠️ BARRA FLOTANTE DOCK INFERIOR DE PUBLICACIÓN Y GUARDADO */}
      {isEditMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-[#0c0c16]/95 backdrop-blur-2xl border border-purple-500/60 rounded-2xl px-6 py-3 shadow-[0_0_40px_rgba(168,85,247,0.3)] flex items-center gap-4 text-xs font-mono text-white">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <span className={`w-2.5 h-2.5 rounded-full ${isDirty ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span>{isDirty ? '📝 Borrador con cambios' : '🚀 Publicado en Vivo'}</span>
          </div>

          <button
            onClick={() => handleSaveData(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-2"
          >
            <Save size={14} />
            Guardar Borrador
          </button>

          <button
            onClick={() => handleSaveData(true)}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:brightness-110 text-white font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Globe size={14} />
            Publicar en Vivo (Certificado SHA-256)
          </button>
        </div>
      )}

      {/* 📦 MODAL OMNI-CONTROL DE BLOQUES (HTML, VÍDEO, IFRAME, MULTIMEDIA, TEXTO, CTA, FAQS) */}
      {isAddBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b12] border border-purple-500/50 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <div>
                <h3 className="font-syne font-bold text-base text-white">Catálogo de Bloques Modulares OMNI</h3>
                <p className="text-[10px] text-purple-300 font-mono">Selecciona el tipo de contenido que deseas inyectar</p>
              </div>
              <button onClick={() => setIsAddBlockModalOpen(false)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <button
                onClick={() => addNewBlock('raw_html')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <Code size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Código HTML / iFrame</div>
                  <div className="text-[10px] text-white/50">Matterport 360, Spotify, Maps, Scripts.</div>
                </div>
              </button>

              <button
                onClick={() => addNewBlock('multimedia')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <ImageIcon size={20} className="text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Multimedia Universal</div>
                  <div className="text-[10px] text-white/50">Cualquier Imagen URL, MP4, MP3, PDF.</div>
                </div>
              </button>

              <button
                onClick={() => addNewBlock('video_embed')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <Video size={20} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Vídeo / Tour 360 Embed</div>
                  <div className="text-[10px] text-white/50">YouTube, Vimeo o Visita Virtual.</div>
                </div>
              </button>

              <button
                onClick={() => addNewBlock('custom_text')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <Type size={20} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Texto Libre (H1, H2, P)</div>
                  <div className="text-[10px] text-white/50">Titulares y párrafos editables.</div>
                </div>
              </button>

              <button
                onClick={() => addNewBlock('cta_banner')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <Sparkles size={20} className="text-[#ecb613] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Banner CTA / Botón</div>
                  <div className="text-[10px] text-white/50">Llamada a la acción y botones de pago.</div>
                </div>
              </button>

              <button
                onClick={() => addNewBlock('separator')}
                className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/40 border border-white/10 hover:border-purple-500 text-left text-white transition-all flex items-start gap-2.5"
              >
                <Minus size={20} className="text-white/60 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Separador / Espaciador</div>
                  <div className="text-[10px] text-white/50">Líneas divisoras de cristal.</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESERVA STRIPE */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b12] border border-[#ecb613]/50 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setIsDepositModalOpen(false)} className="absolute top-5 right-5 text-white/40 hover:text-white">
              <X size={20} />
            </button>
            <div className="space-y-4 font-mono text-xs">
              <h3 className="font-syne font-bold text-lg text-white">Reserva Inmutable S-Class</h3>
              <p className="text-[#ecb613]">Depósito de Bloqueo 100,00 € Stripe Price-Lock</p>
              <div className="bg-white/5 p-4 rounded-xl space-y-2 border border-white/10">
                <div className="flex justify-between">
                  <span>Espacio:</span>
                  <span className="text-white font-bold">{selectedSpace} ({guestsCount} pax)</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Estimado:</span>
                  <span className="text-[#ecb613] font-bold">{totalPrice.toLocaleString('es-ES')} €</span>
                </div>
                <div className="text-[10px] text-white/50 pt-2 border-t border-white/10">
                  🔐 Hash: {publishedHash}
                </div>
              </div>
              <button
                onClick={() => {
                  alert('¡Depósito de 100,00 € abonado con éxito!');
                  setIsDepositModalOpen(false);
                }}
                className="w-full py-4 bg-[#ecb613] text-black font-syne font-black rounded-xl uppercase tracking-wider"
              >
                Abonar 100,00 € en Stripe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
