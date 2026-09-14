import json
import glob
import os

def generate_call_center():
    providers = []
    seen = set()

    # 1. Edwin Agudelo SSOT
    edwin = {
        'id': 'prov-ear-sovereign-01',
        'name': 'Productora EAR — Edwin Agudelo',
        'slug': 'edwin-agudelo',
        'category': 'Música',
        'province': 'Madrid',
        'city': 'Méntrida / Madrid',
        'price': '350 €',
        'rating': 5.0,
        'reviews': 128,
        'phone': '+34 693 693 048',
        'description': 'Show musical en directo para bodas y eventos VIP. Solista S-Class con sonido Bose F1 812 y microfonía Shure Beta 87A.',
        'img': 'https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg'
    }
    providers.append(edwin)
    seen.add(edwin['id'])
    seen.add(edwin['phone'])

    # 2. Curated Partitions
    for f in sorted(glob.glob('public/data/providers/*.json')):
        if 'manifest' in f or 'all_featured' in f:
            continue
        cat_name = os.path.basename(f).replace('.json', '').capitalize()
        try:
            data = json.load(open(f, encoding='utf-8', errors='ignore'))
            for p in data:
                phone = (p.get('phone') or p.get('telephone') or p.get('contactPhone') or '').strip()
                name = (p.get('name') or '').strip()
                pid = p.get('id') or p.get('slug') or name
                if not name or not phone or pid in seen:
                    continue
                seen.add(pid)
                providers.append({
                    'id': str(pid),
                    'name': name,
                    'slug': p.get('slug', ''),
                    'category': p.get('category', cat_name).capitalize(),
                    'province': p.get('province', 'España') or 'España',
                    'city': p.get('municipality', '') or p.get('province', 'España') or 'España',
                    'price': str(p.get('price', '') or p.get('basePrice', '') or 'Consultar'),
                    'rating': float(p.get('rating', 5.0) or 5.0),
                    'reviews': int(p.get('reviews', 0) or 0),
                    'phone': phone,
                    'description': (p.get('description', '') or p.get('description_full', '') or '')[:200].replace('\n', ' ').strip(),
                    'img': p.get('img', '')
                })
        except Exception as e:
            pass

    print(f"Total curated providers packed: {len(providers)}")
    providers_json = json.dumps(providers, ensure_ascii=False)

    html_content = f"""<!DOCTYPE html>
<html lang="es" class="h-full bg-[#030712] text-slate-100">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EAR OS :: Deck de Prospección & Telemarketing de Proveedores</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&family=Syne:wght@700;800&display=swap" rel="stylesheet">
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
          <span class="font-heading font-bold text-white text-lg tracking-wide">OUTBOUND CALL CENTER</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE CRM</span>
        </div>
        <p class="text-xs text-slate-400">Productora EAR :: Sistema de Captación, Negociación & Cierre de Proveedores</p>
      </div>
    </div>

    <!-- METRICS STRIP -->
    <div class="flex items-center gap-4 text-xs font-mono">
      <div class="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-2">
        <span class="text-slate-400">Base Cargada:</span>
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
      <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 font-sans">
        <span>📂 Cargar Master JSON</span>
        <input type="file" id="json-file-input" accept=".json" class="hidden">
      </label>
      <button onclick="exportCRMData()" class="bg-red-600 hover:bg-red-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shadow-lg shadow-red-900/30">
        <span>📥 Exportar Notas CSV</span>
      </button>
    </div>
  </header>

  <!-- MAIN WORKSPACE: SPLIT SCREEN -->
  <div class="flex-1 flex overflow-hidden">

    <!-- LEFT COLUMN: FILTER & DIRECTORY LIST (45% WIDTH) -->
    <aside class="w-[45%] max-w-2xl border-r border-slate-800/80 flex flex-col bg-[#040817] shrink-0">
      
      <!-- SEARCH & FILTER TOOLBAR -->
      <div class="p-4 border-b border-slate-800/80 space-y-3 bg-[#060c1e]/60">
        <!-- Search Bar -->
        <div class="relative">
          <input 
            type="text" 
            id="search-box" 
            placeholder="Buscar por nombre, municipio, teléfono o especialidad..."
            class="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            oninput="applyFilters()"
          >
          <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Filter Row -->
        <div class="grid grid-cols-3 gap-2 text-xs">
          <!-- Category Filter -->
          <select id="filter-category" onchange="applyFilters()" class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-red-500">
            <option value="">Todos los Gremios</option>
          </select>

          <!-- Province Filter -->
          <select id="filter-province" onchange="applyFilters()" class="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-red-500">
            <option value="">Todas las Provincias</option>
          </select>

          <!-- Status Filter -->
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

      <!-- PROVIDER CARDS SCROLLABLE CONTAINER -->
      <div id="providers-list" class="flex-1 overflow-y-auto p-3 space-y-2">
        <!-- Injected via JS -->
      </div>
    </aside>

    <!-- RIGHT COLUMN: CALL DECK, PITCH & CRM (55% WIDTH) -->
    <main class="flex-1 flex flex-col bg-[#030712] overflow-y-auto">
      
      <!-- EMPTY STATE IF NONE SELECTED -->
      <div id="deck-empty" class="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
        <div class="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </div>
        <h3 class="font-heading text-lg font-bold text-slate-300 mb-1">Selecciona un Proveedor del Directorio</h3>
        <p class="text-xs text-slate-500 max-w-sm">Haz clic en cualquier proveedor a la izquierda para cargar su ficha, su teléfono directo, el guion de negociación y las acciones rápidas.</p>
      </div>

      <!-- ACTIVE DECK -->
      <div id="deck-active" class="hidden flex-1 flex flex-col">
        
        <!-- VENDOR PROFILE HERO HEADER -->
        <div class="p-6 border-b border-slate-800/80 bg-gradient-to-b from-[#0a1329] to-[#040817]">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span id="deck-category" class="px-2 py-0.5 rounded text-xs font-semibold bg-red-950/80 text-red-400 border border-red-800/50">Música</span>
                <span id="deck-province" class="text-xs font-mono text-slate-400">Madrid</span>
                <span id="deck-rating-badge" class="px-2 py-0.5 rounded text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">★ 5.0 (128 rev)</span>
              </div>
              <h2 id="deck-name" class="font-heading text-2xl font-black text-white">Nombre del Proveedor</h2>
              <p id="deck-description" class="text-xs text-slate-300 line-clamp-2 max-w-2xl"></p>
            </div>

            <!-- PRICE PILL -->
            <div class="text-right shrink-0">
              <div class="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Tarifa Referencia</div>
              <div id="deck-price" class="text-xl font-heading font-black text-emerald-400">350 €</div>
            </div>
          </div>

          <!-- ACTION BUTTONS BAR -->
          <div class="mt-6 flex items-center gap-3">
            <!-- Call Button -->
            <a id="btn-call" href="#" class="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-950/50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              <span id="deck-phone-label">Llamar (+34...)</span>
            </a>

            <!-- WhatsApp Direct -->
            <a id="btn-whatsapp" href="#" target="_blank" class="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg shadow-green-950/50 transition">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
              </svg>
              <span>Enviar WhatsApp</span>
            </a>

            <!-- Copy Phone -->
            <button onclick="copyCurrentPhone()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs px-4 py-3 rounded-xl border border-slate-700 transition flex items-center gap-1.5">
              <span>📋 Copiar</span>
            </button>
          </div>
        </div>

        <!-- TABS BAR: PITCH SCRIPT / WHATSAPP / OBJECTIONS / CRM -->
        <div class="flex border-b border-slate-800 bg-[#040914] px-6 text-xs font-semibold">
          <button onclick="switchTab('tab-pitch')" id="tab-btn-pitch" class="py-3 px-4 border-b-2 border-red-500 text-white flex items-center gap-1.5 transition">
            🎙️ Guion Telefónico (Pitch)
          </button>
          <button onclick="switchTab('tab-wa')" id="tab-btn-wa" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            💬 Plantilla WhatsApp
          </button>
          <button onclick="switchTab('tab-obj')" id="tab-btn-obj" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            🛡️ Respuestas a Objeciones
          </button>
          <button onclick="switchTab('tab-crm')" id="tab-btn-crm" class="py-3 px-4 border-b-2 border-transparent text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition">
            📝 Estado & Registro CRM
          </button>
        </div>

        <!-- TAB CONTENT CONTAINER -->
        <div class="p-6 flex-1 overflow-y-auto space-y-6">

          <!-- TAB 1: PHONE PITCH -->
          <div id="tab-pitch" class="space-y-4">
            <div class="bg-gradient-to-r from-red-950/30 to-slate-900 border border-red-900/30 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">Paso 1: Saludo de Autoridad & Halago</span>
                <span class="text-[10px] font-mono text-slate-500">Tono: Seguro, cercano y profesional</span>
              </div>
              <p class="text-sm text-slate-200 leading-relaxed font-sans">
                "Hola <strong id="pitch-name-1" class="text-white">...</strong>, buenos días/tardes. Te llamo de <strong>Productora EAR</strong> (la red nacional de eventos y bodas en España). Estábamos auditando los mejores profesionales de <strong id="pitch-cat-1" class="text-amber-300">...</strong> en <strong id="pitch-prov-1" class="text-amber-300">...</strong> y tu ficha destaca por tu excelente trayectoria y valoraciones. ¿Tienes 1 minuto rápido?"
              </p>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">Paso 2: La Propuesta de Valor (Antítesis de Bodas.net)</span>
              </div>
              <p class="text-sm text-slate-200 leading-relaxed">
                "Te llamo directo porque sabemos que portales como Bodas.net o páginas amarillas cobran <strong>cuotas mensuales abusivas de 100€ a 300€ al mes</strong>, contrates o no contrates. En <strong>Productora EAR</strong> no cobramos NINGUNA mensualidad fija. Cero euros. Te incluimos en nuestro catálogo nacional homologado y te derivamos clientes cerrados con contrato y depósito garantizado."
              </p>
            </div>

            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Paso 3: El Cierre Suave (Call to Action)</span>
              </div>
              <p class="text-sm text-slate-200 leading-relaxed">
                "Hemos pre-creado tu ficha de proveedor verificado en nuestro portal. ¿Te parece si te envío ahora mismo por WhatsApp el enlace oficial para que veas tus datos, pongas tu caché preferido y confirmemos que te activemos de forma gratuita?"
              </p>
            </div>

            <div class="flex items-center justify-end gap-3 pt-2">
              <button onclick="copyPitchText()" class="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg border border-slate-700 transition">
                📄 Copiar Guion Completo
              </button>
            </div>
          </div>

          <!-- TAB 2: WHATSAPP TEMPLATE -->
          <div id="tab-wa" class="hidden space-y-4">
            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-emerald-400">Mensaje Pre-Redactado para WhatsApp</span>
                <button onclick="copyWaText()" class="text-xs font-mono text-slate-400 hover:text-white bg-slate-800 px-3 py-1 rounded">Copiar Texto</button>
              </div>
              <textarea id="wa-text-area" rows="8" class="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"></textarea>
              <div class="flex justify-end">
                <a id="btn-open-wa-tab" href="#" target="_blank" class="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5">
                  <span>Abrir en WhatsApp Web</span> 🚀
                </a>
              </div>
            </div>
          </div>

          <!-- TAB 3: OBJECTIONS -->
          <div id="tab-obj" class="hidden space-y-3">
            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="font-bold text-xs text-red-400 mb-1">❌ "¿Esto es de pago? ¿Me vais a cobrar una cuota mensual?"</div>
              <div class="text-xs text-slate-300">✅ <strong>Respuesta:</strong> "Rotundamente no. A diferencia de otros portales, no creemos en las cuotas fijas mensuales. La activación en EAR OS es 100% gratuita. Solo cobramos una comisión de gestión cuando el evento se cierra formalmente y el cliente ha pagado el depósito."</div>
            </div>
            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="font-bold text-xs text-amber-400 mb-1">❌ "Ya tengo bastante trabajo / ya estoy en Bodas.net"</div>
              <div class="text-xs text-slate-300">✅ <strong>Respuesta:</strong> "Completamente entendible. Por eso no te pedimos que atiendas mensajes sueltos ni cotizaciones frías. Cuando te contactamos desde EAR OS es porque ya tenemos el presupuesto aceptado y la fecha confirmada para ti. Tú solo tienes que acudir y hacer tu show o servicio."</div>
            </div>
            <div class="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div class="font-bold text-xs text-blue-400 mb-1">❌ "¿Quién garantiza el cobro del evento?"</div>
              <div class="text-xs text-slate-300">✅ <strong>Respuesta:</strong> "Productora EAR utiliza pasarela bancaria Stripe con Price-Lock. El cliente abona el depósito antes del evento y queda protegido en contrato oficial B2B/B2C, garantizando tu liquidación puntual."</div>
            </div>
          </div>

          <!-- TAB 4: CRM TRACKING & NOTES -->
          <div id="tab-crm" class="hidden space-y-4">
            <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-mono font-bold text-slate-300">Estado de Prospección</span>
                <span id="crm-saved-indicator" class="text-[11px] font-mono text-emerald-400 hidden">✓ Guardado en memoria local</span>
              </div>
              
              <!-- Status Radio Group -->
              <div class="grid grid-cols-4 gap-2 text-xs font-semibold">
                <button onclick="setCRMStatus('pending')" id="status-btn-pending" class="py-2 px-3 rounded-lg border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 transition text-center">
                  ⚪ Pendiente
                </button>
                <button onclick="setCRMStatus('contacted')" id="status-btn-contacted" class="py-2 px-3 rounded-lg border border-amber-900/60 bg-amber-950/20 text-amber-300 hover:bg-amber-950/40 transition text-center">
                  🟡 En Conversación
                </button>
                <button onclick="setCRMStatus('interested')" id="status-btn-interested" class="py-2 px-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 transition text-center">
                  🟢 Interesado / Cerrado
                </button>
                <button onclick="setCRMStatus('rejected')" id="status-btn-rejected" class="py-2 px-3 rounded-lg border border-rose-900/60 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 transition text-center">
                  🔴 No Interesado
                </button>
              </div>

              <!-- Notes Box -->
              <div>
                <label class="block text-xs font-mono text-slate-400 mb-1">Notas de la llamada (Persona de contacto, caché acordado, fecha de llamada...):</label>
                <textarea 
                  id="crm-notes-input" 
                  rows="4" 
                  placeholder="Ej: Hablé con Juan (dueño). Muy interesado. Pide que le mande el WhatsApp y le llame el jueves por la tarde para validar datos..."
                  class="w-full bg-[#030712] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  oninput="saveCurrentNotes()"
                ></textarea>
              </div>
            </div>
          </div>

        </div>

      </div>

    </main>
  </div>

  <!-- EMBEDDED PROVIDERS DATA & LOGIC -->
  <script>
    let rawProviders = {providers_json};
    let crmData = JSON.parse(localStorage.getItem('ear_crm_notes') || '{{}}');
    let currentSelectedId = null;

    // Initialize UI
    window.addEventListener('DOMContentLoaded', () => {{
      populateFilters();
      applyFilters();
      updateGlobalMetrics();
    }});

    // Populate category & province selectors
    function populateFilters() {{
      const catSelect = document.getElementById('filter-category');
      const provSelect = document.getElementById('filter-province');
      
      const categories = new Set();
      const provinces = new Set();

      rawProviders.forEach(p => {{
        if (p.category) categories.add(p.category);
        if (p.province) provinces.add(p.province);
      }});

      Array.from(categories).sort().forEach(c => {{
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        catSelect.appendChild(opt);
      }});

      Array.from(provinces).sort().forEach(pr => {{
        const opt = document.createElement('option');
        opt.value = pr;
        opt.textContent = pr;
        provSelect.appendChild(opt);
      }});
    }}

    // Filter and Render
    function applyFilters() {{
      const search = document.getElementById('search-box').value.toLowerCase().trim();
      const cat = document.getElementById('filter-category').value;
      const prov = document.getElementById('filter-province').value;
      const statusFilter = document.getElementById('filter-status').value;

      const filtered = rawProviders.filter(p => {{
        const matchSearch = !search || 
          p.name.toLowerCase().includes(search) || 
          (p.city && p.city.toLowerCase().includes(search)) ||
          (p.province && p.province.toLowerCase().includes(search)) ||
          (p.phone && p.phone.includes(search)) ||
          (p.description && p.description.toLowerCase().includes(search));
        
        const matchCat = !cat || p.category === cat;
        const matchProv = !prov || p.province === prov;

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
        container.innerHTML = '<div class="text-center py-12 text-slate-500 text-xs">No se encontraron proveedores con los filtros seleccionados.</div>';
        return;
      }}

      // Slice top 200 for rendering performance
      const renderSlice = list.slice(0, 200);

      renderSlice.forEach(p => {{
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

        card.innerHTML = `
          <div class="space-y-1 flex-1 min-w-0">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs">${{statusBadge}}</span>
              <span class="font-heading font-bold text-sm text-white truncate">${{p.name}}</span>
              ${{p.id === 'prov-ear-sovereign-01' ? '<span class="text-[9px] bg-red-600 text-white font-mono px-1 rounded">SSOT</span>' : ''}}
            </div>
            <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span class="text-red-400">${{p.category}}</span>
              <span>•</span>
              <span>${{p.city || p.province}}</span>
              <span>•</span>
              <span class="text-emerald-400 font-semibold">${{p.price}}</span>
            </div>
            <div class="text-[11px] font-mono text-slate-300">
              📞 <span class="text-slate-100">${{p.phone}}</span>
            </div>
          </div>
          <div class="text-right shrink-0">
            <div class="text-xs font-mono text-amber-400 font-bold">★ ${{p.rating.toFixed(1)}}</div>
            <div class="text-[10px] font-mono text-slate-500">${{p.reviews}} rev</div>
          </div>
        `;

        container.appendChild(card);
      }});

      if (list.length > 200) {{
        const moreNotice = document.createElement('div');
        moreNotice.className = 'text-center py-2 text-slate-500 text-[11px] font-mono';
        moreNotice.textContent = `... y ${{list.length - 200}} más. Usa el buscador para afinar.`;
        container.appendChild(moreNotice);
      }}
    }}

    function selectProvider(p) {{
      currentSelectedId = p.id;
      
      // Update UI Header
      document.getElementById('deck-empty').classList.add('hidden');
      document.getElementById('deck-active').classList.remove('hidden');

      document.getElementById('deck-name').textContent = p.name;
      document.getElementById('deck-category').textContent = p.category;
      document.getElementById('deck-province').textContent = p.city || p.province;
      document.getElementById('deck-rating-badge').textContent = `★ ${{p.rating.toFixed(1)}} (${{p.reviews}} reviews)`;
      document.getElementById('deck-price').textContent = p.price;
      document.getElementById('deck-description').textContent = p.description || 'Proveedor verificado en red Productora EAR.';

      // Format Phone
      const cleanPhone = p.phone.replace(/[^0-9+]/g, '');
      const waNumber = cleanPhone.startsWith('+') ? cleanPhone.substring(1) : (cleanPhone.startsWith('34') ? cleanPhone : '34' + cleanPhone);

      // Buttons
      document.getElementById('btn-call').href = `tel:${{cleanPhone}}`;
      document.getElementById('deck-phone-label').textContent = `Llamar (${{p.phone}})`;

      // Pitch Variables
      document.getElementById('pitch-name-1').textContent = p.name;
      document.getElementById('pitch-cat-1').textContent = p.category;
      document.getElementById('pitch-prov-1').textContent = p.city || p.province;

      // WhatsApp Message
      const waMsg = `Hola ${{p.name}}, te contacto de Productora EAR (red de bodas y eventos en España). Estábamos revisando tu trabajo en ${{p.category}} (${{p.province}}) y nos gustaría invitarte a sumarte a nuestro catálogo nacional sin cuotas fijas mensuales ni permanencia. Te dejamos tu ficha de acceso para que puedas verificar tus tarifas: https://productoraear.com/proveedores?cat=${{encodeURIComponent(p.category.toLowerCase())}}&q=${{encodeURIComponent(p.name)}} . ¿Te parece bien que te llamemos para coordinar? Un saludo cordial.`;

      document.getElementById('wa-text-area').value = waMsg;
      const waUrl = `https://wa.me/${{waNumber}}?text=${{encodeURIComponent(waMsg)}}`;
      document.getElementById('btn-whatsapp').href = waUrl;
      document.getElementById('btn-open-wa-tab').href = waUrl;

      // Load CRM Data
      const crmRecord = crmData[p.id] || {{ status: 'pending', notes: '' }};
      setCRMStatusUI(crmRecord.status);
      document.getElementById('crm-notes-input').value = crmRecord.notes || '';

      // Re-render list to highlight active
      applyFilters();
    }}

    function switchTab(tabId) {{
      ['tab-pitch', 'tab-wa', 'tab-obj', 'tab-crm'].forEach(t => {{
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
        alert('Copiado al portapapeles: ' + p.phone);
      }}
    }}

    function copyPitchText() {{
      const text = `${{document.getElementById('tab-pitch').innerText}}`;
      navigator.clipboard.writeText(text);
      alert('Guion de llamada copiado al portapapeles.');
    }}

    function copyWaText() {{
      const text = document.getElementById('wa-text-area').value;
      navigator.clipboard.writeText(text);
      alert('Texto de WhatsApp copiado al portapapeles.');
    }}

    // CRM Actions
    function setCRMStatus(status) {{
      if (!currentSelectedId) return;
      if (!crmData[currentSelectedId]) crmData[currentSelectedId] = {{ status: 'pending', notes: '' }};
      crmData[currentSelectedId].status = status;
      localStorage.setItem('ear_crm_notes', JSON.stringify(crmData));
      setCRMStatusUI(status);
      updateGlobalMetrics();
      applyFilters();
      flashSaved();
    }}

    function setCRMStatusUI(status) {{
      const buttons = {{
        pending: document.getElementById('status-btn-pending'),
        contacted: document.getElementById('status-btn-contacted'),
        interested: document.getElementById('status-btn-interested'),
        rejected: document.getElementById('status-btn-rejected')
      }};
      Object.keys(buttons).forEach(k => {{
        if (k === status) {{
          buttons[k].classList.add('ring-2', 'ring-white');
        }} else {{
          buttons[k].classList.remove('ring-2', 'ring-white');
        }}
      }});
    }}

    function saveCurrentNotes() {{
      if (!currentSelectedId) return;
      const notes = document.getElementById('crm-notes-input').value;
      if (!crmData[currentSelectedId]) crmData[currentSelectedId] = {{ status: 'pending', notes: '' }};
      crmData[currentSelectedId].notes = notes;
      localStorage.setItem('ear_crm_notes', JSON.stringify(crmData));
      flashSaved();
    }}

    function flashSaved() {{
      const indicator = document.getElementById('crm-saved-indicator');
      indicator.classList.remove('hidden');
      setTimeout(() => indicator.classList.add('hidden'), 2000);
    }}

    function updateGlobalMetrics() {{
      document.getElementById('stat-total').textContent = rawProviders.length;
      let contacted = 0;
      let interested = 0;
      Object.values(crmData).forEach(v => {{
        if (v.status === 'contacted') contacted++;
        if (v.status === 'interested') interested++;
      }});
      document.getElementById('stat-contacted').textContent = contacted;
      document.getElementById('stat-interested').textContent = interested;
    }}

    // External JSON File Loader (Drag & Drop or Pick 74k file)
    document.getElementById('json-file-input').addEventListener('change', (e) => {{
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {{
        try {{
          const parsed = JSON.parse(event.target.result);
          if (Array.isArray(parsed)) {{
            rawProviders = parsed.map((p, idx) => ({{
              id: p.id || p.slug || 'prov-' + idx,
              name: p.name || 'Sin Nombre',
              slug: p.slug || '',
              category: (p.category || 'Varios').capitalize(),
              province: p.province || 'España',
              city: p.municipality || p.province || 'España',
              price: String(p.price || p.basePrice || 'Consultar'),
              rating: Number(p.rating || 5.0),
              reviews: Number(p.reviews || 0),
              phone: p.phone || p.telephone || p.contactPhone || '',
              description: (p.description || p.description_full || '').substring(0, 200),
              img: p.img || ''
            }}));
            populateFilters();
            applyFilters();
            updateGlobalMetrics();
            alert(`¡Base de datos cargada con éxito! Total proveedores: ${{rawProviders.length}}`);
          }}
        }} catch (err) {{
          alert('Error al leer el archivo JSON: ' + err.message);
        }}
      }};
      reader.readAsText(file);
    }});

    // Export Notes to CSV
    function exportCRMData() {{
      let csv = "ID;Nombre;Categoria;Provincia;Telefono;Estado;Notas\\n";
      rawProviders.forEach(p => {{
        const record = crmData[p.id];
        if (record && (record.status !== 'pending' || record.notes)) {{
          const cleanNotes = (record.notes || '').replace(/\\n/g, ' ').replace(/;/g, ',');
          csv += `"${{p.id}}";"${{p.name}}";"${{p.category}}";"${{p.province}}";"${{p.phone}}";"${{record.status}}";"${{cleanNotes}}"\\n`;
        }}
      }});
      const blob = new Blob([csv], {{ type: 'text/csv;charset=utf-8;' }});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EAR_CRM_NOTAS_${{new Date().toISOString().slice(0, 10)}}.csv`;
      a.click();
    }}
  </script>
</body>
</html>
"""

    output_path = "EAR_CALL_CENTER_PROVEEDORES.html"
    with open(output_path, "w", encoding="utf-8") as out:
        out.write(html_content)
    
    print(f"File successfully generated: {output_path} (Size: {len(html_content)/1024:.1f} KB)")

if __name__ == '__main__':
    generate_call_center()
