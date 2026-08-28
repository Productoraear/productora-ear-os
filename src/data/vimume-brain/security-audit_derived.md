<!-- 
  LIVING DOCS DERIVED SNAPSHOT
  Canonical Source: docs\forensics\hermes-vimume\security-audit.md
  Generated At: 2026-08-06T21:56:57.7733281Z
  Hash SHA256: B071F4B12F0DF5603D9F702AEDBCD6855452C5262AD0C5BE5861E85931C80151
  Freshness Score: 0/100
  Mode: HUMAN_CANONICAL | Status: STALE
  DO NOT EDIT DIRECTLY - EDIT CANONICAL SOURCE
-->
# 🛡️ Auditoría de Seguridad: Firestore Rules

## 1. Análisis de Reglas Existentes
**Veredicto**: **NO IMPLEMENTADO**. No existe el archivo `src/lib/firebase/firestore.rules`.

## 2. Riesgos Críticos Detectados
*   **Severidad**: CRÍTICA.
*   **Riesgo**: Exposición total de datos en caso de conexión de Firebase.
*   **Impacto**: Incumplimiento de GDPR y fuga de datos clínicos.

## 3. Fragmento Propuesto (S-Class Hardening)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
    match /patients/{patientId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.centerId == resource.data.centerId;
    }
  }
}
```

## 4. Estado de Prueba
**ESTADO**: **HIPÓTESIS / NO DEMOSTRADO**. No se pueden probar las reglas si el archivo no existe.
