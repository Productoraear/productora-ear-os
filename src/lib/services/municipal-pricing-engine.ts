import fs from 'fs';
import path from 'path';
import bundledCorredorData from '@/data/corredor_puro.json';

export interface DesglosePartidas {
  showPatronal: number;
  programaVimume: number;
  desplazamiento: number;
}

export interface MunicipioData {
  slug: string;
  nombre: string;
  provincia: string;
  poblacion: number;
  distanciaKm: number;
  espacio: string;
  centroSenior: string;
  tarifaBaseMenor: number;
  desglose: DesglosePartidas;
  justificacion: string;
}

export interface CorredorPayload {
  zona: string;
  riderTecnico: {
    pa: string;
    mesa: string;
    microfonia: string;
    ventajaLogistica: string;
  };
  municipios: MunicipioData[];
}

export function getCorredorData(): CorredorPayload {
  try {
    const filePath = path.join(process.cwd(), 'corredor_puro.json');
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    // Fallback silencioso al JSON empaquetado
  }
  return bundledCorredorData as CorredorPayload;
}

export function getMunicipioBySlug(slug: string): MunicipioData | undefined {
  const data = getCorredorData();
  return data.municipios.find((m) => m.slug.toLowerCase() === slug.toLowerCase());
}
