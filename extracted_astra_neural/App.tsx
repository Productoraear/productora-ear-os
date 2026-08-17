
import React, { useState, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppController } from './hooks/useAppController';
import { useModalManager } from './hooks/useModalManager';
import { useTranslations } from './contexts/LanguageContext';
import { TOOL_REGISTRY } from './utils/toolRegistry';
import { AppView, UserRole, RiskAppetite, AnalysisHorizon, Project, ProjectStatus } from './types';
import { knowledgeBase } from './data/knowledgeBase';

// Components
import { Header } from './components/Header';
import { RoleSelector } from './components/RoleSelector';
import { StrategicCommandDashboard } from './components/StrategicCommandDashboard';
import { StrategicJourney } from './components/StrategicJourney';
import { ToolkitHub } from './components/ToolkitHub';
import { RoleWelcomeExperience } from './components/RoleWelcomeExperience';
import { AIOmnipresentOrb } from './components/AIOmnipresentOrb';
import { BiometricLogin } from './components/BiometricLogin';
import { SplashScreen } from './components/SplashScreen';
import { ToolLoader } from './components/ui/ToolLoader';

// Modals
import { SettingsPanel } from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AIAssistantModal } from './components/AIAssistantModal';
import { WisdomVaultModal } from './components/WisdomVaultModal';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { KnowledgeExplorerModal } from './components/KnowledgeExplorerModal';
import { SaveSessionModal } from './components/SaveSessionModal';
import { AboutModal } from './components/AboutModal';
import { CommandPalette } from './components/CommandPalette';
import { Scratchpad } from './components/Scratchpad';
import { MagneticCursor } from './components/MagneticCursor';
import { ToastContainer } from './components/ToastContainer';
import { Sidebar } from './components/Sidebar';

// Special Tools & Containers
import { StrategicCouncilContainer } from './components/strategic_council/StrategicCouncilContainer';
import { MarketingEngine } from './components/tools/MarketingEngine';
import { Proa } from './components/tools/Proa';
import { AuditoriaInternaExtrema } from './components/tools/AuditoriaInternaExtrema';
import { DigitalSignature } from './components/tools/DigitalSignature';
import { TimeAuditor } from './components/tools/TimeAuditor';
import { ImpactJournal } from './components/tools/ImpactJournal';
import { AtlasCultural } from './components/AtlasCultural';
import { NarrativeBuilder } from './components/tools/NarrativeBuilder';
import { ValuePropositionArsenal } from './components/tools/ValuePropositionArsenal';
import { IkigaiWorkshop } from './components/tools/IkigaiWorkshop';

const App: React.FC = () => {
    const { language, t } = useTranslations();
    const [showSplash, setShowSplash] = useState(true);
    
    // Core Controller
    const { 
        state, 
        actions, 
        setters 
    } = useAppController(language);

    // Modal Manager
    const modals = useModalManager();

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Cmd+K or Ctrl+K for Command Palette
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                modals.openModal('command');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modals]);

    // Helper to match onAddProject signature in components
    const handleAddProject = (projectData: Omit<Project, 'id'>): Project => {
        const newProject: Project = {
            ...projectData,
            id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        actions.addProject(newProject);
        return newProject;
    };

    // Derived State
    const currentToolConfig = state.activeToolId ? TOOL_REGISTRY[state.activeToolId] : null;

    // View Routing
    const renderContent = () => {
        // 1. Tool View (Highest Priority)
        if (state.activeToolId) {
            // Manual overrides for tools that might not be fully in registry or require special props
            switch (state.activeToolId) {
                case 'strategicCouncil':
                    return <StrategicCouncilContainer userRole={state.userRole!} onComplete={() => actions.handleCompleteTool('strategicCouncil')} />;
                case 'marketingEngine':
                    return <MarketingEngine onComplete={() => actions.handleCompleteTool('marketingEngine')} />;
                case 'proa':
                    return <Proa onComplete={() => actions.handleCompleteTool('proa')} />;
                case 'auditoriaInterna':
                case 'laboratorioRobustez': // Reusing auditoria for robustez logic if needed, or specific component
                    return <AuditoriaInternaExtrema />;
                case 'digitalSignature':
                    return <DigitalSignature onComplete={() => actions.handleCompleteTool('digitalSignature')} />;
                case 'timeAuditor':
                    return <TimeAuditor onComplete={() => actions.handleCompleteTool('timeAuditor')} />;
                case 'impactJournal':
                    return <ImpactJournal onComplete={() => actions.handleCompleteTool('impactJournal')} onSaveNugget={actions.addNugget} />;
                case 'atlasCultural':
                    return <AtlasCultural />;
                case 'narrativeBuilder':
                    return <NarrativeBuilder />;
                case 'valueProposition':
                    return <ValuePropositionArsenal />;
                case 'ikigaiWorkshop':
                    return <IkigaiWorkshop onComplete={() => actions.handleCompleteTool('ikigaiWorkshop')} userRole={state.userRole!} />;
            }

            if (currentToolConfig) {
                const ToolComponent = currentToolConfig.component;
                return (
                    <Suspense fallback={<ToolLoader />}>
                        <ToolComponent 
                            onComplete={(data: any) => actions.handleCompleteTool(state.activeToolId!, data)}
                            userRole={state.userRole}
                            onLaunchTool={actions.handleLaunchTool}
                            initialVisions={state.visions}
                        />
                    </Suspense>
                );
            }
            
            return <div className="p-8 text-center text-zinc-500">Herramienta no encontrada o en construcción: {state.activeToolId}</div>;
        }

        // 2. Main Views
        switch (state.currentView) {
            case AppView.ROLE_SELECTOR:
                return <RoleSelector onRoleSelect={actions.handleRoleSelect} />;
            
            case AppView.DASHBOARD:
                if (!state.userProfile && !state.isZenMode) {
                     return (
                        <RoleWelcomeExperience 
                            userRole={state.userRole!}
                            onNavigateToHub={() => setters.setCurrentView(AppView.STRATEGIC_JOURNEY)}
                            onNavigateToTool={actions.handleLaunchTool}
                        />
                     );
                }
                return (
                    <StrategicCommandDashboard
                        userRole={state.userRole!}
                        onNavigateToJourney={() => setters.setCurrentView(AppView.STRATEGIC_JOURNEY)}
                        onLaunchTool={actions.handleLaunchTool}
                        projects={state.projects}
                        userNuggets={state.userNuggets}
                        userProfile={state.userProfile}
                        dataContextString={state.discProfile || ""} 
                        onUpdateUserProfile={setters.setUserProfile}
                        completedTools={state.completedTools}
                        visions={state.visions}
                        isZenMode={state.isZenMode}
                    />
                );

            case AppView.STRATEGIC_JOURNEY:
                return (
                    <StrategicJourney
                        userRole={state.userRole!}
                        onLaunchTool={actions.handleLaunchTool}
                        currentStage={state.currentStage}
                        completedTools={state.completedTools}
                    />
                );
            
            case AppView.TOOLKIT_HUB:
                return (
                    <ToolkitHub 
                        userRole={state.userRole!}
                        onLaunchTool={actions.handleLaunchTool}
                    />
                );
            
            default:
                return <div className="p-8 text-center text-zinc-500">Vista no encontrada</div>;
        }
    };

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    if (!state.isAuthenticated) {
        return <BiometricLogin onAuthenticated={() => actions.setAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden flex flex-row relative">
            <MagneticCursor />
            <ToastContainer />
            
            {/* Sidebar */}
            {state.currentView !== AppView.ROLE_SELECTOR && !state.isZenMode && (
                <Sidebar 
                    currentView={state.currentView}
                    onViewChange={setters.setCurrentView}
                    onOpenProjects={() => modals.openModal('projects')}
                    onOpenWisdom={() => modals.openModal('wisdom')}
                    isZenMode={state.isZenMode}
                />
            )}

            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Header */}
                {state.currentView !== AppView.ROLE_SELECTOR && !state.isZenMode && (
                    <Header
                        onSave={() => modals.openModal('save')}
                        onExport={() => { /* Implement Export Logic */ }}
                        onToggleHistory={() => modals.openModal('history')}
                        onToggleSettings={() => modals.openModal('settings')}
                        onToggleAIAssistant={() => modals.openModal('ai')}
                        onToggleKnowledgeExplorer={() => modals.openModal('knowledge')}
                        onToggleProjectsDashboard={() => modals.openModal('projects')}
                        onToggleWisdomVault={() => modals.openModal('wisdom')}
                        onToggleAbout={() => modals.openModal('about')}
                        onDemoCalibration={() => {}}
                        hasAnalysis={false}
                        activeRole={state.userRole!}
                        onRoleSelect={actions.handleRoleSelect}
                        onNavigateBack={state.activeToolId ? () => actions.setActiveToolId(null) : undefined}
                        currentToolName={state.activeToolId && currentToolConfig ? t(currentToolConfig.titleKey) : state.activeToolId ? t(`tool_${state.activeToolId}_title`) : ''}
                        onToggleScratchpad={() => modals.toggleModal('scratchpad')}
                    />
                )}

                {/* Main Content */}
                <main className={`flex-1 flex flex-col relative z-10 transition-all duration-500 ${state.currentView !== AppView.ROLE_SELECTOR && !state.isZenMode ? 'pt-20' : ''}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={state.activeToolId || state.currentView}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 flex flex-col h-full overflow-hidden"
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* AI Orb */}
            {state.currentView !== AppView.ROLE_SELECTOR && !state.isZenMode && (
                <AIOmnipresentOrb 
                    onOpenAssistant={() => modals.openModal('ai')}
                    currentView={state.currentView}
                    activeToolId={state.activeToolId}
                    currentStage={state.currentStage}
                />
            )}

            {/* Modals */}
            <SettingsPanel 
                isOpen={modals.isOpen('settings')} 
                onClose={modals.closeModal}
                defaultValues={{ riskAppetite: RiskAppetite.BALANCED, horizon: AnalysisHorizon.MEDIUM, useGoogleSearch: true, prioritizeSpeed: false }}
                onDefaultChange={() => {}}
            />
            
            <HistoryPanel
                isOpen={modals.isOpen('history')}
                onClose={modals.closeModal}
                sessions={state.sessions}
                onLoad={() => {}}
                onDelete={() => {}}
                onPreview={() => {}}
            />

            <AIAssistantModal 
                isOpen={modals.isOpen('ai')}
                onClose={modals.closeModal}
            />

            <WisdomVaultModal 
                isOpen={modals.isOpen('wisdom')}
                onClose={modals.closeModal}
                nuggets={state.userNuggets}
                onAddNugget={actions.addNugget}
            />

            <ProjectsDashboard
                isOpen={modals.isOpen('projects')}
                onClose={modals.closeModal}
                projects={state.projects}
                sessions={state.sessions}
                onAddProject={handleAddProject}
                onUpdateProject={() => {}} 
                onDeleteProject={() => {}}
                onLoadSession={() => {}}
            />

            <KnowledgeExplorerModal
                isOpen={modals.isOpen('knowledge')}
                onClose={modals.closeModal}
                knowledgeBase={knowledgeBase}
                onConfirmSelection={() => {}}
                initiallySelectedIds={[]}
            />

            <AboutModal
                isOpen={modals.isOpen('about')}
                onClose={modals.closeModal}
            />

            <CommandPalette
                isOpen={modals.isOpen('command')}
                onClose={modals.closeModal}
                onLaunchTool={actions.handleLaunchTool}
                userRole={state.userRole}
            />

            <Scratchpad
                isOpen={modals.isOpen('scratchpad')}
                onClose={modals.closeModal}
            />

            <SaveSessionModal
                isOpen={modals.isOpen('save')}
                onClose={modals.closeModal}
                onSave={() => {}}
                projects={state.projects}
                onAddProject={handleAddProject}
                currentProblem=""
            />

        </div>
    );
};

export default App;
