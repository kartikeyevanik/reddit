// app/api/moderation/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Content } from '@/lib/models/Content'
import connectDB from '@/lib/db'

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params  // ⬅️ await since it's a Promise
    const { status } = await req.json()

    await connectDB()

    const updated = await Content.findByIdAndUpdate(
        id,
        {
            status,
            updatedAt: new Date(),
            ...(status === 'APPROVED' && { publishedAt: new Date() }),
        },
        { new: true }
    )

    if (!updated) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
}
