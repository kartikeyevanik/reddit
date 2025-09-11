import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { AuditLog } from "@/lib/models/AuditLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can view logs (change to allow moderators too if you want)
    if (session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
        AuditLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        AuditLog.countDocuments(),
    ]);

    return NextResponse.json({
        logs,
        total,
        page,
        pages: Math.ceil(total / limit),
    });
}
