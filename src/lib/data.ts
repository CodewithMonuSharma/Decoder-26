import { Project, Member, Task, ActivityEvent } from "./types";

export const members: Member[] = [
    { id: "m1", name: "Arjun Sharma", email: "arjun@college.edu", role: "Lead", initials: "AS", tasksAssigned: 5, joinedDate: "Jan 10, 2025", status: "active" },
    { id: "m2", name: "Priya Patel", email: "priya@college.edu", role: "Developer", initials: "PP", tasksAssigned: 4, joinedDate: "Jan 12, 2025", status: "active" },
    { id: "m3", name: "Rohan Verma", email: "rohan@college.edu", role: "Designer", initials: "RV", tasksAssigned: 3, joinedDate: "Jan 14, 2025", status: "away" },
    { id: "m4", name: "Sneha Kumar", email: "sneha@college.edu", role: "Developer", initials: "SK", tasksAssigned: 4, joinedDate: "Jan 15, 2025", status: "active" },
    { id: "m5", name: "Karan Mehta", email: "karan@college.edu", role: "Tester", initials: "KM", tasksAssigned: 2, joinedDate: "Jan 20, 2025", status: "offline" },
];

export const tasks: Task[] = [
    // Project 1 tasks
    { id: "t1", projectId: "p1", title: "Design ML pipeline architecture", description: "Design the full ML pipeline for the research portal", status: "done", priority: "high", assigneeId: "m1", dueDate: "Feb 5, 2025", createdAt: "Jan 15, 2025" },
    { id: "t2", projectId: "p1", title: "Set up data preprocessing module", description: "Clean and preprocess research datasets", status: "done", priority: "high", assigneeId: "m2", dueDate: "Feb 10, 2025", createdAt: "Jan 16, 2025" },
    { id: "t3", projectId: "p1", title: "Implement NLP search feature", description: "Build semantic search using BERT embeddings", status: "in-progress", priority: "high", assigneeId: "m4", dueDate: "Feb 20, 2025", createdAt: "Jan 20, 2025" },
    { id: "t4", projectId: "p1", title: "Build citation graph visualization", description: "D3.js based interactive citation graph", status: "in-progress", priority: "medium", assigneeId: "m3", dueDate: "Feb 22, 2025", createdAt: "Jan 22, 2025" },
    { id: "t5", projectId: "p1", title: "Write unit tests for API endpoints", description: "Achieve 80%+ test coverage", status: "todo", priority: "medium", assigneeId: "m5", dueDate: "Mar 1, 2025", createdAt: "Jan 25, 2025" },
    { id: "t6", projectId: "p1", title: "Deploy to production server", description: "Set up CI/CD and deploy to cloud", status: "todo", priority: "low", assigneeId: "m1", dueDate: "Mar 10, 2025", createdAt: "Jan 28, 2025" },

    // Project 2 tasks
    { id: "t7", projectId: "p2", title: "Design app wireframes", description: "Low and high-fidelity wireframes in Figma", status: "done", priority: "high", assigneeId: "m3", dueDate: "Feb 1, 2025", createdAt: "Jan 10, 2025" },
    { id: "t8", projectId: "p2", title: "Set up React Native project", description: "Configure Expo + TypeScript + navigation", status: "done", priority: "high", assigneeId: "m2", dueDate: "Feb 5, 2025", createdAt: "Jan 12, 2025" },
    { id: "t9", projectId: "p2", title: "Implement carbon footprint calculator", description: "Core calculation engine for eco tracking", status: "in-progress", priority: "high", assigneeId: "m1", dueDate: "Feb 18, 2025", createdAt: "Jan 18, 2025" },
    { id: "t10", projectId: "p2", title: "Build dashboard analytics", description: "Charts and graphs for eco stats", status: "todo", priority: "medium", assigneeId: "m4", dueDate: "Feb 25, 2025", createdAt: "Jan 22, 2025" },
    { id: "t11", projectId: "p2", title: "Integrate Google Maps API", description: "Show eco-friendly routes and locations", status: "todo", priority: "medium", assigneeId: "m2", dueDate: "Mar 5, 2025", createdAt: "Jan 26, 2025" },

    // Project 3 tasks
    { id: "t12", projectId: "p3", title: "Database schema design", description: "Design event and venue database schema", status: "done", priority: "high", assigneeId: "m1", dueDate: "Jan 28, 2025", createdAt: "Jan 10, 2025" },
    { id: "t13", projectId: "p3", title: "Build event listing page", description: "Browse and filter campus events", status: "done", priority: "high", assigneeId: "m2", dueDate: "Feb 3, 2025", createdAt: "Jan 14, 2025" },
    { id: "t14", projectId: "p3", title: "Implement QR ticket system", description: "Generate and scan QR codes for event tickets", status: "done", priority: "high", assigneeId: "m4", dueDate: "Feb 10, 2025", createdAt: "Jan 18, 2025" },
    { id: "t15", projectId: "p3", title: "Build admin dashboard", description: "Event management panel for organizers", status: "in-progress", priority: "medium", assigneeId: "m1", dueDate: "Feb 20, 2025", createdAt: "Jan 25, 2025" },
    { id: "t16", projectId: "p3", title: "Add notification system", description: "Push notifications for event reminders", status: "todo", priority: "low", assigneeId: "m5", dueDate: "Mar 1, 2025", createdAt: "Jan 28, 2025" },
];

export const projects: Project[] = [
    {
        id: "p1",
        name: "AI Research Portal",
        description: "A centralized platform for discovering, organizing, and citing academic research papers using NLP-powered search and ML recommendations.",
        techStack: ["Python", "FastAPI", "React", "PostgreSQL", "BERT", "Docker"],
        status: "active",
        teamSize: 5,
        progress: 65,
        members: members,
        tasks: tasks.filter(t => t.projectId === "p1"),
        createdAt: "Jan 10, 2025",
        updatedAt: "Feb 15, 2025",
        ownerId: "m1",
        category: "AI / ML",
    },
    {
        id: "p2",
        name: "EcoTrack Mobile App",
        description: "A sustainability app that helps students track their carbon footprint, discover eco-friendly routes, and build green habits with gamification.",
        techStack: ["React Native", "Expo", "Node.js", "MongoDB", "Google Maps API"],
        status: "active",
        teamSize: 4,
        progress: 42,
        members: members.slice(0, 4),
        tasks: tasks.filter(t => t.projectId === "p2"),
        createdAt: "Jan 10, 2025",
        updatedAt: "Feb 12, 2025",
        ownerId: "m2",
        category: "Mobile",
    },
    {
        id: "p3",
        name: "Campus Event Hub",
        description: "A full-stack web app for discovering, booking, and managing campus events. Features QR ticketing, real-time updates, and an organizer dashboard.",
        techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
        status: "active",
        teamSize: 4,
        progress: 80,
        members: members.slice(0, 4),
        tasks: tasks.filter(t => t.projectId === "p3"),
        createdAt: "Jan 10, 2025",
        updatedAt: "Feb 18, 2025",
        ownerId: "m1",
        category: "Web",
    },
];

export const activityFeed: ActivityEvent[] = [
    { id: "a1", type: "task_completed", message: "completed task", userName: "Priya Patel", userInitials: "PP", projectName: "AI Research Portal", timestamp: "2025-02-18T14:32:00Z", timeAgo: "2 hours ago" },
    { id: "a2", type: "member_joined", message: "joined the project", userName: "Karan Mehta", userInitials: "KM", projectName: "Campus Event Hub", timestamp: "2025-02-18T12:00:00Z", timeAgo: "4 hours ago" },
    { id: "a3", type: "task_assigned", message: "was assigned a new task", userName: "Rohan Verma", userInitials: "RV", projectName: "AI Research Portal", timestamp: "2025-02-18T10:15:00Z", timeAgo: "6 hours ago" },
    { id: "a4", type: "status_updated", message: "updated project status to Active", userName: "Arjun Sharma", userInitials: "AS", projectName: "EcoTrack Mobile App", timestamp: "2025-02-17T17:00:00Z", timeAgo: "Yesterday" },
    { id: "a5", type: "task_completed", message: "completed task", userName: "Sneha Kumar", userInitials: "SK", projectName: "Campus Event Hub", timestamp: "2025-02-17T15:30:00Z", timeAgo: "Yesterday" },
    { id: "a6", type: "project_created", message: "created a new project", userName: "Priya Patel", userInitials: "PP", projectName: "EcoTrack Mobile App", timestamp: "2025-02-16T11:00:00Z", timeAgo: "2 days ago" },
    { id: "a7", type: "comment", message: "commented on a task", userName: "Arjun Sharma", userInitials: "AS", projectName: "AI Research Portal", timestamp: "2025-02-15T09:00:00Z", timeAgo: "3 days ago" },
    { id: "a8", type: "task_completed", message: "completed task", userName: "Rohan Verma", userInitials: "RV", projectName: "Campus Event Hub", timestamp: "2025-02-14T16:00:00Z", timeAgo: "4 days ago" },
];
