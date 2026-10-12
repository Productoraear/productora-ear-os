# ADENDA v2 — CORRECCIONES DE REALISMO (12/10/2026)

Esta adenda **sustituye** lo que decían las Ventanas 2, 3, 5 y 7 de `INFORME_VENTANAS_OPORTUNIDAD_Y_BARRERAS_MARIACHIS_400KW.md`.

## Ventana 2 — Ruido en fincas (REESCRITA)
- **Promesa retirada:** "Certificado acústico homologado" y "máx. 75 dB". No podemos emitir certificados (solo entidades acreditadas por ENAC pueden hacerlo), y un mariachi con trompetas suena más fuerte que eso aunque no lleve amplificación.
- **Protocolo real:**
  1. Antes del evento pedimos a la finca su límite (dBA) y si tiene limitador.
  2. Enviamos una ficha técnica (rider) con la formación recomendada para ese límite.
  3. Si la finca es muy restrictiva: formato de cuerdas (violines, vihuela, guitarrón) o trompetas con sordina.
  4. Medimos con sonómetro durante la prueba de sonido y ajustamos.
  5. Si la finca exige un informe oficial, lo encargamos a una entidad acreditada y se cobra aparte.
- Referencias del SSOT: bodas en exterior 85–90 dBA, interiores 80–85 dBA, cóctel 70–80 dBA, festejos populares 90–102 dBA.

## Ventana 3 — Ayuntamientos (REESCRITA)
- El contrato menor (Art. 118 LCSP) es la **figura legal**, no el precio. Un mariachi solo cuesta entre 1.200 y 2.500 €.
- Los importes altos solo se justifican con **producción integral**. Nueva sección `MariachiB2GProduction`:

| Nivel | Incluye | Rango orientativo (sin IVA) |
|---|---|---|
| Solo artístico | Mariachi de 6–8 músicos | 1.200 – 2.500 € |
| Concierto de plaza | + PA, luces y técnico | 3.500 – 7.000 € |
| Concierto de feria | + escenario cubierto, line-array, generador y coordinación | 8.000 – 14.000 € |

- Referencias de mercado para justificarlo en la memoria del expediente: escenario 1.500–3.500 €, sonido de plaza 1.800–4.500 €, iluminación 800–2.500 €, generador 300–900 €, mariachi grande 1.800–3.500 €. **Son estimaciones orientativas: hay que validarlas con 2–3 proveedores reales antes de presentarlas a un ayuntamiento.**
- No hay pago online en esta vertical: todo va por presupuesto desglosado y factura FACe.

## Ventana 5 — Productos de estudio (PENDIENTE)
- Al consultar Stripe, la clave configurada en `.env` es de **modo test** y devuelve **0 precios activos**. No ha sido posible leer las tarifas reales de Productora EAR.
- Los precios de canción personalizada (180 €) y vídeo dedicatoria (120 €) **no están verificados contra Stripe**. Se mantienen hasta que el CEO proporcione el catálogo live.

## Ventana 7 — Centralita (REESCRITA)
- **Promesa retirada:** "despacho en menos de 30 minutos" y "despacho en < 50 ms". No hay datos de flota que lo respalden.
- **Posicionamiento:** una sola centralita de mariachis para toda España (+34 693 693 048). El tiempo de llegada se confirma caso a caso.
- **Oferta para grupos** (ecuación de valor: resultado × probabilidad ÷ tiempo × esfuerzo): eventos que ya llegan con depósito pagado, tarifa cerrada, comisión por recomendación y saldo canjeable en la productora. Componente: `MariachiCentralita`.
- **Expansión:** una landing de captación por país o región que lleve a `/mariachis/unirse`. España primero.

## Datos falsos eliminados
- `MariachiReviews` (4 reseñas inventadas) se ha retirado de la página.
- `aggregateRating 5.0 / 48` del JSON-LD se ha eliminado: no tiene respaldo y Google penaliza las valoraciones falsas.
- Se han eliminado de la página las afirmaciones "78 %" y "95 %" del informe anterior: no tienen fuente.
