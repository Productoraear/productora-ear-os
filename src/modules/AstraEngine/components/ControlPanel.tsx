import React, { useState } from 'react';
// FIX: Corrected import paths
import { AnalysisParameters, RiskAppetite, FocusArea, Persona, UserRole, DecisionType, DesiredOutcome, Stakeholder, DecisionCategory, AnalysisMode, AnalysisHorizon } from '../types';
import { RISK_APPETITE_OPTIONS, ANALYSIS_HORIZON_OPTIONS, PERSONA_CONFIG, ROLE_CONFIG } from '../constants';
import { Tooltip } from './Tooltip';
import { Icon } from './Icon';
import { useTranslations } from '../contexts/LanguageContext';
import { CollapsibleSection } from './CollapsibleSection';

interface ControlPanelProps {
  params: AnalysisParameters;
  setParams: React.Dispatch<React.SetStateAction<AnalysisParameters>>;
  onAnalyze: () => void;
  isLoading: boolean;
  userRole: UserRole;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <div className="relative">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-white/20'}`}></div>
        <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-4"></div>
    </div>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ params, setParams, onAnalyze, isLoading, userRole }) => {
    const { t } = useTranslations();
    const [newOption, setNewOption] = useState('');
    
    const config = ROLE_CONFIG[userRole];

    const handleMultiSelectChange = (field: 'focusAreas' | 'desiredOutcomes' | 'stakeholders' | 'personas', value: any) => {
        const currentValues = params[field] as any[];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(a => a !== value)
            : [...currentValues, value];

        if (field === 'personas' && newValues.length > 3) {
            return; // Enforce max 3 personas
        }

        setParams(p => ({ ...p, [field]: newValues }));
    };
    
    const handleAddOption = () => {
        if (newOption.trim() !== '') {
            setParams(p => ({ ...p, options: [...(p.options || []), newOption.trim()] }));
            setNewOption('');
        }
    };

    const handleRemoveOption = (index: number) => {
        setParams(p => ({ ...p, options: (p.options || []).filter((_, i) => i !== index) }));
    };

    const baseInputStyle = "w-full p-2.5 bg-white/5 border border-white/10 rounded-md focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-zinc-500";
    const baseTextAreaStyle = `${baseInputStyle} resize-none`;

    const canAnalyze = !isLoading && params.problem.length > 2 && params.personas.length > 0 && (params.analysisMode === AnalysisMode.EXPLORATORY || (params.options && params.options.length > 1));

    return (
        <aside className="w-full md:w-[450px] p-6 glass-surface overflow-y-auto">
            <div className="space-y-6">
                
                <CollapsibleSection title={`1. ${t('frameDecisionTitle')}`} tooltip={t('frameDecisionTooltip')} defaultOpen>
                     <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('decisionType')}
                            </label>
                            <select
                                value={params.decisionType}
                                onChange={(e) => setParams(p => ({ ...p, decisionType: e.target.value as DecisionType }))}
                                className={baseInputStyle}
                            >
                               {Object.entries(config.availableDecisionTypes).map(([category, types]) => {
                                    if ((types as DecisionType[]).length === 0) return null;
                                    return (
                                        <optgroup key={category} label={t(`category_${category}`)} className="bg-zinc-800 text-white">
                                            {(types as DecisionType[]).map(opt => (
                                                <option key={opt} value={opt}>{t(opt)}</option>
                                            ))}
                                        </optgroup>
                                    );
                               })}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('problemTitle')}
                            </label>
                            <textarea
                                value={params.problem}
                                onChange={(e) => setParams(p => ({ ...p, problem: e.target.value }))}
                                placeholder={t(`problemPlaceholder${userRole}`)}
                                className={`${baseTextAreaStyle} h-32`}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('analysisMode')}
                                <Tooltip text={t('analysisModeTooltip')} />
                            </label>
                            <div className="flex w-full bg-white/5 border border-white/10 rounded-md p-1">
                                <button onClick={() => setParams(p => ({ ...p, analysisMode: AnalysisMode.EXPLORATORY }))} className={`w-1/2 py-1.5 text-sm font-semibold rounded-sm transition-all duration-300 ${params.analysisMode === AnalysisMode.EXPLORATORY ? 'bg-white/90 text-black' : 'text-zinc-300 hover:bg-white/10'}`}>
                                    {t('analysisModeExploratory')}
                                </button>
                                <button onClick={() => setParams(p => ({ ...p, analysisMode: AnalysisMode.COMPARATIVE }))} className={`w-1/2 py-1.5 text-sm font-semibold rounded-sm transition-all duration-300 ${params.analysisMode === AnalysisMode.COMPARATIVE ? 'bg-white/90 text-black' : 'text-zinc-300 hover:bg-white/10'}`}>
                                    {t('analysisModeComparative')}
                                </button>
                            </div>
                        </div>

                        {params.analysisMode === AnalysisMode.COMPARATIVE && (
                             <div className="p-4 bg-black/20 rounded-lg border border-white/10">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                    {t('optionsTitle')}
                                     <Tooltip text={t('optionsTooltip')} />
                                </label>
                                <div className="space-y-2 mb-2">
                                    {(params.options || []).map((option, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-zinc-700/50 rounded-md text-sm">
                                            <span className="flex-grow text-zinc-200">{option}</span>
                                            <button onClick={() => handleRemoveOption(index)} className="p-1 text-zinc-400 hover:text-red-400 transition-colors">
                                                <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        value={newOption}
                                        onChange={(e) => setNewOption(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddOption()}
                                        placeholder={t('optionPlaceholder')}
                                        className={`${baseInputStyle} text-sm`}
                                    />
                                    <button onClick={handleAddOption} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors">
                                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                                    </button>
                                </div>
                            </div>
                        )}
                     </div>
                </CollapsibleSection>

                <CollapsibleSection title={`2. ${t('defineContextTitle')}`} tooltip={t('defineContextTooltip')}>
                    <div className="space-y-4">
                        <div>
                           <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('desiredOutcomes')}
                                <Tooltip text={t('desiredOutcomesTooltip')} />
                            </label>
                            <div className="grid grid-cols-1 gap-2">
                                {config.availableOutcomes.map(opt => (
                                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border ${params.desiredOutcomes.includes(opt) ? 'bg-blue-600/20 border-blue-500/80 text-white' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'}`}>
                                        <input type="checkbox" checked={params.desiredOutcomes.includes(opt)} onChange={() => handleMultiSelectChange('desiredOutcomes', opt)} className="custom-checkbox flex-shrink-0" />
                                        <span className="text-sm">{t(opt)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                         <div>
                           <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('stakeholders')}
                                 <Tooltip text={t('stakeholdersTooltip')} />
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {config.availableStakeholders.map(opt => (
                                    <button key={opt} onClick={() => handleMultiSelectChange('stakeholders', opt)} className={`px-3 py-1 text-sm rounded-full border transition-colors ${params.stakeholders.includes(opt) ? 'bg-blue-500/20 text-blue-300 border-blue-400/50' : 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'}`}>
                                        {t(opt)}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('constraints')}
                                 <Tooltip text={t('constraintsTooltip')} />
                            </label>
                            <textarea
                                value={params.constraints}
                                onChange={(e) => setParams(p => ({ ...p, constraints: e.target.value }))}
                                placeholder={t('constraintsPlaceholder')}
                                className={`${baseTextAreaStyle} h-24`}
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title={`3. ${t('paramsTitle')}`} tooltip={t('paramsTooltip')}>
                    <div className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('riskAppetite')}
                            </label>
                            <div className="flex w-full bg-white/5 border border-white/10 rounded-md p-1">
                                {RISK_APPETITE_OPTIONS.map(opt => (
                                    <button key={opt} onClick={() => setParams(p => ({ ...p, riskAppetite: opt as RiskAppetite }))} className={`w-1/3 py-1.5 text-sm font-semibold rounded-sm transition-all duration-300 ${params.riskAppetite === opt ? 'bg-white/90 text-black' : 'text-zinc-300 hover:bg-white/10'}`}>
                                        {t(opt as string)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                           <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('timeHorizon')}
                            </label>
                             <div className="flex flex-col sm:flex-row gap-2">
                                {ANALYSIS_HORIZON_OPTIONS.map(opt => (
                                    <button key={opt} onClick={() => setParams(p => ({ ...p, horizon: opt as AnalysisHorizon }))} className={`flex-1 py-2 text-sm rounded-md border transition-colors ${params.horizon === opt ? 'bg-white/90 border-white/90 text-black font-semibold' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'}`}>
                                        {t(opt as string)}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                           <label className="text-sm font-medium text-zinc-300 flex items-center gap-2 mb-2">
                                {t('focusAreas')}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {config.availableFocusAreas.map(opt => (
                                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all border ${params.focusAreas.includes(opt) ? 'bg-blue-600/20 border-blue-500/80 text-white' : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:border-white/20'}`}>
                                        <input type="checkbox" checked={params.focusAreas.includes(opt)} onChange={() => handleMultiSelectChange('focusAreas', opt)} className="custom-checkbox flex-shrink-0" />
                                        <span className="text-sm">{t(opt)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection title={`4. ${t('personaTitleMulti')}`} tooltip={t(`personaTooltip${userRole}`)} >
                    <p className="text-xs text-zinc-400 mb-3">{t('personaSelectionPrompt')}</p>
                    <div className="space-y-2">
                        {config.availablePersonas.map(opt => (
                             <label key={opt} 
                                className={`w-full text-left p-4 rounded-lg border flex items-start gap-4 transition-all duration-300 cursor-pointer relative overflow-hidden
                                ${params.personas.includes(opt) ? 'bg-blue-600/20 border-blue-500/80' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                             >
                                 <input 
                                    type="checkbox" 
                                    checked={params.personas.includes(opt)} 
                                    onChange={() => handleMultiSelectChange('personas', opt)}
                                    className="custom-checkbox mt-1 flex-shrink-0 z-10"
                                />
                                <div className='z-10 flex items-start gap-4'>
                                    <Icon className="w-8 h-8 text-blue-400 flex-shrink-0">{PERSONA_CONFIG[opt].icon}</Icon>
                                    <div>
                                        <p className="font-semibold text-white">{t(`personaName${opt}`)}</p>
                                        <p className="text-xs text-zinc-400">{t(`personaDescription${opt}`)}</p>
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                </CollapsibleSection>
                
                <CollapsibleSection title={`5. ${t('advancedControlsTitle')}`} tooltip={t('advancedControlsTooltip')}>
                    <div className="space-y-4 rounded-lg bg-black/20 p-4 border border-white/10">
                        <label className="flex items-center justify-between cursor-pointer">
                           <div className="flex items-center gap-2">
                             <span className="text-sm text-zinc-200 font-medium">{t('useGoogleSearch')}</span>
                             <Tooltip text={t('useGoogleSearchTooltip')} />
                           </div>
                           <ToggleSwitch
                                checked={params.useGoogleSearch}
                                onChange={(checked) => setParams(p => ({ ...p, useGoogleSearch: checked }))}
                           />
                        </label>
                        <div className="border-t border-white/10"></div>
                        <label className="flex items-center justify-between cursor-pointer">
                             <div className="flex items-center gap-2">
                               <span className="text-sm text-zinc-200 font-medium">{t('prioritizeSpeed')}</span>
                               <Tooltip text={t('prioritizeSpeedTooltip')} />
                             </div>
                            <ToggleSwitch
                                checked={params.prioritizeSpeed}
                                onChange={(checked) => setParams(p => ({ ...p, prioritizeSpeed: checked }))}
                            />
                        </label>
                    </div>
                </CollapsibleSection>


                <button
                    onClick={onAnalyze}
                    disabled={!canAnalyze}
                    className={`w-full flex items-center justify-center gap-3 py-3 px-4 bg-gradient-to-r from-blue-600 to-fuchsia-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.03] focus:scale-[1.03] disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none disabled:opacity-60`}
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           {t('analyzing')}...
                        </>
                    ) : (
                        <>
                         <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /></Icon>
                         {t('analyzeButton')}
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
};