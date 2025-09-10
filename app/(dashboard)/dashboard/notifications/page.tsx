// import connectDB from '@/lib/db';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/lib/auth-options';
// import { Notification } from '@/lib/models/Notification';
// import { redirect } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';

// interface ModerationPageProps {
//     searchParams?: { page?: string };
// }

// export default async function ModerationNotificationsPage({ searchParams }: ModerationPageProps) {
//     await connectDB();
//     const session = await getServerSession(authOptions);

//     if (!session?.user || session.user.role !== 'MODERATOR') {
//         redirect('/login');
//     }

//     const page = parseInt(searchParams?.page || '1');
//     const limit = 10;
//     const skip = (page - 1) * limit;

//     const notifications = await Notification.find({ status: 'PENDING' })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate('contentId')
//         .lean();

//     const total = await Notification.countDocuments({ status: 'PENDING' });
//     const totalPages = Math.ceil(total / limit);

//     return (
//         <div className="container max-w-5xl py-8">
//             <h1 className="text-3xl font-bold mb-6">Moderation Queue</h1>

//             {notifications.length === 0 && <p>No pending content for moderation.</p>}

//             <div className="space-y-4">
//                 {notifications.map((n: any) => (
//                     <Card key={n._id.toString()}>
//                         <CardHeader>
//                             <CardTitle className="flex justify-between items-center">
//                                 {n.title}
//                                 <Badge variant="outline">{n.type}</Badge>
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <p className="mb-2">{n.message}</p>
//                             <p className="text-xs text-muted-foreground">
//                                 Submitted at {new Date(n.createdAt).toLocaleString()}
//                             </p>
//                             <div className="flex gap-2 mt-4">
//                                 <Button variant="outline">Approve</Button>
//                                 <Button variant="destructive">Reject</Button>
//                                 <Button variant="secondary">Request Changes</Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//                 <div className="flex justify-center gap-2 mt-6">
//                     {Array.from({ length: totalPages }).map((_, i) => (
//                         <a
//                             key={i}
//                             href={`/moderation/notifications?page=${i + 1}`}
//                             className={`px-3 py-1 border rounded ${i + 1 === page ? 'bg-primary text-white' : 'bg-muted'}`}
//                         >
//                             {i + 1}
//                         </a>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

export default function NotificationPage() {
    return (
        <div>
            <h1>Notification page</h1>
        </div>
    )
}