export interface MarketingSkill {
  id: string;
  name: string;
  category: "CRO" | "SEO" | "Content" | "Strategy" | "Legal" | "Financial";
  status: "DEPLOYYED" | "STANDBY" | "CALIBRATING";
  path: string;
}

export const MARKETING_SKILLS: MarketingSkill[] = [
  { id: "ab-test", name: "A/B Test Setup", category: "CRO", status: "DEPLOYYED", path: ".agents/skills/ab-test-setup" },
  { id: "analytics", name: "Analytics Tracking", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/analytics-tracking" },
  { id: "conversion-psych", name: "Conversion Psychology", category: "CRO", status: "DEPLOYYED", path: ".agents/skills/astra-conversion-psych" },
  { id: "crisis-defense", name: "Crisis Defense", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/astra-crisis-defense" },
  { id: "event-architect", name: "Event Architect", category: "Content", status: "DEPLOYYED", path: ".agents/skills/astra-event-architect" },
  { id: "financial-core", name: "Financial Core", category: "Financial", status: "DEPLOYYED", path: ".agents/skills/astra-financial-core" },
  { id: "forensic-accounting", name: "Forensic Accounting", category: "Financial", status: "DEPLOYYED", path: ".agents/skills/astra-forensic-accounting" },
  { id: "growth-hacker", name: "Growth Hacker", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/astra-growth-hacker" },
  { id: "legal-shield", name: "Legal Shield", category: "Legal", status: "DEPLOYYED", path: ".agents/skills/astra-legal-shield" },
  { id: "neuro-branding", name: "Neuro Branding", category: "Content", status: "DEPLOYYED", path: ".agents/skills/astra-neuro-branding" },
  { id: "pr-strategist", name: "PR Strategist", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/astra-pr-strategist" },
  { id: "tax-ninja", name: "Tax Ninja", category: "Financial", status: "DEPLOYYED", path: ".agents/skills/astra-tax-ninja" },
  { id: "programmatic-seo", name: "Programmatic SEO", category: "SEO", status: "DEPLOYYED", path: ".agents/skills/programmatic-seo" },
  { id: "referral-program", name: "Referral Program", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/referral-program" },
  { id: "funnel-optimizer", name: "Funnel Architect & Optimizer", category: "CRO", status: "DEPLOYYED", path: ".agents/skills/funnel-optimizer" },
  { id: "copy-neuromarketing", name: "Copywriting de Neuro-Conversión", category: "Content", status: "DEPLOYYED", path: ".agents/skills/copy-neuromarketing" },
  { id: "b2g-licitaciones", name: "Licitaciones B2G Art. 118 LCSP", category: "Legal", status: "DEPLOYYED", path: ".agents/skills/b2g-licitaciones" },
  { id: "cold-outreach-vip", name: "Cold Outreach B2B & Luxury Venues", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/cold-outreach-vip" },
  { id: "retargeting-matrix", name: "Retargeting Multi-Canal S-Class", category: "CRO", status: "DEPLOYYED", path: ".agents/skills/retargeting-matrix" },
  { id: "lead-magnet-engine", name: "Lead Magnet High-Ticket Engine", category: "Content", status: "DEPLOYYED", path: ".agents/skills/lead-magnet-engine" },
  { id: "seo-entity-graph", name: "Knowledge Graph & Semantic SEO", category: "SEO", status: "DEPLOYYED", path: ".agents/skills/seo-entity-graph" },
  { id: "dynamic-pricing-ai", name: "Algoritmo de Tarificación Dinámica", category: "Financial", status: "DEPLOYYED", path: ".agents/skills/dynamic-pricing-ai" },
  { id: "artist-branding-360", name: "Personal Branding de Alta Escala", category: "Content", status: "DEPLOYYED", path: ".agents/skills/artist-branding-360" },
  { id: "whatsapp-closing-bot", name: "Protocolo de Cierre por WhatsApp", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/whatsapp-closing-bot" },
  { id: "influencer-seeding", name: "Siembra Táctica de Influencers", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/influencer-seeding" },
  { id: "geo-local-domination", name: "Dominación Local 52 Provincias", category: "SEO", status: "DEPLOYYED", path: ".agents/skills/geo-local-domination" },
  { id: "contract-armor", name: "Blindaje Contractual de Artistas", category: "Legal", status: "DEPLOYYED", path: ".agents/skills/contract-armor" },
  { id: "upsell-cross-sell", name: "Arquitectura de Upselling In-Event", category: "CRO", status: "DEPLOYYED", path: ".agents/skills/upsell-cross-sell" },
  { id: "social-proof-booster", name: "Cosechador de Prueba Social y Reseñas", category: "Content", status: "DEPLOYYED", path: ".agents/skills/social-proof-booster" },
  { id: "cashflow-sentinel", name: "Centinela de Flujo de Caja Transaccional", category: "Financial", status: "DEPLOYYED", path: ".agents/skills/cashflow-sentinel" },
  { id: "b2b-corporate-closing", name: "Cierre de Grandes Cuentas Corporativas", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/b2b-corporate-closing" },
  { id: "audio-acoustic-rider", name: "Optimizador Acústico 12W/Pax Rider", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/audio-acoustic-rider" },
  { id: "sovereign-vault-rag", name: "RAG Soberano de Ingesta Notarial", category: "Strategy", status: "DEPLOYYED", path: ".agents/skills/sovereign-vault-rag" }
];

export const getSkillById = (id: string) => MARKETING_SKILLS.find(s => s.id === id);
export const getSkillsByCategory = (cat: MarketingSkill["category"]) => MARKETING_SKILLS.filter(s => s.category === cat);
