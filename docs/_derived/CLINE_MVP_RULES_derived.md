<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\release\CLINE_MVP_RULES.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 8A09E10CA6F74D7116C9F8172A97E10F0FE1D6A73C1451DB359A98E9E07831E3
  Freshness Score: 95/100
  Mode: HUMAN_CANONICAL | Status: FRESH
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# CLINE MVP EXECUTION RULES (OMEGA v2.1)

1. **Restricción de Ejecución:** Cline solo debe ejecutar los bloques especificados en `MVP_EXECUTION_QUEUE.md`.
2. **Límites de Escritura:** Solo se permite un bloque de escritura activo a la vez.
3. **Reintentos Finítos:**
   - Intento 1: Ejecutar la tarea.
   - Fallo 1: Aislar la causa raíz y aplicar una alternativa técnicamente distinta.
   - Fallo 2: Marcar como `BLOCKED`, guardar la evidencia y detener esa rama de trabajo.
   - Prohibido un tercer intento o repetir comandos con variaciones cosméticas.
4. **Shell de Trabajo:** Utilizar **PowerShell 7** obligatoriamente. Prohibidos comandos Unix/Bash (`mkdir -p`, `find`, `grep`, `sed`, `cat`, etc).
5. **No Ambigüedad:** Cline no ejecuta un bloque que contenga TODO, "investigar", "asumir", "ejemplo", "cookie e.g." o una dependencia no verificada.
6. **Exigencia de Código:** Cline exige un diff unificado completo y aplicable para cualquier bloque `WRITE_APPROVED`.
7. **Control de Git:** El rollback NO puede usar Git (`git checkout`, `git restore`) salvo autorización humana explícita. Las reversiones son por diff inverso. Cline no puede hacer `commit`, `push`, ni `rebase`.
8. **Validación de Matriz:** Si falta el archivo `ROUTE_AUTH_MATRIX.md`, Cline se detiene inmediatamente.
9. **Realidad de Sesión:** Cline NO crea un `middleware.ts` basado en una cookie hipotética; debe existir un contrato real de sesión/cookie comprobado.
10. **Registro:** Cline documenta evidencia breve en `docs/release/evidence/<ID>.md` al finalizar.
