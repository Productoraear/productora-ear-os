/**
 * 🛡️ FIRESTORE S-CLASS SAFEGUARD
 * Enclave de resiliencia para escuchadores en tiempo real (onSnapshot).
 * Evita excepciones no capturadas (Uncaught FirebaseError / permission-denied)
 * que disparen el ErrorBoundary de Next.js.
 */
export function safeOnSnapshot(
  docRefOrQuery: any, 
  onNext: (snapshot: any) => void, 
  onErrorFallback?: (err: any) => void
) {
  try {
    if (!docRefOrQuery) return () => {};
    return docRefOrQuery.onSnapshot
      ? docRefOrQuery.onSnapshot(
          onNext,
          (err: any) => {
            console.warn('⚠️ [FIRESTORE SAFEGUARD] Permiso o escucha degradada gracefully:', err.message);
            if (onErrorFallback) onErrorFallback(err);
          }
        )
      : () => {};
  } catch (e) {
    console.warn('⚠️ [FIRESTORE SAFEGUARD] Excepción capturada:', e);
    return () => {};
  }
}
