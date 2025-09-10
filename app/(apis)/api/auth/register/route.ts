import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create new user
        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: "SUBMITTER",
        });

        return NextResponse.json(
            { message: "User created successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
