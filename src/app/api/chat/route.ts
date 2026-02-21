import { NextRequest, NextResponse } from "next/server";

// ─── Demo seed data (used when a team has no messages yet) ────────────────────
function getDemoMessages(teamId: string) {
    const now = Date.now();
    const m = (name: string, initials: string, text: string, minutesAgo: number) => ({
        teamId,
        senderId: `demo-${initials.toLowerCase()}`,
        senderName: name,
        senderInitials: initials,
        text,
        timestamp: new Date(now - minutesAgo * 60 * 1000),
    });

    return [
        m("Priya Nair", "PN", "Hey team! Just pushed the new auth middleware 🚀", 62),
        m("Rohit Gupta", "RG", "Nice! I'll review it after standup.", 60),
        m("Arjun Sharma", "AS", "The database schema changes are also done. Should we merge both PRs together?", 55),
        m("Priya Nair", "PN", "Let's wait for CI to pass first. Rohit, can you trigger the workflow?", 50),
        m("Rohit Gupta", "RG", "Already on it 👍 Builds green now!", 45),
        m("Sneha Patel", "SP", "I finished the frontend components for the dashboard. Screenshots in the docs.", 40),
        m("Arjun Sharma", "AS", "Looks great Sneha! The design matches the mockups perfectly.", 35),
        m("Priya Nair", "PN", "Team, standup in 5 mins — Zoom link in the calendar invite.", 20),
        m("Rohit Gupta", "RG", "On my way!", 18),
        m("Dev Kapoor", "DK", "Sorry joining late — dealing with a merge conflict 😅", 15),
        m("Arjun Sharma", "AS", "No worries Dev, we'll catch you up. Let's talk about the release plan today.", 10),
        m("Sneha Patel", "SP", "Should we do a demo tomorrow for the client?", 5),
        m("Priya Nair", "PN", "Yes! Let's aim for 11 AM. I'll send the invite.", 2),
    ];
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") || "demo";

    try {
        const { connectDB } = await import("@/lib/mongoose");
        const { ChatMessageModel } = await import("@/models/ChatMessage");

        await connectDB();

        let messages = await ChatMessageModel
            .find({ teamId })
            .sort({ timestamp: 1 })
            .lean();

        // Seed demo data if this team has no messages
        if (messages.length === 0) {
            const seed = getDemoMessages(teamId);
            await ChatMessageModel.insertMany(seed);
            messages = await ChatMessageModel
                .find({ teamId })
                .sort({ timestamp: 1 })
                .lean();
        }

        return NextResponse.json(messages);
    } catch {
        // Return demo data if DB unavailable (no persistence)
        return NextResponse.json(
            getDemoMessages(teamId).map((m, i) => ({ ...m, _id: `demo-${i}` }))
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { teamId, senderName, senderInitials, senderId, text } = body;

        if (!teamId || !text?.trim()) {
            return NextResponse.json({ error: "teamId and text are required" }, { status: 400 });
        }

        const { connectDB } = await import("@/lib/mongoose");
        const { ChatMessageModel } = await import("@/models/ChatMessage");

        await connectDB();

        const message = await ChatMessageModel.create({
            teamId,
            senderId: senderId || "current-user",
            senderName: senderName || "You",
            senderInitials: senderInitials || "U",
            text: text.trim(),
            timestamp: new Date(),
        });

        return NextResponse.json(message, { status: 201 });
    } catch {
        // Fallback: return a mock message so the UI still updates
        const body = await req.json().catch(() => ({}));
        return NextResponse.json({
            _id: `local-${Date.now()}`,
            teamId: body.teamId || "demo",
            senderId: "current-user",
            senderName: body.senderName || "You",
            senderInitials: body.senderInitials || "U",
            text: body.text || "",
            timestamp: new Date(),
        }, { status: 201 });
    }
}
