'use client'

import { useEffect, useState } from 'react'
import { IContent } from '@/lib/models/Content'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface PaginatedResponse {
    items: IContent[]
    total: number
    page: number
    pages: number
}

export default function ModerationQueuePage() {
    const [contents, setContents] = useState<IContent[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)

    const limit = 5 // items per page

    useEffect(() => {
        setLoading(true)
        fetch(`/api/moderation/pending?page=${page}&limit=${limit}`)
            .then((res) => res.json())
            .then((data: PaginatedResponse) => {
                setContents(data.items)
                setPages(data.pages)
                setLoading(false)
            })
    }, [page])

    async function handleAction(id: string, action: 'APPROVED' | 'REJECTED') {
        setActionLoading(id)
        const res = await fetch(`/api/moderation/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: action }),
        })
        if (res.ok) {
            setContents((prev) => prev.filter((c) => c._id !== id))
        }
        setActionLoading(null)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        )
    }

    if (contents.length === 0) {
        return <p className="text-center text-muted-foreground">No pending content to review.</p>
    }

    return (
        <div className="space-y-4 p-8">
            <h1 className="text-2xl font-bold">Moderation Queue</h1>
            {contents.map((content) => (
                <Card key={content._id}>
                    <CardHeader className="flex justify-between items-center">
                        <CardTitle>{content.title}</CardTitle>
                        <Badge>{content.type}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {content.description && (
                            <p className="text-sm text-muted-foreground">{content.description}</p>
                        )}
                        {content.type === 'TEXT' && content.textContent && (
                            <p className="text-sm bg-muted p-2 rounded">{content.textContent}</p>
                        )}
                        {content.type === 'IMAGE' && content.imageUrl && (
                            <Image src={content.imageUrl} alt={content.title} className="rounded max-h-64" />
                        )}
                        {content.type === 'VIDEO' && content.videoUrl && (
                            <video controls className="rounded max-h-64">
                                <source src={content.videoUrl} />
                            </video>
                        )}
                        {content.type === 'URL' && content.url && (
                            <a
                                href={content.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                {content.url}
                            </a>
                        )}
                        <div className="flex gap-2">
                            <Button
                                variant="default"
                                onClick={() => handleAction(content._id, 'APPROVED')}
                                disabled={actionLoading === content._id}
                            >
                                {actionLoading === content._id ? 'Approving...' : 'Approve'}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleAction(content._id, 'REJECTED')}
                                disabled={actionLoading === content._id}
                            >
                                {actionLoading === content._id ? 'Rejecting...' : 'Reject'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-between items-center pt-4">
                <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {page} of {pages}
                </span>
                <Button
                    variant="outline"
                    disabled={page === pages}
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
