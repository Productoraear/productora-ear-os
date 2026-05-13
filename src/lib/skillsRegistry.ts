/**
 * 🧠 EAR OS MARKETING SKILLS REGISTRY (S-CLASS)
 * Infraestructura para la carga dinámica de los 14 módulos tácticos.
 */

export interface MarketingSkill {
  id: string;
  name: string;
  category: "CRO" | "SEO" | "Content" | "Strategy" | "Legal" | "Financial";
  status: "DEPLOYYED" | "STANDBY" | "CALIBRATING";
  path: string;
}

export const MARKETING_SKILLS: MarketingSkill[] = [
  { id: "ab-test", name: "A/B Test Setup", category: "CRO", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/ab-test-setup" },
  { id: "analytics", name: "Analytics Tracking", category: "Strategy", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/analytics-tracking" },
  { id: "conversion-psych", name: "Conversion Psychology", category: "CRO", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-conversion-psych" },
  { id: "crisis-defense", name: "Crisis Defense", category: "Strategy", status: "STANDBY", path: "H:/Marketing_Skills/.agent/skills/astra-crisis-defense" },
  { id: "event-architect", name: "Event Architect", category: "Content", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-event-architect" },
  { id: "financial-core", name: "Financial Core", category: "Financial", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-financial-core" },
  { id: "forensic-accounting", name: "Forensic Accounting", category: "Financial", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-forensic-accounting" },
  { id: "growth-hacker", name: "Growth Hacker", category: "Strategy", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-growth-hacker" },
  { id: "legal-shield", name: "Legal Shield", category: "Legal", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-legal-shield" },
  { id: "neuro-branding", name: "Neuro Branding", category: "Content", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-neuro-branding" },
  { id: "pr-strategist", name: "PR Strategist", category: "Strategy", status: "STANDBY", path: "H:/Marketing_Skills/.agent/skills/astra-pr-strategist" },
  { id: "tax-ninja", name: "Tax Ninja", category: "Financial", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/astra-tax-ninja" },
  { id: "programmatic-seo", name: "Programmatic SEO", category: "SEO", status: "DEPLOYYED", path: "H:/Marketing_Skills/.agent/skills/programmatic-seo" },
  { id: "referral-program", name: "Referral Program", category: "Strategy", status: "CALIBRATING", path: "H:/Marketing_Skills/.agent/skills/referral-program" }
];

export const getSkillById = (id: string) => MARKETING_SKILLS.find(s => s.id === id);
export const getSkillsByCategory = (cat: MarketingSkill["category"]) => MARKETING_SKILLS.filter(s => s.category === cat);
