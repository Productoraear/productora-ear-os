# 🎧 EAR OS — Guía de Onboarding para DJs & Proof of Play

> **Versión:** 4.8 · **Fecha:** Agosto 2026  
> **Cumplimiento:** LPI 1/1996 · SGAE · AIE · AGEDI · RGPD

---

## 🎯 ¿Qué es Universal Cue Bridge?

**Universal Cue Bridge** es el motor forense de EAR OS que permite a cualquier DJ certificar sus sesiones de música en directo con una firma digital SHA-256 inmutable. 

Al terminar tu bolo, subes el historial exportado de tu software DJ y en **menos de 5 segundos** recibes un **Certificado Visado de Ejecución Pública** válido para reclamar el 100% de tus regalías ante SGAE, AIE y AGEDI.

### Software Soportado

| Motor DJ | Formatos Compatibles | Detección Automática |
|---|---|---|
| **VirtualDJ** | `.m3u`, `.m3u8` | ✅ |
| **Serato DJ** | `.csv`, `.txt` | ✅ |
| **Rekordbox** | `.xml`, `.txt` | ✅ |
| **Traktor Pro** | `.nml` | ✅ |
| **Denon Engine** | `.csv` | ✅ |

---

## ⚡ Instalación en 1 Clic

### Requisitos Previos

- Windows 10/11 con PowerShell 5.1+
- Al menos un software DJ instalado
- Cuenta de correo electrónico activa

### Comando de Instalación

Abre PowerShell y ejecuta:

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\install-ear-cue-bridge.ps1
```

O con nombre artístico y NIF precargados:

```powershell
.\scripts\install-ear-cue-bridge.ps1 -DjName "DJ Edwin" -DjNif "71758247K"
```

### ¿Qué hace el instalador?

1. **Crea la estructura** `%USERPROFILE%\.ear-os\` con subcarpetas para historial y certificados.
2. **Detecta automáticamente** el software DJ instalado en tu PC.
3. **Genera** `ear-dj-config.json` con tu perfil y los datos del venue.
4. **Registra** un watcher en segundo plano para procesar historiales automáticamente.

---

## 📋 Esquema de Configuración `ear-dj-config.json`

Una vez instalado, edita el archivo de configuración con tus datos reales:

```json
{
  "_schema": "ear-os-dj-config-v1",

  "djProfile": {
    "artisticName": "DJ Edwin Agudelo",
    "legalName": "Edwin Agudelo Díaz",
    "nifDni": "71758247K",
    "sgaeCode": "SGAE-2026-XXXXX",
    "aieCode": "AIE-2026-XXXXX",
    "isrcPrefix": "ES-EAR-",
    "currency": "EUR",
    "paymentMethod": "stripe_connect",
    "stripeAccountId": "acct_XXXXXXXXXX",
    "email": "booking@edwinagudelo.es",
    "phone": "+34 600 XXX XXX"
  },

  "defaultVenue": {
    "venueName": "Finca La Concepción",
    "venueNif": "B-29884102",
    "address": "Ctra. de Istán km 2, 29611 Istán",
    "city": "Marbella (Málaga)",
    "gpsCoordinates": "36.5101,-4.8824",
    "ownerEmail": "eventos@fincalaconcepcion.com",
    "maxCapacity": 350,
    "licenseNumber": "LIC-SGAE-2026-098"
  },

  "watcherSettings": {
    "enabled": true,
    "pollIntervalMs": 30000,
    "autoGenerateCert": true,
    "autoEmailVenue": false,
    "certOutputDir": "%USERPROFILE%\\.ear-os\\certificates",
    "historyArchiveDir": "%USERPROFILE%\\.ear-os\\session-history"
  },

  "legalCompliance": {
    "jurisdiction": "ES",
    "applicableLaws": [
      "Real Decreto Legislativo 1/1996 (Ley de Propiedad Intelectual)",
      "SGAE - Tarifas Generales para comunicación pública",
      "AIE - Derechos conexos de artistas intérpretes"
    ],
    "dataProtection": "RGPD (EU 2016/679)",
    "consentGiven": false,
    "consentDate": null
  }
}
```

### Campos Obligatorios por Ley (LPI Art. 108-114)

| Campo | Descripción | Obligatorio |
|---|---|---|
| `djProfile.artisticName` | Nombre artístico o de actuación | ✅ Sí |
| `djProfile.nifDni` | NIF/DNI/NIE del artista intérprete | ✅ Sí |
| `djProfile.sgaeCode` | Código de socio SGAE (si aplica) | ⚠️ Recomendado |
| `djProfile.aieCode` | Código de socio AIE | ⚠️ Recomendado |
| `defaultVenue.venueName` | Nombre comercial del local | ✅ Sí |
| `defaultVenue.venueNif` | CIF/NIF del establecimiento | ✅ Sí |
| `defaultVenue.address` | Dirección postal completa | ✅ Sí |
| `defaultVenue.gpsCoordinates` | Coordenadas GPS (latitud, longitud) | ⚠️ Recomendado |
| `defaultVenue.maxCapacity` | Aforo autorizado del local | ✅ Sí (para cálculo de tarifa) |

---

## 🎵 Flujo de Trabajo del DJ

### Paso 1: Configura tu perfil (Solo 1 vez)

Edita `%USERPROFILE%\.ear-os\ear-dj-config.json` con tus datos personales y los del venue habitual.

### Paso 2: Pincha tu sesión normalmente

Usa VirtualDJ, Serato, Rekordbox o Traktor como siempre. No necesitas cambiar nada en tu workflow.

### Paso 3: Exporta el historial al cerrar

Al terminar tu sesión:

- **VirtualDJ**: El historial se guarda automáticamente en `Documents\VirtualDJ\History\`.
- **Serato**: Ve a `History → Export as .csv`.
- **Rekordbox**: Ve a `File → Export Track List as .txt`.
- **Traktor**: El historial NML se actualiza automáticamente.

### Paso 4: El watcher procesa automáticamente

Si activaste el watcher, el certificado se genera en menos de 5 segundos al detectar el nuevo archivo de historial.

Si no usas el watcher, sube manualmente el archivo en `edwinagudelo.es/artistas/dashboard` → pestaña "Universal Cue Bridge".

### Paso 5: Recibe tu Certificado Visado

El sistema genera automáticamente:

- ✅ **Certificado PDF/HTML** con firma SHA-256 inmutable
- ✅ **Metadatos del venue** (NIF, GPS, aforo, fecha/hora)
- ✅ **Listado completo** de las obras ejecutadas
- ✅ **Cálculo de regalías** según Split Soberano 70/20/10

---

## 📊 Split de Regalías (Ejecución B2B en Venues)

| Concepto | Porcentaje | Destino |
|---|---|---|
| **Fondo Artistas & Compositores** | 70% | Pool directo para titulares de derechos |
| **Infraestructura EAR OS** | 20% | Mantenimiento servidores, CDN y redundancia N+1 |
| **Investigación VIMUME** | 10% | Fondo de investigación acústica y salud |

---

## 🔒 Firma SHA-256: ¿Por Qué Es Importante?

Cada certificado contiene una **firma criptográfica SHA-256** calculada a partir de:

- ID único del certificado
- NIF/CIF del venue
- Coordenadas GPS
- Número de fonogramas ejecutados
- Fecha y hora exacta de emisión

Esta firma es **inmutable** y verificable en cualquier momento. Constituye prueba legal según el artículo 24 de la Ley 34/2002 de Servicios de la Sociedad de la Información.

---

## ❓ Preguntas Frecuentes

### ¿Necesito ser socio de SGAE?
No es obligatorio, pero tener código SGAE/AIE facilita el reclamo de derechos. El certificado es válido independientemente.

### ¿Funciona con sesiones en streaming?
Sí. Sube el historial de tu sesión de Twitch/YouTube y el certificado se genera igualmente.

### ¿Puedo usar varios softwares DJ?
Sí. El instalador detecta todos los que tengas instalados y monitorea sus carpetas de historial simultáneamente.

### ¿Qué pasa si el venue no tiene NIF?
Puedes usar el NIF del organizador del evento. Es obligatorio para la validez legal del certificado.

### ¿Cuántas monedas soporta?
EUR (España), USD (USA), COP (Colombia), MXN (México). Configurable en `djProfile.currency`.

---

## 📞 Soporte

- **Email:** soporte@edwinagudelo.es
- **Web:** [edwinagudelo.es](https://edwinagudelo.es)
- **Documentación técnica:** `src/lib/UniversalCueBridge.ts`

---

*© 2026 Productora EAR S.L. · Sistema Operativo para la Industria de la Música y Eventos de Gala.*
