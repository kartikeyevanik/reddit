import LayoutWrapper from "@/components/layout-wrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard ",
    description: "It is dashboard",
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <LayoutWrapper>
                {children}
            </LayoutWrapper>
        </div>
    );
}
