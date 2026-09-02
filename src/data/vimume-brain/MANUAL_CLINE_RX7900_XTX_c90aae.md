# CÓDICE CLINE: MANUAL DE EJECUCIÓN RX 7900 XTX
## DIRECTIVA OMEGA - EAR OS GOLD V2
**Proyecto:** productora-ear-backend | **Stack:** Next.js 16.2.4 + Firebase + Supabase + Stripe + Gemini
**Fecha:** 2026-04-28

---

## FASE 0: SCRIPT DE AUTO-AUDITORÍA GLOBAL
Ejecutar ANTES de cada fase:
```powershell
# audit_sclass.ps1 - Ejecutar desde raíz del proyecto
Write-Host "=== AUDITORÍA S-CLASS ===" -ForegroundColor Yellow
$checks = @(
  @("STRIPE_SECRET_KEY", "Stripe"),
  @("SUPABASE_URL", "Supabase"),
  @("FIREBASE_API_KEY", "Firebase"),
  @("GEMINI_API_KEY", "Gemini"),
  @("TELEGRAM_BOT_TOKEN", "Telegram"),
  @("HUNTER_API_KEY", "Hunter")
)
foreach ($c in $checks) {
  if (Select-String -Path .env.local -Pattern $c[0] -Quiet) {
    Write-Host "[OK] $($c[1])" -ForegroundColor Green
  } else {
    Write-Host "[FAIL] $($c[1]) - FALTA $($c[0]) en .env.local" -ForegroundColor Red
  }
}
Write-Host "=== TSC CHECK ===" -ForegroundColor Yellow
npx tsc --noEmit 2>&1 | Select-Object -Last 5
Write-Host "=== BUILD CHECK ===" -ForegroundColor Yellow
npm run build 2>&1 | Select-Object -Last 5
```

---

## FASE 1: RECONEXIÓN DEL SISTEMA NERVIOSO (Prompts 1-25)
*Restauración de pagos, analytics y SEO.*

### [PROMPT #1] - Instalar Stripe SDK
**Objetivo:** Añadir dependencia stripe al proyecto
**Comando de Auto-Auditoría previo:**
```powershell
npm list stripe 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npm install stripe. Verifica que se añade a package.json. NO abras navegador."

---

### [PROMPT #2] - Purificación payments.ts (Stripe Real)
**Objetivo:** Reemplazar stubs con Stripe SDK real
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/lib/payments.ts
```
**El Prompt exacto para Cline:**
> "Cline, reescribe src/lib/payments.ts COMPLETO. Importa Stripe del paquete stripe. Crea instancia con process.env.STRIPE_SECRET_KEY. Implementa createCheckoutSession(amount,concept,metadata) que llame stripe.checkout.sessions.create con line_items, success_url=https://productoraear.com/success, cancel_url=https://productoraear.com/cancel. Exporta la instancia stripe y la función. NO uses diff, archivo entero."

---

### [PROMPT #3] - API Route Stripe Real
**Objetivo:** Conectar /api/payments/create-session
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/app/api/payments/create-session/route.ts -Pattern "stripe.checkout"
```
**El Prompt exacto para Cline:**
> "Cline, reescribe src/app/api/payments/create-session/route.ts. Importa stripe de src/lib/payments. En POST handler, parsea body, llama createCheckoutSession, retorna session.url. Elimina TODA simulación."

---

### [PROMPT #4] - Webhook Stripe Endpoint
**Objetivo:** Crear validador de webhooks
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/app/api/payments/webhook/route.ts
```
**El Prompt exacto para Cline:**
> "Cline, crea src/app/api/payments/webhook/route.ts. Lee raw body con req.text(). Valida con stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET). En checkout.session.completed, registra en Firestore ear_orders con addDoc y serverTimestamp."

---

### [PROMPT #5] - PayPal Integración
**Objetivo:** Pasarela alternativa PayPal
**Comando de Auto-Auditoría previo:**
```powershell
npm list @paypal/checkout-server-sdk 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, instala @paypal/checkout-server-sdk. Crea src/lib/paypal.ts con funciones createOrder y capturePayment. Crea API route src/app/api/payments/paypal/route.ts."

---

### [PROMPT #6] - NexusPayments Stripe Real
**Objetivo:** Actualizar servicio dual
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/lib/services/nexus_payments.ts -Pattern "Stripe/S-Class"
```
**El Prompt exacto para Cline:**
> "Cline, modifica nexus_payments.ts. En registerPayment, después de escribir en Firestore, llama a createCheckoutSession de payments.ts. Retorna la session URL junto con el ID."

---

### [PROMPT #7] - Verificar Clarity ID
**Objetivo:** Telemetría Microsoft Clarity
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path .env.local -Pattern "CLARITY_ID"
```
**El Prompt exacto para Cline:**
> "Cline, verifica .env.local. Si falta NEXT_PUBLIC_CLARITY_ID, añádelo con valor placeholder. Verifica que layout.tsx ya carga el script con strategy=afterInteractive condicionalmente."

---

### [PROMPT #8] - Verificar GA4
**Objetivo:** Google Analytics 4 activo
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/app/layout.tsx -Pattern "G-CHYFK3G8DN"
```
**El Prompt exacto para Cline:**
> "Cline, confirma que layout.tsx carga gtag.js con ID G-CHYFK3G8DN usando next/script strategy=afterInteractive. Si falta, inyéctalo SIN romper CLS."

---

### [PROMPT #9] - Segundo GA4 Tag Firebase
**Objetivo:** Measurement ID de Firebase
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/app/layout.tsx -Pattern "G-W0JKLSZRQV"
```
**El Prompt exacto para Cline:**
> "Cline, añade un segundo gtag config para G-W0JKLSZRQV dentro del mismo script de analytics. NO dupliques la carga de gtag.js."

---

### [PROMPT #10] - Google Search Console Tag
**Objetivo:** Verificación GSC estática
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/app/layout.tsx -Pattern "google-site-verification"
```
**El Prompt exacto para Cline:**
> "Cline, confirma que metadata.verification.google existe en layout.tsx con valor aqeccjF8QKJSCm93Jb2C1rP8qvyhat2yLtJkrhFSGfU. Si no, añádelo al objeto metadata."

---

### [PROMPT #11] - Robots.txt Audit
**Objetivo:** Asegurar crawlability
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/app/robots.txt
```
**El Prompt exacto para Cline:**
> "Cline, verifica src/app/robots.txt. Debe permitir / y bloquear /admin, /api. Incluir Sitemap: https://productoraear.com/sitemap.xml."

---

### [PROMPT #12] - Sitemap.xml Dinámico
**Objetivo:** Generar todas las rutas SEO
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/app/sitemap.xml
```
**El Prompt exacto para Cline:**
> "Cline, verifica que sitemap.xml genera URLs para las 2183+ ciudades. Fuente: generateStaticParams de [...slug]/page.tsx."

---

### [PROMPT #13] - OpenGraph Images
**Objetivo:** Meta tags OG para redes sociales
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/app/layout.tsx -Pattern "openGraph"
```
**El Prompt exacto para Cline:**
> "Cline, añade openGraph al metadata de layout.tsx con title, description, url, siteName=EAR OS GOLD, images=[{url:/og-image.png}]."

---

### [PROMPT #14] - Canonical URLs
**Objetivo:** Evitar contenido duplicado
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditar canonicals"
```
**El Prompt exacto para Cline:**
> "Cline, en [...slug]/page.tsx, genera alternates.canonical dinámico basado en el slug actual: https://productoraear.com/{slug}."

---

### [PROMPT #15] - Structured Data JSON-LD
**Objetivo:** Schema.org para eventos
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditar JSON-LD"
```
**El Prompt exacto para Cline:**
> "Cline, crea un componente JsonLd.tsx que inyecte schema.org/Event en las páginas de ciudad. Úsalo en [...slug]/page.tsx."

---

### [PROMPT #16] - Optimización SEO Ruta 1
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 1"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 1 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #17] - Optimización SEO Ruta 2
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 2"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 2 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #18] - Optimización SEO Ruta 3
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 3"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 3 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #19] - Optimización SEO Ruta 4
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 4"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 4 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #20] - Optimización SEO Ruta 5
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 5"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 5 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #21] - Optimización SEO Ruta 6
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 6"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 6 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #22] - Optimización SEO Ruta 7
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 7"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 7 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #23] - Optimización SEO Ruta 8
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 8"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 8 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #24] - Optimización SEO Ruta 9
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 9"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 9 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

### [PROMPT #25] - Optimización SEO Ruta 10
**Objetivo:** Auditar meta-tags ruta interna
**Comando de Auto-Auditoría previo:**
```powershell
echo "Auditando ruta interna 10"
```
**El Prompt exacto para Cline:**
> "Cline, revisa la ruta interna número 10 del proyecto (admin, dashboard, login, etc). Asegura generateMetadata con title y description. Estándar Aura Onyx. NO navegador."

---

## FASE 2: MIGRACIÓN DE MEMORIA (Prompts 26-50)
*Extracción HTML legacy, limpieza semántica, embeddings vectoriales a Supabase.*

### [PROMPT #26] - Crear tabla vectorial Supabase
**Objetivo:** Preparar ear_knowledge_base con pgvector
**Comando de Auto-Auditoría previo:**
```powershell
echo "Verificar Supabase Dashboard"
```
**El Prompt exacto para Cline:**
> "Cline, genera un script scripts/create_vector_table.sql con: CREATE EXTENSION IF NOT EXISTS vector; CREATE TABLE ear_knowledge_base (id bigserial PRIMARY KEY, content text, embedding vector(768), metadata jsonb, source text, created_at timestamptz DEFAULT now()). Genera también la función match_knowledge con similitud coseno. Instrúyeme a ejecutarlo en Supabase SQL Editor."

---

### [PROMPT #27] - Instalar dependencias de extracción
**Objetivo:** cheerio + supabase-js
**Comando de Auto-Auditoría previo:**
```powershell
npm list cheerio 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npm install cheerio @supabase/supabase-js. Verifica instalación."

---

### [PROMPT #28] - Script maestro de extracción HTML
**Objetivo:** Crear el extractor universal
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path scripts/
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/extract_html_to_vectors.mjs. El script: 1) Lee TODOS los .html de temp_legacy/ recursivamente con fs/glob, 2) Usa cheerio para extraer texto limpio (elimina script, style, nav, footer), 3) Fragmenta en chunks de 500 caracteres con overlap de 50, 4) Para cada chunk llama a Gemini embedding API (textembedding-gecko@003), 5) Inserta en Supabase ear_knowledge_base. Usa dotenv para cargar .env.local."

---

### [PROMPT #29] - Extracción Batch 1
**Objetivo:** Procesar lote 1 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=1 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #30] - Extracción Batch 2
**Objetivo:** Procesar lote 2 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=2 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #31] - Extracción Batch 3
**Objetivo:** Procesar lote 3 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=3 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #32] - Extracción Batch 4
**Objetivo:** Procesar lote 4 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=4 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #33] - Extracción Batch 5
**Objetivo:** Procesar lote 5 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=5 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #34] - Extracción Batch 6
**Objetivo:** Procesar lote 6 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=6 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #35] - Extracción Batch 7
**Objetivo:** Procesar lote 7 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=7 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #36] - Extracción Batch 8
**Objetivo:** Procesar lote 8 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=8 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #37] - Extracción Batch 9
**Objetivo:** Procesar lote 9 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=9 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #38] - Extracción Batch 10
**Objetivo:** Procesar lote 10 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=10 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #39] - Extracción Batch 11
**Objetivo:** Procesar lote 11 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=11 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #40] - Extracción Batch 12
**Objetivo:** Procesar lote 12 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=12 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #41] - Extracción Batch 13
**Objetivo:** Procesar lote 13 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=13 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #42] - Extracción Batch 14
**Objetivo:** Procesar lote 14 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=14 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #43] - Extracción Batch 15
**Objetivo:** Procesar lote 15 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=15 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #44] - Extracción Batch 16
**Objetivo:** Procesar lote 16 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=16 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #45] - Extracción Batch 17
**Objetivo:** Procesar lote 17 de documentos legacy
**Comando de Auto-Auditoría previo:**
```powershell
Get-ChildItem temp_legacy/ -Recurse -Filter *.html | Measure-Object
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node scripts/extract_html_to_vectors.mjs --batch=17 --batchSize=20. Si falla por rate limit de Gemini, añade un delay de 1 segundo entre llamadas. Reporta cuántos vectores se insertaron."

---

### [PROMPT #46] - Verificar vectores en Supabase
**Objetivo:** Confirmar datos insertados
**Comando de Auto-Auditoría previo:**
```powershell
echo "Verificando Supabase"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/verify_vectors.mjs que consulte SELECT count(*) FROM ear_knowledge_base usando supabase-js. Reporta el total de vectores. Si es 0, algo falló en la extracción."

---

### [PROMPT #47] - Test de similitud RAG
**Objetivo:** Probar match_knowledge
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test RAG"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_rag_query.mjs. Genera embedding para la query "precio boda Madrid" con Gemini. Llama a supabase.rpc(match_knowledge). Muestra los 3 mejores resultados. Ejecuta el script."

---

### [PROMPT #48] - Importar datos de blog.ts
**Objetivo:** Migrar contenido estático del blog
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/data/blog.ts
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/import_blog_vectors.mjs. Lee src/data/blog.ts, parsea los objetos de artículos, genera embeddings y los sube a ear_knowledge_base con source=blog."

---

### [PROMPT #49] - Importar EmpireLoop logs
**Objetivo:** Migrar logs del bucle soberano
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/lib/services/EmpireLoop.ts
```
**El Prompt exacto para Cline:**
> "Cline, crea un script que extraiga los templates de log de EmpireLoop.ts, genere embeddings descriptivos y los suba a Supabase como conocimiento operativo."

---

### [PROMPT #50] - Validación final de memoria
**Objetivo:** Confirmar integridad del vector store
**Comando de Auto-Auditoría previo:**
```powershell
echo "Validación final"
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta scripts/verify_vectors.mjs otra vez. Si count > 100, reporta MEMORIA MIGRADA EXITOSAMENTE. Si < 100, lista las fuentes faltantes."

---

## FASE 3: DESPERTAR DE ASTRA NEURAL TWIN (Prompts 51-75)
*Enlace Supabase-RAG con Omnibus, Alpha God Mode, Mimetismo Omega.*

### [PROMPT #51] - Astra + RAG Supabase
**Objetivo:** Conectar API Astra con vectores
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/app/api/astra/route.ts
```
**El Prompt exacto para Cline:**
> "Cline, modifica src/app/api/astra/route.ts. ANTES de llamar a Gemini, genera embedding del prompt del usuario con Gemini embedding API, luego consulta supabase.rpc(match_knowledge,{query_embedding,match_threshold:0.78,match_count:5}). Inyecta los resultados como contexto RAG en el systemPrompt. Reescribe archivo completo."

---

### [PROMPT #52] - RAG Query mejorado
**Objetivo:** Eliminar dependencia de embedding del cliente
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/app/api/rag/query/route.ts
```
**El Prompt exacto para Cline:**
> "Cline, reescribe src/app/api/rag/query/route.ts. En lugar de recibir embedding del cliente, recibe solo query text. Genera el embedding server-side con Gemini. Luego llama a match_knowledge. Elimina runtime edge si da problemas con imports."

---

### [PROMPT #53] - Alpha God Mode Scoring v2
**Objetivo:** Scoring OPAL real
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/modules/SClassScreens/AstraSingleVoice.tsx -Pattern "calculateAlphaScore"
```
**El Prompt exacto para Cline:**
> "Cline, mejora calculateAlphaScore en AstraSingleVoice.tsx. Factores: +20 si amount>10000, +15 si status=CERRADO, +10 si metadata.referral existe, +5 si location=Madrid, -10 si status=CANCELADO. Clamp 0-99. Color dorado si >80, rojo si <50."

---

### [PROMPT #54] - Mimetismo Omega Expandido
**Objetivo:** Ampliar regex de washData
**Comando de Auto-Auditoría previo:**
```powershell
Select-String -Path src/modules/SClassScreens/AstraSingleVoice.tsx -Pattern "washData"
```
**El Prompt exacto para Cline:**
> "Cline, expande washData: añade matrimonio.com, eventbrite.es, bodaclick, catering.es, spotify, youtube.com. Todos se reemplazan por EAR Network. Case insensitive, global."

---

### [PROMPT #55] - Input interactivo Astra
**Objetivo:** Chat con el Oráculo desde Omnibus
**Comando de Auto-Auditoría previo:**
```powershell
wc -l src/modules/SClassScreens/AstraSingleVoice.tsx
```
**El Prompt exacto para Cline:**
> "Cline, añade a AstraSingleVoice.tsx un input de texto + botón. Al submit, llama fetch POST /api/astra con el prompt. Muestra respuesta y recommendations debajo del veredicto. Estilo Aura Onyx (bg-white/5, border-[#d4a855]/20). Reescribe archivo completo."

---

### [PROMPT #56] - Omnibus + Astra bidireccional
**Objetivo:** OmnibusTracker pasa datos a Astra
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/modules/SClassScreens/OmnibusTracker.tsx
```
**El Prompt exacto para Cline:**
> "Cline, modifica OmnibusTracker.tsx para pasar crmData, flotaData y vimumeData como props a AstraSingleVoice. Astra debe usar estos datos para generar veredictos más precisos."

---

### [PROMPT #57] - ForensicScanner + RAG
**Objetivo:** Scanner forense consulta la Bóveda
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path src/modules/SClassScreens/panels/ForensicScanner.tsx
```
**El Prompt exacto para Cline:**
> "Cline, añade un botón en ForensicScanner que consulte /api/rag/query con el último log como query. Muestra los fragmentos relevantes de la Bóveda."

---

### [PROMPT #58] - Dashboard KPIs Astra
**Objetivo:** Métricas de uso de IA
**Comando de Auto-Auditoría previo:**
```powershell
echo "Crear KPI panel"
```
**El Prompt exacto para Cline:**
> "Cline, crea src/modules/SClassScreens/panels/AstraKPIPanel.tsx. Muestra: total queries a Astra, avg response time, top 5 queries. Lee de Firestore ear_astra_logs (créalo si no existe). Estilo Aura Onyx."

---

### [PROMPT #59] - Calibración Prompt Gemini 1
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 1"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 1: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #60] - Calibración Prompt Gemini 2
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 2"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 2: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #61] - Calibración Prompt Gemini 3
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 3"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 3: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #62] - Calibración Prompt Gemini 4
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 4"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 4: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #63] - Calibración Prompt Gemini 5
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 5"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 5: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #64] - Calibración Prompt Gemini 6
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 6"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 6: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #65] - Calibración Prompt Gemini 7
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 7"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 7: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #66] - Calibración Prompt Gemini 8
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 8"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 8: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #67] - Calibración Prompt Gemini 9
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 9"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 9: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #68] - Calibración Prompt Gemini 10
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 10"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 10: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #69] - Calibración Prompt Gemini 11
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 11"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 11: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #70] - Calibración Prompt Gemini 12
**Objetivo:** Ajuste del system prompt
**Comando de Auto-Auditoría previo:**
```powershell
echo "Calibrando nodo 12"
```
**El Prompt exacto para Cline:**
> "Cline, modifica el systemPrompt en src/app/api/astra/route.ts. Añade instrucción para caso de uso 12: que Astra responda sobre presupuestos, logística, métricas VIMUME, análisis competitivo, pricing dinámico, gestión de artistas, contratos, y recomendaciones tácticas. Mantén tono S-Class militar."

---

### [PROMPT #71] - Test E2E Astra 1
**Objetivo:** Verificar flujo completo Astra
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test E2E 1"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_astra_e2e_1.mjs. Envía un POST a http://localhost:3007/api/astra con prompt de prueba. Verifica que responde con message y recommendations. Si falla, reporta el error exacto."

---

### [PROMPT #72] - Test E2E Astra 2
**Objetivo:** Verificar flujo completo Astra
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test E2E 2"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_astra_e2e_2.mjs. Envía un POST a http://localhost:3007/api/astra con prompt de prueba. Verifica que responde con message y recommendations. Si falla, reporta el error exacto."

---

### [PROMPT #73] - Test E2E Astra 3
**Objetivo:** Verificar flujo completo Astra
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test E2E 3"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_astra_e2e_3.mjs. Envía un POST a http://localhost:3007/api/astra con prompt de prueba. Verifica que responde con message y recommendations. Si falla, reporta el error exacto."

---

### [PROMPT #74] - Test E2E Astra 4
**Objetivo:** Verificar flujo completo Astra
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test E2E 4"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_astra_e2e_4.mjs. Envía un POST a http://localhost:3007/api/astra con prompt de prueba. Verifica que responde con message y recommendations. Si falla, reporta el error exacto."

---

### [PROMPT #75] - Test E2E Astra 5
**Objetivo:** Verificar flujo completo Astra
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test E2E 5"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/test_astra_e2e_5.mjs. Envía un POST a http://localhost:3007/api/astra con prompt de prueba. Verifica que responde con message y recommendations. Si falla, reporta el error exacto."

---

## FASE 4: ESTABILIZACIÓN Y DESPLIEGUE (Prompts 76-100)
*Estrés, webhooks, build final y firebase deploy.*

### [PROMPT #76] - Test de Carga 1
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 1"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_1.mjs. Usa firebase-admin para insertar 10 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #77] - Test de Carga 2
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 2"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_2.mjs. Usa firebase-admin para insertar 20 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #78] - Test de Carga 3
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 3"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_3.mjs. Usa firebase-admin para insertar 30 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #79] - Test de Carga 4
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 4"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_4.mjs. Usa firebase-admin para insertar 40 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #80] - Test de Carga 5
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 5"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_5.mjs. Usa firebase-admin para insertar 50 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #81] - Test de Carga 6
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 6"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_6.mjs. Usa firebase-admin para insertar 60 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #82] - Test de Carga 7
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 7"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_7.mjs. Usa firebase-admin para insertar 70 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #83] - Test de Carga 8
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 8"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_8.mjs. Usa firebase-admin para insertar 80 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #84] - Test de Carga 9
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 9"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_9.mjs. Usa firebase-admin para insertar 90 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #85] - Test de Carga 10
**Objetivo:** Simular tráfico en Firestore listeners
**Comando de Auto-Auditoría previo:**
```powershell
echo "Simulando hilo 10"
```
**El Prompt exacto para Cline:**
> "Cline, crea scripts/stress_test_10.mjs. Usa firebase-admin para insertar 100 documentos en ear_orders con datos aleatorios. Verifica que npm run build sigue pasando. Limpia los documentos de prueba después."

---

### [PROMPT #86] - Test Webhook Stripe
**Objetivo:** Simular pago completo
**Comando de Auto-Auditoría previo:**
```powershell
npx stripe --version 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta stripe trigger payment_intent.succeeded apuntando a localhost:3007/api/payments/webhook. Verifica respuesta 200. Si stripe CLI no existe, instálala."

---

### [PROMPT #87] - Test Telegram Bot
**Objetivo:** Verificar notificaciones
**Comando de Auto-Auditoría previo:**
```powershell
node src/lib/services/check_bot.cjs 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta node src/lib/services/verify_telegram.cjs. Si responde OK, notificaciones activas. Si falla, verifica TELEGRAM_BOT_TOKEN."

---

### [PROMPT #88] - Test Hunter API
**Objetivo:** Verificar API de enriquecimiento
**Comando de Auto-Auditoría previo:**
```powershell
echo "Test Hunter"
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta un curl a https://api.hunter.io/v2/domain-search?domain=productoraear.com&api_key=$HUNTER_API_KEY. Verifica respuesta 200."

---

### [PROMPT #89] - Auditoría TypeScript
**Objetivo:** Zero errors
**Comando de Auto-Auditoría previo:**
```powershell
npx tsc --noEmit 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npx tsc --noEmit. Si hay errores, reescribe CADA archivo que falle completo. Fotosíntesis de Tokens: cero diffs. Repite hasta Exit Code 0."

---

### [PROMPT #90] - Lint Check
**Objetivo:** ESLint limpio
**Comando de Auto-Auditoría previo:**
```powershell
npx next lint 2>&1 | Select-Object -Last 10
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npx next lint. Corrige warnings críticos. Ignora warnings de reglas deshabilitadas."

---

### [PROMPT #91] - Bundle Analysis
**Objetivo:** Verificar tamaño del bundle
**Comando de Auto-Auditoría previo:**
```powershell
npm run build 2>&1 | Select-String "First Load"
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npm run build. Examina el output de rutas. Si alguna ruta supera 500kB, investiga qué importación la infla y aplica dynamic import."

---

### [PROMPT #92] - Build Final Turbopack
**Objetivo:** Compilación de producción definitiva
**Comando de Auto-Auditoría previo:**
```powershell
npm run build
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta npm run build. Exit Code 0 = COMPILACIÓN S-CLASS EXITOSA. Si falla, lee log completo y corrige en batch."

---

### [PROMPT #93] - Preparar .env.production
**Objetivo:** Variables de producción
**Comando de Auto-Auditoría previo:**
```powershell
Test-Path .env.production
```
**El Prompt exacto para Cline:**
> "Cline, crea .env.production copiando .env.local pero cambiando NEXT_PUBLIC_BASE_URL a https://productoraear.com y PORT a 3000. Mantén todas las API keys."

---

### [PROMPT #94] - Firebase JSON Audit
**Objetivo:** Verificar config de hosting
**Comando de Auto-Auditoría previo:**
```powershell
Get-Content firebase.json
```
**El Prompt exacto para Cline:**
> "Cline, verifica firebase.json tiene hosting.source=. y frameworksBackend.region=us-central1. Corrígelo si falta."

---

### [PROMPT #95] - Habilitar Cloud Functions API
**Objetivo:** Instrucción para GCP
**Comando de Auto-Auditoría previo:**
```powershell
echo "Manual step"
```
**El Prompt exacto para Cline:**
> "Cline, INFORMA al usuario: Debe ir a https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview?project=productora-ear-backend y HABILITAR la API. También vincular cuenta de facturación Blaze."

---

### [PROMPT #96] - Firebase Login Check
**Objetivo:** Verificar autenticación
**Comando de Auto-Auditoría previo:**
```powershell
firebase login:list 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta firebase login:list. Si no hay usuario, ejecuta firebase login. Confirma que el proyecto activo es productora-ear-backend."

---

### [PROMPT #97] - Pre-Deploy Checklist
**Objetivo:** Lista de verificación final
**Comando de Auto-Auditoría previo:**
```powershell
firebase projects:list 2>&1
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta: 1) npx tsc --noEmit, 2) npm run build, 3) firebase projects:list. Los 3 deben pasar. Si alguno falla, DETENTE y corrige."

---

### [PROMPT #98] - Deploy Hosting
**Objetivo:** Despliegue estático a Firebase
**Comando de Auto-Auditoría previo:**
```powershell
firebase --version
```
**El Prompt exacto para Cline:**
> "Cline, ejecuta firebase deploy --only hosting --project productora-ear-backend. Si error 403 de Cloud Functions, intenta firebase deploy --only hosting. Captura URL resultante."

---

### [PROMPT #99] - Verificación Post-Deploy
**Objetivo:** Confirmar sitio online
**Comando de Auto-Auditoría previo:**
```powershell
curl -s -o /dev/null -w "%%{http_code}" https://productoraear.com
```
**El Prompt exacto para Cline:**
> "Cline, verifica que productoraear.com responde HTTP 200. Si no, revisa firebase hosting:sites:list para obtener la URL correcta."

---

### [PROMPT #100] - SELLADO FINAL
**Objetivo:** Certificación S-Class
**Comando de Auto-Auditoría previo:**
```powershell
echo "MISIÓN COMPLETADA"
```
**El Prompt exacto para Cline:**
> "Cline, genera un archivo DEPLOY_CERTIFICATE.md en la raíz con: fecha de deploy, URL de producción, estado de cada subsistema (Stripe, Supabase, Firebase, Gemini, Telegram), y el veredicto: CÓDIGO ORO SELLADO - EAR OS GOLD OPERATIVO."

---


---

## APÉNDICE A: MAPA DE ARCHIVOS CRÍTICOS

| Archivo | Función | Estado |
|---|---|---|
| `src/lib/firebase.ts` | Núcleo Firebase (Auth, Firestore, Storage) | ✅ Operativo |
| `src/lib/payments.ts` | Pasarela Stripe/PayPal | ⚠️ Stubs - Requiere Prompt #2 |
| `src/lib/services/auth_nexus.ts` | Bridge Firebase↔Supabase | ✅ Operativo |
| `src/lib/services/nexus_payments.ts` | Servicio financiero dual | ✅ Operativo |
| `src/lib/services/EmpireLoop.ts` | Bucle autónomo soberano | ✅ Operativo |
| `src/modules/SClassScreens/OmnibusTracker.tsx` | Dashboard unificado (CRM/Flota/VIMUME) | ✅ Operativo |
| `src/modules/SClassScreens/AstraSingleVoice.tsx` | Oráculo IA (Voz Única) | ✅ Operativo |
| `src/modules/SClassScreens/panels/ForensicScanner.tsx` | Escáner forense + Firestore | ✅ Operativo |
| `src/app/api/astra/route.ts` | API Gemini 1.5 Pro | ✅ Operativo |
| `src/app/api/rag/query/route.ts` | Motor RAG vectorial (Supabase pgvector) | ⚠️ Requiere embeddings server-side |
| `src/app/api/payments/create-session/route.ts` | Stripe Checkout Session | ⚠️ Simulado - Requiere Prompt #3 |
| `src/app/layout.tsx` | Layout + GA4 + Clarity + GSC | ✅ Operativo |
| `.env.local` | Variables de entorno (30+ keys) | ✅ Poblado |
| `firebase.json` | Config hosting + frameworksBackend | ✅ Configurado |

## APÉNDICE B: COLECCIONES FIRESTORE

| Colección | Uso | Listener en |
|---|---|---|
| `ear_orders` | CRM Pipeline / Pagos | OmnibusTracker, AstraSingleVoice |
| `ear_fleet_telemetry` | GPS y estado de flota | OmnibusTracker, AstraSingleVoice |
| `ear_vimume_nodes` | Nodos clínicos VIMUME | OmnibusTracker |
| `ear_forensic_logs` | Logs del escáner forense | ForensicScanner |

## APÉNDICE C: VARIABLES DE ENTORNO REQUERIDAS

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=productora-ear-backend
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-W0JKLSZRQV
GEMINI_API_KEY=...
NEXT_PUBLIC_GEMINI_API_KEY=...
HUNTER_API_KEY=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
STRIPE_SECRET_KEY=sk_live_... (producción) o sk_test_... (test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... o pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (obtener de Stripe Dashboard)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=... (opcional)
PAYPAL_SECRET=... (opcional)
NEXT_PUBLIC_CLARITY_ID=... (Microsoft Clarity)
NEXT_PUBLIC_SUPABASE_URL=https://ocrjsvjmdeqovkfdqoql.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_BASE_URL=https://productoraear.com
```

---
**FIN DEL CÓDICE. EJECUTAR SECUENCIALMENTE. CERO DESVIACIONES.**
