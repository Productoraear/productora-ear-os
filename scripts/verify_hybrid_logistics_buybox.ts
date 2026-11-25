import assert from 'node:assert/strict';
import {
  HUB_MENTRIDA_COORDINATES,
  HUB_MENTRIDA_ADDRESS,
  planLogisticsDispatch,
} from '../src/lib/agents/geo';
import { resolveHybridLogisticsQuote } from '../src/lib/services/marketplace/buybox-matching-engine';

console.log('🧪 Iniciando Verificación Motor Logístico Hub Méntrida Km 0 + BuyBox Desacoplado...');

// 1. Verificación de Coordenadas de Hub Méntrida
assert.equal(HUB_MENTRIDA_COORDINATES.latitude, 40.2378, 'Latitud Méntrida debe ser 40.2378');
assert.equal(HUB_MENTRIDA_COORDINATES.longitude, -4.1953, 'Longitud Méntrida debe ser -4.1953');
assert.equal(HUB_MENTRIDA_ADDRESS.postalCode, '45214', 'Código postal debe ser 45214');
console.log('✅ Coordenadas canónicas de Hub Méntrida verificadas.');

// 2. Verificación de Evento Local (Madrid, <= 150 km) -> Despacho Integrado
const madridDispatch = planLogisticsDispatch('Madrid', 60);
assert.equal(madridDispatch.dispatchMode, 'INTEGRATED_MENTRIDA_FLEET');
assert.equal(madridDispatch.technicalSoundFromMentrida, true);
console.log('✅ Despacho Madrid (60 km): Paquetizado integrado con flota Méntrida.');

// 3. Verificación de Evento Lejano (Bilbao, 440 km > 150 km) -> Despacho Desacoplado
const bilbaoQuote = resolveHybridLogisticsQuote('Bilbao', 440, 'Sonido Bizkaia S.L.');
assert.equal(bilbaoQuote.routing.dispatchMode, 'DECOUPLED_LOCAL_BUYBOX');
assert.equal(bilbaoQuote.soloArtist.travelFromMentrida, true, 'Edwin debe viajar desde Méntrida');
assert.equal(bilbaoQuote.soloArtist.distanceKm, 440, 'Distancia de Edwin debe ser 440 km');
assert.equal(bilbaoQuote.soundProvisioning.isLocalProvider, true, 'El sonido debe ser de proveedor local');
assert.equal(bilbaoQuote.soundProvisioning.vanLogisticsChargedFromToledo, false, 'No se deben cobrar portes de furgoneta desde Toledo para el sonido');
assert.equal(bilbaoQuote.soundProvisioning.providerName, 'Sonido Bizkaia S.L.');
console.log('✅ Despacho Bilbao (440 km): Edwin cotizado desde Méntrida y sonido asignado a Bizkaia sin portes de furgoneta desde Toledo.');

// 4. Verificación de Bilateral Matching Tinder & AirCover de Gala
import { evaluateBilateralMatch } from '../src/lib/services/marketplace/buybox-matching-engine';

const matchResult = evaluateBilateralMatch(
  {
    id: 'otzarreta',
    slug: 'otzarreta',
    name: 'Restaurante Otzarreta',
    category: 'fincas',
    province: 'Bizkaia',
    basePriceEur: 145,
    maxAcousticDb: 72,
  },
  {
    eventDate: '2026-09-19',
    province: 'Bizkaia',
    guestCount: 140,
    budgetEur: 25000,
    preferredCategory: 'fincas',
  },
  true
);

assert.equal(matchResult.isTwoWayMatch, true, 'Debe ser Two-Way Match');
assert.equal(matchResult.airCoverGuaranteeActive, true, 'AirCover debe estar activo');
assert.equal(matchResult.acousticMatch, true, 'Acústica debe cumplir < 75 dB');
console.log('✅ Bilateral Match Tinder + AirCover de Gala verificado (Two-Way Double Opt-In).');

console.log('🏆 4/4 TESTS DE ENRUTAMIENTO LOGÍSTICO, BUYBOX Y BILATERAL MATCHING EXITOSOS (EXIT CODE 0)');
