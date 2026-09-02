"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserRole,
    AppView,
    Session,
    Project,
    UserProfileSummary,
    VisionCardData,
    ImpactNugget
} from './types';

import { useTranslations } from './contexts/LanguageContext';
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { SaveSessionModal } from './components/SaveSessionModal';
import { SessionPreviewModal } from './components/SessionPreviewModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { KnowledgeExplorerModal } from './components/KnowledgeExplorerModal';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { WisdomVaultModal } from './components/WisdomVaultModal';
import { AboutModal } from './components/AboutModal';
import { StrategicCommandDashboard } from './components/StrategicCommandDashboard';
import { StrategicJourney } from './components/StrategicJourney';
import { CommandPalette } from './components/CommandPalette';
import { ToolkitHub } from './components/ToolkitHub';

// Data & Utils
import { knowledgeBase } from './data/knowledgeBase';
import { TOOL_REGISTRY } from './utils/toolRegistry';
import { generateUserProfileSummary, generateAIAssistantResponse } from './services/geminiService';

const App: React.FC = () => {
    const { t, language } = useTranslations();

    // --- Core State ---
    const [userRole, setUserRole] = useLocalStorage<UserRole | null>('astra-userRole', null);
    const [currentView, setCurrentView] = useState<AppView>(AppView.ROLE_SELECTOR);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    
    // --- Data State ---
    const [sessions, setSessions] = useLocalStorage<Session[]>('astra-sessions', []);
    const [projects, setProjects] = useLocalStorage<Project[]>('astra-projects', []);
    const [userNuggets, setUserNuggets] = useLocalStorage<ImpactNugget[]>('astra-userNuggets', []);
    const [visions, setVisions] = useLocalStorage<VisionCardData[]>('astra-visions', []);
    const [completedTools, setCompletedTools] = useLocalStorage<Record<string, any>>('astra-completedTools', {});
    const [userProfile, setUserProfile] = useState<UserProfileSummary | null>(null);

    // --- UI State ---
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewSession, setPreviewSession] = useState<Session | null>(null);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [isKnowledgeExplorerOpen, setIsKnowledgeExplorerOpen] = useState(false);
    const [isProjectsDashboardOpen, setIsProjectsDashboardOpen] = useState(false);
    const [isWisdomVaultOpen, setIsWisdomVaultOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

    // --- Effects ---

    // Initial View Routing
    useEffect(() => {
        if (userRole) {
            setCurrentView(AppView.DASHBOARD);
        } else {
            setCurrentView(AppView.ROLE_SELECTOR);
        }
    }, [userRole]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // User Profile Generation
    useEffect(() => {
        if (userRole) {
            const contextString = `
                Role: ${userRole}
                Projects: ${JSON.stringify(projects.map(p => ({ name: p.name, status: p.status })))}
                Wisdom Nuggets: ${JSON.stringify(userNuggets.map(n => n.title))}
                Completed Tools: ${JSON.stringify(Object.keys(completedTools))}
            `;
            generateUserProfileSummary(contextString, language, userRole)
                .then(setUserProfile)
                .catch(e => console.error("Failed to generate profile", e));
        }
    }, [userRole, projects, userNuggets, completedTools, language]);

    // --- Handlers ---

    const handleRoleSelect = useCallback((role: UserRole) => {
        setUserRole(role);
        setCurrentView(AppView.DASHBOARD);
        setCompletedTools({});
        setUserProfile(null);
        setVisions([]);
    }, [setUserRole, setCompletedTools, setVisions]);

    const handleLaunchTool = useCallback((toolId: string) => {
        setActiveToolId(toolId);
        setCurrentView(AppView.STRATEGIC_JOURNEY); // Or a specific Tool View
    }, []);

    const handleCompleteTool = useCallback((toolId: string, data?: any) => {
        console.log(`Tool ${toolId} completed`, data);
        
        // Clean data to avoid circular references before storing
        let safeData = data;
        if (data && (data.nativeEvent || data._reactName)) {
             safeData = true; 
        }

        setCompletedTools(prev => ({ ...prev, [toolId]: safeData || true }));
        
        if (toolId === 'visionBoard' && Array.isArray(safeData)) {
            setVisions(safeData);
        }
        
        setActiveToolId(null);
        setCurrentView(AppView.DASHBOARD);
    }, [setCompletedTools, setVisions]);

    const handleSaveNugget = useCallback((nugget: ImpactNugget) => {
        setUserNuggets(prev => [...prev, nugget]);
    }, [setUserNuggets]);

    const handleNavigateBack = useCallback(() => {
        if (activeToolId) {
            setActiveToolId(null);
        } else if (currentView !== AppView.DASHBOARD) {
            setCurrentView(AppView.DASHBOARD);
        }
    }, [activeToolId, currentView]);

    // --- Render Helpers ---

    const renderContent = () => {
        if (!userRole) return <RoleSelector onRoleSelect={handleRoleSelect} />;

        if (activeToolId) {
            const toolConfig = TOOL_REGISTRY[activeToolId];
            if (toolConfig && toolConfig.component) {
                const ToolComponent = toolConfig.component;
                return (
                    <ToolComponent 
                        userRole={userRole}
                        onComplete={(data: any) => handleCompleteTool(activeToolId, data)}
                        onLaunchTool={handleLaunchTool}
                        onSaveNugget={handleSaveNugget}
                        initialVisions={visions}
                    />
                );
            }
            return <div>Tool not found</div>;
        }

        switch (currentView) {
            case AppView.DASHBOARD:
                return (
                    <StrategicCommandDashboard
                        userRole={userRole}
                        onNavigateToJourney={() => setCurrentView(AppView.STRATEGIC_JOURNEY)}
                        onLaunchTool={handleLaunchTool}
                        projects={projects}
                        userNuggets={userNuggets}
                        userProfile={userProfile}
                        dataContextString={""}
                        onUpdateUserProfile={() => {}}
                        completedTools={completedTools}
                        visions={visions}
                    />
                );
            case AppView.STRATEGIC_JOURNEY:
                return (
                    <StrategicJourney
                        userRole={userRole}
                        onLaunchTool={handleLaunchTool}
                        currentStage={Object.values(TOOL_REGISTRY).find((t: any) => t.stage)?.stage as any} // Simplified for now
                        completedTools={completedTools}
                    />
                );
            case AppView.TOOLKIT_HUB:
                return (
                    <ToolkitHub 
                        userRole={userRole}
                        onLaunchTool={handleLaunchTool}
                    />
                );
            default:
                return <StrategicCommandDashboard 
                            userRole={userRole}
                            onNavigateToJourney={() => setCurrentView(AppView.STRATEGIC_JOURNEY)}
                            onLaunchTool={handleLaunchTool}
                            projects={projects}
                            userNuggets={userNuggets}
                            userProfile={userProfile}
                            dataContextString={""}
                            onUpdateUserProfile={() => {}}
                            completedTools={completedTools}
                            visions={visions}
                        />;
        }
    };

    return (
        <div className="bg-zinc-950 text-white font-sans flex flex-col h-screen w-screen overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
            {/* Global Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40">
                 <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 rounded-full blur-[120px]" />
                 <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            {userRole && (
                <Header
                    onSave={() => setIsSaveModalOpen(true)}
                    onExport={() => {}}
                    onToggleHistory={() => setIsHistoryOpen(true)}
                    onToggleSettings={() => setIsSettingsOpen(true)}
                    onToggleAIAssistant={() => setIsAIAssistantOpen(true)}
                    onToggleKnowledgeExplorer={() => setIsKnowledgeExplorerOpen(true)}
                    onToggleProjectsDashboard={() => setIsProjectsDashboardOpen(true)}
                    onToggleWisdomVault={() => setIsWisdomVaultOpen(true)}
                    onToggleAbout={() => setIsAboutModalOpen(true)}
                    onDemoCalibration={() => {}}
                    hasAnalysis={false}
                    activeRole={userRole}
                    onRoleSelect={handleRoleSelect}
                    onNavigateBack={activeToolId || currentView !== AppView.DASHBOARD ? handleNavigateBack : undefined}
                    currentToolName={activeToolId ? t(TOOL_REGISTRY[activeToolId]?.titleKey) : t(currentView === AppView.STRATEGIC_JOURNEY ? 'strategicJourney_title' : 'dashboard_title')}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative z-10 pt-[80px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${currentView}-${activeToolId}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Modals & Panels */}
            {userRole && (
                <>
                    <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                    <HistoryPanel 
                        isOpen={isHistoryOpen} 
                        onClose={() => setIsHistoryOpen(false)} 
                        sessions={sessions} 
                        onLoad={() => {}} 
                        onDelete={() => {}} 
                        onPreview={(s) => { setPreviewSession(s); setIsPreviewModalOpen(true); }} 
                    />
                    <SaveSessionModal 
                        isOpen={isSaveModalOpen} 
                        onClose={() => setIsSaveModalOpen(false)} 
                        onSave={() => {}} 
                        projects={projects} 
                        onAddProject={() => ({} as any)} 
                        currentProblem="" 
                    />
                    {previewSession && (
                        <SessionPreviewModal 
                            isOpen={isPreviewModalOpen} 
                            onClose={() => setIsPreviewModalOpen(false)} 
                            session={previewSession} 
                        />
                    )}
                    <AIAssistantModal 
                        isOpen={isAIAssistantOpen} 
                        onClose={() => setIsAIAssistantOpen(false)} 
                        onGenerate={(text, action) => generateAIAssistantResponse(text, action, language)} 
                    />
                    <KnowledgeExplorerModal 
                        isOpen={isKnowledgeExplorerOpen} 
                        onClose={() => setIsKnowledgeExplorerOpen(false)} 
                        knowledgeBase={knowledgeBase} 
                        onConfirmSelection={() => {}} 
                        initiallySelectedIds={[]} 
                    />
                    <ProjectsDashboard 
                        isOpen={isProjectsDashboardOpen} 
                        onClose={() => setIsProjectsDashboardOpen(false)} 
                        projects={projects} 
                        sessions={sessions} 
                        onAddProject={() => ({} as any)} 
                        onUpdateProject={() => {}} 
                        onDeleteProject={() => {}} 
                        onLoadSession={() => {}} 
                    />
                    <WisdomVaultModal 
                        isOpen={isWisdomVaultOpen} 
                        onClose={() => setIsWisdomVaultOpen(false)} 
                        nuggets={userNuggets} 
                    />
                    <AboutModal 
                        isOpen={isAboutModalOpen} 
                        onClose={() => setIsAboutModalOpen(false)} 
                    />
                    <CommandPalette 
                        isOpen={isCommandPaletteOpen} 
                        onClose={() => setIsCommandPaletteOpen(false)} 
                        onLaunchTool={handleLaunchTool} 
                        userRole={userRole} 
                    />
                </>
            )}
        </div>
    );
};

export default App;