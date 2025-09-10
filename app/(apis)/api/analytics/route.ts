import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Content } from "@/lib/models/Content";

export async function GET() {
    await connectDB();

    const total = await Content.countDocuments();
    const pending = await Content.countDocuments({ status: "PENDING" });
    const approved = await Content.countDocuments({ status: "APPROVED" });
    const rejected = await Content.countDocuments({ status: "REJECTED" });

    const perUserAgg = await Content.aggregate([
        { $group: { _id: "$submitterId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    const topTagsAgg = await Content.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
    ]);

    const perUser = perUserAgg.map((u) => ({
        user: u._id.toString(),
        count: u.count,
    }));

    const topTags = topTagsAgg.map((t) => ({
        tag: t._id,
        count: t.count,
    }));

    return NextResponse.json({
        total,
        pending,
        approved,
        rejected,
        perUser,
        topTags,
    });
}
