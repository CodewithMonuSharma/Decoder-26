import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { GitHubRepoModel } from "@/models/GitHubRepo";
import { CommitModel } from "@/models/Commit";
import { fetchCommits } from "@/lib/githubService";
import { analyzeCommit } from "@/lib/aiImpactService";

// GET /api/github/commits?teamId=xxx — return stored commits (or seed dummy data)
export async function GET(req: NextRequest) {
    try {
        const teamId = req.nextUrl.searchParams.get("teamId") || "demo";

        await connectDB();

        const commits = await CommitModel.find({ teamId })
            .sort({ timestamp: -1 })
            .limit(30)
            .lean();

        return NextResponse.json({ commits });
    } catch (err: any) {
        console.error("[github/commits GET]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/github/commits?teamId=xxx — sync commits from GitHub, analyze, store
export async function POST(req: NextRequest) {
    try {
        const teamId = req.nextUrl.searchParams.get("teamId") || "demo";

        await connectDB();

        // Find connected repo
        const repoDoc = await GitHubRepoModel.findOne({ teamId });
        if (!repoDoc) {
            return NextResponse.json({ error: "No repository connected for this team." }, { status: 404 });
        }

        // Fetch raw commits from GitHub
        const rawCommits = await fetchCommits(repoDoc.repoOwner, repoDoc.repoName, 20);

        // Analyze each and upsert into DB
        const results = await Promise.all(
            rawCommits.map(async (raw) => {
                const impact = analyzeCommit(raw);
                const doc = await CommitModel.findOneAndUpdate(
                    { commitId: raw.commitId, teamId },
                    {
                        ...raw,
                        teamId,
                        ...impact,
                    },
                    { upsert: true, new: true }
                );
                return doc;
            })
        );

        // Update lastSyncedAt
        await GitHubRepoModel.findOneAndUpdate(
            { teamId },
            { lastSyncedAt: new Date() }
        );

        return NextResponse.json({ synced: results.length, commits: results });
    } catch (err: any) {
        console.error("[github/commits POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
