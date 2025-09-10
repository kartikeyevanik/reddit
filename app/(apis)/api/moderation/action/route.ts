import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import  Content  from "@/lib/models/Content";

type ActionType = "approve" | "reject" | "escalate";

const statusMap: Record<ActionType, { status: string; description: string }> = {
  approve: { status: "approved", description: "Content has been approved by moderator." },
  reject: { status: "rejected", description: "Content has been rejected by moderator." },
  escalate: { status: "escalated", description: "Content has been escalated for further review." },
};

export async function POST(req: NextRequest) {
  const { contentId, action } = await req.json();

  if (!contentId || !action) {
    return NextResponse.json({ error: "Missing contentId or action" }, { status: 400 });
  }

  if (!["approve", "reject", "escalate"].includes(action)) {
    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  }

  await connectToDatabase();

  await Content.findByIdAndUpdate(contentId, {
    status: statusMap[action as ActionType].status,
    description: statusMap[action as ActionType].description,
    moderatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
};
