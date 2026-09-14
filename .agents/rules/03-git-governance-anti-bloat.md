# GOBERNANZA GIT PURISTA & PREVENCIÓN DE BLOQUEO CI/CD (NETLIFY / VERCEL)

## 1. REPO ULTRA-LIGERO (< 50 MB)
El árbol de commits de Git debe mantenerse permanentemente por debajo de 50 MB (peso canónico actual: ~36 MB).

## 2. PROHIBICIÓN TAXATIVA DE ARCHIVOS PESADOS EN GIT
Está terminantemente prohibido rastrear o commitear en Git:
1. Archivos binarios > 1 MB (PDFs, ZIPs, RARs, ejecutables, videos o imágenes pesadas no optimizadas).
2. Bases de datos monolíticas en crudo (`all_providers_database.json`, volcados SQL, staging, MFTs).
3. Bóvedas de inteligencia y scraping (`wedding_intel_vault`, `staging/`, `EAR_ABSORBED_VAULT`).

## 3. UBICACIÓN OBLIGATORIA DE ACTIVOS DE INTELIGENCIA Y PROVEEDORES
- Todo archivo maestro de datos o scraping debe residir en `H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\` o en rutas locales aisladas bajo `.gitignore`.
- Jamás almacenar backups masivos dentro de carpetas rastreadas como `src/` o `public/`.

## 4. PARTICIONES EDGE CDN SINTÉTICAS
- Las particiones públicas consumidas por el cliente (`public/data/providers/`) deben ser subconjuntos curados (máximo 500-1.000 registros de alta calidad por gremio).
- Cada partición JSON debe pesar < 1 MB.

## 5. IMPACTO EN CLOUD CI/CD (POR QUÉ EXISTE ESTA REGLA)
- Netlify Free Tier ofrece 300 minutos de build al mes.
- Un repositorio de 2.75 GB tarda entre 4 y 7 minutos por build y satura los 300 minutos en menos de 50 despliegues, bloqueando el proyecto.
- Vercel bloquea cuentas con "Fair use limits exceeded" si se despliegan repositorios pesados con funciones o datos masivos.
- Con el repositorio limpio de 36 MB, el build tarda < 50 segundos, garantizando más de 400 despliegues mensuales sin saturar ningún plan.
