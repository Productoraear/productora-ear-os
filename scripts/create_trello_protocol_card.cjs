/**
 * 📋 CREACIÓN DE TARJETA PROTOCOLO DE BODA CRISTINA Y PABLO EN TRELLO
 * Tablero: https://trello.com/b/M74AmVdu/boda-cristina-y-pablo
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = (process.env.TRELLO_API_KEY || '').replace(/['"]/g, '').trim();
const token = (process.env.TRELLO_TOKEN || '').replace(/['"]/g, '').trim();

// Lista 'DIA DE LA BODA' (682cb9cff332b34d3302d4da)
const listIdDiaBoda = '682cb9cff332b34d3302d4da';
// Lista 'PENDIENTE' (682cb9b38e66ff72c2e4c6b4)
const listIdPendiente = '682cb9b38e66ff72c2e4c6b4';

const cardTitle = '🎵 PROTOCOLO MUSICAL Y ESCALETA OFICIAL — BODA CRISTINA Y PABLO';

const cardDescription = `
# 🎵 PROTOCOLO MUSICAL OFICIAL — BODA CRISTINA Y PABLO
**Producción Técnica & Dirección de Protocolo:** Productora EAR

---

### 1. 🍸 RECEPCIÓN DE INVITADOS
- **Carpeta / Playlist:** \`"RECEPCIÓN INVITADOS-EVENTO"\`
- **Modo de Reproducción:** Aleatorio (Random)
- **Indicaciones:** Música ambiental continua desde la llegada de los primeros invitados.

---

### 2. 🤵 ENTRADA PABLO (NOVIO)
- **Canción Oficial:** \`"ENTRADA PABLO"\`
- **Instrucciones:** Reproducción completa de la canción sin cortes ni desvanecimientos prematuros.

---

### 3. 👰 ENTRADA CRIS (NOVIA)
- **Canción Oficial:** \`"ENTRADA CRIS"\`
- **Instrucciones:** Reproducción completa de la canción sin cortes. Entrada triunfal.

---

### 4. ⛪ CANCIÓN CEREMONIA (FONDO CONTINUO)
- **Instrucciones:** Canción que suena durante todo el evento, **SALVO** cuando tocan canciones específicas en momentos puntuales señalados a continuación.

---

### 5. 🍻 MOMENTO CERVEZAS (CUE DE ACCIÓN Y DIÁLOGO)
- **Canción Oficial:** \`"CERVEZAS"\`
- **Cue de Activación (Pie de texto):** 
  > La canción comienza en el instante exacto en que **Diana** pregunta a Pablo si se quiere casar con Cristina y él responde:
  > *"Lo siento así no me puedo casar, esto es demasiado serio, vamos a arreglarlo."*
- **Instrucciones:** En ese preciso momento **arranca la canción "CERVEZAS"** y se deja sonar **ENTERA** mientras se reparten las cervezas a los novios e invitados.

---

### 6. 💍 MOMENTO ANILLOS PREVIO AL BESO
- **Canción Oficial:** \`"FIN DE CEREMONIA"\`
- **Cue de Activación:** Empieza a sonar cuando nos estamos colocando los anillos, **después del "sí, quiero" de Cris** y **antes** de que Diana diga *"PUEDES BESAR A LA NOVIA"*.

---

### 7. 🥂 POST CEREMONIA Y EL EVENTO
- **Carpeta / Playlist:** \`"RECEPCIÓN INVITADOS-EVENTO"\`
- **Modo de Reproducción:** Aleatorio (Random)
- **Instrucciones:** Transición a recepción y celebración post-ceremonia.
`.trim();

async function createProtocolCard() {
  if (!apiKey || !token) {
    console.error('❌ Falta TRELLO_API_KEY o TRELLO_TOKEN');
    return;
  }

  console.log('🚀 Creando tarjeta de Protocolo de Boda en Trello (Tablero Boda Cristina y Pablo)...');

  const url = `https://api.trello.com/1/cards?key=${apiKey}&token=${token}&idList=${listIdDiaBoda}&name=${encodeURIComponent(cardTitle)}&desc=${encodeURIComponent(cardDescription)}&pos=top`;

  try {
    const res = await fetch(url, { method: 'POST' });
    if (res.ok) {
      const card = await res.json();
      console.log(`✅ Tarjeta de Protocolo creada exitosamente en lista DIA DE LA BODA!`);
      console.log(`   URL Trello: ${card.shortUrl}`);
    } else {
      const errorText = await res.text();
      console.error('❌ Error creando tarjeta en Trello:', errorText);

      // Reintentar en lista PENDIENTE
      const fallbackUrl = `https://api.trello.com/1/cards?key=${apiKey}&token=${token}&idList=${listIdPendiente}&name=${encodeURIComponent(cardTitle)}&desc=${encodeURIComponent(cardDescription)}&pos=top`;
      const resFallback = await fetch(fallbackUrl, { method: 'POST' });
      if (resFallback.ok) {
        const cardFallback = await resFallback.json();
        console.log(`✅ Tarjeta de Protocolo creada en lista PENDIENTE: ${cardFallback.shortUrl}`);
      }
    }
  } catch (err) {
    console.error('❌ Fallo de red con Trello API:', err);
  }
}

createProtocolCard();
