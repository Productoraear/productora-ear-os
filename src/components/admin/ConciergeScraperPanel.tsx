'use client';

import React, { useCallback, useState } from 'react';
import { Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

const CLEAN_PHONE: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

interface ScrapeSimulationResult {
  readonly photos: number;
  readonly menuPrice: number;
  readonly capacity: number;
  readonly name: string;
}

export function ConciergeScraperPanel(): React.JSX.Element {
  const [scraperUrl, setScraperUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<ScrapeSimulationResult | null>(null);

  const notifyWebhook = useCallback((action: string, extraData?: Record<string, unknown>) => {
    try {
      const payload = JSON.stringify({
        pathname: typeof window !== 'undefined' ? window.location.pathname : '/portal/proveedor',
        providerName: 'Portal Proveedores EAR OS',
        category: 'Proveedor',
        action,
        timestamp: new Date().toISOString(),
        ...extraData,
      });

      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/concierge/webhook', new Blob([payload], { type: 'application/json' }));
        return;
      }

      void fetch('/api/concierge/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {
        // Fallback silencioso
      });
    } catch {
      // Silencio deliberado
    }
  }, []);

  const handleScrapeSimulate = useCallback(() => {
    if (!scraperUrl.trim()) return;
    setIsScraping(true);
    setScrapeResult(null);

    setTimeout(() => {
      setIsScraping(false);
      const isE78903 = scraperUrl.includes('e78903') || scraperUrl.toLowerCase().includes('productora-ear');
      if (isE78903) {
        setScrapeResult({
          name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
          photos: 24,
          menuPrice: 550,
          capacity: 250,
        });
        notifyWebhook('sovereign_showcase_migration', {
          showcaseUrl: scraperUrl,
          providerId: 'e78903',
          providerName: 'Productora EAR / Edwin Agudelo',
          category: 'MUSICA_DIRECTO',
        });
      } else {
        setScrapeResult({
          name: scraperUrl.replace(/^https?:\/\//i, '').split('/')[0] || 'Escaparate Detectado',
          photos: 14,
          menuPrice: 145,
          capacity: 350,
        });
        notifyWebhook('scraper_link_analyzed', { link: scraperUrl });
      }
    }, 600);
  }, [scraperUrl, notifyWebhook]);

  const handlePatientZeroPreset = useCallback(
    (preset: 'edwin' | 'otzarreta') => {
      setIsScraping(false);
      if (preset === 'edwin') {
        const canonicalUrl = 'https://www.bodas.net/musica/productora-ear--e78903';
        setScraperUrl(canonicalUrl);
        setScrapeResult({
          name: 'Productora EAR / Edwin Agudelo (Solista e78903)',
          photos: 24,
          menuPrice: 550,
          capacity: 250,
        });
        notifyWebhook('sovereign_showcase_migration', {
          showcaseUrl: canonicalUrl,
          providerId: 'e78903',
          providerName: 'Productora EAR / Edwin Agudelo',
          category: 'MUSICA_DIRECTO',
        });
      } else {
        setScraperUrl('https://productoraear.com/otzarreta');
        setScrapeResult({
          name: 'Eduardo Martínez (Otzarreta / Ezkertza Berria · Derio)',
          photos: 32,
          menuPrice: 145,
          capacity: 350,
        });
        notifyWebhook('patient_zero_preset', { preset: 'otzarreta_derio' });
      }
    },
    [notifyWebhook]
  );

  const scrapeWaHref = scrapeResult
    ? `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
        `Hola Centralita EAR OS, solicito homologación de escaparate: ${scrapeResult.name} [Enlace analizado: ${scraperUrl} | Aforo: ${scrapeResult.capacity} pax | Menú: ${scrapeResult.menuPrice} €]`
      )}`
    : null;

  return (
    <div className="pt-2 border-t border-zinc-800 space-y-1.5">
      <div className="text-[10px] text-zinc-400 font-mono">Convertidor de escaparate (Bodas.net):</div>
      <div className="flex gap-1.5">
        <button
          type="button"
          onClick={() => handlePatientZeroPreset('edwin')}
          className="rounded border border-[#ecb613]/25 bg-white/[0.05] px-2 py-1 text-xs text-[#ecb613] transition-colors duration-160 ease-hallmark hover:bg-white/[0.10]"
        >
          Edwin Agudelo
        </button>
        <button
          type="button"
          onClick={() => handlePatientZeroPreset('otzarreta')}
          className="rounded border border-[#ecb613]/25 bg-white/[0.05] px-2 py-1 text-xs text-[#ecb613] transition-colors duration-160 ease-hallmark hover:bg-white/[0.10]"
        >
          Otzarreta
        </button>
      </div>
      <div className="flex gap-1.5">
        <input
          type="url"
          placeholder="https://www.bodas.net/..."
          value={scraperUrl}
          onChange={(e) => setScraperUrl(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-white/[0.12] bg-[#0F0F16] px-2.5 py-1.5 text-xs text-[#F4F1EA] placeholder:text-[#6F6B62] focus:border-[#ecb613] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleScrapeSimulate}
          disabled={isScraping || !scraperUrl.trim()}
          className="px-2.5 py-1 bg-[#ecb613] hover:bg-amber-400 text-black font-bold rounded-lg text-xs disabled:opacity-50 flex items-center gap-1"
        >
          {isScraping ? <Loader2 size={11} className="animate-spin" /> : 'Analizar'}
        </button>
      </div>
      {scrapeResult && (
        <div className="space-y-1.5 p-2 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-300 text-[10px]">
          <div>
            <span className="font-bold">{scrapeResult.name}:</span> Ficha lista para homologación oficial.
          </div>
          {scrapeWaHref && (
            <a
              href={scrapeWaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded bg-emerald-500/20 px-2 py-1 text-emerald-200 hover:bg-emerald-500/30 transition-colors"
            >
              <span className="flex items-center gap-1 font-semibold">
                <MessageSquare size={11} />
                Enviar análisis a Centralita ({CENTRALITA_EAR_OS})
              </span>
              <ArrowRight size={11} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
