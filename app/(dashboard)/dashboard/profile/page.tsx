// app/(dashboard)/dashboard/profile/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import connectDB from "@/lib/db";
import { IUser, User } from "@/lib/models/User";
import { IUserPreferences, UserPreferences } from "@/lib/models/UserPreferences";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Mail, Shield, User as UserIcon } from "lucide-react";

// Types for safe serialization
interface SerializedUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    image?: string;
    emailVerified?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
}

interface SerializedPreferences {
    id: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export default async function ProfilePage() {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login");
    }

    // Fetch user data
    const userDoc = await User.findById(session.user.id)
        .select("-password")
        .lean<IUser | null>();

    if (!userDoc) {
        redirect("/login");
    }

    const preferencesDoc = await UserPreferences.findOne({
        userId: session.user.id,
    }).lean<IUserPreferences | null>();

    // Serialize user
    const user: SerializedUser = {
        id: userDoc._id.toString(),
        email: userDoc.email,
        name: userDoc.name,
        role: userDoc.role,
        image: userDoc.image,
        emailVerified: userDoc.emailVerified
            ? userDoc.emailVerified.toISOString()
            : null,
        createdAt: userDoc.createdAt ? userDoc.createdAt.toISOString() : null,
        updatedAt: userDoc.updatedAt ? userDoc.updatedAt.toISOString() : null,
    };

    // Serialize preferences
    const preferences: SerializedPreferences | null = preferencesDoc
        ? {
            id: preferencesDoc._id.toString(),
            emailNotifications: preferencesDoc.emailNotifications,
            pushNotifications: preferencesDoc.pushNotifications,
            createdAt: preferencesDoc.createdAt
                ? preferencesDoc.createdAt.toISOString()
                : null,
            updatedAt: preferencesDoc.updatedAt
                ? preferencesDoc.updatedAt.toISOString()
                : null,
        }
        : null;

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "destructive";
            case "MODERATOR":
                return "default";
            case "REVIEWER":
                return "secondary";
            case "SUBMITTER":
                return "outline";
            default:
                return "outline";
        }
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return "Never";
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(date));
    };

    return (
        <div className="container max-w-4xl p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <div className="grid gap-6">
                {/* Profile Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                            Your personal information and account details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            {user.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || "User"}
                                    className="h-16 w-16 rounded-full"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <UserIcon className="h-8 w-8" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                <Badge
                                    variant={getRoleBadgeVariant(user.role)}
                                    className="capitalize"
                                >
                                    {user.role.toLowerCase()}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid gap-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                                {user.emailVerified && (
                                    <Badge variant="outline" className="text-xs">
                                        Verified
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">{user.role.toLowerCase()}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Member since {formatDate(user.createdAt)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Update Profile Form */}
                <ProfileForm user={user} />

                {/* Account Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Preferences</CardTitle>
                        <CardDescription>
                            Your notification and account preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 text-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-muted-foreground">
                                        Receive email notifications about your account
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        preferences?.emailNotifications ? "default" : "outline"
                                    }
                                >
                                    {preferences?.emailNotifications ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Push Notifications</p>
                                    <p className="text-muted-foreground">
                                        Receive push notifications in your browser
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        preferences?.pushNotifications ? "default" : "outline"
                                    }
                                >
                                    {preferences?.pushNotifications ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
