// ─── Transcript Service ───────────────────────────────────────────────────────
// Pure, deterministic scoring engine for the AI Verified Contribution Transcript.
// No external API calls. Uses keyword analysis + math to produce scores.

export type SkillScores = {
    backend: number;
    frontend: number;
    database: number;
    ai: number;
};

export type ContributorRole =
    | "Leader"
    | "Core Contributor"
    | "Contributor"
    | "Passive Member";

export interface TranscriptData {
    studentName: string;
    studentEmail: string;
    teamId: string;
    // Scores
    contributionScore: number; // 0–100
    impactScore: number;       // 0–100, avg of commits
    consistencyScore: number;  // 0–100
    taskScore: number;         // 0–100
    // Skill breakdown
    skills: SkillScores;
    // Role
    role: ContributorRole;
    roleDescription: string;
    // AI summary
    aiSummary: string;
    // Leaderboard data
    leaderboard: LeaderboardEntry[];
    // Consistency timeline (last 14 days)
    consistencyTimeline: { date: string; score: number }[];
    // Stats
    totalCommits: number;
    totalTasks: number;
    doneTasks: number;
    highImpactCommits: number;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    initials: string;
    role: string;
    contributionScore: number;
    commits: number;
    color: string;
}

// ── Keyword Sets ──────────────────────────────────────────────────────────────
const BACKEND_KW = ["api", "server", "route", "auth", "endpoint", "middleware", "controller", "service", "backend", "express", "next", "node", "handler", "request", "response", "jwt", "token", "session"];
const FRONTEND_KW = ["ui", "component", "page", "style", "layout", "button", "form", "design", "view", "modal", "card", "header", "footer", "sidebar", "navbar", "css", "tailwind", "react", "frontend", "animation", "responsive"];
const DATABASE_KW = ["schema", "migration", "query", "db", "database", "mongo", "model", "index", "collection", "aggregate", "find", "insert", "update", "delete", "sql", "prisma", "mongoose", "redis", "seed"];
const AI_KW = ["ai", "ml", "model", "train", "predict", "neural", "embed", "gemini", "openai", "llm", "gpt", "nlp", "vector", "semantic", "inference", "prompt", "analysis", "score", "impact", "detection"];

function countKeywords(text: string, keywords: string[]): number {
    const lower = text.toLowerCase();
    return keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
}

// ── Skill Detection ───────────────────────────────────────────────────────────
export function detectSkills(commitMessages: string[]): SkillScores {
    if (commitMessages.length === 0) {
        return { backend: 35, frontend: 30, database: 20, ai: 15 };
    }

    const combined = commitMessages.join(" ");
    const b = Math.max(countKeywords(combined, BACKEND_KW), 1);
    const f = Math.max(countKeywords(combined, FRONTEND_KW), 1);
    const d = Math.max(countKeywords(combined, DATABASE_KW), 1);
    const a = Math.max(countKeywords(combined, AI_KW), 1);
    const total = b + f + d + a;

    return {
        backend: Math.round((b / total) * 100),
        frontend: Math.round((f / total) * 100),
        database: Math.round((d / total) * 100),
        ai: Math.round((a / total) * 100),
    };
}

// ── Role Detection ────────────────────────────────────────────────────────────
export function detectRole(
    commitCount: number,
    avgImpact: number,
    doneTasks: number
): { role: ContributorRole; description: string } {
    if (commitCount >= 10 && avgImpact >= 70) {
        return {
            role: "Leader",
            description: "Drives technical direction. High-impact commits and strong task ownership.",
        };
    }
    if (commitCount >= 5 && avgImpact >= 50 && doneTasks >= 3) {
        return {
            role: "Core Contributor",
            description: "Consistently delivers quality work. Reliable technical backbone of the team.",
        };
    }
    if (commitCount >= 2 || doneTasks >= 2) {
        return {
            role: "Contributor",
            description: "Active participant with meaningful contributions to the project.",
        };
    }
    return {
        role: "Passive Member",
        description: "Limited activity recorded. Contribution level needs improvement.",
    };
}

// ── AI Summary ────────────────────────────────────────────────────────────────
export function generateSummary(
    studentName: string,
    role: ContributorRole,
    skills: SkillScores,
    contributionScore: number
): string {
    const topSkill = (Object.entries(skills) as [keyof SkillScores, number][])
        .sort((a, b) => b[1] - a[1])[0][0];

    const skillLabel: Record<string, string> = {
        backend: "backend systems",
        frontend: "frontend development",
        database: "database architecture",
        ai: "AI and machine learning",
    };

    const strength = skillLabel[topSkill] ?? "software development";
    const firstName = studentName.split(" ")[0];

    if (role === "Leader") {
        return `${firstName} demonstrates exceptional technical leadership with a contribution score of ${contributionScore}/100. Specialising in ${strength}, they consistently push high-impact code and take ownership of critical features. A standout engineering contributor ready for industry-scale responsibilities.`;
    }
    if (role === "Core Contributor") {
        return `${firstName} is a reliable core contributor with a contribution score of ${contributionScore}/100, showing strong proficiency in ${strength}. Their consistent delivery and quality commits make them a valued member of the engineering team.`;
    }
    if (role === "Contributor") {
        return `${firstName} actively participates in project development with a contribution score of ${contributionScore}/100. With a focus on ${strength}, they show growing technical capabilities and increasing project engagement.`;
    }
    return `${firstName} has a contribution score of ${contributionScore}/100. Increased engagement in ${strength} is recommended to build a stronger technical profile.`;
}

// ── Contribution Score ────────────────────────────────────────────────────────
export function calcContributionScore(
    avgImpact: number,
    doneTasks: number,
    totalTasks: number,
    consistencyScore: number
): number {
    const taskRatio = totalTasks > 0 ? doneTasks / totalTasks : 0;
    const score = avgImpact * 0.5 + taskRatio * 100 * 0.3 + consistencyScore * 0.2;
    return Math.min(100, Math.round(score));
}

// ── Demo Data (fallback for presentation) ────────────────────────────────────
export function getDemoTranscript(): TranscriptData {
    const skills: SkillScores = { backend: 38, frontend: 28, database: 22, ai: 12 };
    const role = detectRole(14, 76, 8);
    const contributionScore = 84;

    return {
        studentName: "Arjun Sharma",
        studentEmail: "arjun@college.edu",
        teamId: "demo",
        contributionScore,
        impactScore: 76,
        consistencyScore: 82,
        taskScore: 88,
        skills,
        role: role.role,
        roleDescription: role.description,
        aiSummary: generateSummary("Arjun Sharma", role.role, skills, contributionScore),
        totalCommits: 14,
        totalTasks: 12,
        doneTasks: 10,
        highImpactCommits: 6,
        consistencyTimeline: [
            { date: "Feb 07", score: 70 },
            { date: "Feb 08", score: 55 },
            { date: "Feb 09", score: 80 },
            { date: "Feb 10", score: 90 },
            { date: "Feb 11", score: 65 },
            { date: "Feb 12", score: 85 },
            { date: "Feb 13", score: 75 },
            { date: "Feb 14", score: 95 },
            { date: "Feb 15", score: 78 },
            { date: "Feb 16", score: 88 },
            { date: "Feb 17", score: 60 },
            { date: "Feb 18", score: 82 },
            { date: "Feb 19", score: 91 },
            { date: "Feb 20", score: 84 },
        ],
        leaderboard: [
            { rank: 1, name: "Arjun Sharma", initials: "AS", role: "Leader", contributionScore: 84, commits: 14, color: "#6366f1" },
            { rank: 2, name: "Priya Nair", initials: "PN", role: "Core Contributor", contributionScore: 76, commits: 11, color: "#14b8a6" },
            { rank: 3, name: "Rohit Gupta", initials: "RG", role: "Core Contributor", contributionScore: 71, commits: 9, color: "#f59e0b" },
            { rank: 4, name: "Sneha Patel", initials: "SP", role: "Contributor", contributionScore: 58, commits: 6, color: "#ec4899" },
            { rank: 5, name: "Dev Kapoor", initials: "DK", role: "Contributor", contributionScore: 43, commits: 3, color: "#8b5cf6" },
        ],
    };
}
