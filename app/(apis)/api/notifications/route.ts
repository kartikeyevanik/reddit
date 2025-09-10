import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import connectDB from '@/lib/db';
import { Notification } from '@/lib/models/Notification';

export async function GET(request: NextRequest) {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.role || session.user.role !== 'MODERATOR') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ status: 'PENDING' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('contentId')
        .lean();

    const total = await Notification.countDocuments({ status: 'PENDING' });
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ notifications, page, totalPages, total });
}
