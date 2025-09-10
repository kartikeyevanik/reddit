// components/app-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    Flag,
    Search,
    BarChart3,
    Bell,
    UserCheck,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

// Define the UserRole enum to match your Prisma schema
enum UserRole {
    SUBMITTER = 'SUBMITTER',
    REVIEWER = 'REVIEWER',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN'
}

export function Sidebar() {
    const pathname = usePathname()
    const { data: session, status } = useSession()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const userRole = session?.user?.role as UserRole || UserRole.SUBMITTER

    // Define navigation items based on user role
    const navigationItems = {
        [UserRole.SUBMITTER]: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'My Submissions', href: '/dashboard/submissions', icon: FileText },
            { name: 'Submit Content', href: '/dashboard/submit-content', icon: Flag },
        ],
        [UserRole.REVIEWER]: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Review Queue', href: '/dashboard/review', icon: UserCheck },
            { name: 'My Reviews', href: '/dashboard/my-reviews', icon: FileText },
            { name: 'Submit Content', href: '/dashboard/submit', icon: Flag },
        ],
        [UserRole.MODERATOR]: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Moderation Queue', href: '/dashboard/moderation', icon: UserCheck },
            { name: 'Content Management', href: '/dashboard/content', icon: FileText },
            { name: 'User Management', href: '/dashboard/users', icon: Users },
            { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { name: 'Search', href: '/dashboard/search', icon: Search },
        ],
        [UserRole.ADMIN]: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Moderation Queue', href: '/dashboard/moderation', icon: UserCheck },
            { name: 'Content Management', href: '/dashboard/content', icon: FileText },
            { name: 'User Management', href: '/dashboard/users', icon: Users },
            { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
            { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
            { name: 'Audit Logs', href: '/dashboard/audit', icon: BarChart3 },
            { name: 'Search', href: '/dashboard/search', icon: Search },
        ],
    }

    const commonItems = [
        { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
        { name: 'Profile', href: '/dashboard/profile', icon: Users },
    ]

    const currentItems = [...navigationItems[userRole], ...commonItems]

    if (status === 'loading') {
        return (
            <div className="hidden md:flex flex-col w-64 h-screen border-r bg-background">
                <div className="flex h-14 items-center border-b px-4">
                    <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="flex-1 p-4 space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <>
        
            <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${!isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex h-14 items-center justify-between border-b px-4">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <span>Content Moderation</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-auto p-4">
                        <nav className="space-y-1">
                            {currentItems.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Button
                                        key={item.name}
                                        variant={isActive ? "secondary" : "ghost"}
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <Link href={item.href} onClick={() => setIsMobileOpen(false)}>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    </Button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* User section */}
                    <div className="p-4 border-t">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start h-auto p-2">
                                    <Avatar className="h-8 w-8 mr-2">
                                        {/* <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} /> */}
                                        <AvatarFallback>
                                            {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">{session?.user?.name || 'User'}</span>
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {userRole.toLowerCase()}
                                        </span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => signOut()}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}