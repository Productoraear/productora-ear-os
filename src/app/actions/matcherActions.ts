"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

const MatcherInputSchema = z.object({
  atmosphere: z.string().min(1, "La atmósfera es requerida"),
  date: z.string().optional(),
  location: z.string().optional(),
});


export interface MatchingProvider {
  id: string;
  name: string;
  category: string;
  avatar: string;
  budget: string;
  purpose: string;
  availability: string;
  ctaLink: string;
  isVerified: boolean;
  isArtist: boolean;
}

// 🏛️ S-CLASS PRIORITY ROSTER DATA (Edwin Agudelo & Co. - Verified Elite)
const MASTER_ROSTER: Record<string, MatchingProvider[]> = {
  "clasica-gala": [
    {
      id: "ART-EDWIN-SOLISTA",
      name: "Edwin Agudelo (Solista)",
      category: "Tenor & Música Clásica Premium",
      avatar: "🎙️",
      budget: "Desde 1.200€",
      purpose: "Ideal para actos solemnes, entregas de premios y cenas institucionales de gran prestigio.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    },
    {
      id: "ART-COLIBRI-SYMPHON",
      name: "Colibrí Symphony Project",
      category: "Orquesta de Cámara S-Class",
      avatar: "🎻",
      budget: "Desde 3.500€",
      purpose: "Sonorización soberana, conciertos institucionales y galas benéficas de alto standing.",
      availability: "Alta Demanda",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    }
  ],
  "tradicional-elite": [
    {
      id: "ART-EDWIN-MARIACHI",
      name: "Edwin Agudelo (Mariachi)",
      category: "Mariachi de Lujo & Tradición",
      avatar: "🎺",
      budget: "Desde 850€",
      purpose: "Fiestas patronales exclusivas, aniversarios municipales y eventos culturales de élite.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    },
    {
      id: "ART-EDWIN-CABALLO",
      name: "Edwin Caballo (Show Ecuestre)",
      category: "Espectáculo Hípico & Canto Lírico",
      avatar: "🐎",
      budget: "Desde 2.800€",
      purpose: "Exhibiciones al aire libre y festividades tradicionales de alto standing.",
      availability: "Bajo Demanda",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    }
  ],
  "corporativa-impacto": [
    {
      id: "ART-BANDA-MONUMENT",
      name: "Banda Monumental",
      category: "Orquesta & Show de Gran Formato",
      avatar: "🎹",
      budget: "Desde 4.500€",
      purpose: "Fiestas de gala para multinacionales, incentivos y espectáculos masivos de alto impacto.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    },
    {
      id: "ART-ACOUSTICS-SOUND",
      name: "Infraestructura L'Acoustics",
      category: "Sonorización y Diseño Lumínico S-Class",
      avatar: "🔊",
      budget: "Desde 1.800€",
      purpose: "Cumbres técnicas, congresos y producciones oficiales B2G con certificación acústica.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    }
  ],
  "intima-familiar": [
    {
      id: "ART-EDWIN-CUERDAS",
      name: "Edwin Agudelo & Cuerdas",
      category: "Dúo / Trío Lírico Exclusivo",
      avatar: "🎸",
      budget: "Desde 950€",
      purpose: "Ceremonias de bodas civiles de lujo, peticiones de mano y cenas de aniversario íntimas.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    },
    {
      id: "ART-VIMUME-TERAPIA",
      name: "VIMUME Terapia Familiar",
      category: "Estimulación Sensorial y Cognitiva",
      avatar: "🧠",
      budget: "Desde 600€",
      purpose: "Reuniones familiares con alto valor terapéutico y cuidado cognitivo de mayores.",
      availability: "Disponible",
      ctaLink: "stripe-checkout",
      isVerified: true,
      isArtist: true
    }
  ]
};

/**
 * ⚡ S-CLASS SERVER ACTION: ATMOSPHERE MATCHING CORE ENGINE
 * Conecta la UI directamente con la DB PostgreSQL (35,010 registros)
 * priorizando de forma absoluta en la posición 0 a Edwin Agudelo.
 */
export async function getMatchingProviders(params: {
  atmosphere: string;
  date?: string;
  location?: string;
}): Promise<MatchingProvider[]> {
  // 1. IP Rate Limiting Check
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 10, 60000)) { // 10 searches per minute limit
    logger.warn({ event: "MATCHER_RATE_LIMIT_EXCEEDED", ip, atmosphere: params.atmosphere });
    throw new Error("RATE_LIMIT_EXCEEDED: Has excedido el límite de consultas por minuto.");
  }

  // 2. Validation with Zod
  const parsed = MatcherInputSchema.safeParse(params);
  if (!parsed.success) {
    logger.error({ event: "MATCHER_VALIDATION_FAILED", errors: parsed.error.format(), ip });
    throw new Error("VALIDATION_ERROR: Parámetros de búsqueda inválidos.");
  }

  const { atmosphere, date, location } = parsed.data;

  logger.info({ event: "MATCHER_QUERY_INIT", atmosphere, location, ip });


  // 1. Obtener artistas prioritarios (Sticky Top)
  const priorityActs = [...(MASTER_ROSTER[atmosphere] || [])];

  // 2. Determinar categorías de búsqueda dinámicas en PostgreSQL
  let dbCategories: string[] = [];
  if (atmosphere === "clasica-gala") {
    dbCategories = ["VENUE", "CLASICA", "MUSICA CLASICA", "LIRICO", "ORQUESTAS", "FINCAS"];
  } else if (atmosphere === "tradicional-elite") {
    dbCategories = ["MARIACHI", "ESPECTACULO", "TRADICIONAL", "CHARANGA", "FOLCLORE", "BANDAS DE MUSICA"];
  } else if (atmosphere === "corporativa-impacto") {
    dbCategories = ["SONIDO", "ILUMINACION", "DJ", "BANDA", "POP-ROCK", "ANIMACION"];
  } else if (atmosphere === "intima-familiar") {
    dbCategories = ["DUO", "TRIO", "SOLISTA", "JAZZ", "ACUSTICO", "TERAPIA", "ANIMADOR"];
  }

  // 3. Consultar base de datos de Prisma
  const queryConditions: any = {
    isVerified: false // Buscar del enjambre huérfano
  };

  if (dbCategories.length > 0) {
    queryConditions.category = {
      in: dbCategories,
      mode: 'insensitive'
    };
  }

  if (location && location.trim()) {
    queryConditions.location = {
      contains: location.trim(),
      mode: 'insensitive'
    };
  }

  let dbProviders: any[] = [];
  try {
    dbProviders = await prisma.providerProfile.findMany({
      where: queryConditions,
      take: 12,
      orderBy: [
        { roiGuaranteeScore: 'desc' },
        { name: 'asc' }
      ]
    });
  } catch (error: any) {
    logger.error({ event: "MATCHER_ACTION_DB_ERROR", error: error.message, ip });
  }

  // Si no se encuentran resultados con el filtro específico, hacer un fallback general en la DB
  if (dbProviders.length === 0) {
    try {
      dbProviders = await prisma.providerProfile.findMany({
        where: { isVerified: false },
        take: 8,
        orderBy: { roiGuaranteeScore: 'desc' }
      });
    } catch (e: any) {
      logger.error({ event: "MATCHER_FALLBACK_DB_ERROR", error: e.message, ip });
    }
  }

  // 4. Mapear registros de PostgreSQL al formato unificado de tarjeta de Matcher
  const mappedDbProviders: MatchingProvider[] = dbProviders.map((p) => {
    // Asignar avatar estético en función de la categoría
    let avatar = "✨";
    const cat = (p.category || '').toUpperCase();
    if (cat.includes("VENUE") || cat.includes("FINCA") || cat.includes("ESPACIO")) {
      avatar = "🏰";
    } else if (cat.includes("MARIACHI")) {
      avatar = "🎺";
    } else if (cat.includes("DJ") || cat.includes("DISCO")) {
      avatar = "🎧";
    } else if (cat.includes("DUO") || cat.includes("TRIO") || cat.includes("CUARTETO")) {
      avatar = "🎸";
    } else if (cat.includes("SOLISTA") || cat.includes("CANTANTE")) {
      avatar = "🎙️";
    } else if (cat.includes("SONIDO") || cat.includes("ILUMINACION")) {
      avatar = "🔊";
    } else if (cat.includes("ORQUESTA") || cat.includes("BANDA")) {
      avatar = "🎹";
    }

    // Generar presupuesto estético congruente con su puntuación
    const minPrice = p.roiGuaranteeScore > 0 ? Math.round(p.roiGuaranteeScore * 200) : 450;

    // FASE 3: Enlace del embudo de captura para reclamación
    const ctaLink = `/contacto?subject=reclamar-perfil&target=${encodeURIComponent(p.slug || p.id)}`;

    return {
      id: p.id,
      name: p.name,
      category: p.category ? p.category.toUpperCase() : "PROVEEDOR",
      avatar: avatar,
      budget: `Desde ${minPrice}€`,
      purpose: `Disponible para eventos de alto standing en ${p.location || 'España'}. Puntuación de confiabilidad técnica: ${p.roiGuaranteeScore.toFixed(1)}/5.`,
      availability: "Verificable",
      ctaLink: ctaLink,
      isVerified: false,
      isArtist: false
    };
  });

  // 5. Intercalar con prioridad absoluta: Edwin Agudelo (Roster) siempre al principio (Posición 0)
  return [...priorityActs, ...mappedDbProviders];
}
