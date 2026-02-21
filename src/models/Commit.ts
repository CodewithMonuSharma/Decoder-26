import { Schema, model, models } from "mongoose";

export type ImpactLevel = "Low" | "Medium" | "High";

export interface ICommit {
    commitId: string;
    teamId: string;
    author: string;
    authorAvatar?: string;
    message: string;
    filesChanged: number;
    additions: number;
    deletions: number;
    timestamp: Date;
    url: string;
    impactScore: number;
    impactLevel: ImpactLevel;
    impactInsight: string;
}

const CommitSchema = new Schema<ICommit>(
    {
        commitId: { type: String, required: true },
        teamId: { type: String, required: true },
        author: { type: String, required: true },
        authorAvatar: { type: String, default: "" },
        message: { type: String, required: true },
        filesChanged: { type: Number, default: 0 },
        additions: { type: Number, default: 0 },
        deletions: { type: Number, default: 0 },
        timestamp: { type: Date, required: true },
        url: { type: String, default: "" },
        impactScore: { type: Number, default: 0, min: 0, max: 100 },
        impactLevel: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },
        impactInsight: { type: String, default: "" },
    },
    { timestamps: true }
);

// Compound unique index to prevent duplicate commits per team
CommitSchema.index({ commitId: 1, teamId: 1 }, { unique: true });

export const CommitModel =
    models.Commit || model<ICommit>("Commit", CommitSchema);
