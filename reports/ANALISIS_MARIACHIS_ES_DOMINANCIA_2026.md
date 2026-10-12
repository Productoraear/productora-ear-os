# 🎺 ANALISIS FORENSE — MARIACHIS.ES (OBJETIVO DE DOMINANCIA)
Fecha: 2026-10-12 · Arquitecto: Antigravity · Fuente: `mariachis_es_home.html` (198KB, Next.js App Router)

## 1. RESUMEN EJECUTIVO
mariachis.es es un **directorio/lead-gen B2C** de mariachis para España, construido con **Next.js 15 App Router + Turbopack**, fotos en **Supabase**, tracking **GTM + Meta Pixel**. Su modelo de negocio es **captar clientes finales y venderles "3 presupuestos gratis en 24h" sin comisión al cliente**, monetizando por el lado PRO (alta/planes de grupos) y cross-selling hacia `restaurantesmexicanos.es`. Ambos verticales son del mismo propietario (**PlusTecnologia**).

**Nuestra ventaja P0 (ellos no la tienen):** depósito Stripe 100 € Price-Lock SHA-256 + `atomicDateLockEngine` (bloqueo de fecha), precio cerrado SSOT, rider acústico legal (Ley 37/2003), split soberano 80/10/10 y obra social VIMUME. Ellos operan "sin comisión" → no cierran ni blindan fecha. Ese es el hueco que aplasta.

## 2. ARQUITECTURA COMPLETA DE LA HOME (17 BLOQUES)
1. **Nav sticky** (`bg-white/95 backdrop-blur`): Resultados · Por Evento (dd) · Servicios (dd) · Guía y Consejos (dd) · Canal YouTube · Profesionales (dd) · CTA verde **"🎺 Anuncia Gratis"** → `/profesionales/alta`
2. **Hero** (min 90svh): H1 *"Los mejores mariachis para bodas, serenatas y eventos en España"* + 3 bullets (verificados · <24h · gratis) + CTA rojo **"Pedir presupuesto gratis"** + panel lateral **"¿Qué quieres celebrar?"** (Boda, Cumpleaños, Serenata, Empresa, Otro evento) + microcopy *"Sin llamadas a ciegas"*.
3. **Stats**: `<24h` respuesta · `0€` para ti · `50+ provincias`.
4. **"Cómo contratar en 3 pasos"** (verde oscuro): formulario → 3 presupuestos → comparas y celebras.
5. **"Mariachis destacados esta semana"**: 4 cards (Ábaco Madrid 🏆 · Charros de Jalisco · Sentimiento Mexicano · **Mariachis Europa**) con badges Premium/Verificado/Disponible, rating, tags evento, ciudad.
6. **"Mariachis por tipo de evento"**: 4 cards (Bodas · Cumpleaños · Serenatas · Corporativos) + chips de **búsquedas populares** (evento+ciudad).
7. **"Mariachis en tu ciudad"**: 6 cards (Madrid +120 · Barcelona +85 · Sevilla +55 · Valencia +60 · Málaga +40 · Bilbao +30).
8. **"Reseñas de Google"**: 6 reviews con badge "Reseña verificada".
9. **"Preguntas frecuentes"**: accordion 8 FAQs.
10. **CTA final** "¿Listo para encontrar tu mariachi ideal?" (verde degradado).
11. **"Por qué contratar con nosotros"**: texto SEO largo (1.500+ palabras) + imagen.
12. **Cross-sell**: "Disfruta la mejor comida mexicana 🌮" → restaurantesmexicanos.es.
13. **"Para profesionales"**: "¿Tienes un grupo? Añadir mi grupo gratis".
14. **"Guías esenciales"**: 3 pillar pages (precio · organizar evento · qué es un mariachi).
15. **"Mariachis en toda España"**: ~50 enlaces de provincias.
16. **Footer** completo: email info@mariachis.es · Madrid · 7 redes (FB/IG/X/YT/TikTok/LinkedIn/Pinterest) · 6 columnas (Servicios/Ciudades/Empresa/Legal/Colaboradores/Profesionales).
17. **Bottom bar móvil** fija: "Recibir 3 presupuestos gratis".

## 3. SEO TÉCNICO (CÓMO RANKED)
- **Title**: "▷ Mariachis en España | Contrata Grupos · Precios desde 150€"
- **Meta description**: "…desde 150€ ✓ Bodas, serenatas y eventos ✓ hasta 3 presupuestos gratis en 24h ✓ verificados, sin comisiones."
- **Meta keywords**: `mariachis para bodas, serenatas con mariachi, mariachis a domicilio, precio de mariachis por hora, mariachis baratos, mariachis para cumpleaños, charros para fiestas, contratar mariachis, mariachis Madrid, mariachis Barcelona, mariachis España, grupos de mariachis, música mexicana, fiesta mexicana`
- **Canonical**: `https://mariachis.es` · **OG + Twitter card** completos.
- **Schema.org JSON-LD (4 bloques)**:
  1. `WebSite` + SearchAction (`/resultados?q=`).
  2. `Organization` + sameAs (redes).
  3. `LocalBusiness` con `aggregateRating 5.0 / 50` + 6 `Review` completas + `areaServed` (18 ciudades).
  4. `FAQPage` (8 preguntas) + `ItemList` (4 `MusicGroup` destacados).
- **Tracking**: GTM `GTM-KCWF4N96` + Meta Pixel `2402437910255954`.
- **Fuentes**: Geist + Playfair Display (display/títulos).
- **Imágenes**: Supabase storage `pmoklrflnfadxlhxcioi.supabase.co` (bucket `mariachi-photos`).

## 4. KEYWORDS E INTENCIÓN (MATRIZ)
- **Transaccionales**: contratar mariachis · mariachis a domicilio · charros para fiestas · precio mariachis por hora.
- **Locales**: mariachis en {Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao} + ~50 provincias.
- **Por evento**: mariachis para bodas / serenatas / cumpleaños / eventos corporativos.
- **Informacionales**: cuánto cuesta contratar un mariachi · qué es un mariachi · cómo reservar.

## 5. PRECIOS DEL COMPETIDOR (FAQ)
- Rango general: **300 € – 1.200 €** (trío/cuarteto/grupo completo).
- Serenata 30-45 min: **300–500 €** · Grupo completo boda: **700–1.200 €**.
- Gancho del title: **"desde 150 €"** (precio imán difuso, no cerrado).

## 6. MODELO DE NEGOCIO
- **B2C**: "hasta 3 presupuestos gratis en 24h" sin comisión al cliente.
- **B2B/PRO (freemium)**: alta/planes de grupos (`/profesionales/alta`, `/profesionales/planes`).
- **Cross-sell**: restaurantesmexicanos.es (mismo dueño: PlusTecnologia).

## 7. DEBILIDADES EXPLOTABLES (NUESTRA PUERTA P0)
1. **Sin cierre/lock de fecha** → nosotros: depósito 100 € Stripe + `atomicDateLockEngine`.
2. **Precio difuso (150–1200 €)** → nosotros: precio cerrado SSOT + rider acústico por contexto.
3. **Sin captación de artistas** → nosotros: embudo formación / booking / apply / reclamar ficha (doble cara).
4. **Sin capa legal de ruido** → nosotros: Ley 37/2003 + hash SHA-256 de rider.
5. **Sin escudo de valor social** → nosotros: split 80/10/10 + VIMUME (RSC/SROI 4.85x).

## 8. PREGUNTAS BLOQUEANTES (PARA DECIDIR LA ESTRATEGIA)
1. **Superficie/URL**: ¿el clon vive en `/mariachis` (ya existe, mínimo), en `/artistas` (ya existe catálogo), o creamos nueva ruta canónica (ej. `/artistas-europa`)?
2. **Dirección primaria de la home**: ¿home dirigida a CLIENTES (contratar) con embudo artístico como sección secundaria, o a ARTISTAS (entrar embudo) como protagonista?
3. **Catálogo/datos**: ¿los 4 destacados del competidor se replican o solo catálogo propio? ¿Los absorbers de bodas.net ya poblan BD (Prisma/Postgres) o JSON edge?
4. **Precios**: ¿mostramos precios de terceros con split 80/10/10, o solo tarifas SSOT propias (Edwin agudelo 350 €)? ¿El "desde 150 €" se descarta o se adapta?
5. **Embudo artístico (4 rutas)**: mapeo exacto de formación / booking / aplicar / reclamar ficha → ¿rutas ya existentes o endpoints nuevos (`/academia`, `/booking-artista`, `/aplicar`, `/reclamar-ficha`)?
6. **Limpieza de marcas**: ¿reescribimos TODO el copy con terminología/precios propios (sin "desde 150 €", sin "3 presupuestos", sin reseñas Google de ellos), conservando solo arquitectura SEO + schemas genéricos?