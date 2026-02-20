export type UserRole = "student" | "mentor" | "admin";
export type ProjectStatus = "active" | "completed" | "paused" | "planning";
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type MemberRole = "Lead" | "Developer" | "Designer" | "Tester" | "Manager";
export type MemberStatus = "active" | "away" | "offline";

export interface User {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    createdAt?: string;
    updatedAt?: string;
}

export interface TeamMember {
    id?: string;
    _id?: string;
    userId?: string;
    name: string;
    email: string;
    role: MemberRole;
    avatar?: string;
    initials: string;
    tasksAssigned: number;
    joinedDate: string;
    status: MemberStatus;
}

export interface Task {
    id?: string;
    _id?: string;
    projectId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    assigneeName?: string;
    assigneeInitials?: string;
    dueDate?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Project {
    id?: string;
    _id?: string;
    name: string;
    description: string;
    techStack: string[];
    status: ProjectStatus;
    teamSize: number;
    progress: number;
    members: TeamMember[];
    tasks?: Task[];
    createdAt?: string;
    updatedAt?: string;
    ownerId?: string;
    leaderId?: string;
    category: string;
    invitedMentorId?: string | null;
    mentorStatus?: "none" | "pending" | "accepted" | "rejected";
}

export interface Contribution {
    id: string;
    projectId: string;
    memberId: string;
    type: "commit" | "pr" | "comment" | "task_completion";
    impactScore: number;
    description: string;
    timestamp: string;
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

export interface DashboardStats {
    activeProjects: number;
    tasksCompleted: number;
    teamMembers: number;
    avgProgress: number;
}
