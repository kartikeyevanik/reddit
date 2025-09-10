
'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { Content } from '@/lib/models/Content';
import connectDB from '@/lib/db';
import { z } from 'zod';

// Validation schema for content submission
const contentSchema = z.object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(1000).nullable().optional(),
    type: z.enum(['TEXT', 'IMAGE', 'URL', 'VIDEO']),
    textContent: z.string().max(10000).nullable().optional(),
    imageUrl: z.string().url().nullable().optional(),
    videoUrl: z.string().url().nullable().optional(),
    url: z.string().url().nullable().optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
}).refine((data) => {
    if (data.type === 'TEXT') return !!data.textContent;
    if (data.type === 'IMAGE') return !!data.imageUrl;
    if (data.type === 'VIDEO') return !!data.videoUrl;
    if (data.type === 'URL') return !!data.url;
    return true;
}, {
    message: "Content is required for the selected type",
    path: ["textContent", "imageUrl", "videoUrl", "url"]
});

export async function submitContent(prevState: any, formData: FormData) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: 'Unauthorized' };
    }

    try {
        // Extract form data
        const rawData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            type: formData.get('type') as 'TEXT' | 'IMAGE' | 'URL' | 'VIDEO',
            textContent: formData.get('textContent') as string,
            imageUrl: formData.get('imageUrl') as string,
            videoUrl: formData.get('videoUrl') as string,
            url: formData.get('url') as string,
            tags: formData.get('tags') ? JSON.parse(formData.get('tags') as string) : [],
        };


        // Validate input
        const validation = contentSchema.safeParse(rawData);
        if (!validation.success) {
            return {
                error: 'Invalid input by validation',
            };
        }

        const { title, description, type, textContent, imageUrl, videoUrl, url, tags } = validation.data;

        // Validate content type specific fields
        if (type === 'TEXT' && !textContent) {
            return { error: 'Text content is required for TEXT type' };
        }

        if (type === 'IMAGE' && !imageUrl) {
            return { error: 'Image URL is required for IMAGE type' };
        }

        if (type === 'VIDEO' && !videoUrl) {
            return { error: 'Video URL is required for VIDEO type' };
        }

        if (type === 'URL' && !url) {
            return { error: 'URL is required for URL type' };
        }

        // Create new content
        const newContent = new Content({
            title,
            description: description || undefined,
            type,
            textContent: textContent || undefined,
            imageUrl: imageUrl || undefined,
            videoUrl: videoUrl || undefined,
            url: url || undefined,
            tags: tags || [],
            submitterId: session.user.id,
            status: 'PENDING',
            priority: 0,
        });

        // Save to database
        const savedContent = await newContent.save();
        console.log('Content saved successfully:', savedContent);

        // Revalidate the submissions page
        revalidatePath('/submissions');

        return {
            success: 'Content submitted successfully!',
            content: JSON.parse(JSON.stringify(savedContent))
        };

    } catch (error: any) {
        console.error('Content submission error:', error);

        if (error.name === 'ValidationError') {
            console.error('Mongoose validation errors:', error.errors);
            return { error: 'Validation error', details: error.errors };
        }

        if (error.name === 'CastError') {
            console.error('Cast error:', error);
            return { error: 'Invalid data format' };
        }

        return { error: 'Internal server error' };
    }
}