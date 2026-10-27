'use strict';

const { areAdjacent } = require('./province_adjacency.cjs');
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * PROVIDER_ENRICHMENT.CJS — REGLAS DE ATRIBUCIÓN Y CONSOLIDACIÓN (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════════
 * Convierte candidatos de Overture Places en datos publicables SOLO cuando hay
 * evidencia suficiente: nombre + provincia + categoría + dominio propio.
 * Ningún teléfono/web/email se atribuye si hay ambigüedad entre sedes.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const CENTRALITA = '+34 693 693 048';

const PREMIUM_PREFIXES = [
    '700', '703', '704', '705', '706', '707', '708', '709',
    '803', '806', '807', '901', '902', '905', '909'
];

const SOCIAL_HOSTS = {
    instagram: /(^|\.)instagram\.com$/i,
    facebook: /(^|\.)facebook\.com$/i,
    tiktok: /(^|\.)tiktok\.com$/i,
    youtube: /(^|\.)youtube\.com$/i,
    linkedin: /(^|\.)linkedin\.com$/i,
    twitter: /(^|\.)(twitter|x)\.com$/i,
    pinterest: /(^|\.)pinterest\.[a-z.]+$/i
};

const MARKETPLACE_HOSTS = [
    'bodas.net', 'bodas.com', 'zankyou.es', 'zankyou.com', 'matrimonio.com',
    'google.com', 'google.es', 'goo.gl', 'maps.google.com', 'bing.com',
    'facebook.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'linkedin.com',
    'twitter.com', 'x.com', 'pinterest.com', 'whatsapp.com', 'wa.me',
    'tripadvisor.es', 'tripadvisor.com', 'yelp.es', 'yelp.com',
    'paginasamarillas.es', 'axesor.es', 'einforma.com', 'empresite.eleconomista.es',
    'infoisinfo.es', 'guiaempresas.es', 'universia.es', 'expansion.com',
    'foursquare.com', 'waze.com', 'apple.com', 'maps.apple.com',
    'booking.com', 'airbnb.es', 'airbnb.com', 'expedia.es', 'trivago.es',
    'idealista.com', 'fotocasa.es', 'milanuncios.com', 'wallapop.com',
    'amazon.es', 'eltenedor.es', 'thefork.es', 'just-eat.es', 'glovoapp.com',
    'doctoralia.es', 'habitissimo.es', 'cronoshare.com', 'milanuncios.es'
];

const SPAIN_REGIONS = [
    { minLat: 35.9, maxLat: 44.0, minLng: -9.6, maxLng: 4.6 },
    { minLat: 38.5, maxLat: 40.2, minLng: 1.0, maxLng: 4.6 },
    { minLat: 27.5, maxLat: 29.6, minLng: -18.3, maxLng: -13.3 },
    { minLat: 34.8, maxLat: 36.0, minLng: -5.6, maxLng: -1.0 }
];

const STOP_TOKENS = new Set([
    'de', 'la', 'el', 'los', 'las', 'del', 'y', 'e', 'en', 'por', 'para', 'con',
    'the', 'and', 'of', 'sl', 'slu', 'sa', 'sau', 'cb', 'sll', 'scp', 'soc',
    'coop', 'slne', 'cif', 'nif', 'espana', 'spain'
]);

function normText(value) {
    return String(value == null ? '' : value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenSet(value) {
    return new Set(
        normText(value)
            .split(' ')
            .filter((t) => t.length >= 3 && !STOP_TOKENS.has(t))
    );
}

function mainToken(value) {
    let best = '';
    for (const token of tokenSet(value)) {
        if (token.length > best.length) best = token;
    }
    return best;
}

function domainOf(url) {
    if (!url) return '';
    try {
        const parsed = new URL(String(url).trim());
        if (!/^https?:$/.test(parsed.protocol)) return '';
        return parsed.hostname.toLowerCase().replace(/^www\./, '');
    } catch (err) {
        return '';
    }
}

function socialKind(url) {
    const host = domainOf(url);
    if (!host) return '';
    for (const [key, re] of Object.entries(SOCIAL_HOSTS)) {
        if (re.test(host)) return key;
    }
    return '';
}

function isMarketplaceHost(host) {
    if (!host) return true;
    return MARKETPLACE_HOSTS.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

function normalizePhone(raw) {
    let digits = String(raw == null ? '' : raw).replace(/[^0-9]/g, '');
    if (digits.startsWith('0034')) digits = digits.slice(4);
    else if (digits.startsWith('34') && digits.length === 11) digits = digits.slice(2);
    if (digits.length !== 9) return '';
    if (!/^[6789]/.test(digits)) return '';
    if (PREMIUM_PREFIXES.includes(digits.slice(0, 3))) return '';
    if (digits === CENTRALITA.replace(/[^0-9]/g, '').slice(-9)) return '';
    return digits;
}

function formatPhone(digits) {
    if (!digits) return '';
    return `+34 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
}

function phoneKind(digits) {
    if (!digits) return '';
    return /^[67]/.test(digits) ? 'MOVIL' : 'FIJO';
}

function isValidEmail(email) {
    if (!email) return false;
    const value = String(email).trim();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) return false;
    const host = value.split('@')[1].toLowerCase();
    if (isMarketplaceHost(host)) return false;
    if (/^(noreply|no-reply|donotreply|webmaster@bodas)/i.test(value)) return false;
    return true;
}

function isInsideSpain(lat, lng) {
    return SPAIN_REGIONS.some((r) => lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng);
}

function uniqueStrings(values) {
    const out = [];
    const seen = new Set();
    for (const raw of values || []) {
        const value = String(raw == null ? '' : raw).trim();
        if (!value) continue;
        const key = value.toLowerCase().replace(/\/+$/, '');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(value);
    }
    return out;
}

const GENERIC_DOMAIN_TOKENS = new Set([
    'fincas', 'finca', 'bodas', 'boda', 'eventos', 'evento', 'fotos', 'foto',
    'musica', 'catering', 'decoracion', 'flores', 'sonido', 'viajes', 'servicios',
    'producciones', 'estudio', 'grupo', 'spain', 'espana', 'wedding', 'events'
]);

function extractContacts(candidate) {
    const phones = [];
    for (const raw of candidate.phones || []) {
        const digits = normalizePhone(raw);
        if (digits && !phones.includes(digits)) phones.push(digits);
    }

    const websites = [];
    const socials = {};
    for (const raw of uniqueStrings(candidate.socials)) {
        const kind = socialKind(raw);
        if (kind && !socials[kind]) socials[kind] = raw;
    }
    for (const raw of uniqueStrings(candidate.websites)) {
        const host = domainOf(raw);
        if (!host || isMarketplaceHost(host)) continue;
        const kind = socialKind(raw);
        if (kind) {
            if (!socials[kind]) socials[kind] = raw;
            continue;
        }
        if (!websites.includes(raw)) websites.push(raw);
    }

    const emails = [];
    for (const raw of uniqueStrings(candidate.emails)) {
        if (isValidEmail(raw) && !emails.includes(raw)) emails.push(raw);
    }

    return { phones, websites, emails, socials };
}

function computeDomainHit(provider, contacts) {
    const nameCompact = normText(provider.name).replace(/ /g, '');
    if (!nameCompact) return false;
    const tokens = [...tokenSet(provider.name)].filter((t) => t.length >= 5 && !GENERIC_DOMAIN_TOKENS.has(t));

    const domains = contacts.websites.map(domainOf);
    for (const email of contacts.emails) domains.push(domainOf(`http://${email.split('@')[1]}`));

    for (const domain of domains) {
        if (!domain) continue;
        const compact = domain.replace(/[^a-z0-9]/g, '');
        if (compact && (compact.includes(nameCompact) || nameCompact.includes(compact))) return true;
        for (const token of tokens) {
            if (compact.includes(token)) return true;
        }
    }
    return false;
}

function evaluateCandidate(provider, candidate, candidatesForVendor) {
    const geo = Number(candidate.geo);
    const cat = Number(candidate.cat);
    const isExact = candidate.mode === 'exact';
    const nameScore = isExact ? 1 : Number(candidate.name_score) || 0;
    const contacts = extractContacts(candidate);
    const domainHit = computeDomainHit(provider, contacts);
    const distinctive = normText(provider.name).replace(/ /g, '').length >= 10 && tokenSet(provider.name).size >= 2;
    // FASE 2: provincia limítrofe con evidencia de dominio. Nunca concede `verified`.
    const adjacent = candidate.adjacent === true && geo === 0 && areAdjacent(provider.province, candidate.ov_prov);

    let accepted = false;
    let reason = '';
    if (isExact) {
        if (geo === 0) {
            if (!adjacent) reason = 'exact_geo_mismatch';
            else if (!distinctive) reason = 'exact_adjacent_generic_name';
            else if (cat < 1) reason = 'exact_adjacent_category_mismatch';
            else if (!domainHit) reason = 'exact_adjacent_no_domain_evidence';
            else accepted = true;
        } else if (geo === 1) {
            accepted = true;
        } else if (candidatesForVendor > 1) reason = 'exact_unknown_province_ambiguous';
        else if (!distinctive) reason = 'exact_unknown_province_generic';
        else if (!(domainHit || cat >= 1)) reason = 'exact_unknown_province_weak';
        else accepted = true;
    } else {
        if (geo !== 1) {
            if (adjacent && cat >= 1 && nameScore >= 0.94 && domainHit) accepted = true;
            else reason = 'fuzzy_geo_mismatch';
        } else if (cat < 1) reason = 'fuzzy_category_mismatch';
        else if (nameScore < 0.93) reason = 'fuzzy_low_name_score';
        else if (!(domainHit || (Number(candidate.inter) >= 2 && nameScore >= 0.95) || nameScore >= 0.97)) {
            reason = 'fuzzy_weak_evidence';
        } else accepted = true;
    }

    return {
        accepted,
        reason,
        candidate,
        contacts,
        geo,
        cat,
        isExact,
        nameScore,
        domainHit,
        adjacent,
        contactCount: contacts.phones.length + contacts.websites.length + contacts.emails.length
    };
}

function contactSignature(entry) {
    return JSON.stringify({
        phones: [...entry.contacts.phones].sort(),
        websites: [...entry.contacts.websites].map(domainOf).sort(),
        emails: [...entry.contacts.emails].sort()
    });
}

function commonSocials(entries) {
    if (entries.length === 1) return { ...entries[0].contacts.socials };
    const out = {};
    for (const key of ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'twitter', 'pinterest']) {
        const values = entries.map((e) => e.contacts.socials[key]).filter(Boolean);
        if (values.length === entries.length && new Set(values).size === 1) out[key] = values[0];
    }
    return out;
}

function bestWebsite(entries) {
    const domains = new Set();
    for (const entry of entries) {
        for (const url of entry.contacts.websites) domains.add(domainOf(url));
    }
    if (domains.size !== 1) return '';
    const only = [...domains][0];
    for (const entry of entries) {
        const url = entry.contacts.websites.find((u) => domainOf(u) === only);
        if (url) return url;
    }
    return '';
}

function bestEmail(entries, webDomain) {
    const unique = [...new Set(entries.flatMap((e) => e.contacts.emails))];
    if (unique.length === 1) return unique[0];
    if (webDomain) {
        const matching = unique.filter((e) => domainOf(`http://${e.split('@')[1]}`) === webDomain);
        if (matching.length === 1) return matching[0];
    }
    return '';
}

function chooseForProvider(provider, evaluated) {
    const accepted = evaluated.filter((e) => e.accepted);
    if (accepted.length === 0) {
        const reason = evaluated.find((e) => e.reason)?.reason || 'rejected';
        return { enrichment: null, reason };
    }

    accepted.sort((a, b) => (
        (b.geo - a.geo)
        || (Number(b.isExact) - Number(a.isExact))
        || (Number(b.domainHit) - Number(a.domainHit))
        || (b.nameScore - a.nameScore)
        || (b.contactCount - a.contactCount)
    ));

    const best = accepted[0];
    const crossProvince = best.adjacent === true;
    const topTier = accepted.filter((e) => (
        e.geo === best.geo
        && e.isExact === best.isExact
        && Math.abs(e.nameScore - best.nameScore) <= 0.01
    ));

    const signatures = new Set(topTier.map(contactSignature));
    const ambiguous = signatures.size > 1;
    const chosen = ambiguous ? [best] : topTier;

    const web = ambiguous ? bestWebsite(topTier) : (bestWebsite(chosen) || chosen[0].contacts.websites[0] || '');
    const webDomain = domainOf(web);
    const email = bestEmail(chosen, webDomain);
    const socials = commonSocials(chosen);
    const phones = ambiguous ? [] : [...new Set(chosen.flatMap((e) => e.contacts.phones))];

    let confidence;
    if (best.isExact) {
        confidence = best.geo === 1 ? (ambiguous ? 0.92 : 0.99) : 0.90;
    } else {
        confidence = Math.min(0.96, 0.86 + 0.06 * best.nameScore + 0.04 * Number(best.domainHit));
        if (ambiguous) confidence = Math.min(confidence, 0.90);
    }
    confidence = Number(confidence.toFixed(3));
    if (crossProvince) confidence = Math.min(confidence, 0.90);

    const lat = Number(best.candidate.lat);
    const lng = Number(best.candidate.lon);
    const hasGeo = !ambiguous && Number.isFinite(lat) && Number.isFinite(lng) && isInsideSpain(lat, lng);

    const fields = [];
    if (phones.length) fields.push('phone');
    if (web) fields.push('web');
    if (email) fields.push('email');
    if (Object.keys(socials).length) fields.push('socials');
    if (hasGeo) fields.push('geo');

    const enrichment = {
        vendorId: provider.vendorId,
        name: provider.name,
        provider_category: provider.category || '',
        source: 'overture',
        dataset: 'overture:2026-10-21.0',
        license: 'CDLA-Permissive-2.0',
        mode: best.isExact ? 'exact' : 'fuzzy',
        confidence,
        ambiguous,
        matched: {
            id: best.candidate.ov_id,
            name: best.candidate.ov_name,
            category: best.candidate.ov_category || '',
            province: best.candidate.ov_prov || '',
            locality: best.candidate.locality || '',
            jw: Number(Number(best.candidate.jw || 1).toFixed(4)),
            geo: best.geo,
            cat: best.cat,
            domainHit: best.domainHit,
            crossProvince: crossProvince || undefined,
            providerProvince: crossProvince ? String(provider.province || '') : undefined
        },
        phone: phones.length ? formatPhone(phones[0]) : '',
        phone_kind: phones.length ? phoneKind(phones[0]) : '',
        phones: phones.map(formatPhone),
        web,
        email,
        instagram: socials.instagram || '',
        facebook: socials.facebook || '',
        tiktok: socials.tiktok || '',
        youtube: socials.youtube || '',
        linkedin: socials.linkedin || '',
        pinterest: socials.pinterest || '',
        twitter: socials.twitter || '',
        lat: hasGeo ? Number(lat.toFixed(6)) : null,
        lng: hasGeo ? Number(lng.toFixed(6)) : null,
        address: hasGeo ? String(best.candidate.street || '').trim() : '',
        municipality: hasGeo ? String(best.candidate.locality || '').trim() : '',
        province: hasGeo ? String(best.candidate.region || best.candidate.ov_prov || '').trim() : '',
        evidence: {
            fields,
            dataset: 'overture:2026-10-21.0',
            license: 'CDLA-Permissive-2.0',
            retrievedAt: new Date().toISOString(),
            rule: best.isExact
                ? (crossProvince ? 'exact+adjacent-province+domain-hit' : 'exact-normalized-name+geo')
                : (crossProvince ? 'prefix-block+jaro-winkler+adjacent-province+domain-hit' : 'prefix-block+jaro-winkler+geo+category')
        }
    };

    enrichment.verified = Boolean(phones.length) && confidence >= 0.95 && !ambiguous && !crossProvince;
    return { enrichment, reason: ambiguous ? 'ambiguous_contact_withheld' : '' };
}

function consolidate(providers, candidates, meta) {
    const byVendor = new Map();
    for (const candidate of candidates) {
        if (!candidate.vendorId) continue;
        if (!byVendor.has(candidate.vendorId)) byVendor.set(candidate.vendorId, []);
        byVendor.get(candidate.vendorId).push(candidate);
    }

    const result = {};
    const reasons = {};
    const bump = (key) => { reasons[key] = (reasons[key] || 0) + 1; };

    for (const provider of providers) {
        if (!provider.vendorId) continue;
        const list = byVendor.get(provider.vendorId) || [];
        if (list.length === 0) {
            bump('no_candidate');
            continue;
        }
        const evaluated = list.map((c) => evaluateCandidate(provider, c, list.length));
        const { enrichment, reason } = chooseForProvider(provider, evaluated);
        if (!enrichment) {
            bump(evaluated.find((e) => e.reason)?.reason || reason || 'rejected');
            continue;
        }
        if (reason) bump(reason);
        result[provider.vendorId] = enrichment;
    }

    // Dedupe global: un teléfono solo puede pertenecer a un proveedor.
    const owners = new Map();
    for (const [vendorId, entry] of Object.entries(result)) {
        if (!entry.phone) continue;
        const digits = normalizePhone(entry.phone);
        if (!digits) continue;
        if (!owners.has(digits)) owners.set(digits, []);
        owners.get(digits).push(vendorId);
    }

    let disputedPhones = 0;
    for (const [digits, vendorIds] of owners.entries()) {
        if (vendorIds.length <= 1) continue;
        disputedPhones++;
        for (const vendorId of vendorIds) {
            const entry = result[vendorId];
            entry.phone = '';
            entry.phone_kind = '';
            entry.phones = [];
            entry.verified = false;
            entry.disputed = {
                ...(entry.disputed || {}),
                phone: { reason: 'shared_across_providers', owners: vendorIds.length, digits }
            };
            entry.evidence.fields = entry.evidence.fields.filter((f) => f !== 'phone');
        }
    }

    const values = Object.values(result);
    const audit = {
        meta: {
            generatedAt: new Date().toISOString(),
            dataset: meta.dataset,
            license: meta.license,
            providersEvaluated: providers.length,
            candidateRows: candidates.length,
            vendorsWithCandidates: byVendor.size
        },
        accepted: values.length,
        withPhone: values.filter((e) => e.phone).length,
        withWeb: values.filter((e) => e.web).length,
        withEmail: values.filter((e) => e.email).length,
        withSocials: values.filter((e) => e.instagram || e.facebook || e.tiktok || e.youtube || e.linkedin).length,
        withGeo: values.filter((e) => typeof e.lat === 'number').length,
        verified: values.filter((e) => e.verified).length,
        ambiguous: values.filter((e) => e.ambiguous).length,
        disputedPhones,
        byMode: {
            exact: values.filter((e) => e.mode === 'exact').length,
            fuzzy: values.filter((e) => e.mode === 'fuzzy').length
        },
        byCategory: {},
        confidence: {
            high: values.filter((e) => e.confidence >= 0.95).length,
            medium: values.filter((e) => e.confidence >= 0.90 && e.confidence < 0.95).length,
            low: values.filter((e) => e.confidence < 0.90).length
        },
        rejections: Object.fromEntries(Object.entries(reasons).sort((a, b) => b[1] - a[1]))
    };

    for (const entry of values) {
        const cat = entry.provider_category || 'desconocido';
        if (!audit.byCategory[cat]) audit.byCategory[cat] = { providers: 0, phone: 0, web: 0, email: 0 };
        audit.byCategory[cat].providers++;
        if (entry.phone) audit.byCategory[cat].phone++;
        if (entry.web) audit.byCategory[cat].web++;
        if (entry.email) audit.byCategory[cat].email++;
    }

    return { providers: result, audit };
}

module.exports = {
    CENTRALITA,
    PREMIUM_PREFIXES,
    SOCIAL_HOSTS,
    MARKETPLACE_HOSTS,
    SPAIN_REGIONS,
    normText,
    tokenSet,
    mainToken,
    domainOf,
    socialKind,
    isMarketplaceHost,
    normalizePhone,
    formatPhone,
    phoneKind,
    isValidEmail,
    isInsideSpain,
    uniqueStrings,
    extractContacts,
    computeDomainHit,
    evaluateCandidate,
    chooseForProvider,
    consolidate
};




