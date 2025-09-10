// app/api/content/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { Content } from '@/lib/models/Content';
import connectDB from '@/lib/db';
import { z } from 'zod';

// Validation schema for content submission
const contentSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(1000).optional().or(z.literal('')),
    type: z.enum(['TEXT', 'IMAGE', 'URL', 'VIDEO']),
    textContent: z.string().max(10000).optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
    videoUrl: z.string().url().optional().or(z.literal('')),
    url: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string().max(50)).max(10).optional(),
}).refine((data) => {
    // Validate content type specific fields
    if (data.type === 'TEXT') return !!data.textContent;
    if (data.type === 'IMAGE') return !!data.imageUrl;
    if (data.type === 'VIDEO') return !!data.videoUrl;
    if (data.type === 'URL') return !!data.url;
    return true;
}, {
    message: "Content is required for the selected type",
    path: ["textContent", "imageUrl", "videoUrl", "url"]
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        // Validate input
        const validation = contentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error },
                { status: 400 }
            );
        }

        const { title, description, type, textContent, imageUrl, videoUrl, url, tags } = validation.data;

        // Validate content type specific fields
        if (type === 'TEXT' && !textContent) {
            return NextResponse.json(
                { error: 'Text content is required for TEXT type' },
                { status: 400 }
            );
        }

        if (type === 'IMAGE' && !imageUrl) {
            return NextResponse.json(
                { error: 'Image URL is required for IMAGE type' },
                { status: 400 }
            );
        }

        if (type === 'VIDEO' && !videoUrl) {
            return NextResponse.json(
                { error: 'Video URL is required for VIDEO type' },
                { status: 400 }
            );
        }

        if (type === 'URL' && !url) {
            return NextResponse.json(
                { error: 'URL is required for URL type' },
                { status: 400 }
            );
        }

        // Create new content
        const newContent = await Content.create({
            title,
            description,
            type,
            textContent,
            imageUrl,
            videoUrl,
            url,
            tags: tags || [],
            submitterId: session.user.id,
            status: 'PENDING',
            priority: 0,
        });
        console.log(newContent)
        return NextResponse.json(
            {
                message: 'Content submitted successfully',
                content: newContent
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Content submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}