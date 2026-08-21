"use client";

import React from 'react';
import { ToolConfig, UserRole, WorkflowStage } from '../types';
import { CouncilOfMindsTool } from '../components/tools/CouncilOfMindsTool';
import { VisionBoardTool } from '../components/tools/VisionBoardTool';
import { SWOTTool } from '../components/tools/SWOTTool';
import { IkigaiTool } from '../components/tools/IkigaiTool';
import { RiskRadarTool } from '../components/tools/RiskRadarTool';
import { ContractAnalyzerTool } from '../components/tools/ContractAnalyzerTool';
import { ContentFactoryTool } from '../components/tools/ContentFactoryTool';
import { CampaignSimulatorTool } from '../components/tools/CampaignSimulatorTool';

import {
  UserGroupIcon,
  PhotoIcon,
  ShieldExclamationIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export const TOOL_REGISTRY: Record<string, ToolConfig> = {
  councilOfMinds: {
    titleKey: 'tools.councilOfMinds_title',
    descriptionKey: 'tools.councilOfMinds_desc',
    icon: <UserGroupIcon className="w-5 h-5" />,
    roles: [
      UserRole.ARTIST,
      UserRole.MANAGER,
      UserRole.PROJECT_MANAGER,
      UserRole.ENTREPRENEUR,
      UserRole.STRATEGIC_COMMUNICATOR,
      UserRole.BOOK_AUTHOR
    ],
    stage: WorkflowStage.DIAGNOSIS,
    order: 1,
    component: CouncilOfMindsTool,
    isImplemented: true
  },
  visionBoard: {
    titleKey: 'tools.visionBoard_title',
    descriptionKey: 'tools.visionBoard_desc',
    icon: <PhotoIcon className="w-5 h-5" />,
    roles: [
      UserRole.ARTIST,
      UserRole.MANAGER,
      UserRole.ENTREPRENEUR,
      UserRole.BOOK_AUTHOR
    ],
    stage: WorkflowStage.PURPOSE,
    order: 2,
    component: VisionBoardTool,
    isImplemented: true
  },
  swotAnalysis: {
    titleKey: 'tools.swotAnalysis_title',
    descriptionKey: 'tools.swotAnalysis_desc',
    icon: <ShieldExclamationIcon className="w-5 h-5" />,
    roles: [
      UserRole.MANAGER,
      UserRole.PROJECT_MANAGER,
      UserRole.ENTREPRENEUR,
      UserRole.STRATEGIC_COMMUNICATOR
    ],
    stage: WorkflowStage.DIAGNOSIS,
    order: 3,
    component: SWOTTool,
    isImplemented: true
  },
  ikigai: {
    titleKey: 'tools.ikigai_title',
    descriptionKey: 'tools.ikigai_desc',
    icon: <HeartIcon className="w-5 h-5" />,
    roles: [
      UserRole.ARTIST,
      UserRole.ENTREPRENEUR,
      UserRole.BOOK_AUTHOR
    ],
    stage: WorkflowStage.PURPOSE,
    order: 4,
    component: IkigaiTool,
    isImplemented: true
  },
  riskRadar: {
    titleKey: 'tools.riskRadar_title',
    descriptionKey: 'tools.riskRadar_desc',
    icon: <ExclamationTriangleIcon className="w-5 h-5" />,
    roles: [
      UserRole.MANAGER,
      UserRole.PROJECT_MANAGER,
      UserRole.ENTREPRENEUR
    ],
    stage: WorkflowStage.VALIDATION,
    order: 5,
    component: RiskRadarTool,
    isImplemented: true
  },
  contractAnalyzer: {
    titleKey: 'tools.contractAnalyzer_title',
    descriptionKey: 'tools.contractAnalyzer_desc',
    icon: <DocumentMagnifyingGlassIcon className="w-5 h-5" />,
    roles: [
      UserRole.ARTIST,
      UserRole.MANAGER,
      UserRole.BOOK_AUTHOR
    ],
    stage: WorkflowStage.PROTOTYPING,
    order: 6,
    component: ContractAnalyzerTool,
    isImplemented: true
  },
  contentFactory: {
    titleKey: 'tools.contentFactory_title',
    descriptionKey: 'tools.contentFactory_desc',
    icon: <PencilSquareIcon className="w-5 h-5" />,
    roles: [
      UserRole.ARTIST,
      UserRole.STRATEGIC_COMMUNICATOR,
      UserRole.BOOK_AUTHOR
    ],
    stage: WorkflowStage.PROTOTYPING,
    order: 7,
    component: ContentFactoryTool,
    isImplemented: true
  },
  campaignSimulator: {
    titleKey: 'tools.campaignSimulator_title',
    descriptionKey: 'tools.campaignSimulator_desc',
    icon: <ChartBarIcon className="w-5 h-5" />,
    roles: [
      UserRole.MANAGER,
      UserRole.ENTREPRENEUR,
      UserRole.STRATEGIC_COMMUNICATOR
    ],
    stage: WorkflowStage.IMPLEMENTATION,
    order: 8,
    component: CampaignSimulatorTool,
    isImplemented: true
  }
};
