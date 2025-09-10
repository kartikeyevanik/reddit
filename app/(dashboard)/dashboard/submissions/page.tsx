import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Image from "next/image";
import connectDB from "@/lib/db";
import { Content } from "@/lib/models/Content";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

interface Submission {
    _id: string;
    title: string;
    description?: string;
    type: "TEXT" | "IMAGE" | "URL" | "VIDEO";
    textContent?: string;
    imageUrl?: string;
    videoUrl?: string;
    url?: string;
    tags?: string[];
    status: string;
    priority: number;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

async function getSubmissions(page: number, limit = 5): Promise<{
    submissions: Submission[];
    pagination: Pagination;
}> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }

    await connectDB();

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
        Content.find({ submitterId: session.user.id }) // ✅ only current user
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Content.countDocuments({ submitterId: session.user.id }),
    ]);

    return {
        submissions: JSON.parse(JSON.stringify(submissions)),
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit),
            limit,
        },
    };
}

export default async function SubmissionsPage({
    searchParams,
}: {
    searchParams?: { page?: string };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const { submissions, pagination } = await getSubmissions(currentPage);

    return (
        <div className="container max-w-4xl p-8">
            <h1 className="text-3xl font-bold mb-6">My Submissions</h1>

            <div className="grid gap-6">
                {submissions.map((submission) => (
                    <Card key={submission._id}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{submission.title}</span>
                                <Badge variant="outline">{submission.type}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {submission.description && (
                                <p className="text-muted-foreground mb-2">
                                    {submission.description}
                                </p>
                            )}

                            {/* Show content based on type */}
                            {submission.type === "TEXT" && submission.textContent && (
                                <p>{submission.textContent}</p>
                            )}
                            {submission.type === "IMAGE" && submission.imageUrl && (
                                <Image
                                    src={submission.imageUrl}
                                    alt={submission.title}
                                    width={600}
                                    height={400}
                                    className="rounded-md max-h-64 object-cover"
                                />
                            )}
                            {submission.type === "VIDEO" && submission.videoUrl && (
                                <video
                                    src={submission.videoUrl}
                                    controls
                                    className="rounded-md max-h-64"
                                />
                            )}
                            {submission.type === "URL" && submission.url && (
                                <a
                                    href={submission.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {submission.url}
                                </a>
                            )}

                            {/* Tags */}
                            {submission.tags && submission.tags.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {submission.tags.map((tag, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <span>Status: {submission.status}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
                {currentPage > 1 && (
                    <Link
                        href={`/dashboard/submissions?page=${currentPage - 1}`}
                        className="px-4 py-2 border rounded-md hover:bg-muted"
                    >
                        Previous
                    </Link>
                )}
                <span>
                    Page {pagination.page} of {pagination.pages}
                </span>
                {currentPage < pagination.pages && (
                    <Link
                        href={`/dashboard/submissions?page=${currentPage + 1}`}
                        className="px-4 py-2 border rounded-md hover:bg-muted"
                    >
                        Next
                    </Link>
                )}
            </div>
        </div>
    );
}
