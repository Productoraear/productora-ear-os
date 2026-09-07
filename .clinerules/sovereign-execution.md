# REGLAS OPERATIVAS BARE-METAL QWEN (MAXIMA EFICIENCIA ZTM)

1. REGLA POWERSHELL LITERAL:
   - Al manipular archivos en rutas con corchetes (ej. [provincia], [servicio]), usa SIEMPRE -LiteralPath. Jamas uses -Path.

2. PREVENCION ERROR YOLO (REPLACE_IN_FILE):
   - Si replace_in_file no coincide con el archivo en el primer intento, NO reintentes a ciegas.
   - Usa write_to_file para sobreescribir el archivo completo o delega la mutacion a un script en /scripts/.

3. AISLAMIENTO MCP:
   - JAMAS ejecutes 'node ...mcp_server.js' en la terminal. El servidor MCP antigravity-bridge ya corre en background via stdio.

4. NEXT.JS APP ROUTER STRICT:
   - Server Components por defecto. 'use client' solo para interactividad DOM directa.
   - Resuelve params dinámicos asíncronamente: 'const resolvedParams = await params;'.
   - Validacion estricta: Toda tarea finaliza con 'npx tsc --noEmit' -> Exit Code 0.

5. SPLIT SOBERANO Y NEGOCIO:
   - Split inmutable 80/10/10. Deposito reserva 100,00 €. Base solista 350,00 €. Hub: Mentrida.
