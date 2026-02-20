import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ProjectModel } from "@/models/Project";
import { TaskModel } from "@/models/Task";
import { UserModel } from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectDB();

        // Clear existing demo data to ensure a fresh state
        await ProjectModel.deleteMany({});
        await TaskModel.deleteMany({});
        await UserModel.deleteMany({});

        // ── Create Users ──────────────────────────────
        const salt = await bcrypt.genSalt(10);
        const hashedUserPassword = await bcrypt.hash("user123", salt);
        const hashedMentorPassword = await bcrypt.hash("mentor123", salt);
        const hashedAdminPassword = await bcrypt.hash("admin123", salt);

        // Mentor
        const mentor = await UserModel.create({
            name: "Dr. Jane Smith",
            email: "mentor@example.com",
            password: hashedMentorPassword,
            role: "mentor",
        });

        // Students linked to Mentor
        const students = await Promise.all([
            UserModel.create({ name: "Alice Johnson", email: "alice@example.com", password: hashedUserPassword, role: "student", mentorId: mentor._id.toString() }),
            UserModel.create({ name: "Bob Wilson", email: "bob@example.com", password: hashedUserPassword, role: "student", mentorId: mentor._id.toString() }),
            UserModel.create({ name: "Charlie Davis", email: "charlie@example.com", password: hashedUserPassword, role: "student", mentorId: mentor._id.toString() }),
            UserModel.create({ name: "Diana Prince", email: "diana@example.com", password: hashedUserPassword, role: "student", mentorId: mentor._id.toString() }),
            UserModel.create({ name: "Ethan Hunt", email: "ethan@example.com", password: hashedUserPassword, role: "student", mentorId: mentor._id.toString() }),
        ]);

        const [s1, s2, s3, s4, s5] = students;

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
            leaderId: s1._id,
            invitedMentorId: mentor._id.toString(),
            mentorStatus: "accepted",
            members: [
                { userId: s1._id, name: s1.name, email: s1.email, role: "Lead", initials: "AJ", tasksAssigned: 3, joinedDate: "2024-01-15", status: "active" },
                { userId: s2._id, name: s2.name, email: s2.email, role: "Developer", initials: "BW", tasksAssigned: 2, joinedDate: "2024-01-20", status: "active" },
                { userId: s3._id, name: s3.name, email: s3.email, role: "Designer", initials: "CD", tasksAssigned: 2, joinedDate: "2024-01-22", status: "active" },
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
            ownerId: s2._id,
            leaderId: s2._id,
            members: [
                { userId: s2._id, name: s2.name, email: s2.email, role: "Lead", initials: "BW", tasksAssigned: 4, joinedDate: "2024-01-10", status: "active" },
                { userId: s4._id, name: s4.name, email: s4.email, role: "Developer", initials: "DP", tasksAssigned: 3, joinedDate: "2024-01-12", status: "active" },
                { userId: s5._id, name: s5.name, email: s5.email, role: "Developer", initials: "EH", tasksAssigned: 2, joinedDate: "2024-01-15", status: "active" },
            ],
        });

        const p3 = await ProjectModel.create({
            name: "Smart Agriculture System",
            description: "IoT-based system for monitoring soil health, moisture levels, and automated irrigation management.",
            techStack: ["React", "C++", "MQTT", "InfluxDB"],
            status: "planning",
            teamSize: 4,
            progress: 15,
            category: "IoT",
            ownerId: s3._id,
            leaderId: s3._id,
            invitedMentorId: mentor._id.toString(),
            mentorStatus: "pending",
            members: [
                { userId: s3._id, name: s3.name, email: s3.email, role: "Lead", initials: "CD", tasksAssigned: 2, joinedDate: "2024-02-01", status: "active" },
                { userId: s1._id, name: s1.name, email: s1.email, role: "Developer", initials: "AJ", tasksAssigned: 1, joinedDate: "2024-02-05", status: "active" },
            ],
        });

        const p4 = await ProjectModel.create({
            name: "Cyber Security Shield",
            description: "Network traffic analysis and threat detection dashboard using real-time packet inspection and heuristics.",
            techStack: ["Go", "React", "Docker", "Elasticsearch"],
            status: "active",
            teamSize: 6,
            progress: 82,
            category: "DevOps",
            ownerId: admin._id,
            leaderId: s4._id,
            members: [
                { userId: s4._id, name: s4.name, email: s4.email, role: "Lead", initials: "DP", tasksAssigned: 5, joinedDate: "2024-01-05", status: "active" },
                { userId: s5._id, name: s5.name, email: s5.email, role: "Developer", initials: "EH", tasksAssigned: 4, joinedDate: "2024-01-05", status: "active" },
                { userId: s1._id, name: s1.name, email: s1.email, role: "Developer", initials: "AJ", tasksAssigned: 3, joinedDate: "2024-01-10", status: "active" },
            ],
        });

        // ── Create Tasks ─────────────────────────────────
        const tasks = [
            // P1: AI Research Portal
            { title: "Develop API for paper uploading", status: "done", priority: "high", assignedTo: s1._id, projectId: p1._id },
            { title: "Configure MongoDB collections", status: "done", priority: "high", assignedTo: s1._id, projectId: p1._id },
            { title: "Implement real-time collaboration with Socket.io", status: "in-progress", priority: "high", assignedTo: s2._id, projectId: p1._id },
            { title: "Design PDF viewer component", status: "in-progress", priority: "medium", assignedTo: s3._id, projectId: p1._id },
            { title: "Write initial unit tests", status: "todo", priority: "low", assignedTo: s1._id, projectId: p1._id },

            // P2: EcoTrack Mobile App
            { title: "Design app icon and splashes", status: "done", priority: "medium", assignedTo: s5._id, projectId: p2._id },
            { title: "Integrate Firebase Authentication", status: "done", priority: "high", assignedTo: s2._id, projectId: p2._id },
            { title: "Build carbon calculator logic", status: "in-progress", priority: "high", assignedTo: s2._id, projectId: p2._id },
            { title: "Map integration for green spots", status: "todo", priority: "medium", assignedTo: s4._id, projectId: p2._id },

            // P3: Smart Agriculture
            { title: "Research sensor hardware", status: "done", priority: "high", assignedTo: s3._id, projectId: p3._id },
            { title: "Draft system architecture", status: "in-progress", priority: "medium", assignedTo: s3._id, projectId: p3._id },
            { title: "Setup MQTT broker", status: "todo", priority: "high", assignedTo: s1._id, projectId: p3._id },

            // P4: Cyber Security Shield
            { title: "Setup Dockerized Go backend", status: "done", priority: "high", assignedTo: s4._id, projectId: p4._id },
            { title: "Implement packet parsing logic", status: "done", priority: "high", assignedTo: s4._id, projectId: p4._id },
            { title: "Real-time traffic d3.js visualization", status: "done", priority: "high", assignedTo: s1._id, projectId: p4._id },
            { title: "Threat alert notification system", status: "in-progress", priority: "medium", assignedTo: s5._id, projectId: p4._id },
            { title: "Vulnerability scan scheduler", status: "todo", priority: "low", assignedTo: s4._id, projectId: p4._id },
        ];

        for (const t of tasks) {
            await TaskModel.create(t);
        }

        return NextResponse.json({
            ok: true,
            message: "Database seeded with rich demo data!",
            stats: { users: 7, projects: 4, tasks: tasks.length }
        });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
