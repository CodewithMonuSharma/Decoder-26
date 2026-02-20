"use client";

import Link from "next/link";
import { Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async () => {
        await new Promise(r => setTimeout(r, 600));
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Boxes className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 tracking-tight">CollabSpace</span>
                </div>

                <div className="bg-white border border-border rounded-2xl p-7 shadow-sm">
                    <div className="mb-6">
                        <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
                        <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</Label>
                            <Input id="email" type="email" placeholder="you@college.edu" className="h-10" {...register("email")} />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</Label>
                                <button type="button" className="text-xs text-primary hover:underline">Forgot?</button>
                            </div>
                            <Input id="password" type="password" placeholder="••••••••" className="h-10" {...register("password")} />
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full h-10" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="text-primary font-medium hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
