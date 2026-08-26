export const MARIACHI_SEO_MATRIX = {
  mainQuery: "mariachis para bodas y eventos (precios y tarifas, serenata a domicilio, repertorio ranchero, duracion del show, mariachi imperial, canciones para novios, contratacion urgente, equipo de sonido)",
  seed: "mariachis para bodas y eventos",
  subtopics: [
    "precios y tarifas",
    "serenata a domicilio",
    "repertorio ranchero",
    "duracion del show",
    "mariachi imperial",
    "canciones para novios",
    "contratacion urgente",
    "equipo de sonido"
  ],
  intents: {
    transaccional: [
      "cuanto cuesta un mariachi para boda",
      "precio serenata mariachi a domicilio",
      "contratar mariachi urgente madrid"
    ],
    comercial: [
      "repertorio de mariachis para bodas",
      "duracion show mariachi banquetes"
    ],
    tecnica: [
      "equipo de sonido mariachi bose f1",
      "rider tecnico mariachi imperial"
    ]
  }
} as const;
