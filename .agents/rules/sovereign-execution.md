---
description: "EAR OS V2 Autonomous Governance & Sovereign Execution"
---

# Sovereign Execution (sovereign-execution.md)

1. **Role Bifurcation**:
   - **System Orchestrator (Claude/Antigravity)**: Designs blueprints, enforces rules, updates `.agents/rules/`, and delegates commands via `.antigravity/tasks_queue.json`. NEVER executes terminal/powershell commands directly.
   - **Bare-Metal Workers (Cline + Qwen)**: Processes the tasks queue autonomously, executes bash/powershell, commits changes, and ensures `npx tsc --noEmit` returns Exit Code 0 without burning external API tokens.
2. **Local Model Hierarchy & Hardware Routing (GPU RX 7900 XTX 24GB)**:
   - **Lead Code Worker (Cline Act Mode)**: `Qwen2.5 Coder 32B Instruct [Q4_K_M]` (~18.49 GB). Fits 100% into 24GB VRAM. Mandatory engine for file modifications, tool-calling, and TypeScript validation.
   - **Reasoning / Deep Logic (Plan Mode)**: `DeepSeek R1 Distill Qwen 14B` (~8.37 GB).
   - **Local Inference Endpoint**: LM Studio Local Server running at `http://localhost:1234/v1`. GPU Offload set to MAX (100%), context window 16k-32k.
3. **Protected Cores**: 
   - `src/lib/vimume/b2g-tender-engine.ts`
   - `src/lib/astra/astra-conversation-engine.ts`
   These modules MUST NEVER be rewritten or duplicated. Extend them only.
4. **Audit Trigger (Veto Estratégico)**: Activating veto if the Orchestrator attempts terminal auto-execution, alters the 80/10/10 split, breaks TypeScript, uses `eval()`, or hardcodes secrets.
