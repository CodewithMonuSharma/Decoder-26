import { Schema, model, models } from "mongoose";
import { Project as IProject } from "@/types";

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        techStack: [{ type: String }],
        status: {
            type: String,
            enum: ["active", "completed", "paused", "planning"],
            default: "active",
        },
        teamSize: { type: Number, default: 1 },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        category: { type: String, default: "Web" },
        ownerId: { type: String, required: true },
        leaderId: { type: String },
        members: [
            {
                userId: { type: String },
                name: String,
                email: String,
                role: String,
                initials: String,
                tasksAssigned: { type: Number, default: 0 },
                joinedDate: String,
                status: { type: String, default: "active" },
            },
        ],
    },
    { timestamps: true }
);

export const ProjectModel =
    models.Project || model<IProject>("Project", ProjectSchema);
