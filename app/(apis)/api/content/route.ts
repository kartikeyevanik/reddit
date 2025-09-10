// app/api/content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Content } from '@/lib/models/Content'
import connectDB from '@/lib/db'

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['MODERATOR', 'ADMIN'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status')

    const query: { status?: string } = {}
    if (status && status !== 'ALL') query.status = status

    const total = await Content.countDocuments(query)
    const items = await Content.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()

    return NextResponse.json({
        items,
        total,
        page,
        pages: Math.ceil(total / limit),
    })
}
