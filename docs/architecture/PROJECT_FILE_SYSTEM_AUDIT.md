# 📂 EAR OS — PROJECT FILE SYSTEM AUDIT

> **Auditoría Estructural de Alto Nivel:** Diagnóstico de la distribución del árbol de directorios para transicionar a un formato "Digital Archivist Purist".

---

## 1. Problemas Detectados en el Árbol Actual
- **Scripts Dispersos:** Múltiples scripts PowerShell (`Dominancia_EAR*.ps1`) en la raíz del proyecto, en lugar de estar encapsulados en `scripts/`.
- **Docs Dispersos:** Carpetas antiguas o redundantes en la raíz (`00_INBOX_COGNITIVO`, `01_SSOT_Y_KERNELS`, `BASE_DE_CONOCIMIENTO`, `CORE`) que deberían consolidarse bajo la taxonomía purista en `docs/`.
- **Archivos Markdown Huérfanos en Raíz:** `INVENTARIO_TOTAL.md`, `SEO_DOMINANCE_PLAN.md`, `CLINE_RULES_*.md` ocupan espacio visual en la raíz y rompen el principio de "Cero excepciones".
- **Carpetas de Auditoría:** `_auditoria`, `auditoria_32b` deben moverse a `docs/audit/`.

## 2. Visión del Estado Objetivo (Target State)
La raíz del proyecto debe quedar limpia, conteniendo exclusivamente dependencias operacionales de Next.js/Vercel (configs, envs, manifests), la base de datos (prisma), el código fuente (`src/`), los assets (`public/`), y las dos bóvedas supremas: `docs/` y `scripts/`.

- **Criterio de Éxito:** Un `ls` o `dir` en la raíz debe devolver máximo 15 items, todos estándar en frameworks modernos o justificados en `ROOT_LEVEL_EXCEPTION_REGISTER.md`.
