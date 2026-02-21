import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { GitHubRepoModel } from "@/models/GitHubRepo";

// GET /api/github/repo?teamId=xxx — get connected repo for a team
export async function GET(req: NextRequest) {
    try {
        const teamId = req.nextUrl.searchParams.get("teamId");
        if (!teamId) {
            return NextResponse.json({ error: "teamId is required" }, { status: 400 });
        }

        await connectDB();
        const repo = await GitHubRepoModel.findOne({ teamId });
        if (!repo) {
            return NextResponse.json({ repo: null });
        }

        return NextResponse.json({ repo });
    } catch (err: any) {
        console.error("[github/repo]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
