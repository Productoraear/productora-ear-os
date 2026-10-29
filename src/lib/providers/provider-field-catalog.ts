/**
 * ════════════════════════════════════════════════════════════════════════════
 * CATÁLOGO DE CAMPOS DE FICHA POR CATEGORÍA — SSOT DE CAMPOS EDITABLES
 * ════════════════════════════════════════════════════════════════════════════
 * OBJETIVO: que cada proveedor del Data Lake tenga una ficha EDITABLE de ~380
 * campos (272 núcleo común + 3 bloques de categoría × 36), al estilo de los
 * perfiles profesionales de bodas.net, pero con escritura real en PostgreSQL.
 *
 * DOCTRINA (CERO FACHADAS):
 *   · Este módulo es PURO (cero `node:fs`, cero `next/*`, cero Prisma): lo
 *     importan Server Components, Client Components y scripts de auditoría.
 *   · `publicVisible` es FAIL-CLOSED: sólo lo marcado `true` puede salir a la
 *     ficha pública. Datos bancarios, IBAN, DPO o polizas NUNCA son públicos.
 *   · El valor se persiste como TEXTO (`ProviderProfileField.valueText`):
 *     booleanos `'true'|'false'`, listas separadas por salto de línea.
 *   · Ningún precio de este catálogo sustituye al SSOT financiero
 *     (`ear-os-ssot.ts`): son datos declarativos del proveedor, no la tarifa
 *     soberana de EAR OS.
 *
 * AUDITOR: `scripts/verify_category_field_templates.ts` exige ≥300 campos por
 * categoría y 0 claves duplicadas. Si baja de 300, el script devuelve exit 1.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type ProviderFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'percent'
  | 'boolean'
  | 'select'
  | 'list'
  | 'url'
  | 'email'
  | 'phone'
  | 'date';

export type ProviderFieldGroupId =
  | 'identidad'
  | 'contacto'
  | 'fiscal'
  | 'ubicacion'
  | 'tarifas'
  | 'pagos'
  | 'reservas'
  | 'operativa'
  | 'tecnica'
  | 'media'
  | 'accesibilidad'
  | 'sostenibilidad'
  | 'idiomas'
  | 'escaparate'
  | 'faq'
  | 'objeciones'
  | 'venta_cruzada'
  | 'reputacion'
  | 'rsc'
  | 'seguridad'
  | 'digital'
  | 'espacio'
  | 'gastronomia'
  | 'musica'
  | 'audiovisual'
  | 'estetica'
  | 'transporte'
  | 'protocolo'
  | 'animacion'
  | 'senior'
  | 'moda';

export interface ProviderFieldDef {
  /** Clave estable y única en TODO el catálogo (prefijo de grupo obligatorio). */
  readonly key: string;
  readonly label: string;
  readonly group: ProviderFieldGroupId;
  readonly type: ProviderFieldType;
  readonly hint?: string;
  readonly options?: readonly string[];
  readonly maxLength?: number;
  /** true ⇔ puede renderizarse en la ficha pública. Por defecto false. */
  readonly publicVisible?: boolean;
  /** true ⇔ dato personal/financiero: jamás público, jamás en logs. */
  readonly sensitive?: boolean;
  /** true ⇔ campo del escaparate bodas.net (importación/exportación). */
  readonly bodasNet?: boolean;
  /** true ⇔ sin él no se puede cerrar una venta (reserva/contrato). */
  readonly requiredForSale?: boolean;
}

export interface ProviderFieldGroup {
  readonly id: ProviderFieldGroupId;
  readonly label: string;
  readonly description: string;
  /**
   * Título de sección en la ficha pública. `null` ⇒ el grupo NO genera sección
   * propia; sus campos sólo pueden usarse como dato puntual (un teléfono, un
   * enlace de WhatsApp), nunca como bloque de contenido.
   */
  readonly publicSection: string | null;
}

function f(
  key: string,
  label: string,
  group: ProviderFieldGroupId,
  type: ProviderFieldType = 'text',
  extra?: Partial<Omit<ProviderFieldDef, 'key' | 'label' | 'group' | 'type'>>,
): ProviderFieldDef {
  return { key, label, group, type, ...(extra ?? {}) };
}

/** Orden canónico de grupos en el drawer del panel de administración. */
export const PROVIDER_FIELD_GROUPS: readonly ProviderFieldGroup[] = [
  { id: 'identidad', label: 'Identidad & Marca', description: 'Nombre comercial, historia y diferenciales', publicSection: 'Sobre nosotros' },
  { id: 'contacto', label: 'Contacto & Canales', description: 'Teléfonos, emails y redes', publicSection: null },
  { id: 'fiscal', label: 'Fiscal, Legal & Seguros', description: 'Datos fiscales y coberturas (privado)', publicSection: null },
  { id: 'ubicacion', label: 'Ubicación & Logística', description: 'Dirección, cobertura y kilómetros', publicSection: 'Dónde estamos' },
  { id: 'tarifas', label: 'Tarifas & Presupuesto', description: 'Precios declarados y anticipos', publicSection: 'Tarifas' },
  { id: 'pagos', label: 'Cobros & Formas de Pago', description: 'Bizum, IBAN, tarjeta, cripto', publicSection: 'Formas de pago' },
  { id: 'reservas', label: 'Reservas & Cancelación', description: 'Antelación, políticas y contrato', publicSection: 'Reservas y cancelación' },
  { id: 'operativa', label: 'Operativa & Montaje', description: 'Tiempos, accesos y necesidades', publicSection: 'Montaje y operativa' },
  { id: 'tecnica', label: 'Medios Técnicos', description: 'Sonido, iluminación y potencia', publicSection: 'Medios técnicos' },
  { id: 'media', label: 'Fotografía, Vídeo & Media', description: 'Galerías, dossiers y vídeos', publicSection: 'Galería y dossier' },
  { id: 'accesibilidad', label: 'Accesibilidad & Inclusión', description: 'Barreras, PMR y adaptaciones', publicSection: 'Accesibilidad' },
  { id: 'sostenibilidad', label: 'Sostenibilidad & RSC', description: 'Km0, residuos y huella', publicSection: 'Sostenibilidad' },
  { id: 'idiomas', label: 'Idiomas & Atención', description: 'Idiomas de equipo y documentación', publicSection: 'Idiomas' },
  { id: 'escaparate', label: 'Escaparate Bodas.net', description: 'Campos espejo del escaparate profesional', publicSection: 'Escaparate' },
  { id: 'faq', label: 'Preguntas Frecuentes', description: 'FAQ reales (6 pares)', publicSection: 'Preguntas frecuentes' },
  { id: 'objeciones', label: 'Objeciones & Argumentario', description: 'Objeciones y su respuesta (4 pares)', publicSection: 'Lo que suelen preguntar' },
  { id: 'venta_cruzada', label: 'Venta Cruzada & Upsell', description: 'Packs, extras y servicios complementarios', publicSection: 'Completa tu evento' },
  { id: 'reputacion', label: 'Reputación & Casos', description: 'Testimonios, prensa y casos de éxito', publicSection: 'Opiniones' },
  { id: 'rsc', label: 'Impacto Social VIMUME', description: 'SROI, sesiones y certificados RSC', publicSection: 'Impacto social' },
  { id: 'seguridad', label: 'Seguridad & Cumplimiento', description: 'Evacuación, PRL y protocolos', publicSection: 'Seguridad' },
  { id: 'digital', label: 'SEO, Web & Redes', description: 'Metadatos y analítica', publicSection: null },
  { id: 'espacio', label: 'Espacio, Aforo & Instalaciones', description: 'Aforos, salones y plan B', publicSection: 'Espacio y aforo' },
  { id: 'gastronomia', label: 'Gastronomía & Menús', description: 'Menús, barra libre y alérgenos', publicSection: 'Gastronomía' },
  { id: 'musica', label: 'Música & Directo', description: 'Formato, repertorio y momentos', publicSection: 'Música y directo' },
  { id: 'audiovisual', label: 'Cobertura Audiovisual', description: 'Horas, entregas y formatos', publicSection: 'Cobertura audiovisual' },
  { id: 'estetica', label: 'Estética, Flores & Decoración', description: 'Ramo, arco, centros y photocall', publicSection: 'Estilo y decoración' },
  { id: 'transporte', label: 'Transporte & Flota', description: 'Vehículos, trayectos y esperas', publicSection: 'Transporte' },
  { id: 'protocolo', label: 'Organización & Protocolo', description: 'Coordinación, timeline y equipo', publicSection: 'Organización' },
  { id: 'animacion', label: 'Animación & Espectáculos', description: 'Monitores, shows y edades', publicSection: 'Animación' },
  { id: 'senior', label: 'Protocolo Clínico VIMUME', description: 'Sesiones neuroacústicas y métricas', publicSection: 'Protocolo clínico' },
  { id: 'moda', label: 'Moda, Trajes & Medidas', description: 'Colecciones, tallas y ajustes', publicSection: 'Moda y trajes' },
];

export const PROVIDER_FIELD_GROUP_ORDER: Readonly<Record<ProviderFieldGroupId, number>> = Object.freeze(
  PROVIDER_FIELD_GROUPS.reduce<Record<ProviderFieldGroupId, number>>((acc, group, index) => {
    acc[group.id] = index;
    return acc;
  }, {} as Record<ProviderFieldGroupId, number>),
);

/** Campo público (atajo: la mayoría del escaparate). */
function fp(
  key: string,
  label: string,
  group: ProviderFieldGroupId,
  type: ProviderFieldType = 'text',
  extra?: Partial<Omit<ProviderFieldDef, 'key' | 'label' | 'group' | 'type'>>,
): ProviderFieldDef {
  // FAIL-CLOSED: lo sensible NUNCA puede salir a la ficha pública, ni por error
  // de marcado en el catálogo (lo verifica `verify_category_field_templates.ts`).
  const publicVisible = extra?.sensitive === true ? false : (extra?.publicVisible ?? true);
  return { key, label, group, type, ...(extra ?? {}), publicVisible };
}
// ════════════════════════════════════════════════════════════════════════════
// NÚCLEO COMÚN — identidad, contacto, fiscal y ubicación
// ════════════════════════════════════════════════════════════════════════════
const G_IDENTIDAD: readonly ProviderFieldDef[] = [
  fp('ident.nombre_comercial', 'Nombre comercial', 'identidad', 'text', { requiredForSale: true, maxLength: 120 }),
  f('ident.nombre_fiscal', 'Razón social', 'identidad'),
  f('ident.cif_nif', 'CIF / NIF', 'identidad', 'text', { sensitive: true }),
  fp('ident.anio_fundacion', 'Año de fundación', 'identidad', 'number'),
  fp('ident.historia', 'Historia del proyecto', 'identidad', 'textarea'),
  fp('ident.lema', 'Lema / claim', 'identidad'),
  fp('ident.descripcion_corta', 'Descripción corta (meta)', 'identidad', 'textarea', { maxLength: 220 }),
  fp('ident.descripcion_larga', 'Descripción larga', 'identidad', 'textarea'),
  fp('ident.propuesta_valor', 'Propuesta de valor', 'identidad', 'textarea'),
  fp('ident.diferencial_1', 'Diferencial 1', 'identidad'),
  fp('ident.diferencial_2', 'Diferencial 2', 'identidad'),
  fp('ident.diferencial_3', 'Diferencial 3', 'identidad'),
  f('ident.logo_url', 'URL del logotipo', 'identidad', 'url'),
  f('ident.color_marca', 'Color de marca (#hex)', 'identidad', 'text', { hint: 'Ej. #ecb613' }),
  f('ident.tipografia', 'Tipografía de marca', 'identidad'),
  fp('ident.premios', 'Premios y reconocimientos', 'identidad', 'list', { hint: 'Uno por línea' }),
];

const G_CONTACTO: readonly ProviderFieldDef[] = [
  fp('cont.telefono_principal', 'Teléfono principal', 'contacto', 'phone', { requiredForSale: true }),
  fp('cont.telefono_whatsapp', 'WhatsApp', 'contacto', 'phone'),
  f('cont.telefono_alt', 'Teléfono alternativo', 'contacto', 'phone'),
  fp('cont.email_principal', 'Email público', 'contacto', 'email'),
  f('cont.email_reservas', 'Email de reservas', 'contacto', 'email'),
  f('cont.email_facturacion', 'Email de facturación', 'contacto', 'email', { sensitive: true }),
  fp('cont.web', 'Sitio web', 'contacto', 'url'),
  fp('cont.instagram', 'Instagram', 'contacto', 'url'),
  f('cont.facebook', 'Facebook', 'contacto', 'url'),
  fp('cont.tiktok', 'TikTok', 'contacto', 'url'),
  fp('cont.youtube', 'YouTube', 'contacto', 'url'),
  f('cont.linkedin', 'LinkedIn', 'contacto', 'url'),
  f('cont.pinterest', 'Pinterest', 'contacto', 'url'),
  f('cont.google_business', 'Ficha Google Business', 'contacto', 'url'),
  fp('cont.horario_atencion', 'Horario de atención', 'contacto', 'text', { hint: 'Ej. L-V 09:00-20:00' }),
  fp('cont.tiempo_respuesta_min', 'Tiempo de respuesta (min)', 'contacto', 'number'),
  fp('cont.persona_publica', 'Persona de contacto pública', 'contacto'),
  fp('cont.acepta_whatsapp', 'Acepta WhatsApp', 'contacto', 'boolean'),
];

const G_FISCAL: readonly ProviderFieldDef[] = [
  f('fisc.forma_juridica', 'Forma jurídica', 'fiscal', 'select', {
    options: ['Autónomo', 'Sociedad Limitada', 'Cooperativa', 'Asociación', 'Fundación', 'Otro'],
  }),
  f('fisc.razon_social', 'Razón social completa', 'fiscal'),
  f('fisc.domicilio_fiscal', 'Domicilio fiscal', 'fiscal'),
  f('fisc.iban', 'IBAN', 'fiscal', 'text', { sensitive: true, hint: 'Nunca público: sólo tras captura de lead' }),
  f('fisc.titular_cuenta', 'Titular de la cuenta', 'fiscal', 'text', { sensitive: true }),
  f('fisc.dpo_email', 'Email del DPO / RGPD', 'fiscal', 'email', { sensitive: true }),
  fp('fisc.politica_privacidad_url', 'Política de privacidad', 'fiscal', 'url'),
  f('fisc.aviso_legal_url', 'Aviso legal', 'fiscal', 'url'),
  fp('fisc.seguro_rc', 'Seguro de responsabilidad civil', 'fiscal', 'boolean'),
  fp('fisc.aseguradora', 'Aseguradora', 'fiscal'),
  f('fisc.poliza_rc', 'Número de póliza RC', 'fiscal', 'text', { sensitive: true }),
  f('fisc.poliza_rc_vencimiento', 'Vencimiento de la póliza', 'fiscal', 'date'),
  fp('fisc.licencia_apertura', 'Licencia de apertura', 'fiscal'),
  f('fisc.sgae_numero', 'Número de licencia SGAE', 'fiscal'),
  fp('fisc.canon_sgae_incluido', 'Canon SGAE incluido', 'fiscal', 'boolean'),
  f('fisc.contrato_modelo_url', 'Contrato modelo (PDF)', 'fiscal', 'url', { sensitive: true }),
];

const G_UBICACION: readonly ProviderFieldDef[] = [
  fp('ubic.direccion', 'Dirección', 'ubicacion'),
  fp('ubic.municipio', 'Municipio', 'ubicacion', 'text', { requiredForSale: true }),
  fp('ubic.provincia', 'Provincia', 'ubicacion', 'text', { requiredForSale: true }),
  f('ubic.cp', 'Código postal', 'ubicacion'),
  f('ubic.pais', 'País', 'ubicacion'),
  f('ubic.lat', 'Latitud', 'ubicacion', 'number'),
  f('ubic.lng', 'Longitud', 'ubicacion', 'number'),
  fp('ubic.google_maps_url', 'Enlace a Google Maps', 'ubicacion', 'url'),
  fp('ubic.km_gratuitos', 'Km incluidos sin coste', 'ubicacion', 'number'),
  fp('ubic.precio_km_extra_eur', 'Precio por km extra (€)', 'ubicacion', 'currency'),
  fp('ubic.radio_cobertura_km', 'Radio de cobertura (km)', 'ubicacion', 'number'),
  fp('ubic.provincias_cobertura', 'Provincias de cobertura', 'ubicacion', 'list'),
  fp('ubic.desplazamiento_internacional', 'Desplazamiento internacional', 'ubicacion', 'boolean'),
  f('ubic.suplemento_hotel_eur', 'Suplemento hotel (€)', 'ubicacion', 'currency'),
  f('ubic.hora_limite_hotel', 'Hora límite de hotel', 'ubicacion', 'text', { hint: 'HH:MM' }),
  fp('ubic.parking_clientes', 'Parking para clientes', 'ubicacion', 'boolean'),
];

// ════════════════════════════════════════════════════════════════════════════
// NÚCLEO COMÚN — tarifas, pagos, reservas y operativa
// ════════════════════════════════════════════════════════════════════════════
const G_TARIFAS: readonly ProviderFieldDef[] = [
  fp('tar.tarifa_base_eur', 'Tarifa base declarada (€)', 'tarifas', 'currency', { requiredForSale: true }),
  f('tar.moneda', 'Moneda', 'tarifas', 'select', { options: ['EUR', 'USD', 'GBP', 'CHF'] }),
  fp('tar.precio_desde_eur', 'Precio desde (€)', 'tarifas', 'currency'),
  fp('tar.precio_hasta_eur', 'Precio hasta (€)', 'tarifas', 'currency'),
  fp('tar.precio_por_pax_eur', 'Precio por persona (€)', 'tarifas', 'currency'),
  fp('tar.pax_minimo', 'PAX mínimo', 'tarifas', 'number'),
  fp('tar.pax_maximo', 'PAX máximo', 'tarifas', 'number'),
  fp('tar.duracion_estandar_min', 'Duración estándar (min)', 'tarifas', 'number'),
  fp('tar.precio_hora_extra_eur', 'Hora extra (€)', 'tarifas', 'currency'),
  fp('tar.suplemento_nocturno_eur', 'Suplemento nocturno (€)', 'tarifas', 'currency'),
  f('tar.suplemento_festivo_eur', 'Suplemento festivo (€)', 'tarifas', 'currency'),
  fp('tar.iva_incluido', 'IVA incluido en tarifa', 'tarifas', 'boolean'),
  f('tar.iva_pct', 'IVA aplicable (%)', 'tarifas', 'percent'),
  f('tar.anticipo_pct', 'Anticipo exigido (%)', 'tarifas', 'percent', { requiredForSale: true }),
  f('tar.anticipo_minimo_eur', 'Anticipo mínimo (€)', 'tarifas', 'currency', { requiredForSale: true }),
  f('tar.deposito_garantia_eur', 'Depósito de garantía (€)', 'tarifas', 'currency'),
  f('tar.validez_oferta_dias', 'Validez de la oferta (días)', 'tarifas', 'number'),
  f('tar.notas_tarifa', 'Notas de tarifa', 'tarifas', 'textarea'),
];

const G_PAGOS: readonly ProviderFieldDef[] = [
  fp('pag.acepta_efectivo', 'Acepta efectivo', 'pagos', 'boolean'),
  fp('pag.acepta_transferencia', 'Acepta transferencia', 'pagos', 'boolean'),
  fp('pag.acepta_bizum', 'Acepta Bizum', 'pagos', 'boolean'),
  fp('pag.acepta_tarjeta', 'Acepta tarjeta', 'pagos', 'boolean'),
  fp('pag.acepta_stripe', 'Acepta Stripe', 'pagos', 'boolean'),
  fp('pag.acepta_paypal', 'Acepta PayPal', 'pagos', 'boolean'),
  fp('pag.acepta_cripto', 'Acepta criptomonedas', 'pagos', 'boolean'),
  fp('pag.cripto_monedas', 'Criptomonedas aceptadas', 'pagos', 'list', { hint: 'BTC, ETH, USDT...' }),
  f('pag.bizum_telefono', 'Teléfono Bizum', 'pagos', 'phone', { sensitive: true }),
  f('pag.paypal_email', 'Email PayPal', 'pagos', 'email', { sensitive: true }),
  f('pag.stripe_account_id', 'Cuenta Stripe Connect', 'pagos', 'text', { sensitive: true }),
  fp('pag.instrucciones_pago', 'Instrucciones de pago', 'pagos', 'textarea'),
  f('pag.factura_simplificada', 'Emite factura simplificada', 'pagos', 'boolean'),
  f('pag.recargo_tarjeta_pct', 'Recargo por tarjeta (%)', 'pagos', 'percent'),
];

const G_RESERVAS: readonly ProviderFieldDef[] = [
  fp('res.antelacion_minima_dias', 'Antelación mínima (días)', 'reservas', 'number'),
  f('res.antelacion_maxima_dias', 'Antelación máxima (días)', 'reservas', 'number'),
  f('res.dias_bloqueados', 'Días bloqueados', 'reservas', 'list', { hint: 'Lunes, Martes...' }),
  fp('res.temporada_alta', 'Temporada alta', 'reservas', 'list'),
  fp('res.politica_cancelacion', 'Política de cancelación', 'reservas', 'textarea'),
  fp('res.cancelacion_gratis_dias', 'Cancelación gratuita (días antes)', 'reservas', 'number'),
  f('res.penalizacion_cancelacion_pct', 'Penalización por cancelación (%)', 'reservas', 'percent'),
  fp('res.politica_lluvia', 'Política de lluvia', 'reservas', 'textarea'),
  f('res.fuerza_mayor', 'Cláusula de fuerza mayor', 'reservas', 'textarea'),
  fp('res.sustituto_homologado', 'Garantiza sustituto homologado', 'reservas', 'boolean'),
  fp('res.deposito_deducible', 'Depósito 100% deducible', 'reservas', 'boolean'),
  f('res.reembolso_deposito', 'Depósito reembolsable', 'reservas', 'boolean'),
  fp('res.politica_reprogramacion', 'Política de reprogramación', 'reservas', 'textarea'),
  fp('res.requiere_contrato', 'Requiere contrato firmado', 'reservas', 'boolean'),
  fp('res.firma_digital', 'Firma digital admitida', 'reservas', 'boolean'),
  fp('res.confirmacion_minutos', 'Confirmación en (min)', 'reservas', 'number'),
  f('res.canal_confirmacion', 'Canal de confirmación', 'reservas', 'select', {
    options: ['WhatsApp', 'Email', 'Llamada', 'Stripe', 'Contrato digital'],
  }),
  f('res.observaciones_reserva', 'Observaciones de reserva', 'reservas', 'textarea'),
];

const G_OPERATIVA: readonly ProviderFieldDef[] = [
  f('op.hora_montaje', 'Hora de montaje', 'operativa', 'text', { hint: 'HH:MM' }),
  f('op.tiempo_montaje_min', 'Tiempo de montaje (min)', 'operativa', 'number'),
  f('op.tiempo_desmontaje_min', 'Tiempo de desmontaje (min)', 'operativa', 'number'),
  f('op.personal_montaje', 'Personas de montaje', 'operativa', 'number'),
  f('op.acceso_horas_antes', 'Acceso permitido (h antes)', 'operativa', 'number'),
  f('op.necesita_corriente', 'Necesita corriente', 'operativa', 'boolean'),
  f('op.necesita_agua', 'Necesita agua', 'operativa', 'boolean'),
  f('op.necesita_camerino', 'Necesita camerino', 'operativa', 'boolean'),
  f('op.necesita_catering_staff', 'Necesita catering de staff', 'operativa', 'boolean'),
  f('op.gestion_residuos', 'Gestiona residuos', 'operativa', 'boolean'),
  f('op.plan_emergencia', 'Plan de emergencia', 'operativa', 'textarea'),
  f('op.contacto_dia_evento', 'Contacto el día del evento', 'operativa', 'phone', { sensitive: true }),
  f('op.margen_seguridad_min', 'Margen de seguridad (min)', 'operativa', 'number'),
  f('op.vehiculo_propio', 'Vehículo propio', 'operativa', 'boolean'),
];

// ════════════════════════════════════════════════════════════════════════════
// NÚCLEO COMÚN — técnica, media, accesibilidad, sostenibilidad e idiomas
// ════════════════════════════════════════════════════════════════════════════
const G_TECNICA: readonly ProviderFieldDef[] = [
  f('tec.potencia_w', 'Potencia del sistema (W)', 'tecnica', 'number'),
  f('tec.potencia_max_w', 'Potencia máxima (W)', 'tecnica', 'number'),
  f('tec.sistema_pa', 'Sistema de PA', 'tecnica'),
  f('tec.mesas_mezclas', 'Mesa de mezclas', 'tecnica'),
  f('tec.microfonos', 'Micrófonos', 'tecnica'),
  f('tec.monitores', 'Monitores de escenario', 'tecnica'),
  f('tec.iluminacion', 'Iluminación', 'tecnica'),
  f('tec.limitador_db', 'Limitador (dBA)', 'tecnica', 'number'),
  fp('tec.cumple_ley_ruido', 'Cumple Ley 37/2003 del Ruido', 'tecnica', 'boolean'),
  f('tec.prueba_sonido_min', 'Prueba de sonido (min)', 'tecnica', 'number'),
  f('tec.equipo_backup', 'Equipo de respaldo', 'tecnica', 'boolean'),
  f('tec.tecnico_propio', 'Técnico propio', 'tecnica', 'boolean'),
];

const G_MEDIA: readonly ProviderFieldDef[] = [
  fp('media.video_presentacion_url', 'Vídeo de presentación', 'media', 'url'),
  fp('media.tour_360_url', 'Tour virtual 360º', 'media', 'url'),
  fp('media.galeria_urls', 'Galería (URLs)', 'media', 'list', { hint: 'Una URL por línea' }),
  fp('media.dossier_pdf_url', 'Dossier en PDF', 'media', 'url'),
  fp('media.video_vertical_url', 'Vídeo vertical (Reel)', 'media', 'url'),
  f('media.reels', 'Reels publicados', 'media', 'list'),
  fp('media.press_kit_url', 'Press kit', 'media', 'url'),
  fp('media.foto_equipo_url', 'Foto del equipo', 'media', 'url'),
  fp('media.video_urls', 'Vídeos del proveedor', 'media', 'list'),
  fp('media.video_count', 'Nº de vídeos', 'media', 'number'),
  fp('media.fotos_count', 'Nº de fotografías', 'media', 'number'),
  f('media.autor_media', 'Autoría de las imágenes', 'media'),
  f('media.licencia_media', 'Licencia de uso', 'media', 'select', {
    options: ['Propias', 'Cedidas por cliente', 'Creative Commons', 'Uso comercial'],
  }),
  f('media.uso_marketing', 'Permite uso en marketing', 'media', 'boolean'),
];

const G_ACCESIBILIDAD: readonly ProviderFieldDef[] = [
  fp('acc.acceso_adaptado', 'Acceso adaptado', 'accesibilidad', 'boolean'),
  fp('acc.rampa', 'Rampa de acceso', 'accesibilidad', 'boolean'),
  fp('acc.ascensor', 'Ascensor', 'accesibilidad', 'boolean'),
  fp('acc.aseos_adaptados', 'Aseos adaptados', 'accesibilidad', 'boolean'),
  fp('acc.plazas_pmr', 'Plazas PMR', 'accesibilidad', 'number'),
  fp('acc.audicion_asistida', 'Bucle de audición asistida', 'accesibilidad', 'boolean'),
  fp('acc.lengua_signos', 'Lengua de signos', 'accesibilidad', 'boolean'),
  fp('acc.zona_tranquila', 'Zona tranquila', 'accesibilidad', 'boolean'),
  fp('acc.personal_formado', 'Personal formado en inclusión', 'accesibilidad', 'boolean'),
  fp('acc.certificado_accesibilidad', 'Certificado de accesibilidad', 'accesibilidad'),
];

const G_SOSTENIBILIDAD: readonly ProviderFieldDef[] = [
  fp('sost.km0', 'Producto de proximidad (km 0)', 'sostenibilidad', 'boolean'),
  fp('sost.ecologico', 'Oferta ecológica', 'sostenibilidad', 'boolean'),
  fp('sost.cero_plastico', 'Política cero plástico', 'sostenibilidad', 'boolean'),
  fp('sost.reciclaje', 'Gestión de reciclaje', 'sostenibilidad', 'boolean'),
  fp('sost.energia_renovable', 'Energía renovable', 'sostenibilidad', 'boolean'),
  fp('sost.huella_co2_kg', 'Huella declarada (kg CO2)', 'sostenibilidad', 'number'),
  fp('sost.compensa_co2', 'Compensa emisiones', 'sostenibilidad', 'boolean'),
  fp('sost.proveedores_locales_pct', 'Proveedores locales (%)', 'sostenibilidad', 'percent'),
];

const G_IDIOMAS: readonly ProviderFieldDef[] = [
  fp('idio.idiomas', 'Idiomas del equipo', 'idiomas', 'list'),
  fp('idio.atencion_idiomas', 'Atención al cliente en', 'idiomas', 'list'),
  fp('idio.documentacion_idiomas', 'Documentación en', 'idiomas', 'list'),
  fp('idio.traductor', 'Traductor disponible', 'idiomas', 'boolean'),
  fp('idio.staff_bilingue', 'Staff bilingüe', 'idiomas', 'boolean'),
  fp('idio.moneda_extranjera', 'Acepta moneda extranjera', 'idiomas', 'boolean'),
];

// ════════════════════════════════════════════════════════════════════════════
// NÚCLEO COMÚN — escaparate bodas.net, FAQ, objeciones y venta cruzada
// ════════════════════════════════════════════════════════════════════════════
const bn = (
  key: string,
  label: string,
  type: ProviderFieldType = 'text',
  extra?: Partial<Omit<ProviderFieldDef, 'key' | 'label' | 'group' | 'type'>>,
): ProviderFieldDef => fp(key, label, 'escaparate', type, { bodasNet: true, ...(extra ?? {}) });

const G_ESCAPARATE: readonly ProviderFieldDef[] = [
  bn('esc.url', 'URL del perfil bodas.net', 'url'),
  bn('esc.id_externo', 'ID externo del escaparate', 'text', { sensitive: true }),
  bn('esc.rating', 'Valoración publicada', 'number'),
  bn('esc.reviews_count', 'Nº de opiniones', 'number'),
  bn('esc.premios', 'Premios del escaparate', 'list'),
  bn('esc.ranking', 'Posición en el ranking'),
  bn('esc.destacado', 'Perfil destacado', 'boolean'),
  bn('esc.respuesta_horas', 'Tiempo medio de respuesta (h)', 'number'),
  bn('esc.perfil_verificado', 'Perfil verificado', 'boolean'),
  bn('esc.ultima_sync', 'Última sincronización', 'date'),
  bn('esc.video_url', 'Vídeo del escaparate', 'url'),
  bn('esc.tour360_url', 'Tour 360º del escaparate', 'url'),
  bn('esc.menu_pdf', 'Carta / menú (PDF)', 'url'),
  bn('esc.tarifas_pdf', 'Tarifas (PDF)', 'url'),
  bn('esc.aforo_publico', 'Aforo publicado'),
  bn('esc.estilos', 'Estilos', 'list'),
  bn('esc.tipos_musica', 'Tipos de música', 'list'),
  bn('esc.servicios_incluidos', 'Servicios incluidos', 'list'),
  bn('esc.servicios_extra', 'Servicios extra', 'list'),
  bn('esc.que_incluye', 'Qué incluye (texto público)', 'textarea'),
  bn('esc.que_no_incluye', 'Qué no incluye', 'textarea'),
  bn('esc.equipo_publico', 'Equipo publicado', 'list'),
  bn('esc.idiomas_publicos', 'Idiomas publicados', 'list'),
  bn('esc.parking', 'Parking en el escaparate', 'boolean'),
  bn('esc.mascotas', 'Admite mascotas', 'boolean'),
  bn('esc.ninos', 'Admite niños', 'boolean'),
  bn('esc.ceremonia', 'Ofrece ceremonia', 'boolean'),
  bn('esc.banquete', 'Ofrece banquete', 'boolean'),
  bn('esc.barra_libre', 'Ofrece barra libre', 'boolean'),
  bn('esc.hora_fin', 'Hora de finalización', 'text', { hint: 'HH:MM' }),
];

const G_FAQ: readonly ProviderFieldDef[] = [1, 2, 3, 4, 5, 6].flatMap((n) => [
  fp(`faq.${n}.pregunta`, `Pregunta frecuente ${n}`, 'faq'),
  fp(`faq.${n}.respuesta`, `Respuesta frecuente ${n}`, 'faq', 'textarea'),
]);

const G_OBJECIONES: readonly ProviderFieldDef[] = [1, 2, 3, 4].flatMap((n) => [
  fp(`obj.${n}.objecion`, `Objeción ${n}`, 'objeciones'),
  fp(`obj.${n}.respuesta`, `Respuesta a la objeción ${n}`, 'objeciones', 'textarea'),
]);

const G_VENTA_CRUZADA: readonly ProviderFieldDef[] = [
  fp('cross.items', 'Servicios complementarios', 'venta_cruzada', 'list', { hint: 'Uno por línea' }),
  fp('cross.nota', 'Nota de venta cruzada', 'venta_cruzada', 'textarea'),
  f('cross.activo', 'Activar venta cruzada', 'venta_cruzada', 'boolean'),
  fp('cross.bundle_1_nombre', 'Pack conjunto 1', 'venta_cruzada'),
  fp('cross.bundle_1_precio_eur', 'Precio pack 1 (€)', 'venta_cruzada', 'currency'),
  fp('cross.bundle_2_nombre', 'Pack conjunto 2', 'venta_cruzada'),
  fp('cross.bundle_2_precio_eur', 'Precio pack 2 (€)', 'venta_cruzada', 'currency'),
  f('cross.upsell_equipos', 'Upsell de equipos de sonido', 'venta_cruzada', 'boolean'),
  f('cross.upsell_equipos_desde_eur', 'Equipos desde (€)', 'venta_cruzada', 'currency'),
  f('cross.publico', 'Mostrar venta cruzada en la ficha', 'venta_cruzada', 'boolean'),
];

// ════════════════════════════════════════════════════════════════════════════
// NÚCLEO COMÚN — reputación, RSC, seguridad y SEO
// ════════════════════════════════════════════════════════════════════════════
const G_REPUTACION: readonly ProviderFieldDef[] = [
  f('rep.rating_manual', 'Valoración manual', 'reputacion', 'number'),
  f('rep.reviews_count_manual', 'Nº de valoraciones manual', 'reputacion', 'number'),
  fp('rep.testimonios', 'Testimonios', 'reputacion', 'list'),
  fp('rep.casos_exito', 'Casos de éxito', 'reputacion', 'list'),
  f('rep.clientes_logos', 'Logos de clientes', 'reputacion', 'list'),
  fp('rep.prensa', 'Apariciones en prensa', 'reputacion', 'list'),
  f('rep.nps', 'NPS declarado', 'reputacion', 'number'),
  f('rep.repetibilidad_pct', 'Clientes que repiten (%)', 'reputacion', 'percent'),
];

const G_RSC: readonly ProviderFieldDef[] = [
  fp('rsc.participa_vimume', 'Colabora con VIMUME', 'rsc', 'boolean'),
  fp('rsc.sesiones_anio', 'Sesiones sociales al año', 'rsc', 'number'),
  fp('rsc.sroi', 'SROI declarado', 'rsc', 'number'),
  f('rsc.donacion_pct', 'Donación social (%)', 'rsc', 'percent'),
  fp('rsc.memoria_url', 'Memoria RSC', 'rsc', 'url'),
  fp('rsc.impacto_texto', 'Texto de impacto social', 'rsc', 'textarea'),
];

const G_SEGURIDAD: readonly ProviderFieldDef[] = [
  fp('seg.plan_evacuacion', 'Plan de evacuación', 'seguridad'),
  fp('seg.extintores', 'Extintores', 'seguridad', 'boolean'),
  fp('seg.botiquin', 'Botiquín', 'seguridad', 'boolean'),
  f('seg.formacion_prl', 'Formación PRL', 'seguridad', 'boolean'),
  f('seg.seguro_rc_importe_eur', 'Importe del seguro RC (€)', 'seguridad', 'currency'),
  fp('seg.protocolo_menores', 'Protocolo de menores', 'seguridad', 'textarea'),
  fp('seg.protocolo_alcohol', 'Protocolo de alcohol', 'seguridad', 'textarea'),
  f('seg.coordinador_seguridad', 'Coordinador de seguridad', 'seguridad', 'text', { sensitive: true }),
];

const G_DIGITAL: readonly ProviderFieldDef[] = [
  f('dig.seo_title', 'Título SEO', 'digital'),
  f('dig.seo_description', 'Meta descripción', 'digital', 'textarea'),
  f('dig.keywords', 'Palabras clave', 'digital', 'list'),
  f('dig.canonical_url', 'URL canónica', 'digital', 'url'),
  f('dig.og_image', 'Imagen Open Graph', 'digital', 'url'),
  f('dig.robots', 'Robots', 'digital', 'select', {
    options: ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'],
  }),
  f('dig.ga4_id', 'ID de GA4', 'digital'),
  f('dig.meta_pixel', 'Píxel de Meta', 'digital'),
  fp('dig.whatsapp_link', 'Enlace directo de WhatsApp', 'digital', 'url'),
  fp('dig.landing_url', 'Landing del proveedor', 'digital', 'url'),
];

// ════════════════════════════════════════════════════════════════════════════
// BLOQUES DE CATEGORÍA — 36 campos cada uno
// ════════════════════════════════════════════════════════════════════════════
const B_ESPACIO: readonly ProviderFieldDef[] = [
  fp('esp.tipo_espacio', 'Tipo de espacio', 'espacio', 'select', {
    options: ['Finca', 'Cortijo', 'Hotel', 'Salón', 'Restaurante', 'Jardín', 'Playa', 'Museo', 'Otro'],
  }),
  fp('esp.aforo_sentados', 'Aforo sentados', 'espacio', 'number'),
  fp('esp.aforo_cocktail', 'Aforo cóctel', 'espacio', 'number'),
  fp('esp.aforo_maximo', 'Aforo máximo', 'espacio', 'number'),
  fp('esp.superficie_m2', 'Superficie total (m²)', 'espacio', 'number'),
  fp('esp.espacios_interiores', 'Nº de espacios interiores', 'espacio', 'number'),
  fp('esp.espacios_exteriores', 'Nº de espacios exteriores', 'espacio', 'number'),
  fp('esp.salon_principal_m2', 'Salón principal (m²)', 'espacio', 'number'),
  fp('esp.ceremonia_exterior', 'Ceremonia en exterior', 'espacio', 'boolean'),
  fp('esp.ceremonia_interior', 'Ceremonia en interior', 'espacio', 'boolean'),
  fp('esp.banquete_sentado', 'Banquete sentado', 'espacio', 'boolean'),
  fp('esp.copa_exterior', 'Cóctel en exterior', 'espacio', 'boolean'),
  fp('esp.hora_inicio', 'Hora de inicio permitida', 'espacio', 'text', { hint: 'HH:MM' }),
  fp('esp.hora_fin', 'Hora de fin permitida', 'espacio', 'text', { hint: 'HH:MM' }),
  fp('esp.hora_limite_musica', 'Hora límite de música', 'espacio', 'text', { hint: 'HH:MM' }),
  fp('esp.exclusividad', 'Exclusividad de uso', 'espacio', 'boolean'),
  fp('esp.dos_eventos_dia', 'Permite dos eventos al día', 'espacio', 'boolean'),
  fp('esp.plan_b_lluvia', 'Plan B de lluvia', 'espacio', 'boolean'),
  fp('esp.plan_b_descripcion', 'Descripción del plan B', 'espacio', 'textarea'),
  fp('esp.suite_novios', 'Suite para los novios', 'espacio', 'boolean'),
  fp('esp.habitaciones', 'Habitaciones', 'espacio', 'number'),
  fp('esp.plazas_hotel', 'Plazas de hotel', 'espacio', 'number'),
  fp('esp.parking_plazas', 'Plazas de parking', 'espacio', 'number'),
  fp('esp.parking_gratis', 'Parking gratuito', 'espacio', 'boolean'),
  fp('esp.acceso_pmr', 'Acceso PMR', 'espacio', 'boolean'),
  fp('esp.cocina_propia', 'Cocina propia', 'espacio', 'boolean'),
  fp('esp.catering_externo_permitido', 'Catering externo permitido', 'espacio', 'boolean'),
  fp('esp.suplemento_catering_externo_eur', 'Suplemento catering externo (€)', 'espacio', 'currency'),
  fp('esp.limitador_sonido', 'Limitador de sonido', 'espacio', 'boolean'),
  f('esp.limitador_db', 'Límite del limitador (dBA)', 'espacio', 'number'),
  f('esp.corriente_kw', 'Potencia eléctrica disponible (kW)', 'espacio', 'number'),
  f('esp.generador', 'Generador disponible', 'espacio', 'boolean'),
  fp('esp.camerino', 'Camerino', 'espacio', 'boolean'),
  fp('esp.camerino_descripcion', 'Descripción del camerino', 'espacio', 'textarea'),
  fp('esp.zonas_verdes', 'Zonas verdes', 'espacio', 'boolean'),
  fp('esp.vistas', 'Vistas destacadas', 'espacio'),
];

const B_GASTRONOMIA: readonly ProviderFieldDef[] = [
  fp('gastro.precio_menu_desde_eur', 'Menú desde (€/pax)', 'gastronomia', 'currency'),
  fp('gastro.precio_menu_hasta_eur', 'Menú hasta (€/pax)', 'gastronomia', 'currency'),
  fp('gastro.pax_minimo', 'PAX mínimo', 'gastronomia', 'number'),
  fp('gastro.menus_disponibles', 'Menús disponibles', 'gastronomia', 'number'),
  fp('gastro.menu_infantil_eur', 'Menú infantil (€)', 'gastronomia', 'currency'),
  fp('gastro.menu_infantil_edad', 'Edad del menú infantil', 'gastronomia'),
  fp('gastro.aperitivo_incluido', 'Aperitivo incluido', 'gastronomia', 'boolean'),
  fp('gastro.copas_bienvenida', 'Copas de bienvenida', 'gastronomia', 'boolean'),
  fp('gastro.barra_libre', 'Barra libre', 'gastronomia', 'boolean'),
  fp('gastro.barra_libre_precio_eur', 'Barra libre (€/pax)', 'gastronomia', 'currency'),
  fp('gastro.barra_libre_horas', 'Horas de barra libre', 'gastronomia', 'number'),
  fp('gastro.barra_libre_marcas', 'Marcas de barra libre', 'gastronomia', 'list'),
  fp('gastro.recena', 'Recena', 'gastronomia', 'boolean'),
  fp('gastro.recena_precio_eur', 'Recena (€/pax)', 'gastronomia', 'currency'),
  fp('gastro.mesa_dulce', 'Mesa dulce', 'gastronomia', 'boolean'),
  fp('gastro.tarta', 'Tarta de celebración', 'gastronomia', 'boolean'),
  fp('gastro.tarta_precio_eur', 'Tarta (€)', 'gastronomia', 'currency'),
  fp('gastro.opciones_veganas', 'Opciones veganas', 'gastronomia', 'boolean'),
  fp('gastro.opciones_sin_gluten', 'Opciones sin gluten', 'gastronomia', 'boolean'),
  fp('gastro.opciones_sin_lactosa', 'Opciones sin lactosa', 'gastronomia', 'boolean'),
  fp('gastro.opciones_vegetarianas', 'Opciones vegetarianas', 'gastronomia', 'boolean'),
  fp('gastro.alergenos_info', 'Información de alérgenos', 'gastronomia', 'textarea'),
  fp('gastro.cocina_tipo', 'Tipo de cocina', 'gastronomia', 'list'),
  fp('gastro.producto_km0_pct', 'Producto km 0 (%)', 'gastronomia', 'percent'),
  fp('gastro.showcooking', 'Showcooking', 'gastronomia', 'boolean'),
  fp('gastro.estaciones', 'Estaciones gastronómicas', 'gastronomia', 'list'),
  fp('gastro.personal_ratio', 'Ratio de personal por PAX', 'gastronomia'),
  fp('gastro.jefe_cocina', 'Jefe de cocina', 'gastronomia'),
  fp('gastro.prueba_menu', 'Prueba de menú', 'gastronomia', 'boolean'),
  fp('gastro.prueba_menu_precio_eur', 'Prueba de menú (€)', 'gastronomia', 'currency'),
  fp('gastro.vajilla_incluida', 'Vajilla incluida', 'gastronomia', 'boolean'),
  fp('gastro.manteleria_color', 'Color de mantelería', 'gastronomia'),
  fp('gastro.servicio_camareros', 'Camareros de sala', 'gastronomia', 'number'),
  fp('gastro.horas_servicio', 'Horas de servicio', 'gastronomia', 'number'),
  fp('gastro.servicio_externo', 'Servicio en finca externa', 'gastronomia', 'boolean'),
  fp('gastro.notas_gastronomia', 'Notas de gastronomía', 'gastronomia', 'textarea'),
];

const B_MUSICA: readonly ProviderFieldDef[] = [
  fp('mus.formato', 'Formato', 'musica', 'select', {
    options: ['Solista', 'Dúo', 'Trío', 'Cuarteto', 'Banda', 'Orquesta', 'Mariachi', 'DJ'],
  }),
  fp('mus.musicos', 'Nº de músicos', 'musica', 'number'),
  fp('mus.voces', 'Nº de voces', 'musica', 'number'),
  fp('mus.duracion_show_min', 'Duración del show (min)', 'musica', 'number'),
  fp('mus.numero_sets', 'Nº de sets', 'musica', 'number'),
  fp('mus.repertorio', 'Repertorio', 'musica', 'list'),
  fp('mus.generos', 'Géneros', 'musica', 'list'),
  fp('mus.idiomas_canciones', 'Idiomas del repertorio', 'musica', 'list'),
  fp('mus.instrumentos', 'Instrumentos', 'musica', 'list'),
  fp('mus.equipo_propio', 'Equipo propio', 'musica', 'boolean'),
  fp('mus.sonido_incluido', 'Sonido incluido', 'musica', 'boolean'),
  fp('mus.sonido_hasta_pax', 'Sonido para (PAX)', 'musica', 'number'),
  fp('mus.iluminacion_incluida', 'Iluminación incluida', 'musica', 'boolean'),
  fp('mus.backline', 'Backline propio', 'musica', 'boolean'),
  fp('mus.mc', 'Servicio de MC', 'musica', 'boolean'),
  fp('mus.cancion_personalizada', 'Canción personalizada', 'musica', 'boolean'),
  fp('mus.cancion_personalizada_eur', 'Canción personalizada (€)', 'musica', 'currency'),
  fp('mus.premiere_cancion', 'Estreno en directo', 'musica', 'boolean'),
  fp('mus.momento_ceremonia', 'Actúa en ceremonia', 'musica', 'boolean'),
  fp('mus.momento_aperitivo', 'Actúa en aperitivo', 'musica', 'boolean'),
  fp('mus.momento_banquete', 'Actúa en banquete', 'musica', 'boolean'),
  fp('mus.momento_baile', 'Actúa en el baile', 'musica', 'boolean'),
  fp('mus.momento_recena', 'Actúa en la recena', 'musica', 'boolean'),
  fp('mus.hora_inicio', 'Hora de inicio', 'musica', 'text', { hint: 'HH:MM' }),
  fp('mus.hora_fin', 'Hora de fin', 'musica', 'text', { hint: 'HH:MM' }),
  fp('mus.dress_code', 'Código de vestimenta', 'musica'),
  fp('mus.vestuario_incluido', 'Vestuario incluido', 'musica', 'boolean'),
  fp('mus.ensayo_previo', 'Ensayo previo', 'musica', 'boolean'),
  fp('mus.desplazamiento_incluido', 'Desplazamiento incluido', 'musica', 'boolean'),
  fp('mus.requiere_camerino', 'Requiere camerino', 'musica', 'boolean'),
  f('mus.limitador_dba', 'Limitador (dBA)', 'musica', 'number'),
  fp('mus.sustituto_garantizado', 'Sustituto garantizado', 'musica', 'boolean'),
  fp('mus.show_fuego', 'Show con fuego', 'musica', 'boolean'),
  fp('mus.confeti', 'Confeti', 'musica', 'boolean'),
  fp('mus.video_promo', 'Vídeo promocional', 'musica', 'url'),
  fp('mus.notas_musica', 'Notas musicales', 'musica', 'textarea'),
];

const B_TECNICA: readonly ProviderFieldDef[] = [
  fp('tecn.sistema_pa_marca', 'Marca del sistema PA', 'tecnica'),
  fp('tecn.potencia_total_w', 'Potencia total (W)', 'tecnica', 'number'),
  fp('tecn.potencia_max_w', 'Potencia máxima (W)', 'tecnica', 'number'),
  fp('tecn.cajas', 'Cajas acústicas', 'tecnica', 'number'),
  fp('tecn.subwoofers', 'Subwoofers', 'tecnica', 'number'),
  fp('tecn.mesas_mezclas', 'Mesa de mezclas', 'tecnica'),
  fp('tecn.canales_mesa', 'Canales de mesa', 'tecnica', 'number'),
  fp('tecn.microfonos_num', 'Micrófonos', 'tecnica', 'number'),
  fp('tecn.microfonos_tipo', 'Tipos de micrófono', 'tecnica', 'list'),
  fp('tecn.microfonos_inalambricos', 'Micrófonos inalámbricos', 'tecnica', 'number'),
  fp('tecn.monitores', 'Monitores de escenario', 'tecnica', 'number'),
  fp('tecn.instrumental_dj', 'Instrumental de DJ', 'tecnica', 'boolean'),
  fp('tecn.iluminacion_tipo', 'Tipos de iluminación', 'tecnica', 'list'),
  fp('tecn.iluminacion_w', 'Potencia de iluminación (W)', 'tecnica', 'number'),
  fp('tecn.estructuras', 'Estructuras y truss', 'tecnica', 'boolean'),
  fp('tecn.andamio', 'Andamio / torre', 'tecnica', 'boolean'),
  fp('tecn.maquina_humo', 'Máquina de humo', 'tecnica', 'boolean'),
  fp('tecn.chispas_frias', 'Chispas frías', 'tecnica', 'boolean'),
  fp('tecn.laser', 'Láser', 'tecnica', 'boolean'),
  fp('tecn.proyector', 'Proyector', 'tecnica', 'boolean'),
  fp('tecn.pantalla_led', 'Pantalla LED', 'tecnica', 'boolean'),
  fp('tecn.operador_tecnico', 'Operador técnico', 'tecnica', 'boolean'),
  fp('tecn.numero_tecnicos', 'Nº de técnicos', 'tecnica', 'number'),
  fp('tecn.prueba_sonido_min', 'Prueba de sonido (min)', 'tecnica', 'number'),
  fp('tecn.hora_montaje', 'Hora de montaje', 'tecnica', 'text', { hint: 'HH:MM' }),
  fp('tecn.horas_montaje', 'Horas de montaje', 'tecnica', 'number'),
  fp('tecn.alquiler_solo', 'Alquiler sin operador', 'tecnica', 'boolean'),
  fp('tecn.instalacion_incluida', 'Instalación incluida', 'tecnica', 'boolean'),
  fp('tecn.transporte_incluido', 'Transporte incluido', 'tecnica', 'boolean'),
  fp('tecn.generador_necesario', 'Requiere generador', 'tecnica', 'boolean'),
  fp('tecn.consumo_kw', 'Consumo (kW)', 'tecnica', 'number'),
  fp('tecn.mantenimiento_incluido', 'Mantenimiento incluido', 'tecnica', 'boolean'),
  fp('tecn.garantia_meses', 'Garantía (meses)', 'tecnica', 'number'),
  fp('tecn.sustitucion_24h', 'Sustitución en 24 h', 'tecnica', 'boolean'),
  fp('tecn.limitador_homologado', 'Limitador homologado', 'tecnica', 'boolean'),
  fp('tecn.notas_tecnica', 'Notas técnicas', 'tecnica', 'textarea'),
];

const B_AUDIOVISUAL: readonly ProviderFieldDef[] = [
  fp('audio.horas_cobertura', 'Horas de cobertura', 'audiovisual', 'number'),
  fp('audio.horas_extra_precio_eur', 'Hora extra (€)', 'audiovisual', 'currency'),
  fp('audio.fotografos', 'Nº de fotógrafos', 'audiovisual', 'number'),
  fp('audio.videografos', 'Nº de videógrafos', 'audiovisual', 'number'),
  fp('audio.dron', 'Tomas con dron', 'audiovisual', 'boolean'),
  fp('audio.dron_precio_eur', 'Dron (€)', 'audiovisual', 'currency'),
  fp('audio.video_resumen', 'Vídeo resumen', 'audiovisual', 'boolean'),
  fp('audio.duracion_resumen_min', 'Duración del resumen (min)', 'audiovisual', 'number'),
  fp('audio.video_completo', 'Vídeo completo del evento', 'audiovisual', 'boolean'),
  fp('audio.entrega_dias', 'Entrega en (días)', 'audiovisual', 'number'),
  fp('audio.fotos_entregadas', 'Fotografías entregadas', 'audiovisual', 'number'),
  fp('audio.retoque', 'Retoque profesional', 'audiovisual', 'boolean'),
  fp('audio.retoque_dias', 'Días de retoque', 'audiovisual', 'number'),
  fp('audio.album_incluido', 'Álbum incluido', 'audiovisual', 'boolean'),
  fp('audio.album_precio_eur', 'Álbum (€)', 'audiovisual', 'currency'),
  fp('audio.pareja_posts', 'Sesión de pareja', 'audiovisual', 'boolean'),
  fp('audio.pre_boda', 'Sesión pre-boda', 'audiovisual', 'boolean'),
  fp('audio.post_boda', 'Sesión post-boda', 'audiovisual', 'boolean'),
  fp('audio.sesion_previa', 'Sesión previa incluida', 'audiovisual', 'boolean'),
  fp('audio.galeria_online', 'Galería online', 'audiovisual', 'boolean'),
  fp('audio.galeria_meses', 'Meses de galería activa', 'audiovisual', 'number'),
  fp('audio.descarga_alta_res', 'Descarga en alta resolución', 'audiovisual', 'boolean'),
  fp('audio.raw_incluido', 'Ficheros RAW incluidos', 'audiovisual', 'boolean'),
  fp('audio.formatos', 'Formatos de entrega', 'audiovisual', 'list'),
  fp('audio.derechos_uso', 'Derechos de uso', 'audiovisual'),
  fp('audio.estilo', 'Estilo fotográfico', 'audiovisual', 'list'),
  fp('audio.equipo_camaras', 'Cámaras', 'audiovisual', 'list'),
  fp('audio.equipo_opticas', 'Ópticas', 'audiovisual', 'list'),
  fp('audio.iluminacion_propia', 'Iluminación propia', 'audiovisual', 'boolean'),
  fp('audio.backup_equipo', 'Equipo de respaldo', 'audiovisual', 'boolean'),
  fp('audio.segundo_operador', 'Segundo operador', 'audiovisual', 'boolean'),
  fp('audio.cover_video', 'Vídeo de portada', 'audiovisual', 'boolean'),
  fp('audio.audio_video', 'Audio profesional en vídeo', 'audiovisual', 'boolean'),
  fp('audio.plazo_entrega_max_dias', 'Plazo máximo de entrega (días)', 'audiovisual', 'number'),
  fp('audio.portfolio_url', 'Portfolio', 'audiovisual', 'url'),
  fp('audio.notas_audiovisual', 'Notas audiovisuales', 'audiovisual', 'textarea'),
];

const B_ESTETICA: readonly ProviderFieldDef[] = [
  fp('est.tipo_servicio', 'Tipo de servicio', 'estetica', 'list'),
  fp('est.estilos', 'Estilos', 'estetica', 'list'),
  fp('est.paletas', 'Paletas de color', 'estetica', 'list'),
  fp('est.ramo_novia', 'Ramo de novia', 'estetica', 'boolean'),
  fp('est.ramo_precio_eur', 'Ramo (€)', 'estetica', 'currency'),
  fp('est.prendido', 'Prendido', 'estetica', 'boolean'),
  fp('est.prendido_precio_eur', 'Prendido (€)', 'estetica', 'currency'),
  fp('est.centros_mesa', 'Centros de mesa', 'estetica', 'boolean'),
  fp('est.centros_mesa_precio_eur', 'Centros de mesa (€)', 'estetica', 'currency'),
  fp('est.arco_ceremonia', 'Arco de ceremonia', 'estetica', 'boolean'),
  fp('est.arco_precio_eur', 'Arco (€)', 'estetica', 'currency'),
  fp('est.alfombra_pasillo', 'Alfombra de pasillo', 'estetica', 'boolean'),
  fp('est.letras_gigantes', 'Letras gigantes', 'estetica', 'boolean'),
  fp('est.guirnaldas', 'Guirnaldas', 'estetica', 'boolean'),
  fp('est.photocall', 'Photocall', 'estetica', 'boolean'),
  fp('est.photocall_precio_eur', 'Photocall (€)', 'estetica', 'currency'),
  fp('est.flores_naturales', 'Flores naturales', 'estetica', 'boolean'),
  fp('est.flores_artificiales', 'Flores artificiales', 'estetica', 'boolean'),
  fp('est.flores_temporada', 'Flores de temporada', 'estetica', 'list'),
  fp('est.montaje_incluido', 'Montaje incluido', 'estetica', 'boolean'),
  fp('est.desmontaje_incluido', 'Desmontaje incluido', 'estetica', 'boolean'),
  fp('est.horas_montaje', 'Horas de montaje', 'estetica', 'number'),
  fp('est.muestra_previa', 'Muestra previa', 'estetica', 'boolean'),
  fp('est.muestra_precio_eur', 'Muestra (€)', 'estetica', 'currency'),
  fp('est.personal_montaje', 'Personal de montaje', 'estetica', 'number'),
  fp('est.zona_geografica', 'Zona de trabajo', 'estetica', 'list'),
  fp('est.material_propio', 'Material propio', 'estetica', 'boolean'),
  fp('est.alquiler_mobiliario', 'Alquiler de mobiliario', 'estetica', 'boolean'),
  fp('est.sillas_tiffany', 'Sillas Tiffany', 'estetica', 'boolean'),
  fp('est.manteleria', 'Mantelería', 'estetica', 'boolean'),
  fp('est.iluminacion_decorativa', 'Iluminación decorativa', 'estetica', 'boolean'),
  fp('est.velas', 'Velas y candelabros', 'estetica', 'boolean'),
  fp('est.inflables', 'Elementos inflables', 'estetica', 'boolean'),
  fp('est.tematica_personalizada', 'Temática personalizada', 'estetica', 'boolean'),
  fp('est.portfolio_url', 'Portfolio', 'estetica', 'url'),
  fp('est.notas_estetica', 'Notas de decoración', 'estetica', 'textarea'),
];

const B_TRANSPORTE: readonly ProviderFieldDef[] = [
  fp('trans.tipo_flota', 'Tipos de vehículo', 'transporte', 'list'),
  fp('trans.vehiculos', 'Nº de vehículos', 'transporte', 'number'),
  fp('trans.plazas_por_vehiculo', 'Plazas por vehículo', 'transporte', 'number'),
  fp('trans.plazas_max_pax', 'Plazas totales', 'transporte', 'number'),
  fp('trans.modelos', 'Modelos disponibles', 'transporte', 'list'),
  fp('trans.color_vehiculo', 'Color de los vehículos', 'transporte'),
  fp('trans.decoracion_incluida', 'Decoración incluida', 'transporte', 'boolean'),
  fp('trans.chauffeur', 'Chófer profesional', 'transporte', 'boolean'),
  fp('trans.horas_incluidas', 'Horas incluidas', 'transporte', 'number'),
  fp('trans.hora_extra_eur', 'Hora extra (€)', 'transporte', 'currency'),
  fp('trans.kilometros_incluidos', 'Kilómetros incluidos', 'transporte', 'number'),
  fp('trans.km_extra_eur', 'Km extra (€)', 'transporte', 'currency'),
  fp('trans.recogida_incluida', 'Recogida incluida', 'transporte', 'boolean'),
  fp('trans.punto_recogida', 'Punto de recogida', 'transporte'),
  fp('trans.trayectos', 'Nº de trayectos', 'transporte', 'number'),
  fp('trans.vuelta_noche', 'Vuelta de madrugada', 'transporte', 'boolean'),
  fp('trans.vuelta_noche_eur', 'Vuelta de madrugada (€)', 'transporte', 'currency'),
  fp('trans.espera_eur_hora', 'Espera (€/h)', 'transporte', 'currency'),
  fp('trans.peajes_incluidos', 'Peajes incluidos', 'transporte', 'boolean'),
  fp('trans.combustible_incluido', 'Combustible incluido', 'transporte', 'boolean'),
  fp('trans.seguro_pasajeros', 'Seguro de pasajeros', 'transporte', 'boolean'),
  fp('trans.permiso_vtc', 'Permiso VTC', 'transporte', 'boolean'),
  fp('trans.licencia_taxi', 'Licencia de taxi', 'transporte', 'boolean'),
  fp('trans.silla_infantil', 'Silla infantil', 'transporte', 'boolean'),
  fp('trans.acceso_pmr', 'Vehículo adaptado PMR', 'transporte', 'boolean'),
  fp('trans.mascotas', 'Admite mascotas', 'transporte', 'boolean'),
  fp('trans.agua_bienvenida', 'Agua de bienvenida', 'transporte', 'boolean'),
  fp('trans.champan_incluido', 'Champán incluido', 'transporte', 'boolean'),
  fp('trans.invitados_max', 'Invitados máximos', 'transporte', 'number'),
  fp('trans.autobuses', 'Autobuses', 'transporte', 'boolean'),
  fp('trans.lanzadera', 'Servicio lanzadera', 'transporte', 'boolean'),
  fp('trans.lanzadera_horas', 'Horas de lanzadera', 'transporte', 'number'),
  fp('trans.parking_evento', 'Parking en el evento', 'transporte', 'boolean'),
  fp('trans.seguimiento_gps', 'Seguimiento GPS', 'transporte', 'boolean'),
  fp('trans.portfolio_url', 'Portfolio', 'transporte', 'url'),
  fp('trans.notas_transporte', 'Notas de transporte', 'transporte', 'textarea'),
];

const B_PROTOCOLO: readonly ProviderFieldDef[] = [
  fp('proto.tipo_servicio', 'Servicios de organización', 'protocolo', 'list'),
  fp('proto.eventos_gestionados', 'Eventos gestionados', 'protocolo', 'number'),
  fp('proto.coordinacion_dia', 'Coordinación del día B', 'protocolo', 'boolean'),
  fp('proto.horas_coordinacion', 'Horas de coordinación', 'protocolo', 'number'),
  fp('proto.coordinador', 'Coordinador asignado', 'protocolo', 'boolean'),
  fp('proto.azafatas', 'Azafatas', 'protocolo', 'number'),
  fp('proto.invitados_max', 'Invitados máximos', 'protocolo', 'number'),
  fp('proto.gestion_proveedores', 'Gestión de proveedores', 'protocolo', 'boolean'),
  fp('proto.negociacion_precios', 'Negociación de precios', 'protocolo', 'boolean'),
  fp('proto.timeline', 'Timeline del evento', 'protocolo', 'boolean'),
  fp('proto.plan_ensayo', 'Plan de ensayo', 'protocolo', 'boolean'),
  fp('proto.ensayo_incluido', 'Ensayo incluido', 'protocolo', 'boolean'),
  fp('proto.ceremonia_civil', 'Ceremonia civil', 'protocolo', 'boolean'),
  fp('proto.ceremonia_religiosa', 'Ceremonia religiosa', 'protocolo', 'boolean'),
  fp('proto.gestion_invitados', 'Gestión de invitados', 'protocolo', 'boolean'),
  fp('proto.rrpp', 'Relaciones públicas', 'protocolo', 'boolean'),
  fp('proto.menu_diseno', 'Diseño de menú', 'protocolo', 'boolean'),
  fp('proto.presupuesto_control', 'Control de presupuesto', 'protocolo', 'boolean'),
  fp('proto.pagos_proveedores', 'Pagos a proveedores', 'protocolo', 'boolean'),
  fp('proto.plan_b', 'Plan B integral', 'protocolo', 'boolean'),
  fp('proto.idiomas_equipo', 'Idiomas del equipo', 'protocolo', 'list'),
  fp('proto.personal_boda', 'Personal asignado', 'protocolo', 'number'),
  fp('proto.decoracion_incluida', 'Decoración incluida', 'protocolo', 'boolean'),
  fp('proto.invitaciones', 'Invitaciones', 'protocolo', 'boolean'),
  fp('proto.detalles_invitados', 'Detalles para invitados', 'protocolo', 'boolean'),
  fp('proto.gestion_alojamiento', 'Gestión de alojamiento', 'protocolo', 'boolean'),
  fp('proto.transporte_invitados', 'Transporte de invitados', 'protocolo', 'boolean'),
  fp('proto.licencias_permisos', 'Licencias y permisos', 'protocolo', 'boolean'),
  fp('proto.seguro_evento', 'Seguro de evento', 'protocolo', 'boolean'),
  fp('proto.reunion_previa', 'Reunión previa', 'protocolo', 'boolean'),
  fp('proto.reuniones_incluidas', 'Reuniones incluidas', 'protocolo', 'number'),
  fp('proto.app_seguimiento', 'App de seguimiento', 'protocolo', 'boolean'),
  fp('proto.responsable_unico', 'Responsable único', 'protocolo', 'boolean'),
  fp('proto.horas_extra_eur', 'Hora extra de coordinación (€)', 'protocolo', 'currency'),
  fp('proto.portfolio_url', 'Portfolio', 'protocolo', 'url'),
  fp('proto.notas_protocolo', 'Notas de organización', 'protocolo', 'textarea'),
];

const B_ANIMACION: readonly ProviderFieldDef[] = [
  fp('anim.tipo_servicio', 'Tipo de animación', 'animacion', 'list'),
  fp('anim.edad_min', 'Edad mínima', 'animacion', 'number'),
  fp('anim.edad_max', 'Edad máxima', 'animacion', 'number'),
  fp('anim.monitores', 'Nº de monitores', 'animacion', 'number'),
  fp('anim.ratio_monitor_ninos', 'Ratio monitor/niño', 'animacion'),
  fp('anim.horas_incluidas', 'Horas incluidas', 'animacion', 'number'),
  fp('anim.hora_extra_eur', 'Hora extra (€)', 'animacion', 'currency'),
  fp('anim.inchables', 'Inchables', 'animacion', 'boolean'),
  fp('anim.castillo', 'Castillo hinchable', 'animacion', 'boolean'),
  fp('anim.tobogan', 'Tobogán', 'animacion', 'boolean'),
  fp('anim.pintacaras', 'Pintacaras', 'animacion', 'boolean'),
  fp('anim.globoflexia', 'Globoflexia', 'animacion', 'boolean'),
  fp('anim.juegos', 'Juegos disponibles', 'animacion', 'list'),
  fp('anim.gymkana', 'Gymkana', 'animacion', 'boolean'),
  fp('anim.talleres', 'Talleres', 'animacion', 'boolean'),
  fp('anim.show_infantil', 'Show infantil', 'animacion', 'boolean'),
  fp('anim.personajes', 'Personajes', 'animacion', 'list'),
  fp('anim.dj_infantil', 'DJ infantil', 'animacion', 'boolean'),
  fp('anim.fotomat', 'Fotomatón', 'animacion', 'boolean'),
  fp('anim.fotomat_precio_eur', 'Fotomatón (€)', 'animacion', 'currency'),
  fp('anim.video_360', 'Vídeo 360º', 'animacion', 'boolean'),
  fp('anim.cabina_dj', 'Cabina de DJ', 'animacion', 'boolean'),
  fp('anim.humo', 'Máquina de humo', 'animacion', 'boolean'),
  fp('anim.chispas', 'Chispas frías', 'animacion', 'boolean'),
  fp('anim.sonido_incluido', 'Sonido incluido', 'animacion', 'boolean'),
  fp('anim.iluminacion_incluida', 'Iluminación incluida', 'animacion', 'boolean'),
  fp('anim.zona_tranquila', 'Zona de descanso', 'animacion', 'boolean'),
  fp('anim.espacio_min_m2', 'Espacio mínimo (m²)', 'animacion', 'number'),
  fp('anim.interior_exterior', 'Interior o exterior', 'animacion', 'select', {
    options: ['Interior', 'Exterior', 'Ambos'],
  }),
  fp('anim.plan_lluvia', 'Plan de lluvia', 'animacion', 'boolean'),
  fp('anim.staff_vestuario', 'Vestuario del staff', 'animacion'),
  fp('anim.gestion_residuos', 'Gestión de residuos', 'animacion', 'boolean'),
  fp('anim.seguro_rc', 'Seguro RC', 'animacion', 'boolean'),
  fp('anim.personal_extra_eur', 'Personal extra (€)', 'animacion', 'currency'),
  fp('anim.portfolio_url', 'Portfolio', 'animacion', 'url'),
  fp('anim.notas_animacion', 'Notas de animación', 'animacion', 'textarea'),
];

const B_SENIOR: readonly ProviderFieldDef[] = [
  fp('sen.tipo_centro', 'Tipo de centro', 'senior', 'select', {
    options: ['Residencia', 'Centro de día', 'Hogar del pensionista', 'Servicio a domicilio', 'Otro'],
  }),
  fp('sen.plazas_centro', 'Plazas del centro', 'senior', 'number'),
  fp('sen.residentes_atendidos', 'Residentes atendidos', 'senior', 'number'),
  fp('sen.ratio_terapeuta', 'Ratio terapeuta/residente', 'senior'),
  fp('sen.sesiones_mes', 'Sesiones al mes', 'senior', 'number'),
  fp('sen.duracion_sesion_min', 'Duración de sesión (min)', 'senior', 'number'),
  fp('sen.protocolo_40hz', 'Protocolo 40 Hz Gamma', 'senior', 'boolean'),
  fp('sen.frecuencia_gamma', 'Frecuencia aplicada (Hz)', 'senior'),
  fp('sen.grupo_max_pax', 'Máximo por grupo', 'senior', 'number'),
  fp('sen.sesion_individual', 'Sesión individual', 'senior', 'boolean'),
  fp('sen.sesion_grupal', 'Sesión grupal', 'senior', 'boolean'),
  fp('sen.evaluacion_inicial', 'Evaluación inicial', 'senior', 'boolean'),
  fp('sen.escala_evaluacion', 'Escalas de evaluación', 'senior', 'list'),
  fp('sen.informe_clinico', 'Informe clínico', 'senior', 'boolean'),
  fp('sen.informe_dias', 'Días hasta el informe', 'senior', 'number'),
  fp('sen.coordinacion_medica', 'Coordinación médica', 'senior', 'boolean'),
  fp('sen.consentimiento_firmado', 'Consentimiento firmado', 'senior', 'boolean'),
  fp('sen.datos_seudonimizados', 'Datos seudonimizados', 'senior', 'boolean'),
  fp('sen.terapeuta_titulacion', 'Titulación del terapeuta', 'senior'),
  fp('sen.experiencia_anios', 'Años de experiencia', 'senior', 'number'),
  fp('sen.formacion_demencia', 'Formación en demencia', 'senior', 'boolean'),
  fp('sen.estimulacion_cognitiva', 'Estimulación cognitiva', 'senior', 'boolean'),
  fp('sen.musicoterapia_activa', 'Musicoterapia activa', 'senior', 'boolean'),
  fp('sen.musicoterapia_receptiva', 'Musicoterapia receptiva', 'senior', 'boolean'),
  fp('sen.acompanamiento_familiar', 'Acompañamiento familiar', 'senior', 'boolean'),
  fp('sen.formacion_personal', 'Formación al personal del centro', 'senior', 'boolean'),
  fp('sen.medicion_agitacion', 'Medición de agitación', 'senior', 'boolean'),
  fp('sen.reduccion_psicofarmacos_pct', 'Reducción de psicofármacos (%)', 'senior', 'percent'),
  fp('sen.sroi', 'SROI declarado', 'senior', 'number'),
  fp('sen.certificado_rsc', 'Certificado RSC', 'senior', 'boolean'),
  fp('sen.memoria_rsc_url', 'Memoria RSC', 'senior', 'url'),
  fp('sen.ods', 'ODS alineados', 'senior', 'list'),
  fp('sen.ensayo_clinico_url', 'Estudio o ensayo clínico', 'senior', 'url'),
  fp('sen.auditoria_externa', 'Auditoría externa', 'senior', 'boolean'),
  fp('sen.plan_continuidad', 'Plan de continuidad', 'senior', 'textarea'),
  fp('sen.notas_clinicas', 'Notas clínicas', 'senior', 'textarea'),
];

const B_MODA: readonly ProviderFieldDef[] = [
  fp('moda.tipo_prenda', 'Tipo de prenda', 'moda', 'list'),
  fp('moda.tallas', 'Tallas disponibles', 'moda'),
  fp('moda.talla_max', 'Talla máxima', 'moda'),
  fp('moda.colecciones', 'Colecciones', 'moda', 'list'),
  fp('moda.novedades_anio', 'Año de la colección', 'moda', 'number'),
  fp('moda.pruebas_incluidas', 'Pruebas incluidas', 'moda', 'number'),
  fp('moda.pruebas_extra_eur', 'Prueba extra (€)', 'moda', 'currency'),
  fp('moda.dias_entrega', 'Días hasta la entrega', 'moda', 'number'),
  fp('moda.ajustes_incluidos', 'Ajustes incluidos', 'moda', 'boolean'),
  fp('moda.ajustes_ilimitados', 'Ajustes ilimitados', 'moda', 'boolean'),
  fp('moda.confeccion_propia', 'Confección propia', 'moda', 'boolean'),
  fp('moda.tiempo_confeccion_dias', 'Días de confección', 'moda', 'number'),
  fp('moda.alquiler', 'Alquiler disponible', 'moda', 'boolean'),
  fp('moda.alquiler_precio_eur', 'Alquiler (€)', 'moda', 'currency'),
  fp('moda.compra', 'Venta disponible', 'moda', 'boolean'),
  fp('moda.precio_desde_eur', 'Precio desde (€)', 'moda', 'currency'),
  fp('moda.precio_hasta_eur', 'Precio hasta (€)', 'moda', 'currency'),
  fp('moda.velo', 'Velo', 'moda', 'boolean'),
  fp('moda.tocado', 'Tocado', 'moda', 'boolean'),
  fp('moda.complementos', 'Complementos', 'moda', 'list'),
  fp('moda.zapatos', 'Zapatos', 'moda', 'boolean'),
  fp('moda.traje_novio', 'Traje de novio', 'moda', 'boolean'),
  fp('moda.trajes_invitados', 'Trajes de invitados', 'moda', 'boolean'),
  fp('moda.madrinas', 'Vestidos de madrinas', 'moda', 'boolean'),
  fp('moda.infantil', 'Moda infantil', 'moda', 'boolean'),
  fp('moda.tallas_grandes', 'Tallas grandes', 'moda', 'boolean'),
  fp('moda.embarazo', 'Moda de embarazo', 'moda', 'boolean'),
  fp('moda.personalizacion', 'Personalización', 'moda', 'boolean'),
  fp('moda.bordados', 'Bordados', 'moda', 'boolean'),
  fp('moda.tejido', 'Tejidos', 'moda', 'list'),
  fp('moda.color', 'Colores', 'moda', 'list'),
  fp('moda.showroom', 'Showroom propio', 'moda', 'boolean'),
  fp('moda.envio_gratis', 'Envío gratuito', 'moda', 'boolean'),
  fp('moda.devolucion_dias', 'Días de devolución', 'moda', 'number'),
  fp('moda.portfolio_url', 'Portfolio', 'moda', 'url'),
  fp('moda.notas_moda', 'Notas de moda', 'moda', 'textarea'),
];



// ════════════════════════════════════════════════════════════════════════════
// ENSAMBLAJE: CORE + BLOQUES DE CATEGORÍA
// ════════════════════════════════════════════════════════════════════════════
export const CORE_FIELDS: readonly ProviderFieldDef[] = [
  ...G_IDENTIDAD,
  ...G_CONTACTO,
  ...G_FISCAL,
  ...G_UBICACION,
  ...G_TARIFAS,
  ...G_PAGOS,
  ...G_RESERVAS,
  ...G_OPERATIVA,
  ...G_TECNICA,
  ...G_MEDIA,
  ...G_ACCESIBILIDAD,
  ...G_SOSTENIBILIDAD,
  ...G_IDIOMAS,
  ...G_ESCAPARATE,
  ...G_FAQ,
  ...G_OBJECIONES,
  ...G_VENTA_CRUZADA,
  ...G_REPUTACION,
  ...G_RSC,
  ...G_SEGURIDAD,
  ...G_DIGITAL,
];

export type ProviderFieldCategoryKey =
  | 'finca'
  | 'catering'
  | 'musica'
  | 'dj'
  | 'sonido'
  | 'foto'
  | 'decoracion'
  | 'transporte'
  | 'wedding'
  | 'servicios'
  | 'senior_care'
  | 'moda';

export interface ProviderCategoryBlueprint {
  readonly key: ProviderFieldCategoryKey;
  readonly label: string;
  /** Sinónimos aceptados (categorías edge, gremios, slugs y texto libre). */
  readonly aliases: readonly string[];
  readonly blocks: readonly (readonly ProviderFieldDef[])[];
}

export const PROVIDER_CATEGORY_BLUEPRINTS: Readonly<
  Record<ProviderFieldCategoryKey, ProviderCategoryBlueprint>
> = {
  finca: {
    key: 'finca',
    label: 'Fincas y espacios',
    aliases: ['finca', 'fincas', 'cortijo', 'hacienda', 'venue', 'espacio', 'finca_boda', 'jardin'],
    blocks: [B_ESPACIO, B_GASTRONOMIA, B_ESTETICA],
  },
  catering: {
    key: 'catering',
    label: 'Catering y restauración',
    aliases: ['catering', 'restauracion', 'restaurante', 'banquete', 'cocina', 'gastronomia', 'barra'],
    blocks: [B_GASTRONOMIA, B_ESPACIO, B_PROTOCOLO],
  },
  musica: {
    key: 'musica',
    label: 'Música y artistas',
    aliases: ['musica', 'musico', 'musicos', 'solista', 'mariachi', 'orquesta', 'banda', 'grupo', 'cantante', 'artista'],
    blocks: [B_MUSICA, B_TECNICA, B_PROTOCOLO],
  },
  dj: {
    key: 'dj',
    label: 'DJ y discomóvil',
    aliases: ['dj', 'discjockey', 'discomovil', 'disco_movil', 'cabina'],
    blocks: [B_MUSICA, B_TECNICA, B_ANIMACION],
  },
  sonido: {
    key: 'sonido',
    label: 'Sonido e iluminación',
    aliases: ['sonido', 'iluminacion', 'sonido_e_iluminacion', 'equipos', 'audio', 'produccion', 'tecnico'],
    blocks: [B_TECNICA, B_ESPACIO, B_MUSICA],
  },
  foto: {
    key: 'foto',
    label: 'Fotografía y vídeo',
    aliases: ['foto', 'fotos', 'fotografia', 'fotografo', 'video', 'audiovisual', 'videografo', 'drone'],
    blocks: [B_AUDIOVISUAL, B_ESTETICA, B_PROTOCOLO],
  },
  decoracion: {
    key: 'decoracion',
    label: 'Decoración y flores',
    aliases: ['decoracion', 'flores', 'floristeria', 'decorador', 'ambientacion', 'floral'],
    blocks: [B_ESTETICA, B_ESPACIO, B_AUDIOVISUAL],
  },
  transporte: {
    key: 'transporte',
    label: 'Transporte y flota',
    aliases: ['transporte', 'autobus', 'coche', 'vehiculo', 'flota', 'transfer', 'taxi', 'vtc'],
    blocks: [B_TRANSPORTE, B_PROTOCOLO, B_ESPACIO],
  },
  wedding: {
    key: 'wedding',
    label: 'Wedding planner y organización',
    aliases: ['wedding', 'wedding_planner', 'boda', 'bodas', 'planner', 'organizacion', 'protocolo', 'coordinacion'],
    blocks: [B_PROTOCOLO, B_ESPACIO, B_GASTRONOMIA],
  },
  servicios: {
    key: 'servicios',
    label: 'Animación y espectáculos',
    aliases: ['servicios', 'animacion', 'animaciones', 'show', 'espectaculo', 'entretenimiento', 'photocall', 'infantil'],
    blocks: [B_ANIMACION, B_TECNICA, B_PROTOCOLO],
  },
  senior_care: {
    key: 'senior_care',
    label: 'Residencias y terapia senior',
    aliases: ['senior_care', 'senior', 'residencia', 'residencias', 'terapeuta', 'terapia', 'geriatrico', 'centro_dia', 'vimume', 'neuroacustica'],
    blocks: [B_SENIOR, B_PROTOCOLO, B_ESPACIO],
  },
  moda: {
    key: 'moda',
    label: 'Moda nupcial y sastrería',
    aliases: ['moda', 'trajes', 'novia', 'novio', 'vestidos', 'sastreria', 'boutique'],
    blocks: [B_MODA, B_ESTETICA, B_AUDIOVISUAL],
  },
};

/** Categoría por defecto para proveedores sin categoría reconocible. */
export const DEFAULT_PROVIDER_FIELD_CATEGORY: ProviderFieldCategoryKey = 'servicios';

function normalizeCategoryToken(raw: unknown): string {
  return String(raw ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const CATEGORY_LOOKUP: ReadonlyMap<string, ProviderFieldCategoryKey> = (() => {
  const map = new Map<string, ProviderFieldCategoryKey>();
  for (const blueprint of Object.values(PROVIDER_CATEGORY_BLUEPRINTS)) {
    map.set(blueprint.key, blueprint.key);
    for (const alias of blueprint.aliases) map.set(alias, blueprint.key);
  }
  return map;
})();

/** Resuelve la categoría canónica de campos desde cualquier etiqueta de origen. */
export function resolveProviderFieldCategory(raw: unknown): ProviderFieldCategoryKey {
  const token = normalizeCategoryToken(raw);
  if (token.length === 0) return DEFAULT_PROVIDER_FIELD_CATEGORY;
  const direct = CATEGORY_LOOKUP.get(token);
  if (direct !== undefined) return direct;
  for (const [alias, key] of CATEGORY_LOOKUP) {
    if (token.includes(alias)) return key;
  }
  return DEFAULT_PROVIDER_FIELD_CATEGORY;
}

const FIELD_SET_CACHE = new Map<ProviderFieldCategoryKey, readonly ProviderFieldDef[]>();

function assembleFieldSet(category: ProviderFieldCategoryKey): readonly ProviderFieldDef[] {
  const blueprint = PROVIDER_CATEGORY_BLUEPRINTS[category];
  const seen = new Set<string>();
  const fields: ProviderFieldDef[] = [];
  for (const def of [...CORE_FIELDS, ...blueprint.blocks.flat()]) {
    if (seen.has(def.key)) continue;
    seen.add(def.key);
    fields.push(def);
  }
  fields.sort((a, b) => PROVIDER_FIELD_GROUP_ORDER[a.group] - PROVIDER_FIELD_GROUP_ORDER[b.group]);
  return Object.freeze(fields);
}

/**
 * Conjunto exacto de campos editables de un proveedor según su categoría.
 * Idempotente y memoizado: la misma categoría devuelve la MISMA referencia.
 */
export function buildProviderFieldSet(category: unknown): readonly ProviderFieldDef[] {
  const key = resolveProviderFieldCategory(category);
  const cached = FIELD_SET_CACHE.get(key);
  if (cached !== undefined) return cached;
  const built = assembleFieldSet(key);
  FIELD_SET_CACHE.set(key, built);
  return built;
}

/** Definición concreta por clave (o `null` si la clave no pertenece a la categoría). */
export function findProviderFieldDef(category: unknown, fieldKey: unknown): ProviderFieldDef | null {
  const key = String(fieldKey ?? '');
  if (key.length === 0) return null;
  return buildProviderFieldSet(category).find((def) => def.key === key) ?? null;
}

/** Subconjunto publicable: `publicVisible` y NO `sensitive` (fail-closed). */
export function getPublicFieldDefs(category: unknown): readonly ProviderFieldDef[] {
  return buildProviderFieldSet(category).filter(
    (def) => def.publicVisible === true && def.sensitive !== true,
  );
}

/** Campos agrupados por sección, respetando el orden canónico del panel. */
export function groupProviderFields(
  fields: readonly ProviderFieldDef[],
): readonly { group: ProviderFieldGroup; fields: readonly ProviderFieldDef[] }[] {
  const buckets = new Map<ProviderFieldGroupId, ProviderFieldDef[]>();
  for (const def of fields) {
    const bucket = buckets.get(def.group);
    if (bucket === undefined) buckets.set(def.group, [def]);
    else bucket.push(def);
  }
  return PROVIDER_FIELD_GROUPS.filter((group) => buckets.has(group.id)).map((group) => ({
    group,
    fields: Object.freeze(buckets.get(group.id) ?? []),
  }));
}

/** Estadística verificable del catálogo (la usa el auditor de plantillas). */
export function getProviderFieldCatalogStats(): {
  readonly categories: number;
  readonly coreFields: number;
  readonly perCategory: Readonly<Record<ProviderFieldCategoryKey, number>>;
} {
  const perCategory: Partial<Record<ProviderFieldCategoryKey, number>> = {};
  for (const key of Object.keys(PROVIDER_CATEGORY_BLUEPRINTS) as ProviderFieldCategoryKey[]) {
    perCategory[key] = buildProviderFieldSet(key).length;
  }
  return {
    categories: Object.keys(PROVIDER_CATEGORY_BLUEPRINTS).length,
    coreFields: CORE_FIELDS.length,
    perCategory: Object.freeze(perCategory) as Readonly<Record<ProviderFieldCategoryKey, number>>,
  };
}

/** Umbral de dominio: ninguna categoría puede tener menos campos editables. */
export const PROVIDER_FIELD_MIN_PER_CATEGORY = 300;

/**
 * Guardián de integridad del catálogo. Se ejecuta al importar el módulo: si una
 * clave se repite (en el núcleo o dentro de los bloques de una categoría) o una
 * categoría queda por debajo del umbral, el proceso muere en load-time en lugar
 * de servir una ficha silenciosamente incompleta.
 */
function assertCatalogIntegrity(): void {
  const coreKeys = new Set<string>();
  for (const def of CORE_FIELDS) {
    if (coreKeys.has(def.key)) {
      throw new Error(`[provider-field-catalog] clave duplicada en CORE_FIELDS: ${def.key}`);
    }
    coreKeys.add(def.key);
  }
  for (const blueprint of Object.values(PROVIDER_CATEGORY_BLUEPRINTS)) {
    const localKeys = new Set<string>(coreKeys);
    for (const def of blueprint.blocks.flat()) {
      if (localKeys.has(def.key)) {
        throw new Error(`[provider-field-catalog] clave duplicada en ${blueprint.key}: ${def.key}`);
      }
      localKeys.add(def.key);
    }
    const total = buildProviderFieldSet(blueprint.key).length;
    if (total < PROVIDER_FIELD_MIN_PER_CATEGORY) {
      throw new Error(
        `[provider-field-catalog] categoría ${blueprint.key} con ${total} campos < ${PROVIDER_FIELD_MIN_PER_CATEGORY}`,
      );
    }
  }
}

assertCatalogIntegrity();
