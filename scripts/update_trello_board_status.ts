import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = (process.env.TRELLO_API_KEY || '').replace(/['"]/g, '').trim();
const token = (process.env.TRELLO_TOKEN || '').replace(/['"]/g, '').trim();
const doneListId = '6832e08f808b43242155fbcd'; // BÓVEDA DE ÉXITOS (HECHO)
const activeListId = '6832e08c66b69cdce03c2a28'; // PIPELINE ACTIVO

async function updateTrelloBoard() {
  console.log('🚀 Actualizando y sincronizando el tablero de Trello ("Produccion")...\n');

  // 1. Mover tarjetas completadas a BÓVEDA DE ÉXITOS (HECHO)
  const cardsToMove = [
    { id: '69ab5634aa128e08e032e7fd', name: '[FRONTEND B2C] Interfaz Parejas' },
    { id: '69ab5634198dc705f7e6bc3f', name: '[FRONTEND B2B] Dashboard Propietarios' },
    { id: '69b3aed435db426441b29af3', name: '🎯 Maquetar Dossier Élite VIMUME' },
    { id: '69b3aed545e29884e3ec70b4', name: '💻 Desarrollo VIMUME Tracker MVP' },
  ];

  for (const card of cardsToMove) {
    try {
      const url = `https://api.trello.com/1/cards/${card.id}?idList=${doneListId}&key=${apiKey}&token=${token}`;
      const res = await fetch(url, { method: 'PUT' });
      if (res.ok) {
        console.log(`✅ Movida a [HECHO]: "${card.name}"`);
      }
    } catch (e) {
      console.error(`❌ Error moviendo ${card.name}:`, e);
    }
  }

  // 2. Crear Tarjetas de Hitos Críticos Completados en BÓVEDA DE ÉXITOS
  const completedMilestones = [
    {
      name: '✅ Saneamiento GSC 4.600+ Errores (Robots.txt + Guardián 301 + 5xx Boundaries)',
      desc: 'Erradicados los 1.624 bloqueos de robots.txt, 1.069 errores 404 mediante redirecciones 301 a pilares canónicos y 61 errores 5xx con Error Boundaries S-Class. Validación iniciada en Search Console.'
    },
    {
      name: '✅ Motor Semántico Relacional & Geo-Targeting (>85% Unicidad en 52 Provincias)',
      desc: 'Desplegada la Matriz Relacional de 30 intenciones emocionales x 52 provincias con repertorio, psicología y venues locales en /servicios/mariachis/[evento-rol]/[provincia]. Sitemap actualizado a 2.400+ URLs canónicas vivas.'
    },
    {
      name: '✅ Generador de Memorias Técnicas B2G en 1-Clic (Art. 118 LCSP en /ayuntamientos)',
      desc: 'Creado el portal de contratación pública /ayuntamientos con descarga en 1-clic de pliegos y memorias justificativas homologadas con sonido 12 W/pax Bose F1 y póliza de RC de 1.000.000€.'
    },
    {
      name: '✅ Bóveda Formativa Dani Aragón (56 Audios Activos en /academia)',
      desc: 'Conectados los 56 audios de formación musical de Dani Aragón en el reproductor HTML5 de la academia con filtros por categoría y buscador integrado.'
    },
    {
      name: '✅ Galería Multimedia 6 Capas de Edwin Agudelo (Modal 4K & Dual Stream)',
      desc: 'Desplegado EdwinVaultGalleryGrid con selector [Ver Vídeo | Escuchar Audio], pop-up cinemático de YouTube y letra oficial completa de "Mi Propia Realidad".'
    },
    {
      name: '✅ Conexión Trello API & Telegram Bot (@ProductoraEAR_Intel_bot)',
      desc: 'Integración certificada de la API nativa de Trello en el pipeline activo y radar B2G conectado con el bot de Telegram.'
    }
  ];

  for (const m of completedMilestones) {
    try {
      const url = `https://api.trello.com/1/cards?idList=${doneListId}&name=${encodeURIComponent(m.name)}&desc=${encodeURIComponent(m.desc)}&pos=top&key=${apiKey}&token=${token}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        console.log(`🏆 Hito registrado en [HECHO]: "${m.name}"`);
      }
    } catch (e) {
      console.error(`❌ Error creando hito ${m.name}:`, e);
    }
  }

  // 3. Crear Tarjetas de Tareas Activas / Pendientes en PIPELINE ACTIVO
  const pendingTasks = [
    {
      name: '🚀 Conexión Email Transaccional (Resend / MailerLite) para Envío Inmediato de Dossiers PDF',
      desc: 'Entrega instantánea de propuestas comerciales por correo con PDF adjunto y asignación de grupo MailerLite con Cupón de 150€.'
    },
    {
      name: '📍 Gobernanza Google Business Profile (Map Pack 3-Pack Madrid/Toledo)',
      desc: 'Vincular ficha de Google Maps para Productora EAR / Edwin Agudelo con URLs relacionales (/servicios/mariachis/madrid) para capturar el tráfico local.'
    }
  ];

  for (const p of pendingTasks) {
    try {
      const url = `https://api.trello.com/1/cards?idList=${activeListId}&name=${encodeURIComponent(p.name)}&desc=${encodeURIComponent(p.desc)}&pos=top&key=${apiKey}&token=${token}`;
      const res = await fetch(url, { method: 'POST' });
      if (res.ok) {
        console.log(`📌 Tarea registrada en [PIPELINE ACTIVO]: "${p.name}"`);
      }
    } catch (e) {
      console.error(`❌ Error creando tarea ${p.name}:`, e);
    }
  }

  console.log('\n🎉 Tablero de Trello actualizado y sincronizado con el estado real del proyecto.');
}

updateTrelloBoard();
