import { Schema, model, models } from "mongoose";
import { Task as ITask } from "@/types";

const TaskSchema = new Schema<ITask>(
    {
        projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        title: { type: String, required: true },
        description: { type: String, default: "" },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        assigneeId: { type: String },
        assigneeName: { type: String },
        assigneeInitials: { type: String },
        dueDate: { type: String },
    },
    { timestamps: true }
);

export const TaskModel = models.Task || model<ITask>("Task", TaskSchema);
