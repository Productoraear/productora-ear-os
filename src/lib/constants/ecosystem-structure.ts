import ecosystemData from '@/data/ear-ecosystem-structure.json';

export interface EcosystemNode {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  badge?: string;
  route?: string;
  isHero?: boolean;
  children?: EcosystemNode[];
}

export interface EcosystemRoot {
  version: string;
  name: string;
  root: EcosystemNode;
}

export const ECOSYSTEM_STRUCTURE = ecosystemData as unknown as EcosystemRoot;

/**
 * Aplana todos los nodos del árbol para búsquedas o listados
 */
export function flattenEcosystem(node: EcosystemNode = ECOSYSTEM_STRUCTURE.root, depth: number = 0): (EcosystemNode & { depth: number })[] {
  const current = [{ ...node, depth }];
  if (!node.children || node.children.length === 0) return current;
  return current.concat(
    node.children.flatMap(child => flattenEcosystem(child, depth + 1))
  );
}

/**
 * Exporta el árbol como texto tabulado compatible con XMind
 */
export function exportToXMindTabbed(node: EcosystemNode = ECOSYSTEM_STRUCTURE.root, level: number = 0): string {
  const indent = '\t'.repeat(level);
  let result = `${indent}${node.title}\n`;
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      result += exportToXMindTabbed(child, level + 1);
    }
  }
  return result;
}
