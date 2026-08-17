import React from 'react';
import { UserRole, RiskAppetite, AnalysisHorizon, Persona, DecisionType } from "./types";
import { Icon } from './components/Icon';

const p = (d: string) => <path strokeLinecap="round" strokeLinejoin="round" d={d} />;

export const ROLE_OPTIONS: UserRole[] = [
    UserRole.ARTIST,
    UserRole.MANAGER,
    UserRole.PROJECT_MANAGER,
    UserRole.ENTREPRENEUR,
    UserRole.STRATEGIC_COMMUNICATOR,
    UserRole.BOOK_AUTHOR,
];

export const ROLE_CONFIG: Record<UserRole, {
    icon: React.ReactNode;
    labelKey: string;
    descriptionKey: string;
    availablePersonas: Persona[];
    availableDecisionTypes: Record<string, DecisionType[]>;
    availableOutcomes: string[];
    availableStakeholders: string[];
    availableFocusAreas: string[];
}> = {
    [UserRole.ARTIST]: {
        icon: p("M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"),
        labelKey: 'role_ARTIST',
        descriptionKey: 'role_desc_ARTIST',
        availablePersonas: ['CREATIVE_ORACLE', 'BRAND_ARCHITECT', 'COMMUNITY_STRATEGIST'],
        availableDecisionTypes: { 'ESTRATEGIA_CREATIVA': ['Estilo de Lanzamiento', 'Identidad Visual'] },
        availableOutcomes: ['Crecimiento', 'Ingresos', 'Integridad Artística'],
        availableStakeholders: ['Fans', 'Sello Discográfico', 'Banda'],
        availableFocusAreas: ['Producción', 'Marketing']
    },
    [UserRole.MANAGER]: {
        icon: p("M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.253M15 19.128v-3.86a2.25 2.25 0 0 1 .9-1.751M15 19.128S14.25 19.5 12 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M12 15.25v3.86m0 0S11.25 19.5 9 19.5s-3-1.872-3-1.872v-3.86a2.25 2.25 0 0 1 .9-1.751M9 15.25v3.86M15 13.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"),
        labelKey: 'role_MANAGER',
        descriptionKey: 'role_desc_MANAGER',
        availablePersonas: ['TREASURY_GUARDIAN', 'MARKET_CONQUEROR', 'DEVILS_ADVOCATE'],
        availableDecisionTypes: {},
        availableOutcomes: [],
        availableStakeholders: [],
        availableFocusAreas: []
    },
    [UserRole.PROJECT_MANAGER]: {
        icon: p("M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"),
        labelKey: 'role_PROJECT_MANAGER',
        descriptionKey: 'role_desc_PROJECT_MANAGER',
        availablePersonas: ['PRODUCTION_MASTER', 'DATA_SCIENTIST'],
        availableDecisionTypes: {},
        availableOutcomes: [],
        availableStakeholders: [],
        availableFocusAreas: []
    },
    [UserRole.ENTREPRENEUR]: {
        icon: p("M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"),
        labelKey: 'role_ENTREPRENEUR',
        descriptionKey: 'role_desc_ENTREPRENEUR',
        availablePersonas: ['MARKET_CONQUEROR', 'TREASURY_GUARDIAN', 'DIGITAL_PLATFORMS_GURU'],
        availableDecisionTypes: {},
        availableOutcomes: [],
        availableStakeholders: [],
        availableFocusAreas: []
    },
    [UserRole.STRATEGIC_COMMUNICATOR]: {
        icon: p("M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"),
        labelKey: 'role_STRATEGIC_COMMUNICATOR',
        descriptionKey: 'role_desc_STRATEGIC_COMMUNICATOR',
        availablePersonas: ['BRAND_ARCHITECT', 'COMMUNITY_STRATEGIST'],
        availableDecisionTypes: {},
        availableOutcomes: [],
        availableStakeholders: [],
        availableFocusAreas: []
    },
    [UserRole.BOOK_AUTHOR]: {
        icon: p("M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0-14.25v14.25"),
        labelKey: 'role_BOOK_AUTHOR',
        descriptionKey: 'role_desc_BOOK_AUTHOR',
        availablePersonas: ['CREATIVE_ORACLE', 'CULTURAL_ANTHROPOLOGIST'],
        availableDecisionTypes: {},
        availableOutcomes: [],
        availableStakeholders: [],
        availableFocusAreas: []
    },
};

export const RISK_APPETITE_OPTIONS = [RiskAppetite.LOW, RiskAppetite.MEDIUM, RiskAppetite.HIGH, RiskAppetite.BALANCED];
export const ANALYSIS_HORIZON_OPTIONS = [AnalysisHorizon.SHORT_TERM, AnalysisHorizon.MEDIUM, AnalysisHorizon.LONG_TERM];

export const PERSONA_CONFIG: Record<Persona, { icon: React.ReactNode; labelKey: string }> = {
    CREATIVE_ORACLE: { icon: p("M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"), labelKey: 'personaNameCREATIVE_ORACLE' },
    BRAND_ARCHITECT: { icon: p("M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"), labelKey: 'personaNameBRAND_ARCHITECT' },
    PRODUCTION_MASTER: { icon: p("M11.42 15.17L17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"), labelKey: 'personaNamePRODUCTION_MASTER' },
    COMMUNITY_STRATEGIST: { icon: p("M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"), labelKey: 'personaNameCOMMUNITY_STRATEGIST' },
    MARKET_CONQUEROR: { icon: p("M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5-.5 1.5m0 0 .5 1.5m-1.5-.5-1.5-1.5m-6-3h12"), labelKey: 'personaNameMARKET_CONQUEROR' },
    DATA_SCIENTIST: { icon: p("M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5-.5 1.5m0 0 .5 1.5m-1.5-.5-1.5-1.5m-6-3h12"), labelKey: 'personaNameDATA_SCIENTIST' },
    TREASURY_GUARDIAN: { icon: p("M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.826-1.106-2.231 0-3.058a2.98 2.98 0 0 1 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 11.219 12.768 11 12 11c-.725 0-1.45-.22-2.003.659"), labelKey: 'personaNameTREASURY_GUARDIAN' },
    DEVILS_ADVOCATE: { icon: p("M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"), labelKey: 'personaNameDEVILS_ADVOCATE' },
    CULTURAL_ANTHROPOLOGIST: { icon: p("M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"), labelKey: 'personaNameCULTURAL_ANTHROPOLOGIST' },
    DIGITAL_PLATFORMS_GURU: { icon: p("M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"), labelKey: 'personaNameDIGITAL_PLATFORMS_GURU' },
};
