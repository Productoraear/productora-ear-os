<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\artists\manual-admin.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: 8BEE9098A6CF83A467A92FB5E209802206E7C4ECC5E2A35845E02F91B7C5F632
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# Manual del Administrador & DevOps — VIMUME Talent OS

## 1. Arquitectura de Seguridad y Custom Claims
El control de acceso de la vertical **ARTISTS** se fundamenta enteramente en **Custom Claims** inyectados en la sesión de autenticación de Firebase Auth. La única fuente de verdad (SSOT) del rol y de los privilegios asignados reside en el campo `request.auth.token.role`.

### 🎫 Estructura JSON del JWT Firmado
```json
{
  "iss": "https://securetoken.google.com/productoraear-prod",
  "aud": "productoraear-prod",
  "auth_time": 1779007536,
  "user_id": "ART-WAG-001",
  "sub": "ART-WAG-001",
  "exp": 1779011136,
  "email": "edwin.agudelo@productoraear.com",
  "role": "super_admin",
  "labelId": "LABEL-EAR-GLOBAL",
  "verified": true
}
```

---

## 2. Reglas de Seguridad en Firestore (`firestore.rules`)
Para impedir escaladas de privilegios y garantizar el multi-tenant y la segregación geográfica estricta de la información, se configuran las siguientes políticas de escritura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para comprobar rol del token JWT
    function hasRole(role) {
      return request.auth != null && request.auth.token.role == role;
    }

    // Reglas para perfiles de artistas
    match /ear_artist_profiles/{artistId} {
      allow read: if request.auth != null;
      allow write: if hasRole('super_admin') || hasRole('label_admin') || (hasRole('artist') && request.auth.uid == resource.data.user_id);
    }

    // Reglas para contratos inteligentes
    match /ear_smart_contracts/{contractId} {
      allow read: if request.auth != null && (hasRole('super_admin') || hasRole('label_admin') || request.auth.uid == resource.data.user_id);
      allow write: if hasRole('super_admin') || hasRole('label_admin');
    }
  }
}
```

---

## 3. Integración de Web Audio API (Estimulación Gamma 40Hz)
La modulación acústica de VIMUME utiliza `OscillatorNode` de la Web Audio API del navegador para generar ondas senoidales puras a 40Hz de forma nativa en el cliente:

1. **Aislamiento de Hydration**: El contexto de audio (`AudioContext`) solo se instancia en caliente tras la interacción física (`onClick`) del profesional. Esto garantiza que el marcado HTML generado por el servidor (SSR) de Next.js coincida exactamente con el primer ciclo del cliente.
2. **Ciclo de Vida de los Osciladores**:
   - Creación: `const osc = audioCtx.createOscillator();`
   - Configuración de tipo: `osc.type = 'sine';`
   - Frecuencia: `osc.frequency.setValueAtTime(40, audioCtx.currentTime);`
   - Conexión y Arranque: `osc.connect(audioCtx.destination); osc.start();`

---

## 4. Indexación y Ruteo Canónico
Next.js procesa de forma indexable y programática las URLs canónicas públicas mediante `sitemap.ts`:

- Roster público: `/artists/roster` (Prioridad: `0.80`, Frecuencia: `daily`)
- Lanzamientos públicos: `/artists/releases` (Prioridad: `0.70`, Frecuencia: `weekly`)
- Dossiers de Prensa públicos: `/artists/press` (Prioridad: `0.60`, Frecuencia: `monthly`)
- Perfil de Artista público: `/artists/[slug]` (Prioridad: `0.90`, Frecuencia: `daily`)
- Paneles Privados (Dashboard / Portal): Protegidos mediante `robots.txt` para denegar la indexación de robots de búsqueda (`Disallow: /artists/dashboard`).
