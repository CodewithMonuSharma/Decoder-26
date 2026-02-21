import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { GitHubRepoModel } from "@/models/GitHubRepo";
import { parseRepoUrl } from "@/lib/githubService";

// POST /api/github/connect — save or update connected repo for a team
export async function POST(req: NextRequest) {
    try {
        const { teamId, repoUrl } = await req.json();

        if (!teamId || !repoUrl) {
            return NextResponse.json({ error: "teamId and repoUrl are required" }, { status: 400 });
        }

        const parsed = parseRepoUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json(
                { error: "Invalid GitHub repository URL. Use format: https://github.com/owner/repo" },
                { status: 400 }
            );
        }

        await connectDB();

        const repo = await GitHubRepoModel.findOneAndUpdate(
            { teamId },
            {
                teamId,
                repoUrl: repoUrl.trim(),
                repoOwner: parsed.owner,
                repoName: parsed.repo,
                connectedAt: new Date(),
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(repo);
    } catch (err: any) {
        console.error("[github/connect]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
