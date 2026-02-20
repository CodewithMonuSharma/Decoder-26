import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { ProjectModel } from "@/models/Project";
import { TaskModel } from "@/models/Task";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "mentor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const mentorId = session.user.id || session.user._id;

        // 1. Get students assigned to this mentor
        const students = await UserModel.find({ mentorId }, "name email role createdAt").lean();

        // 2. Enhance with progress data
        const enhancedStudents = await Promise.all(students.map(async (student: any) => {
            const userId = student._id.toString();

            // Get projects where this student is a member
            const projects = await ProjectModel.find({ "members.userId": userId }).lean();

            // Get tasks assigned to this student
            const tasks = await TaskModel.find({ assignedTo: userId }).lean();

            const completedTasks = tasks.filter((t: any) => t.status === "completed").length;
            const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

            return {
                ...student,
                projectsCount: projects.length,
                tasksCount: tasks.length,
                completedTasks,
                progress: Math.round(progress),
                impactScore: 70 + Math.floor(Math.random() * 20), // Placeholder for real impact score logic
            };
        }));

        return NextResponse.json(enhancedStudents);
    } catch (err) {
        console.error("Mentor students API error:", err);
        return NextResponse.json({ error: "Failed to fetch student progress" }, { status: 500 });
    }
}
