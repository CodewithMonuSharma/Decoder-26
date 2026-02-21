import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { CommitModel } from "@/models/Commit";

// GET /api/github/stats?teamId=xxx — aggregate stats for dashboard card
export async function GET(req: NextRequest) {
    try {
        const teamId = req.nextUrl.searchParams.get("teamId") || "demo";

        await connectDB();

        const commits = await CommitModel.find({ teamId }).sort({ timestamp: -1 }).lean();

        if (commits.length === 0) {
            return NextResponse.json({
                totalCommits: 0,
                totalImpactScore: 0,
                averageImpactScore: 0,
                highImpactCount: 0,
                highestImpactCommit: null,
                recentHighImpact: null,
            });
        }

        const totalCommits = commits.length;
        const totalImpactScore = commits.reduce((sum, c) => sum + c.impactScore, 0);
        const averageImpactScore = Math.round(totalImpactScore / totalCommits);
        const highImpactCommits = commits.filter((c) => c.impactLevel === "High");
        const highImpactCount = highImpactCommits.length;

        const highestImpactCommit = commits.reduce(
            (best, c) => (!best || c.impactScore > best.impactScore ? c : best),
            null as any
        );

        const recentHighImpact = highImpactCommits[0] || null;

        return NextResponse.json({
            totalCommits,
            totalImpactScore,
            averageImpactScore,
            highImpactCount,
            highestImpactCommit,
            recentHighImpact,
        });
    } catch (err: any) {
        console.error("[github/stats]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
