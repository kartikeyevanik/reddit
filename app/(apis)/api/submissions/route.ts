import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/db";
import { Content } from "@/lib/models/Content";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const skip = (page - 1) * limit;

        const [submissions, total] = await Promise.all([
            Content.find({ submitterId: session.user.id }) // ✅ filter by current user
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Content.countDocuments({ submitterId: session.user.id }), // ✅ count only user’s
        ]);

        return NextResponse.json(
            {
                submissions: JSON.parse(JSON.stringify(submissions)),
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                    limit,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
