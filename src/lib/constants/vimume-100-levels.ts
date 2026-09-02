import ontologyData from '@/data/vimume-brain/VIMUME_100_LEVELS_ONTOLOGY.json';

export interface VimumeLevelItem {
  level: number;
  title: string;
  scope: string;
}

export interface VimumeOntologyBlock {
  blockId: string;
  name: string;
  range: string;
  levels: VimumeLevelItem[];
}

export const VIMUME_ONTOLOGY_DATA = ontologyData;

export const VIMUME_BLOCKS: VimumeOntologyBlock[] = (ontologyData.blocks as VimumeOntologyBlock[]) || [];

export function getAll100Levels(): (VimumeLevelItem & { blockId: string; blockName: string })[] {
  const result: (VimumeLevelItem & { blockId: string; blockName: string })[] = [];
  for (const block of VIMUME_BLOCKS) {
    for (const lvl of block.levels) {
      result.push({
        ...lvl,
        blockId: block.blockId,
        blockName: block.name
      });
    }
  }
  return result;
}

export function getBlockById(blockId: string): VimumeOntologyBlock | undefined {
  return VIMUME_BLOCKS.find(b => b.blockId.toUpperCase() === blockId.toUpperCase());
}

export function getLevelsByBlock(blockId: string): VimumeLevelItem[] {
  const block = getBlockById(blockId);
  return block ? block.levels : [];
}

/**
 * Genera el cuerpo de justificación clínica (Bloque A: L1-L10)
 * para memorias de intervención sociosanitaria y centros de mayores.
 */
export function getClinicalJustificationText(): string {
  const blockA = getLevelsByBlock('A');
  return blockA.map(item => `• Nivel ${item.level} [${item.title}]: ${item.scope}`).join('\n');
}

/**
 * Genera el cuerpo de fundamentación jurídica y contratación pública (Bloque F: L51-L60)
 * para Secretarios, Interventores y Concejales bajo Art. 118 LCSP y códigos CPV.
 */
export function getLegalLcspJustificationText(): string {
  const blockF = getLevelsByBlock('F');
  return blockF.map(item => `• Nivel ${item.level} [${item.title}]: ${item.scope}`).join('\n');
}

/**
 * Genera la justificación de Retorno Social de la Inversión (SROI) y Split Soberano (Bloque G: L61-L70).
 */
export function getSroiJustificationText(): string {
  const blockG = getLevelsByBlock('G');
  return blockG.map(item => `• Nivel ${item.level} [${item.title}]: ${item.scope}`).join('\n');
}

/**
 * Genera el protocolo acústico y límites de decibelios <75 dB SPL (Bloque I: L81-L90).
 */
export function getTechnicalRiderJustificationText(): string {
  const blockI = getLevelsByBlock('I');
  return blockI.map(item => `• Nivel ${item.level} [${item.title}]: ${item.scope}`).join('\n');
}
