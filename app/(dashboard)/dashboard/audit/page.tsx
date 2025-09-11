"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AuditLog {
    _id: string;
    action: string;
    target?: string;
    actor: string;
    actorEmail?: string;
    details?: string;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export default function AuditLogPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/audit-logs?page=${page}&limit=10`)
            .then((res) => res.json())
            .then((data) => {
                setLogs(data.logs);
                setPagination(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [page]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Audit Logs</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Action</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Target</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log._id}>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>
                                        {log.actorEmail ? `(${log.actorEmail})` : log.actor}
                                    </TableCell>
                                    <TableCell>{log.target || "-"}</TableCell>
                                    <TableCell>{log.details || "-"}</TableCell>
                                    <TableCell>
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <button
                        disabled={page === pagination.pages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 border rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
