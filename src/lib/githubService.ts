// ─── GitHub Service ────────────────────────────────────────────────────────
// Fetches commits from the GitHub REST API using a personal access token.

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const GITHUB_API = "https://api.github.com";

const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

export interface RawCommit {
    commitId: string;
    author: string;
    authorAvatar: string;
    message: string;
    filesChanged: number;
    additions: number;
    deletions: number;
    timestamp: Date;
    url: string;
}

/**
 * Parses a GitHub repo URL into { owner, repo }.
 * Supports formats: https://github.com/owner/repo and owner/repo
 */
export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
    try {
        const clean = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
        if (clean.startsWith("http")) {
            const u = new URL(clean);
            const parts = u.pathname.replace(/^\//, "").split("/");
            if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
        } else {
            const parts = clean.split("/");
            if (parts.length === 2) return { owner: parts[0], repo: parts[1] };
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch the latest commits for a repository; also fetches per-commit stats.
 */
export async function fetchCommits(
    owner: string,
    repo: string,
    perPage = 20
): Promise<RawCommit[]> {
    // 1. List commits
    const listRes = await fetch(
        `${GITHUB_API}/repos/${owner}/${repo}/commits?per_page=${perPage}`,
        { headers, next: { revalidate: 0 } }
    );

    if (!listRes.ok) {
        const err = await listRes.text();
        throw new Error(`GitHub API error (${listRes.status}): ${err}`);
    }

    const list: any[] = await listRes.json();

    // 2. Fetch detail (stats) for each commit in parallel (limit to 10 to avoid rate-limit)
    const detailed = await Promise.allSettled(
        list.slice(0, 10).map(async (c: any) => {
            let filesChanged = 0;
            let additions = 0;
            let deletions = 0;

            try {
                const detailRes = await fetch(
                    `${GITHUB_API}/repos/${owner}/${repo}/commits/${c.sha}`,
                    { headers, next: { revalidate: 0 } }
                );
                if (detailRes.ok) {
                    const detail = await detailRes.json();
                    filesChanged = detail.files?.length ?? 0;
                    additions = detail.stats?.additions ?? 0;
                    deletions = detail.stats?.deletions ?? 0;
                }
            } catch {
                // stats unavailable — use 0s
            }

            const raw: RawCommit = {
                commitId: c.sha,
                author: c.commit?.author?.name || c.author?.login || "Unknown",
                authorAvatar: c.author?.avatar_url || "",
                message: c.commit?.message?.split("\n")[0] || "No message",
                filesChanged,
                additions,
                deletions,
                timestamp: new Date(c.commit?.author?.date || Date.now()),
                url: c.html_url || "",
            };
            return raw;
        })
    );

    return detailed
        .filter((r) => r.status === "fulfilled")
        .map((r) => (r as PromiseFulfilledResult<RawCommit>).value);
}
