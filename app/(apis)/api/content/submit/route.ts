import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Content from "@/lib/models/Content";

export const runtime = "nodejs";

const ContentSchema = z.object({
    description: z.string().min(1),
    url: z.string().url().optional(),
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const description = (formData.get("description") as string) || "";
        const url = (formData.get("url") as string) || "";
        const file = formData.get("file") as File | null;

        ContentSchema.parse({ description, url });

        let imagePath = "";
        if (file && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, file.name);
            fs.writeFileSync(filePath, buffer);
            imagePath = `/uploads/${file.name}`;
        }

        await connectDB();

        const newContent = await Content.create({
            description,
            url,
            image: imagePath,
            user: new mongoose.Types.ObjectId(),  // ✅ Fixed here
            status: "pending",
            createdAt: new Date(),
        });

        return NextResponse.json({ success: true, data: newContent });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
    }
};
