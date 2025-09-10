// app/api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Content } from "@/lib/models/Content";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);

        const skip = (page - 1) * limit;

        const [submissions, total] = await Promise.all([
            Content.find()
                .populate("submitterId", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Content.countDocuments(),
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
