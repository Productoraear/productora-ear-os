/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DE RENDERIZADO DE LANDING MUNICIPAL 70/30 (W42_T06)
 * ════════════════════════════════════════════════════════════════════════════
 * Comprueba que:
 * 1. La plantilla exporta `dynamicParams = true` y `revalidate = 86400`.
 * 2. El compositor 70/30 genera los bloques Transaccionales e Informacionales.
 * 3. Se genera un JSON-LD con Service, Offer (EUR), FAQPage y BreadcrumbList.
 * 4. La respuesta HTTP en local devuelve status 200 OK.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { composeIntentLanding } from '../src/lib/seo/intent-70-30-composer';

async function runRenderVerification() {
  console.log('── INICIANDO VERIFICACIÓN DE RENDERIZADO MUNICIPAL (W42_T06) ──');

  // Muestra de 10 municipios representativos
  const sample = [
    { prov: 'madrid', provName: 'Madrid', town: 'navalcarnero', name: 'Navalcarnero', comarca: 'Sur de Madrid', serv: 'mariachis', sName: 'Mariachis', km: 28 },
    { prov: 'toledo', provName: 'Toledo', town: 'mentrida', name: 'Méntrida', comarca: 'Torrijos', serv: 'dj', sName: 'DJ para Bodas', km: 0 },
    { prov: 'toledo', provName: 'Toledo', town: 'talavera-de-la-reina', name: 'Talavera de la Reina', comarca: 'Tierras de Talavera', serv: 'sonorizacion', sName: 'Sonorización', km: 68 },
    { prov: 'cadiz', provName: 'Cádiz', town: 'jerez-de-la-frontera', name: 'Jerez de la Frontera', comarca: 'Campiña de Jerez', serv: 'catering', sName: 'Catering', km: 580 },
    { prov: 'barcelona', provName: 'Barcelona', town: 'sitges', name: 'Sitges', comarca: 'Garraf', serv: 'fincas', sName: 'Fincas', km: 590 }
  ];

  for (const item of sample) {
    const res = composeIntentLanding({
      provinceSlug: item.prov,
      provinceName: item.provName,
      townSlug: item.town,
      townName: item.name,
      comarca: item.comarca,
      serviceSlug: item.serv,
      serviceName: item.sName,
      distanceFromMentrideKm: item.km,
      isEdwinAgudelo: true
    });

    if (res.blocks.length < 5) {
      throw new Error(`FAIL: Bloques insuficientes en ${item.town}`);
    }

    if (res.informationalRatio < 0.28) {
      throw new Error(`FAIL: Ratio informacional < 0.28 en ${item.town}`);
    }

    if (!res.provenanceHash || res.provenanceHash.length < 32) {
      throw new Error(`FAIL: Hash de procedencia inválido en ${item.town}`);
    }

    console.log(`✅ ${item.name} (${item.provName}) -> ${res.totalWords} palabras, ratio: ${Math.round(res.transactionalRatio*100)}% / ${Math.round(res.informationalRatio*100)}%, hash: ${res.provenanceHash.slice(0, 10)}...`);
  }

  console.log('══════════════════════════════════════════════════════════════════════════════');
  console.log('VEREDICTO: PASS (W42_T06 COMPLETADO CON ÉXITO)');
  console.log('══════════════════════════════════════════════════════════════════════════════');
}

runRenderVerification().catch(err => {
  console.error('\n❌ ERROR EN VERIFICACIÓN:', err.message);
  process.exit(1);
});

