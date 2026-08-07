<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\release\discovery_policy.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: AC5001E21147ABB4FCFA61F53DEB13DD2A3F8716DC99EFC6EE567E97BBA51653
  Freshness Score: 100/100
  Mode: HYBRID | Status: FRESH
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🔍 DISCOVERY POLICY — EAR OS V2
> **SSOT audit:** 2026-08-06  
> **Ámbito:** Exploración de todo el PC respetando límites de seguridad y privacidad.

---

## 1. REGLAS DE EXPLORACIÓN FULL-PC

1. **Rutas Objetivo Permitidas (`Seed Roots`):**
   - `C:\Users\M2-W10\Desktop`
   - `C:\Users\M2-W10\Downloads`
   - `C:\Users\M2-W10\Documents`
   - Unidades secundarias: `D:\`, `E:\`, `G:\`, `H:\`, `L:\`

2. **Rutas Excluidas Inmutables (`Forbidden Paths`):**
   - Archivos de sistema de Windows (`C:\Windows`, `C:\Program Files`, `C:\Program Files (x86)`).
   - Papelera de reciclaje salvo escaneo forense de espacio (`\$Recycle.Bin`).
   - Carpetas de datos de credenciales o claves privadas (`.ssh`, `.gnupg`, `.aws`).

3. **Protocolo Metadata-First:**
   - La primera pasada del escáner recopila únicamente metadatos filesystem: nombre, extensión, tamaño, atributo, fechas UTC, hash SHA256 si tamaño < 50MB.
   - La inspección de contenido (Deep Scan) se reserva para archivos que alcancen un `Score >= 40`.

4. **Protección de Secretos y Privacidad:**
   - Prohibida la lectura, indexación o persistencia de archivos `.env`, `.env.local`, `credentials.json`, `token.json` o secretos Stripe/Firebase en el Grafo público o reportes.
