# 🗺️ IMPERIO EAR: MAPA ESTRUCTURAL SOBERANO

Este documento es la brújula del Comandante. Aquí reside la topografía del EAR OS V2 y la función de cada uno de sus órganos vitales.

---

## 1. 🌳 ÁRBOL DE DIRECTORIOS (ESTRUCTURA S-CLASS)

```text
c:\EAR_OS_V2
├── 📁 data_vault           # Bóveda de archivos históricos y memoria Omega (60MB JSON).
├── 📁 scripts              # Motores de ejecución autónoma e ingesta masiva.
│   └── 📁 vampire_scrapers # Flota de extracción de inteligencia de competidores.
├── 📁 sync_nexus           # Mesa de reuniones de IAs (Protocolo Nexus Handoff).
├── 📁 supabase             # Definiciones de la base de datos vectorial (RAG).
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 api          # Red neuronal de endpoints (Astra, Hunter, RAG, Payments).
│   │   └── 📁 dashboard    # El Centro de Mando principal (Aura Onyx).
│   ├── 📁 components       # Piezas atómicas de la interfaz Glassmorphism.
│   ├── 📁 lib              # Núcleo lógico y servicios de bajo nivel.
│   │   ├── 📁 constants    # SClassNexus: Identidad y protocolos.
│   │   ├── 📁 intelligence # Motores de decisión (Opal, Apalancamiento).
│   │   ├── 📁 services     # Servicios híbridos (Ghost Hunter, Vampire, Astra).
│   │   └── 📁 utils        # AstraCore: Cerebro neural desacoplado.
│   └── 📁 modules
│       └── 📁 SClassScreens # Pantallas de alto nivel y Paneles del Centro de Mando.
│           ├── 📁 components # Micro-módulos (BucleAprendizaje, MotorTactico).
│           └── 📁 panels     # Los 30+ paneles tácticos (AstraBrain, HunterPanel, etc.).
└── 📄 .env.local           # El archivo de secretos y coordenadas de poder.
```

---

## 2. 📖 DICCIONARIO DE ÓRGANOS

| Órgano | Función Soberana |
| :--- | :--- |
| `/api/hunter` | El sistema que espía y vampiriza a la competencia en tiempo real. |
| `/api/astra` | El canal de comunicación con el cerebro Gemini 1.5 Pro. |
| `/lib/engines/VimumeEngine` | Reactor de Impacto Cognitivo y protocolos 40Hz. |
| `/lib/utils/AstraCore` | El cerebro de procesamiento neural y storyselling. |
| `/lib/constants/SClassNexus` | La ley de diseño y protocolos Aura Onyx. |
| `/sync_nexus/` | Puente de comunicación Architect-Designer (Nexus Handoff). |
| `data_vault/` | El archivo muerto donde reside el conocimiento de las 5 sessiones previas. |

---

## 3. 🚦 ESTADO DE LOS 6 PASOS (RECONSTRUCCIÓN FÉNIX)

- [x] **PASO 1: Cimientos Aura Onyx** (Dashboard base y estética S-Class).
- [x] **PASO 2: Cazador Fantasma & RAG** (Extracción de competencia e IA con memoria).
- [x] **PASO 3: Unificación Transaccional & VIMUME** (Stripe & Reactor Clínico activado).
- [x] **PASO 4: Motor de Eventos & Booking** (Despliegue visual de paneles Astra/Vimume).
- [ ] **PASO 5: Dashboard de Expansión** (CRM y Automatización de Ventas).
- [ ] **PASO 6: Auditoría & Blindaje** (Optimización final y seguridad).

---

## 4. 🚨 GUÍA DE EMERGENCIA (COMANDOS TÁCTICOS)

Si el sistema se detiene o el Centro de Mando no responde:

1. **Reiniciar el Motor Visual:**
   `npm run dev` (Inicia el servidor en el puerto 3007).
2. **Re-inyectar Inteligencia (Si Astra olvida):**
   `node scripts/rag_injector_omega.js`
3. **Limpieza de Caché Crítica:**
   `rm -rf .next` (Solo si hay errores visuales persistentes).
4. **Estado de la Base de Datos:**
   Revisar el panel de Supabase para confirmar que el `vector_store` está activo.

---
*Documento generado por Antigravity bajo el Protocolo de Gobernanza Soberana.*
