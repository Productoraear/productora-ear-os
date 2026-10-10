# EAR OS — MOTOR GÉNESIS DE LANDINGS: LAS 100 PREGUNTAS SEMÁNTICAS
### Doctrina pSEO Anti-Loro · Estratos de Intención Cruzada ≤10% · Dato Verificado Universal
> Vanguardia 2025 · S-Class · Protocolo Omega (AGENTS.md §4bis, §8, §9)

---

## 0. RESPUESTA DIRECTA A TU PRIMERA PREGUNTA
> *"Aplico esta regla (precio SSOT + características públicas + HTMLs de origen) para TODO el sistema?"*

**SÍ. Es la `DOCTRINA DEL DATO VERIFICADO / CERO FACHADAS` y es universal (AGENTS.md §4bis y §8).** No es una regla de una vista, es la ley del repo. Concretamente se traduce en 5 invariantes no negociables para **cada** superficie (proveedores, fincas, artistas, B2G, VIMUME, landings pSEO, edge partitions):

| # | Invariante | Regla dura |
|---|-----------|-----------|
| 1 | **Precio único** | Todo precio nace EXCLUSIVAMENTE del `ear-os-ssot.ts`. Cero `"A consultar"`, cero arrays hardcodeados en motores de dinero. |
| 2 | **Hecho = dato público** | Todo atributo del proveedor (servicio, capacidad, zona, teléfono) se deriva de sus **características públicas + `raw_html` / `scraped_content` de origen**. Si no está en el origen, NO se inventa. |
| 3 | **`verified:true`** | SOLO con teléfono real verificable. Placeholder/centralita/vacío ⇒ `verified:false`. Prohibido re-hardcodear en daemons. |
| 4 | **Cero simulación** | Sin IA simulada, sin motores desconectados de Ollama 11434, sin "datos de relleno" en la ruta de venta. |
| 5 | **Trazabilidad** | Cada nodo comercial responde: *¿qué botón → qué endpoint → qué motor SSOT → qué escritura real?* |

**Matiz de implementación:** la regla es universal en *doctrina*, pero cada gremio instancia su propia **partición edge** (`public/data/providers/<gremio>.json`) con 0 placeholders, alimentada desde origen. Lo que cambia por gremio es el *cómo se extrae el dato público*; lo que NO cambia jamás es el *precio, el split 80/10/10 y el depósito de 100 €*.

---

## 1. FILOSOFÍA DEL MOTOR GÉNESIS (pSEO SIN LORO DIGITAL)
Cada lead que entra por una búsqueda (Google, Bing, IA conversacional) **trae consigo una intención única** (una fecha, una zona, un miedo, un presupuesto). El Motor Génesis **no** rellena una plantilla: **interroga a esa intención y le construye su propia landing**, que resuelve sus próximas dudas *antes* de que las formule.

**Regla anti-cannibalización (la prueba de que no somos un loro):**
> Dos URLs del sistema **jamás** compartirán > **10% de similitud textual**.

Definición técnica operativa (medible, no opinable):
- **Shingles de 5 palabras (5-gram)** sobre el texto plano de la landing.
- **Similitud de Jaccard** entre conjuntos de shingles **≤ 0,10**.
- **Similitud coseno TF-IDF** entre embeddings **≤ 0,10**.
- Si un slug nuevo supera 0,10 contra **cualquier** URL ya publicada ⇒ **se recircula/reescribe con otro estrato semántico** antes del build. Guardián: `scripts/audit_landing_duplication.cjs` (a construir).

**Principio del Cruce Semántico a 100 niveles:** las preguntas no se responden en serie, se **cruzan en estrella**. La respuesta a la Q37 (presupuesto) se re-hila con la Q63 (garantía) y la Q88 (comparativa), de modo que la landing resultante es un *grafo de intención*, no un párrafo repetido. Cada cruce nuevo = combinación única = URL única para el buscador.

---

## 2. LA MATRIZ DE LAS 100 PREGUNTAS (10 DIMENSIONES × 10 ESTRATOS)
> Cada lead activa un subconjunto; el Motor Génesis compone la landing respondiendo a esas preguntas **desde sus datos públicos + SSOT**. Ninguna landing responde las 100 igual; el orden, los ejemplos y los cruces son únicos.

### DIMENSIÓN 1 — IDENTIDAD Y CONTEXTO DEL LEAD (Q1–Q10) · *¿Quién es y qué temperatura tiene?*
1. ¿Es novio/a que organiza su propia boda, familiar, wedding planner o empresa?
2. ¿Está en fase Frío (explorando), Tibio (comparando) o Caliente (fecha decidida)?
3. ¿Ya tiene espacio reservado o busca finca + artista juntos?
4. ¿Escribe desde móvil (urgencia/impulso) o desde desktop (investigación)?
5. ¿Qué emoción domina su entrada: ilusión, ansiedad de plazo o miedo al sobrecoste?
6. ¿Es su primera boda (necesita educación) o repite (necesita velocidad)?
7. ¿Viene de una recomendación de otra pareja/empresa o de búsqueda orgánica?
8. ¿Se identifica con una estética (clásica, rural, moderna, gala, festiva)?
9. ¿Qué idioma/registro usa (es-latam, es-castellano, corporativo B2B)?
10. ¿Busca resolver solo la música, solo el espacio, o la producción integral (Uber del evento)?

### DIMENSIÓN 2 — EVENTO, FECHA Y ESCASEZ (Q11–Q20) · *¿Cuándo y qué celebra?*
11. ¿Tipo de evento: boda, comunión, cumpleaños, corporativo, festejo popular, residencia senior?
12. ¿Fecha exacta o rango aproximado?
13. ¿Es temporada alta (mayo–oct–sábados) o temporada baja (lun–jue, nov–mar)?
14. ¿Cuántos minutos/horas exactos necesita al artista solista (pases de 30 min)?
15. ¿Hora de inicio y **hora de fin** (condiciona el suplemento hotel ≥ 3:00 AM)?
16. ¿Es en fin de semana, puente o hay festivo local?
17. ¿Cuántos invitados / PAX previstos (condiciona 12 W/pax y aforo)?
18. ¿Es ceremonia + cóctel + banquete + fiesta, o solo una fase?
19. ¿Requiere dos pases (ceremonia íntima + fiesta) o un pase único?
20. ¿Hay un plan B meteorológico / espacio interior alternativo?

### DIMENSIÓN 3 — ESPACIO, ZONA Y LOGÍSTICA (Q21–Q30) · *¿Dónde y a qué distancia?*
21. ¿Provincia/municipio exacto del evento?
22. ¿Es Méntrida / base Edwin Agudelo (origen Hub) o red nacional por GPS?
23. ¿Distancia real por GPS desde la dirección fiscal del proveedor al evento (regla SSOT km 50)?
24. ¿Supera los 200 km (activa suplemento hotel)?
25. ¿El espacio es exterior (85–90 dBA), interior (80–85) o plaza/festejo (90–102)?
26. ¿Es finca privada con licencia de ruido, salón de hotel o edificio protegido?
27. ¿Hay acometida eléctrica 220V ≥ 3.000W para el rider técnico?
28. ¿Dispone de parking / acceso para furgoneta técnica y autocares?
29. ¿El espacio es propiedad de un proveedor homologado ya en el Edge, o externo?
30. ¿Necesita montaje/desmontaje y a qué hora puede acceder?

### DIMENSIÓN 4 — INVERSIÓN Y TRANSPARENCIA (Q31–Q40) · *El dinero, sin trampas*
31. ¿Cuál es su techo de presupuesto para música (base SSOT 350 €)?
32. ¿Entiende que el precio es fijo desde SSOT y no negociable a la baja?
33. ¿Pregunta "cuánto cuesta todo" (integra la logística 1,50 €/km > km 50)?
34. ¿Necesita el desglose completo (base + logística + hotel + split 80/10/10)?
35. ¿Le preocupan los sobrecostes ocultos de última hora?
36. ¿Busca factura con IVA / empresa o persona física?
37. ¿Es B2G (< 14.250 € Art. 118 LCSP) o B2B corporativo?
38. ¿Le atrae el modelo sin cuotas fijas (0 €/mes vs 150 €/mes de portales)?
39. ¿Quiere deducción fiscal (Ley 49/2002: 80% IRPF / 40–50% IS vía VIMUME)?
40. ¿Prefiere pago único, señal + liquidación, o financiación del depósito?

### DIMENSIÓN 5 — ACÚSTICA Y LEGALIDAD (Q41–Q50) · *El miedo #1 en eventos: el ruido*
41. ¿Conoce la Ley 37/2003 del Ruido y sus límites por contexto?
42. ¿La finca tiene limitador telemático homologado?
43. ¿Hay restricción horaria municipal de sonido?
44. ¿Vecinos próximos / zona residencial sensible?
45. ¿Sabe qué son los 65–75 dBA del Protocolo VIMUME (40 Hz) para mayores?
46. ¿Necesita certificado/sonometría para la licencia del espacio?
47. ¿Requirió el artista un rider acústico por contexto (festejo/boda/solista)?
48. ¿Le preocupa que la fiesta se corte por exceso de decibelios?
49. ¿Quiere equipo de sonido propio o alquiler homologado S-Class?
50. ¿Necesita pantallas LED / iluminación ligada a la acústica (paquete sonido+luces)?

### DIMENSIÓN 6 — MÚSICA, REPERTORIO Y ARTISTA (Q51–Q60) · *El deseo estético*
51. ¿Qué géneros/estilos quiere (bolero, mariachi, cuarteto de cuerdas, DJ, banda)?
52. ¿Quiere canción personalizada / primera canción a medida?
53. ¿Necesita ramo de flores en vivo o detalles simbólicos (show Edwin)?
54. ¿Busca artista solo instrumental de fondo (cóctel) o show protagonista?
55. ¿Quiere que los invitados interactúen (animación, karaoke, baile)?
56. ¿Qué referencias musicales tiene (spotify list, artistas favoritos)?
57. ¿Necesita repertorio multilingüe o litúrgico específico?
58. ¿Quiere fotógrafo/videógrafo 4K integrado en el pack?
59. ¿Le importa la estética física del equipo (Bose F1, minimal, OLED)?
60. ¿Quiere sesión de fotos con sombreros temáticos (sello Edwin Agudelo)?

### DIMENSIÓN 7 — CONFIANZA, GARANTÍA Y BLINDAJE (Q61–Q70) · *El ancla emocional*
61. ¿Teme que el proveedor no aparezca o cancele en el último momento?
62. ¿Quiere una garantía por escrito (seguro RC 1.000.000 €)?
63. ¿Necesita prueba de que la fecha queda bloqueada de forma inmutable?
64. ¿Entiende el depósito de 100 € Stripe Price-Lock (SHA-256) como blindaje, no como coste?
65. ¿Le tranquiliza que los 100 € sean 100% deducibles del total?
66. ¿Quiere ver reseñas verificadas de eventos ya ejecutados por EAR OS?
67. ¿Necesita hablar con una persona (centralita +34 693 693 048) antes de pagar?
68. ¿Prefiere la Ruta Libre (WhatsApp, asesoría rápida) o la Ruta Blindaje VIP?
69. ¿Firma contrato digital con cláusula RGPD de imagen?
70. ¿Quiere trazabilidad del estado de su reserva (procesando / bloqueada / confirmada)?

### DIMENSIÓN 8 — MIEDOS, OBJECIONES Y FRICCIONES (Q71–Q80) · *Lo que NO dice pero piensa*
71. "¿Y si encuentro algo más barato después?" (ancla de valor vs. riesgo).
72. "¿Y si no me gusta en directo?" (vídeo/samples/audiciones).
73. "¿Puedo cancelar?" (política de cancelación + retención del depósito).
74. "¿Y si llueve / cambia la fecha?" (reprogramación con Price-Lock).
75. "¿Por qué 100 € por adelantado?" (filtro anti-mirón, protección del artista).
76. "¿Es seguro pagar con tarjeta aquí?" (Stripe, PCI, SSL).
77. "¿Quién responde si algo falla?" (centralita única, SLA S-Class).
78. "¿Me van a llamar mil vendedores?" (modelo desintermediado, sin spam).
79. "¿Esto no es pagar por adelantado a un desconocido?" (blindaje legal + seguro).
80. "¿Y si mi espacio no permite el volumen que quiero?" (rider acústico por contexto).

### DIMENSIÓN 9 — COMPARATIVA Y ALTERNATIVAS (Q81–Q90) · *¿Por qué EAR OS y no el portal de siempre?*
81. ¿Por qué no contratar directamente al músico por Instagram?
82. ¿En qué se diferencia de los portales de directorio tradicionales?
83. ¿Qué gano con el Split 80/10/10 (para el proveedor)?
84. ¿Qué gano como cliente con el modelo Uber/Airbnb/Tinder de EAR OS?
85. ¿Cuánto ahorro vs. agencia tradicional (comisiones del 20–30%)?
86. ¿Qué pasa si el proveedor externo no está homologado en el Edge?
87. ¿Puedo comparar varios proveedores en la misma pantalla?
88. ¿Por qué el precio no lleva "consultar" (transparencia total)?
89. ¿Qué respaldo tiene EAR OS (incubadora, RSC, SROI 4,85x)?
90. ¿Cómo sé que el dato del proveedor es real y no inventado (0 fachadas)?

### DIMENSIÓN 10 — ACCIÓN, CIERRE Y POST-VENTA (Q91–Q100) · *El momento de la verdad*
91. ¿Cuál es el siguiente paso exacto ahora mismo (bloquear fecha)?
92. ¿Cómo se paga el depósito de 100 € (Stripe, en 1 clic)?
93. ¿Qué recibo/documento obtengo tras pagar?
94. ¿Cuándo se me asigna el artista/proveedor definitivo?
95. ¿Recibiré confirmación por WhatsApp/email automática (n8n)?
96. ¿Cómo contacto el día del evento (tracking GPS/ETA Uber)?
97. ¿Qué debo prepararme yo (rider, horarios, accesos)?
98. ¿Cómo se liquida el resto (calendario de pagos, split)?
99. ¿Puedo dejar reseña verificada tras el evento?
100. ¿Qué pasa después (VIMUME, informe de impacto, fidelización, siguiente evento)?

---

## 3. ARQUITECTURA DEL MOTOR GÉNESIS (la autopista de código)
```
[Intención de búsqueda]  ──►  Clasificador de Estratos (Q1–Q100)
        │                              │
        │                              ▼
        │                    Selección de subconjunto activo
        │                              │
        ▼                              ▼
[Datos públicos + raw_html] ──►  Composición cruzada en estrella
        │                              │
        │                              ▼
   [SSOT único]  ───────────►  Landing única (grafo de intención)
                                       │
                                       ▼
                        Guardián Anti-Duplicación (Jaccard/TF-IDF ≤ 0,10)
                                       │
                            ┌──────────┴──────────┐
                         ≤0,10                  >0,10
                            │                     │
                        Publicar            Re-circulación semántica
```

**Cerrojos (según §2 Doctrina del Andamio):**
1. Rutas exactas: `src/app/(public)/.../[slug]/page.tsx` + `scripts/build_landing_genesis.*` + `scripts/audit_landing_duplication.cjs`.
2. Firma del compositor tipado (cero `any`): `composeLanding(intent: LeadIntent, provider: PublicOriginData): LandingPayload`.
3. Validación obligatoria: `node scripts/audit_landing_duplication.cjs` debe devolver **max(Jaccard) ≤ 0,10**.
4. Done atómico: `npx tsc --noEmit` → Exit 0 **y** duplicación ≤ 10%.
5. Único salvavidas: `tsc` Exit 0.

---

## 4. LO QUE NECESITO QUE DECIDAS (preguntas para cerrar el diseño)
> Respondo solo a lo que tú pides; estas son las incógnitas que bloquean el build del Motor Génesis:

1. **Umbral de duplicación**: ¿confirmas **≤ 10%** como Jaccard de 5-gram (estricto) o lo relajas a 15% para gremios de bajo contenido en origen?
2. **Granularidad de URL**: ¿la landing nace por **(intención × zona)** o por **(intención × proveedor)**? (Recomiendo: intención×zona para pSEO masivo + proveedor para marca).
3. **Fuente de hechos**: ¿el `raw_html` de origen es la única fuente (extracción Ollama) o permitimos fichas curadas a mano para top-fincas?
4. **Autoridad de publicación**: ¿el motor publica directo o requiere un **stage de revisión** antes de exponer `verified`?
5. **Alcance inicial**: ¿arrancamos con 1 gremio piloto (fincas o música) antes de escalar a todo el Edge?

---

## 5. PRÓXIMO RETO RECOMENDADO (por orden de impacto en dinero)
Tras el barrido forense, tu próximo reto **NO** es más pSEO — es **SEGURIDAD**, y lo digo con una prueba, no con una opinión:

> 🔴 **P0 ENCONTRADO AHORA MISMO:** `src/app/(public)/proveedores/[slug]/page.tsx` (líneas ~811–815) renderiza HTML de terceros con
> `dangerouslySetInnerHTML={{ __html: cleanText(rawProvider.raw_html || rawProvider.scraped_content) }}`.
> `cleanText` solo corrige tildes; **no sanitiza**. Multiplicar esto por miles de landings del Motor Génesis = **multiplicar un vector XSS por miles**. Es una bomba de relojería en la ruta que genera dinero.

**Ladder recomendado:**
| Prioridad | Reto | Por qué ahora |
|-----------|------|---------------|
| **P0** | **SEGURIDAD — Blindaje anti-XSS del HTML de origen** (`sanitize-html`/`DOMPurify` en servidor + allowlist de tags) | Bloquea que el Motor Génesis escale una vulnerabilidad real. Sin esto, cada landing nueva = una puerta abierta. |
| **P1** | **Motor Génesis + Guardián Anti-Duplicación (≤10%)** | Convierte tu pregunta en sistema que capta leads sin canibalizar SEO. |
| **P2** | **UX/UI & Diseño OLED S-Class** de la plantilla de landing (micro-animaciones, grafo de intención navegable) | La interfaz que convierte la intención en depósito de 100 €. |
| **P3** | **Telemetría n8n** de qué estrato (de los 100) convierte más | Optimización basada en datos reales. |

**Recomendación final:** cerramos primero el **RETO SEGURIDAD (P0)** porque el Motor Génesis va a *industrializar* ese renderizado, y luego lanzamos el **Motor Génesis anti-loro**. Diseño y UI se decoran **después** de blindar; blindar se hace **antes** de escalar.

---
*Documento estratégico S-Class · EAR OS · Generado bajo Doctrina del Dato Verificado (Cero Fachadas).*
