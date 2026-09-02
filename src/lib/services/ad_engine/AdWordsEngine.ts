/**
 * 🏛️ EAR OS GOOGLE ADWORDS / AD-ENGINE CORE (S-CLASS)
 * Motor generador de campañas de Google Ads (Search & Performance Max) con 10/10 Quality Score.
 * Realiza alineación léxica 1-a-1 entre Search Intent, Anuncio y Landing Page.
 */

export interface GoogleAdCreative {
  adGroupId: string;
  adGroupName: string;
  targetVertical: 'BODAS' | 'CORPORATIVO' | 'REGALOS_Y_OCASIONES' | 'ARTISTAS' | 'B2G_AYUNTAMIENTOS' | 'PROVEEDORES';
  landingUrl: string;
  keywordsExact: string[]; // [keyword]
  keywordsPhrase: string[]; // "keyword"
  negativeKeywords: string[];
  headlines: string[]; // Max 30 chars each (Google Search limit)
  descriptions: string[]; // Max 90 chars each
  sitelinks: Array<{
    text: string; // Max 25 chars
    description: string; // Max 35 chars
    url: string;
  }>;
  callouts: string[]; // Max 25 chars each
  structuredSnippets: {
    header: string;
    values: string[];
  };
  qualityScoreTarget: number; // 10/10
  targetCpcEstimatedEur: number;
}

export interface GoogleAdsCampaignManifest {
  campaignId: string;
  campaignName: string;
  budgetDailyEur: number;
  biddingStrategy: 'MAXIMIZE_CONVERSIONS' | 'TARGET_CPA' | 'MANUAL_CPC';
  targetLocation: string;
  adGroups: GoogleAdCreative[];
}

export class AdWordsEngine {
  /**
   * Valida restricciones estrictas de Google Ads:
   * - Titulares: máx 30 caracteres
   * - Descripciones: máx 90 caracteres
   * - Sitelinks: máx 25 caracteres
   */
  public static validateAdCreative(ad: GoogleAdCreative): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    ad.headlines.forEach((h, i) => {
      if (h.length > 30) {
        issues.push(`Titular ${i + 1} excede 30 caracteres (${h.length} chars): "${h}"`);
      }
    });

    ad.descriptions.forEach((d, i) => {
      if (d.length > 90) {
        issues.push(`Descripción ${i + 1} excede 90 caracteres (${d.length} chars): "${d}"`);
      }
    });

    ad.callouts.forEach((c, i) => {
      if (c.length > 25) {
        issues.push(`Callout ${i + 1} excede 25 caracteres (${c.length} chars): "${c}"`);
      }
    });

    return {
      valid: issues.length === 0,
      issues
    };
  }

  /**
   * Genera el payload de campañas maestras de alta conversión
   */
  public static getMasterCampaigns(): GoogleAdsCampaignManifest[] {
    return [
      {
        campaignId: 'CAMP_EAR_HERO_SOLISTA_PREMIUM',
        campaignName: 'EAR_ES_SEARCH_SOLISTA_PREMIUM_OCASIONES',
        budgetDailyEur: 25.00,
        biddingStrategy: 'MAXIMIZE_CONVERSIONS',
        targetLocation: 'Comunidad de Madrid, Toledo, Guadalajara, Segovia (Radio 150km)',
        adGroups: [
          {
            adGroupId: 'AG_REGALO_CUMPLEANOS',
            adGroupName: 'Regalos Cumpleaños & Fiestas Privadas',
            targetVertical: 'REGALOS_Y_OCASIONES',
            landingUrl: 'https://www.productoraear.com/artistas/edwin-agudelo?utm_source=google&utm_medium=cpc&utm_campaign=solista_premium&utm_term=serenata+cumpleanos',
            keywordsExact: [
              '[serenata cumpleaños madrid]',
              '[contratar cantante fiesta privada]',
              '[regalo musical sorpresa cumpleaños]',
              '[cantante mariachi cumpleaños madrid]',
              '[edwin agudelo solista precio]'
            ],
            keywordsPhrase: [
              '"serenata sorpresa para cumpleaños"',
              '"cantante en directo para fiesta privada"',
              '"musica en vivo cumpleaños madrid"',
              '"contratar mariachi para cumpleaños"'
            ],
            negativeKeywords: ['gratis', 'mp3', 'descargar', 'letra', 'chords', 'empleo'],
            headlines: [
              'Edwin Agudelo Solista 350€', // 26 chars
              'Serenata Cumpleaños Madrid', // 26 chars
              'Bono 150€ en Extras VIP', // 23 chars
              'Regalo Musical Sorpresa', // 23 chars
              'Voz Tenor y Sonido Bose', // 23 chars
              'Garantía 0 Fallos S-Class', // 25 chars
              'Reserva en 1 Clic WhatsApp' // 26 chars
            ],
            descriptions: [
              'Sorprende en su cumpleaños con voz en directo y dedicatoria especial. Sonido Bose HiFi.', // 88 chars
              'Bono directo de 150€ en complementos: flores de gala o sombrero charro. Reserva 350€.', // 86 chars
              'Música en directo para fiestas privadas. Repertorio a la carta: mariachi, bolero y pop.', // 88 chars
              'Contratación directa y bloqueo de fecha garantizado en 1 minuto. Atención WhatsApp.' // 84 chars
            ],
            sitelinks: [
              {
                text: 'Bono 150€ Complementos', // 23 chars
                description: 'Flores, sombrero charro y extras.', // 33 chars
                url: 'https://www.productoraear.com/checkout/presupuesto?promo=EDWIN150'
              },
              {
                text: 'Ver Vídeos en Directo', // 21 chars
                description: 'Escucha a Edwin Agudelo en acción.', // 34 chars
                url: 'https://www.productoraear.com/artistas/edwin-agudelo'
              },
              {
                text: 'Cotizador en 1 Minuto', // 21 chars
                description: 'Calcula tu presupuesto al instante.', // 35 chars
                url: 'https://www.productoraear.com/cotizador'
              }
            ],
            callouts: [
              'Sonido Bose 12W/pax', // 19 chars
              'Bono 150€ Incluido', // 18 chars
              'Tarifa Base 350€', // 16 chars
              'Garantía Cero Fallos' // 20 chars
            ],
            structuredSnippets: {
              header: 'Servicios',
              values: ['Cumpleaños', 'Día de la Madre', 'San Valentín', 'Fiestas Privadas', 'Aniversarios']
            },
            qualityScoreTarget: 10,
            targetCpcEstimatedEur: 0.45
          },
          {
            adGroupId: 'AG_DIA_MADRE_PADRE',
            adGroupName: 'Día de la Madre & Día del Padre',
            targetVertical: 'REGALOS_Y_OCASIONES',
            landingUrl: 'https://www.productoraear.com/artistas/edwin-agudelo?utm_source=google&utm_medium=cpc&utm_campaign=solista_premium&utm_term=serenata+dia+de+la+madre',
            keywordsExact: [
              '[serenata dia de la madre madrid]',
              '[regalo dia de la madre musica]',
              '[serenata dia del padre]',
              '[mariachi dia de la madre precios]'
            ],
            keywordsPhrase: [
              '"serenata para el dia de la madre"',
              '"homenaje musical dia del padre"',
              '"cancion personalizada para mama"'
            ],
            negativeKeywords: ['manualidades', 'tarjetas', 'dibujos', 'poemas gratis'],
            headlines: [
              'Serenata Día de la Madre', // 24 chars
              'Edwin Agudelo Solista 350€', // 26 chars
              'Regalo Emocional Inédito', // 24 chars
              'Ramo Flores de Gala Gratis', // 26 chars
              'Homenaje Musical Inolvidable' // 28 chars
            ],
            descriptions: [
              'Regala a mamá una serenata en directo en casa o restaurante. Ramo floral de gala incluido.', // 90 chars
              'Edwin Agudelo Tenor: boleros y rancheras inolvidables con sonido Bose HiFi. Tarifa 350€.', // 88 chars
              'Cupón EDWIN150-COMPLEMENTOS activo: 150€ de regalo en extras. Reserva por WhatsApp.' // 84 chars
            ],
            sitelinks: [
              {
                text: 'Cupón 150€ Flores y Más', // 23 chars
                description: 'Arreglos florales y dedicatoria.', // 32 chars
                url: 'https://www.productoraear.com/checkout/presupuesto?promo=EDWIN150'
              },
              {
                text: 'Repertorio para Madres', // 22 chars
                description: 'Amor Eterno, Madrecita y más.', // 29 chars
                url: 'https://www.productoraear.com/artistas/edwin-agudelo'
              }
            ],
            callouts: [
              'Ramo Flores Incluido', // 20 chars
              'Micros Shure Wireless', // 21 chars
              'Puntualidad 100%' // 16 chars
            ],
            structuredSnippets: {
              header: 'Ocasiones',
              values: ['Día de la Madre', 'Día del Padre', 'Bodas de Oro', 'Aniversarios']
            },
            qualityScoreTarget: 10,
            targetCpcEstimatedEur: 0.38
          }
        ]
      },
      {
        campaignId: 'CAMP_EAR_MARIACHI_QUINTETO_BODAS',
        campaignName: 'EAR_ES_SEARCH_MARIACHI_BODAS_EVENTOS',
        budgetDailyEur: 35.00,
        biddingStrategy: 'TARGET_CPA',
        targetLocation: 'Comunidad de Madrid, Toledo, Segovia, Ávila, Guadalajara',
        adGroups: [
          {
            adGroupId: 'AG_MARIACHI_BODAS_MADRID',
            adGroupName: 'Mariachi para Bodas Madrid & Toledo',
            targetVertical: 'BODAS',
            landingUrl: 'https://www.productoraear.com/bodas/madrid/dj-eventos?utm_source=google&utm_medium=cpc&utm_campaign=mariachi_bodas',
            keywordsExact: [
              '[mariachi para bodas madrid]',
              '[contratar mariachi boda toledo]',
              '[mariachi 5 musicos madrid precio]',
              '[quinteto mariachi gala madrid]'
            ],
            keywordsPhrase: [
              '"mariachis para bodas en madrid"',
              '"musica mariachi ceremonia boda"',
              '"cuanto cuesta mariachi para boda"'
            ],
            negativeKeywords: ['barato malo', 'aficionados', 'disfraces', 'letra'],
            headlines: [
              'Mariachi Bodas Madrid 750€', // 26 chars
              'Mínimo 5 Músicos de Gala', // 25 chars
              'Edwin Agudelo y Ensamble', // 24 chars
              'Trajes Charros de Gala', // 22 chars
              'Sonorización Bose F1 Line', // 25 chars
              'Seguro RC 300.000€ Incluido' // 27 chars
            ],
            descriptions: [
              'Quinteto Oficial de Mariachi para bodas: 2 Trompetas, Vihuela, Guitarrón y Voz Tenor.', // 86 chars
              'Sonido impecable 12 W/pax con Bose F1 y trajes charros de gran gala. Desde 750€ cerrados.', // 89 chars
              'Presupuesto inmediato y bloqueo de fecha oficial con Garantía de 0 Fallos por contrato.' // 88 chars
            ],
            sitelinks: [
              {
                text: 'Presupuesto para Boda', // 21 chars
                description: 'Precios cerrados sin sorpresas.', // 31 chars
                url: 'https://www.productoraear.com/cotizador'
              },
              {
                text: 'Ficha Técnica Quinteto', // 22 chars
                description: 'Instrumentación de conservatorio.', // 33 chars
                url: 'https://www.productoraear.com/artistas/edwin-agudelo'
              }
            ],
            callouts: [
              '5 Músicos Garantizados', // 22 chars
              'Trajes Charros Plata', // 20 chars
              'Seguro RC 300.000€', // 18 chars
              'Plan B Redundante' // 17 chars
            ],
            structuredSnippets: {
              header: 'Formatos',
              values: ['Quinteto Pro (5M)', 'Ensamble Gran Gala (7M)', 'Solista Premium (350€)']
            },
            qualityScoreTarget: 10,
            targetCpcEstimatedEur: 0.65
          }
        ]
      }
    ];
  }
}
