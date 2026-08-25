/**
 * 🏛️ EAR OS OMEGA — 30-LEVEL DEEP RELATIONAL SEMANTIC ENGINE
 * Permite búsquedas multidimensionales cruzando hasta 30 niveles ontológicos:
 * Desde Intención/Necesidad (L10) y Disparador Emocional (L11) hasta
 * Calibración Acústica (L9), Pricing (L16), VIMUME (L20) y Fondos Europeos (L23).
 */

import taxonomyData from '@/data/ear-30-level-taxonomy.json';

export interface TaxonomyLevel {
  level: number;
  code: string;
  name: string;
  description: string;
}

export interface TaxonomyNode {
  id: string;
  level: number;
  level_code: string;
  name: string;
  slug: string;
  base_price?: number;
  currency?: string;
  description: string;
  relational_triggers: Record<string, string[] | undefined>;
}

export interface RelationalQueryResult {
  primary_match: TaxonomyNode;
  match_score: number;
  matched_level: TaxonomyLevel;
  activated_triggers: {
    target_level_code: string;
    target_level_name: string;
    target_level_number: number;
    related_node_ids: string[];
  }[];
  summary_narrative: string;
}

export class RelationalSemanticEngine {
  private levels: TaxonomyLevel[];
  private nodes: TaxonomyNode[];

  constructor() {
    this.levels = taxonomyData.levels_definition as TaxonomyLevel[];
    this.nodes = taxonomyData.nodes as unknown as TaxonomyNode[];
  }

  /**
   * Obtiene todos los 30 niveles ontológicos
   */
  public get30Levels(): TaxonomyLevel[] {
    return this.levels;
  }

  /**
   * Dispara una búsqueda relacional profunda (hasta 30 niveles)
   * @param query Texto de búsqueda del usuario o necesidad (ej. "Alzheimer", "Boda Madrid", "Bose F1", "Regalías")
   */
  public query(query: string): RelationalQueryResult[] {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();
    const results: RelationalQueryResult[] = [];

    for (const node of this.nodes) {
      let score = 0;
      const nameMatch = node.name.toLowerCase().includes(q);
      const descMatch = node.description.toLowerCase().includes(q);
      const slugMatch = node.slug.toLowerCase().includes(q);

      if (nameMatch) score += 50;
      if (descMatch) score += 20;
      if (slugMatch) score += 30;

      // Buscar también dentro de los triggers relacionales
      let triggerMatches = 0;
      for (const [levelCode, triggerIds] of Object.entries(node.relational_triggers)) {
        if (levelCode.toLowerCase().includes(q)) triggerMatches += 15;
        for (const tId of (triggerIds || [])) {
          if (tId.toLowerCase().includes(q)) triggerMatches += 10;
        }
      }
      score += triggerMatches;

      if (score > 0) {
        const matchedLevel = this.levels.find(l => l.level === node.level) || {
          level: node.level,
          code: node.level_code,
          name: node.level_code,
          description: ''
        };

        const activated_triggers = Object.entries(node.relational_triggers)
          .filter(([_, ids]) => Array.isArray(ids) && ids.length > 0)
          .map(([code, ids]) => {
            const lvl = this.levels.find(l => l.code === code);
            return {
              target_level_code: code,
              target_level_name: lvl ? lvl.name : code,
              target_level_number: lvl ? lvl.level : 0,
              related_node_ids: ids || []
            };
          }).sort((a, b) => a.target_level_number - b.target_level_number);

        // Generar resumen narrativo de los disparadores cruzados
        const summary_narrative = `Activación de Nodo [${node.name}] (Nivel ${node.level} - ${matchedLevel.name}). Dispara ${activated_triggers.length} enlaces relacionales a través de los 30 niveles de la ontología EAR OS.`;

        results.push({
          primary_match: node,
          match_score: score,
          matched_level: matchedLevel,
          activated_triggers,
          summary_narrative
        });
      }
    }

    return results.sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Obtiene todos los nodos vinculados a un nivel específico
   */
  public getNodesByLevel(levelNumber: number): TaxonomyNode[] {
    return this.nodes.filter(n => n.level === levelNumber);
  }
}

// Instancia singleton para uso global
export const relationalEngine = new RelationalSemanticEngine();
