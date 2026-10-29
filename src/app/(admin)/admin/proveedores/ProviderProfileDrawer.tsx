"use client";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * DRAWER «PERFIL 380 CAMPOS» — EDICIÓN REAL DE LA FICHA DEL PROVEEDOR
 * ════════════════════════════════════════════════════════════════════════════
 * · Los campos NO están hardcodeados: salen del catálogo SSOT por categoría
 *   (`provider-field-catalog.ts`), así que un proveedor de fotografía ve los
 *   campos de fotografía y uno de finca los de finca.
 * · Cada guardado escribe en PostgreSQL vía Server Action autenticada; no hay
 *   estado optimista mentiroso: la respuesta trae el recuento real escrito.
 * · Métodos de cobro (Bizum/transferencia/tarjeta/cripto) se editan aquí y la
 *   ficha pública sólo los muestra tras capturar el lead.
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Save, Search, CreditCard, Layers, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import {
  buildProviderFieldSet,
  groupProviderFields,
  resolveProviderFieldCategory,
  type ProviderFieldDef,
} from '@/lib/providers/provider-field-catalog';
import {
  deleteProviderPaymentMethodAction,
  loadProviderProfileAction,
  saveProviderPaymentMethodAction,
  saveProviderProfileAction,
  toggleProviderPaymentMethodAction,
} from '@/app/actions/admin-provider-profile';
import type {
  ProviderPaymentMethodView,
  ProviderProfileSnapshot,
  SaveProfileResult,
} from '@/lib/providers/provider-profile-store';

const PAYMENT_KIND_LABELS: readonly { value: string; label: string }[] = [
  { value: 'bizum', label: 'Bizum' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
  { value: 'tarjeta', label: 'Tarjeta (Stripe)' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'cripto_btc', label: 'Cripto · BTC' },
  { value: 'cripto_eth', label: 'Cripto · ETH' },
  { value: 'cripto_usdt', label: 'Cripto · USDT' },
  { value: 'otro', label: 'Otro' },
];

interface ProviderProfileDrawerProps {
  readonly providerSlug: string;
  readonly providerName: string;
  readonly category: string;
  readonly onClose: () => void;
}

interface PaymentDraft {
  kind: string;
  label: string;
  holder: string;
  reference: string;
  instructions: string;
  isActive: boolean;
  requiresLeadCapture: boolean;
}

const EMPTY_PAYMENT: PaymentDraft = {
  kind: 'bizum',
  label: 'Bizum',
  holder: '',
  reference: '',
  instructions: '',
  isActive: true,
  requiresLeadCapture: true,
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error desconocido';
}

export function ProviderProfileDrawer({
  providerSlug,
  providerName,
  category,
  onClose,
}: ProviderProfileDrawerProps) {
  const resolvedCategory = useMemo(() => resolveProviderFieldCategory(category), [category]);
  const fieldSet = useMemo(() => buildProviderFieldSet(resolvedCategory), [resolvedCategory]);
  const grouped = useMemo(() => groupProviderFields(fieldSet), [fieldSet]);

  const [snapshot, setSnapshot] = useState<ProviderProfileSnapshot | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState<readonly string[]>([]);
  const [methods, setMethods] = useState<readonly ProviderPaymentMethodView[]>([]);
  const [paymentDraft, setPaymentDraft] = useState<PaymentDraft>(EMPTY_PAYMENT);
  const [tab, setTab] = useState<'campos' | 'cobros'>('campos');
  const [activeGroup, setActiveGroup] = useState<string>(grouped[0]?.group.id ?? 'identidad');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadProviderProfileAction(providerSlug, resolvedCategory);
      setSnapshot(data);
      setMethods(data.paymentMethods);
      setDraft({});
      setDirty([]);
    } catch (loadError: unknown) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [providerSlug, resolvedCategory]);

  useEffect(() => {
    void load();
  }, [load]);

  const currentValues = snapshot?.values ?? {};

  const valueOf = useCallback(
    (key: string): string => {
      const staged = draft[key];
      if (staged !== undefined) return staged;
      return currentValues[key] ?? '';
    },
    [draft, currentValues],
  );

  const setValue = useCallback((key: string, value: string): void => {
    setDraft((previous) => ({ ...previous, [key]: value }));
    setDirty((previous) => (previous.includes(key) ? previous : [...previous, key]));
    setNotice(null);
  }, []);

  const handleSave = async (): Promise<void> => {
    if (dirty.length === 0) {
      setNotice('Sin cambios que guardar.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, string> = {};
      for (const key of dirty) payload[key] = draft[key] ?? '';
      const result: SaveProfileResult = await saveProviderProfileAction(
        providerSlug,
        resolvedCategory,
        payload,
      );
      setNotice(
        `Guardado real: ${result.written} campos escritos · ${result.filled}/${result.total} completados` +
          (result.rejected.length > 0 ? ` · ${result.rejected.length} claves rechazadas` : ''),
      );
      setDirty([]);
      setDraft({});
      await load();
    } catch (saveError: unknown) {
      setError(errorMessage(saveError));
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      await saveProviderPaymentMethodAction(providerSlug, {
        kind: paymentDraft.kind,
        label: paymentDraft.label,
        holder: paymentDraft.holder,
        reference: paymentDraft.reference,
        instructions: paymentDraft.instructions,
        isActive: paymentDraft.isActive,
        requiresLeadCapture: paymentDraft.requiresLeadCapture,
      });
      setNotice(`Método de cobro «${paymentDraft.label}» guardado.`);
      setPaymentDraft(EMPTY_PAYMENT);
      await load();
    } catch (paymentError: unknown) {
      setError(errorMessage(paymentError));
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePayment = async (method: ProviderPaymentMethodView): Promise<void> => {
    setSaving(true);
    try {
      await toggleProviderPaymentMethodAction(providerSlug, method.kind, !method.isActive);
      await load();
    } catch (toggleError: unknown) {
      setError(errorMessage(toggleError));
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePayment = async (method: ProviderPaymentMethodView): Promise<void> => {
    if (!window.confirm(`¿Eliminar el método de cobro «${method.label}»?`)) return;
    setSaving(true);
    try {
      await deleteProviderPaymentMethodAction(providerSlug, method.kind);
      await load();
    } catch (deleteError: unknown) {
      setError(errorMessage(deleteError));
    } finally {
      setSaving(false);
    }
  };

  const filteredGroups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return grouped;
    return grouped
      .map((entry) => ({
        group: entry.group,
        fields: entry.fields.filter(
          (def) =>
            def.label.toLowerCase().includes(needle) || def.key.toLowerCase().includes(needle),
        ),
      }))
      .filter((entry) => entry.fields.length > 0);
  }, [grouped, query]);

  const visibleGroup =
    filteredGroups.find((entry) => entry.group.id === activeGroup) ?? filteredGroups[0] ?? null;

  const filledByGroup = useMemo(() => {
    const counts = new Map<string, number>();
    for (const def of fieldSet) {
      if ((currentValues[def.key] ?? '').length === 0) continue;
      counts.set(def.group, (counts.get(def.group) ?? 0) + 1);
    }
    return counts;
  }, [fieldSet, currentValues]);

  const renderInput = (def: ProviderFieldDef): React.ReactElement => {
    const value = valueOf(def.key);
    const baseClass =
      'w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613] transition-colors duration-300';

    if (def.type === 'boolean') {
      return (
        <select
          value={value}
          onChange={(event) => setValue(def.key, event.target.value)}
          className={baseClass}
        >
          <option value="">— sin definir —</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (def.type === 'select') {
      return (
        <select
          value={value}
          onChange={(event) => setValue(def.key, event.target.value)}
          className={baseClass}
        >
          <option value="">— sin definir —</option>
          {(def.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (def.type === 'textarea' || def.type === 'list') {
      return (
        <textarea
          value={value}
          rows={3}
          placeholder={def.hint ?? (def.type === 'list' ? 'Un valor por línea' : '')}
          onChange={(event) => setValue(def.key, event.target.value)}
          className={`${baseClass} resize-y`}
        />
      );
    }

    const inputType =
      def.type === 'url' ? 'url' : def.type === 'email' ? 'email' : def.type === 'phone' ? 'tel' : 'text';

    return (
      <input
        type={inputType}
        value={value}
        inputMode={def.type === 'currency' || def.type === 'percent' || def.type === 'number' ? 'decimal' : undefined}
        placeholder={def.hint ?? (def.type === 'currency' ? '0,00 €' : '')}
        onChange={(event) => setValue(def.key, event.target.value)}
        className={baseClass}
      />
    );
  };

  const renderFields = (): React.ReactElement => (
    <div className="flex-1 flex min-h-0">
      <nav className="w-56 shrink-0 border-r border-white/10 overflow-y-auto py-3">
        {filteredGroups.map((entry) => {
          const groupTotal = fieldSet.filter((def) => def.group === entry.group.id).length;
          const isActive = visibleGroup?.group.id === entry.group.id;
          return (
            <button
              key={entry.group.id}
              type="button"
              onClick={() => setActiveGroup(entry.group.id)}
              className={`w-full text-left px-4 py-2 text-[11px] font-mono transition-colors duration-300 border-l-2 ${
                isActive
                  ? 'text-[#ecb613] bg-[#ecb613]/10 border-[#ecb613]'
                  : 'text-zinc-400 hover:text-white border-transparent'
              }`}
            >
              <span className="block truncate">{entry.group.label}</span>
              <span className="text-[10px] text-zinc-600">
                {filledByGroup.get(entry.group.id) ?? 0}/{groupTotal}
              </span>
            </button>
          );
        })}
        {filteredGroups.length === 0 && (
          <p className="px-4 py-3 text-[11px] font-mono text-zinc-600">Sin coincidencias.</p>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {visibleGroup === null ? (
          <p className="text-xs font-mono text-zinc-500">Ningún campo coincide con la búsqueda.</p>
        ) : (
          <>
            <div>
              <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wide">
                {visibleGroup.group.label}
              </h3>
              <p className="text-[11px] font-mono text-zinc-500">
                {visibleGroup.group.description} · {visibleGroup.fields.length} campos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleGroup.fields.map((def) => (
                <label key={def.key} className="block space-y-1">
                  <span className="flex items-center justify-between gap-2 text-[11px] font-mono text-zinc-400">
                    <span className="truncate">{def.label}</span>
                    {def.sensitive === true && (
                      <span className="text-[10px] text-red-400/80 uppercase">privado</span>
                    )}
                    {def.requiredForSale === true && def.sensitive !== true && (
                      <span className="text-[10px] text-[#ecb613]/80 uppercase">venta</span>
                    )}
                  </span>
                  {renderInput(def)}
                  <span className="block text-[10px] font-mono text-zinc-600 truncate">{def.key}</span>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderPayments = (): React.ReactElement => (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wide">
          Métodos de cobro declarados
        </h3>
        <p className="text-[11px] font-mono text-zinc-500">
          El dato de cobro (Bizum/IBAN/wallet) sólo se entrega en la ficha pública tras capturar el
          lead: queda registrado en ProviderPaymentRequestLog.
        </p>
        {methods.length === 0 ? (
          <p className="text-xs font-mono text-zinc-600">
            Sin métodos de cobro: añade el primero abajo.
          </p>
        ) : (
          <ul className="space-y-2">
            {methods.map((method) => (
              <li
                key={method.kind}
                className="rounded-2xl bg-[#09090d]/80 border border-white/10 px-4 py-3 flex flex-wrap items-center gap-3"
              >
                <span className="font-mono text-xs text-[#ecb613] uppercase w-28">{method.kind}</span>
                <span className="text-sm text-white">{method.label}</span>
                <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[220px]">
                  {method.reference ?? 'sin dato de cobro'}
                </span>
                <span
                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                    method.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  {method.isActive ? 'activo' : 'inactivo'}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void handleTogglePayment(method)}
                    className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white hover:border-[#ecb613]/50 transition-colors duration-300"
                  >
                    {method.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeletePayment(method)}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-red-400 hover:text-red-300 hover:border-red-500/40 transition-colors duration-300"
                    aria-label={`Eliminar ${method.label}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="rounded-2xl bg-[#09090d]/80 border border-white/10 p-4 space-y-3">
        <h3 className="text-sm font-bold font-syne text-white uppercase tracking-wide">
          Añadir / actualizar método
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Tipo</span>
            <select
              value={paymentDraft.kind}
              onChange={(event) => {
                const kind = event.target.value;
                const preset = PAYMENT_KIND_LABELS.find((item) => item.value === kind);
                setPaymentDraft((previous) => ({
                  ...previous,
                  kind,
                  label: preset ? preset.label : previous.label,
                }));
              }}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613]"
            >
              {PAYMENT_KIND_LABELS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Etiqueta</span>
            <input
              type="text"
              value={paymentDraft.label}
              onChange={(event) =>
                setPaymentDraft((previous) => ({ ...previous, label: event.target.value }))
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613]"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Titular</span>
            <input
              type="text"
              value={paymentDraft.holder}
              onChange={(event) =>
                setPaymentDraft((previous) => ({ ...previous, holder: event.target.value }))
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613]"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] font-mono text-zinc-400">Dato de cobro (privado)</span>
            <input
              type="text"
              value={paymentDraft.reference}
              onChange={(event) =>
                setPaymentDraft((previous) => ({ ...previous, reference: event.target.value }))
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613]"
            />
          </label>
          <label className="block space-y-1 md:col-span-2">
            <span className="text-[11px] font-mono text-zinc-400">Instrucciones para el cliente</span>
            <textarea
              rows={2}
              value={paymentDraft.instructions}
              onChange={(event) =>
                setPaymentDraft((previous) => ({ ...previous, instructions: event.target.value }))
              }
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ecb613] resize-y"
            />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <input
              type="checkbox"
              checked={paymentDraft.isActive}
              onChange={(event) =>
                setPaymentDraft((previous) => ({ ...previous, isActive: event.target.checked }))
              }
            />
            Activo
          </label>
          <label className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <input
              type="checkbox"
              checked={paymentDraft.requiresLeadCapture}
              onChange={(event) =>
                setPaymentDraft((previous) => ({
                  ...previous,
                  requiresLeadCapture: event.target.checked,
                }))
              }
            />
            Exige captura de lead antes de mostrar el dato
          </label>
          <button
            type="button"
            onClick={() => void handleSavePayment()}
            disabled={saving || paymentDraft.label.trim().length === 0}
            className="ml-auto px-4 py-2 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs hover:bg-[#d8a510] disabled:opacity-40 transition-colors duration-300 flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Guardar método
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-stretch justify-end font-sans">
      <div className="w-full max-w-6xl h-full bg-[#050508] border-l border-white/10 flex flex-col">
        <header className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[#ecb613]">
              Perfil del proveedor · {resolvedCategory}
            </p>
            <h2 className="text-lg sm:text-xl font-bold font-syne text-white truncate">
              {providerName}
            </h2>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">
              slug: {providerSlug} · {snapshot ? `${snapshot.filled}/${snapshot.total}` : '...'} campos
              con valor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving || loading || dirty.length === 0}
              className="px-4 py-2 rounded-xl bg-[#ecb613] text-black font-bold font-mono text-xs hover:bg-[#d8a510] disabled:opacity-40 transition-colors duration-300 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Guardar{dirty.length > 0 ? ` (${dirty.length})` : ''}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#ecb613]/50 transition-colors duration-300"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab('campos')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border transition-colors duration-300 ${
              tab === 'campos'
                ? 'bg-[#ecb613]/15 text-[#ecb613] border-[#ecb613]/40'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> {snapshot?.total ?? 0} campos
          </button>
          <button
            type="button"
            onClick={() => setTab('cobros')}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs flex items-center gap-2 border transition-colors duration-300 ${
              tab === 'cobros'
                ? 'bg-[#ecb613]/15 text-[#ecb613] border-[#ecb613]/40'
                : 'text-zinc-400 border-transparent hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Cobros ({methods.length})
          </button>
          <div className="relative ml-auto w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar campo (etiqueta o clave)"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ecb613]"
            />
          </div>
        </div>

        {(error ?? notice) !== null && (
          <div
            className={`px-6 py-2 text-xs font-mono border-b ${
              error !== null
                ? 'bg-red-500/10 text-red-300 border-red-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
            }`}
          >
            {error ?? notice}
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center text-zinc-500 font-mono text-xs gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando ficha real desde PostgreSQL...
          </div>
        ) : tab === 'campos' ? (
          renderFields()
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-5">{renderPayments()}</div>
        )}
      </div>
    </div>
  );
}




