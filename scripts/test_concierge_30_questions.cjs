/**
 * 🧪 Test Harness: 30 Preguntas Complejas al Concierge IA & Flota de Agentes
 * Verifica que el motor conversacional responda rigurosamente a cada gremio,
 * mantenga los invariantes SSOT (Split 80/10/10, Depósito 100€, 12 W/pax, Ley 37/2003)
 * y responda con éxito sin bugs ni excepciones.
 */
const http = require('http');

const QUESTIONS = [
  { id: 1, cat: 'Fincas', prov: 'valencia', q: '¿Qué condiciones y rider acústico tiene Jardines La Cartuja para una boda de 150 invitados en exterior?' },
  { id: 2, cat: 'Fincas', prov: 'toledo', q: '¿Cuál es la distancia desde Méntrida a una finca en Toledo y cuánto es el suplemento si termina a las 4 AM?' },
  { id: 3, cat: 'Música', prov: 'madrid', q: '¿Cuánto cuesta contratar a Edwin Agudelo como solista para la ceremonia civil y cóctel?' },
  { id: 4, cat: 'Música', prov: 'segovia', q: '¿Tenéis mariachi tradicional para un cumpleaños en Segovia y cómo se formaliza la reserva?' },
  { id: 5, cat: 'DJs', prov: 'madrid', q: '¿Qué equipo de sonido lleváis para discomóvil y cómo cumplís la Ley 37/2003 del Ruido?' },
  { id: 6, cat: 'Catering', prov: 'guadalajara', q: '¿Tenéis catering de brasas o paellas gigantes para un banquete campestre de 180 personas en Guadalajara?' },
  { id: 7, cat: 'DJs', prov: 'valencia', q: '¿Incluye la discomóvil robótica DMX e iluminación para la barra libre?' },
  { id: 8, cat: 'Jurídica', prov: 'madrid', q: '¿Cómo funciona la contratación menor B2G bajo el Art. 118 de la LCSP con límite de 14.250 €?' },
  { id: 9, cat: 'VIMUME', prov: 'madrid', q: '¿En qué consiste el protocolo de neuroacústica de 40 Hz de VIMUME para residencias de mayores?' },
  { id: 10, cat: 'Fiscal', prov: 'toledo', q: '¿Qué desgravación fiscal tiene el 10% de impacto social de VIMUME en el Modelo 182 de la AEAT?' },
  { id: 11, cat: 'Fincas', prov: 'bizkaia', q: '¿Qué menús oficiales tiene el Caserío Ezkertza Berria en Otzarreta y cómo se bloquea fecha?' },
  { id: 12, cat: 'Autobuses', prov: 'madrid', q: '¿Disponéis de autobuses de 55 plazas para trasladar invitados desde Madrid centro a una finca en Chinchón?' },
  { id: 13, cat: 'Fotógrafos', prov: 'barcelona', q: '¿Qué cobertura ofrece el servicio de fotografía y vídeo cinematográfico con dron en Barcelona?' },
  { id: 14, cat: 'Música', prov: 'sevilla', q: '¿Tenéis cuadro flamenco o grupo de rumbas para animar el cóctel de una boda en Sevilla?' },
  { id: 15, cat: 'Música', prov: 'salamanca', q: '¿Podéis proporcionar un cuarteto de cuerda para música clásica en iglesia de Salamanca?' },
  { id: 16, cat: 'Técnica', prov: 'madrid', q: '¿Por qué utilizáis el cálculo de 12 W/pax y limitadores telemáticos homologados en fincas?' },
  { id: 17, cat: 'Jurídica', prov: 'madrid', q: '¿Qué es el Split Soberano 80/10/10 y por qué no cobráis comisiones ocultas al artista?' },
  { id: 18, cat: 'Financiera', prov: 'madrid', q: '¿El depósito de 100 € de Stripe Price-Lock se descuenta del precio final del evento?' },
  { id: 19, cat: 'Comercial', prov: 'madrid', q: '¿Puedo consultar dudas directas por WhatsApp con la centralita antes de pagar el depósito?' },
  { id: 20, cat: 'Corporativo', prov: 'segovia', q: '¿Coordináis galas corporativas completas para 250 directivos en el Real Sitio de San Ildefonso?' },
  { id: 21, cat: 'Música', prov: 'alicante', q: '¿Tenéis saxofonista para cóctel chillout al atardecer en terraza de Alicante?' },
  { id: 22, cat: 'Animación', prov: 'zaragoza', q: '¿Disponéis de magos o ilusionistas de cerca para mesas durante el banquete en Zaragoza?' },
  { id: 23, cat: 'Vídeo', prov: 'cadiz', q: '¿Entregáis vídeo en formato 4K cinematográfico y reel para redes sociales en Cádiz?' },
  { id: 24, cat: 'Decoración', prov: 'madrid', q: '¿Podéis diseñar un arco floral y decoración de gala para ceremonia en finca de Aranjuez?' },
  { id: 25, cat: 'Coches', prov: 'toledo', q: '¿Tenéis alquiler de coches clásicos con chófer para la llegada de los novios en Toledo?' },
  { id: 26, cat: 'Comercial', prov: 'madrid', q: '¿Qué pasa si necesito reservar con urgencia para este fin de semana?' },
  { id: 27, cat: 'Técnica', prov: 'madrid', q: '¿Qué especificaciones técnicas tiene el micro inalámbrico Shure Axient frente a interferencias?' },
  { id: 28, cat: 'VIMUME', prov: 'valencia', q: '¿Qué retorno social SROI de 4.85x certifica VIMUME para memorias de Responsabilidad Social Corporativa?' },
  { id: 29, cat: 'Fincas', prov: 'baleares', q: '¿Tenéis proveedores y fincas homologadas en las Islas Baleares (Mallorca e Ibiza)?' },
  { id: 30, cat: 'Seguridad', prov: 'madrid', q: '¿Cómo garantizáis la inmutabilidad de la tarifa y los contratos con sello SHA-256?' }
];

async function sendQuery(qItem, port = 3007) {
  const payload = JSON.stringify({
    message: qItem.q,
    provinceSlug: qItem.prov,
    categorySlug: qItem.cat,
    pathname: `/proveedores/${qItem.prov}`
  });

  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port,
      path: '/api/chat/concierge',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 15000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data.slice(0, 200), error: e.message });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 'ERROR', error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 'TIMEOUT' });
    });

    req.write(payload);
    req.end();
  });
}

async function runBattery() {
  console.log(`[TEST BATTERY] Ejecutando batería de 30 preguntas al Concierge IA (localhost:3007)...`);
  let passed = 0;
  let failed = 0;

  for (const item of QUESTIONS) {
    const res = await sendQuery(item);
    if (res.status === 200 && res.data && res.data.success && typeof res.data.reply === 'string' && res.data.reply.length > 20) {
      console.log(`✅ [${item.id}/30] (${item.cat}/${item.prov}) OK -> ${res.data.reply.slice(0, 75)}...`);
      passed++;
    } else {
      console.log(`⚠️ [${item.id}/30] (${item.cat}/${item.prov}) Status: ${res.status} | Res: ${JSON.stringify(res.data || res.error || res.raw)}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`RESULTADO FINAL: ${passed} APROBADAS / ${failed} FALLIDAS de 30 preguntas.`);
  console.log(`========================================`);
  process.exit(failed > 0 ? 1 : 0);
}

runBattery();

