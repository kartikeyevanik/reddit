import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Content } from '@/lib/models/Content'
import connectDB from '@/lib/db'

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!['MODERATOR', 'ADMIN'].includes(session.user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id } = await params
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
