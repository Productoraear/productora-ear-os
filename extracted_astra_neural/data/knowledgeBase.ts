
// FIX: Corrected import path
import { KnowledgeNugget, KnowledgeCategory } from '../types';

export const knowledgeBase: KnowledgeNugget[] = [
    // REALITY CHECK (NEW)
    { id: 'SUCCESS_EQUATION', category: KnowledgeCategory.FOUNDATIONS, tags: ['reality check', 'success', 'formula', 'talent', 'business', 'strategy'] },
    { id: 'FINANCIAL_SURVIVAL', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['reality check', 'finance', 'mental health', 'emergency fund', 'investment'] },
    { id: 'MARKET_SATURATION_DATA', category: KnowledgeCategory.MARKETING, tags: ['reality check', 'statistics', 'competition', 'differentiation', 'attention economy'] },
    { id: 'INCOME_DIVERSIFICATION_RULE', category: KnowledgeCategory.MONETIZATION, tags: ['reality check', 'revenue streams', 'business model', 'stability', 'risk management'] },
    { id: 'THE_LONG_GAME', category: KnowledgeCategory.MINDSET_PRODUCTIVITY, tags: ['reality check', 'patience', 'timeline', '5-10 years', 'grit'] },

    // FOUNDATIONS
    { id: 'DUAL_VISION_ALIGNMENT', category: KnowledgeCategory.FOUNDATIONS, tags: ['vision', 'strategy', 'business', 'art', 'alignment', 'radical honesty'] },
    { id: 'SKILL_INVENTORY_ANALYSIS', category: KnowledgeCategory.FOUNDATIONS, tags: ['swot', 'skills', 'strengths', 'weaknesses', 'planning', 'inventory'] },
    { id: 'VALUE_PROPOSITION_DEFINITION', category: KnowledgeCategory.FOUNDATIONS, tags: ['value proposition', 'branding', 'marketing', 'passion', 'niche', 'unique'] },
    { id: 'LIMITING_BELIEFS_MINDSET', category: KnowledgeCategory.FOUNDATIONS, tags: ['mindset', 'psychology', 'limiting beliefs', 'fear', 'success', 'myths'] },
    { id: 'MICRO_ACTION_PLANNING', category: KnowledgeCategory.FOUNDATIONS, tags: ['productivity', 'planning', 'action plan', 'getting started', 'momentum', 'tasks'] },

    // MONETIZATION
    { id: 'PREMIUM_ONLINE_COURSE', category: KnowledgeCategory.MONETIZATION, tags: ['course', 'education', 'digital product', 'scalability', 'passive income', 'artpreneur'] },
    { id: 'PREMIUM_COACHING_SERVICES', category: KnowledgeCategory.MONETIZATION, tags: ['coaching', 'mentoring', '1-to-1', 'high-ticket', 'service', 'consulting', 'artpreneur'] },
    { id: 'EXCLUSIVE_MEMBERSHIP_COMMUNITY', category: KnowledgeCategory.MONETIZATION, tags: ['membership', 'mastermind', 'community', 'recurring revenue', 'subscription', 'artpreneur'] },
    { id: 'VIRTUAL_WORKSHOP_BOOTCAMP', category: KnowledgeCategory.MONETIZATION, tags: ['workshop', 'bootcamp', 'live event', 'training', 'intensive', 'artpreneur'] },
    { id: 'DIRECT_ART_SALES', category: KnowledgeCategory.MONETIZATION, tags: ['sales', 'e-commerce', 'direct to fan', 'gallery', 'art'] },
    { id: 'LIMITED_EDITION_STRATEGY', category: KnowledgeCategory.MONETIZATION, tags: ['prints', 'scarcity', 'value', 'reproductions', 'giclee', 'art'] },
    { id: 'ROYALTIES_AND_LICENSING', category: KnowledgeCategory.MONETIZATION, tags: ['licensing', 'passive income', 'intellectual property', 'music', 'art'] },
    { id: 'SYNCH_LICENSING', category: KnowledgeCategory.MONETIZATION, tags: ['music', 'film', 'tv', 'ads', 'video games', 'synchronization'] },

    // MARKETING
    { id: 'CONTENT_TO_COMMERCE_FUNNEL', category: KnowledgeCategory.MARKETING, tags: ['marketing', 'sales funnel', 'content marketing', 'youtube', 'blogging', 'artpreneur'] },
    { id: 'LEAD_MAGNET_STRATEGY', category: KnowledgeCategory.MARKETING, tags: ['email list', 'marketing', 'audience building', 'pdf', 'guide', 'checklist', 'artpreneur'] },
    { id: 'ARTIST_WEBSITE_ECOMMERCE', category: KnowledgeCategory.MARKETING, tags: ['website', 'e-commerce', 'branding', 'portfolio', 'direct to fan'] },
    { id: 'THREE_W_MARKETING', category: KnowledgeCategory.MARKETING, tags: ['marketing', 'strategy', 'what', 'who', 'why', 'positioning', 'foundation'] },
    { id: 'FAN_CREATION_STRATEGY', category: KnowledgeCategory.MARKETING, tags: ['fans', 'community', 'audience', 'marketing', 'grassroots', 'micro-community'] },

    // FINANCE & LEGAL
    { id: 'CORPORATE_COLLABORATION_AGREEMENT', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['sponsorship', 'funding', 'corporate', 'legal', 'tax', 'agreement'] },
    { id: 'COMMERCIAL_SPONSORSHIP', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['sponsorship', 'advertising', 'funding', 'brand deal', 'legal'] },
    { id: 'DONATION_BASED_CROWDFUNDING', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['crowdfunding', 'funding', 'kickstarter', 'verkami', 'gofundme', 'donations'] },
    { id: 'PUBLISHING_RIGHTS', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['music', 'rights', 'legal', 'royalties', 'composition'] },
    { id: 'AUCTION_MECHANICS', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['auction', 'sales', 'hammer price', 'reserve', 'art market', 'legal'] },
    { id: 'COPYRIGHT_BASICS', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['copyright', 'legal', 'intellectual property', 'rights', 'moral', 'patrimonial'] },
    { id: 'HARVARD_NEGOTIATION_METHOD', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['negotiation', 'legal', 'contracts', 'deal making', 'win-win'] },

    // BUSINESS STRATEGY
    { id: 'SWOT_ANALYSIS', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['swot', 'strategy', 'planning', 'business', 'strengths', 'weaknesses', 'opportunities', 'threats'] },
    { id: 'BUSINESS_MODEL_CANVAS', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['business model', 'canvas', 'strategy', 'planning', 'startup', 'lean'] },

    // MINDSET & PRODUCTIVITY
    { id: 'IMPOSTOR_SYNDROME_MINDSET', category: KnowledgeCategory.MINDSET_PRODUCTIVITY, tags: ['mindset', 'psychology', 'impostor syndrome', 'confidence', 'self-doubt'] },
    { id: 'ABUNDANCE_MINDSET', category: KnowledgeCategory.MINDSET_PRODUCTIVITY, tags: ['mindset', 'psychology', 'abundance', 'scarcity', 'growth'] },
    { id: 'ARTIST_DISCIPLINE', category: KnowledgeCategory.MINDSET_PRODUCTIVITY, tags: ['discipline', 'productivity', 'habits', 'routine', 'creativity', 'consistency'] },

    // INDUSTRY GLOSSARY
    { id: 'BLUE_CHIP_ARTIST', category: KnowledgeCategory.INDUSTRY_GLOSSARY, tags: ['artist', 'investment', 'art market', 'glossary'] },
    { id: 'CASTING_PROCESS', category: KnowledgeCategory.INDUSTRY_GLOSSARY, tags: ['film', 'theater', 'pre-production', 'actors', 'glossary'] },
    { id: 'STORYBOARDING', category: KnowledgeCategory.INDUSTRY_GLOSSARY, tags: ['film', 'planning', 'pre-production', 'visuals', 'glossary'] },
    { id: 'POST_PRODUCTION', category: KnowledgeCategory.INDUSTRY_GLOSSARY, tags: ['film', 'editing', 'vfx', 'sound design', 'glossary'] },
    
    // Project Manager Document Nuggets
    { id: 'PM_VS_MANAGER', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['project manager', 'manager', 'roles', 'equipo', 'estrategia', 'operaciones'] },
    { id: 'PM_CORE_FUNCTIONS', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['project manager', 'pmbok', 'planificación', 'riesgos', 'presupuesto', 'cronograma'] },
    { id: 'PM_SKILL_MATRIX', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['project manager', 'habilidades', 'liderazgo', 'comunicación', 'software', 'asana'] },
    { id: 'PM_ALBUM_LIFECYCLE', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['project manager', 'álbum', 'lanzamiento', 'marketing', 'producción', 'cronograma'] },
    { id: 'PM_TOUR_MANAGEMENT', category: KnowledgeCategory.BUSINESS_STRATEGY, tags: ['project manager', 'gira', 'tour manager', 'logística', 'presupuesto', 'riesgos'] },
    { id: 'PM_CREATIVE_CHALLENGES', category: KnowledgeCategory.MINDSET_PRODUCTIVITY, tags: ['project manager', 'creatividad', 'scope creep', 'feedback', 'equipo', 'psicología'] },
    { id: 'PM_CONTRACTS_COMPENSATION', category: KnowledgeCategory.FINANCE_LEGAL, tags: ['project manager', 'contrato', 'compensación', 'freelance', 'legal', 'tarifa'] },
];
