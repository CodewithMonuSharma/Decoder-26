import { NextRequest, NextResponse } from "next/server";
import {
    detectSkills,
    detectRole,
    generateSummary,
    calcContributionScore,
    getDemoTranscript,
    LeaderboardEntry,
    TranscriptData,
} from "@/lib/transcriptService";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") || "demo";

    try {
        const { connectDB } = await import("@/lib/mongoose");
        const { CommitModel } = await import("@/models/Commit");
        const { TaskModel } = await import("@/models/Task");
        const { ProjectModel } = await import("@/models/Project");

        await connectDB();

        // ── Fetch commits for team ────────────────────────────────────────────
        const commits = await CommitModel.find({ teamId }).sort({ timestamp: -1 }).lean();

        if (!commits || commits.length === 0) {
            // No real data — return demo transcript
            return NextResponse.json(getDemoTranscript());
        }

        // ── Aggregate commit stats ────────────────────────────────────────────
        const totalCommits = commits.length;
        const impactScores = commits.map((c: any) => c.impactScore ?? 0);
        const avgImpact = Math.round(impactScores.reduce((a: number, b: number) => a + b, 0) / totalCommits);
        const highImpactCommits = commits.filter((c: any) => c.impactLevel === "High").length;
        const commitMessages = commits.map((c: any) => c.message ?? "");

        // ── Consistency Score (variance-based) ────────────────────────────────
        // Group commits by day and produce a 0–100 consistency score
        const dayMap = new Map<string, number>();
        for (const c of commits as any[]) {
            const day = new Date(c.timestamp).toISOString().split("T")[0];
            dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
        }
        const uniqueDays = dayMap.size;
        const maxPossible = 30; // evaluate over last 30 days
        const consistencyScore = Math.min(100, Math.round((uniqueDays / maxPossible) * 100 + 20));

        // ── Consistency Timeline (last 14 days) ───────────────────────────────
        const consistencyTimeline: { date: string; score: number }[] = [];
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const key = d.toISOString().split("T")[0];
            const count = dayMap.get(key) ?? 0;
            const label = d.toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
            consistencyTimeline.push({ date: label, score: Math.min(100, count * 30 + (count > 0 ? 40 : 0)) });
        }

        // ── Tasks ─────────────────────────────────────────────────────────────
        // Get tasks from all projects or via a team-linked project
        let totalTasks = 0;
        let doneTasks = 0;
        try {
            const projects = await ProjectModel.find({}).lean();
            const projectIds = (projects as any[]).map((p) => p._id.toString());
            const tasks = await TaskModel.find({ projectId: { $in: projectIds } }).lean();
            totalTasks = tasks.length;
            doneTasks = (tasks as any[]).filter((t) => t.status === "done").length;
        } catch {
            totalTasks = 10;
            doneTasks = 7;
        }

        // ── Skills, Role, Score ───────────────────────────────────────────────
        const skills = detectSkills(commitMessages);
        const { role, description: roleDescription } = detectRole(totalCommits, avgImpact, doneTasks);
        const taskScore = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const contributionScore = calcContributionScore(avgImpact, doneTasks, totalTasks, consistencyScore);
        const aiSummary = generateSummary("Student", role, skills, contributionScore);

        // ── Leaderboard (based on commit authors) ─────────────────────────────
        const authorMap = new Map<string, { impact: number; count: number }>();
        for (const c of commits as any[]) {
            const key = c.author ?? "Unknown";
            const prev = authorMap.get(key) ?? { impact: 0, count: 0 };
            authorMap.set(key, {
                impact: prev.impact + (c.impactScore ?? 0),
                count: prev.count + 1,
            });
        }

        const leaderColors = ["#6366f1", "#14b8a6", "#f59e0b", "#ec4899", "#8b5cf6"];
        const leaderboard: LeaderboardEntry[] = Array.from(authorMap.entries())
            .map(([name, stats]) => {
                const avg = Math.round(stats.impact / stats.count);
                const r = detectRole(stats.count, avg, Math.floor(doneTasks / Math.max(authorMap.size, 1)));
                const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
                return { name, initials, role: r.role, commits: stats.count, contributionScore: avg };
            })
            .sort((a, b) => b.contributionScore - a.contributionScore)
            .slice(0, 5)
            .map((entry, i) => ({ ...entry, rank: i + 1, color: leaderColors[i] }));

        const transcript: TranscriptData = {
            studentName: "Arjun Sharma",
            studentEmail: "arjun@college.edu",
            teamId,
            contributionScore,
            impactScore: avgImpact,
            consistencyScore,
            taskScore,
            skills,
            role,
            roleDescription,
            aiSummary,
            totalCommits,
            totalTasks,
            doneTasks,
            highImpactCommits,
            consistencyTimeline,
            leaderboard: leaderboard.length > 0 ? leaderboard : getDemoTranscript().leaderboard,
        };

        return NextResponse.json(transcript);
    } catch {
        // If DB fails entirely, return demo data
        return NextResponse.json(getDemoTranscript());
    }
}
