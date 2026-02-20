import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";

export async function GET() {
    try {
        await connectDB();
        // Return only necessary user info for privacy
        const users = await UserModel.find({}, "name email role createdAt").sort({ name: 1 }).lean();
        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
