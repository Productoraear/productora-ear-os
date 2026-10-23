/**
 * 🎓 DIVISIÓN 6 · ARTIST CAREER MANAGEMENT (MULTINACIONAL 360°).
 * ----------------------------------------------------------------------------
 * Gestiona carreras artísticas completas, desde el artista emergente hasta el
 * élite, replicando la estructura departamental de una multinacional del
 * entretenimiento: A&R, desarrollo, release, touring, brand, catálogo, sync,
 * fanbase y business affairs. Consume el motor puro `artistCareerEngine` y los
 * motores soberanos de catálogo y distribución.
 */
import type { AgentBus, AgentHandler, AgentMessage, AgentReply, FollowUp } from './agentBus';
import { dispatchToN8n } from './n8nDispatcher';
import {
  classifyArtistStage,
  computeStreamingRevenue,
  computeRoyaltyShare,
  computeLiveFee,
  computeSyncLicenseAnchor,
  computeBrandDealAnchor,
  buildArtistRoadmap,
  getStageBand,
  isArtistCareerStage,
} from './artistCareerEngine';
import type { ArtistMetrics } from './artistCareerEngine';
import { getCatalogSummary } from '@/lib/artists/artistCatalogEngine';
import { generateSovereignISRC, generateSovereignUPC, validateAudioForDSP } from '@/lib/distribution/aggregatorEngine';
import type { SovereignRelease } from '@/lib/distribution/aggregatorEngine';
import { roundEur, computeSplit } from './pricing';

function readMetrics(msg: AgentMessage): ArtistMetrics {
  return {
    monthlyListeners: Number(msg.payload.monthlyListeners ?? 0),
    socialFollowers: Number(msg.payload.socialFollowers ?? 0),
    liveGigsPerYear: Number(msg.payload.liveGigsPerYear ?? 0),
    catalogSize: Number(msg.payload.catalogSize ?? 0),
  };
}

/** 1. artist-career-manager (flagship): roadmap 360° + delegación departamental. */
const artistCareerManagerHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const metrics = readMetrics(msg);
  const ownsMasters = Boolean(msg.payload.ownsMasters ?? false);
  const hasLegalEntity = Boolean(msg.payload.hasLegalEntity ?? false);

  const roadmap = buildArtistRoadmap({
    name: artistName,
    discipline: String(msg.payload.discipline ?? 'solista'),
    metrics,
    ownsMasters,
    hasLegalEntity,
    primaryTerritory: String(msg.payload.territory ?? 'España'),
  });

  const followUps: FollowUp[] = [
    {
      to: 'artist-scout',
      intent: 'onboard_artist',
      payload: {
        artistName,
        monthlyListeners: metrics.monthlyListeners,
        socialFollowers: metrics.socialFollowers,
        liveGigsPerYear: metrics.liveGigsPerYear,
        catalogSize: metrics.catalogSize,
      },
    },
    {
      to: 'release-strategist',
      intent: 'plan_release',
      payload: { artistName, monthlyListeners: metrics.monthlyListeners, catalogSize: metrics.catalogSize },
    },
    {
      to: 'business-affairs-agent',
      intent: 'draft_deal',
      payload: { artistName, stage: roadmap.stage },
    },
  ];

  void dispatchToN8n('artist-career-intake', {
    artistName,
    stage: roadmap.stage,
    commissionPct: roadmap.managementCommissionPct,
    advance: roadmap.estimatedAdvanceEur,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Gestión 360° de ${artistName} (${roadmap.stageLabel}): comisión ${roadmap.managementCommissionPct}%, anticipo ${roadmap.estimatedAdvanceEur} €, ${roadmap.releaseCadencePerYear} release(s)/año. ${roadmap.milestones.length} pilares activos.`,
    followUps,
  };
};

/** 2. artist-scout: A&R — clasificación de etapa y decisión de firma. */
const artistScoutHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const metrics = readMetrics(msg);
  const stage = classifyArtistStage(metrics);
  const rosterCount = getCatalogSummary().totalArtists;
  const apto = metrics.monthlyListeners >= 1000 || metrics.liveGigsPerYear >= 10;
  const verdict = apto ? 'APTO para firma 360°' : 'En observación (desarrollo previo)';

  void dispatchToN8n('artist-career-intake', {
    artistName,
    stage,
    rosterCount,
    verdict,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `A&R Scout: ${artistName} clasificado como ${stage} · roster actual ${rosterCount} artistas · ${verdict}.`,
  };
};

/** 3. artist-development: coaching vocal/imagen/marca según etapa. */
const artistDevelopmentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const stage = classifyArtistStage(readMetrics(msg));
  const band = getStageBand(stage);
  const coachingHours = stage === 'elite' ? 4 : stage === 'established' ? 5 : stage === 'developing' ? 7 : 8;

  void dispatchToN8n('artist-development-plan', {
    artistName,
    stage,
    coachingHours,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Desarrollo de ${artistName} (${band.label}): ${coachingHours} h/semana de coaching en 4 pilares (voz, imagen, marca, escena).`,
  };
};

/** 4. release-strategist: plan de release con ISRC/UPC soberano y validación DSP. */
const releaseStrategistHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const title = String(msg.payload.title ?? 'Nuevo Sencillo');

  const release: SovereignRelease = {
    id: `${artistName}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40),
    title,
    artist: artistName,
    album: title,
    durationSeconds: Math.max(30, Number(msg.payload.durationSeconds ?? 180)),
    genre: String(msg.payload.genre ?? 'Mariachi de Gala'),
    language: 'es-ES',
    releaseDate: String(msg.payload.releaseDate ?? new Date().toISOString().slice(0, 10)),
  };

  const isrc = generateSovereignISRC(release);
  const upc = generateSovereignUPC(release);
  const validation = validateAudioForDSP({ ...release, isrc, upc });
  const dspReady = validation.every((v) => v.valid);

  void dispatchToN8n('artist-release-plan', {
    artistName,
    title,
    isrc,
    upc,
    dspReady,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Release '${title}' de ${artistName}: ISRC ${isrc} · UPC ${upc} · DSP ${dspReady ? 'LISTO' : 'con incidencias'}.`,
  };
};

/** 5. tour-architect: plan de gira con caché por bolo y split 80/10/10. */
const tourArchitectHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const stage = classifyArtistStage(readMetrics(msg));
  const feePerShow = computeLiveFee(stage);
  const dates = Math.max(1, Number(msg.payload.dates ?? 5));
  const gross = roundEur(feePerShow * dates);
  const split = computeSplit(gross);

  void dispatchToN8n('artist-tour-plan', {
    artistName,
    stage,
    feePerShow,
    dates,
    gross,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Tour de ${artistName}: ${dates} fechas × ${feePerShow} € = ${gross} € brutos · split ${split.artista}/${split.earOs}/${split.vimume} €.`,
  };
};

/** 6. brand-partnership-director: campañas de marca y endorsements. */
const brandPartnershipDirectorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const brand = String(msg.payload.brand ?? 'Marca');
  const stage = classifyArtistStage(readMetrics(msg));
  const anchor = computeBrandDealAnchor(stage);

  void dispatchToN8n('artist-brand-deal', {
    artistName,
    brand,
    stage,
    anchor,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Brand partnership ${artistName} × ${brand}: ancla de campaña ${anchor} € (${stage}).`,
  };
};

/** 7. catalog-publishing-director: regalías de catálogo y publishing. */
const catalogPublishingDirectorHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const streams = Math.max(0, Number(msg.payload.streams ?? 0));
  const ownsMasters = Boolean(msg.payload.ownsMasters ?? false);
  const revenue = computeStreamingRevenue(streams);
  const artistShare = computeRoyaltyShare(revenue, ownsMasters);

  void dispatchToN8n('artist-catalog-royalties', {
    artistName,
    streams,
    revenue,
    artistShare,
    ownsMasters,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Catálogo de ${artistName}: ${streams} streams → ${revenue} € · regalía artista ${artistShare} € (${
      ownsMasters ? 'dueño del máster' : 'máster licenciado'
    }).`,
  };
};

/** 8. sync-licensing-agent: licencias de sincronización para TV/ads/cine. */
const syncLicensingAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const media = String(msg.payload.media ?? 'TV/Ads/Cine');
  const stage = classifyArtistStage(readMetrics(msg));
  const anchor = computeSyncLicenseAnchor(stage);

  void dispatchToN8n('artist-sync-license', {
    artistName,
    media,
    stage,
    anchor,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Sync licensing de ${artistName} para ${media}: ancla ${anchor} € (${stage}).`,
  };
};

/** 9. fanbase-growth-agent: crecimiento digital y de audiencia. */
const fanbaseGrowthAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const followers = Number(msg.payload.socialFollowers ?? 0);
  const stage = classifyArtistStage(readMetrics(msg));
  const growthTarget = stage === 'elite' ? 15 : stage === 'established' ? 20 : stage === 'developing' ? 25 : 30;

  void dispatchToN8n('artist-fanbase-growth', {
    artistName,
    followers,
    growthTargetPct: growthTarget,
    timestamp: msg.createdAt,
  });

  return {
    ok: true,
    summary: `Crecimiento de fanbase de ${artistName}: objetivo ${growthTarget}% trimestral (${followers} seguidores actuales).`,
  };
};

/** 10. business-affairs-agent: comisión, anticipo y estructura legal. */
const businessAffairsAgentHandler: AgentHandler = async (msg: AgentMessage): Promise<AgentReply> => {
  const artistName = String(msg.payload.artistName ?? 'Artista');
  const rawStage = String(msg.payload.stage ?? '');
  const stage = isArtistCareerStage(rawStage) ? rawStage : classifyArtistStage(readMetrics(msg));
  const band = getStageBand(stage);
  const hasLegalEntity = Boolean(msg.payload.hasLegalEntity ?? false);
  const recommendation = hasLegalEntity
    ? 'Contrato 360° directo con sociedad'
    : 'Constitución de sociedad + contrato de management';

  return {
    ok: true,
    summary: `Business Affairs de ${artistName}: comisión ${band.managementCommissionPct}%, anticipo ${band.estimatedAdvanceEur} € · ${recommendation}.`,
  };
};

export function registerArtistCareerDivision(bus: AgentBus): void {
  bus.register('artist-career-manager', artistCareerManagerHandler);
  bus.register('artist-scout', artistScoutHandler);
  bus.register('artist-development', artistDevelopmentHandler);
  bus.register('release-strategist', releaseStrategistHandler);
  bus.register('tour-architect', tourArchitectHandler);
  bus.register('brand-partnership-director', brandPartnershipDirectorHandler);
  bus.register('catalog-publishing-director', catalogPublishingDirectorHandler);
  bus.register('sync-licensing-agent', syncLicensingAgentHandler);
  bus.register('fanbase-growth-agent', fanbaseGrowthAgentHandler);
  bus.register('business-affairs-agent', businessAffairsAgentHandler);
}

