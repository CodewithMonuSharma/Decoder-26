import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import { UserModel } from "@/models/User";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // 1. Find user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Create session
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
        const session = await encrypt({
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            expires
        });

        // 4. Set cookie
        const cookieStore = await cookies();
        cookieStore.set("session", session, { expires, httpOnly: true });

        return NextResponse.json({
            message: "Logged in successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
