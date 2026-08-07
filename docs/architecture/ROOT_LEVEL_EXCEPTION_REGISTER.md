# 🛡️ EAR OS — ROOT LEVEL EXCEPTION REGISTER

> **Registro de Excepciones en Raíz:** Lista blanca de archivos que están explícitamente autorizados para existir en el directorio raíz del proyecto (`C:\EAR_OS_V2\`). Todo archivo que no esté en esta lista y esté en la raíz se considera huérfano y debe ser movido.

---

## 1. Archivos Técnicos Autorizados (Build & Env)
| Archivo / Carpeta | Propósito / Obligatoriedad |
|---|---|
| `package.json` | Obligatorio (Node.js/npm manager). |
| `package-lock.json` | Obligatorio (Bloqueo de dependencias). |
| `tsconfig.json` | Obligatorio (Configuración de TypeScript). |
| `next.config.js` | Obligatorio (Configuración de Next.js App Router). |
| `tailwind.config.js` | Obligatorio (Configuración de Tailwind CSS). |
| `postcss.config.mjs` | Obligatorio (PostCSS procesador). |
| `eslint.config.mjs` | Obligatorio (Linter). |
| `.env`, `.env.local` | Obligatorio (Variables de entorno, no subir a Git). |
| `.env.production` | Obligatorio (Variables Vercel/Prod). |
| `.gitignore`, `.vercelignore`, `.eslintignore`, `.clineignore` | Obligatorio (Reglas de exclusión). |
| `vercel.json` | Obligatorio (Configuración de despliegue Vercel). |
| `next-env.d.ts` | Obligatorio (Tipos globales de Next.js). |

## 2. Archivos Documentales Autorizados en Raíz
| Archivo | Propósito / Obligatoriedad |
|---|---|
| `README.md` | Obligatorio (Punto de entrada humano al repositorio). |
| `.clinerules` | Obligatorio (Reglas globales del AI Agent). |

## 3. Carpetas Base Autorizadas
| Carpeta | Propósito |
|---|---|
| `src/` | Código fuente (App Router, componentes, features, lib). |
| `public/` | Assets estáticos. |
| `prisma/` | Base de datos ORM y migraciones. |
| `docs/` | Documentación estructurada (SSOT, arquitectura, release). |
| `scripts/` | Herramientas, automatizaciones y mantenimiento. |
| `config/` | Archivos de configuración externa avanzada. |
| `manifests/` | Registros y estado serializado de EAR OS. |
| `.next/`, `.git/`, `.vercel/`, `node_modules/` | Carpetas generadas automáticamente (No tocar). |
