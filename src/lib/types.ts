// TypeScript interfaces for the application

export interface Member {
    id: string;
    name: string;
    email: string;
    role: "Lead" | "Developer" | "Designer" | "Tester" | "Manager";
    avatar?: string;
    initials: string;
    tasksAssigned: number;
    joinedDate: string;
    status: "active" | "away" | "offline";
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    priority: "low" | "medium" | "high";
    assigneeId: string;
    dueDate: string;
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    status: "active" | "completed" | "paused" | "planning";
    teamSize: number;
    progress: number;
    members: Member[];
    tasks: Task[];
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    category: string;
}

export interface ActivityEvent {
    id: string;
    type: "task_completed" | "member_joined" | "project_created" | "comment" | "task_assigned" | "status_updated";
    message: string;
    userName: string;
    userInitials: string;
    projectName: string;
    timestamp: string;
    timeAgo: string;
}

export interface Stats {
    activeProjects: number;
    tasksCompleted: number;
    teamMembers: number;
    completionRate: number;
}
