import React from 'react';
import {
  loadPublicProviderProfile,
  type PublicProfileSection,
} from '@/lib/providers/provider-profile-store';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * PROYECCIÓN PÚBLICA DE LA FICHA (Server Component)
 * ════════════════════════════════════════════════════════════════════════════
 * Pinta EXACTAMENTE lo que el proveedor/admin guardó desde
 * `/admin/proveedores → «Editar ficha completa»`, y solo aquello marcado como
 * público y no sensible. Sin valores reales no se emite ni una sección: cero
 * placeholders, cero relleno.
 * ════════════════════════════════════════════════════════════════════════════
 */

interface ProviderProfileSectionsProps {
  readonly providerSlug: string;
  readonly category: string;
}

async function loadSections(
  providerSlug: string,
  category: string,
): Promise<readonly PublicProfileSection[]> {
  try {
    return await loadPublicProviderProfile(providerSlug, category);
  } catch (error: unknown) {
    // La ficha pública jamás debe caerse porque falte una tabla o un valor.
    console.error('[PUBLIC_PROFILE] No se pudo proyectar la ficha:', error);
    return [];
  }
}

function SectionField({
  label,
  value,
  items,
}: {
  readonly label: string;
  readonly value: string;
  readonly items: readonly string[];
}): React.ReactElement {
  return (
    <div className="p-4 rounded-2xl bg-[#09090e] border border-white/10 hover:border-[#ecb613]/40 transition-all duration-300">
      <span className="block text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">
        {label}
      </span>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, index) => (
            <li key={`${label}-${index}`} className="text-xs sm:text-sm text-zinc-300 font-light flex gap-2">
              <span aria-hidden="true" className="text-[#ecb613]/70 shrink-0">▸</span>
              <span className="whitespace-pre-line">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-line">
          {value}
        </p>
      )}
    </div>
  );
}

export async function ProviderProfileSections({
  providerSlug,
  category,
}: ProviderProfileSectionsProps): Promise<React.ReactElement | null> {
  const sections = await loadSections(providerSlug, category);
  if (sections.length === 0) return null;

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
            Ficha declarada por el proveedor
          </span>
          <h3 className="text-2xl font-bold font-syne text-white uppercase">Condiciones y Detalle Verificado</h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
          {sections.length} bloques
        </span>
      </div>

      {sections.map((section) => (
        <section key={section.id} id={`ficha-${section.id}`} className="space-y-3">
          <h4 className="text-lg font-bold font-syne text-white uppercase tracking-wide">
            {section.title}
          </h4>

          {section.pairs.length > 0 && (
            <div className="space-y-2.5">
              {section.pairs.map((pair, index) => (
                <details
                  key={`${section.id}-pair-${index}`}
                  className="group p-4 rounded-2xl bg-[#09090e] border border-white/10 hover:border-[#ecb613]/40 transition-all duration-300"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold text-white font-syne flex items-start justify-between gap-3">
                    <span>{pair.question}</span>
                    <span aria-hidden="true" className="text-[#ecb613] text-xs mt-0.5 shrink-0 transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light whitespace-pre-line">
                    {pair.answer}
                  </p>
                </details>
              ))}
            </div>
          )}

          {section.fields.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((field) => (
                <SectionField
                  key={field.key}
                  label={field.label}
                  value={field.value}
                  items={field.items}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}

export default ProviderProfileSections;
