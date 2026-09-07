# SPRINT ZERO-TOKEN: MONETIZACIÓN Y TRACCIÓN INMEDIATA (72 HORAS)
OBJETIVO: Poner en producción las páginas de checkout y captación de Stripe para Solista/Mariachi y VIMUME. CERO SCRAPING MASIVO HASTA TENER 3 VENTAS.

## TAREA 1: Checkout y Landing de Reserva de Artista (Edwin Agudelo)
- Archivo objetivo: `src/app/reservar/solista/page.tsx`
- Tarifa Base Inmutable: 350,00 €.
- Depósito Stripe: 100,00 €.
- Regla de negocio: Logística 1,50 €/km desde Méntrida a partir del km 50.
- Estilo: Cinematic Monochrome S-Class (#050505, #258DCD).

## TAREA 2: One-Pager VIMUME B2B/B2G con Descarga de Dossier Clínico
- Archivo objetivo: `src/app/vimume/propuesta/page.tsx`
- Propuesta de Valor: Musicoterapia activa sensorial para estimulación cognitiva en adultos mayores.
- Límite acústico: < 75 dB SPL garantizado.
- Botón de Conversión: Formulario directo a WhatsApp / Llamada oficial (+34 693 693 048) y solicitud de propuesta municipal (< 14.250 € LCSP).

## REGLA DE COMPILACIÓN OBLIGATORIA:
Cada cambio debe finalizar con `npx tsc --noEmit` -> Exit Code 0. Prohibido bucles de más de 1 intento.
