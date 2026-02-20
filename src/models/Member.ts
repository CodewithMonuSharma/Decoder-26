import { Schema, model, models } from "mongoose";
import { TeamMember as ITeamMember } from "@/types";

const MemberSchema = new Schema<ITeamMember>(
    {
        userId: { type: String },
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: {
            type: String,
            enum: ["Lead", "Developer", "Designer", "Tester", "Manager"],
            default: "Developer",
        },
        initials: { type: String, required: true },
        tasksAssigned: { type: Number, default: 0 },
        joinedDate: { type: String },
        status: {
            type: String,
            enum: ["active", "away", "offline"],
            default: "active",
        },
    },
    { timestamps: true }
);

export const MemberModel =
    models.Member || model<ITeamMember>("Member", MemberSchema);
