'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  Check, 
  X, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Eye, 
  Edit3, 
  Palette,
  Maximize2,
  Minimize2,
  ChevronDown,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  RefreshCw,
  Cloud,
  Cpu,
  Zap
} from 'lucide-react';

interface BlockMutation {
  selector: string;
  originalText?: string;
  newText?: string;
  color?: string;
  bgColor?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  src?: string;
  alt?: string;
  href?: string;
  hidden?: boolean;
}

const REVIEW_URLS = [
  { label: '🏰 Finca Alubian (Madrid)', path: '/fincas/madrid/finca-alubian' },
  { label: '🏰 Finca Salvago (Sevilla)', path: '/fincas/sevilla/finca-salvago' },
  { label: '🏰 Finca San Dámaso (Madrid)', path: '/fincas/madrid/finca-san-damaso' },
  { label: '🏰 Alquería Balada (Valencia)', path: '/fincas/valencia/alqueria-balada' },
  { label: '🏰 Red General de Fincas', path: '/fincas' },
  { label: '⚡ Pantallas LED Mallorca', path: '/arsenal/pantallas-led/baleares' },
  { label: '⚡ Pantallas LED Madrid', path: '/arsenal/pantallas-led/madrid' },
  { label: '⚡ Sonido Bose Barcelona', path: '/bodas/barcelona/sonido-iluminacion/barcelona' },
  { label: '⚡ Sonido Getxo (Bilbao)', path: '/bodas/bilbao/sonido-iluminacion/getxo' },
  { label: '🎺 Edwin Agudelo (Talavera)', path: '/bodas/toledo/mariachi-gala/talavera-de-la-reina' },
  { label: '🎺 Mariachi Gala (Calatayud)', path: '/bodas/zaragoza/mariachi-gala/calatayud' },
  { label: '🎧 DJ de Bodas (Madrid)', path: '/bodas/madrid/dj/madrid' },
  { label: '🎻 Cuarteto Cuerdas (Madrid)', path: '/bodas/madrid/cuarteto-cuerdas/madrid' },
  { label: '🍖 Catering Brasas (Ocaña)', path: '/bodas/toledo/catering-brasas/ocana' },
  { label: '🍖 Catering Brasas (Zaragoza)', path: '/bodas/zaragoza/catering-brasas/zaragoza' },
  { label: '💍 Bodas de Lujo (Escalona)', path: '/bodas/toledo/bodas-lujo/escalona' },
  { label: '💍 Wedding Planner (Girona)', path: '/bodas/girona/wedding-planner/girona' },
  { label: '🤝 Regalos Ana Mari', path: '/proveedores/regalos-ana-mari' },
  { label: '🤝 Setroimagen Fotografía', path: '/proveedores/setroimagen' },
  { label: '🏛️ VIMUME B2G Propuesta', path: '/vimume/propuesta' },
  { label: '💳 Reserva Solista (Stripe)', path: '/reservar/solista' }
];

export function GlobalLiveVisualEditor() {
  const nextPathname = usePathname();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [savedAlert, setSavedAlert] = useState<boolean>(false);
  const [serverSaved, setServerSaved] = useState<boolean>(false);
  const [mutationsCount, setMutationsCount] = useState<number>(0);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [showUrlSelector, setShowUrlSelector] = useState<boolean>(false);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [showLinkModal, setShowLinkModal] = useState<boolean>(false);
  const [linkUrlInput, setLinkUrlInput] = useState<string>('');
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number } | null>(null);

  // Estados de IA Local (Ollama / GPU)
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiGeneratedText, setAiGeneratedText] = useState<string>('');
  const [aiStyle, setAiStyle] = useState<string>('titular_hero');
  const [aiEngineUsed, setAiEngineUsed] = useState<string>('');

  const mutationsRef = useRef<Record<string, BlockMutation>>({});

  // 1. Detección de ruta y carga de mutaciones (LocalStorage + API Servidor)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = nextPathname || window.location.pathname;
    setCurrentPath(path);
    setSelectedElement(null);
    setToolbarPos(null);

    const loadMutations = async () => {
      let localMutations: Record<string, BlockMutation> = {};
      try {
        const saved = localStorage.getItem(`ear_global_builder_${path}`);
        if (saved) {
          localMutations = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('[GlobalBuilder] Error leyendo localStorage:', e);
      }

      // Intentar cargar también de la API
      try {
        const res = await fetch(`/api/editor/save?pathname=${encodeURIComponent(path)}`);
        if (res.ok) {
          const json = await res.json();
          if (json?.data?.mutations) {
            localMutations = { ...json.data.mutations, ...localMutations };
          }
        }
      } catch (e) {
        // Fallback silencioso a local
      }

      mutationsRef.current = localMutations;
      setMutationsCount(Object.keys(localMutations).length);
      applySavedMutations();
    };

    loadMutations();
  }, [nextPathname]);

  // 2. Generador robusto y determinista de selector CSS
  const getUniqueSelector = (el: HTMLElement): string => {
    if (el.id && !el.id.startsWith('ear-') && !el.id.includes(':')) {
      return `#${el.id}`;
    }
    if (el.getAttribute('data-ear-id')) {
      return `[data-ear-id="${el.getAttribute('data-ear-id')}"]`;
    }

    const path: string[] = [];
    let current: HTMLElement | null = el;

    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && current !== document.documentElement) {
      if (current.id && !current.id.startsWith('ear-') && !current.id.includes(':')) {
        path.unshift(`#${current.id}`);
        break;
      }

      let tag = current.nodeName.toLowerCase();
      const parentEl: HTMLElement | null = current.parentElement;
      if (parentEl) {
        let index = 1;
        let sibling: Element | null = current.previousElementSibling;
        while (sibling) {
          if (sibling.nodeName.toLowerCase() === tag) {
            index++;
          }
          sibling = sibling.previousElementSibling;
        }
        path.unshift(`${tag}:nth-of-type(${index})`);
      } else {
        path.unshift(tag);
      }
      current = parentEl;
    }

    const finalSelector = path.join(' > ');
    return finalSelector;
  };

  // 3. Aplicar mutaciones guardadas al DOM
  const applySavedMutations = useCallback(() => {
    if (typeof document === 'undefined') return;

    Object.entries(mutationsRef.current).forEach(([selector, mut]) => {
      try {
        const el = document.querySelector(selector) as HTMLElement | null;
        if (!el) return;

        if (mut.newText !== undefined && mut.newText !== null) {
          el.innerText = mut.newText;
        }
        if (mut.color) el.style.color = mut.color;
        if (mut.bgColor) el.style.backgroundColor = mut.bgColor;
        if (mut.fontSize) el.style.fontSize = mut.fontSize;
        if (mut.fontWeight) el.style.fontWeight = mut.fontWeight;
        if (mut.textAlign) el.style.textAlign = mut.textAlign;
        if (mut.hidden) el.style.display = 'none';

        if (mut.src && el instanceof HTMLImageElement) {
          el.src = mut.src;
        }
        if (mut.alt && el instanceof HTMLImageElement) {
          el.alt = mut.alt;
        }
        if (mut.href && el instanceof HTMLAnchorElement) {
          el.href = mut.href;
        }
      } catch (e) {
        // Ignorar selectores obsoletos
      }
    });
  }, []);

  // 4. Interceptar clics y aplicar Modo Edición 100% GLOBAL
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleGlobalClickCapture = (e: MouseEvent) => {
      if (!isEditMode) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('#ear-global-builder-dock') || target.closest('#ear-elementor-floating-bar') || target.closest('#ear-ai-copy-modal')) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      let activeEl = target;
      setSelectedElement(activeEl);
      setSelectedTag(activeEl.nodeName.toLowerCase());

      const rect = activeEl.getBoundingClientRect();
      const top = Math.max(10, rect.top + window.scrollY - 48);
      const left = Math.max(10, Math.min(window.innerWidth - 420, rect.left + window.scrollX));
      setToolbarPos({ top, left });

      if (
        !['img', 'video', 'audio', 'svg', 'canvas', 'hr', 'br'].includes(activeEl.nodeName.toLowerCase())
      ) {
        activeEl.contentEditable = 'true';
        activeEl.focus();
      }
    };

    const handleInput = (e: Event) => {
      if (!isEditMode) return;
      const target = e.target as HTMLElement | null;
      if (!target || target.closest('#ear-global-builder-dock') || target.closest('#ear-ai-copy-modal')) return;

      const selector = getUniqueSelector(target);
      mutationsRef.current[selector] = {
        ...(mutationsRef.current[selector] || { selector }),
        newText: target.innerText
      };
      setMutationsCount(Object.keys(mutationsRef.current).length);
    };

    const updateDomEditableState = () => {
      if (!isEditMode) {
        document.querySelectorAll('[contenteditable="true"]').forEach((el) => {
          (el as HTMLElement).contentEditable = 'false';
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.cursor = '';
        });
        return;
      }

      const allTextNodes = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, span, a, button, li, strong, em, b, i, label, div, section, article, td, th'
      );

      allTextNodes.forEach((el) => {
        const html = el as HTMLElement;
        if (html.closest('#ear-global-builder-dock') || html.closest('#ear-elementor-floating-bar') || html.closest('#ear-ai-copy-modal')) return;
        
        if (html.innerText && html.innerText.trim().length > 0) {
          html.style.cursor = 'text';
          html.style.outline = '1px dashed rgba(236, 182, 19, 0.25)';
          html.style.outlineOffset = '2px';
        }
      });
    };

    window.addEventListener('click', handleGlobalClickCapture, true);
    document.addEventListener('input', handleInput, true);

    updateDomEditableState();

    const observer = new MutationObserver(() => {
      if (isEditMode) {
        updateDomEditableState();
      }
      applySavedMutations();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('click', handleGlobalClickCapture, true);
      document.removeEventListener('input', handleInput, true);
      observer.disconnect();
    };
  }, [isEditMode, applySavedMutations]);

  // Guardar en LocalStorage y en Servidor (/api/editor/save)
  const handleSaveAll = async () => {
    const key = `ear_global_builder_${currentPath}`;
    try {
      localStorage.setItem(key, JSON.stringify(mutationsRef.current));
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 3000);

      const res = await fetch('/api/editor/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pathname: currentPath,
          mutations: mutationsRef.current,
          pageMeta: { title: document.title }
        })
      });

      if (res.ok) {
        setServerSaved(true);
        setTimeout(() => setServerSaved(false), 3500);
      }
    } catch (e) {
      console.warn('Error guardando mutaciones:', e);
    }
  };

  // Restablecer valores
  const handleReset = () => {
    if (confirm(`¿Restablecer todos los cambios visuales para ${currentPath}?`)) {
      localStorage.removeItem(`ear_global_builder_${currentPath}`);
      mutationsRef.current = {};
      setMutationsCount(0);
      window.location.reload();
    }
  };

  // Exportar JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mutationsRef.current, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `ear_blocks_${currentPath.replace(/[^a-z0-9]/gi, '_')}.json`);
    dlAnchorElem.click();
  };

  // Mutación puntual de estilo
  const updateSelectedStyle = (prop: keyof BlockMutation, value: string) => {
    if (!selectedElement) return;
    const selector = getUniqueSelector(selectedElement);

    if (prop === 'color') selectedElement.style.color = value;
    if (prop === 'bgColor') selectedElement.style.backgroundColor = value;
    if (prop === 'fontSize') selectedElement.style.fontSize = value;
    if (prop === 'fontWeight') selectedElement.style.fontWeight = value;
    if (prop === 'textAlign') selectedElement.style.textAlign = value;

    mutationsRef.current[selector] = {
      ...(mutationsRef.current[selector] || { selector }),
      [prop]: value
    };
    setMutationsCount(Object.keys(mutationsRef.current).length);
  };

  // Ocultar / Eliminar bloque
  const handleDeleteBlock = () => {
    if (!selectedElement) return;
    if (confirm(`¿Ocultar este bloque <${selectedTag}>?`)) {
      selectedElement.style.display = 'none';
      const selector = getUniqueSelector(selectedElement);
      mutationsRef.current[selector] = {
        ...(mutationsRef.current[selector] || { selector }),
        hidden: true
      };
      setMutationsCount(Object.keys(mutationsRef.current).length);
      setSelectedElement(null);
      setToolbarPos(null);
    }
  };

  // Duplicar bloque
  const handleDuplicateBlock = () => {
    if (!selectedElement || !selectedElement.parentElement) return;
    const clone = selectedElement.cloneNode(true) as HTMLElement;
    clone.style.outline = '1px dashed #ecb613';
    selectedElement.parentElement.insertBefore(clone, selectedElement.nextSibling);
    alert('Bloque duplicado en el DOM con éxito.');
  };

  // Mover bloque arriba
  const handleMoveUp = () => {
    if (!selectedElement || !selectedElement.parentElement) return;
    const prev = selectedElement.previousElementSibling;
    if (prev) {
      selectedElement.parentElement.insertBefore(selectedElement, prev);
    }
  };

  // Mover bloque abajo
  const handleMoveDown = () => {
    if (!selectedElement || !selectedElement.parentElement) return;
    const next = selectedElement.nextElementSibling;
    if (next) {
      selectedElement.parentElement.insertBefore(next, selectedElement);
    }
  };

  // Insertar nuevo bloque Divi/Elementor prefabricado S-Class
  const handleInsertBlock = (type: 'title' | 'text' | 'button' | 'alert') => {
    if (!selectedElement || !selectedElement.parentElement) return;

    const newBlock = document.createElement('div');
    newBlock.className = 'my-4 p-4 rounded-2xl border transition-all';

    if (type === 'title') {
      newBlock.className += ' border-[#ecb613]/50 bg-black/80';
      newBlock.innerHTML = `<h2 class="text-2xl md:text-3xl font-extrabold text-[#ecb613] tracking-wide">NUEVO TITULAR S-CLASS · EDITABLE AQUÍ</h2>`;
    } else if (type === 'text') {
      newBlock.className += ' border-neutral-800 bg-neutral-950/80';
      newBlock.innerHTML = `<p class="text-neutral-300 text-sm md:text-base leading-relaxed">Escribe aquí la descripción comercial, detalles técnicos del rider o especificaciones de producción para este evento.</p>`;
    } else if (type === 'button') {
      newBlock.className += ' border-[#FF2B44]/50 bg-neutral-950 flex justify-center';
      newBlock.innerHTML = `<a href="/reservar/solista" class="px-6 py-3 bg-[#FF2B44] text-white font-mono font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all">RESERVAR CON DEPÓSITO 100€ (PRICE-LOCK)</a>`;
    } else if (type === 'alert') {
      newBlock.className += ' border-cyan-500/50 bg-cyan-950/20 text-cyan-300 text-xs font-mono';
      newBlock.innerHTML = `<strong>RIDER ACÚSTICO & PRESIÓN HOMOLOGADA (Ley 37/2003):</strong> Festejos (90-102 dBA) · Bodas/Fincas (85-90 dBA) · Gala/Solista (70-80 dBA) · Bose F1 / Sub1 · 12 W/pax`;
    }

    selectedElement.parentElement.insertBefore(newBlock, selectedElement.nextSibling);
    alert(`Bloque [${type.toUpperCase()}] insertado con éxito.`);
  };

  // 🤖 GENERACIÓN DE COPY CON IA LOCAL (Ollama / Fallback S-Class)
  const handleGenerateAiCopy = async (chosenStyle?: string) => {
    const styleToUse = chosenStyle || aiStyle;
    setAiLoading(true);
    setAiGeneratedText('');
    try {
      const res = await fetch('/api/ai/editor-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          style: styleToUse,
          currentText: selectedElement ? selectedElement.innerText : '',
          tag: selectedTag || 'h2',
          pathname: currentPath
        })
      });
      if (res.ok) {
        const json = await res.json();
        setAiGeneratedText(json.text || '');
        setAiEngineUsed(json.engine || 'Ollama Local GPU');
      }
    } catch (e) {
      console.warn('Error llamando AI editor:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiCopy = () => {
    if (!aiGeneratedText) return;
    if (selectedElement) {
      selectedElement.innerText = aiGeneratedText;
      selectedElement.dispatchEvent(new Event('input', { bubbles: true }));
      const selector = getUniqueSelector(selectedElement);
      mutationsRef.current[selector] = {
        ...(mutationsRef.current[selector] || { selector }),
        newText: aiGeneratedText
      };
      setMutationsCount(Object.keys(mutationsRef.current).length);
    } else {
      const newBlock = document.createElement('div');
      newBlock.className = 'my-4 p-4 rounded-2xl border border-[#ecb613]/50 bg-black/80 transition-all';
      newBlock.innerHTML = `<h2 class="text-2xl font-bold text-[#ecb613]">${aiGeneratedText}</h2>`;
      const mainEl = document.querySelector('main');
      if (mainEl) {
        mainEl.prepend(newBlock);
      }
    }
    setShowAiModal(false);
  };

  // Guardar imagen modificada
  const handleSaveImageModal = () => {
    if (!selectedElement || !imageUrlInput) return;
    if (selectedElement instanceof HTMLImageElement) {
      selectedElement.src = imageUrlInput;
    } else {
      selectedElement.style.backgroundImage = `url('${imageUrlInput}')`;
    }

    const selector = getUniqueSelector(selectedElement);
    mutationsRef.current[selector] = {
      ...(mutationsRef.current[selector] || { selector }),
      src: imageUrlInput
    };
    setMutationsCount(Object.keys(mutationsRef.current).length);
    setShowImageModal(false);
  };

  // Guardar enlace modificado
  const handleSaveLinkModal = () => {
    if (!selectedElement || !linkUrlInput) return;
    if (selectedElement instanceof HTMLAnchorElement) {
      selectedElement.href = linkUrlInput;
    }

    const selector = getUniqueSelector(selectedElement);
    mutationsRef.current[selector] = {
      ...(mutationsRef.current[selector] || { selector }),
      href: linkUrlInput
    };
    setMutationsCount(Object.keys(mutationsRef.current).length);
    setShowLinkModal(false);
  };

  return (
    <>
      {/* 🚀 BARRA FLOTANTE CONTEXTUAL DE ELEMENTO SELECCIONADO (ESTILO ELEMENTOR / DIVI) */}
      {isEditMode && selectedElement && toolbarPos && (
        <div
          id="ear-elementor-floating-bar"
          className="absolute z-[999999] flex items-center gap-1.5 p-1.5 bg-[#0a0a0f] border-2 border-[#ecb613] rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] backdrop-blur-xl text-white text-xs font-mono animate-in fade-in zoom-in-95 duration-150"
          style={{
            top: `${toolbarPos.top}px`,
            left: `${toolbarPos.left}px`,
          }}
        >
          {/* Badge del Tag */}
          <span className="px-2 py-0.5 bg-[#ecb613] text-black font-extrabold rounded-md uppercase text-[10px]">
            &lt;{selectedTag}&gt;
          </span>

          {/* Botón IA Local Rápido */}
          <button
            onClick={() => {
              setShowAiModal(true);
              handleGenerateAiCopy(selectedTag.startsWith('h') ? 'titular_hero' : 'propuesta_valor');
            }}
            className="p-1 bg-[#ecb613]/20 hover:bg-[#ecb613] text-[#ecb613] hover:text-black rounded transition-colors flex items-center gap-1 px-1.5 font-bold text-[10px]"
            title="Redactar con IA Local (GPU / Ollama)"
          >
            <Sparkles className="w-3 h-3 text-[#ecb613] animate-pulse" />
            IA COPY
          </button>

          {/* Selector de Color de Texto */}
          <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
            <button
              onClick={() => updateSelectedStyle('color', '#ecb613')}
              className="w-3.5 h-3.5 rounded-full bg-[#ecb613] hover:scale-125 transition-transform"
              title="Color Oro S-Class"
            />
            <button
              onClick={() => updateSelectedStyle('color', '#FF2B44')}
              className="w-3.5 h-3.5 rounded-full bg-[#FF2B44] hover:scale-125 transition-transform"
              title="Color Rubí Festejos"
            />
            <button
              onClick={() => updateSelectedStyle('color', '#00E5FF')}
              className="w-3.5 h-3.5 rounded-full bg-[#00E5FF] hover:scale-125 transition-transform"
              title="Color Cyan High-Tech"
            />
            <button
              onClick={() => updateSelectedStyle('color', '#ffffff')}
              className="w-3.5 h-3.5 rounded-full bg-white hover:scale-125 transition-transform"
              title="Color Blanco Nieve"
            />
            <button
              onClick={() => updateSelectedStyle('color', '#9ca3af')}
              className="w-3.5 h-3.5 rounded-full bg-neutral-400 hover:scale-125 transition-transform"
              title="Color Gris Muted"
            />
          </div>

          {/* Tamaño de Fuente */}
          <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
            <button
              onClick={() => updateSelectedStyle('fontSize', '1.875rem')}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px] font-bold"
              title="Aumentar Tamaño (XL)"
            >
              A+
            </button>
            <button
              onClick={() => updateSelectedStyle('fontSize', '0.875rem')}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded text-[10px]"
              title="Reducir Tamaño (SM)"
            >
              A-
            </button>
          </div>

          {/* Negrita */}
          <button
            onClick={() => updateSelectedStyle('fontWeight', '800')}
            className="px-1.5 py-0.5 bg-neutral-800 hover:bg-neutral-700 rounded font-black text-[10px]"
            title="Poner en Negrita"
          >
            B
          </button>

          {/* Si es Imagen o Enlace */}
          {(selectedElement instanceof HTMLImageElement || selectedElement.style.backgroundImage) && (
            <button
              onClick={() => {
                setImageUrlInput(selectedElement instanceof HTMLImageElement ? selectedElement.src : '');
                setShowImageModal(true);
              }}
              className="p-1 bg-neutral-800 hover:bg-[#ecb613] hover:text-black rounded transition-colors"
              title="Cambiar URL de Imagen"
            >
              <ImageIcon className="w-3 h-3" />
            </button>
          )}

          {selectedElement instanceof HTMLAnchorElement && (
            <button
              onClick={() => {
                setLinkUrlInput(selectedElement.getAttribute('href') || '');
                setShowLinkModal(true);
              }}
              className="p-1 bg-neutral-800 hover:bg-[#ecb613] hover:text-black rounded transition-colors"
              title="Cambiar Enlace (href)"
            >
              <LinkIcon className="w-3 h-3" />
            </button>
          )}

          {/* Controles de Estructura: Mover, Duplicar, Borrar */}
          <div className="flex items-center gap-1 pl-1 border-l border-neutral-800">
            <button
              onClick={handleMoveUp}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              title="Mover Arriba"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={handleMoveDown}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              title="Mover Abajo"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
            <button
              onClick={handleDuplicateBlock}
              className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              title="Duplicar Bloque"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={handleDeleteBlock}
              className="p-1 hover:bg-red-900/60 rounded text-neutral-400 hover:text-red-400"
              title="Ocultar/Eliminar Bloque"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>

          {/* Cerrar selección */}
          <button
            onClick={() => {
              setSelectedElement(null);
              setToolbarPos(null);
            }}
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white ml-0.5"
            title="Cerrar barra"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 🎛️ PANEL PRINCIPAL DEL CONSTRUCTOR S-CLASS (DOCK FIJO INFERIOR DERECHO) */}
      <div id="ear-global-builder-dock" className="fixed bottom-6 right-6 z-[99999] font-sans">
        <div className="bg-[#08080c]/95 border-2 border-[#ecb613]/70 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-white p-3 flex flex-col gap-2.5 max-w-sm transition-all duration-300">
          
          {/* CABECERA */}
          <div className="flex items-center justify-between gap-3 border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#ecb613] uppercase">
                CONSTRUCTOR GLOBAL S-CLASS
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* BOTONES DE CONTROL DE MODO */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const nextState = !isEditMode;
                    setIsEditMode(nextState);
                    if (!nextState) {
                      setSelectedElement(null);
                      setToolbarPos(null);
                    }
                  }}
                  className={`flex-grow py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                    isEditMode 
                      ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 ring-2 ring-[#ecb613]' 
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  {isEditMode ? 'MODO EDICIÓN ACTIVO' : 'ACTIVAR EDICIÓN VISUAL'}
                </button>

                {isEditMode && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleSaveAll}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1"
                      title="Guardar en LocalStorage y Servidor"
                    >
                      <Save className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleExportJson}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs transition-all"
                      title="Descargar JSON de Mutaciones"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleReset}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 rounded-xl text-xs transition-all"
                      title="Restablecer Valores Iniciales"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* BOTÓN MAESTRO DE IA LOCAL (OLLAMA / GPU) */}
              {isEditMode && (
                <button
                  onClick={() => {
                    setShowAiModal(true);
                    handleGenerateAiCopy('titular_hero');
                  }}
                  className="w-full py-2 px-3 bg-gradient-to-r from-[#ecb613]/20 via-[#ecb613]/10 to-transparent hover:from-[#ecb613]/30 border border-[#ecb613]/50 rounded-xl text-xs font-mono font-bold text-[#ecb613] flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#ecb613] animate-pulse" />
                  <span>GENERAR COPY S-CLASS CON IA (GPU)</span>
                </button>
              )}

              {/* BARRA DE AÑADIR NUEVO BLOQUE (DIVI/ELEMENTOR) */}
              {isEditMode && (
                <div className="p-2 bg-neutral-900/80 border border-neutral-800 rounded-xl flex flex-col gap-1.5">
                  <div className="text-[10px] font-mono font-bold text-neutral-400 flex items-center gap-1">
                    <PlusCircle className="w-3 h-3 text-[#ecb613]" /> INSERTAR BLOQUE DEPURADO:
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-mono">
                    <button
                      onClick={() => handleInsertBlock('title')}
                      className="py-1 px-1.5 bg-neutral-800 hover:bg-[#ecb613] hover:text-black rounded text-center truncate transition-colors"
                      title="Añadir Título H2 S-Class"
                    >
                      + Titular
                    </button>
                    <button
                      onClick={() => handleInsertBlock('text')}
                      className="py-1 px-1.5 bg-neutral-800 hover:bg-[#ecb613] hover:text-black rounded text-center truncate transition-colors"
                      title="Añadir Párrafo Comercial"
                    >
                      + Párrafo
                    </button>
                    <button
                      onClick={() => handleInsertBlock('button')}
                      className="py-1 px-1.5 bg-neutral-800 hover:bg-[#FF2B44] text-white rounded text-center truncate transition-colors"
                      title="Añadir Botón de Pago Stripe 100€"
                    >
                      + Botón CTA
                    </button>
                    <button
                      onClick={() => handleInsertBlock('alert')}
                      className="py-1 px-1.5 bg-neutral-800 hover:bg-cyan-600 text-white rounded text-center truncate transition-colors"
                      title="Añadir Caja Rider Acústico Homologado"
                    >
                      + Rider Box
                    </button>
                  </div>
                </div>
              )}

              {/* SELECTOR RÁPIDO DE LAS 20 URLs ESTRATÉGICAS */}
              <div className="relative">
                <button
                  onClick={() => setShowUrlSelector(!showUrlSelector)}
                  className="w-full py-1.5 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-[11px] font-mono text-neutral-300 flex items-center justify-between gap-1"
                >
                  <span className="truncate">Navegador Rápido de 20 URLs</span>
                  <ChevronDown className="w-3 h-3 text-[#ecb613]" />
                </button>

                {showUrlSelector && (
                  <div className="absolute bottom-full left-0 w-full mb-1.5 max-h-56 overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl p-1 space-y-0.5 z-50 text-[11px] font-mono">
                    {REVIEW_URLS.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.path}
                        className="block px-2.5 py-1.5 rounded-lg text-neutral-300 hover:bg-[#ecb613]/10 hover:text-[#ecb613] truncate transition-colors"
                        onClick={() => setShowUrlSelector(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* ESTADO / FEEDBACK DE TELEMETRÍA */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-800/60">
                <span className="truncate max-w-[150px]">Ruta: {currentPath}</span>
                {savedAlert ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <Check className="w-3 h-3" /> ¡Guardado Local!
                  </span>
                ) : serverSaved ? (
                  <span className="text-cyan-400 flex items-center gap-1 font-bold">
                    <Cloud className="w-3 h-3" /> ¡Servidor Sincronizado!
                  </span>
                ) : (
                  <span>{mutationsCount} cambios registrados</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 🤖 MODAL DE GENERACIÓN DE COPY CON IA LOCAL */}
      {showAiModal && (
        <div id="ear-ai-copy-modal" className="fixed inset-0 z-[9999999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b12] border-2 border-[#ecb613] p-5 rounded-2xl max-w-lg w-full text-white font-mono shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
              <h3 className="text-xs font-bold text-[#ecb613] flex items-center gap-2 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#ecb613]" /> GENERADOR DE COPYWRITING S-CLASS (IA LOCAL)
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 mb-3">
              Selecciona el enfoque para redactar el bloque en <strong className="text-white">{currentPath}</strong>:
            </p>

            {/* Selector de Enfoque */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
              <button
                onClick={() => {
                  setAiStyle('titular_hero');
                  handleGenerateAiCopy('titular_hero');
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  aiStyle === 'titular_hero'
                    ? 'border-[#ecb613] bg-[#ecb613]/10 text-[#ecb613]'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-[11px]">👑 Titular Hero S-Class</div>
                <div className="text-[9px] text-neutral-500">Autoridad, Syne display</div>
              </button>

              <button
                onClick={() => {
                  setAiStyle('propuesta_valor');
                  handleGenerateAiCopy('propuesta_valor');
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  aiStyle === 'propuesta_valor'
                    ? 'border-[#ecb613] bg-[#ecb613]/10 text-[#ecb613]'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-[11px]">💼 Propuesta & Split 80/10/10</div>
                <div className="text-[9px] text-neutral-500">Transparencia y conversión</div>
              </button>

              <button
                onClick={() => {
                  setAiStyle('boton_cta');
                  handleGenerateAiCopy('boton_cta');
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  aiStyle === 'boton_cta'
                    ? 'border-[#FF2B44] bg-[#FF2B44]/10 text-[#FF2B44]'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-[11px]">💳 Cierre Stripe 100€</div>
                <div className="text-[9px] text-neutral-500">Price-Lock SHA-256</div>
              </button>

              <button
                onClick={() => {
                  setAiStyle('rider_acustico');
                  handleGenerateAiCopy('rider_acustico');
                }}
                className={`p-2 rounded-xl border text-left transition-all ${
                  aiStyle === 'rider_acustico'
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-300'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-bold text-[11px]">🔊 Rider Ley 37/2003</div>
                <div className="text-[9px] text-neutral-500">Festejos 90-102 dBA</div>
              </button>
            </div>

            {/* Área de Resultado Generado */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                <span>Resultado generado:</span>
                {aiEngineUsed && (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> {aiEngineUsed}
                  </span>
                )}
              </div>
              <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl min-h-[90px] text-xs text-neutral-200 leading-relaxed font-sans flex items-center justify-center">
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-[#ecb613] font-mono text-xs animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Procesando con IA Local...
                  </div>
                ) : aiGeneratedText ? (
                  <span className="w-full font-medium">{aiGeneratedText}</span>
                ) : (
                  <span className="text-neutral-500 text-xs italic">Haz clic en una opción superior para redactar...</span>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800/80">
              <button
                onClick={() => handleGenerateAiCopy()}
                disabled={aiLoading}
                className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reintentar
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-mono"
                >
                  Descartar
                </button>
                <button
                  onClick={handleApplyAiCopy}
                  disabled={!aiGeneratedText}
                  className="px-4 py-2 bg-[#ecb613] hover:bg-[#d4a311] disabled:opacity-50 text-black font-bold font-mono rounded-xl text-xs shadow-lg transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Inyectar en Página
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CAMBIAR URL DE IMAGEN */}
      {showImageModal && (
        <div className="fixed inset-0 z-[9999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b10] border border-[#ecb613] p-5 rounded-2xl max-w-md w-full text-white font-mono shadow-2xl">
            <h3 className="text-sm font-bold text-[#ecb613] mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> REEMPLAZAR IMAGEN DEL BLOQUE
            </h3>
            <p className="text-xs text-neutral-400 mb-3">Introduce la URL absoluta de la nueva imagen o recurso multimedia:</p>
            <input
              type="text"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://... o /images/..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white mb-4 outline-none focus:border-[#ecb613]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveImageModal}
                className="px-4 py-1.5 bg-[#ecb613] text-black font-bold rounded-xl text-xs"
              >
                Aplicar Imagen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CAMBIAR ENLACE (HREF) */}
      {showLinkModal && (
        <div className="fixed inset-0 z-[9999999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b0b10] border border-[#00E5FF] p-5 rounded-2xl max-w-md w-full text-white font-mono shadow-2xl">
            <h3 className="text-sm font-bold text-[#00E5FF] mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> EDITAR DESTINO DEL ENLACE (HREF)
            </h3>
            <p className="text-xs text-neutral-400 mb-3">Introduce la ruta interna o URL de destino para este botón o enlace:</p>
            <input
              type="text"
              value={linkUrlInput}
              onChange={(e) => setLinkUrlInput(e.target.value)}
              placeholder="/reservar/solista, /fincas, https://..."
              className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white mb-4 outline-none focus:border-[#00E5FF]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveLinkModal}
                className="px-4 py-1.5 bg-[#00E5FF] text-black font-bold rounded-xl text-xs"
              >
                Actualizar Enlace
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalLiveVisualEditor;
