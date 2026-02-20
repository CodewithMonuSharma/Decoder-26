import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password, role } = await req.json();

        // 1. Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        // 2. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
        });

        // 4. Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            expires
        });

        // 5. Save in cookie
        const cookieStore = await cookies();
        cookieStore.set("session", session, { expires, httpOnly: true });

        return NextResponse.json({
            message: "User registered successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        }, { status: 201 });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
