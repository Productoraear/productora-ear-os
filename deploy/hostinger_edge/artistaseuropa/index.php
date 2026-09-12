<?php
/**
 * artistaseuropa.com — Edge Shell S-Class de Roster de Artistas
 * ─────────────────────────────────────────────────────────────────────────────
 * PHP 8.3 puro (JIT-ready). Sin frameworks, sin dependencias externas.
 * Estética OLED (#030305) · Acento Cyan (#00E5FF) · Syne / Inter / JetBrains Mono.
 *
 * Roster soberano con Edwin Agudelo #1 (350,00 €) y Split 80/10/10.
 * Selector interactivo de artistas y contacto directo WhatsApp.
 * ─────────────────────────────────────────────────────────────────────────────
 */

declare(strict_types=1);

// ── Roster soberano S-Class (nuggets reales) ────────────────────────────────
$artists = [
    [
        'rank' => 1,
        'name' => 'Edwin Agudelo',
        'role' => 'Solista · Voz y guitarra',
        'basePrice' => 350.00,
        'rating' => 5.0,
        'reviews' => 128,
        'genres' => ['Bolero', 'Balada', 'Nostalgia'],
        'signature' => 'Viaje Musical por la Memoria',
        'image' => 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    ],
    [
        'rank' => 2,
        'name' => 'Trío Aurora',
        'role' => 'Trío acústico · Cuerdas',
        'basePrice' => 620.00,
        'rating' => 4.9,
        'reviews' => 74,
        'genres' => ['Clásico', 'Jazz', 'Bossa'],
        'signature' => 'Ceremonias y cócteles',
        'image' => 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200',
    ],
    [
        'rank' => 3,
        'name' => 'Dúo Luna',
        'role' => 'Dúo · Voz y piano',
        'basePrice' => 480.00,
        'rating' => 4.8,
        'reviews' => 61,
        'genres' => ['Pop', 'Balada', 'Soul'],
        'signature' => 'Primer baile y cena',
        'image' => 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?q=80&w=1200',
    ],
    [
        'rank' => 4,
        'name' => 'Cuarteto Ébano',
        'role' => 'Cuarteto · Cuerda frotada',
        'basePrice' => 890.00,
        'rating' => 4.9,
        'reviews' => 43,
        'genres' => ['Clásico', 'Cine', 'Contemporáneo'],
        'signature' => 'Ceremonias de gala',
        'image' => 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200',
    ],
];

// ── Parámetros canónicos S-Class ────────────────────────────────────────────
$splitArtist = 80;
$splitEarOs = 10;
$splitVimume = 10;
$depositRequired = 100;
$hubReference = 'Méntrida, Toledo';
$ratePerKm = 1.5;
$freeKmThreshold = 50;
$phone = '+34693693048';
$phoneDisplay = '+34 693 693 048';

// ── Selector interactivo (artista activo) ───────────────────────────────────
$selectedRank = isset($_GET['artista']) ? (int) $_GET['artista'] : 1;
$selected = $artists[0];
foreach ($artists as $a) {
    if ((int) $a['rank'] === $selectedRank) {
        $selected = $a;
    }
}

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$whatsappText = rawurlencode('Hola, quiero reservar a ' . $selected['name'] . ' (' . number_format((float) $selected['basePrice'], 2, ',', '.') . ' €). ¿Disponibilidad?');
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Artistas Europa · Roster Soberano S-Class</title>
<meta name="description" content="Roster de artistas exclusivos para eventos en Europa. Edwin Agudelo desde 350,00 €. Split soberano 80/10/10 y reserva con depósito de 100 €.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --oled:#030305; --oled-2:#050507; --cyan:#00E5FF;
    --line:rgba(255,255,255,.10); --txt:#f4f4f5; --muted:#9ca3af;
  }
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:var(--oled);color:var(--txt);font-family:'Inter',sans-serif;font-weight:300;line-height:1.7;overflow-x:hidden}
  .wrap{width:100%;max-width:1180px;margin:0 auto;padding:0 24px}
  h1,h2,h3{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-.02em;line-height:1.1}
  .mono{font-family:'JetBrains Mono',monospace}
  .cyan{color:var(--cyan)}
  header{padding:28px 0;border-bottom:1px solid var(--line)}
  .nav{display:flex;justify-content:space-between;align-items:center;gap:16px}
  .brand{font-family:'Syne';font-weight:800;font-size:1.15rem}
  .brand span{color:var(--cyan)}
  .nav a{color:var(--muted);text-decoration:none;font-size:.85rem;margin-left:20px}
  .nav a:hover{color:var(--cyan)}
  .hero{padding:96px 0 64px}
  .kicker{font-family:'JetBrains Mono';font-size:.72rem;letter-spacing:.28em;text-transform:uppercase;color:var(--cyan);margin-bottom:20px}
  .hero h1{font-size:clamp(2.2rem,5.5vw,4rem);max-width:18ch}
  .hero p{max-width:62ch;color:var(--muted);font-size:1.05rem;margin-top:24px}
  .cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px}
  .btn{display:inline-flex;align-items:center;gap:10px;padding:15px 28px;border-radius:2px;text-decoration:none;font-weight:500;font-size:.92rem;transition:.2s}
  .btn-cyan{background:var(--cyan);color:#030305}
  .btn-cyan:hover{filter:brightness(1.12)}
  .btn-ghost{border:1px solid var(--line);color:var(--txt)}
  .btn-ghost:hover{border-color:var(--cyan);color:var(--cyan)}
  section{padding:72px 0;border-top:1px solid var(--line)}
  .grid{display:grid;gap:28px}
  .g2{grid-template-columns:repeat(auto-fit,minmax(320px,1fr))}
  .artist{background:var(--oled-2);border:1px solid var(--line);border-radius:4px;overflow:hidden;transition:.25s;position:relative}
  .artist:hover{border-color:var(--cyan)}
  .artist.active{border-color:var(--cyan);box-shadow:0 0 0 1px var(--cyan)}
  .artist img{width:100%;height:240px;object-fit:cover;display:block;filter:grayscale(.2) contrast(1.05)}
  .artist-body{padding:26px}
  .rank{position:absolute;top:16px;left:16px;background:var(--cyan);color:#030305;font-family:'JetBrains Mono';font-weight:600;font-size:.78rem;padding:5px 12px;border-radius:2px}
  .artist h3{font-size:1.25rem;margin-bottom:6px}
  .artist .role{font-family:'JetBrains Mono';font-size:.76rem;color:var(--muted);letter-spacing:.06em;margin-bottom:14px}
  .artist .price{font-family:'JetBrains Mono';font-size:1.5rem;color:var(--cyan);font-weight:600}
  .artist .price small{font-size:.72rem;color:var(--muted);font-weight:400}
  .tags{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
  .tag{font-family:'JetBrains Mono';font-size:.7rem;border:1px solid var(--line);padding:4px 10px;border-radius:2px;color:var(--muted)}
  .split{background:var(--oled-2);border:1px solid var(--line);padding:36px;border-radius:4px}
  .split-row{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--line);font-size:.92rem}
  .split-row.total{border-bottom:none;font-weight:600;font-size:1.15rem;color:var(--cyan);padding-top:18px}
  .bar{height:8px;border-radius:2px;background:var(--line);overflow:hidden;display:flex;margin:20px 0}
  .bar i{display:block;height:100%}
  .bar .b-artist{background:var(--cyan)}
  .bar .b-ear{background:rgba(0,229,255,.55)}
  .bar .b-vim{background:rgba(0,229,255,.28)}
  footer{padding:48px 0;border-top:1px solid var(--line);color:var(--muted);font-size:.82rem}
</style>
</head>
<body>
<header>
  <div class="wrap nav">
    <div class="brand">Artistas<span>Europa</span></div>
    <nav>
      <a href="#roster">Roster</a>
      <a href="#split">Split</a>
      <a href="#contacto">Contacto</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero" style="border-top:none">
    <div class="wrap">
      <div class="kicker">Roster Soberano S-Class</div>
      <h1>Artistas exclusivos para eventos en Europa</h1>
      <p>Representación directa con Split Soberano <?= (int) $splitArtist ?>/<?= (int) $splitEarOs ?>/<?= (int) $splitVimume ?>. Edwin Agudelo desde <?= number_format(350.00, 2, ',', '.') ?> €. Reserva con depósito de <?= number_format((float) $depositRequired, 0, ',', '.') ?> €.</p>
      <div class="cta">
        <a class="btn btn-cyan" href="tel:<?= e($phone) ?>">Llamar <?= e($phoneDisplay) ?></a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp directo</a>
      </div>
    </div>
  </section>

  <section id="roster">
    <div class="wrap">
      <div class="kicker">Roster verificado</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:40px">Artistas disponibles</h2>
      <div class="grid g2">
        <?php foreach ($artists as $a): ?>
        <article class="artist<?= ((int) $a['rank'] === (int) $selected['rank']) ? ' active' : '' ?>">
          <span class="rank">#<?= (int) $a['rank'] ?></span>
          <img src="<?= e($a['image']) ?>" alt="<?= e($a['name']) ?>" loading="lazy">
          <div class="artist-body">
            <h3><?= e($a['name']) ?></h3>
            <div class="role"><?= e($a['role']) ?> · ★ <?= number_format((float) $a['rating'], 1, ',', '.') ?> (<?= (int) $a['reviews'] ?> reseñas)</div>
            <div class="price"><?= number_format((float) $a['basePrice'], 2, ',', '.') ?> € <small>/ actuación base</small></div>
            <div class="tags">
              <?php foreach ($a['genres'] as $g): ?>
              <span class="tag"><?= e($g) ?></span>
              <?php endforeach; ?>
            </div>
            <div class="cta" style="margin-top:8px">
              <a class="btn btn-cyan" style="padding:11px 20px;font-size:.85rem" href="?artista=<?= (int) $a['rank'] ?>#roster">Seleccionar</a>
              <a class="btn btn-ghost" style="padding:11px 20px;font-size:.85rem" href="https://wa.me/<?= e($phone) ?>?text=<?= rawurlencode('Hola, me interesa ' . $a['name'] . ' para mi evento.') ?>" target="_blank" rel="noopener">Consultar</a>
            </div>
          </div>
        </article>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section id="split">
    <div class="wrap">
      <div class="kicker">Transparencia económica</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:16px">Split Soberano <?= (int) $splitArtist ?>/<?= (int) $splitEarOs ?>/<?= (int) $splitVimume ?></h2>
      <p style="color:var(--muted);max-width:70ch;margin-bottom:40px">
        Reparto transparente sobre la actuación seleccionada: <strong class="cyan"><?= e($selected['name']) ?></strong> — <?= number_format((float) $selected['basePrice'], 2, ',', '.') ?> €.
      </p>
      <div class="grid g2">
        <div class="split">
          <h3 style="margin-bottom:24px">Desglose de la actuación</h3>
          <div class="split-row"><span>Artista (<?= (int) $splitArtist ?>%)</span><span class="mono"><?= number_format((float) $selected['basePrice'] * $splitArtist / 100, 2, ',', '.') ?> €</span></div>
          <div class="split-row"><span>EAR OS (<?= (int) $splitEarOs ?>%)</span><span class="mono"><?= number_format((float) $selected['basePrice'] * $splitEarOs / 100, 2, ',', '.') ?> €</span></div>
          <div class="split-row"><span>VIMUME (<?= (int) $splitVimume ?>%)</span><span class="mono"><?= number_format((float) $selected['basePrice'] * $splitVimume / 100, 2, ',', '.') ?> €</span></div>
          <div class="split-row total"><span>Total actuación</span><span class="mono"><?= number_format((float) $selected['basePrice'], 2, ',', '.') ?> €</span></div>
        </div>
        <div class="split">
          <h3 style="margin-bottom:24px">Distribución</h3>
          <div class="bar">
            <i class="b-artist" style="width:<?= (int) $splitArtist ?>%"></i>
            <i class="b-ear" style="width:<?= (int) $splitEarOs ?>%"></i>
            <i class="b-vim" style="width:<?= (int) $splitVimume ?>%"></i>
          </div>
          <div class="split-row"><span>Depósito de reserva</span><span class="mono"><?= number_format((float) $depositRequired, 0, ',', '.') ?> €</span></div>
          <div class="split-row"><span>Logística</span><span class="mono"><?= number_format((float) $ratePerKm, 2, ',', '.') ?> €/km > <?= (int) $freeKmThreshold ?> km</span></div>
          <div class="split-row"><span>Hub</span><span class="mono"><?= e($hubReference) ?></span></div>
          <p style="color:var(--muted);font-size:.8rem;margin-top:18px">
            Price-Lock SHA-256 válido 24-72 h. Confirmación de disponibilidad en menos de 24 h.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section id="contacto">
    <div class="wrap">
      <div class="kicker">Contacto directo</div>
      <h2 style="font-size:clamp(1.6rem,3.5vw,2.4rem);margin-bottom:24px">Reserve su artista hoy</h2>
      <p style="color:var(--muted);max-width:60ch;margin-bottom:32px">
        Representación directa sin intermediarios. Depósito de <?= number_format((float) $depositRequired, 0, ',', '.') ?> € con Price-Lock SHA-256.
      </p>
      <div class="cta">
        <a class="btn btn-cyan" href="tel:<?= e($phone) ?>">Llamar ahora</a>
        <a class="btn btn-ghost" href="https://wa.me/<?= e($phone) ?>?text=<?= $whatsappText ?>" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <p class="mono">ArtistasEuropa · Roster Soberano S-Class · Productora EAR</p>
    <p style="margin-top:8px">Split <?= (int) $splitArtist ?>/<?= (int) $splitEarOs ?>/<?= (int) $splitVimume ?> · Hub <?= e($hubReference) ?> · <?= number_format((float) $ratePerKm, 2, ',', '.') ?> €/km > <?= (int) $freeKmThreshold ?> km</p>
  </div>
</footer>
</body>
</html>
