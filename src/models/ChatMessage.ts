import { Schema, model, models } from "mongoose";

export interface IChatMessage {
    teamId: string;
    senderId: string;
    senderName: string;
    senderInitials: string;
    text: string;
    timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
    {
        teamId: { type: String, required: true, index: true },
        senderId: { type: String, required: true },
        senderName: { type: String, required: true },
        senderInitials: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: false }
);

export const ChatMessageModel =
    models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);
