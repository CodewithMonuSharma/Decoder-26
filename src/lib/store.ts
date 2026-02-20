import { create } from "zustand";
import { Project, Task } from "./types";
import { projects as initialProjects, tasks as initialTasks } from "./data";

interface AppStore {
    projects: Project[];
    tasks: Task[];
    currentProject: Project | null;
    setCurrentProject: (project: Project | null) => void;
    addProject: (project: Project) => void;
    updateTaskStatus: (taskId: string, status: Task["status"]) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    projects: initialProjects,
    tasks: initialTasks,
    currentProject: null,
    setCurrentProject: (project) => set({ currentProject: project }),
    addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
    updateTaskStatus: (taskId, status) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
            projects: state.projects.map((p) => ({
                ...p,
                tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
            })),
        })),
}));
