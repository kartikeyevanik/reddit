"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface User {
    _id: string;
    name?: string;
    email: string;
    role: "SUBMITTER" | "REVIEWER" | "MODERATOR" | "ADMIN";
}

interface Pagination {
    total: number;
    page: number;
    pages: number;
    limit: number;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        pages: 1,
        limit: 5,
    });

    // Fetch users
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users?page=${page}&limit=${pagination.limit}`);
            const data = await res.json();
            setUsers(data.users || []);
            setPagination(data.pagination || { total: 0, page: 1, pages: 1, limit: 5 });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Update user role
    async function updateRole(
        userId: string,
        role: "SUBMITTER" | "REVIEWER" | "MODERATOR" | "ADMIN"
    ) {
        setActionLoading(userId);
        const res = await fetch(`/api/users/${userId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });

        if (res.ok) {
            const updatedUser = await res.json();
            setUsers((prev) =>
                prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
            );
        }

        setActionLoading(null);
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 h-screen">
            <h1 className="text-2xl font-bold">User Management</h1>

            {users.length === 0 ? (
                <p className="text-muted-foreground">No users found.</p>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name || "Unnamed"}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end flex-wrap">
                                            <Button
                                                onClick={() => updateRole(user._id, "SUBMITTER")}
                                                disabled={actionLoading === user._id}
                                                variant={user.role === "SUBMITTER" ? "secondary" : "outline"}
                                            >
                                                {actionLoading === user._id && user.role !== "SUBMITTER"
                                                    ? "Updating..."
                                                    : "Submitter"}
                                            </Button>
                                            <Button
                                                onClick={() => updateRole(user._id, "REVIEWER")}
                                                disabled={actionLoading === user._id}
                                                variant={user.role === "REVIEWER" ? "secondary" : "outline"}
                                            >
                                                {actionLoading === user._id && user.role !== "REVIEWER"
                                                    ? "Updating..."
                                                    : "Reviewer"}
                                            </Button>
                                            <Button
                                                onClick={() => updateRole(user._id, "MODERATOR")}
                                                disabled={actionLoading === user._id}
                                                variant={user.role === "MODERATOR" ? "secondary" : "outline"}
                                            >
                                                {actionLoading === user._id && user.role !== "MODERATOR"
                                                    ? "Updating..."
                                                    : "Moderator"}
                                            </Button>
                                            <Button
                                                onClick={() => updateRole(user._id, "ADMIN")}
                                                disabled={actionLoading === user._id}
                                                variant={user.role === "ADMIN" ? "secondary" : "outline"}
                                            >
                                                {actionLoading === user._id && user.role !== "ADMIN"
                                                    ? "Updating..."
                                                    : "Admin"}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <Button
                            onClick={() => fetchUsers(pagination.page - 1)}
                            disabled={pagination.page <= 1}
                            variant="outline"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span>
                            Page {pagination.page} of {pagination.pages}
                        </span>
                        <Button
                            onClick={() => fetchUsers(pagination.page + 1)}
                            disabled={pagination.page >= pagination.pages}
                            variant="outline"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
