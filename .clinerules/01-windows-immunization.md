# REGLAS DE INMUNIZACIÓN DE SISTEMA (WINDOWS + POWERSHELL + TOOL CALLING)

## 1. Reglas Estrictas de PowerShell (Inmunización de Comillas)
- Shell activa: PowerShell 7 (`pwsh.exe`).
- PROHIBIDO usar sintaxis de CMD o Bash (`&`, `&&`, `dir /T:W`, `tasklist | ...`).
- Encadenar comandos en PowerShell SIEMPRE con punto y coma (`;`) o pipes (`|`).
- Rutas con espacios: Rodear SIEMPRE con comillas dobles estándar: `"H:\ruta con espacios\archivo.json"`.
- Para inspeccionar archivos o procesos, usar cmdlets nativos:
  * Procesos: `Get-Process python* | Select-Object Id, CPU`
  * Archivos: `Get-Item "ruta" | Select-Object Name, Length`
  * Filtrado: `Select-Object -First 20` (nunca volcar miles de líneas a la consola).

## 2. Inmunización de Rutas NTFS y Nombres Largos ([Errno 22])
- Límite de componente de nombre de archivo en Windows NTFS: 255 caracteres.
- Al generar nombres de destino en la bóveda o scripts:
  * Truncar SIEMPRE el nombre base a un máximo de 80 caracteres.
  * Sanitizar caracteres ilegales en Windows: `[<>:"/\\|?*\n\r\t]` reemplazándolos por `_`.
  * Ejemplo seguro: `f"[{today}]_{safe_base[:80]}{ext}"`.

## 3. Protocolo Anti-Bloqueo de Archivos (Windows File Locking / PermissionError)
- En Windows, procesos concurrentes (indexador, antivirus, VS Code) pueden bloquear archivos abiertos.
- En scripts de archivo/minería, usar SIEMPRE el patrón "Copiar y luego Intentar Borrar":
  * Primero: `shutil.copy2(src, dst)`
  * Luego: `try: os.remove(src) except Exception: pass` (se preserva la copia sin romper el flujo).

## 4. Inmunización de Tool-Calling en Cline
- Al emitir llamadas a herramientas de terminal o edición, incluir obligatoriamente todos los parámetros requeridos del esquema (evitar omitir `requires_approval` o campos booleanos).
- Preferir siempre crear o invocar scripts de Python/TypeScript desacoplados (`python scripts/mi_tarea.py`) en lugar de comandos multilínea inline de alta complejidad en la terminal.
