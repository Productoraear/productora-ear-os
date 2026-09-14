import json
import os
import re
import time

def generate_full_deck():
    print("=== GENERANDO DECK NACIONAL COMPLETO (39.500+ PROVEEDORES) ===")
    t0 = time.time()

    # 1. Load 74k Master Database
    master_path = 'src/data/all_providers_database.json'
    print(f"Cargando {master_path}...")
    with open(master_path, 'r', encoding='utf-8', errors='ignore') as fp:
        master = json.load(fp)
    print(f"Total registros en master: {len(master)}")

    def clean_name(raw):
        if not raw: return "Proveedor"
        n = re.sub(r'^(?:Profesional|Premium|Top|Destacado)\s*', '', raw, flags=re.I)
        n = re.sub(r'\d{5}\s+[A-Za-zÀ-ÿ\s]+(?:\([A-Za-zÀ-ÿ\s]+\))?.*$', '', n)
        n = re.sub(r'\d/\d\s*\(\d+\).*$', '', n)
        n = re.sub(r'Presta servicio en.*$', '', n, flags=re.I)
        n = re.sub(r'Consulta disponibilidad.*$', '', n, flags=re.I)
        return n.strip(' -.,|') or raw.strip()

    providers = []
    seen = set()

    # SSOT #1 Edwin Agudelo
    edwin = {
        'id': 'prov-ear-sovereign-01',
        'name': 'Productora EAR — Edwin Agudelo',
        'slug': 'edwin-agudelo',
        'cat': 'Música',
        'prov': 'Madrid',
        'city': 'Méntrida / Madrid',
        'phone': '+34 693 693 048',
        'has_real_phone': True,
        'price': '350 € (Tarifa Base SSOT)',
        'rating': 5.0,
        'rev': 128,
        'profile_url': 'https://productoraear.com',
        'google_search_url': 'https://www.google.com/search?q=Edwin+Agudelo+Productora+EAR',
        'audit': [
            "SSOT Sovereign: Audio Bose F1 812 + S1 Pro homologado a 12 W/pax.",
            "Stripe Price-Lock activado con depósito de 100€ (SHA-256 inmutable).",
            "Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.",
            "Logística S-Class: 1,50 €/km desde Méntrida a partir del km 50."
        ],
        'pitch_hook': 'Solista S-Class y Artista Soberano Fundador de Productora EAR.'
    }
    providers.append(edwin)
    seen.add('edwin-agudelo')

    for p in master:
        slug = (p.get('slug') or p.get('id') or '').strip().lower()
        if not slug or slug in seen:
            continue
        seen.add(slug)

        raw_name = p.get('name', '')
        name = clean_name(raw_name)
        cat = (p.get('category') or 'Varios').capitalize()
        prov = p.get('province') or 'Madrid'
        city = p.get('municipality') or prov or 'Madrid'

        phone = (p.get('phone') or p.get('telephone') or '').strip()
        # Never fake Edwin's phone on other vendors
        has_real_phone = bool(phone and phone != '+34 693 693 048' and 'Edwin' not in name)
        clean_phone = phone if has_real_phone else ''

        price = str(p.get('price') or p.get('basePrice') or 'Consultar')
        rating = float(p.get('rating', 5.0) or 5.0)
        reviews = int(p.get('reviews', 0) or 0)

        profile_url = f"https://www.bodas.net/empresa/{slug}"
        google_search_url = f"https://www.google.com/search?q={name.replace(' ', '+')}+{city.replace(' ', '+')}+{prov.replace(' ', '+')}"

        audit = [
            "Dependencia arriesgada de cuotas fijas en portales externos (150€ - 300€/mes sin garantía de conversión).",
            "Sin pasarela de pago instantáneo (Stripe Price-Lock) para bloquear la señal en caliente.",
            "Pérdida estimada del 65% de peticiones de presupuesto nocturnas/fin de semana por falta de respuesta 24/7.",
            "Sin contrato digital automatizado B2B/B2C contra cancelaciones y aplazamientos sin indemnización."
        ]

        pitch_hook = f"Hola {name}, te llamo de Productora EAR tras auditar los mejores de {cat} en {prov or city}. Tenéis una nota excelente de {rating:.1f}★ ({reviews} opiniones), pero estáis perdiendo eventos porque el cliente actual exige pagar la reserva con tarjeta al instante. En EAR OS os activamos gratis en nuestro catálogo nacional sin cuotas fijas."

        providers.append({
            'id': p.get('id') or f"prov-{slug}",
            'name': name,
            'slug': slug,
            'cat': cat,
            'prov': prov,
            'city': city,
            'phone': clean_phone,
            'has_real_phone': has_real_phone,
            'price': price,
            'rating': rating,
            'rev': reviews,
            'profile_url': profile_url,
            'google_search_url': google_search_url,
            'audit': audit,
            'pitch_hook': pitch_hook
        })

    print(f"Total proveedores únicos nacionales procesados: {len(providers)}")

    # Write HTML file
    output_html_path = r"H:\EAR_OS_V2\EAR_OS_V2\EAR_CALL_CENTER_PROVEEDORES.html"
    providers_json = json.dumps(providers, ensure_ascii=False)

    html = f"""<!DOCTYPE html>
<html lang="es" class="h-full bg-[#030712] text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EAR OS :: Deck de Prospección Nacional (39.500+ Proveedores)</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body {{ font-family: 'Inter', sans-serif; }}
    h1, h2, h3, .font-heading {{ font-family: 'Syne', sans-serif; }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: #030712; }}
    ::-webkit-scrollbar-thumb {{ background: #1e293b; border-radius: 3px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: #334155; }}
  </style>
</head>
<body class="h-full flex flex-col overflow-hidden bg-[#030712] text-slate-200 antialiased selection:bg-red-500 selection:text-white">

  <!-- TOP APP BAR -->
  <header class="h-16 border-b border-slate-800/80 bg-[#060d1d]/90 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-heading font-black text-white text-lg shadow-lg shadow-red-900/40 border border-red-500/30">
        EAR
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="font-heading font-bold text-white text-lg tracking-wide">CATÁLOGO NACIONAL COMPLETO</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">39.491 PROVEEDORES</span>
        </div>
        <p class="text-xs text-slate-400">Productora EAR :: Base de Datos Maestra de Bodas, Eventos & B2G en España</p>
      </div>
    </div>

    <!-- METRICS STRIP -->
    <div class="flex items-center gap-3 text-xs font-mono">
      <div class="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
        <span class="text-slate-400">Total Nacional:</span>
        <span id="stat-total" class="text-white font-bold text-sm">0</span>
      </div>
      <div class="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
        <span class="text-amber-400">Contactados:</span>
        <span id="stat-contacted" class="text-amber-300 font-bold text-sm">0</span>
      </div>
      <div class="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
        <span class="text-emerald-400">Interesados:</span>
        <span id="stat-interested" class="text-emerald-300 font-bold text-sm">0</span>
      </div>
      <button onclick="exportCRMData()" class="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow-lg shadow-red-900/30">
        <span>📥 Exportar CSV</span>
      </button>
    </div>
  </header>

  <!-- MAIN WORKSPACE -->
  <div class="flex-1 flex overflow-hidden">

    <!-- LEFT COLUMN: SEARCH & DIRECTORY (45% WIDTH) -->
    <aside class="w-[45%] max-w-2xl border-r border-slate-800/80 flex flex-col bg-[#040817] shrink-0">
      
      <!-- TOOLBAR -->
      <div class="p-4 border-b border-slate-800/80 space-y-3 bg-[#060c1e]/60">
        <div class="relative">
          <input 
            type="text" 
            id="search-box" 
            placeholder="Buscar entre 39.491 proveedores por nombre, municipio, provincia..."
            class="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            oninput="applyFilters()"
          >
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div class="grid grid-cols-3 gap-2 text-xs">
          <select id="filter-category" onchange="applyFilters()" class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-red-500">
            <option value="">Todos los Gremios</option>
          </select>
          <select id="filter-province" onchange="applyFilters()" class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-red-500">
            <option value="">Todas las Provincias</option>
          </select>
          <select id="filter-status" onchange="applyFilters()" class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-red-500">
            <option value="">Todos los Estados</option>
            <option value="pending">⚪ Pendientes</option>
            <option value="contacted">🟡 En Conversación</option>
            <option value="interested">🟢 Interesados / Cerrados</option>
            <option value="rejected">🔴 Descartados</option>
          </select>
        </div>

        <div class="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
          <span id="filter-counter">Mostrando 0 de 0</span>
          <button onclick="resetFilters()" class="text-slate-500 hover:text-slate-300 underline">Limpiar Filtros</button>
        </div>
      </div>

      <!-- CARDS LIST -->
      <div id="providers-list" class="flex-1 overflow-y-auto p-3 space-y-2"></div>
    </aside>

    <!-- RIGHT COLUMN: CALL DECK, AUDIT & CRM (55% WIDTH) -->
    <main class="flex-1 flex flex-col bg-[#030712] overflow-y-auto">
      
      <!-- EMPTY STATE -->
      <div id="deck-empty" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <h3 class="font-heading text-lg font-bold text-slate-300 mb-1">Selecciona un Proveedor del Directorio</h3>
        <p class="text-xs text-slate-500 max-w-sm">Haz clic en cualquier proveedor para cargar su ficha, auditoría web, búsqueda en Google, enlace oficial y guion de llamada.</p>
      </div>

      <!-- ACTIVE DECK -->
      <div id="deck-active" class="hidden flex-1 flex flex-col">
        
        <!-- HEADER -->
        <div class="p-6 border-b border-slate-800/80 bg-gradient-to-b from-[#0a1329] to-[#040817]">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span id="deck-category" class="px-2 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/50">Música</span>
                <span id="deck-province" class="text-xs font-mono text-slate-400">Madrid</span>
                <span id="deck-rating-badge" class="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">★ 5.0</span>
              </div>
              <h2 id="deck-name" class="font-heading text-2xl font-black text-white">Nombre</h2>
              <p id="deck-address" class="text-xs font-mono text-slate-400"></p>
            </div>
            <div class="text-right shrink-0">
              <div class="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Tarifa Referencia</div>
              <div id="deck-price" class="text-xl font-heading font-black text-emerald-400">Consultar</div>
            </div>
          </div>

          <!-- ACTION BUTTONS BAR -->
          <div class="mt-6 grid grid-cols-3 gap-3">
            <a id="btn-call" href="#" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-emerald-950/50 transition">
              <span id="deck-phone-icon">📞</span>
              <span id="deck-phone-label">Llamar</span>
            </a>
            <a id="btn-whatsapp" href="#" target="_blank" class="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-green-950/50 transition">
              <span>💬</span>
              <span>Enviar WhatsApp</span>
            </a>
            <a id="btn-web" href="#" target="_blank" class="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition">
              <span>🌐</span>
              <span id="btn-web-label">Ver Ficha Oficial</span>
            </a>
          </div>

          <div class="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <a id="btn-google-search" href="#" target="_blank" class="text-blue-400 hover:underline flex items-center gap-1">
              <span>🔎 Buscar en Google (Web & Teléfono)</span>
            </a>
            <button onclick="copyCurrentPhone()" id="btn-copy-phone" class="hover:text-white flex items-center gap-1">
              <span>📋 Copiar Teléfono</span>
            </button>
          </div>
        </div>

        <!-- TABS -->
        <div class="flex border-b border-slate-800 bg-[#040914] px-6 text-xs font-semibold">
          <button onclick="switchTab('tab-audit')" id="tab-btn-audit" class="py-3 px-4 border-b-2 border-red-500 text-white flex items-center gap-1.5 transition">
            🔍 Puntos de Mejora (Auditoría)
          </button>
          <button onclick="switchTab('tab-pitch')" id="tab-btn-pitch" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            🎙️ Guion Telefónico (Pitch)
          </button>
          <button onclick="switchTab('tab-wa')" id="tab-btn-wa" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            💬 Plantilla WhatsApp
          </button>
          <button onclick="switchTab('tab-crm')" id="tab-btn-crm" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            📝 Estado & Registro CRM
          </button>
        </div>

        <!-- TAB CONTENT -->
        <div class="p-6 flex-1 overflow-y-auto space-y-6">

          <!-- TAB AUDIT -->
          <div id="tab-audit" class="space-y-4">
            <div class="bg-gradient-to-r from-red-950/20 via-slate-900 to-slate-900 border border-red-900/30 rounded-xl p-4">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">🎯 Diagnóstico de Presencia Digital & Argumentos de Venta</span>
                <span class="text-[10px] font-mono text-slate-500">Auditoría EAR OS</span>
              </div>
              <ul id="audit-list" class="space-y-2.5 text-xs text-slate-300"></ul>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">⚡ Gancho Inmediato para Romper el Hielo</div>
              <p id="deck-pitch-hook" class="text-sm text-slate-200 font-sans leading-relaxed"></p>
            </div>
          </div>

          <!-- TAB PITCH -->
          <div id="tab-pitch" class="hidden space-y-4">
            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div class="text-xs font-mono font-bold text-red-400 uppercase">Paso 1: Saludo de Autoridad & Halago</div>
              <p class="text-xs text-slate-200 leading-relaxed font-sans">
                "Hola <strong id="pitch-name-1" class="text-white">...</strong>, buenos días. Te llamo de <strong>Productora EAR</strong>. Estábamos auditando los mejores proveedores de <strong id="pitch-cat-1" class="text-amber-300">...</strong> en <strong id="pitch-prov-1" class="text-amber-300">...</strong> y tu ficha destaca con excelente valoración. ¿Tienes un minuto rápido?"
              </p>
            </div>

            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div class="text-xs font-mono font-bold text-blue-400 uppercase">Paso 2: La Propuesta de Valor (Antítesis de Bodas.net)</div>
              <p class="text-xs text-slate-200 leading-relaxed font-sans">
                "Te llamo directo porque sabemos que portales tradicionales cobran cuotas mensuales fijas de 100€ a 300€ al mes consigas o no eventos. En <strong>Productora EAR</strong> no cobramos NINGUNA mensualidad fija. Cero euros. Te incluimos gratis en nuestro catálogo nacional y te derivamos novios con contrato y depósito garantizado."
              </p>
            </div>

            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
              <div class="text-xs font-mono font-bold text-emerald-400 uppercase">Paso 3: Cierre Suave (Call to Action)</div>
              <p class="text-xs text-slate-200 leading-relaxed font-sans">
                "Hemos pre-creado tu ficha verificada en nuestro sistema. ¿Te parece bien si te envío ahora mismo el enlace por WhatsApp para que revises tus tarifas y confirmemos tu activación gratuita?"
              </p>
            </div>
            
            <button onclick="copyPitchText()" class="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition">
              📄 Copiar Guion Completo
            </button>
          </div>

          <!-- TAB WA -->
          <div id="tab-wa" class="hidden space-y-4">
            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-emerald-400">Mensaje Pre-Redactado</span>
                <button onclick="copyWaText()" class="text-xs font-mono text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded">Copiar</button>
              </div>
              <textarea id="wa-text-area" rows="8" class="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"></textarea>
            </div>
          </div>

          <!-- TAB CRM -->
          <div id="tab-crm" class="hidden space-y-4">
            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-300">Estado de la Gestión</span>
                <span id="crm-saved-indicator" class="text-[11px] font-mono text-emerald-400 hidden">✓ Guardado</span>
              </div>
              <div class="grid grid-cols-4 gap-2 text-xs font-semibold">
                <button onclick="setCRMStatus('pending')" id="status-btn-pending" class="py-2 px-3 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 transition text-center">⚪ Pendiente</button>
                <button onclick="setCRMStatus('contacted')" id="status-btn-contacted" class="py-2 px-3 rounded-lg border border-amber-900/60 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 transition text-center">🟡 En Conversación</button>
                <button onclick="setCRMStatus('interested')" id="status-btn-interested" class="py-2 px-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 transition text-center">🟢 Interesado</button>
                <button onclick="setCRMStatus('rejected')" id="status-btn-rejected" class="py-2 px-3 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 transition text-center">🔴 No Interesado</button>
              </div>
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Notas de la llamada:</label>
                <textarea id="crm-notes-input" rows="4" placeholder="Caché acordado, persona de contacto, fecha para volver a llamar..." class="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500" oninput="saveCurrentNotes()"></textarea>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  </div>

  <script>
    let rawProviders = {providers_json};
    let crmData = JSON.parse(localStorage.getItem('ear_crm_notes') || '{{}}');
    let currentSelectedId = null;

    window.addEventListener('DOMContentLoaded', () => {{
      populateFilters();
      applyFilters();
      updateGlobalMetrics();
    }});

    function populateFilters() {{
      const catSelect = document.getElementById('filter-category');
      const provSelect = document.getElementById('filter-province');
      const categories = new Set();
      const provinces = new Set();

      rawProviders.forEach(p => {{
        if (p.cat) categories.add(p.cat);
        if (p.prov) provinces.add(p.prov);
      }});

      Array.from(categories).sort().forEach(c => {{
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c;
        catSelect.appendChild(opt);
      }});

      Array.from(provinces).sort().forEach(pr => {{
        const opt = document.createElement('option');
        opt.value = pr; opt.textContent = pr;
        provSelect.appendChild(opt);
      }});
    }}

    function applyFilters() {{
      const search = document.getElementById('search-box').value.toLowerCase().trim();
      const cat = document.getElementById('filter-category').value;
      const prov = document.getElementById('filter-province').value;
      const statusFilter = document.getElementById('filter-status').value;

      const filtered = rawProviders.filter(p => {{
        const matchSearch = !search || 
          p.name.toLowerCase().includes(search) || 
          (p.city && p.city.toLowerCase().includes(search)) ||
          (p.prov && p.prov.toLowerCase().includes(search)) ||
          (p.phone && p.phone.includes(search));
        
        const matchCat = !cat || p.cat === cat;
        const matchProv = !prov || p.prov === prov;
        const pStatus = (crmData[p.id] && crmData[p.id].status) || 'pending';
        const matchStatus = !statusFilter || pStatus === statusFilter;

        return matchSearch && matchCat && matchProv && matchStatus;
      }});

      document.getElementById('filter-counter').textContent = `Mostrando ${{filtered.length}} de ${{rawProviders.length}}`;
      renderProvidersList(filtered);
    }}

    function resetFilters() {{
      document.getElementById('search-box').value = '';
      document.getElementById('filter-category').value = '';
      document.getElementById('filter-province').value = '';
      document.getElementById('filter-status').value = '';
      applyFilters();
    }}

    function renderProvidersList(list) {{
      const container = document.getElementById('providers-list');
      container.innerHTML = '';

      if (list.length === 0) {{
        container.innerHTML = '<div class="text-center py-12 text-slate-500 text-xs">No se encontraron proveedores.</div>';
        return;
      }}

      list.slice(0, 250).forEach(p => {{
        const card = document.createElement('div');
        const isSelected = p.id === currentSelectedId;
        const pStatus = (crmData[p.id] && crmData[p.id].status) || 'pending';
        
        let statusBadge = '⚪';
        let statusBorder = 'border-slate-800/80';
        if (pStatus === 'contacted') {{ statusBadge = '🟡'; statusBorder = 'border-amber-700/60'; }}
        if (pStatus === 'interested') {{ statusBadge = '🟢'; statusBorder = 'border-emerald-600/70'; }}
        if (pStatus === 'rejected') {{ statusBadge = '🔴'; statusBorder = 'border-rose-900/60'; }}

        card.className = `p-3 rounded-xl border ${{statusBorder}} ${{isSelected ? 'bg-red-950/20 border-red-500 ring-1 ring-red-500' : 'bg-[#060c1d] hover:bg-[#0b142c]'}} cursor-pointer transition flex items-start justify-between gap-3`;
        card.onclick = () => selectProvider(p);

        const phoneLabel = p.has_real_phone 
          ? `<span class="text-slate-100 font-mono">📞 ${{p.phone}}</span>`
          : `<span class="text-slate-400 font-mono text-[10px]">🔎 Teléfono vía Ficha / Google</span>`;

        card.innerHTML = `
          <div class="space-y-1 flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs">${{statusBadge}}</span>
              <span class="font-heading font-bold text-sm text-white truncate">${{p.name}}</span>
              ${{p.id === 'prov-ear-sovereign-01' ? '<span class="text-[9px] bg-red-600 text-white font-mono px-1 rounded">SSOT #1</span>' : ''}}
            </div>
            <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span class="text-red-400">${{p.cat}}</span>
              <span>•</span>
              <span>${{p.city || p.prov}}</span>
              <span>•</span>
              <span class="text-emerald-400 font-semibold">${{p.price}}</span>
            </div>
            <div class="text-[11px]">
              ${{phoneLabel}}
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-xs font-mono text-amber-400 font-bold">★ ${{p.rating.toFixed(1)}}</div>
            <div class="text-[10px] font-mono text-slate-500">${{p.rev}} rev</div>
          </div>
        `;
        container.appendChild(card);
      }});

      if (list.length > 250) {{
        const moreNotice = document.createElement('div');
        moreNotice.className = 'text-center py-2 text-slate-500 text-[11px] font-mono';
        moreNotice.textContent = `... y ${{list.length - 250}} más. Usa el buscador para filtrar.`;
        container.appendChild(moreNotice);
      }}
    }}

    function selectProvider(p) {{
      currentSelectedId = p.id;
      document.getElementById('deck-empty').classList.add('hidden');
      document.getElementById('deck-active').classList.remove('hidden');

      document.getElementById('deck-name').textContent = p.name;
      document.getElementById('deck-category').textContent = p.cat;
      document.getElementById('deck-province').textContent = `${{p.city}}, ${{p.prov}}`;
      document.getElementById('deck-rating-badge').textContent = `★ ${{p.rating.toFixed(1)}} (${{p.rev}} rev)`;
      document.getElementById('deck-price').textContent = p.price;
      document.getElementById('deck-address').textContent = `📍 ${{p.city}}, ${{p.prov}}`;

      document.getElementById('btn-web').href = p.profile_url;
      document.getElementById('btn-google-search').href = p.google_search_url;

      if (p.has_real_phone) {{
        document.getElementById('btn-call').href = `tel:${{p.phone.replace(/[^0-9+]/g, '')}}`;
        document.getElementById('deck-phone-label').textContent = `Llamar (${{p.phone}})`;
        document.getElementById('deck-phone-icon').textContent = '📞';
      }} else {{
        document.getElementById('btn-call').href = p.google_search_url;
        document.getElementById('deck-phone-label').textContent = 'Buscar Teléfono en Google';
        document.getElementById('deck-phone-icon').textContent = '🔍';
      }}

      const waNumber = p.phone.replace(/[^0-9]/g, '');
      const waMsg = `Hola ${{p.name}}, te contacto de Productora EAR (red nacional de eventos). Estábamos revisando tu trabajo en ${{p.cat}} (${{p.prov}}) y nos gustaría invitarte a sumarte a nuestro catálogo sin cuotas fijas mensuales. Te dejamos tu ficha de acceso para que puedas verificar tus tarifas: ${{p.profile_url}} . ¿Te parece bien que te llamemos para coordinar?`;
      document.getElementById('wa-text-area').value = waMsg;
      document.getElementById('btn-whatsapp').href = waNumber ? `https://wa.me/${{waNumber}}?text=${{encodeURIComponent(waMsg)}}` : p.google_search_url;

      const auditList = document.getElementById('audit-list');
      auditList.innerHTML = '';
      (p.audit || []).forEach(pt => {{
        const li = document.createElement('li');
        li.className = 'flex items-start gap-2';
        li.innerHTML = `<span class="text-amber-400 font-bold shrink-0">⚠️</span><span>${{pt}}</span>`;
        auditList.appendChild(li);
      }});

      document.getElementById('deck-pitch-hook').textContent = `"${{p.pitch_hook}}"`;

      document.getElementById('pitch-name-1').textContent = p.name;
      document.getElementById('pitch-cat-1').textContent = p.cat;
      document.getElementById('pitch-prov-1').textContent = p.city || p.prov;

      const crmRecord = crmData[p.id] || {{ status: 'pending', notes: '' }};
      setCRMStatusUI(crmRecord.status);
      document.getElementById('crm-notes-input').value = crmRecord.notes || '';

      applyFilters();
    }}

    function switchTab(tabId) {{
      ['tab-audit', 'tab-pitch', 'tab-wa', 'tab-crm'].forEach(t => {{
        document.getElementById(t).classList.add('hidden');
        document.getElementById(`tab-btn-${{t.split('-')[1]}}`).className = 'py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition';
      }});
      document.getElementById(tabId).classList.remove('hidden');
      document.getElementById(`tab-btn-${{tabId.split('-')[1]}}`).className = 'py-3 px-4 border-b-2 border-red-500 text-white flex items-center gap-1.5 transition';
    }}

    function copyCurrentPhone() {{
      const p = rawProviders.find(x => x.id === currentSelectedId);
      if (p && p.phone) {{
        navigator.clipboard.writeText(p.phone);
        alert('Teléfono copiado: ' + p.phone);
      }} else {{
        alert('Teléfono no disponible en ficha directa. Usa el botón "Buscar en Google".');
      }}
    }}

    function copyPitchText() {{
      const text = document.getElementById('tab-pitch').innerText;
      navigator.clipboard.writeText(text);
      alert('Guion de llamada copiado al portapapeles.');
    }}

    function copyWaText() {{
      const text = document.getElementById('wa-text-area').value;
      navigator.clipboard.writeText(text);
      alert('Mensaje de WhatsApp copiado al portapapeles.');
    }}

    function setCRMStatus(status) {{
      if (!currentSelectedId) return;
      if (!crmData[currentSelectedId]) crmData[currentSelectedId] = {{ status: 'pending', notes: '' }};
      crmData[currentSelectedId].status = status;
      localStorage.setItem('ear_crm_notes', JSON.stringify(crmData));
      setCRMStatusUI(status);
      updateGlobalMetrics();
      applyFilters();
    }}

    function setCRMStatusUI(status) {{
      const buttons = {{
        pending: document.getElementById('status-btn-pending'),
        contacted: document.getElementById('status-btn-contacted'),
        interested: document.getElementById('status-btn-interested'),
        rejected: document.getElementById('status-btn-rejected')
      }};
      Object.keys(buttons).forEach(k => {{
        if (k === status) buttons[k].classList.add('ring-2', 'ring-white');
        else buttons[k].classList.remove('ring-2', 'ring-white');
      }});
    }}

    function saveCurrentNotes() {{
      if (!currentSelectedId) return;
      const notes = document.getElementById('crm-notes-input').value;
      if (!crmData[currentSelectedId]) crmData[currentSelectedId] = {{ status: 'pending', notes: '' }};
      crmData[currentSelectedId].notes = notes;
      localStorage.setItem('ear_crm_notes', JSON.stringify(crmData));
      const ind = document.getElementById('crm-saved-indicator');
      ind.classList.remove('hidden');
      setTimeout(() => ind.classList.add('hidden'), 2000);
    }}

    function updateGlobalMetrics() {{
      document.getElementById('stat-total').textContent = rawProviders.length;
      let contacted = 0, interested = 0;
      Object.values(crmData).forEach(v => {{
        if (v.status === 'contacted') contacted++;
        if (v.status === 'interested') interested++;
      }});
      document.getElementById('stat-contacted').textContent = contacted;
      document.getElementById('stat-interested').textContent = interested;
    }}

    function exportCRMData() {{
      let csv = "ID;Nombre;Categoria;Provincia;Telefono;FichaURL;Estado;Notas\\n";
      rawProviders.forEach(p => {{
        const record = crmData[p.id];
        if (record && (record.status !== 'pending' || record.notes)) {{
          const cleanNotes = (record.notes || '').replace(/\\n/g, ' ').replace(/;/g, ',');
          csv += `"${{p.id}}";"${{p.name}}";"${{p.cat}}";"${{p.prov}}";"${{p.phone}}";"${{p.profile_url}}";"${{record.status}}";"${{cleanNotes}}"\\n`;
        }}
      }});
      const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8;' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EAR_CRM_GESTION_${{new Date().toISOString().slice(0, 10)}}.csv`;
      a.click();
    }}
  </script>
</body>
</html>
"""

    with open(output_html_path, "w", encoding="utf-8") as out:
        out.write(html)

    dt = time.time() - t0
    print(f"Deck Nacional Completo generado en {output_html_path} ({len(html)/1024/1024:.2f} MB) en {dt:.2f}s")

if __name__ == '__main__':
    generate_full_deck()
