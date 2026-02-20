import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const query = url.searchParams.get("q");

        if (!query || query.length < 2) {
            return NextResponse.json([]);
        }

        await connectDB();

        const users = await UserModel.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } }
            ]
        })
            .select("name email role")
            .limit(10)
            .lean();

        return NextResponse.json(users);
    } catch (err) {
        console.error("User search API error:", err);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
