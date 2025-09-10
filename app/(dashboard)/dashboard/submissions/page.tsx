// app/dashboard/submissions/page.tsx
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

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
    submitterId?: {
        name?: string;
        email?: string;
    };
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

async function getSubmissions(page: number): Promise<{
    submissions: Submission[];
    pagination: Pagination;
}> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/submissions?page=${page}&limit=5`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch submissions");
    }

    return res.json();
}

export default async function SubmissionsPage({
    searchParams,
}: {
    searchParams?: { page?: string };
}) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1;
    const { submissions, pagination } = await getSubmissions(currentPage);

    return (
        <div className="container max-w-4xl p-8">
            <h1 className="text-3xl font-bold mb-6">All Submissions</h1>

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
                                <img
                                    src={submission.imageUrl}
                                    alt={submission.title}
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
