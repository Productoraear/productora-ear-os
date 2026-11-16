'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  CANONICAL_AUTOMATIONS,
  AutomationTaskItem,
  AutomationGlobalConfig,
  getDefaultAutomationConfig
} from '@/lib/admin/automation-config-ssot';

interface DepartmentGroup {
  id: string;
  name: string;
  tasks: AutomationTaskItem[];
}

export function CEOAutomationCockpit() {
  const [config, setConfig] = useState<AutomationGlobalConfig>(getDefaultAutomationConfig());
  const [tasks, setTasks] = useState<Record<string, boolean>>(getDefaultAutomationConfig().tasks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [, startTransition] = useTransition();

  // Load from API on mount
  useEffect(() => {
    let mounted = true;
    async function loadConfig() {
      try {
        const res = await fetch('/api/admin/automation-config');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.config) {
            if (mounted) {
              setConfig(json.config);
              setTasks(json.config.tasks || {});
            }
          }
        }
      } catch (err) {
        console.warn('Error loading automation config:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadConfig();
    return () => {
      mounted = false;
    };
  }, []);

  // Save changes to API
  const handleSave = async (updatedConfig: Partial<AutomationGlobalConfig>, updatedTasks?: Record<string, boolean>) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const payload = {
        masterHitlAutonomyLevel: updatedConfig.masterHitlAutonomyLevel ?? config.masterHitlAutonomyLevel,
        hotLeadThresholdEur: updatedConfig.hotLeadThresholdEur ?? config.hotLeadThresholdEur,
        notificationTarget: updatedConfig.notificationTarget ?? config.notificationTarget,
        b2gEscalationThresholdEur: updatedConfig.b2gEscalationThresholdEur ?? config.b2gEscalationThresholdEur,
        logisticsKmPriceEur: updatedConfig.logisticsKmPriceEur ?? config.logisticsKmPriceEur,
        hotelPerDiemEur: updatedConfig.hotelPerDiemEur ?? config.hotelPerDiemEur,
        tasks: updatedTasks ?? tasks
      };

      const res = await fetch('/api/admin/automation-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.config) {
          setConfig(json.config);
          setTasks(json.config.tasks || {});
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2500);
        }
      }
    } catch (err) {
      console.error('Error saving automation config:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const nextState = !tasks[taskId];
    const newTasks = { ...tasks, [taskId]: nextState };
    setTasks(newTasks);
    startTransition(() => {
      handleSave({}, newTasks);
    });
  };

  const handleHitlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const updated = { ...config, masterHitlAutonomyLevel: val };
    setConfig(updated);
  };

  const handleHitlCommit = () => {
    handleSave({ masterHitlAutonomyLevel: config.masterHitlAutonomyLevel });
  };

  // Group automations by department
  const departments: DepartmentGroup[] = [];
  const deptMap = new Map<string, DepartmentGroup>();

  for (const item of CANONICAL_AUTOMATIONS) {
    if (!deptMap.has(item.department)) {
      const group: DepartmentGroup = {
        id: item.department,
        name: item.departmentName,
        tasks: []
      };
      deptMap.set(item.department, group);
      departments.push(group);
    }
    deptMap.get(item.department)!.tasks.push(item);
  }

  // Count active vs total
  const totalTasks = CANONICAL_AUTOMATIONS.length;
  const activeCount = Object.values(tasks).filter(Boolean).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6 bg-[#030305] text-zinc-100 rounded-2xl border border-zinc-800 shadow-2xl">
      {/* HEADER SUPREMO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              S-CLASS PROTOCOL Ω-ROJO
            </span>
            <span className="text-xs font-mono text-zinc-500">
              40 AUTOMATIZACIONES · 8 DIRECCIONES
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Centro de Gobernanza y Mando CEO
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Control en caliente de permisos de agentes, umbrales de escalado HITL y soberanía operativa.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-mono text-zinc-400">ESTADO GLOBAL</div>
            <div className="text-sm font-semibold text-emerald-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {activeCount} de {totalTasks} Activas
            </div>
          </div>
          <div className="h-8 w-px bg-zinc-800" />
          <div className="text-right">
            <div className="text-xs font-mono text-zinc-400">HITL VIGILANCIA</div>
            <div className="text-sm font-semibold text-amber-400 font-mono">
              {config.masterHitlAutonomyLevel}% AUTONOMÍA
            </div>
          </div>
        </div>
      </div>

      {/* PANEL DE CONTROL EN CALIENTE (HITL & PARÁMETROS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DESLIZADOR MAESTRO HITL */}
        <div className="bg-[#08080c] border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Autonomía Agéntica HITL
            </span>
            <span className="text-sm font-mono font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {config.masterHitlAutonomyLevel}%
            </span>
          </div>

          <input
            type="range"
            min="5"
            max="90"
            step="5"
            value={config.masterHitlAutonomyLevel}
            onChange={handleHitlChange}
            onMouseUp={handleHitlCommit}
            onTouchEnd={handleHitlCommit}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-zinc-800 rounded-lg appearance-none"
          />

          <div className="flex justify-between text-[11px] font-mono text-zinc-500">
            <span>5% (Centinela Total)</span>
            <span>50% (Supervisado)</span>
            <span>90% (Piloto Autónomo)</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            {config.masterHitlAutonomyLevel <= 25 ? (
              <span className="text-amber-300 font-medium">
                🛡️ Modo Alta Vigilancia: Todo lead &gt; 1.500 € y cotizaciones con logística requieren aprobación manual del CEO.
              </span>
            ) : (
              <span className="text-emerald-300 font-medium">
                ⚡ Modo Autónomo Supervisado: Atención inmediata 24/7 y cualificación sin fricción. Litigios y B2G &gt; 5k€ escalan siempre.
              </span>
            )}
          </p>
        </div>

        {/* UMBRALES DE DISPARO Y ESCALADO */}
        <div className="bg-[#08080c] border border-zinc-800 rounded-xl p-5 space-y-3">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            Umbrales Financieros y Logísticos
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-zinc-500 font-mono block mb-1">Lead Caliente (€)</label>
              <input
                type="number"
                value={config.hotLeadThresholdEur}
                onChange={e => setConfig({ ...config, hotLeadThresholdEur: parseInt(e.target.value, 10) || 0 })}
                onBlur={() => handleSave({ hotLeadThresholdEur: config.hotLeadThresholdEur })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-white text-right focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-500 font-mono block mb-1">Escalado B2G (€)</label>
              <input
                type="number"
                value={config.b2gEscalationThresholdEur}
                onChange={e => setConfig({ ...config, b2gEscalationThresholdEur: parseInt(e.target.value, 10) || 0 })}
                onBlur={() => handleSave({ b2gEscalationThresholdEur: config.b2gEscalationThresholdEur })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-white text-right focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-500 font-mono block mb-1">Km Extra (&gt;100 km)</label>
              <input
                type="number"
                step="0.05"
                value={config.logisticsKmPriceEur}
                onChange={e => setConfig({ ...config, logisticsKmPriceEur: parseFloat(e.target.value) || 0 })}
                onBlur={() => handleSave({ logisticsKmPriceEur: config.logisticsKmPriceEur })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-white text-right focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-zinc-500 font-mono block mb-1">Dieta Hotel (€)</label>
              <input
                type="number"
                value={config.hotelPerDiemEur}
                onChange={e => setConfig({ ...config, hotelPerDiemEur: parseInt(e.target.value, 10) || 0 })}
                onBlur={() => handleSave({ hotelPerDiemEur: config.hotelPerDiemEur })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 font-mono text-white text-right focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* DESTINO DE ESCALADO CRÍTICO */}
        <div className="bg-[#08080c] border border-zinc-800 rounded-xl p-5 space-y-4">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider block">
            Centralita de Alertas Críticas (WhatsApp CEO)
          </span>

          <div>
            <label className="text-xs text-zinc-500 font-mono block mb-1">Teléfono Canónico</label>
            <input
              type="text"
              value={config.notificationTarget}
              onChange={e => setConfig({ ...config, notificationTarget: e.target.value })}
              onBlur={() => handleSave({ notificationTarget: config.notificationTarget })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 font-mono text-amber-300 font-semibold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-500">Canal Directo:</span>
            <span className="text-emerald-400 font-mono font-medium">WhatsApp n8n Webhook</span>
          </div>

          {saving && (
            <div className="text-xs font-mono text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              Sincronizando gobernanza en caliente...
            </div>
          )}
          {saveSuccess && (
            <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span>✔</span> Ajustes persistidos en PostgreSQL y Respaldo Local
            </div>
          )}
        </div>
      </div>

      {/* MATRIZ DE LAS 40 AUTOMATIZACIONES (8 DIRECCIONES) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">
            Matriz de Automatizaciones por Dirección Corporativa
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            {loading ? 'Cargando matriz...' : 'Sincronizado'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map(dept => {
            const deptActiveCount = dept.tasks.filter(t => tasks[t.id]).length;
            return (
              <div
                key={dept.id}
                className="bg-[#060609] border border-zinc-800/90 rounded-xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-amber-500 tracking-wider">
                      {dept.id}
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      {dept.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                    {deptActiveCount}/{dept.tasks.length} ON
                  </span>
                </div>

                <div className="space-y-3">
                  {dept.tasks.map(task => {
                    const isEnabled = tasks[task.id] ?? task.enabled;
                    return (
                      <div
                        key={task.id}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/40 transition-colors"
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded">
                              {task.id}
                            </span>
                            <span className="text-xs font-medium text-zinc-200">
                              {task.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-snug">
                            {task.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isEnabled ? 'bg-amber-500' : 'bg-zinc-700'
                          }`}
                          aria-label={`Alternar ${task.name}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              isEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default CEOAutomationCockpit;
