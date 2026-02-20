import { NextResponse } from "next/server";

const USE_MONGO = !!process.env.MONGODB_URI;

// ── Lazy imports ──────────────────────────────────
async function getMongoHandler() {
    const { connectDB } = await import("@/lib/mongoose");
    const { ProjectModel } = await import("@/models/Project");
    const { TaskModel } = await import("@/models/Task");
    return { connectDB, ProjectModel, TaskModel };
}

import { Project as IProject, Task as ITask } from "@/types";
import { Types } from "mongoose";

// GET /api/projects
export async function GET() {
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, ProjectModel, TaskModel } = await getMongoHandler();
            await connectDB();
            const projects = await ProjectModel.find({}).sort({ createdAt: -1 }).lean<IProject[]>();
            const result = await Promise.all(
                projects.map(async (p) => {
                    const tasks = await TaskModel.find({ projectId: (p as any)._id }).lean<ITask[]>();
                    return {
                        ...p,
                        id: (p as any)._id.toString(),
                        tasks: tasks.map((t) => ({
                            ...t,
                            id: (t as any)._id.toString(),
                            projectId: (t as any).projectId.toString()
                        })),
                    };
                })
            );
            return NextResponse.json(result);
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB Connection Error (GET):", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        return NextResponse.json(localDb.getProjects());
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}

// POST /api/projects
export async function POST(req: Request) {
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { user } = session;

    const body = await req.json();
    let mongoError = null;

    try {
        if (USE_MONGO) {
            const { connectDB, ProjectModel } = await getMongoHandler();
            await connectDB();
            const project = await ProjectModel.create({
                name: body.name,
                description: body.description,
                techStack: body.techStack || [],
                status: body.status || "active",
                teamSize: body.teamSize || 1,
                progress: 0,
                category: body.category || "Web",
                ownerId: user.id || user._id,
                members: body.members || [],
            });
            return NextResponse.json({ ...project.toObject(), id: project._id.toString(), tasks: [] }, { status: 201 });
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB Connection Error (POST):", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        const project = localDb.createProject(body);
        return NextResponse.json(project, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}
