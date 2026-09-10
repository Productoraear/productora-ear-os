# CONTEXTO CEREBRAL EAR (INSTRUCCIONES NOTEBOOKLM)

Este documento define cómo configurar y operar NotebookLM para que actúe como el "Cerebro de Contenidos" de EAR.

## 1. Configuración de Fuente (NotebookLM)

Crea un nuevo cuaderno llamado **"EAR TEJIDO NEURAL"**.
Sube las siguientes fuentes desde la carpeta `EAR_VAULT` de este repo:

1.  `EAR_VAULT/INPUT/ok MVP de Productora Ear Bodas .md` (La Biblia del producto MVP).
2.  `docs/productora-ear-capacidades-globales.md` (Visión y Tono).
3.  `ASTRA_BUSINESS_MODEL.md` (Estructura de precios y tiers).
4.  `EAR_PRODUCT_DEFINITION.md` (Arquitectura Neural).

## 2. Ingeniería de Prompts (Copiar y Pegar)

Usa estos prompts exactos para extraer contenido listo para la web.

### PROMPT A: Generar Contenido para /bodas (Estilo Bodas.net pero Tono EAR)

> "Actuando como el Arquitecto de EAR, genera un objeto JSON con la estructura para la página de aterrizaje de Bodas. Necesito las siguientes secciones basadas en el 'MVP de Productora Ear Bodas' y el tono de 'Capacidades Globales':
>
> 1.  **Hero:** Título impactante y Subtítulo que hable de 'Cero Incertidumbre' y 'Diseño Sonoro', no de 'música bonita'.
> 2.  **ValueProps:** 3 puntos clave (ej. Auditoría, Sin Intermediarios, Contratos Blindados).
> 3.  **Services:** Lista de servicios principales (Ceremonia, Cocktail, Fiesta) con descripciones técnicas breves.
> 4.  **FAQ:** 5 preguntas frecuentes extraídas del documento MVP (temas de pagos, cancelación, equipo técnico).
>
> El formato de salida debe ser JSON puro, claves en inglés, textos en Español (España) con anglicismos técnicos entre paréntesis."

### PROMPT B: Generar Manifiesto para /the-signal (Talento)

> "Analiza el modelo de negocio ASTRA y el perfil del 'Músico' en el documento MVP. Genera el texto para la landing 'The Signal' dirigida a captar talento de élite.
>
> Estructura JSON:
> 1.  **Manifesto:** Un párrafo inspirador sobre por qué unirse a la élite.
> 2.  **Benefits:** 4 beneficios tangibles (ej. Pagos Garantizados, Rider Técnico, Booking Automático).
> 3.  **Tiers:** Descripción breve de los niveles Semilla, Impulso, Icono.
> 4.  **CTA:** Texto para el botón de aplicar."

## 3. Integración Técnica

Una vez NotebookLM genere el JSON:
1.  Valida que el JSON sea válido (sin texto antes/después).
2.  Pégalo en `src/data/content/[seccion]-manifest.ts`.
3.  La web se actualizará instantáneamente.
