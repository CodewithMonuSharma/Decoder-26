import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const skillsParam = searchParams.get("skills") || "";
    const skills = skillsParam ? skillsParam.split(",") : [];

    try {
        await connectDB();

        let filter: any = { role: "student" };

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { bio: { $regex: query, $options: "i" } },
                { tagline: { $regex: query, $options: "i" } },
            ];
        }

        if (skills.length > 0) {
            filter.skills = { $in: skills };
        }

        const users = await UserModel.find(filter, "name email initials tagline bio skills")
            .sort({ name: 1 })
            .limit(20)
            .lean();

        // If no users found and it's a "clean" search, return some mock data for demo
        if (users.length === 0 && !query && skills.length === 0) {
            return NextResponse.json(getMockDiscoverUsers());
        }

        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
    }
}

function getMockDiscoverUsers() {
    return [
        {
            _id: "u1",
            name: "Rahul Mehra",
            initials: "RM",
            tagline: "Full-stack Developer",
            bio: "Passionate about building scalable web apps with React and Node.js.",
            skills: ["React", "Node.js", "MongoDB", "TypeScript"]
        },
        {
            _id: "u2",
            name: "Sanya Roy",
            initials: "SR",
            tagline: "UI/UX & Frontend Enthusiast",
            bio: "Love creating beautiful and accessible user interfaces. Figma to React is my specialty.",
            skills: ["React", "Tailwind CSS", "Figma", "Framer Motion"]
        },
        {
            _id: "u3",
            name: "Vikram Singh",
            initials: "VS",
            tagline: "AI/ML Student",
            bio: "Exploring the world of LLMs and Computer Vision. Looking for a team to build an AI project.",
            skills: ["Python", "PyTorch", "OpenCV", "FastAPI"]
        },
        {
            _id: "u4",
            name: "Ishita Kapoor",
            initials: "IK",
            tagline: "Backend Architect",
            bio: "Focusing on system design and high-performance APIs. Experienced with Go and Postgres.",
            skills: ["Go", "PostgreSQL", "Docker", "Redis"]
        },
        {
            _id: "u5",
            name: "Aryan Gupta",
            initials: "AG",
            tagline: "Java Expert",
            bio: "Specializing in Spring Boot and enterprise applications.",
            skills: ["Java", "Spring Boot", "MySQL", "AWS"]
        }
    ];
}
