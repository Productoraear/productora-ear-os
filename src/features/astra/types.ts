import React from 'react';

export enum UserRole {
    ARTIST = 'ARTIST',
    MANAGER = 'MANAGER',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    ENTREPRENEUR = 'ENTREPRENEUR',
    STRATEGIC_COMMUNICATOR = 'STRATEGIC_COMMUNICATOR',
    BOOK_AUTHOR = 'BOOK_AUTHOR',
}

export enum AppView {
    ROLE_SELECTOR = 'ROLE_SELECTOR',
    DASHBOARD = 'DASHBOARD',
    STRATEGIC_JOURNEY = 'STRATEGIC_JOURNEY',
    TOOLKIT_HUB = 'TOOLKIT_HUB',
}

export enum WorkflowStage {
    DIAGNOSIS = 'DIAGNOSIS',
    PURPOSE = 'PURPOSE',
    PROTOTYPING = 'PROTOTYPING',
    VALIDATION = 'VALIDATION',
    IMPLEMENTATION = 'IMPLEMENTATION',
    REFLECTION = 'REFLECTION',
}

export enum Persona {
    CREATIVE_ORACLE = 'CREATIVE_ORACLE',
    BRAND_ARCHITECT = 'BRAND_ARCHITECT',
    PRODUCTION_MASTER = 'PRODUCTION_MASTER',
    COMMUNITY_STRATEGIST = 'COMMUNITY_STRATEGIST',
    MARKET_CONQUEROR = 'MARKET_CONQUEROR',
    DATA_SCIENTIST = 'DATA_SCIENTIST',
    TREASURY_GUARDIAN = 'TREASURY_GUARDIAN',
    DEVILS_ADVOCATE = 'DEVILS_ADVOCATE',
    CULTURAL_ANTHROPOLOGIST = 'CULTURAL_ANTHROPOLOGIST',
    DIGITAL_PLATFORMS_GURU = 'DIGITAL_PLATFORMS_GURU',
}

export enum DecisionCategory {
    CREATIVE_STRATEGY = 'CREATIVE_STRATEGY',
    BUSINESS_OPERATIONS = 'BUSINESS_OPERATIONS',
    MARKETING_SALES = 'MARKETING_SALES',
    FINANCIAL_DECISIONS = 'FINANCIAL_DECISIONS',
    BRANDING_AND_IDENTITY = 'BRANDING_AND_IDENTITY',
    DIGITAL_PRODUCTS = 'DIGITAL_PRODUCTS',
    PROJECT_MANAGEMENT = 'PROJECT_MANAGEMENT',
    ENTREPRENEURSHIP = 'ENTREPRENEURSHIP',
    COMMUNICATION_STRATEGY = 'COMMUNICATION_STRATEGY',
    CONTENT_CREATION = 'CONTENT_CREATION',
    DOCUMENTATION = 'DOCUMENTATION',
    STRATEGIC_PLANNING = 'STRATEGIC_PLANNING',
    PRODUCT_DEVELOPMENT = 'PRODUCT_DEVELOPMENT',
    OPERATIONS_MANAGEMENT = 'OPERATIONS_MANAGEMENT',
    HUMAN_RESOURCES = 'HUMAN_RESOURCES',
    RISK_MANAGEMENT = 'RISK_MANAGEMENT',
    GENERAL = 'GENERAL'
}

export enum DecisionType {
    NEXT_SINGLE = 'NEXT_SINGLE',
    ALBUM_CONCEPT = 'ALBUM_CONCEPT',
    COLLABORATION = 'COLLABORATION',
    TOUR_STRATEGY = 'TOUR_STRATEGY',
    CONTRACT_NEGOTIATION = 'CONTRACT_NEGOTIATION',
    SPONSORSHIP_DEAL = 'SPONSORSHIP_DEAL',
    HIRING_DECISION = 'HIRING_DECISION',
    PR_CRISIS = 'PR_CRISIS',
    AUCTION_STRATEGY = 'AUCTION_STRATEGY',
    TECH_STACK_CHOICE = 'TECH_STACK_CHOICE',
    BUDGET_ALLOCATION = 'BUDGET_ALLOCATION',
    RELEASE_STRATEGY = 'RELEASE_STRATEGY',
    MVP_DEFINITION = 'MVP_DEFINITION',
    GO_TO_MARKET_STRATEGY = 'GO_TO_MARKET_STRATEGY',
    FUNDING_STRATEGY = 'FUNDING_STRATEGY',
    PIVOT_DECISION = 'PIVOT_DECISION',
    STAKEHOLDER_MESSAGING = 'STAKEHOLDER_MESSAGING',
    DOCUMENT_STRUCTURE = 'DOCUMENT_STRUCTURE',
    CHAPTER_OUTLINE = 'CHAPTER_OUTLINE',
    BOOK_COVER_DESIGN = 'BOOK_COVER_DESIGN',
    TARGET_AUDIENCE_PROFILE = 'TARGET_AUDIENCE_PROFILE',
    BOOK_LAUNCH_STRATEGY = 'BOOK_LAUNCH_STRATEGY',
    SELF_VS_TRADITIONAL_PUBLISHING = 'SELF_VS_TRADITIONAL_PUBLISHING',
    EVALUATE_LIMITED_EDITION = 'EVALUATE_LIMITED_EDITION',
    DEFINE_SUCCESS_METRICS = 'DEFINE_SUCCESS_METRICS',
    IDENTIFY_TARGET_NICHE = 'IDENTIFY_TARGET_NICHE',
    DEVELOP_BRAND_STORY = 'DEVELOP_BRAND_STORY',
    SET_PRICING_STRATEGY = 'SET_PRICING_STRATEGY',
    CREATE_INFO_PRODUCT = 'CREATE_INFO_PRODUCT',
    CHOOSE_INFO_PRODUCT_MODEL = 'CHOOSE_INFO_PRODUCT_MODEL',
    PRICE_INFO_PRODUCT = 'PRICE_INFO_PRODUCT',
    PLAN_PRODUCT_LAUNCH = 'PLAN_PRODUCT_LAUNCH',
    CASTING_STRATEGY = 'CASTING_STRATEGY',
    POST_PRODUCTION_WORKFLOW = 'POST_PRODUCTION_WORKFLOW',
    SCALING_STRATEGY = 'SCALING_STRATEGY',
    INTERNAL_COMM_PLAN = 'INTERNAL_COMM_PLAN',
    EXTERNAL_COMM_PLAN = 'EXTERNAL_COMM_PLAN',
}

export enum DesiredOutcome {
    GROW_FAN_BASE = 'GROW_FAN_BASE',
    ARTISTIC_INTEGRITY = 'ARTISTIC_INTEGRITY',
    MAXIMIZE_REVENUE = 'MAXIMIZE_REVENUE',
    CRITICAL_ACCLAIM = 'CRITICAL_ACCLAIM',
    BRAND_RECOGNITION = 'BRAND_RECOGNITION',
    ARTIST_CAREER_LONGEVITY = 'ARTIST_CAREER_LONGEVITY',
    SECURE_FAVORABLE_TERMS = 'SECURE_FAVORABLE_TERMS',
    MITIGATE_RISK = 'MITIGATE_RISK',
    DELIVER_ON_TIME = 'DELIVER_ON_TIME',
    STAY_WITHIN_BUDGET = 'STAY_WITHIN_BUDGET',
    IMPROVE_EFFICIENCY = 'IMPROVE_EFFICIENCY',
    PRODUCT_MARKET_FIT = 'PRODUCT_MARKET_FIT',
    INCREASE_MARKET_SHARE = 'INCREASE_MARKET_SHARE',
    HIGH_USER_ADOPTION = 'HIGH_USER_ADOPTION',
    CLEAR_COMMUNICATION = 'CLEAR_COMMUNICATION',
    ENSURE_BRAND_CONSISTENCY = 'ENSURE_BRAND_CONSISTENCY',
    STAKEHOLDER_BUY_IN = 'STAKEHOLDER_BUY_IN',
    PROJECT_TRANSPARENCY = 'PROJECT_TRANSPARENCY',
    ATTAIN_BESTSELLER_STATUS = 'ATTAIN_BESTSELLER_STATUS',
    BUILD_AUTHOR_PLATFORM = 'BUILD_AUTHOR_PLATFORM',
    ACHIEVE_READER_TRANSFORMATION = 'ACHIEVE_READER_TRANSFORMATION',
    SECURE_PUBLISHING_DEAL = 'SECURE_PUBLISHING_DEAL'
}

export enum Stakeholder {
    FANS = 'FANS',
    RECORD_LABEL = 'RECORD_LABEL',
    MUSIC_CRITIC = 'MUSIC_CRITIC',
    EXTERNAL_PARTNERS = 'EXTERNAL_PARTNERS',
    ARTIST_HIMSELF = 'ARTIST_HIMSELF',
    LEGAL_ADVISOR = 'LEGAL_ADVISOR',
    INVESTORS = 'INVESTORS',
    DEVELOPMENT_TEAM = 'DEVELOPMENT_TEAM',
    EXECUTIVE_LEADERSHIP = 'EXECUTIVE_LEADERSHIP',
    END_USERS = 'END_USERS',
    CUSTOMERS = 'CUSTOMERS',
    CO_FOUNDERS = 'CO_FOUNDERS',
    EARLY_ADOPTERS = 'EARLY_ADOPTERS',
    EMPLOYEES = 'EMPLOYEES',
    GENERAL_PUBLIC = 'GENERAL_PUBLIC',
    READERS = 'READERS',
    EDITOR = 'EDITOR',
    PUBLISHER = 'PUBLISHER',
    LITERARY_AGENT = 'LITERARY_AGENT'
}

export enum FocusArea {
    CREATIVE_VISION = 'CREATIVE_VISION',
    FAN_ENGAGEMENT = 'FAN_ENGAGEMENT',
    BRAND_ALIGNMENT = 'BRAND_ALIGNMENT',
    FINANCIAL = 'FINANCIAL',
    MARKETING = 'MARKETING',
    CONTRACTS = 'CONTRACTS',
    RISK_MANAGEMENT = 'RISK_MANAGEMENT',
    OPERATIONAL = 'OPERATIONAL',
    TIMELINE = 'TIMELINE',
    BUDGET = 'BUDGET',
    SCOPE = 'SCOPE',
    RESOURCES = 'RESOURCES',
    PRODUCT_DEVELOPMENT = 'PRODUCT_DEVELOPMENT',
    SCALABILITY = 'SCALABILITY',
    MESSAGE_CLARITY = 'MESSAGE_CLARITY',
    BRAND_VOICE = 'BRAND_VOICE',
    STAKEHOLDER_ALIGNMENT = 'STAKEHOLDER_ALIGNMENT',
    DOCUMENTATION = 'DOCUMENTATION',
    NARRATIVE_STRUCTURE = 'NARRATIVE_STRUCTURE',
    READER_ENGAGEMENT = 'READER_ENGAGEMENT',
    AUTHOR_BRANDING = 'AUTHOR_BRANDING',
    PUBLISHING_PATH = 'PUBLISHING_PATH'
}

export enum RiskAppetite {
    CONSERVATIVE = 'CONSERVATIVE',
    BALANCED = 'BALANCED',
    AGGRESSIVE = 'AGGRESSIVE',
}

export enum AnalysisHorizon {
    SHORT = 'SHORT',
    MEDIUM = 'MEDIUM',
    LONG = 'LONG',
}

export interface AnalysisParameters {
    decisionCategory: DecisionCategory;
    decisionType: DecisionType;
    problem: string;
    context?: string;
    outcomes: DesiredOutcome[];
    stakeholders: Stakeholder[];
    focusAreas: FocusArea[];
    riskAppetite: RiskAppetite;
    horizon: AnalysisHorizon;
    personas: Persona[];
    analysisMode: 'SINGLE' | 'COMPARATIVE' | 'ROBUSTNESS';
    options?: string[];
    prioritizeSpeed?: boolean;
}

export interface ActionStep {
    step: number;
    description: string;
    completed: boolean;
}

export interface Scenario {
    strategy: string;
    pros: string[];
    cons: string[];
    potentialImpact: number; // 1-10
    confidenceScore: number; // 1-10
    actionPlan?: ActionStep[];
    isGeneratingActionPlan?: boolean;
}

export interface GroundingSource {
    web: {
        uri: string;
        title: string;
    }
}

export interface PersonaAnalysis {
    analysisResult: string | null;
    scenarios: Scenario[];
    sources: GroundingSource[];
    error?: string;
}

export type AllAnalysisResults = Partial<Record<Persona, PersonaAnalysis>>;

export interface RiskAnalysis {
    risk: string;
    severity: number; // 1-10
    mitigation: string;
}

export interface StrategicRecommendation {
    strategy: string;
    justification: string;
    confidence: number;
}

export interface SynthesisResult {
    executiveSummary: string;
    strategicRecommendation: StrategicRecommendation;
    risks: RiskAnalysis[];
}

export interface Session {
    id: string;
    title: string;
    timestamp: string;
    userRole: UserRole;
    params: AnalysisParameters;
    results: AllAnalysisResults;
    synthesis?: SynthesisResult;
    projectId?: string;
}

export enum ProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD',
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    sessions?: string[]; // IDs of sessions linked to this project
    sessionIds?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ToolConfig {
    titleKey: string;
    descriptionKey: string;
    icon: React.ReactNode;
    roles: UserRole[];
    stage: WorkflowStage;
    order: number;
    component: React.ComponentType<any>;
    isImplemented: boolean;
}

export enum AIAssistantAction {
    SUMMARIZE = 'SUMMARIZE',
    EXTRACT_KEY_POINTS = 'EXTRACT_KEY_POINTS',
    GENERATE_SOCIAL_POST = 'GENERATE_SOCIAL_POST',
}

export enum KnowledgeCategory {
    FOUNDATIONS = 'FOUNDATIONS',
    MONETIZATION = 'MONETIZATION',
    MARKETING = 'MARKETING',
    FINANCE_LEGAL = 'FINANCE_LEGAL',
    BUSINESS_STRATEGY = 'BUSINESS_STRATEGY',
    MINDSET_PRODUCTIVITY = 'MINDSET_PRODUCTIVITY',
    INDUSTRY_GLOSSARY = 'INDUSTRY_GLOSSARY',
}

export interface KnowledgeNugget {
    id: string;
    category: KnowledgeCategory;
    tags: string[];
    title?: string;
    insight?: string;
}

export interface ImpactNugget {
    title: string;
    insight: string;
    category: string;
    date?: string;
}

export interface UserProfileSummary {
    narrative: string;
    archetype?: string;
    keyStrengths?: string[];
}

export interface VisionCardData {
    id: string;
    title: string;
    prompt: string;
    imageUrl?: string;
    isLoading?: boolean;
}

export interface NextAction {
    action: string;
    toolId: string;
    reasoning: string;
}

export interface PlaybookStep {
    description: string;
    toolId: string;
}

export interface AnalysisResponse {
    assumptionAnalysis: string[];
    counterpoints: {
        role: string;
        points: string[];
    };
    reasoningTest: string[];
    alternativePerspectives: string[];
    actionableRoadmap: {
        title: string;
        steps: string[];
    };
}

export interface VisualTrend {
    name: string;
    description: string;
}

export interface SonicTrend {
    name: string;
    description: string;
}

export interface ConceptualTrend {
    name: string;
    description: string;
}

export interface CulturalAtlasResult {
    visualTrends: VisualTrend[];
    sonicTrends: SonicTrend[];
    conceptualTrends: ConceptualTrend[];
}

export interface NarrativeResult {
    narrativeTitle: string;
    biography: string;
    manifesto: string;
    interviewTips: string[];
    simulatedAudienceReaction: string;
}

export interface ValuePropositionResult {
    title: string;
    stakeholder: string;
    problem: string;
    solution: string;
    benefits: string[];
    differentiation: string;
}

export interface CounterArgumentResult {
    counterArgument: string;
}

export interface SWOTAnalysisResult {
    conclusions: {
        maintain: string[];
        exploit: string[];
        correct: string[];
        confront: string[];
    }
}

export interface IkigaiInputs {
    loves: string;
    goodAt: string;
    worldNeeds: string;
    paidFor: string;
    introspection: {
        milestones: string;
        balance: string;
    };
}

export interface DeliberationChunk {
    type: 'moderator' | 'persona';
    persona?: Persona;
    message: string;
    suggestions?: string[];
    isGeneratingSuggestions?: boolean;
}

export interface CouncilSynthesis {
    verdict: string;
    executiveSummary: string;
    unifiedStrategy: {
        title: string;
        description: string;
        keySteps: string[];
    };
    riskMitigationPlan: { risk: string; mitigation: string }[];
    consensusLevel: number;
    dissentingVoices: string[];
}

export interface MarketingCampaign {
    id: string;
    nombre: string;
    descripcion: string;
    estado: 'Planificacion' | 'Activa' | 'Completada' | 'Archivada';
    fecha_inicio: string;
    fecha_fin: string;
    presupuesto: number;
    gasto: number;
}

export interface Lead {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    etapa: 'Suscriptor' | 'Lead' | 'Cliente' | 'Fan';
    puntuacion: number;
    fuente: string;
}

export interface ContentItem {
    id: string;
    id_campana: string;
    titulo: string;
    cuerpo: string;
    plataforma: string;
    estado: 'Borrador' | 'Revisión' | 'Publicado';
    fecha_creacion: string;
}

export interface MarketingMetric {
    label: string;
    value: number | string;
    trend?: 'up' | 'down' | 'neutral';
    change?: string;
}

export type CampaignStatus = 'Planificacion' | 'Activa' | 'Completada' | 'Archivada';
export type LeadStage = 'Suscriptor' | 'Lead' | 'Cliente' | 'Fan';

export interface InitializedTool {
    title: string;
    points: string[];
    design: string;
    synergy: string[];
    polymorphic: string[];
    kpis: string[];
    criticalConsiderations: string[];
}

export interface PsychometricQuestion {
    question: string;
    options: { text: string; value: string }[];
}