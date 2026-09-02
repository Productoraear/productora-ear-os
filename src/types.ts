/**
 * 🌌 SOVEREIGN SIGNAL MODEL - V128.2
 * EAR OS GOLD - THE SOVEREIGN CONTEXT ENGINE ELITE
 */

export type IntentClass = "GENERIC" | "QUALIFIED" | "B2B_HIGH" | "B2G_HIGH";
export type HeroVariant = "DEFAULT" | "EDWIN_AGUDELO" | "WORLD_CUP_2026" | "INSTITUTIONAL";
export type CatalogMode = "ABUNDANCE" | "HYBRID" | "PRECISION";

export interface SovereignSignal {
  lastNiches: string[];      // Máx 3
  lastProvinces: string[];   // Máx 2
  lastRoutes: string[];      // Máx 5
  lastSearches: string[];    // Máx 5
  intentScore: number;       // 0-100
  intentClass: IntentClass;
  heroVariant: HeroVariant;
  catalogMode: CatalogMode;
  isB2G: boolean;            // B2G Mutation Flag
  updatedAt: string;
}

export const BASE_SIGNAL: SovereignSignal = {
  lastNiches: [],
  lastProvinces: [],
  lastRoutes: [],
  lastSearches: [],
  intentScore: 0,
  intentClass: "GENERIC",
  heroVariant: "DEFAULT",
  catalogMode: "ABUNDANCE",
  isB2G: false,
  updatedAt: new Date().toISOString()
};

// 🏛️ CANONICAL APPLICATION DATA TYPES
export interface BlogArticle {
  id: number | string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  image: string;
  icon?: any;
  featured?: boolean;
}

export interface Stat {
  label: string;
  value: string | number;
  suffix?: string;
  description?: string;
}

export interface ExpertiseService {
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  icon: any;
  color: string;
}

export interface AcademyLesson {
  title: string;
  time: string;
  status: string;
  progress: number;
}

export interface AcademyTool {
  name: string;
  cat: string;
}
