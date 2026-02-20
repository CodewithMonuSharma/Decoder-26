import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
}

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }

    if (!cachedPromise) {
        cachedPromise = mongoose.connect(MONGODB_URI).then((m) => m);
    }

    try {
        await cachedPromise;
        return mongoose;
    } catch (error) {
        cachedPromise = null;
        throw error;
    }
}
