<?php
/**
 * fincasparaboda.com — Edge Shell S-Class de Fincas Exclusivas
 * ─────────────────────────────────────────────────────────────────────────────
 * PHP 8.3 puro (JIT-ready). Sin frameworks, sin dependencias externas.
 * Estética OLED (#030305) · Acento Rubí (#FF2B44) · Syne / Inter / JetBrains Mono.
 *
 * Cálculo acústico 12 W/pax (Bose F1 812 / S1 Pro) y contacto directo WhatsApp.
 * ─────────────────────────────────────────────────────────────────────────────
 */

declare(strict_types=1);

// ── Catálogo de fincas exclusivas (nuggets reales S-Class) ──────────────────
$fincas = [
    [
        'name' => 'Finca El Olivar de Méntrida',
        'province' => 'Toledo',
        'capacity' => 220,
        'style' => 'Cortijo histórico · Jardines centenarios',
        'price' => 4800,
        'image' => 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200',
    ],
    [
        'name' => 'Hacienda Los Robles',
        'province' => 'Madrid',
        'capacity' => 350,
        'style' => 'Finca de lujo · Piscina y capilla',
        'price' => 7200,
        'image' => 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200',
    ],
    [
        'name' => 'Masía Can Vinyes',
        'province' => 'Barcelona',
        'capacity' => 180,
        'style' => 'Masía catalana · Viñedos propios',
        'price' => 5600,
        'image' => 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200',
    ],
    [
        'name' => 'Cortijo Sierra Nevada',
        'province' => 'Granada',
        'capacity' => 260,
        'style' => 'Cortijo andaluz · Vistas a la sierra',
        'price' => 6100,
        'image' => 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200',
    ],
];

// ── Parámetros acústicos y logísticos canónicos ─────────────────────────────
$wattsPerPax = 12;
$hubReference = 'Méntrida, Toledo';
$ratePerKm = 1.5;
$freeKmThreshold = 50;
$depositRequired = 100;
$phone = '+34693693048';
$phoneDisplay = '+34 693 693 048';

// ── Cálculo acústico dinámico ───────────────────────────────────────────────
$pax = isset($_GET['pax']) ? max(1, min(1000, (int) $_GET['pax'])) : 150;
$totalWatts = $pax * $wattsPerPax;
$systemsF1 = (int) ceil($totalWatts / 1000); // Bose F1 812 ~1000 W por unidad
$systemsS1 = (int) ceil($pax / 60);          // Bose S1 Pro ~60 pax por unidad

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$whatsappText = rawurlencode('Hola, busco finca para boda con ' . $pax . ' invitados. ¿Disponibilidad y presupuesto?');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fincas Para Boda · Selección Exclusiva S-Class</title>
<meta name="description" content="Fincas y cortijos exclusivos para bodas en España. Cálculo acústico profesional 12 W/pax, contacto directo y reserva con depósito de 100 €.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --oled:#030305; --oled-2:#050507; --ruby:#FF2B44;
    --line:rgba(255,255,255,.10); --txt:#f4f4f5; --muted:#9ca3af;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--oled);color:var(--txt);font-family:'Inter',sans-serif;font-weight:300;line-height:1.7;overflow-x:hidden}
  .wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 24px}
  h1,h2,h3{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-.02em;line-height:1.1}
  .mono{font-family:'JetBrains Mono',monospace}
  .ruby{color:var(--ruby)}
  header{padding:28px 0;border-bottom:1px solid var(--line)}
  .nav{display:flex;justify-content:space-between;align-items:center;gap:16px}
  .brand{font-family:'Syne';font-weight:800;font-size:1.15rem}
  .brand span{color:var(--ruby)}
  .nav a{color:var(--muted);text-decoration:none;font-size:.85rem;margin-left:20px}
  .nav a:hover{color:var(--ruby)}
  .hero{padding:96px 0 64px}
  .kicker{font-family:'JetBrains Mono';font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:var(--ruby);margin-bottom:20px}
  .hero h1{font-size:clamp(2.2rem,5.5vw,4rem);max-width:18ch}
  .hero p{max-width:62ch;color:var(--muted);font-size:1.05rem;margin-top:24px}
  .cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px}
  .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 28px;border-radius:2px;text-decoration:none;font-weight:500;font-size:.92rem;transition:.2s}
  .btn-ruby{background:var(--ruby);color:#fff}
  .btn-ruby:hover{filter:brightness(1.12)}
  .btn-ghost{border:1px solid var(--line);color:var(--txt)}
  .btn-ghost:hover{border-color:var(--ruby);color:var(--ruby)}
  section{padding:72px 0;border-top:1px solid var(--line)}
  .grid{display:grid;gap:28px}
  .g2{grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
  .finca{background:var(--oled-2);border:1px solid var(--line);border-radius:4px;overflow:hidden;transition:.25s}
  .finca:hover{border-color:var(--ruby)}
  .finca img{width:100%;height:220px;object-fit:cover;display:block;filter:grayscale(.2) contrast(1.05)}
  .finca-body{padding:26px}
  .finca h3{font-size:1.2rem;margin-bottom:6px}
  .finca .meta{font-family:'JetBrains Mono';font-size:.76rem;color:var(--muted);letter-spacing:.06em;margin-bottom:14px}
  .finca .price{font-family:'JetBrains Mono';font-size:1.4rem;color:var(--ruby);font-weight:600}
  .finca .price small{font-size:.72rem;color:var(--muted);font-weight:400}
  .calc{background:var(--oled-2);border:1px solid var(--line);padding:36px;border-radius:4px}
  .calc-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--line);font-size:.92rem}
  .calc-row.total{border-bottom:none;font-weight:600;font-size:1.15rem;color:var(--ruby);padding-top:18px}
  input[type=number]{background:var(--oled);border:1px solid var(--line);color:var(--txt);padding:12px;font-family:'JetBrains Mono';width:100%;border-radius:2px}
  label{display:block;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
  footer{padding:48px 0;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="brand">Fincas<span>ParaBoda</span></div>
    <nav>
      <a href="#catalogo">Catálogo</a>
      <a href="#acustica">Acústica</a>
      <a href="#contacto">Contacto</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero" style="border-top:none">
    <div class="wrap">
      <div class="kicker">Selección Exclusiva S-Class</div>
      <h1>Fincas y cortijos para bodas inolvidables</h1>
      <p>Espacios exclusivos verificados en toda España. Cálculo acústico profesional de 12 W/pax, logística desde <?= e($hubReference) ?> y reserva con depósito de <?= number_format((float) $depositRequired, 0, ',', '.') ?> €.</p>
      <div class="cta">
        <a class="btn btn-ruby" href="tel:<?= e($phone) ?>">Llamar <?= e($phoneDisplay) ?></a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp directo</a>
      </div>
    </div>
  </section>

  <section id="catalogo">
    <div class="wrap">
      <div class="kicker">Catálogo verificado</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:40px">Fincas disponibles</h2>
      <div class="grid g2">
        <?php foreach ($fincas as $f): ?>
        <article class="finca">
          <img src="<?= e($f['image']) ?>" alt="<?= e($f['name']) ?>" loading="lazy">
          <div class="finca-body">
            <h3><?= e($f['name']) ?></h3>
            <div class="meta"><?= e($f['province']) ?> · <?= (int) $f['capacity'] ?> pax · <?= e($f['style']) ?></div>
            <div class="price"><?= number_format((float) $f['price'], 0, ',', '.') ?> € <small>/ evento</small></div>
            <div class="cta" style="margin-top:20px">
              <a class="btn btn-ruby" style="padding:11px 20px;font-size:.85rem" href="https://wa.me/<?= e($phone) ?>?text=<?= rawurlencode('Hola, me interesa ' . $f['name'] . ' para mi boda.') ?>" target="_blank" rel="noopener">Consultar</a>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section id="acustica">
    <div class="wrap">
      <div class="kicker">Ingeniería acústica</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:16px">Cálculo de potencia 12 W/pax</h2>
      <p style="color:var(--muted);max-width:70ch;margin-bottom:40px">
        Dimensionamos el sistema de sonido profesional (Bose F1 812 / S1 Pro) en función del número de invitados para garantizar cobertura uniforme sin saturación.
      </p>
      <div class="grid g2">
        <div class="calc">
          <h3 style="margin-bottom:24px">Calculadora acústica</h3>
          <form method="get" action="#acustica">
            <label for="pax">Nº de invitados</label>
            <input type="number" id="pax" name="pax" min="1" max="1000" value="<?= (int) $pax ?>">
            <button type="submit" class="btn btn-ruby" style="margin-top:22px;width:100%;justify-content:center;border:none;cursor:pointer">Calcular sistema</button>
          </form>
        </div>
        <div class="calc">
          <h3 style="margin-bottom:24px">Sistema recomendado</h3>
          <div class="calc-row"><span>Potencia total requerida</span><span class="mono"><?= (int) $totalWatts ?> W</span></div>
          <div class="calc-row"><span>Bose F1 812 (subwoofer + array)</span><span class="mono"><?= (int) $systemsF1 ?> ud.</span></div>
          <div class="calc-row"><span>Bose S1 Pro (refuerzo)</span><span class="mono"><?= (int) $systemsS1 ?> ud.</span></div>
          <div class="calc-row"><span>Microfonía</span><span class="mono">Shure Beta 87A</span></div>
          <div class="calc-row total"><span>Ratio aplicado</span><span class="mono"><?= (int) $wattsPerPax ?> W/pax</span></div>
          <p style="color:var(--muted);font-size:.8rem;margin-top:18px">
            Logística desde <?= e($hubReference) ?>: <?= number_format((float) $ratePerKm, 2, ',', '.') ?> €/km a partir del km <?= (int) $freeKmThreshold ?>.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="contacto">
    <div class="wrap">
      <div class="kicker">Contacto directo</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:24px">Reserve su finca hoy</h2>
      <p style="color:var(--muted);max-width:60ch;margin-bottom:32px">
        Confirmación de disponibilidad en menos de 24 h. Depósito de reserva de <?= number_format((float) $depositRequired, 0, ',', '.') ?> € con Price-Lock SHA-256.
      </p>
      <div class="cta">
        <a class="btn btn-ruby" href="tel:<?= e($phone) ?>">Llamar ahora</a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p class="mono">FincasParaBoda · Selección Exclusiva S-Class · Productora EAR</p>
    <p style="margin-top:8px">Hub logístico <?= e($hubReference) ?> · <?= number_format((float) $ratePerKm, 2, ',', '.') ?> €/km > <?= (int) $freeKmThreshold ?> km · Rider <?= (int) $wattsPerPax ?> W/pax</p>
  </div>
</footer>
</body>
</html>
