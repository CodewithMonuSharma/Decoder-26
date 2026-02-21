// ─── AI Impact Analysis Service ────────────────────────────────────────────
// Production-ready deterministic scoring engine.
// Swap the `analyzeCommit` function body with a real LLM call (e.g. Gemini/OpenAI)
// when ready — the rest of the system stays identical.

import type { RawCommit } from "./githubService";
import type { ImpactLevel } from "@/models/Commit";

export interface ImpactResult {
    impactScore: number;
    impactLevel: ImpactLevel;
    impactInsight: string;
}

// Keywords that boost impact score
const HIGH_KEYWORDS = [
    "auth", "authentication", "security", "payment", "database", "db",
    "migration", "core", "critical", "api", "refactor", "feat", "feature",
    "breaking", "performance", "perf", "release", "deploy",
];
const MEDIUM_KEYWORDS = [
    "fix", "bug", "patch", "update", "improve", "optimize", "add", "implement",
    "integrate", "connect", "sync", "fetch", "load",
];

const INSIGHTS_HIGH = [
    "High-impact commit touching core system functionality. Significant code changes detected.",
    "Critical commit — major feature addition with substantial lines changed.",
    "High-impact: Auth or API-level change detected. System-wide effects possible.",
    "Large-scope commit. Several files modified with notable additions — high engineering effort.",
    "High-impact release-quality commit with broad codebase coverage.",
];
const INSIGHTS_MEDIUM = [
    "Medium-impact commit. Addresses a bug or feature enhancement with moderate code changes.",
    "Solid improvement commit. Moderate scope changes across multiple files.",
    "Feature update or fix with measurable code impact. Good iterative progress.",
    "Medium-scope refactor or integration. Steady contribution toward project goals.",
];
const INSIGHTS_LOW = [
    "Low-impact commit. Minor edits, documentation, or config changes.",
    "Small fix or cleanup. Low code churn — routine maintenance commit.",
    "Configuration or style update. Minimal functional impact.",
    "Minor patch with limited lines changed. Routine commit.",
];

function pickInsight(pool: string[], seed: string): string {
    // Deterministic pick using sha prefix so same commit always gets same insight
    const n = parseInt(seed.slice(0, 4), 16) % pool.length;
    return pool[n];
}

/**
 * Analyzes a raw GitHub commit and returns an impact score (0-100),
 * level (Low / Medium / High), and an AI-style insight string.
 */
export function analyzeCommit(commit: RawCommit): ImpactResult {
    const msg = commit.message.toLowerCase();
    const churn = commit.additions + commit.deletions;

    // ── Score components ──────────────────────────────────────────────────
    // 1. Code churn (max 40 pts)
    let churnScore = Math.min(40, Math.round((churn / 500) * 40));

    // 2. Files changed (max 20 pts)
    let filesScore = Math.min(20, commit.filesChanged * 4);

    // 3. Message keyword bonuses (max 30 pts)
    let keywordScore = 0;
    for (const kw of HIGH_KEYWORDS) {
        if (msg.includes(kw)) {
            keywordScore = Math.min(keywordScore + 10, 30);
        }
    }
    for (const kw of MEDIUM_KEYWORDS) {
        if (msg.includes(kw)) {
            keywordScore = Math.min(keywordScore + 5, 30);
        }
    }

    // 4. Small base score (ensures even tiny commits get a non-zero score)
    const baseScore = 5;

    const rawScore = baseScore + churnScore + filesScore + keywordScore;
    const impactScore = Math.min(100, Math.max(1, rawScore));

    // ── Level + Insight ────────────────────────────────────────────────────
    let impactLevel: ImpactLevel;
    let impactInsight: string;

    if (impactScore >= 65) {
        impactLevel = "High";
        impactInsight = pickInsight(INSIGHTS_HIGH, commit.commitId);
    } else if (impactScore >= 35) {
        impactLevel = "Medium";
        impactInsight = pickInsight(INSIGHTS_MEDIUM, commit.commitId);
    } else {
        impactLevel = "Low";
        impactInsight = pickInsight(INSIGHTS_LOW, commit.commitId);
    }

    return { impactScore, impactLevel, impactInsight };
}
