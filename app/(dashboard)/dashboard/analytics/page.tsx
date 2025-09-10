"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface AnalyticsData {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    perUser: { user: string; count: number }[];
    topTags: { tag: string; count: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/analytics")
            .then((res) => res.json())
            .then((d) => {
                setData(d);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Submissions</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{data.total}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pending</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-yellow-600">{data.pending}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Approved</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-green-600">{data.approved}</CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rejected</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold text-red-600">{data.rejected}</CardContent>
                </Card>
            </div>

            {/* Submissions per user bar chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Submissions per User</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.perUser}>
                            <XAxis dataKey="user" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0088FE" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Top tags pie chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.topTags}
                                dataKey="count"
                                nameKey="tag"
                                outerRadius={100}
                                label
                            >
                                {data.topTags.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
