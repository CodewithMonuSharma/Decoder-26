import { NextRequest, NextResponse } from "next/server";

const USE_MONGO = !!process.env.MONGODB_URI;

async function getMongoHandler() {
    const { connectDB } = await import("@/lib/mongoose");
    const { ProjectModel } = await import("@/models/Project");
    const { TaskModel } = await import("@/models/Task");
    return { connectDB, ProjectModel, TaskModel };
}

import { Project as IProject, Task as ITask } from "@/types";

// GET /api/projects/:id
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, ProjectModel, TaskModel } = await getMongoHandler();
            await connectDB();
            const project = await ProjectModel.findById(id).lean<IProject>();
            if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
            const tasks = await TaskModel.find({ projectId: id }).lean<ITask[]>();
            return NextResponse.json({
                ...project,
                id: (project as any)._id.toString(),
                tasks: tasks.map((t) => ({
                    ...t,
                    id: (t as any)._id.toString(),
                    projectId: (t as any).projectId.toString()
                })),
            });
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB GET project error:", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        const project = localDb.getProject(id);
        if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(project);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}

// PATCH /api/projects/:id
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const body = await req.json();
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, ProjectModel } = await getMongoHandler();
            await connectDB();
            const updated = await ProjectModel.findByIdAndUpdate(id, body, { new: true }).lean();
            if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
            const updatedData = updated as any;
            return NextResponse.json({ ...updatedData, id: updatedData._id.toString() });
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB PATCH project error:", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        const updated = localDb.updateProject(id, body);
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}

// DELETE /api/projects/:id
export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, ProjectModel, TaskModel } = await getMongoHandler();
            await connectDB();
            await ProjectModel.findByIdAndDelete(id);
            await TaskModel.deleteMany({ projectId: id });
            return NextResponse.json({ ok: true });
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB DELETE project error:", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        localDb.deleteProject(id);
        return NextResponse.json({ ok: true });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}
