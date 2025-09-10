'use client'

import { Sidebar } from '@/components/sidebar'
import { SessionProvider } from 'next-auth/react'

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <SessionProvider>  
                <Sidebar />

                <main className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto">
                        {children}
                    </div>
                </main>
            </SessionProvider>
        </div>
    )
}