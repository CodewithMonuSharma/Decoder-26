import { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
    {
        title: { type: String, required: true },
        type: { type: String, enum: ["link", "content", "file"], default: "link" },
        url: { type: String },
        content: { type: String },
        fileUrl: { type: String },
        fileName: { type: String },
        platform: { type: String, default: "notion" },
        addedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

export const ResourceModel = models.Resource || model("Resource", ResourceSchema);
