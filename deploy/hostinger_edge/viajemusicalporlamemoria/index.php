<?php
/**
 * viajemusicalporlamemoria.com — Edge Shell Institucional S-Class
 * ─────────────────────────────────────────────────────────────────────────────
 * PHP 8.3 puro (JIT-ready). Sin frameworks, sin dependencias externas.
 * Estética OLED (#030305) · Acento Oro (#ecb613) · Syne / Inter / JetBrains Mono.
 *
 * Alimentado por los datos vampirizados reales de:
 *   src/data/vimume_vampirized_hostinger.json
 *
 * Marco B2G: LCSP Art. 118 (< 15.000 € / ajuste preventivo 14.250 €), < 75 dB SPL.
 * ─────────────────────────────────────────────────────────────────────────────
 */

declare(strict_types=1);

// ── Carga de datos vampirizados (SSOT) ──────────────────────────────────────
$dataPath = __DIR__ . '/../../../src/data/vimume_vampirized_hostinger.json';
$fallback = [
    'project' => 'VIMUME',
    'domain' => 'viajemusicalporlamemoria.com',
    'scientific_basis' => '40Hz Neuroacoustic',
    'value_proposition' => 'Programa de musicoterapia en vivo y estimulación neuroacústica a 40 Hz para residencias geriátricas, centros de día y festejos municipales.',
    'testimonials' => [],
    'repertoire' => [],
    'b2g_framework' => [
        'law' => 'LCSP Art. 118',
        'ceiling' => 15000,
        'preventiveCeiling' => 14250,
        'splLimit' => 75,
        'acousticRider' => '12 W/pax',
        'certifiedSystems' => ['Bose F1 812', 'Bose S1 Pro'],
        'microphones' => ['Shure Beta 87A Inalámbrico'],
    ],
    'media_gallery' => [],
    'sovereign_split' => ['artist' => 80, 'earOs' => 10, 'vimume' => 10],
    'deposit_required' => 100,
    'price_lock_hours' => 72,
    'logistics' => [
        'hubReference' => 'Méntrida, Toledo',
        'ratePerKm' => 1.5,
        'freeKmThreshold' => 50,
        'hotelSupplementHoursLimit' => '03:00 AM',
        'hotelSupplementCost' => 120,
    ],
    'flagship_artist' => [
        'name' => 'Edwin Agudelo',
        'slug' => 'edwin-agudelo',
        'basePrice' => 350,
        'rating' => 5,
        'reviewCount' => 128,
        'phone' => '+34 693 693 048',
        'description' => 'Show musical en directo de 1 hora (2 pases de 30 min), sonido profesional Bose F1 812 / S1 Pro, microfonía Shure Beta 87A.',
    ],
];

$data = $fallback;
if (is_file($dataPath)) {
    $raw = file_get_contents($dataPath);
    if ($raw !== false) {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $data = array_replace_recursive($fallback, $decoded);
        }
    }
}

// ── Helpers de presentación ─────────────────────────────────────────────────
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$b2g = $data['b2g_framework'];
$flagship = $data['flagship_artist'];
$logistics = $data['logistics'];
$split = $data['sovereign_split'];

// ── Calculadora de plazas geriátricas (12 W/pax) ────────────────────────────
$pax = isset($_GET['pax']) ? max(1, min(500, (int) $_GET['pax'])) : 80;
$wattsPerPax = 12;
$totalWatts = $pax * $wattsPerPax;
$sessions = (int) ceil($pax / 40); // 1 sesión por cada 40 residentes
$estimatedHours = $sessions * 1.0;

// ── Presupuesto B2G preventivo (Art. 118 LCSP) ──────────────────────────────
$baseArtist = (float) $flagship['basePrice'];
$logisticsCost = 0.0;
$distanceKm = isset($_GET['km']) ? max(0, (int) $_GET['km']) : 0;
if ($distanceKm > $logistics['freeKmThreshold']) {
    $logisticsCost = ($distanceKm - $logistics['freeKmThreshold']) * (float) $logistics['ratePerKm'];
}
$subtotal = $baseArtist + $logisticsCost;
$iva = round($subtotal * 0.21, 2);
$total = round($subtotal + $iva, 2);
$preventiveCeiling = (float) $b2g['preventiveCeiling'];
$withinLcsp = $total <= $preventiveCeiling;

$phone = preg_replace('/\s+/', '', (string) $flagship['phone']);
$whatsappText = rawurlencode('Hola, solicito propuesta VIMUME (musicoterapia geriátrica) para ' . $pax . ' plazas.');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VIMUME · Viaje Musical Por La Memoria — Musicoterapia Geriátrica B2G</title>
<meta name="description" content="Programa de musicoterapia en vivo y estimulación neuroacústica 40 Hz para residencias geriátricas y festejos municipales. Contratación menor LCSP Art. 118.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --oled:#030305; --oled-2:#050507; --gold:#ecb613;
    --line:rgba(255,255,255,.10); --txt:#f4f4f5; --muted:#9ca3af;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--oled);color:var(--txt);font-family:'Inter',sans-serif;font-weight:300;line-height:1.7;overflow-x:hidden}
  .wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 24px}
  h1,h2,h3{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-.02em;line-height:1.1}
  .mono{font-family:'JetBrains Mono',monospace}
  .gold{color:var(--gold)}
  header{padding:28px 0;border-bottom:1px solid var(--line)}
  .nav{display:flex;justify-content:space-between;align-items:center;gap:16px}
  .brand{font-family:'Syne';font-weight:800;font-size:1.15rem;letter-spacing:.02em}
  .brand span{color:var(--gold)}
  .nav a{color:var(--muted);text-decoration:none;font-size:.85rem;margin-left:20px}
  .nav a:hover{color:var(--gold)}
  .hero{padding:96px 0 64px}
  .kicker{font-family:'JetBrains Mono';font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:var(--gold);margin-bottom:20px}
  .hero h1{font-size:clamp(2.2rem,5.5vw,4rem);max-width:16ch}
  .hero p{max-width:62ch;color:var(--muted);font-size:1.05rem;margin-top:24px}
  .cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px}
  .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 28px;border-radius:2px;text-decoration:none;font-weight:500;font-size:.92rem;transition:.2s}
  .btn-gold{background:var(--gold);color:#0a0a0a}
  .btn-gold:hover{filter:brightness(1.12)}
  .btn-ghost{border:1px solid var(--line);color:var(--txt)}
  .btn-ghost:hover{border-color:var(--gold);color:var(--gold)}
  section{padding:72px 0;border-top:1px solid var(--line)}
  .grid{display:grid;gap:32px}
  .g3{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
  .g2{grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
  .card{background:var(--oled-2);border:1px solid var(--line);padding:32px;border-radius:4px}
  .card h3{font-size:1.15rem;margin-bottom:12px}
  .card p{color:var(--muted);font-size:.92rem}
  .stat{font-family:'JetBrains Mono';font-size:2.4rem;font-weight:600;color:var(--gold)}
  .stat-label{font-size:.78rem;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:6px}
  .quote{border-left:2px solid var(--gold);padding-left:24px;margin:20px 0}
  .quote p{font-size:1.02rem;color:var(--txt);font-style:italic}
  .quote cite{display:block;margin-top:10px;font-size:.8rem;color:var(--muted);font-style:normal}
  .calc{background:var(--oled-2);border:1px solid var(--line);padding:36px;border-radius:4px}
  .calc-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--line);font-size:.92rem}
  .calc-row.total{border-bottom:none;font-weight:600;font-size:1.15rem;color:var(--gold);padding-top:18px}
  .badge{display:inline-block;font-family:'JetBrains Mono';font-size:.7rem;letter-spacing:.1em;padding:5px 12px;border:1px solid var(--gold);color:var(--gold);border-radius:2px;text-transform:uppercase}
  .badge-ok{border-color:#22c55e;color:#22c55e}
  .badge-warn{border-color:#ef4444;color:#ef4444}
  input[type=number]{background:var(--oled);border:1px solid var(--line);color:var(--txt);padding:12px;font-family:'JetBrains Mono';width:100%;border-radius:2px}
  label{display:block;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  footer{padding:48px 0;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}
  .repertoire li{list-style:none;padding:14px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;gap:16px}
  .repertoire li span:first-child{color:var(--txt)}
  .repertoire li span:last-child{font-family:'JetBrains Mono';font-size:.78rem;color:var(--muted)}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="brand">VIMUME<span>.</span></div>
    <nav>
      <a href="#programa">Programa</a>
      <a href="#repertorio">Repertorio</a>
      <a href="#b2g">B2G</a>
      <a href="#contacto">Contacto</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero" style="border-top:none">
    <div class="wrap">
      <div class="kicker">Musicoterapia Neuroacústica · <?= e($data['scientific_basis']) ?></div>
      <h1>Viaje Musical Por La Memoria</h1>
      <p><?= e($data['value_proposition']) ?></p>
      <div class="cta">
        <a class="btn btn-gold" href="tel:<?= e($phone) ?>">Llamar <?= e($flagship['phone']) ?></a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp directo</a>
      </div>
    </div>
  </section>

  <section id="programa">
    <div class="wrap">
      <div class="kicker">Impacto medible</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:40px">Estimulación cognitiva en vivo</h2>
      <div class="grid g3">
        <div class="card">
          <div class="stat">40 Hz</div>
          <div class="stat-label">Frecuencia neuroacústica</div>
          <p style="margin-top:16px">Estimulación sensorial calibrada para activar la memoria episódica y reducir la agitación en pacientes con deterioro cognitivo leve.</p>
        </div>
        <div class="card">
          <div class="stat"><?= e($b2g['acousticRider']) ?></div>
          <div class="stat-label">Rider acústico certificado</div>
          <p style="margin-top:16px"><?= e(implode(' · ', $b2g['certifiedSystems'])) ?> con microfonía <?= e(implode(', ', $b2g['microphones'])) ?>.</p>
        </div>
        <div class="card">
          <div class="stat">< <?= (int) $b2g['splLimit'] ?> dB</div>
          <div class="stat-label">Límite SPL</div>
          <p style="margin-top:16px">Cumplimiento estricto del límite de presión sonora para entornos residenciales y sanitarios sensibles.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="repertorio">
    <div class="wrap">
      <div class="kicker">Memoria musical</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:32px">Repertorio de la memoria</h2>
      <ul class="repertoire">
        <?php foreach ($data['repertoire'] as $item): ?>
        <li>
          <span><?= e((string) $item['title']) ?></span>
          <span><?= e((string) $item['era']) ?> · <?= e((string) $item['format']) ?></span>
        </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <?php if (!empty($data['testimonials'])): ?>
  <section>
    <div class="wrap">
      <div class="kicker">Testimonios verificados</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:32px">Lo que dicen las residencias</h2>
      <div class="grid g2">
        <?php foreach (array_slice($data['testimonials'], 0, 4) as $t): ?>
        <div class="quote">
          <p>“<?= e((string) $t['quote']) ?>”</p>
          <cite>— <?= e((string) $t['source']) ?><?= !empty($t['verified']) ? ' · Verificado S-Class' : '' ?></cite>
        </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>
  <?php endif; ?>

  <section id="b2g">
    <div class="wrap">
      <div class="kicker">Contratación pública</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:16px">Justificación técnica municipal</h2>
      <p style="color:var(--muted);max-width:70ch;margin-bottom:40px">
        Contrato menor conforme al <strong class="gold"><?= e($b2g['law']) ?></strong>.
        Techo legal <?= number_format((float) $b2g['ceiling'], 0, ',', '.') ?> € ·
        Ajuste preventivo <?= number_format($preventiveCeiling, 0, ',', '.') ?> € ·
        Límite acústico < <?= (int) $b2g['splLimit'] ?> dB SPL.
      </p>

      <div class="grid g2">
        <div class="calc">
          <h3 style="margin-bottom:24px">Calculadora de plazas geriátricas</h3>
          <form method="get" action="#b2g">
            <label for="pax">Nº de residentes / plazas</label>
            <input type="number" id="pax" name="pax" min="1" max="500" value="<?= (int) $pax ?>">
            <label for="km" style="margin-top:18px">Distancia desde Méntrida (km)</label>
            <input type="number" id="km" name="km" min="0" max="1200" value="<?= (int) $distanceKm ?>">
            <button type="submit" class="btn btn-gold" style="margin-top:22px;width:100%;justify-content:center;border:none;cursor:pointer">Recalcular propuesta</button>
          </form>
        </div>

        <div class="calc">
          <h3 style="margin-bottom:24px">Propuesta económica</h3>
          <div class="calc-row"><span>Potencia acústica requerida</span><span class="mono"><?= (int) $totalWatts ?> W (<?= (int) $pax ?> × <?= (int) $wattsPerPax ?> W)</span></div>
          <div class="calc-row"><span>Sesiones programadas</span><span class="mono"><?= (int) $sessions ?> × 60 min</span></div>
          <div class="calc-row"><span>Tarifa base artista</span><span class="mono"><?= number_format($baseArtist, 2, ',', '.') ?> €</span></div>
          <div class="calc-row"><span>Logística (<?= (int) $distanceKm ?> km · <?= number_format((float) $logistics['ratePerKm'], 2, ',', '.') ?> €/km > <?= (int) $logistics['freeKmThreshold'] ?> km)</span><span class="mono"><?= number_format($logisticsCost, 2, ',', '.') ?> €</span></div>
          <div class="calc-row"><span>Subtotal</span><span class="mono"><?= number_format($subtotal, 2, ',', '.') ?> €</span></div>
          <div class="calc-row"><span>IVA 21%</span><span class="mono"><?= number_format($iva, 2, ',', '.') ?> €</span></div>
          <div class="calc-row total"><span>Total</span><span class="mono"><?= number_format($total, 2, ',', '.') ?> €</span></div>
          <div style="margin-top:20px">
            <?php if ($withinLcsp): ?>
              <span class="badge badge-ok">✓ Dentro del techo LCSP Art. 118</span>
            <?php else: ?>
              <span class="badge badge-warn">⚠ Excede <?= number_format($preventiveCeiling, 0, ',', '.') ?> € — bifurcar lote</span>
            <?php endif; ?>
          </div>
          <p style="color:var(--muted);font-size:.8rem;margin-top:18px">
            Depósito de reserva <?= number_format((float) $data['deposit_required'], 0, ',', '.') ?> € ·
            Price-Lock SHA-256 válido <?= (int) $data['price_lock_hours'] ?> h ·
            Split <?= (int) $split['artist'] ?>/<?= (int) $split['earOs'] ?>/<?= (int) $split['vimume'] ?>.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="contacto">
    <div class="wrap">
      <div class="kicker">Contacto directo</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:24px">Solicite propuesta para su municipio</h2>
      <p style="color:var(--muted);max-width:60ch;margin-bottom:32px">
        Atención directa a concejalías de servicios sociales, cultura y festejos. Respuesta técnica en menos de 24 h.
      </p>
      <div class="cta">
        <a class="btn btn-gold" href="tel:<?= e($phone) ?>">Llamar ahora</a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p class="mono">VIMUME · <?= e($data['domain']) ?> · <?= e($data['scientific_basis']) ?></p>
    <p style="margin-top:8px">Productora EAR S-Class · Hub logístico <?= e($logistics['hubReference']) ?> · <?= number_format((float) $logistics['ratePerKm'], 2, ',', '.') ?> €/km > <?= (int) $logistics['freeKmThreshold'] ?> km</p>
  </div>
</footer>
</body>
</html>
