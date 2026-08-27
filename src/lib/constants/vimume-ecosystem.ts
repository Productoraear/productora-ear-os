export interface VimumeStakeholderFlow {
  id: string;
  role: 'seniors' | 'families' | 'clinicians' | 'b2g' | 'rsc_sponsors' | 'commercial_b2c';
  landingUrl: string;
  heroTagline: string;
  interactiveTool: string;
  narrativeThread: string;
  conversionMechanism: string;
}

export const VIMUME_ECOSYSTEM_MATRIX: VimumeStakeholderFlow[] = [
  {
    id: "flow-seniors",
    role: "seniors",
    landingUrl: "/vimume/experiencia",
    heroTagline: "El mapa sonoro que reconecta tu historia",
    interactiveTool: "Reproductor Neuroacústico Estimulador Gamma 40Hz",
    narrativeThread: "No eres un paciente; eres el director de tu propia memoria musical.",
    conversionMechanism: "Sesiones individuales con auriculares de alta fidelidad y sonido inmersivo."
  },
  {
    id: "flow-families",
    role: "families",
    landingUrl: "/vimume/portal-familiar",
    heroTagline: "Recupera la mirada de quien amas",
    interactiveTool: "Formulario de Mapeo de la Banda Sonora Vital™",
    narrativeThread: "Construye el archivo sonoro definitivo con las 10 canciones clave de su juventud.",
    conversionMechanism: "Acceso a la Bóveda Privada de vídeo-documentales de reactivación."
  },
  {
    id: "flow-clinicians",
    role: "clinicians",
    landingUrl: "/vimume/protocolo-clinico",
    heroTagline: "Rigor neurocientífico y evidencia clínica no farmacológica",
    interactiveTool: "Calculadora de Parámetros Acústicos de Seguridad (<75 dB)",
    narrativeThread: "Estimulación cognitiva Gamma 40Hz sin efectos secundarios.",
    conversionMechanism: "Solicitud de prueba piloto de 30 días en centros sanitarios o residencias."
  },
  {
    id: "flow-b2g",
    role: "b2g",
    landingUrl: "/ocasiones/ayuntamientos",
    heroTagline: "Programa municipal contra la Soledad No Deseada y Envejecimiento Activo",
    interactiveTool: "Generador de Memoria Técnica Justificativa (Art. 118 LCSP)",
    narrativeThread: "Adjudicación directa para ayuntamientos en menos de 24h (<15.000 €).",
    conversionMechanism: "Descarga de pliego de prescripciones técnicas listo para firmar."
  },
  {
    id: "flow-rsc",
    role: "rsc_sponsors",
    landingUrl: "/vimume/rsc-patrocinios",
    heroTagline: "Financia la memoria de la Silver Economy en la España Vaciada",
    interactiveTool: "Simulador de Retorno Social de la Inversión (SROI)",
    narrativeThread: "Alineación con criterios ESG y apadrinamiento de centros residenciales.",
    conversionMechanism: "Contratación de Tiers de Apadrinamiento Corporativo (3.000 € / 5.000 €)."
  },
  {
    id: "flow-commercial",
    role: "commercial_b2c",
    landingUrl: "/cotizador",
    heroTagline: "Celebraciones que transforman vidas",
    interactiveTool: "Calculadora del Split Soberano de Impacto (80/10/10)",
    narrativeThread: "El 10% de tu boda o evento subsidia una sesión VIMUME en tu provincia.",
    conversionMechanism: "Fijación de tarifa Stripe con Sello de Responsabilidad Social Inmutable."
  }
];

export const getVimumeFlowByRole = (role: VimumeStakeholderFlow['role']): VimumeStakeholderFlow | undefined => {
  return VIMUME_ECOSYSTEM_MATRIX.find(flow => flow.role === role);
};
