import React from "react";
import { ToolConfig, WorkflowStage, UserRole } from "../types";

export const TOOL_REGISTRY: Record<string, ToolConfig> = {
  "ikigai-finder": {
    id: "ikigai-finder",
    titleKey: "tool_ikigai_title",
    descriptionKey: "tool_ikigai_desc",
    stage: WorkflowStage.DIAGNOSIS,
    roles: [UserRole.ARTIST],
    component: React.lazy(() => import("../components/tools/IkigaiWorkshop").then((m: any) => ({ default: m.IkigaiWorkshop || m.default }))),
    isImplemented: true
  },
  "budget-predictor": {
    id: "budget-predictor",
    titleKey: "tool_budget_title",
    descriptionKey: "tool_budget_desc",
    stage: WorkflowStage.STRATEGY,
    roles: [UserRole.MANAGER, UserRole.PROJECT_MANAGER],
    component: React.lazy(() => import("../components/tools/BudgetPredictor").then((m: any) => ({ default: m.BudgetPredictor || m.default }))),
    isImplemented: true
  }
};