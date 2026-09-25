/**
 * 🏛️ EAR OS V2 — ESQUEMA CANÓNICO ULTRA-AMPLIADO DE PROVEEDORES & ARTISTAS
 * -----------------------------------------------------------------------------
 * SSOT S-CLASS: Principio de Fidelidad Absoluta a la Realidad.
 * NUNCA se promete en EAR OS ningún servicio, rider ni precio que el proveedor
 * no tenga expresamente acreditado en su ficha interna o HTML de bóveda auditado.
 * 
 * Cobertura 360° para los 12 gremios de la Mega Base de Datos (85.946 proveedores).
 */

export type ProviderGremio =
  | 'Musico_Solista'
  | 'Duo_Trio_Cuarteto'
  | 'Agrupacion_Mariachi'
  | 'Orquesta_Banda'
  | 'DJ_Discoteca'
  | 'Sonido_Iluminacion'
  | 'Efectos_Especiales'
  | 'Finca_Espacio'
  | 'Catering_Gastronomia'
  | 'Fotografia_Video'
  | 'Decoracion_Flores'
  | 'Animacion_Shows'
  | 'Transporte_Flota'
  | 'Wedding_Planner';

export type VerificationAuditStatus =
  | 'VERIFICADO_SSOT'       // Ficha rellenada/auditada por el propio artista o Edwin (Contratable directo)
  | 'AUDITADO_HTML_BOVEDA'  // Datos fidedignos extraídos de su dossier/web oficial pero pendiente de confirmación de fecha
  | 'TARIFA_ORIENTATIVA'    // No validado personalmente: BLOQUEADA la venta directa a ciegas
  | 'PENDIENTE_CLAIM';      // Proveedor invitado a reclamar su espacio en el panel

export interface ProviderContactDetails {
  nombreComercial: string;
  razonSocial?: string;
  cifNif?: string;
  personaContacto: string;
  cargo: string;
  telefonoMovil: string;
  telefonoWhatsApp: string;
  emailOficial: string;
  sitioWeb?: string;
  instagramHandle?: string;
  youtubeChannel?: string;
}

export interface ProviderLocationAndLogistics {
  direccionSede: string;
  municipio: string;
  provincia: string;
  codigoPostal: string;
  coordenadasGPS?: { lat: number; lng: number };
  radioKmGratuitos: number; // Km incluidos desde su sede antes de aplicar portes
  precioKmExtraCentimos: number; // Coste en céntimos por km adicional
  suplementoNocturnoCentimos: number; // Si la actuación termina pasadas las 03:00 AM
  exigeAlojamientoKm: number; // Distancia en km a partir de la cual exige hotel (ej. 200 km)
}

export interface ProviderPricingMatrix {
  tarifaBaseCentimos: number; // En céntimos enteros (ej. 35000 = 350,00 €)
  duracionPaseEstandarMinutos?: number; // ej. 60, 90, 120 o 240 minutos
  precioHoraExtraCentimos?: number;
  precioPorPaxCentimos?: number; // Para catering y menús (ej. 14500 = 145,00 € / pax)
  minimoComensalesPax?: number; // Para fincas o caterings
  incluyeEquipoSonidoPropio?: boolean;
  potenciaSonidoAportadaW?: number; // ej. 1000W Bose
  precioSuplementoSonidoCentimos?: number; // si el sonido es opcional
  regimenFiscal: 'Autonomo' | 'Sociedad' | 'Cooperativa_Facturacion' | 'Gestion_EAR_OS';
  aplicaSplit801010: boolean; // 80% artista / 10% EAR OS / 10% VIMUME
}

// 1. ESPECIFICACIONES TÉCNICAS PARA MÚSICA & ESPECTÁCULOS
export interface ProviderTechnicalRider {
  instrumentosYAparatosAportados: string[]; // ej. ["Guitarra acústica", "Violín eléctrico", "Shure SM58"]
  necesidadesEscenario: {
    metrosMinimosAncho: number;
    metrosMinimosFondo: number;
    requiereTarima: boolean;
    aptoExteriorSinTecho: boolean;
  };
  requerimientosElectricos: {
    potenciaMinimaKw: number;
    tomasCorriente16A: number;
    tomasCorriente32A: number;
  };
  tiempoMontajeMinutos: number; // minutos necesarios antes del evento
  tiempoPruebaSonidoMinutos: number;
  camerinoZonaDescansoRequerida: boolean;
  exigeMenuStaff: boolean; // ¿Exige catering/cena durante el evento?
}

export interface ProviderShowAndRepertoire {
  generosMusicales: string[];
  repertorioPdfUrl?: string;
  admitePeticionesEspecialesNovios: boolean;
  maximoPeticionesNovios: number;
  diasAntelacionPeticiones: number;
  enlacesAudioVideoDemostracion: Array<{
    titulo: string;
    url: string;
    tipo: 'youtube' | 'spotify' | 'vimeo' | 'mp3' | 'instagram';
  }>;
}

// 2. ESPECIFICACIONES PARA FINCAS & ESPACIOS (9.559 fincas en BBDD)
export interface ProviderFincaSpecs {
  capacidadMinimaPax: number;
  capacidadMaximaPax: number;
  capacidadCocktailPax?: number;
  exclusividadPorDia: boolean; // Solo 1 boda al día
  horaLimiteCelebracion: string; // ej. "05:00 AM"
  limitadorAcusticoDbSPL?: number; // dB homologados permitidos (ej. 75 dB o 95 dB)
  permiteMusicaExterior: boolean;
  cocinaPropia: boolean;
  exigeCateringExclusivo: boolean;
  cateringsHomologados?: string[];
  canonEntradaProveedoresExternosCentimos: number; // Canon si traen catering/fotógrafo de fuera
  disponeSuiteNupcial: boolean;
  habitacionesAlojamientoInvitados: number;
  plazasAparcamientoPrivado: number;
  espacioCeremoniaCivil: boolean;
  espacioCubiertoPlanB: boolean;
  tasaSgaeIncluida: boolean;
}

// 3. ESPECIFICACIONES PARA CATERING & GASTRONOMÍA (4.096 caterings en BBDD)
export interface ProviderCateringSpecs {
  precioMenuDesdeCentimos: number; // ej. 12500 = 125,00 € / pax
  horasBarraLibreIncluidas: number; // ej. 3h o 4h
  precioHoraExtraBarraLibrePaxCentimos: number; // ej. 1000 = 10,00 € / pax / hora
  numeroAperitivosCocktail: number; // ej. 18 referencias
  incluyeEstacionesShowcooking: boolean;
  estacionesDisponibles: string[]; // ej. ["Jamón Ibérico D.O.", "Quesos Artesanos", "Sushi en Directo"]
  menusAdaptadosSinCoste: {
    celiacos: boolean;
    veganosVegetarianos: boolean;
    alergiasMultiples: boolean;
    infantil: boolean;
  };
  precioMenuInfantilCentimos: number;
  pruebaMenuIncluidaPax: number; // ej. 6 comensales
  incluyeVajillaYManteleria: boolean;
  incluyeMobiliarioMesasSillas: boolean;
  ratioCamarerosPorMesa: string; // ej. "1 camarero por cada 10-12 comensales"
  incluyeRecena: boolean;
  opcionesRecena?: string[]; // ej. ["Mini burguers gourmet", "Churros con chocolate"]
}

// 4. ESPECIFICACIONES PARA FOTOGRAFÍA & VÍDEO (35.153 profesionales en BBDD)
export interface ProviderFotoVideoSpecs {
  horasCobertura: number; // ej. 10h o "Día completo desde preparativos hasta 2h baile"
  numeroFotografos: number; // 1 o 2 operadores
  numeroVideografos: number;
  tomasAereasDronCertificadoAesa: boolean;
  incluyeSesionPreboda: boolean;
  incluyeSesionPostboda: boolean;
  formatoEntrega: {
    galeriaOnlinePrivadaHD: boolean;
    usbEnCajaMaderaLujo: boolean;
    albumDigitalPliegos: number; // ej. 60 páginas
    dimensionesAlbumCm?: string; // ej. "30x30 cm"
  };
  plazoMaximoEntregaDias: number; // ej. 30 o 45 días
  teaserExpressRedesSociales: boolean; // Vídeo de 1 min entregado en 7 días
  resolucionVideo: 'FullHD_1080p' | '4K_Cinematografico';
  entregaArchivosEnBruto: boolean;
}

// 5. ESPECIFICACIONES PARA DECORACIÓN & FLORES (1.650 empresas en BBDD)
export interface ProviderDecoracionSpecs {
  incluyeRamoNoviaYPrendidos: boolean;
  arcoCeremoniaCivil: {
    disponible: boolean;
    tipologia: 'Circular' | 'Hexagonal' | 'Columnas_Florales' | 'Puerta_Rustica';
  };
  centrosDeMesa: {
    tipoBajo: boolean;
    tipoAltoElevado: boolean;
    velasYSuspension: boolean;
  };
  seatingPlanYRinconBienvenida: boolean;
  iluminacionDecorativa: {
    guirnaldasMicroLed: boolean;
    cieloEstrelladoExterior: boolean;
    neonPersonalizado: boolean;
  };
  servicioMontajeYRecogidaPostEvento: boolean;
}

// 6. ESPECIFICACIONES PARA TRANSPORTE & FLOTA (1.961 empresas en BBDD)
export interface ProviderTransporteSpecs {
  tiposVehiculosDisponibles: Array<'Microbus_19' | 'Autocar_35' | 'Gran_Autocar_55' | 'Coche_Clasico_Novios' | 'Vehiculo_Lujo_VIP'>;
  regresosEscalonadosNocturnos: number; // ej. 2 horarios de vuelta (03:30 y 05:30)
  permiteParadasIntermediasRuta: boolean;
  seguroObligatorioViajerosIncluido: boolean;
  choferUniformado: boolean;
}

// 7. ESPECIFICACIONES PARA WEDDING PLANNERS & PROTOCOLO (1.011 agencias en BBDD)
export interface ProviderWeddingPlannerSpecs {
  modalidades: Array<'Coordinacion_Dia_B' | 'Organizacion_Integral' | 'Diseno_Y_Styling'>;
  horasPresenciaInSitu: number;
  asistentesCoordinacionInSitu: number; // ej. 2 personas
  elaboracionMinutadoTimingCronometrado: boolean;
  idiomasAtencion: string[]; // ej. ["Español", "Inglés", "Francés"]
}

// 8. ESPECIFICACIONES PARA ANIMACIÓN & SERVICIOS (8.617 empresas en BBDD)
export interface ProviderAnimacionSpecs {
  monitoresInfantilesTitulados: boolean;
  ratioNinosPorMonitor: number; // ej. 8 niños por monitor
  incluyeCenaAsistidaNinos: boolean;
  castilloHinchableHomologado: boolean;
  plataformaVideo360: boolean;
  fotomatonImpresionIlimitada: boolean;
  showsEspeciales: string[]; // ej. ["Zancudos fuego", "Hora loca tematizada", "Magia de cerca"]
}

export interface ProviderPoliciesAndLegal {
  politicaCancelacionLluvia: string;
  politicaCancelacionFuerzaMayor: string;
  disponeSustitutoHomologado: boolean;
  horarioLimiteActuacion?: string; // ej. "04:00 AM"
  seguroResponsabilidadCivil: boolean;
  numeroPolizaRC?: string;
}

export interface UltraProviderProfile {
  idCanonica: string;
  slug: string;
  gremio: ProviderGremio;
  contacto: ProviderContactDetails;
  ubicacion: ProviderLocationAndLogistics;
  tarifas: ProviderPricingMatrix;
  politicas: ProviderPoliciesAndLegal;

  // Especificaciones por sector (campos cubiertos por la mega base de datos)
  rider?: ProviderTechnicalRider;
  repertorio?: ProviderShowAndRepertoire;
  fincaSpecs?: ProviderFincaSpecs;
  cateringSpecs?: ProviderCateringSpecs;
  fotoVideoSpecs?: ProviderFotoVideoSpecs;
  decoracionSpecs?: ProviderDecoracionSpecs;
  transporteSpecs?: ProviderTransporteSpecs;
  weddingPlannerSpecs?: ProviderWeddingPlannerSpecs;
  animacionSpecs?: ProviderAnimacionSpecs;

  // Datos enriquecidos desde los 85.946 proveedores de public/data/providers/
  faqs?: Array<{ question: string; answer: string }>;
  servicesList?: string[];
  imagenesGaleria?: string[];
  aforoMaxPax?: number;
  rating?: number;
  reviewsCount?: number;
  originHtml?: string;
  isClaimed?: boolean;
  estadoHomologacion?: 'CERTIFICADA_GOLD_MASTER' | 'AUDITORIA_VIGENTE' | 'ASOCIADO_STANDARD';
  
  // Auditoría Forense y Filtros Antialucinación
  auditoria: {
    estadoVerificacion: VerificationAuditStatus;
    fechaUltimaAuditoria: string;
    auditorResponsable: string;
    archivoBovedaOrigen?: string; // Enlace al HTML o JSON original en EAR_ABSORBED_VAULT
    camposPendientesDeRellenar: string[];
    bloqueadoParaVentaDirecta: boolean; // TRUE si falta validación (solo cotización orientativa)
    observacionesInternas: string;
  };
}

/**
 * Validador estricto: ¿Puede este proveedor ser prometido o cotizado directamente?
 * Si falta algún dato esencial de rider o tarifa confirmada, se bloquea la venta directa.
 */
export function validarAptitudVentaDirecta(perfil: UltraProviderProfile): {
  apto: boolean;
  motivoBloqueo?: string;
} {
  if (perfil.auditoria.estadoVerificacion !== 'VERIFICADO_SSOT') {
    return {
      apto: false,
      motivoBloqueo: 'El proveedor no ha validado personalmente su ficha en el panel de control. Tarifa estrictamente orientativa.',
    };
  }

  if (perfil.tarifas.tarifaBaseCentimos <= 0 && (!perfil.tarifas.precioPorPaxCentimos || perfil.tarifas.precioPorPaxCentimos <= 0)) {
    return {
      apto: false,
      motivoBloqueo: 'No existe una tarifa base ni precio por comensal registrado en céntimos.',
    };
  }

  if (!perfil.contacto.telefonoMovil && !perfil.contacto.telefonoWhatsApp) {
    return {
      apto: false,
      motivoBloqueo: 'Falta teléfono de contacto directo para confirmación de fecha.',
    };
  }

  return { apto: true };
}
