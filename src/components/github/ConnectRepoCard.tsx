"use client";

import { useState } from "react";
import { Github, LinkIcon, CheckCircle2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConnectedRepo {
    repoOwner: string;
    repoName: string;
    repoUrl: string;
    lastSyncedAt?: string;
}

interface ConnectRepoCardProps {
    teamId: string;
    initialRepo?: ConnectedRepo | null;
    onSynced?: () => void;
}

export default function ConnectRepoCard({ teamId, initialRepo, onSynced }: ConnectRepoCardProps) {
    const [repo, setRepo] = useState<ConnectedRepo | null>(initialRepo ?? null);
    const [repoUrl, setRepoUrl] = useState("");
    const [connecting, setConnecting] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");
    const [syncMsg, setSyncMsg] = useState("");

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setConnecting(true);
        setError("");
        try {
            const res = await fetch("/api/github/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ teamId, repoUrl }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to connect");
            setRepo({ repoOwner: data.repoOwner, repoName: data.repoName, repoUrl: data.repoUrl });
            setRepoUrl("");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setConnecting(false);
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setSyncMsg("");
        setError("");
        try {
            const res = await fetch(`/api/github/commits?teamId=${teamId}`, {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Sync failed");
            setSyncMsg(`✓ Synced ${data.synced} commits`);
            onSynced?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">GitHub Repository</h3>
                    <p className="text-xs text-gray-400">Connect your team's repository</p>
                </div>
            </div>

            {repo ? (
                <div className="space-y-4">
                    {/* Connected state */}
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {repo.repoOwner} / {repo.repoName}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate">{repo.repoUrl}</p>
                        </div>
                        <a
                            href={repo.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 shrink-0"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            {syncMsg && <p className="text-xs text-emerald-600 font-semibold">{syncMsg}</p>}
                            {error && (
                                <p className="text-xs text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> {error}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs border-gray-200"
                                onClick={() => setRepo(null)}
                            >
                                Change Repo
                            </Button>
                            <Button
                                size="sm"
                                className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white"
                                onClick={handleSync}
                                disabled={syncing}
                            >
                                {syncing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <RefreshCw className="w-3.5 h-3.5" />
                                )}
                                {syncing ? "Syncing…" : "Sync Commits"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleConnect} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">
                            Repository URL
                        </label>
                        <input
                            required
                            type="text"
                            placeholder="https://github.com/owner/repository"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all placeholder:text-gray-300"
                        />
                        <p className="mt-1 text-[11px] text-gray-400 ml-1">
                            Supports public and private repos (with token configured)
                        </p>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        className="w-full gap-2 bg-gray-900 hover:bg-gray-800 text-white"
                        disabled={connecting}
                    >
                        {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                        {connecting ? "Connecting…" : "Connect Repository"}
                    </Button>
                </form>
            )}
        </div>
    );
}
