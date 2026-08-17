
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserRole, WorkflowStage, UserProfileSummary, VisionCardData, ImpactNugget, Project, Session } from '../types';

interface AppState {
    // Session State
    isAuthenticated: boolean;
    setAuthenticated: (status: boolean) => void;
    
    // User State
    userRole: UserRole | null;
    setUserRole: (role: UserRole | null) => void;
    userProfile: UserProfileSummary | null;
    setUserProfile: (profile: UserProfileSummary | null) => void;
    discProfile: string | null;
    setDiscProfile: (profile: string | null) => void;
    
    // Journey State
    currentStage: WorkflowStage;
    setCurrentStage: (stage: WorkflowStage) => void;
    completedTools: Record<string, boolean>;
    markToolComplete: (toolId: string) => void;
    
    // UI State
    isZenMode: boolean;
    toggleZenMode: () => void;
    hasSeenTour: boolean;
    completeTour: () => void;
    
    // Data State
    projects: Project[];
    addProject: (project: Project) => void;
    updateProject: (project: Project) => void;
    
    userNuggets: ImpactNugget[];
    addNugget: (nugget: ImpactNugget) => void;
    
    visions: VisionCardData[];
    setVisions: (visions: VisionCardData[]) => void;
    
    sessions: Session[];
    addSession: (session: Session) => void;
    
    // Actions
    resetSession: () => void;
    fullReset: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            // Session
            isAuthenticated: false,
            setAuthenticated: (status) => set({ isAuthenticated: status }),
            
            // User
            userRole: null,
            setUserRole: (role) => set({ userRole: role }),
            userProfile: null,
            setUserProfile: (profile) => set({ userProfile: profile }),
            discProfile: null,
            setDiscProfile: (profile) => set({ discProfile: profile }),
            
            // Journey
            currentStage: WorkflowStage.DIAGNOSIS,
            setCurrentStage: (stage) => set({ currentStage: stage }),
            completedTools: {},
            markToolComplete: (toolId) => set((state) => ({ 
                completedTools: { ...state.completedTools, [toolId]: true } 
            })),
            
            // UI
            isZenMode: false,
            toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
            hasSeenTour: false,
            completeTour: () => set({ hasSeenTour: true }),
            
            // Data
            projects: [],
            addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
            updateProject: (project) => set((state) => ({
                projects: state.projects.map(p => p.id === project.id ? project : p)
            })),
            
            userNuggets: [],
            addNugget: (nugget) => set((state) => ({ userNuggets: [...state.userNuggets, nugget] })),
            
            visions: [],
            setVisions: (visions) => set({ visions }),
            
            sessions: [],
            addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
            
            // Meta Actions
            resetSession: () => set({ 
                userRole: null, 
                currentStage: WorkflowStage.DIAGNOSIS, 
                completedTools: {}, 
                userProfile: null, 
                visions: [] 
            }),
            
            fullReset: () => set({
                isAuthenticated: false,
                userRole: null,
                userProfile: null,
                discProfile: null,
                currentStage: WorkflowStage.DIAGNOSIS,
                completedTools: {},
                isZenMode: false,
                hasSeenTour: false,
                projects: [],
                userNuggets: [],
                visions: [],
                sessions: []
            })
        }),
        {
            name: 'astra-os-storage', // Key in localStorage
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Persist everything except session-specific auth (optional, here we persist auth for convenience)
                ...state
            })
        }
    )
);
