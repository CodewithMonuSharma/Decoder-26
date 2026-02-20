import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function GET() {
    let dbStatus = "Connecting...";
    let mongoConnected = false;
    let mongoError = null;

    if (process.env.MONGODB_URI) {
        try {
            await connectDB();
            const state = mongoose.connection.readyState;

            if (state === 1) {
                dbStatus = "MongoDB Atlas Connected! 🚀";
                mongoConnected = true;
            } else {
                dbStatus = `MongoDB Blocked (State: ${state}). ⚠️ Check your Atlas IP Whitelist.`;
            }
        } catch (err: any) {
            mongoError = err.message || String(err);
            dbStatus = `MongoDB Connection Failed: ${mongoError.slice(0, 50)}... ⚠️`;
        }
    } else {
        dbStatus = "Local Mode Only (MONGODB_URI missing) 📁";
    }

    return NextResponse.json({
        ok: true,
        database: {
            status: dbStatus,
            type: mongoConnected ? "MongoDB Atlas" : "Local JSON Fallback",
            error: mongoError,
        },
        manifest: {
            app: "CollabSpace ✅",
            health: "/api/health",
            projects: "/api/projects"
        }
    });
}
