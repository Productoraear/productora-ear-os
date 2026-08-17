
import React, { lazy } from 'react';
import { ToolConfig, UserRole, WorkflowStage } from '../types';

// Helper for lazy loading with optional delay or error handling
const loadTool = (importPath: () => Promise<any>) => 
    lazy(() => importPath().catch(() => ({ default: () => React.createElement('div', { className: 'p-4 text-red-500' }, 'Error loading tool') })));

export const TOOL_REGISTRY: Record<string, ToolConfig> = {
    strategicProfileLab: {
        id: 'strategicProfileLab',
        titleKey: 'tool_strategicProfileLab_title',
        descriptionKey: 'tool_strategicProfileLab_description',
        stage: WorkflowStage.DIAGNOSIS,
        roles: [UserRole.ARTIST, UserRole.MANAGER, UserRole.PROJECT_MANAGER, UserRole.ENTREPRENEUR, UserRole.STRATEGIC_COMMUNICATOR, UserRole.BOOK_AUTHOR],
        component: loadTool(() => import('../components/tools/StrategicProfileLab').then(module => ({ default: module.StrategicProfileLab }))),
    },
    visionBoard: {
        id: 'visionBoard',
        titleKey: 'tool_visionBoard_title',
        descriptionKey: 'tool_visionBoard_description',
        stage: WorkflowStage.PROTOTYPING, // Mapping STRATEGY to PROTOTYPING for now based on types.ts
        roles: [UserRole.ARTIST, UserRole.ENTREPRENEUR, UserRole.BOOK_AUTHOR],
        component: loadTool(() => import('../components/tools/VisionBoard').then(module => ({ default: module.VisionBoard }))),
    },
    wheelOfLife: {
        id: 'wheelOfLife',
        titleKey: 'tool_wheelOfLife_title',
        descriptionKey: 'tool_wheelOfLife_description',
        stage: WorkflowStage.DIAGNOSIS,
        roles: [UserRole.ARTIST, UserRole.MANAGER, UserRole.PROJECT_MANAGER, UserRole.ENTREPRENEUR, UserRole.STRATEGIC_COMMUNICATOR, UserRole.BOOK_AUTHOR],
        component: loadTool(() => import('../components/tools/WheelOfLife').then(module => ({ default: module.WheelOfLife }))),
    },
    swotAnalysis: {
        id: 'swotAnalysis',
        titleKey: 'tool_swotAnalysis_title',
        descriptionKey: 'tool_swotAnalysis_description',
        stage: WorkflowStage.DIAGNOSIS,
        roles: [UserRole.MANAGER, UserRole.PROJECT_MANAGER, UserRole.ENTREPRENEUR],
        component: loadTool(() => import('../components/tools/SWOTAnalysis').then(module => ({ default: module.SWOTAnalysis }))),
    },
    geminiToolkit: {
        id: 'geminiToolkit',
        titleKey: 'tool_geminiToolkit_title',
        descriptionKey: 'tool_geminiToolkit_description',
        stage: WorkflowStage.IMPLEMENTATION,
        roles: [UserRole.PROJECT_MANAGER, UserRole.MANAGER, UserRole.STRATEGIC_COMMUNICATOR, UserRole.ENTREPRENEUR],
        component: loadTool(() => import('../components/tools/GeminiAdvancedToolkit').then(module => ({ default: module.GeminiAdvancedToolkit }))),
    },
    knowledgeArchitect: {
        id: 'knowledgeArchitect',
        titleKey: 'tool_knowledgeArchitect_title',
        descriptionKey: 'tool_knowledgeArchitect_description',
        stage: WorkflowStage.IMPLEMENTATION,
        roles: [UserRole.ENTREPRENEUR, UserRole.MANAGER, UserRole.PROJECT_MANAGER],
        component: loadTool(() => import('../components/tools/KnowledgeArchitect').then(module => ({ default: module.KnowledgeArchitect }))),
    },
    // Add placeholders for other tools if components exist or add as they are created
};