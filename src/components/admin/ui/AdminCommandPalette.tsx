"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { searchAdminNav } from '@/lib/config/admin-navigation';

/**
 * ADMIN COMMAND PALETTE — Paleta de comandos única del cockpit (⌘K / Ctrl+K).
 * `use client`: hoja reactiva con foco, atajo global, navegación completa por
 * teclado (flechas + Enter), `role="listbox"` / `role="option"` y cierre con
 * Escape. Una sola paleta en todo el admin (prohibido duplicar el buscador).
 */
export default function AdminCommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchAdminNav(query, 8), [query]);

  // Reinicia la selección al cambiar los resultados.
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  // Atajo global ⌘K / Ctrl+K + cierre con Escape.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
        return;
      }
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Cierra la paleta al navegar (misma conducta que el buscador original).
  useEffect(() => {
    setOpen(false);
    setQuery('');
  }, [pathname]);

  // Mantiene visible la opción activa al navegar con flechas.
  useEffect(() => {
    const active = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        results.length === 0 ? 0 : Math.min(index + 1, results.length - 1),
      );
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = results[activeIndex];
      if (target) navigate(target.href);
    }
  };

  return (
    <div className="relative hidden md:block w-56 lg:w-72">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls="admin-cockpit-command-palette"
        aria-autocomplete="list"
        aria-activedescendant={open && results[activeIndex] ? `palette-option-${activeIndex}` : undefined}
        aria-label="Buscar módulos del cockpit EAR OS"
        placeholder="Buscar herramientas... (Ctrl+K)"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onInputKeyDown}
        className="h-8 w-full rounded-lg border border-white/10 bg-black/60 pl-8 pr-12 font-mono text-xs text-zinc-200 placeholder-zinc-500 transition-colors focus:border-[#ecb613] focus:outline-none"
      />
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1 font-mono text-[10px] text-zinc-500">
        Ctrl K
      </span>

      {open ? (
        <div
          id="admin-cockpit-command-palette"
          ref={listRef}
          role="listbox"
          aria-label="Resultados del buscador del cockpit"
          className="absolute left-0 top-full z-50 mt-2 max-h-80 w-[22rem] overflow-y-auto rounded-2xl border border-[#ecb613]/30 bg-[#09090f] p-1.5 shadow-2xl custom-scrollbar"
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 font-mono text-[11px] text-zinc-500">
              Sin resultados. Prueba «tesorería», «licitaciones» o «proveedores».
            </p>
          ) : (
            results.map((result, index) => {
              const ResultIcon = result.icon;
              const isActive = index === activeIndex;
              return (
                <button
                  key={`${result.tabId}-${result.id}`}
                  type="button"
                  id={`palette-option-${index}`}
                  role="option"
                  aria-selected={isActive}
                  data-index={index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => navigate(result.href)}
                  className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    isActive ? 'bg-zinc-800/80 text-white' : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
                  }`}
                >
                  <ResultIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ecb613]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{result.name}</span>
                    <span className="block truncate font-mono text-[10px] text-zinc-500">
                      {result.tabTitle} · {result.href}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}
