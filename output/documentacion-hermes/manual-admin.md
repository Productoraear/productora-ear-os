# 🏛️ Manual de Administrador y DevOps — Hermes Tracker OT (S-Class Technical Manual)

Este manual ha sido diseñado bajo los estándares de máxima excelencia de ingeniería de software de Silicon Valley para servir como tutor técnico avanzado para la gobernanza, despliegue, seguridad y auditoría del sistema **Hermes Tracker OT** de **VIMUME / EAR OS** en `productoraear.com`. Este documento está dirigido a ingenieros de software, administradores de bases de datos, auditores de cumplimiento (RGPD/HIPAA) y administradores de sistemas en la nube.

---

## 🔒 1. ARQUITECTURA DE SEGURIDAD BASADA EN CUSTOM CLAIMS (JWT)

En el diseño S-Class de Hermes Tracker, **nunca** dependemos de validaciones a nivel de base de datos (`get()` o lecturas complementarias de documentos) para la autorización en tiempo real de operaciones de escritura crítica. Las llamadas directas a Firestore se validan atómicamente utilizando **Firebase Auth Custom Claims**.

```
[Cliente solicita escritura] ➔ [Firestore intercepta petición] ➔ [Valida JWT del Token en request.auth.token.role] ➔ [Permite/Deniega]
```

### Flujo Técnico de Asignación de Roles (Custom Claims):
1. **Asignación en Servidor Seguro**: La asignación de roles debe realizarse exclusivamente a través del SDK de Firebase Admin en un entorno de servidor aislado (o Firebase Cloud Functions), nunca desde el cliente:
   ```typescript
   // Ejemplo de Script de Ingesta y Asignación de Roles en Servidor
   import { getAuth } from 'firebase-admin/auth';

   async function grantClinicalAccess(uid: string, role: string, center: string) {
     await getAuth().setCustomUserClaims(uid, {
       role: role,     // super_admin, admin_centro, terapeuta, colaborador_clinico, solo_lectura
       center: center  // Centro Navalcarnero, Centro Madrid HQ, etc.
     });
     console.log(`Claims actualizados de forma segura para usuario: ${uid}`);
   }
   ```
2. **Propagación del Token JWT**: Una vez asignados los claims en el backend, el cliente debe forzar la renovación del token de sesión para propagar los nuevos campos en el encabezado de autenticación:
   ```typescript
   // Cliente fuerza refresco del token de sesión
   await firebase.auth().currentUser.getIdToken(true);
   ```
3. **Rol y Centro como Fuente de Verdad**: Las variables `request.auth.token.role` y `request.auth.token.center` representan la autoridad suprema del sistema. La colección `/users/{userId}` actúa meramente como un repositorio auxiliar para metadatos (avatar, teléfono, historial de actividad), eliminando la posibilidad de escalación de privilegios editando el propio perfil en el cliente.

---

## 🛡️ 2. GOBERNANZA DEL DATO Y HARDENING EN FIRESTORE RULES

El archivo `firestore.rules` del proyecto ha sido endurecido para garantizar aislamiento absoluto multi-centro y segregación de perfiles bajo cumplimiento RGPD.

### Reglas Clave Explicadas:
* **Inmutabilidad del Ledger (`audit_logs`)**: Los logs de auditoría son de solo-escritura para usuarios autenticados; una vez creados, ningún rol (incluido el administrador) puede actualizarlos o borrarlos:
  ```javascript
  match /audit_logs/{logId} {
    allow create: if isAuthenticated();
    allow read: if isSuperAdmin();
    allow update, delete: if false; // Inmutabilidad garantizada
  }
  ```
* **Aislamiento Geográfico (`vimume_intervenciones`)**: El acceso a expedientes e intervenciones está condicionado a la correspondencia entre el centro del claim del usuario y el centro del documento solicitado:
  ```javascript
  allow read: if isAuthenticated() && (
    isSuperAdmin() || 
    request.auth.token.center == resource.data.center
  );
  ```
* **Prevención de Elevación Documental (`users`)**: Se impide explícitamente que los usuarios modifiquen sus propios campos de rol o centro geográfico a través de peticiones en cliente, bloqueando cualquier hackeo en el navegador:
  ```javascript
  allow create, update: if isAuthenticated() && (
    isSuperAdmin() || 
    (request.auth.uid == userId && 
     request.resource.data.role == resource.data.role && 
     request.resource.data.center == resource.data.center)
  );
  ```

---

## 🕊️ 3. OPTIMIZACIÓN DEL ESTIMULADOR GAMMA A 40HZ (WEB AUDIO API)

El reproductor sónico a 40Hz está diseñado para no romper la hidratación de Next.js (SSR) y para operar con la máxima eficiencia de CPU a nivel de cliente.

### Especificaciones de la Implementación de Audio:
1. **Evitar Ejecución en Servidor (SSR)**: La Web Audio API de HTML5 no existe en entornos de servidor (Node.js). Por lo tanto, toda instanciación de contextos de audio se protege mediante validación de entorno de cliente:
   ```typescript
   if (typeof window !== 'undefined') {
     // Seguro instanciar contexto de audio en cliente
   }
   ```
2. **Ciclo de Vida del Contexto**: Un error común es instanciar múltiples contextos en caliente en cada renderizado, provocando bloqueos del navegador y ruidos audibles. La arquitectura de Hermes implementa un patrón Singleton a través de referencias de React (`useRef`):
   ```typescript
   const audioContextRef = useRef<AudioContext | null>(null);
   const oscillatorRef = useRef<OscillatorNode | null>(null);
   const gainNodeRef = useRef<GainNode | null>(null);
   ```
3. **Mitigación de Hydration Mismatch**: El estado del botón de activación (`isPlaying`) se inicializa en `false` por defecto, de modo que el marcado inicial coincide 100% entre el servidor y el cliente. El oscilador físico solo se crea y arranca (`oscillator.start()`) tras la interacción directa del terapeuta (evento `onClick`).

---

## 🌐 4. NAVEGACIÓN CLIENTE SEGURA Y DIRECTIVAS DE ROUTING

El redireccionamiento del sistema utiliza transiciones de client-side routing robustas administradas a través de Next.js App Router.

### Políticas de Ruteo en el Cliente:
1. **Uso de `useRouter`**: En lugar de recargar el navegador mediante `window.location.href`, el dashboard utiliza `router.push('/path')` de `'next/navigation'`. Esto permite:
   * Mantener el contexto del AudioContext si hay terapias en segundo plano.
   * Evitar la carga innecesaria de scripts y hojas de estilo de terceros en cada transición.
   * Mantener activa la sesión local de Firebase Auth sin necesidad de re-autenticar tokens JWT.
2. **Validación de Middleware**: El enrutamiento por cliente es una optimización visual, **nunca** un mecanismo de seguridad definitivo. Los controles de acceso reales se validan en el backend en cada petición a Firestore y mediante el `middleware.ts` del servidor que intercepta y valida las cookies de sesión de Firebase antes de servir el dashboard.

---

## 📈 5. MANTENIMIENTO DEL SITEMAP CANONICAL E INDEXACIÓN

Para asegurar una presencia fuerte en los motores de búsqueda (SEO) y evitar la duplicación de páginas o penalizaciones de contenido, la ruta `/vimume/hermes` se define de forma estrictamente canonical.

### Configuración del Sitemap:
* **Ubicación**: [src/app/sitemap.ts](file:///c:/EAR_OS_V2/src/app/sitemap.ts)
* **Directivas de Indexación**:
  * La URL canonical pública es `https://productoraear.com/vimume/hermes`.
  * La prioridad se establece en `0.9` (Prioridad Institucional Máxima).
  * La frecuencia de cambio es semanal (`changeFrequency: 'weekly'`).
  * El dashboard privado `/vimume/hermes/dashboard` se excluye intencionadamente del sitemap y contiene la etiqueta meta `<meta name="robots" content="noindex, nofollow" />` para proteger la privacidad clínica de los centros.

---

## 🚀 6. PASOS DE DESPLIEGUE SEGURO (CHECKLIST VERCEL & FIREBASE)

Antes de promover el MVP al entorno productivo de `productoraear.com`, el administrador debe certificar el siguiente checklist de preflight:

### Checklist de Despliegue Técnico:
- [ ] **Desplegar Reglas de Firestore**: Ejecute `firebase deploy --only firestore:rules` desde la terminal clínica.
- [ ] **Configurar Variables de Entorno en Vercel**:
  * `NEXT_PUBLIC_FIREBASE_API_KEY`
  * `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  * `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  * `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  * `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  * `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] **Probar Compilación Local**: Ejecute `npm run build` en su entorno local y asegúrese de que el bundle de Next.js se genere sin advertencias en las páginas de `/vimume/hermes`.
- [ ] **Confirmar RLS / Multi-tenencia**: Acceda como terapeuta de un centro simulado e intente forzar una llamada de lectura sobre otro centro mediante consola; verifique que Firestore retorne un error `PERMISSION_DENIED`.
