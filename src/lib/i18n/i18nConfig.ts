export type SupportedLocale = "es" | "en" | "fr" | "de" | "it" | "pt";

export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  defaultCountry: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleInfo> = {
  es: { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", defaultCountry: "ES" },
  en: { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", defaultCountry: "US" },
  fr: { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", defaultCountry: "FR" },
  de: { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", defaultCountry: "DE" },
  it: { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", defaultCountry: "IT" },
  pt: { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", defaultCountry: "PT" },
};

export const DEFAULT_LOCALE: SupportedLocale = "es";

// Diccionario de Términos Críticos S-Class para Conversión
export const I18N_DICTIONARY: Record<SupportedLocale, Record<string, string>> = {
  es: {
    officialPrice: "Tarifa Oficial Cerrada",
    depositRequired: "Anticipo en Custodia (50%)",
    liveRadar: "Radar en Tiempo Real",
    protectedPayment: "PAGO 100% PROTEGIDO Y CERO PAGOS EN MANO",
    antiFraudGuarantee: "Garantía de puntualidad, asistencia oficial y salvaguarda de tu evento sin cobros en metálico.",
    dispatchRoom: "Sala de Control y Despacho",
    viewDemoVideo: "Ver Vídeo de Muestra Oficial",
    lockDateButton: "Asegurar Fecha con Depósito Protegido",
  },
  en: {
    officialPrice: "Official Fixed Rate",
    depositRequired: "Secured Escrow Deposit (50%)",
    liveRadar: "Real-Time GPS Radar",
    protectedPayment: "100% PROTECTED PAYMENT & ZERO CASH ON ARRIVAL",
    antiFraudGuarantee: "Official punctuality guarantee, certified musicians and full refund protection without cash hassles.",
    dispatchRoom: "Live Dispatch & Control Center",
    viewDemoVideo: "Watch Official Showcase Video",
    lockDateButton: "Secure Date with Protected Deposit",
  },
  fr: {
    officialPrice: "Tarif Officiel Garanti",
    depositRequired: "Acompte Sécurisé (50%)",
    liveRadar: "Radar GPS en Direct",
    protectedPayment: "PAIEMENT 100% SÉCURISÉ & ZÉRO PAIEMENT EN ESPÈCES",
    antiFraudGuarantee: "Garantie de ponctualité, artistes certifiés et protection complète sans argent liquide sur place.",
    dispatchRoom: "Centre de Contrôle & Dispatch",
    viewDemoVideo: "Voir la Vidéo Officielle",
    lockDateButton: "Bloquer la Date avec Dépôt Sécurisé",
  },
  de: {
    officialPrice: "Offizieller Festpreis",
    depositRequired: "Treuhand-Anzahlung (50%)",
    liveRadar: "Echtzeit-GPS-Radar",
    protectedPayment: "100% GESCHÜTZTE ZAHLUNG & KEINE BARZAHLUNG VOR ORT",
    antiFraudGuarantee: "Pünktlichkeitsgarantie, zertifizierte Künstler und voller Schutz ohne Bargeld am Veranstaltungsort.",
    dispatchRoom: "Leitstelle & Live-Verfolgung",
    viewDemoVideo: "Offizielles Demovideo Ansehen",
    lockDateButton: "Termin mit Geschützter Anzahlung Sichern",
  },
  it: {
    officialPrice: "Tariffa Ufficiale Chiusa",
    depositRequired: "Acconto Garantito (50%)",
    liveRadar: "Radar GPS in Tempo Reale",
    protectedPayment: "PAGAMENTO 100% PROTETTO E ZERO CONTANTI ALL'ARRIVO",
    antiFraudGuarantee: "Garanzia di puntualità, musicisti certificati e massima sicurezza senza pagamenti in contanti.",
    dispatchRoom: "Sala Operativa & Monitoraggio",
    viewDemoVideo: "Guarda il Video Ufficiale",
    lockDateButton: "Assicura la Data con Deposito Protetto",
  },
  pt: {
    officialPrice: "Tarifa Oficial Fixa",
    depositRequired: "Sinal Seguro em Custódia (50%)",
    liveRadar: "Radar GPS em Tempo Real",
    protectedPayment: "PAGAMENTO 100% PROTEGIDO E ZERO PAGAMENTOS EM DINHEIRO",
    antiFraudGuarantee: "Garantia de pontualidade, artistas certificados e proteção completa do evento.",
    dispatchRoom: "Central de Despacho e Rastreio",
    viewDemoVideo: "Ver Vídeo Oficial de Amostra",
    lockDateButton: "Garantir Data com Depósito Protegido",
  },
};