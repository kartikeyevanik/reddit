import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/User";

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if ((session.user.role !== "ADMIN") && (session.user.role !== "MODERATOR")) {
        return NextResponse.json(
            { error: "Only admins and moderators can update roles" },
            { status: 403 }
        );
    }

    const { role } = await req.json();

    if (!["SUBMITTER", "REVIEWER", "MODERATOR", "ADMIN"].includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
    ).lean();

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
}
