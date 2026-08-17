
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, Session, ProjectStatus, Task } from '../types';
import { useTranslations } from '../contexts/LanguageContext';
import { Icon } from './Icon';

interface ProjectsDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    projects: Project[];
    sessions: Session[];
    onAddProject: (project: Omit<Project, 'id'>) => Project;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    onLoadSession: (session: Session) => void;
}

// --- Time Tracking Helper Components & Logic ---

const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
};

const TimerDisplay: React.FC<{ task: Task }> = ({ task }) => {
    const [currentTime, setCurrentTime] = useState(task.timeSpent || 0);

    useEffect(() => {
        let interval: any;
        if (task.isTracking && task.lastStartTime) {
            // Update immediately
            setCurrentTime((task.timeSpent || 0) + (Date.now() - task.lastStartTime));
            
            // Set interval for UI updates
            interval = setInterval(() => {
                const sessionTime = Date.now() - (task.lastStartTime || Date.now());
                setCurrentTime((task.timeSpent || 0) + sessionTime);
            }, 1000);
        } else {
            setCurrentTime(task.timeSpent || 0);
        }
        return () => clearInterval(interval);
    }, [task.isTracking, task.timeSpent, task.lastStartTime]);

    if (currentTime === 0 && !task.isTracking) return null;

    return (
        <div className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1.5 transition-colors ${task.isTracking ? 'bg-amber-900/30 text-amber-200 border border-amber-500/30 animate-pulse' : 'bg-zinc-800 text-zinc-500'}`}>
            <Icon className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></Icon>
            {formatTime(currentTime)}
        </div>
    );
};

// --- Task Logic ---

const findTask = (tasks: Task[], id: string): Task | null => {
    for (const task of tasks) {
        if (task.id === id) return task;
        if (task.subtasks) {
            const found = findTask(task.subtasks, id);
            if (found) return found;
        }
    }
    return null;
};

const getAllTaskIds = (tasks: Task[]): string[] => {
    let ids: string[] = [];
    tasks.forEach(t => {
        ids.push(t.id);
        if (t.subtasks) {
            ids = [...ids, ...getAllTaskIds(t.subtasks)];
        }
    });
    return ids;
};

const getCompletedTaskIds = (tasks: Task[]): string[] => {
    let ids: string[] = [];
    tasks.forEach(t => {
        if (t.completed) ids.push(t.id);
        if (t.subtasks) {
            ids = [...ids, ...getCompletedTaskIds(t.subtasks)];
        }
    });
    return ids;
};

const updateTaskInTree = (tasks: Task[], updatedTask: Task): Task[] => {
    return tasks.map(t => {
        if (t.id === updatedTask.id) return updatedTask;
        if (t.subtasks) {
            return { ...t, subtasks: updateTaskInTree(t.subtasks, updatedTask) };
        }
        return t;
    });
};

const addTaskToTree = (tasks: Task[], parentId: string | null, newTask: Task): Task[] => {
    if (!parentId) {
        return [...tasks, newTask];
    }
    return tasks.map(t => {
        if (t.id === parentId) {
            return { ...t, subtasks: [...(t.subtasks || []), newTask], expanded: true };
        }
        if (t.subtasks) {
            return { ...t, subtasks: addTaskToTree(t.subtasks, parentId, newTask) };
        }
        return t;
    });
};

const deleteTaskFromTree = (tasks: Task[], taskId: string): Task[] => {
    return tasks.filter(t => t.id !== taskId).map(t => ({
        ...t,
        subtasks: t.subtasks ? deleteTaskFromTree(t.subtasks, taskId) : []
    }));
};

const TaskItem: React.FC<{ 
    task: Task; 
    depth: number; 
    onToggle: (task: Task) => void;
    onAddSubtask: (parentId: string) => void;
    onDelete: (taskId: string) => void;
    onAddDependency: (taskId: string) => void;
    onToggleTimer: (task: Task) => void;
    completedTaskIds: string[];
    allTasksFlattened: {id: string, title: string}[];
}> = ({ task, depth, onToggle, onAddSubtask, onDelete, onAddDependency, onToggleTimer, completedTaskIds, allTasksFlattened }) => {
    const { t } = useTranslations();
    const isLocked = task.dependencies?.some(depId => !completedTaskIds.includes(depId));
    
    // Calculate progress for parent tasks
    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks = task.subtasks?.filter(t => t.completed).length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <div className="flex flex-col">
            <div 
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors group ${
                    isLocked ? 'opacity-50' : 'hover:bg-white/5'
                }`}
                style={{ marginLeft: `${depth * 20}px` }}
            >
                {/* Expander or Bullet */}
                <div className="w-5 flex justify-center">
                    {task.subtasks && task.subtasks.length > 0 ? (
                        <button onClick={() => onToggle({ ...task, expanded: !task.expanded })} className="text-zinc-500 hover:text-white">
                            <Icon className={`w-4 h-4 transition-transform ${task.expanded ? 'rotate-90' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></Icon>
                        </button>
                    ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                    )}
                </div>

                {/* Checkbox / Lock */}
                <button 
                    onClick={() => !isLocked && onToggle({ ...task, completed: !task.completed })}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                        isLocked 
                            ? 'bg-zinc-800 border-zinc-700 cursor-not-allowed' 
                            : task.completed 
                                ? 'bg-blue-600 border-blue-500' 
                                : 'border-zinc-600 hover:border-blue-400'
                    }`}
                >
                    {isLocked ? (
                        <Icon className="w-3 h-3 text-zinc-500"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></Icon>
                    ) : task.completed && (
                        <Icon className="w-3.5 h-3.5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></Icon>
                    )}
                </button>

                {/* Title */}
                <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <p className={`text-sm truncate ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>{task.title}</p>
                        {task.dependencies && task.dependencies.length > 0 && (
                            <div className="flex gap-1 mt-1">
                                {task.dependencies.map(depId => {
                                    const depTask = allTasksFlattened.find(t => t.id === depId);
                                    const isDepComplete = completedTaskIds.includes(depId);
                                    return (
                                        <span key={depId} className={`text-[10px] px-1.5 py-0.5 rounded border flex items-center gap-1 ${isDepComplete ? 'bg-green-900/20 text-green-400 border-green-800' : 'bg-red-900/20 text-red-400 border-red-800'}`}>
                                            <Icon className="w-2 h-2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></Icon>
                                            {depTask ? depTask.title.substring(0, 8) + '...' : depId}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {/* Time Tracking Badge */}
                    <TimerDisplay task={task} />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onToggleTimer(task)} title={task.isTracking ? t('pauseFocus') : t('startFocus')} className={`p-1 ${task.isTracking ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-400 hover:text-white'}`}>
                        {task.isTracking ? (
                            <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></Icon>
                        ) : (
                            <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" /></Icon>
                        )}
                    </button>
                    <button onClick={() => onAddSubtask(task.id)} title={t('addSubtask')} className="p-1 text-zinc-400 hover:text-blue-400">
                        <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                    </button>
                    <button onClick={() => onAddDependency(task.id)} title={t('addDependency')} className="p-1 text-zinc-400 hover:text-orange-400">
                        <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></Icon>
                    </button>
                    <button onClick={() => onDelete(task.id)} title={t('deleteTask')} className="p-1 text-zinc-400 hover:text-red-400">
                        <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                    </button>
                </div>
            </div>
            
            {/* Progress Bar for Parents */}
            {totalSubtasks > 0 && task.expanded && (
                <div className="ml-12 mr-4 h-1 bg-zinc-800 rounded-full mb-2 overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Recursion */}
            <AnimatePresence>
                {task.expanded && task.subtasks && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-l border-zinc-800 ml-5"
                    >
                        {task.subtasks.map(subtask => (
                            <TaskItem 
                                key={subtask.id} 
                                task={subtask} 
                                depth={0} // Visual nesting handled by CSS margin/border
                                onToggle={onToggle}
                                onAddSubtask={onAddSubtask}
                                onDelete={onDelete}
                                onAddDependency={onAddDependency}
                                onToggleTimer={onToggleTimer}
                                completedTaskIds={completedTaskIds}
                                allTasksFlattened={allTasksFlattened}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
    isOpen,
    onClose,
    projects,
    sessions,
    onAddProject,
    onUpdateProject,
    onDeleteProject,
    onLoadSession,
}) => {
    const { t } = useTranslations();
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview');
    
    // Task Management State
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [dependencyMode, setDependencyMode] = useState<{ targetId: string } | null>(null);

    const handleCreateProject = () => {
        const name = prompt(t('projectNameLabel'));
        if (name) {
            const newProject = onAddProject({
                name,
                description: '',
                status: ProjectStatus.PLANNING,
                sessions: [],
                tasks: []
            });
            setSelectedProject(newProject);
        }
    };

    const handleAddTask = (parentId: string | null = null) => {
        if (!selectedProject || !newTaskTitle.trim()) return;
        
        const newTask: Task = {
            id: `task_${Date.now()}`,
            title: newTaskTitle,
            completed: false,
            expanded: true,
            subtasks: [],
            dependencies: [],
            tags: [],
            timeSpent: 0,
            isTracking: false
        };

        const updatedTasks = addTaskToTree(selectedProject.tasks || [], parentId, newTask);
        const updatedProject = { ...selectedProject, tasks: updatedTasks };
        
        setSelectedProject(updatedProject);
        onUpdateProject(updatedProject);
        setNewTaskTitle('');
    };

    const handleTaskUpdate = (updatedTask: Task) => {
        if (!selectedProject) return;
        const updatedTasks = updateTaskInTree(selectedProject.tasks || [], updatedTask);
        const updatedProject = { ...selectedProject, tasks: updatedTasks };
        setSelectedProject(updatedProject);
        onUpdateProject(updatedProject);
    };

    const handleTaskDelete = (taskId: string) => {
        if (!selectedProject) return;
        const updatedTasks = deleteTaskFromTree(selectedProject.tasks || [], taskId);
        const updatedProject = { ...selectedProject, tasks: updatedTasks };
        setSelectedProject(updatedProject);
        onUpdateProject(updatedProject);
    };

    const handleAddDependency = (taskId: string) => {
        setDependencyMode({ targetId: taskId });
    };

    const handleSelectDependency = (dependencyId: string) => {
        if (!selectedProject || !dependencyMode) return;
        
        const targetTask = findTask(selectedProject.tasks || [], dependencyMode.targetId);
        if (targetTask && targetTask.id !== dependencyId) {
            const newDependencies = [...(targetTask.dependencies || []), dependencyId];
            const updatedTask = { ...targetTask, dependencies: newDependencies };
            handleTaskUpdate(updatedTask);
        }
        setDependencyMode(null);
    };

    // Time Tracking Logic
    const handleToggleTimer = (task: Task) => {
        if (!selectedProject) return;

        let updatedTask: Task;
        if (task.isTracking) {
            // Stop Tracking
            const endTime = Date.now();
            const sessionDuration = endTime - (task.lastStartTime || endTime);
            updatedTask = {
                ...task,
                isTracking: false,
                timeSpent: (task.timeSpent || 0) + sessionDuration,
                lastStartTime: undefined
            };
        } else {
            // Start Tracking
            // Optional: Pause all other trackers first if single-task focus is desired
            updatedTask = {
                ...task,
                isTracking: true,
                lastStartTime: Date.now()
            };
        }
        handleTaskUpdate(updatedTask);
    };

    const linkedSessions = sessions.filter(s => s.projectId === selectedProject?.id);
    
    // Flatten tasks for dropdowns/dependency checking
    const flattenTasks = (tasks: Task[]): {id: string, title: string}[] => {
        let flat: {id: string, title: string}[] = [];
        tasks.forEach(t => {
            flat.push({ id: t.id, title: t.title });
            if (t.subtasks) flat = [...flat, ...flattenTasks(t.subtasks)];
        });
        return flat;
    };
    
    const allProjectTasks = selectedProject?.tasks ? flattenTasks(selectedProject.tasks) : [];
    const completedTaskIds = selectedProject?.tasks ? getCompletedTaskIds(selectedProject.tasks) : [];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Sidebar */}
                        <div className="w-1/3 md:w-1/4 bg-black/20 border-r border-white/10 flex flex-col">
                            <header className="flex-shrink-0 p-4 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white">{t('projectsDashboardTitle')}</h2>
                                <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white md:hidden">
                                    <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                </button>
                            </header>
                            <div className="flex-1 p-2 overflow-y-auto">
                                <button onClick={handleCreateProject} className="w-full text-left mb-2 px-3 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors flex items-center gap-2">
                                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                                    {t('createNewProject')}
                                </button>
                                <ul className="space-y-1">
                                    {projects.map(p => (
                                        <li key={p.id}>
                                            <button
                                                onClick={() => { setSelectedProject(p); setActiveTab('overview'); }}
                                                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${selectedProject?.id === p.id ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}`}
                                            >
                                                {p.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Main Content */}
                        <main className="flex-1 flex flex-col">
                            {selectedProject ? (
                                <>
                                    <header className="flex-shrink-0 p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                                         <div className="flex items-center gap-4">
                                            <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>
                                            <div className="flex bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
                                                <button 
                                                    onClick={() => setActiveTab('overview')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                                >
                                                    {t('overviewTab')}
                                                </button>
                                                <button 
                                                    onClick={() => setActiveTab('tasks')}
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'tasks' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'}`}
                                                >
                                                    {t('tasksTab')} ({allProjectTasks.length})
                                                </button>
                                            </div>
                                         </div>
                                         <button onClick={onClose} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white">
                                            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></Icon>
                                        </button>
                                    </header>
                                    
                                    <div className="flex-1 p-6 overflow-y-auto">
                                        {activeTab === 'overview' && (
                                            <div>
                                                <h4 className="font-semibold text-zinc-300 mb-2">{t('linkedAnalysesLabel')}</h4>
                                                {linkedSessions.length > 0 ? (
                                                    <ul className="space-y-3">
                                                        {linkedSessions.map(s => (
                                                            <li key={s.id} className="bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/80 flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-semibold text-blue-400">{s.title}</p>
                                                                    <p className="text-xs text-zinc-500">{new Date(s.timestamp).toLocaleString()}</p>
                                                                </div>
                                                                <button onClick={() => { onLoadSession(s); onClose(); }} className="text-sm bg-zinc-700 hover:bg-zinc-600 px-3 py-1 rounded-md transition-colors text-zinc-200">
                                                                    {t('loadSession')}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-zinc-500 text-sm italic border-2 border-dashed border-zinc-800 p-4 rounded-lg text-center">{t('noLinkedAnalyses')}</p>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'tasks' && (
                                            <div className="h-full flex flex-col">
                                                {/* Add Task Bar */}
                                                <div className="flex gap-2 mb-6">
                                                    <input 
                                                        type="text" 
                                                        value={newTaskTitle}
                                                        onChange={e => setNewTaskTitle(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                                                        placeholder={t('addTaskPlaceholder')} 
                                                        className="flex-grow p-2.5 bg-zinc-800/50 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                    />
                                                    <button onClick={() => handleAddTask()} disabled={!newTaskTitle.trim()} className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-colors">
                                                        <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
                                                    </button>
                                                </div>

                                                {/* Dependency Selection Mode Banner */}
                                                {dependencyMode && (
                                                    <div className="bg-orange-900/30 border border-orange-500/50 p-3 rounded-lg mb-4 flex justify-between items-center animate-pulse">
                                                        <p className="text-orange-200 text-sm">{t('selectDependencyBanner')}</p>
                                                        <button onClick={() => setDependencyMode(null)} className="text-orange-300 hover:text-white text-xs underline">{t('cancelDependency')}</button>
                                                    </div>
                                                )}

                                                {/* Tasks List */}
                                                <div className="flex-1 overflow-y-auto space-y-2">
                                                    {selectedProject.tasks && selectedProject.tasks.length > 0 ? (
                                                        selectedProject.tasks.map(task => (
                                                            <div key={task.id} className={dependencyMode ? "cursor-pointer hover:bg-zinc-800/50 p-1 rounded" : ""} onClick={() => dependencyMode && handleSelectDependency(task.id)}>
                                                                <TaskItem 
                                                                    task={task} 
                                                                    depth={0} 
                                                                    onToggle={handleTaskUpdate}
                                                                    onAddSubtask={(parentId) => {
                                                                        const title = prompt(t('subtaskTitlePrompt'));
                                                                        if (title) {
                                                                            setNewTaskTitle(title);
                                                                            // This is a bit hacky due to state closure, ideally use a modal
                                                                            // Direct state manipulation for prompt flow
                                                                            const t: Task = { id: `t_${Date.now()}`, title, completed: false, subtasks: [], dependencies: [], tags: [], timeSpent: 0, isTracking: false };
                                                                            const updated = addTaskToTree(selectedProject.tasks || [], parentId, t);
                                                                            const p = { ...selectedProject, tasks: updated };
                                                                            setSelectedProject(p);
                                                                            onUpdateProject(p);
                                                                        }
                                                                    }}
                                                                    onDelete={handleTaskDelete}
                                                                    onAddDependency={handleAddDependency}
                                                                    onToggleTimer={handleToggleTimer}
                                                                    completedTaskIds={completedTaskIds}
                                                                    allTasksFlattened={allProjectTasks}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-12 text-zinc-500">
                                                            <Icon className="w-12 h-12 mx-auto mb-2 opacity-50"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></Icon>
                                                            <p>{t('noTasksYet')}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500">
                                     <Icon className="w-16 h-16 mb-4 text-zinc-600">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
                                    </Icon>
                                    <p className="text-lg font-semibold">{projects.length > 0 ? t('projectsDashboard_selectProject') : t('noProjects')}</p>
                                    <p className="text-sm max-w-xs mt-1">{projects.length > 0 ? t('projectsDashboard_selectProjectDesc') : t('projectsDashboard_noProjectsDesc')}</p>
                                </div>
                            )}
                        </main>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
