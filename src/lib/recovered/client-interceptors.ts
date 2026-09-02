/**
 * @file client-interceptors.ts
 * @description Interceptores globales para peticiones salientes.
 * Implementa seguridad y logging forense automático.
 */

export const setupInterceptors = () => {
    if (typeof window === 'undefined') return;

    const { fetch: originalFetch } = window;

    window.fetch = async (...args) => {
        const [resource, config] = args;
        
        // Inyectar Headers de Seguridad (S-Class)
        const headers = new Headers(config?.headers || {});
        headers.set('X-EAR-OS-TRACE', crypto.randomUUID());
        headers.set('X-System-Origin', 'EAR-OS-GOLD-V2');


        try {
            const response = await originalFetch(resource, { ...config, headers });
            
            if (!response.ok) {
                console.error(`[NETWORK_ERROR] ${response.status} at ${resource}`);
            }
            
            return response;
        } catch (error) {
            console.error(`[NETWORK_CRITICAL] Failure reaching ${resource}`, error);
            throw error;
        }
    };
};
