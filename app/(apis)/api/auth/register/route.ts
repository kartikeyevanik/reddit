import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log("[REGISTER] Incoming request body:", body);

        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        console.log("[REGISTER] Database connected");

        const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hash(password, 12);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "SUBMITTER",
        });

        console.log("[REGISTER] User created:", user._id);

        try {
            await sendVerificationEmail(email.toLowerCase(), name);
            console.log("[REGISTER] Verification email sent");
        } catch (emailError) {
            console.error("[EMAIL_ERROR]", emailError);
        }

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });

    } catch (error) {
        console.error("[REGISTER_ERROR]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
};
