'use client';

import { useEffect } from 'react';

export function ClientThemeGuard() {
  useEffect(() => {
    // 1. Apuntar a la raíz del ecosistema visual
    const root = document.documentElement;
    
    // 2. Extraer la métrica de verdad actual
    const currentGold = getComputedStyle(root).getPropertyValue('--color-gold-primary').trim();
    
    // 3. Condición de Rescate Estético
    if (!currentGold || currentGold !== '#ecb613') {
      console.warn('⚠️ [PHOENIX SHIELD] Caída CSS detectada. Restaurando variables HSL de la Versión de Oro...');
      
      // Inyección Forzada de la Singularidad S-Class
      root.style.setProperty('--color-gold-primary', '#ecb613'); // El Oro EAR
      root.style.setProperty('--color-gold-secondary', '#b8860b'); 
      root.style.setProperty('--glass-backdrop-filter', 'blur(16px) saturate(180%)');
      root.style.setProperty('--glass-border', 'rgba(236, 182, 19, 0.15)');
    }
  }, []);

  return null; // Componente fantasma, impacto total.
}
