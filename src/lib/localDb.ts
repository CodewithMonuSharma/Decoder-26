import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// ── Types ─────────────────────────────────────────
export interface Task {
    id: string;
    projectId: string;
    title: string;
    description?: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    assigneeName?: string;
    assigneeInitials?: string;
    dueDate?: string;
}

export interface Member {
    id?: string;
    name: string;
    email: string;
    role: string;
    initials: string;
    tasksAssigned: number;
    joinedDate: string;
    status: "active" | "away" | "offline";
}

export interface Project {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    status: string;
    teamSize: number;
    progress: number;
    category: string;
    members: Member[];
    tasks: Task[];
    createdAt: string;
}

interface DB {
    projects: Project[];
}

// ── Helpers ───────────────────────────────────────
function readDB(): DB {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
}

function writeDB(db: DB): void {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function uid(): string {
    return Math.random().toString(36).slice(2, 10);
}

// ── Public API ────────────────────────────────────
export const localDb = {
    // Projects
    getProjects(): Project[] {
        return readDB().projects;
    },

    getProject(id: string): Project | undefined {
        return readDB().projects.find((p) => p.id === id);
    },

    createProject(data: Partial<Project>): Project {
        const db = readDB();
        const project: Project = {
            id: uid(),
            name: data.name ?? "Untitled Project",
            description: data.description ?? "",
            techStack: data.techStack ?? [],
            status: data.status ?? "active",
            teamSize: data.teamSize ?? 1,
            progress: 0,
            category: data.category ?? "Web",
            members: data.members ?? [],
            tasks: [],
            createdAt: new Date().toISOString().split("T")[0],
        };
        db.projects.push(project);
        writeDB(db);
        return project;
    },

    updateProject(id: string, data: Partial<Project>): Project | null {
        const db = readDB();
        const idx = db.projects.findIndex((p) => p.id === id);
        if (idx === -1) return null;
        db.projects[idx] = { ...db.projects[idx], ...data };
        writeDB(db);
        return db.projects[idx];
    },

    deleteProject(id: string): boolean {
        const db = readDB();
        const before = db.projects.length;
        db.projects = db.projects.filter((p) => p.id !== id);
        writeDB(db);
        return db.projects.length < before;
    },

    // Tasks
    getTasks(projectId: string): Task[] {
        const project = localDb.getProject(projectId);
        return project?.tasks ?? [];
    },

    createTask(projectId: string, data: Partial<Task>): Task | null {
        const db = readDB();
        const idx = db.projects.findIndex((p) => p.id === projectId);
        if (idx === -1) return null;
        const task: Task = {
            id: uid(),
            projectId,
            title: data.title ?? "New Task",
            description: data.description ?? "",
            status: data.status ?? "todo",
            priority: data.priority ?? "medium",
            assigneeName: data.assigneeName ?? "",
            assigneeInitials: data.assigneeInitials ?? "",
            dueDate: data.dueDate ?? "",
        };
        db.projects[idx].tasks.push(task);
        writeDB(db);
        return task;
    },
};
