import { Schema, model, models } from "mongoose";

export interface IGitHubRepo {
    teamId: string;
    repoUrl: string;
    repoOwner: string;
    repoName: string;
    connectedAt: Date;
    lastSyncedAt?: Date;
}

const GitHubRepoSchema = new Schema<IGitHubRepo>(
    {
        teamId: { type: String, required: true, unique: true },
        repoUrl: { type: String, required: true },
        repoOwner: { type: String, required: true },
        repoName: { type: String, required: true },
        connectedAt: { type: Date, default: Date.now },
        lastSyncedAt: { type: Date },
    },
    { timestamps: true }
);

export const GitHubRepoModel =
    models.GitHubRepo || model<IGitHubRepo>("GitHubRepo", GitHubRepoSchema);
