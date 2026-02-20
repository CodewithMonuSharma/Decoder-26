import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { ResourceModel } from "@/models/Resource";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        await connectDB();
        const resources = await ResourceModel.find()
            .populate("addedBy", "name")
            .sort({ createdAt: -1 })
            .lean();
        return NextResponse.json(resources);
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const contentType = req.headers.get("content-type") || "";

        await connectDB();

        if (contentType.includes("multipart/form-data")) {
            const formData = await req.formData();
            const type = formData.get("type") as string;
            const title = formData.get("title") as string;
            const file = formData.get("file") as File;

            if (type === "file" && file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const uploadDir = join(process.cwd(), "public", "uploads");

                try {
                    await mkdir(uploadDir, { recursive: true });
                } catch (e) { }

                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
                const filePath = join(uploadDir, fileName);
                await writeFile(filePath, buffer);

                const resource = await ResourceModel.create({
                    title,
                    type,
                    fileUrl: `/uploads/${fileName}`,
                    fileName: file.name,
                    addedBy: session.user.id || session.user._id,
                });

                const populated = await resource.populate("addedBy", "name");
                return NextResponse.json(populated, { status: 201 });
            }
        } else {
            const body = await req.json();
            const resource = await ResourceModel.create({
                title: body.title,
                type: body.type || "link",
                url: body.url,
                content: body.content,
                platform: body.platform || "notion",
                addedBy: session.user.id || session.user._id,
            });

            const populated = await resource.populate("addedBy", "name");
            return NextResponse.json(populated, { status: 201 });
        }

        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    } catch (err) {
        console.error("Resource API Error:", err);
        return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
    }
}
