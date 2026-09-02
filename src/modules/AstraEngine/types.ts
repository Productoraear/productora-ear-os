
import React from 'react';

// Enums
export enum UserRole {
    ARTIST = 'ARTIST',
    MANAGER = 'MANAGER',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    ENTREPRENEUR = 'ENTREPRENEUR',
    STRATEGIC_COMMUNICATOR = 'STRATEGIC_COMMUNICATOR',
    BOOK_AUTHOR = 'BOOK_AUTHOR',
    DIPLOMATICO = 'DIPLOMATICO',
    AYUNTAMIENTO = 'AYUNTAMIENTO',
    COORDINADOR_BODA = 'COORDINADOR_BODA',
    VIMUME_CENTRO = 'VIMUME_CENTRO',
    VIMUME_FAMILIAR = 'VIMUME_FAMILIAR',
    VIMUME_CUIDADOR = 'VIMUME_CUIDADOR',
    VIMUME_INSTITUCION = 'VIMUME_INSTITUCION',
}

export enum WorkflowStage {
    DIAGNOSIS = 'DIAGNOSIS',
    STRATEGY = 'STRATEGY',
    PURPOSE = 'PURPOSE',
    PROTOTYPING = 'PROTOTYPING',
    VALIDATION = 'VALIDATION',
    IMPLEMENTATION = 'IMPLEMENTATION',
    REFLECTION = 'REFLECTION',
}

export enum AppView {
    ROLE_SELECTOR = 'ROLE_SELECTOR',
    DASHBOARD = 'DASHBOARD',
    STRATEGIC_JOURNEY = 'STRATEGIC_JOURNEY',
    TOOLKIT_HUB = 'TOOLKIT_HUB',
}

export enum ProjectStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    ON_HOLD = 'ON_HOLD',
}

export enum RiskAppetite {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    BALANCED = 'BALANCED'
}

export enum AnalysisHorizon {
    SHORT_TERM = 'SHORT_TERM',
    MEDIUM = 'MEDIUM',
    LONG_TERM = 'LONG_TERM'
}

export enum AnalysisMode {
    EXPLORATORY = 'EXPLORATORY',
    COMPARATIVE = 'COMPARATIVE'
}

export enum KnowledgeCategory {
    FOUNDATIONS = 'FOUNDATIONS',
    FINANCE_LEGAL = 'FINANCE_LEGAL',
    MARKETING = 'MARKETING',
    MONETIZATION = 'MONETIZATION',
    MINDSET_PRODUCTIVITY = 'MINDSET_PRODUCTIVITY',
    BUSINESS_STRATEGY = 'BUSINESS_STRATEGY',
    INDUSTRY_GLOSSARY = 'INDUSTRY_GLOSSARY'
}

export enum AIAssistantAction {
    SUMMARIZE = 'SUMMARIZE',
    EXTRACT_KEY_POINTS = 'EXTRACT_KEY_POINTS',
    GENERATE_SOCIAL_POST = 'GENERATE_SOCIAL_POST'
}

// Personas (used as keys/values)
export type Persona = 
    | 'CREATIVE_ORACLE' 
    | 'BRAND_ARCHITECT' 
    | 'PRODUCTION_MASTER' 
    | 'COMMUNITY_STRATEGIST' 
    | 'MARKET_CONQUEROR' 
    | 'DATA_SCIENTIST' 
    | 'TREASURY_GUARDIAN' 
    | 'DEVILS_ADVOCATE' 
    | 'CULTURAL_ANTHROPOLOGIST' 
    | 'DIGITAL_PLATFORMS_GURU';

// Interfaces

export interface Project {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    sessions?: Session[];
    tasks?: Task[];
    fecha_inicio?: string; 
    fecha_fin?: string;
    presupuesto?: number;
    gasto?: number;
}

export interface Session {
    id: string;
    title: string;
    timestamp: number;
    projectId?: string | null;
    params?: AnalysisParameters;
    synthesis?: SynthesisResult;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    subtasks?: Task[];
    expanded?: boolean;
    dependencies?: string[];
    tags?: string[];
    timeSpent?: number;
    isTracking?: boolean;
    lastStartTime?: number;
}

export interface ImpactNugget {
    id?: string;
    title: string;
    insight: string;
    category: string | KnowledgeCategory;
}

export interface UserProfileSummary {
    narrative: string;
}

export interface VisionCardData {
    id: string;
    title: string;
    prompt: string;
    imageUrl?: string;
    isLoading: boolean;
}

export interface ToolConfig {
    id: string;
    titleKey: string;
    descriptionKey: string;
    stage: WorkflowStage;
    roles: UserRole[];
    component: React.LazyExoticComponent<React.ComponentType<any>>; 
    icon?: React.ReactNode;
    order?: number;
    isImplemented?: boolean;
}

// Analysis & Gemini Types

export type DecisionType = string;
export type DesiredOutcome = string;
export type Stakeholder = string;
export type FocusArea = string;
export type DecisionCategory = string;

export interface AnalysisParameters {
    problem: string;
    decisionType: DecisionType;
    riskAppetite: RiskAppetite;
    horizon: AnalysisHorizon;
    focusAreas: FocusArea[];
    desiredOutcomes: DesiredOutcome[];
    stakeholders: Stakeholder[];
    constraints: string;
    personas: Persona[];
    analysisMode: AnalysisMode;
    options?: string[];
    useGoogleSearch: boolean;
    prioritizeSpeed: boolean;
}

export interface GroundingSource {
    web: {
        uri: string;
        title?: string;
    }
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
    potentialImpact: number;
    confidenceScore: number;
    actionPlan?: ActionStep[];
    isGeneratingActionPlan?: boolean;
}

export interface PersonaAnalysis {
    analysisResult: string;
    scenarios: Scenario[];
    error: string | null;
    sources: GroundingSource[];
}

export type AllAnalysisResults = Record<string, PersonaAnalysis>;

export interface SynthesisResult {
    executiveSummary: string;
    strategicRecommendation: {
        strategy: string;
        justification: string;
        confidence: number;
    };
    risks: {
        risk: string;
        severity: number;
        mitigation: string;
    }[];
    verdict?: string;
    consensusLevel?: number;
    unifiedStrategy?: {
        title: string;
        description: string;
        keySteps: string[];
    };
    riskMitigationPlan?: {
        risk: string;
        mitigation: string;
    }[];
    dissentingVoices?: string[];
}

export interface CulturalAtlasResult {
    visualTrends: VisualTrend[];
    sonicTrends: SonicTrend[];
    conceptualTrends: ConceptualTrend[];
}

export interface VisualTrend { name: string; description: string; }
export interface SonicTrend { name: string; description: string; }
export interface ConceptualTrend { name: string; description: string; }

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
    }
}

export interface NextAction {
    action: string;
    toolId: string;
    reasoning: string;
}

export interface PlaybookStep {
    toolId: string;
    description: string;
}

export interface AnalysisResponse {
    assumptionAnalysis: string[];
    counterpoints: { role: string; points: string[] };
    reasoningTest: string[];
    alternativePerspectives: string[];
    actionableRoadmap: { title: string; steps: string[] };
}

export type CouncilSynthesis = SynthesisResult;

export interface MarketingCampaign {
    id: string;
    nombre: string;
    descripcion: string;
    estado: CampaignStatus;
    fecha_inicio: string;
    fecha_fin: string;
    presupuesto: number;
    gasto: number;
}

export type CampaignStatus = 'Activa' | 'Planificacion' | 'Completada' | 'Archivada';

export interface PsychometricQuestion {
    question: string;
    options: { text: string; value: string }[];
}

export interface BudgetPredictionResult {
    totalBudget: number;
    currency: string;
    categories: {
        name: string;
        percentage: number;
        amount: number;
        rationale: string;
        trendModifier?: 'HIGH' | 'MEDIUM' | 'LOW';
    }[];
    strategicInsight: string;
    viabilityScore: number;
}

export interface KnowledgeNugget {
    id: string;
    category: KnowledgeCategory;
    tags: string[];
}

export interface InitializedTool {
    title: string;
    points: string[];
    design: string;
    synergy: string[];
    polymorphic: string[];
    kpis: string[];
    criticalConsiderations: string[];
}

export interface DeliberationChunk {
    type: 'moderator' | 'persona';
    persona?: Persona;
    message: string;
    isGeneratingSuggestions?: boolean;
    suggestions?: string[];
}

export interface ContentItem {
    id: string;
    id_campana: string;
    titulo: string;
    cuerpo: string;
    estado: string;
    plataforma: string;
    fecha_creacion: string;
}

export interface Lead {
    id: string;
    email: string;
    nombre: string;
    apellido: string;
    etapa: LeadStage;
    puntuacion: number;
    fuente: string;
}

export type LeadStage = 'Lead' | 'Cliente' | 'Suscriptor';

export interface MarketingMetric {
    id: string;
    label: string;
    value: number;
}

export interface VectorMemoryItem {
    id: string;
    content: string;
    metadata: {
        type: 'SESSION' | 'PROJECT' | 'NUGGET' | 'PROFILE';
        timestamp: number;
    };
    score?: number;
}

export type ToolStatus = 'locked' | 'available' | 'completed';

// New Predictive Types
export interface PredictiveInsight {
    trend: 'POSITIVE' | 'NEGATIVE' | 'STABLE';
    probability: number; // 0-100
    insight: string;
    actionableTrigger: string;
    focusArea: 'FINANCE' | 'TIMELINE' | 'SCOPE' | 'MARKET';
}

// Knowledge Architect (Course Builder) Types
export type CourseLevel = "Principiante" | "Intermedio" | "Avanzado";
export type CourseBlockType = "idea" | "ejemplo" | "actividad" | "test";

export interface CourseTestQuestion {
  q: string;
  options: string[];
  answerIndex: number; // 0..3
}

export interface CourseLessonBlock {
  type: CourseBlockType;
  title: string;
  content: string;
  question?: CourseTestQuestion;
}

export interface CourseLesson {
  id: string; // e.g., "1.1"
  title: string;
  summary: string;
  blocks: CourseLessonBlock[];
}

export interface CourseUnit {
  id: string; // "1"
  title: string;
  summary: string;
  lessons: CourseLesson[];
}

export interface CourseArchitecture {
  title: string;
  subtitle: string;
  level: CourseLevel;
  durationText: string;
  objectives: string[];
  units: CourseUnit[];
  finalEvaluation: CourseTestQuestion[];
  finalProjects: { title: string; description: string }[];
  sources: string[];
}

export interface CourseFormData {
  tema: string;
  nivel: CourseLevel;
  perfil: string;
  objetivo: string;
  tiempo: string;
  formato: string;
}