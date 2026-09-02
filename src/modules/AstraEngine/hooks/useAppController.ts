import { useState, useEffect, useCallback } from 'react';
import { useSafeStorage } from './useSafeStorage';
import { generateUserProfileSummary } from '../services/geminiService';
import { 
    UserRole, AppView, Project, WorkflowStage, 
    ImpactNugget, Session, UserProfileSummary, VisionCardData 
} from '../types';

export const useAppController = (language: string) => {
    // Session & UI State
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isZenMode, setZenMode] = useState(false);

    // --- CENTRALIZED STATE (Persisted) ---
    const [userRole, setUserRole] = useSafeStorage<UserRole | null>('astra-userRole', null);
    
    // Domain Data
    const [projects, setProjects] = useSafeStorage<Project[]>('astra-projects', []);
    const [userNuggets, setUserNuggets] = useSafeStorage<ImpactNugget[]>('astra-userNuggets', []);
    const [sessions, setSessions] = useSafeStorage<Session[]>('astra-sessions', []);
    const [visions, setVisions] = useSafeStorage<VisionCardData[]>('astra-visions', []);

    // Strategic Journey State
    const [currentView, setCurrentView] = useState<AppView>(AppView.ROLE_SELECTOR);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [currentStage, setCurrentStage] = useSafeStorage<WorkflowStage>('astra-currentStage', WorkflowStage.DIAGNOSIS);
    const [completedTools, setCompletedTools] = useSafeStorage<Record<string, any>>('astra-completedTools', {});
    
    // AI Profiling
    const [userProfile, setUserProfile] = useState<UserProfileSummary | null>(null);
    const [discProfile, setDiscProfile] = useSafeStorage<string | null>('astra-discProfile', null);

    // --- SIDE EFFECTS ---
    
    // 1. Role-based Redirection
    useEffect(() => {
        if (userRole && currentView === AppView.ROLE_SELECTOR) {
            setCurrentView(AppView.DASHBOARD);
        } else if (!userRole) {
            setCurrentView(AppView.ROLE_SELECTOR);
        }
    }, [userRole]);

    // 2. Intelligent Profile Generation (Gemini)
    useEffect(() => {
        if (userRole) {
            const contextString = `Proyectos: ${projects.length}, Nuggets: ${userNuggets.length}, DISC: ${discProfile || 'N/A'}`;
            generateUserProfileSummary(contextString, language, userRole)
                .then(setUserProfile)
                .catch(e => console.error("AI Profile Error", e));
        }
    }, [userRole, discProfile, projects.length, userNuggets.length, language]);

    // --- ACTIONS (HANDLERS) ---

    const handleRoleSelect = useCallback((role: UserRole) => {
        setUserRole(role);
        setCurrentStage(WorkflowStage.DIAGNOSIS);
        // Optional: Reset specific progress if needed, but keeping data is usually better UX
    }, [setUserRole, setCurrentStage]);

    const handleCompleteTool = useCallback((toolId: string, rawData?: any) => {
        // Sanitize data implicitly via useSafeStorage setter
        setCompletedTools(prev => {
            const newCompleted = { ...prev, [toolId]: rawData || true };
            return newCompleted;
        });

        // Tool-specific side effects
        if (toolId === 'strategicProfileLab' && typeof rawData === 'string') {
            setDiscProfile(rawData);
        }
        if (toolId === 'visionBoard' && Array.isArray(rawData)) {
            setVisions(rawData);
        }

        setActiveToolId(null);
        setCurrentView(AppView.DASHBOARD);
    }, [setCompletedTools, setDiscProfile, setVisions]);

    const handleLaunchTool = useCallback((toolId: string) => {
        setActiveToolId(toolId);
        // Usually we stay on Dashboard or move to Journey view, 
        // the UI handles rendering the tool based on activeToolId
    }, []);

    const toggleZenMode = useCallback(() => {
        setZenMode(prev => !prev);
    }, []);

    const addProject = useCallback((project: Project) => {
        setProjects(prev => [...prev, project]);
    }, [setProjects]);

    const addSession = useCallback((session: Session) => {
        setSessions(prev => [session, ...prev]);
    }, [setSessions]);

    const addNugget = useCallback((nugget: ImpactNugget) => {
        setUserNuggets(prev => [...prev, nugget]);
    }, [setUserNuggets]);

    // --- API EXPOSURE ---
    return {
        state: {
            isAuthenticated,
            isZenMode,
            userRole, currentView, activeToolId, projects, sessions,
            userNuggets, currentStage, completedTools, userProfile,
            discProfile, visions
        },
        setters: {
            setProjects, setUserNuggets, setSessions, 
            setCurrentView, setActiveToolId, setUserProfile
        },
        actions: {
            setAuthenticated,
            handleRoleSelect,
            handleCompleteTool,
            handleLaunchTool,
            toggleZenMode,
            addProject,
            addSession,
            addNugget,
            setCurrentView,
            setCurrentStage,
            setActiveToolId,
            setUserProfile
        }
    };
};