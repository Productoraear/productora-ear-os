# Riesgos y bloqueos — Auditoría 32B

## HECHO_VERIFICADO

- Se realizó detección por nombre de archivo y metadatos.
- No se abrió contenido de .env, .env.local, credenciales, claves, tokens ni cookies.
- No se ejecutaron npm, npx, builds, tests, servidores, scripts de proyecto ni operaciones Git de escritura.
- Las exclusiones aplicadas fueron node_modules, .git, .next, turbo, ARCHIVE_RECOVERY y auditoria_32b.

## Metadatos de .env y .env.local

- HECHO_VERIFICADO | .env | C:\EAR_OS_V2\.env | 2480 bytes | 08/01/2026 10:54:35
- HECHO_VERIFICADO | .env.local | C:\EAR_OS_V2\.env.local | 1827 bytes | 07/27/2026 20:35:15
- HECHO_VERIFICADO | .env | C:\EAR_OS_V2\.firebase\productora-ear-backend\functions\.env | 511 bytes | 04/29/2026 14:20:26
- HECHO_VERIFICADO | .env.local | C:\EAR_OS_V2\.firebase\productora-ear-backend\functions\.env.local | 1713 bytes | 04/28/2026 17:51:00

## Hallazgos por nombre de archivo

- RIESGO | .env.vercel.production | C:\EAR_OS_V2\.env.vercel.production | .production | 2093 bytes | 05/19/2026 17:20:28
- RIESGO | .vercelignore | C:\EAR_OS_V2\.vercelignore | .vercelignore | 285 bytes | 05/12/2026 15:20:44
- RIESGO | vercel.json | C:\EAR_OS_V2\vercel.json | .json | 101 bytes | 05/18/2026 20:58:26
- RIESGO | _clientMiddlewareManifest.js | C:\EAR_OS_V2\.firebase\productora-ear-backend\hosting\_next\static\6C56a8BcdHxmkBgPe4daz\_clientMiddlewareManifest.js | .js | 456 bytes | 04/29/2026 14:19:51
- RIESGO | 01_MOC_FINANZAS_Y_STRIPE.md | C:\EAR_OS_V2\02_ARQUITECTURA_Y_MATRICES\01_MOC_FINANZAS_Y_STRIPE.md | .md | 254 bytes | 05/19/2026 16:36:23
- RIESGO | .firebaserc | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\.firebaserc | .firebaserc | 54 bytes | 04/19/2026 12:31:40
- RIESGO | firebase.json | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\firebase.json | .json | 193 bytes | 04/19/2026 17:07:25
- RIESGO | SUPABASE_DEPLOYMENT_SETUP.sql | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\SUPABASE_DEPLOYMENT_SETUP.sql | .sql | 1946 bytes | 04/29/2026 19:44:07
- RIESGO | SUPABASE_KNOWLEDGE_BASE.sql | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\SUPABASE_KNOWLEDGE_BASE.sql | .sql | 1653 bytes | 05/05/2026 09:57:16
- RIESGO | supabase_schema.sql | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\supabase_schema.sql | .sql | 1045 bytes | 04/23/2026 08:10:56
- RIESGO | SUPABASE_SECURITY_RULES.sql | C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump\SUPABASE_SECURITY_RULES.sql | .sql | 1517 bytes | 04/24/2026 20:19:49
- RIESGO | EAR_FIREBASE_RULES.md | C:\EAR_OS_V2\data_vault\docs\EAR_FIREBASE_RULES.md | .md | 2142 bytes | 02/15/2026 11:38:48
- RIESGO | EAR_OS_STYLE_AND_VERCEL_PREFLIGHT.md | C:\EAR_OS_V2\docs\EAR_OS_STYLE_AND_VERCEL_PREFLIGHT.md | .md | 2496 bytes | 05/15/2026 22:06:36
- RIESGO | EAR_OS_VERCEL_CHECKLIST.md | C:\EAR_OS_V2\docs\EAR_OS_VERCEL_CHECKLIST.md | .md | 1462 bytes | 05/17/2026 21:30:26
- RIESGO | V207_WEBHOOK_SECRETS.md | C:\EAR_OS_V2\docs\V207_WEBHOOK_SECRETS.md | .md | 618 bytes | 07/26/2026 02:13:27
- RIESGO | supabase-postgis-init.sql | C:\EAR_OS_V2\docs\architecture\logistics\supabase-postgis-init.sql | .sql | 2319 bytes | 05/15/2026 18:10:21
- RIESGO | 06 05 2026  18 48 Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\06 05 2026  18 48 Resuming Supabase Infrastructure Sovereignty.md | .md | 20203 bytes | 05/06/2026 18:48:42
- RIESGO | 06 05 21 17 hResuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\06 05 21 17 hResuming Supabase Infrastructure Sovereignty.md | .md | 46745 bytes | 05/06/2026 21:17:08
- RIESGO | 07 05 2026  10 48 Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\07 05 2026  10 48 Resuming Supabase Infrastructure Sovereignty.md | .md | 965 bytes | 05/07/2026 10:50:35
- RIESGO | 07 05 2026  11  36 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\07 05 2026  11  36 h Resuming Supabase Infrastructure Sovereignty.md | .md | 2514 bytes | 05/07/2026 11:37:06
- RIESGO | 07 05 2026  12 10 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\07 05 2026  12 10 h Resuming Supabase Infrastructure Sovereignty.md | .md | 9656 bytes | 05/07/2026 12:10:57
- RIESGO | 07 05 2026  12 43 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\07 05 2026  12 43 h Resuming Supabase Infrastructure Sovereignty.md | .md | 15319 bytes | 05/07/2026 12:43:41
- RIESGO | 07 05 2026  13 58 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\07 05 2026  13 58 h Resuming Supabase Infrastructure Sovereignty.md | .md | 29664 bytes | 05/07/2026 13:38:31
- RIESGO | 08 05 2026  00 19 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\08 05 2026  00 19 h Resuming Supabase Infrastructure Sovereignty.md | .md | 22439 bytes | 05/08/2026 00:19:43
- RIESGO | 08 05 2026  23 02 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\08 05 2026  23 02 h Resuming Supabase Infrastructure Sovereignty.md | .md | 25204 bytes | 05/08/2026 23:04:45
- RIESGO | 08 05 2026  9 02 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\08 05 2026  9 02 h Resuming Supabase Infrastructure Sovereignty.md | .md | 25920 bytes | 05/08/2026 09:02:48
- RIESGO | 09  05 2026  08 02 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\09  05 2026  08 02 h Resuming Supabase Infrastructure Sovereignty.md | .md | 30839 bytes | 05/09/2026 08:16:56
- RIESGO | 11 05 2026  11 40 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  11 40 h Resuming Supabase Infrastructure Sovereignty.md | .md | 15375 bytes | 05/11/2026 11:40:37
- RIESGO | 11 05 2026  11 47 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  11 47 h Resuming Supabase Infrastructure Sovereignty.md | .md | 24404 bytes | 05/11/2026 11:47:21
- RIESGO | 11 05 2026  12 09 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  12 09 h Resuming Supabase Infrastructure Sovereignty.md | .md | 34567 bytes | 05/11/2026 12:10:04
- RIESGO | 11 05 2026  12 39 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  12 39 h Resuming Supabase Infrastructure Sovereignty.md | .md | 43270 bytes | 05/11/2026 12:39:48
- RIESGO | 11 05 2026  12 48 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  12 48 h Resuming Supabase Infrastructure Sovereignty.md | .md | 55039 bytes | 05/11/2026 12:48:39
- RIESGO | 11 05 2026  13 02 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  13 02 h Resuming Supabase Infrastructure Sovereignty.md | .md | 62332 bytes | 05/11/2026 13:03:02
- RIESGO | 11 05 2026  13 34 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  13 34 h Resuming Supabase Infrastructure Sovereignty.md | .md | 76636 bytes | 05/11/2026 13:34:49
- RIESGO | 11 05 2026  13 42 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  13 42 h Resuming Supabase Infrastructure Sovereignty.md | .md | 85546 bytes | 05/11/2026 13:42:55
- RIESGO | 11 05 2026  13 57 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  13 57 h Resuming Supabase Infrastructure Sovereignty.md | .md | 109497 bytes | 05/11/2026 13:57:38
- RIESGO | 11 05 2026  14 31 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  14 31 h Resuming Supabase Infrastructure Sovereignty.md | .md | 176305 bytes | 05/11/2026 14:31:56
- RIESGO | 11 05 2026  15 21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  15 21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 211831 bytes | 05/11/2026 15:21:22
- RIESGO | 11 05 2026  17 21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  17 21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 268747 bytes | 05/11/2026 17:29:12
- RIESGO | 11 05 2026  18 01 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  18 01 h Resuming Supabase Infrastructure Sovereignty.md | .md | 288200 bytes | 05/11/2026 18:02:06
- RIESGO | 11 05 2026  18 18 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  18 18 h Resuming Supabase Infrastructure Sovereignty.md | .md | 311390 bytes | 05/11/2026 18:19:04
- RIESGO | 11 05 2026  18 33 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  18 33 h Resuming Supabase Infrastructure Sovereignty.md | .md | 322968 bytes | 05/11/2026 18:33:16
- RIESGO | 11 05 2026  23 29 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\11 05 2026  23 29 h Resuming Supabase Infrastructure Sovereignty.md | .md | 178346 bytes | 05/11/2026 23:29:47
- RIESGO | 12 05 2026  10 59  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  10 59  h Resuming Supabase Infrastructure Sovereignty.md | .md | 15259 bytes | 05/12/2026 10:59:33
- RIESGO | 12 05 2026  14 31 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  14 31 h Resuming Supabase Infrastructure Sovereignty.md | .md | 20788 bytes | 05/12/2026 14:31:39
- RIESGO | 12 05 2026  15 0 3 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  15 0 3 h Resuming Supabase Infrastructure Sovereignty.md | .md | 36913 bytes | 05/12/2026 15:03:05
- RIESGO | 12 05 2026  16 30 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  16 30 h Resuming Supabase Infrastructure Sovereignty.md | .md | 93187 bytes | 05/12/2026 16:31:00
- RIESGO | 12 05 2026  17 21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  17 21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 124079 bytes | 05/12/2026 17:22:09
- RIESGO | 12 05 2026  19 21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\12 05 2026  19 21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 7664 bytes | 05/12/2026 19:24:05
- RIESGO | 13 05 2026  07  21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  07  21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 6520 bytes | 05/13/2026 07:42:14
- RIESGO | 13 05 2026  08 21 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  08 21 h Resuming Supabase Infrastructure Sovereignty.md | .md | 52250 bytes | 05/13/2026 08:21:06
- RIESGO | 13 05 2026  10 06  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  10 06  h Resuming Supabase Infrastructure Sovereignty.md | .md | 125236 bytes | 05/13/2026 10:06:56
- RIESGO | 13 05 2026  10 43 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  10 43 h Resuming Supabase Infrastructure Sovereignty.md | .md | 155989 bytes | 05/13/2026 10:43:14
- RIESGO | 13 05 2026  11 24 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  11 24 h Resuming Supabase Infrastructure Sovereignty.md | .md | 206011 bytes | 05/13/2026 11:24:25
- RIESGO | 13 05 2026  11 33 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  11 33 h Resuming Supabase Infrastructure Sovereignty.md | .md | 209695 bytes | 05/13/2026 11:33:53
- RIESGO | 13 05 2026  12 09 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  12 09 h Resuming Supabase Infrastructure Sovereignty.md | .md | 263466 bytes | 05/13/2026 12:09:21
- RIESGO | 13 05 2026  14 33 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  14 33 h Resuming Supabase Infrastructure Sovereignty.md | .md | 333145 bytes | 05/13/2026 14:31:36
- RIESGO | 13 05 2026  20 03 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  20 03 h Resuming Supabase Infrastructure Sovereignty.md | .md | 78717 bytes | 05/13/2026 20:03:58
- RIESGO | 13 05 2026  20 15 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  20 15 h Resuming Supabase Infrastructure Sovereignty.md | .md | 106276 bytes | 05/13/2026 20:15:48
- RIESGO | 13 05 2026  20 24 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  20 24 h Resuming Supabase Infrastructure Sovereignty.md | .md | 127196 bytes | 05/13/2026 20:24:31
- RIESGO | 13 05 2026  22 42  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\13 05 2026  22 42  h Resuming Supabase Infrastructure Sovereignty.md | .md | 161242 bytes | 05/13/2026 22:43:36
- RIESGO | 14 05 2026  12 42  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\14 05 2026  12 42  h Resuming Supabase Infrastructure Sovereignty.md | .md | 140950 bytes | 05/14/2026 12:55:25
- RIESGO | 14 05 2026  19 42  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\14 05 2026  19 42  h Resuming Supabase Infrastructure Sovereignty.md | .md | 11576 bytes | 05/14/2026 19:40:21
- RIESGO | 15 05 2026  10 22  h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  10 22  h Resuming Supabase Infrastructure Sovereignty.md | .md | 13763 bytes | 05/15/2026 10:22:31
- RIESGO | 15 05 2026  10 27 h Resuming Supabase Infrastructure Sovereignty - copia.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  10 27 h Resuming Supabase Infrastructure Sovereignty - copia.md | .md | 75322 bytes | 05/15/2026 10:27:57
- RIESGO | 15 05 2026  10 27 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  10 27 h Resuming Supabase Infrastructure Sovereignty.md | .md | 75322 bytes | 05/15/2026 10:27:57
- RIESGO | 15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | .md | 470830 bytes | 05/15/2026 17:05:30
- RIESGO | 15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty - copia.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty - copia.md | .md | 470830 bytes | 05/15/2026 17:05:30
- RIESGO | 15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  17 05 h Resuming Supabase Infrastructure Sovereignty.md | .md | 470830 bytes | 05/15/2026 17:05:30
- RIESGO | 15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | .md | 546868 bytes | 05/15/2026 22:15:18
- RIESGO | 15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty - copia.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty - copia.md | .md | 546868 bytes | 05/15/2026 22:15:18
- RIESGO | 15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\15 05 2026  22 05 h Resuming Supabase Infrastructure Sovereignty.md | .md | 546868 bytes | 05/15/2026 22:15:18
- RIESGO | 17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | .md | 16429 bytes | 05/17/2026 10:40:57
- RIESGO | 17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty - copia.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty - copia.md | .md | 16429 bytes | 05/17/2026 10:40:57
- RIESGO | 17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  10 40 h Resuming Supabase Infrastructure Sovereignty.md | .md | 16429 bytes | 05/17/2026 10:40:57
- RIESGO | 17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty - copia - copia.md | .md | 217591 bytes | 05/17/2026 19:47:14
- RIESGO | 17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty - copia.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty - copia.md | .md | 217591 bytes | 05/17/2026 19:47:14
- RIESGO | 17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  19 40 h Resuming Supabase Infrastructure Sovereignty.md | .md | 217591 bytes | 05/17/2026 19:47:14
- RIESGO | 17 05 2026  21 00 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  21 00 h Resuming Supabase Infrastructure Sovereignty.md | .md | 362411 bytes | 05/17/2026 21:00:49
- RIESGO | 17 05 2026  21 32 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\17 05 2026  21 32 h Resuming Supabase Infrastructure Sovereignty.md | .md | 365089 bytes | 05/17/2026 21:32:45
- RIESGO | 18 05 2026  11 22 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\18 05 2026  11 22 h Resuming Supabase Infrastructure Sovereignty.md | .md | 309820 bytes | 05/18/2026 11:25:35
- RIESGO | 18 05 2026  11 28 h Resuming Supabase Infrastructure Sovereignty.md | C:\EAR_OS_V2\docs\contexto_historico\18 05 2026  11 28 h Resuming Supabase Infrastructure Sovereignty.md | .md | 316595 bytes | 05/18/2026 11:28:55
- RIESGO | Webhook de Stripe Connect.md | C:\EAR_OS_V2\docs\memoria EAR OS\01-Arquitectura\Webhook de Stripe Connect.md | .md | 2459 bytes | 05/18/2026 17:08:36
- RIESGO | Runbook de Deploy a Vercel.md | C:\EAR_OS_V2\docs\memoria EAR OS\04-Runbooks_y_Despliegues\Runbook de Deploy a Vercel.md | .md | 1542 bytes | 05/18/2026 17:08:53
- RIESGO | ROUTE_AUTH_MATRIX.md | C:\EAR_OS_V2\docs\release\ROUTE_AUTH_MATRIX.md | .md | 1842 bytes | 08/03/2026 10:50:57
- RIESGO | 2026-05-18_firebase_functions_sitemap.json | C:\EAR_OS_V2\incubadora\2026-05-18_firebase_functions_sitemap.json | .json | 142992 bytes | 03/21/2026 12:28:50
- RIESGO | 2026-05-18_firebase_hosting_sitemap.json | C:\EAR_OS_V2\incubadora\2026-05-18_firebase_hosting_sitemap.json | .json | 142992 bytes | 03/21/2026 12:28:50
- RIESGO | 2026-05-18_firebase_hosting.cache | C:\EAR_OS_V2\incubadora\2026-05-18_firebase_hosting.cache | .cache | 274607 bytes | 04/29/2026 14:21:39
- RIESGO | 2026-05-18_firebase_sitemap.xml | C:\EAR_OS_V2\incubadora\2026-05-18_firebase_sitemap.xml | .xml | 413358 bytes | 04/29/2026 14:20:07
- RIESGO | prisma.config.js | C:\EAR_OS_V2\prisma\prisma.config.js | .js | 290 bytes | 07/28/2026 08:51:41
- RIESGO | prisma.config.ts | C:\EAR_OS_V2\prisma\prisma.config.ts | .ts | 395 bytes | 05/02/2026 23:22:41
- RIESGO | schema.prisma | C:\EAR_OS_V2\prisma\schema.prisma | .prisma | 19075 bytes | 05/18/2026 20:14:23
- RIESGO | seed-vampire.js | C:\EAR_OS_V2\prisma\seed-vampire.js | .js | 5938 bytes | 07/28/2026 08:51:41
- RIESGO | seed-vampire.ts | C:\EAR_OS_V2\prisma\seed-vampire.ts | .ts | 5335 bytes | 05/18/2026 10:49:40
- RIESGO | firebase.ts.legacy | C:\EAR_OS_V2\quarantine\firebase.ts.legacy | .legacy | 1009 bytes | 05/04/2026 15:57:29
- RIESGO | 03_configurar_supabase_env_seguro.ps1 | C:\EAR_OS_V2\scripts\03_configurar_supabase_env_seguro.ps1 | .ps1 | 0 bytes | 08/01/2026 20:00:58
- RIESGO | 04_verificar_supabase_env_seguro.ps1 | C:\EAR_OS_V2\scripts\04_verificar_supabase_env_seguro.ps1 | .ps1 | 0 bytes | 08/01/2026 20:03:08
- RIESGO | seed_products.js | C:\EAR_OS_V2\scripts\vampirization\seed_products.js | .js | 3302 bytes | 07/28/2026 08:51:41
- RIESGO | seed_products.ts | C:\EAR_OS_V2\scripts\vampirization\seed_products.ts | .ts | 47 bytes | 07/29/2026 22:59:29
- RIESGO | stripeConnectActions.js | C:\EAR_OS_V2\src\app\actions\stripeConnectActions.js | .js | 3935 bytes | 07/28/2026 08:51:41
- RIESGO | stripeConnectActions.ts | C:\EAR_OS_V2\src\app\actions\stripeConnectActions.ts | .ts | 3668 bytes | 05/18/2026 17:36:42
- RIESGO | PaymentModal.tsx | C:\EAR_OS_V2\src\app\components\PaymentModal.tsx | .tsx | 5513 bytes | 05/06/2026 21:30:28
- RIESGO | AuthGuard.tsx | C:\EAR_OS_V2\src\app\components\auth\AuthGuard.tsx | .tsx | 519 bytes | 05/06/2026 21:30:29
- RIESGO | PaymentModal.tsx | C:\EAR_OS_V2\src\app\components\sections\PaymentModal.tsx | .tsx | 8574 bytes | 05/07/2026 11:40:26
- RIESGO | StripeConnectGate.tsx | C:\EAR_OS_V2\src\components\StripeConnectGate.tsx | .tsx | 4795 bytes | 05/18/2026 17:38:30
- RIESGO | AuthGuard.tsx | C:\EAR_OS_V2\src\components\auth\AuthGuard.tsx | .tsx | 367 bytes | 07/30/2026 12:13:08
- RIESGO | stripe-products.js | C:\EAR_OS_V2\src\config\stripe-products.js | .js | 220 bytes | 07/28/2026 08:51:41
- RIESGO | stripe-products.ts | C:\EAR_OS_V2\src\config\stripe-products.ts | .ts | 212 bytes | 07/26/2026 21:24:27
- RIESGO | AuthContext.tsx | C:\EAR_OS_V2\src\contexts\AuthContext.tsx | .tsx | 2432 bytes | 05/04/2026 15:57:28
- RIESGO | StripeConnectHandler.js | C:\EAR_OS_V2\src\features\finance\api\StripeConnectHandler.js | .js | 1129 bytes | 07/28/2026 08:51:41
- RIESGO | StripeConnectHandler.ts | C:\EAR_OS_V2\src\features\finance\api\StripeConnectHandler.ts | .ts | 1503 bytes | 05/11/2026 18:05:30
- RIESGO | useStripe.tsx | C:\EAR_OS_V2\src\hooks\useStripe.tsx | .tsx | 1070 bytes | 05/04/2026 15:57:28
- RIESGO | AuthContext.tsx | C:\EAR_OS_V2\src\lib\AuthContext.tsx | .tsx | 2662 bytes | 05/11/2026 23:39:34
- RIESGO | firebase.js | C:\EAR_OS_V2\src\lib\firebase.js | .js | 993 bytes | 07/28/2026 08:51:41
- RIESGO | firebase.ts | C:\EAR_OS_V2\src\lib\firebase.ts | .ts | 1009 bytes | 05/04/2026 15:57:29
- RIESGO | payments.js | C:\EAR_OS_V2\src\lib\payments.js | .js | 2409 bytes | 07/28/2026 08:51:41
- RIESGO | payments.ts | C:\EAR_OS_V2\src\lib\payments.ts | .ts | 2185 bytes | 07/27/2026 14:26:41
- RIESGO | prisma.js | C:\EAR_OS_V2\src\lib\prisma.js | .js | 501 bytes | 07/28/2026 08:51:41
- RIESGO | prisma.ts | C:\EAR_OS_V2\src\lib\prisma.ts | .ts | 534 bytes | 05/11/2026 13:50:13
- RIESGO | seed-artists.js | C:\EAR_OS_V2\src\lib\actions\seed-artists.js | .js | 5336 bytes | 07/28/2026 08:51:41
- RIESGO | seed-artists.ts | C:\EAR_OS_V2\src\lib\actions\seed-artists.ts | .ts | 4675 bytes | 05/19/2026 21:59:09
- RIESGO | seed-fleet.js | C:\EAR_OS_V2\src\lib\actions\seed-fleet.js | .js | 2359 bytes | 07/28/2026 08:51:41
- RIESGO | seed-fleet.ts | C:\EAR_OS_V2\src\lib\actions\seed-fleet.ts | .ts | 2019 bytes | 05/15/2026 21:59:40
- RIESGO | stripe-checkout.js | C:\EAR_OS_V2\src\lib\actions\stripe-checkout.js | .js | 3305 bytes | 07/28/2026 08:51:41
- RIESGO | stripe-checkout.ts | C:\EAR_OS_V2\src\lib\actions\stripe-checkout.ts | .ts | 3004 bytes | 05/17/2026 21:24:56
- RIESGO | parseStripeProp.js | C:\EAR_OS_V2\src\lib\recovered\parseStripeProp.js | .js | 833 bytes | 07/28/2026 08:51:41
- RIESGO | parseStripeProp.ts | C:\EAR_OS_V2\src\lib\recovered\parseStripeProp.ts | .ts | 916 bytes | 05/04/2026 15:57:29
- RIESGO | auth_nexus.js | C:\EAR_OS_V2\src\lib\services\auth_nexus.js | .js | 2675 bytes | 07/28/2026 08:51:41
- RIESGO | auth_nexus.ts | C:\EAR_OS_V2\src\lib\services\auth_nexus.ts | .ts | 2609 bytes | 05/18/2026 20:54:31
- RIESGO | nexus_payments.js | C:\EAR_OS_V2\src\lib\services\nexus_payments.js | .js | 2439 bytes | 07/28/2026 08:51:41
- RIESGO | nexus_payments.ts | C:\EAR_OS_V2\src\lib\services\nexus_payments.ts | .ts | 2909 bytes | 05/04/2026 15:57:29
- RIESGO | webhook_dispatcher.js | C:\EAR_OS_V2\src\lib\services\webhook_dispatcher.js | .js | 1606 bytes | 07/28/2026 08:51:41
- RIESGO | webhook_dispatcher.ts | C:\EAR_OS_V2\src\lib\services\webhook_dispatcher.ts | .ts | 1946 bytes | 05/04/2026 15:57:29
- RIESGO | webhookSender.js | C:\EAR_OS_V2\src\shared\utils\webhookSender.js | .js | 1158 bytes | 07/28/2026 08:51:42
- RIESGO | webhookSender.ts | C:\EAR_OS_V2\src\shared\utils\webhookSender.ts | .ts | 1173 bytes | 05/13/2026 10:19:37

## SUPUESTO

- La presencia de un nombre relacionado con autenticación, pagos, infraestructura o migraciones no demuestra por sí sola que su configuración esté activa.

## BLOQUEO

- Ninguno observado durante la detección por nombres y metadatos.

## RECOMENDACIÓN

- Revisar posteriormente, bajo un alcance explícito de solo lectura, las rutas y archivos permitidos del mapa de autenticación antes de proponer cambios.
