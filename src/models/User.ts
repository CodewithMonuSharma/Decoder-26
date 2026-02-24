import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["student", "mentor", "admin"],
            default: "student",
        },
        initials: { type: String },
        tagline: { type: String },
        bio: { type: String },
        skills: { type: [String], default: [] },
        mentorId: { type: String },
    },
    { timestamps: true }
);

export const UserModel = models.User || model("User", UserSchema);
