export const CATERING_KEYWORDS_MATRIX = {
  peninsular: {
    seed: "catering de asado para bodas",
    cluster: ["precio por persona", "menu de brasas", "parrilleros", "recena"],
    targetUrl: "/catering-brasas"
  },
  hispanoamericana: {
    seed: "parrillada a domicilio",
    cluster: ["precio por persona", "asado a la cruz", "lechon", "cordero"],
    targetUrl: "/catering-brasas"
  },
  international: {
    seed: "live fire catering for weddings",
    cluster: ["cost per guest", "open fire cooking", "wedding showcooking"],
    targetUrl: "/catering-brasas"
  }
} as const;
