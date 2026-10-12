# INFORME FORENSE DE DESPLIEGUE COOLIFY / BARE-METAL
**Para:** Claude Opus / CEO  
**Fecha:** 11 de Octubre de 2026  
**Proyecto:** Productora EAR OS v2  
**Repositorio GitHub:** `https://github.com/Productoraear/productora-ear-os`  
**Último Commit en `main`:** `741884b` (`feat(core): sincronizar componentes publicos y admin pendientes (AudiovisualCalculator, LmsPanels, ErrorBoundaries)`)  
**Servidor VPS:** Hostinger KVM 1 (`82.29.179.172:8000`) — 1 vCPU, 4096 MB RAM, Ubuntu 24.04 LTS.

---

## 1. ESTADO ACTUAL DE PRODUCCIÓN (100% OPERATIVO)
Los servicios en producción **no se han caído ni interrumpido**:
- `https://productoraear.com`: **200 OK** (~250-400 ms)
- `https://n8n.productoraear.com`: **200 OK** (~200-350 ms)
- Panel Coolify (`http://82.29.179.172:8000`): **Activo y operativo**

---

## 2. HISTORIAL DE ERRORES DETECTADOS Y RESUELTOS EN CÓDIGO

### A. Fallo original 1: `Cannot find module 'tailwindcss'` y colisión de Prisma 7
- **Causa:** En el `Dockerfile` original se definía `NODE_ENV=production` antes de `npm install`, lo que omitía `devDependencies`. Prisma CLI no se instalaba localmente y `npx prisma generate` descargaba dinámicamente Prisma 7, arrojando el error `P1012: The datasource property url is no longer supported in schema files`.
- **Solución implementada:**
  - `tailwindcss`, `postcss`, `autoprefixer` y `prisma@^6.12.0` se movieron a `dependencies` fijas en `package.json`.
  - El `Dockerfile` se configuró con `NODE_ENV=development` en el builder y `npm install --include=dev --legacy-peer-deps`.
  - Prisma client fijado a la versión local `6.12.0`.

### B. Fallo original 2: Rutas de importación rotas (`arena-conversion-engine`)
- **Causa:** En `src/app/(admin)/admin/arena/page.tsx` y `api/arena/vote/route.ts` los alias `@/lib/...` fallaban en Webpack bajo Alpine.
- **Solución implementada:** Se cambiaron a rutas relativas directas (`../../../../lib/arena/arena-conversion-engine`).

### C. Fallo original 3: Archivos "Fantasma" en local no commiteados a Git
- **Causa:** `AudiovisualCalculator.tsx`, `LmsPanels.tsx`, `AdminDashboardClient.tsx` y varios ErrorBoundaries existían en el disco duro local de Windows, pero estaban **untracked** (`??` en `git status`). Al compilar localmente en Windows funcionaba, pero al clonar Coolify desde GitHub, Next.js arrojaba:
  `Module not found: Can't resolve '@/components/public/AudiovisualCalculator'`
- **Solución implementada:** Se añadieron, verificaron y commitearon todos los archivos huérfanos a `main` en el commit `741884b` y se subieron a GitHub.

---

## 3. EL CUELLO DE BOTELLA DEL SERVIDOR (POR QUÉ TARDA TANTO)
El VPS Hostinger contratado es un plan **KVM 1** (1 sola vCPU y 4 GB de RAM total).
En ese único núcleo de CPU corren simultáneamente:
1. Ubuntu 24.04
2. Coolify (Laravel Horizon, Redis, Postgres, Sentinel)
3. n8n clúster + Postgres de n8n
4. Contenedor actual en producción de EAR OS

Cuando se lanzaba `docker build --no-cache`:
- `npm install` tardaba **19 minutos** en descomprimir 1107 paquetes.
- `Next.js build` intentaba levantar 4 hilos de compilación en paralelo consumiendo toda la RAM disponible (~1.5 GB libres). El sistema entraba en swap de disco, ralentizando el build hasta que Coolify alcanzaba el **timeout de cola de 60 minutos** (`Illuminate\Queue\TimeoutExceededException`).

### Optimización de 1 vCPU aplicada:
En `next.config.ts`:
```typescript
experimental: {
  cpus: 1,
  workerThreads: false,
  webpackMemoryOptimizations: true,
  // ...
}
```
En `Dockerfile`:
```dockerfile
ENV NEXT_CPU_COUNT=1 \
    NODE_OPTIONS="--max-old-space-size=2048"
```
En local, esta configuración compila las 364 páginas estáticas en solo **23.8 segundos** sin picos de RAM.

---

## 4. ESTADO DEL DESPLIEGUE ACTUAL EN COOLIFY
- **Deployment UUID:** `t79t5d5izpdei2mzxhlyjlp5`
- **Commit:** `741884b`
- **Progreso:**
  - Step #11 (`npm install`): **CACHED en 0 segundos** (reutilizó las capas locales).
  - Step #12 (`COPY . .`): **7.4 segundos**.
  - Step #13 (`Prisma generate`): **38 segundos** (v6.12.0 generado).
  - Step #14 (`Next.js build`): En ejecución sin errores de módulos.

---

## 5. CÓMO REMATAR EL DESPLIEGUE (OPCIONES PARA CLAUDE OPUS O TERMINAL)

### Opción A (Recomendada: Cero carga al VPS, build en tu PC en 45 segundos):
Compilar la imagen en el PC del usuario (donde compila en 45 segundos) y subirla a GitHub Packages / Docker Hub:

```powershell
cd H:\EAR_OS_V2\EAR_OS_V2
docker build -t ghcr.io/productoraear/productora-ear-os:latest .
echo $env:GH_PAT | docker login ghcr.io -u Productoraear --password-stdin
docker push ghcr.io/productoraear/productora-ear-os:latest
```
En Coolify: Cambiar origen de la aplicación de "Dockerfile" a "Docker Image" (`ghcr.io/productoraear/productora-ear-os:latest`). Coolify solo hace `pull` y arranca en 5 segundos.

### Opción B (Comando directo por SSH en el servidor VPS):
Conectarse al VPS (`ssh root@82.29.179.172`) y ejecutar:
```bash
set -e
cd /tmp
rm -rf ear-deploy || true
git clone --depth 1 https://github.com/Productoraear/productora-ear-os.git ear-deploy
cd ear-deploy
docker build --build-arg NODE_ENV=production -t productora-ear-os:latest .
docker stop productora-ear-os-live 2>/dev/null || true
docker rm productora-ear-os-live 2>/dev/null || true
docker run -d --name productora-ear-os-live --restart unless-stopped --network coolify -p 3000:3000 productora-ear-os:latest
```

### Opción C (Esperar la terminación de Coolify):
Si el build `t79t5d5izpdei2mzxhlyjlp5` concluye dentro del panel de Coolify, el contenedor cambiará automáticamente sin intervención adicional.
