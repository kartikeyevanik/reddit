'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("❌ Invalid credentials");
            setIsLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    const handleOAuthSignIn = (provider: string) => {
        setIsLoading(true);
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-6">
            <Card className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 shadow-2xl rounded-lg">
                <CardContent className="space-y-6 pt-6 px-4">
                    <h2 className="text-3xl font-extrabold text-white text-center">Welcome Back</h2>

                    {error && (
                        <div className="bg-red-600 text-white p-3 rounded-md shadow text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-white font-semibold">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-white font-semibold">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex justify-center items-center"
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-600"></span>
                        </div>
                        <div className="relative flex justify-center text-sm text-white uppercase px-2 bg-gray-800 font-medium">
                            Or continue with
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-gray-600 font-medium"
                        onClick={() => handleOAuthSignIn("google")}
                        disabled={isLoading}
                    >
                        Continue with Google
                    </Button>

                    <p className="text-center text-white mt-4">
                        Don’t have an account?{' '}
                        <a href="/register" className="text-indigo-300 hover:underline font-semibold">
                            Sign up
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
