// app/api/moderation/pending/route.ts
import { NextResponse } from 'next/server'
import { Content } from '@/lib/models/Content'
import connectDB from '@/lib/db'

export async function GET(req: Request) {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
        Content.find({ status: 'PENDING' })
            .sort({ priority: -1, createdAt: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Content.countDocuments({ status: 'PENDING' }),
    ])

    return NextResponse.json({
        items,
        total,
        page,
        pages: Math.ceil(total / limit),
    })
}
