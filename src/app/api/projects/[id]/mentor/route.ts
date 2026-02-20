import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ProjectModel } from "@/models/Project";
import { getSession } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session || session.user.role !== "mentor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        const { status } = await req.json();

        if (!["accepted", "rejected"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        await connectDB();
        const mentorId = session.user.id || session.user._id;

        const project = await ProjectModel.findOneAndUpdate(
            { _id: id, invitedMentorId: mentorId, mentorStatus: "pending" },
            { mentorStatus: status },
            { new: true }
        );

        if (!project) {
            return NextResponse.json({ error: "Project request not found or already processed" }, { status: 404 });
        }

        return NextResponse.json({ message: `Project ${status} successfully`, project });
    } catch (err) {
        console.error("Mentor project response error:", err);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
