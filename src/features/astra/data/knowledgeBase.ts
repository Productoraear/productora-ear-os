import { KnowledgeCategory, KnowledgeNugget } from '../types';

export const knowledgeBase: KnowledgeNugget[] = [
  {
    id: 'kb-1',
    category: KnowledgeCategory.FOUNDATIONS,
    title: 'First Principles Thinking in High-Stakes Decisions',
    insight: 'Deconstruct complex dilemmas into foundational truths and build solutions upward from those axioms rather than reasoning by superficial analogy.',
    tags: ['Mental Models', 'Strategy', 'Decision Making']
  },
  {
    id: 'kb-2',
    category: KnowledgeCategory.MONETIZATION,
    title: 'Value Ladder Architecture for Creative Enterprises',
    insight: 'Structure offerings across free hook, entry-level tripwire, core flagship product, and high-ticket mastermind tiers to capture full customer lifetime value.',
    tags: ['Monetization', 'Pricing', 'Business Models']
  },
  {
    id: 'kb-3',
    category: KnowledgeCategory.MARKETING,
    title: 'Asymmetrical Narrative Resonance',
    insight: 'People do not buy products; they buy better versions of themselves. Anchor campaigns around transformative tension and audience identity shifts.',
    tags: ['Positioning', 'Copywriting', 'Brand Narrative']
  },
  {
    id: 'kb-4',
    category: KnowledgeCategory.FINANCE_LEGAL,
    title: 'Master Rights & Recoupment Defense',
    insight: 'Always delineate mechanical royalties from performance rights, and safeguard ownership reversion clauses when negotiating upstream publishing deals.',
    tags: ['IP Law', 'Contracts', 'Royalties', 'Rights']
  },
  {
    id: 'kb-5',
    category: KnowledgeCategory.BUSINESS_STRATEGY,
    title: 'Antifragile Risk Positioning',
    insight: 'Design strategic bets such that downside volatility is strictly capped with negligible ruin probability, while upside upside yields non-linear compounding returns.',
    tags: ['Risk Management', 'Antifragility', 'Venture Strategy']
  },
  {
    id: 'kb-6',
    category: KnowledgeCategory.MINDSET_PRODUCTIVITY,
    title: 'Maker vs. Manager Execution Cadence',
    insight: 'Protect deep work uninterrupted blocks for creative generation, segregating operational administration and multi-stakeholder syncing into batch windows.',
    tags: ['Productivity', 'Focus', 'Cognitive Bandwidth']
  },
  {
    id: 'kb-7',
    category: KnowledgeCategory.INDUSTRY_GLOSSARY,
    title: 'CAC, LTV, and Churn Equilibrium',
    insight: 'A sustainable enterprise maintains LTV:CAC >= 3:1 while keeping monthly cohort churn below acceptable industry thresholds (under 3-5% for SaaS/membership models).',
    tags: ['Unit Economics', 'Metrics', 'Glossary']
  },
  {
    id: 'kb-8',
    category: KnowledgeCategory.BUSINESS_STRATEGY,
    title: 'Second-Order Consequence Forecasting',
    insight: 'Ask: "And then what?" When evaluating strategic maneuvers, anticipate the counter-actions of competitors, partners, and audience dynamics.',
    tags: ['Game Theory', 'Strategic Foresight']
  }
];
