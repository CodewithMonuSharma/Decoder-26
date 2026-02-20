import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ProjectModel } from "@/models/Project";
import { TaskModel } from "@/models/Task";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

// GET /api/seed — one-time demo data seeder
export async function GET() {
    try {
        await connectDB();

        // Don't reseed if data exists
        const existing = await ProjectModel.countDocuments();
        if (existing > 0) {
            return NextResponse.json({ ok: true, message: "Already seeded", count: existing });
        }

        // ── Create Users (Mentors, Students, Admin) ──────────────────────────────
        const salt = await bcrypt.genSalt(10);
        const hashedManagerPassword = await bcrypt.hash("manager123", salt);
        const hashedUserPassword = await bcrypt.hash("user123", salt);
        const hashedAdminPassword = await bcrypt.hash("admin123", salt);

        // Mentors
        const mentor = await UserModel.create({
            name: "Dr. Jane Smith",
            email: "mentor@example.com",
            password: hashedManagerPassword,
            role: "mentor",
        });

        // Students linked to Mentor
        const student1 = await UserModel.create({
            name: "Alice Johnson",
            email: "alice@example.com",
            password: hashedUserPassword,
            role: "student",
            mentorId: mentor._id.toString(),
        });

        const student2 = await UserModel.create({
            name: "Bob Wilson",
            email: "bob@example.com",
            password: hashedUserPassword,
            role: "student",
            mentorId: mentor._id.toString(),
        });

        const admin = await UserModel.create({
            name: "Admin User",
            email: "admin@example.com",
            password: hashedAdminPassword,
            role: "admin",
        });

        // ── Create Projects ──────────────────────────────
        const p1 = await ProjectModel.create({
            name: "AI Research Portal",
            description: "A comprehensive platform for managing AI research papers and datasets with real-time collaboration features.",
            techStack: ["Next.js", "Python", "PyTorch", "MongoDB"],
            status: "active",
            teamSize: 5,
            progress: 65,
            category: "AI / ML",
            ownerId: admin._id,
            leaderId: student1._id,
            invitedMentorId: mentor._id.toString(),
            mentorStatus: "pending",
            members: [
                {
                    userId: student1._id,
                    name: student1.name,
                    email: student1.email,
                    role: "Lead",
                    initials: "AJ",
                    tasksAssigned: 3,
                    joinedDate: "2024-01-15",
                    status: "active",
                },
                {
                    userId: student2._id,
                    name: student2.name,
                    email: student2.email,
                    role: "Developer",
                    initials: "BW",
                    tasksAssigned: 2,
                    joinedDate: "2024-01-20",
                    status: "active",
                },
            ],
        });

        const p2 = await ProjectModel.create({
            name: "EcoTrack Mobile App",
            description: "Sustainability tracking application allowing users to monitor their carbon footprint and eco-friendly habits.",
            techStack: ["React Native", "Node.js", "MongoDB", "Firebase"],
            status: "active",
            teamSize: 3,
            progress: 42,
            category: "Mobile",
            members: [
                { name: "Karan Singh", email: "karan@demo.com", role: "Lead", initials: "KS", tasksAssigned: 3, joinedDate: "Dec 5", status: "active" },
                { name: "Priya Patel", email: "priya@demo.com", role: "Developer", initials: "PP", tasksAssigned: 4, joinedDate: "Dec 8", status: "active" },
                { name: "Rohan Verma", email: "rohan@demo.com", role: "Designer", initials: "RV", tasksAssigned: 2, joinedDate: "Dec 10", status: "active" },
            ],
        });

        const p3 = await ProjectModel.create({
            name: "Campus Event Hub",
            description: "Centralized platform for discovering, organizing, and managing university events and student activities.",
            techStack: ["Next.js", "PostgreSQL", "Tailwind CSS", "Prisma"],
            status: "active",
            teamSize: 5,
            progress: 80,
            category: "Web",
            members: [
                { name: "Arjun Sharma", email: "arjun@demo.com", role: "Developer", initials: "AS", tasksAssigned: 2, joinedDate: "Nov 20", status: "active" },
                { name: "Sneha Gupta", email: "sneha@demo.com", role: "Lead", initials: "SG", tasksAssigned: 3, joinedDate: "Nov 20", status: "active" },
                { name: "Karan Singh", email: "karan@demo.com", role: "Designer", initials: "KS", tasksAssigned: 1, joinedDate: "Nov 22", status: "away" },
            ],
        });

        // ── Create Tasks ─────────────────────────────────
        const p1Tasks = [
            { title: "Set up ML pipeline", status: "done", priority: "high", assigneeName: "Arjun Sharma", assigneeInitials: "AS" },
            { title: "Build data visualization dashboard", status: "in-progress", priority: "high", assigneeName: "Priya Patel", assigneeInitials: "PP" },
            { title: "Integrate TensorFlow model", status: "in-progress", priority: "medium", assigneeName: "Arjun Sharma", assigneeInitials: "AS" },
            { title: "UI for model results", status: "todo", priority: "medium", assigneeName: "Rohan Verma", assigneeInitials: "RV" },
            { title: "Write API documentation", status: "todo", priority: "low", assigneeName: "Sneha Gupta", assigneeInitials: "SG" },
        ];
        const p2Tasks = [
            { title: "Design onboarding screen", status: "done", priority: "high", assigneeName: "Rohan Verma", assigneeInitials: "RV" },
            { title: "Carbon calculator logic", status: "in-progress", priority: "high", assigneeName: "Karan Singh", assigneeInitials: "KS" },
            { title: "Push notification setup", status: "todo", priority: "medium", assigneeName: "Priya Patel", assigneeInitials: "PP" },
            { title: "Firebase auth integration", status: "done", priority: "high", assigneeName: "Priya Patel", assigneeInitials: "PP" },
        ];
        const p3Tasks = [
            { title: "Event creation form", status: "done", priority: "high", assigneeName: "Sneha Gupta", assigneeInitials: "SG" },
            { title: "RSVP feature", status: "done", priority: "medium", assigneeName: "Arjun Sharma", assigneeInitials: "AS" },
            { title: "Email notification system", status: "in-progress", priority: "high", assigneeName: "Sneha Gupta", assigneeInitials: "SG" },
            { title: "Calendar view", status: "todo", priority: "medium", assigneeName: "Karan Singh", assigneeInitials: "KS" },
        ];

        for (const t of p1Tasks) await TaskModel.create({ ...t, projectId: p1._id });
        for (const t of p2Tasks) await TaskModel.create({ ...t, projectId: p2._id });
        for (const t of p3Tasks) await TaskModel.create({ ...t, projectId: p3._id });

        return NextResponse.json({ ok: true, inserted: 3, message: "Database seeded successfully!" });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
