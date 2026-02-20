import { NextRequest, NextResponse } from "next/server";

const USE_MONGO = !!process.env.MONGODB_URI;

async function getMongoHandler() {
    const { connectDB } = await import("@/lib/mongoose");
    const { TaskModel } = await import("@/models/Task");
    return { connectDB, TaskModel };
}

// GET /api/projects/:id/tasks
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, TaskModel } = await getMongoHandler();
            await connectDB();
            const tasks = await TaskModel.find({ projectId: id }).sort({ createdAt: -1 }).lean();
            return NextResponse.json(
                tasks.map((t: any) => ({
                    ...t,
                    id: (t as any)._id.toString(),
                    projectId: (t as any).projectId.toString()
                }))
            );
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB GET tasks error:", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        return NextResponse.json(localDb.getTasks(id));
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = session.user.id || session.user._id;

    const body = await req.json();
    let mongoError = null;
    try {
        if (USE_MONGO) {
            const { connectDB, TaskModel } = await getMongoHandler();
            const { ProjectModel } = await import("@/models/Project");
            await connectDB();

            // Permission Check: User must be Admin or Lead of this project
            const project = await ProjectModel.findById(id).lean();
            if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

            const isAllowed = project.members?.some((m: any) =>
                (m.userId === userId || m._id?.toString() === userId) &&
                (m.role === "Admin" || m.userId === project.leaderId)
            );

            if (!isAllowed && project.ownerId !== userId) {
                return NextResponse.json({ error: "Only Admins/Leaders can assign tasks" }, { status: 403 });
            }

            const task = await TaskModel.create({
                projectId: id,
                title: body.title,
                description: body.description || "",
                status: body.status || "todo",
                priority: body.priority || "medium",
                assigneeName: body.assigneeName || "",
                assigneeInitials: body.assigneeInitials || "",
                dueDate: body.dueDate || "",
            });
            return NextResponse.json(
                { ...task.toObject(), id: task._id.toString(), projectId: id },
                { status: 201 }
            );
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("MongoDB POST task error:", errorMessage);
        mongoError = errorMessage;
    }

    // ── Local fallback ──────────────────────────────
    try {
        const { localDb } = await import("@/lib/localDb");
        const task = localDb.createTask(id, body);
        if (!task) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json(task, { status: 201 });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: mongoError || errorMessage }, { status: 500 });
    }
}
