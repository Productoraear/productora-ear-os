"use client";

import React, { useState } from 'react';
import { UserRole, WorkflowStage } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { TOOL_REGISTRY } from '../utils/toolRegistry';
import {
  CheckCircleIcon,
  PlayIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface StrategicJourneyProps {
  userRole: UserRole;
  onLaunchTool: (toolId: string) => void;
  currentStage?: WorkflowStage;
  completedTools: Record<string, any>;
}

const STAGES = [
  {
    stage: WorkflowStage.DIAGNOSIS,
    num: '01',
    titleKey: 'stages.DIAGNOSIS',
    desc: 'Audit the foundational reality, isolate binding bottlenecks, and evaluate current positioning.'
  },
  {
    stage: WorkflowStage.PURPOSE,
    num: '02',
    titleKey: 'stages.PURPOSE',
    desc: 'Anchor core authentic intent, harmonic values, and non-negotiable north-star milestones.'
  },
  {
    stage: WorkflowStage.PROTOTYPING,
    num: '03',
    titleKey: 'stages.PROTOTYPING',
    desc: 'Formulate rapid strategic hypotheses, test narrative hooks, and model agreement frameworks.'
  },
  {
    stage: WorkflowStage.VALIDATION,
    num: '04',
    titleKey: 'stages.VALIDATION',
    desc: 'Subject strategies to adversarial multi-agent debate, contrarian testing, and tail-risk scrutiny.'
  },
  {
    stage: WorkflowStage.IMPLEMENTATION,
    num: '05',
    titleKey: 'stages.IMPLEMENTATION',
    desc: 'Deploy resource allocations, schedule execution cadences, and launch market campaigns.'
  },
  {
    stage: WorkflowStage.REFLECTION,
    num: '06',
    titleKey: 'stages.REFLECTION',
    desc: 'Harvest wisdom nuggets, capture retrospective learnings, and calibrate subsequent iterations.'
  }
];

export const StrategicJourney: React.FC<StrategicJourneyProps> = ({
  userRole,
  onLaunchTool,
  completedTools
}) => {
  const { t } = useTranslations();
  const [selectedStage, setSelectedStage] = useState<WorkflowStage>(WorkflowStage.DIAGNOSIS);

  const stageTools = Object.entries(TOOL_REGISTRY).filter(([_, config]) =>
    config.roles.includes(userRole) && config.stage === selectedStage
  );

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-purple-950/30 p-6 md:p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <SparklesIcon className="w-4 h-4" />
            6-Stage Strategic Operating System
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-1">
            The Astra Strategic Journey
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
            A systematic, progressive methodology engineered to transform raw ambiguous challenges into verified, antifragile execution roadmaps.
          </p>
        </div>
      </div>

      {/* Stage Flow Stepper */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map(s => {
          const isSelected = selectedStage === s.stage;
          return (
            <button
              key={s.stage}
              onClick={() => setSelectedStage(s.stage)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : 'bg-zinc-900/60 border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-mono font-bold text-blue-400">{s.num}</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />}
              </div>
              <span className="text-xs font-bold leading-tight line-clamp-2">
                {t(s.titleKey)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details & Associated Tools */}
      <div className="bg-zinc-900/70 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            Active Milestone Focus
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {t(`stages.${selectedStage}`)}
          </h2>
          <p className="text-sm text-zinc-300 mt-1">
            {STAGES.find(s => s.stage === selectedStage)?.desc}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Recommended Tools for this Stage:
          </h3>

          {stageTools.length === 0 ? (
            <div className="p-8 text-center bg-black/30 rounded-2xl border border-white/5 space-y-2">
              <p className="text-sm text-zinc-400">
                All primary stage tools are unified into the multi-stage deliberation pipeline.
              </p>
              <button
                onClick={() => onLaunchTool('councilOfMinds')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 mt-2"
              >
                <PlayIcon className="w-3.5 h-3.5" /> Convene Council on this Stage
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stageTools.map(([toolId, config]) => {
                const isDone = Boolean(completedTools[toolId]);
                return (
                  <div
                    key={toolId}
                    onClick={() => onLaunchTool(toolId)}
                    className="bg-black/40 hover:bg-black/60 border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-white">
                          {config.icon}
                        </div>
                        {isDone && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 flex items-center gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" /> Done
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-base group-hover:text-blue-300 transition-colors">
                        {t(config.titleKey)}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {t(config.descriptionKey)}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-blue-400">
                      <span>Launch Protocol</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
