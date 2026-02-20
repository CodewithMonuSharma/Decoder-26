"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Schemas ──────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "mentor"]),
});

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["student", "mentor"]),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

// ── Shared input style ────────────────────────────
const inputClass =
    "w-full h-10 px-3 text-sm bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-400/30 focus:border-teal-500 transition-all placeholder:text-gray-300 text-gray-800";

// ── Login Form ────────────────────────────────────
function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { role: "student" },
    });

    const onSubmit = async (data: LoginData) => {
        setError(null);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Login failed");

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}
            {/* Email */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address
                </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className={inputClass}
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className={inputClass}
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Role */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Role
                </label>
                <div className="flex items-center gap-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="student"
                            {...register("role")}
                            className="accent-teal-600 w-3.5 h-3.5"
                        />
                        <span className="text-sm text-gray-700">Student</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="mentor"
                            {...register("role")}
                            className="accent-teal-600 w-3.5 h-3.5"
                        />
                        <span className="text-sm text-gray-700">Mentor</span>
                    </label>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-70"
                style={{
                    background: "linear-gradient(90deg, #0d9488, #0f766e)",
                }}
            >
                {isSubmitting ? "Signing in..." : "Login"}
            </button>
        </form>
    );
}

// ── Register Form ─────────────────────────────────
function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "student" },
    });

    const onSubmit = async (data: RegisterData) => {
        setError(null);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Registration failed");

            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {error && (
                <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg">
                    {error}
                </div>
            )}
            {/* Name */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name
                </label>
                <input
                    placeholder="Enter your full name"
                    className={inputClass}
                    {...register("name")}
                />
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email Address
                </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className={inputClass}
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Create a password"
                    className={inputClass}
                    {...register("password")}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Confirm your password"
                    className={inputClass}
                    {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Role */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                    Role
                </label>
                <div className="flex items-center gap-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="student"
                            {...register("role")}
                            className="accent-teal-600 w-3.5 h-3.5"
                        />
                        <span className="text-sm text-gray-700">Student</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="mentor"
                            {...register("role")}
                            className="accent-teal-600 w-3.5 h-3.5"
                        />
                        <span className="text-sm text-gray-700">Mentor</span>
                    </label>
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-70"
                style={{ background: "linear-gradient(90deg, #0d9488, #0f766e)" }}
            >
                {isSubmitting ? "Creating account..." : "Register"}
            </button>
        </form>
    );
}

// ── Main Page ─────────────────────────────────────
export default function AuthPage() {
    const [tab, setTab] = useState<"login" | "register">("login");

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
            style={{
                background:
                    "linear-gradient(160deg, #e0f2f1 0%, #f0fafa 40%, #e8f5f5 70%, #d9f0ef 100%)",
            }}
        >
            {/* Logo + Title */}
            <div className="text-center mb-7">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                    style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)" }}
                >
                    {/* Monitor icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                    </svg>
                </div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    CollabSpace Platform
                </h1>
                <p className="text-xs text-teal-600 font-medium mt-1">
                    AI-Powered Student Contribution Intelligence
                </p>
            </div>

            {/* Card */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Tab switcher */}
                <div className="flex border-b border-gray-100">
                    {(["login", "register"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${tab === t
                                ? "text-teal-600 border-b-2 border-teal-500 bg-white"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            {t === "login" ? "Login" : "Register"}
                        </button>
                    ))}
                </div>

                {/* Form content */}
                <div className="p-6">
                    {tab === "login" ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>

            {/* Bottom tagline */}
            <p className="text-xs text-center mt-6 max-w-xs leading-relaxed">
                <span className="text-gray-400">Collaborative project management for </span>
                <span className="text-teal-600 font-medium">students</span>
                <span className="text-gray-400"> across </span>
                <span className="text-teal-600 font-medium">institutions</span>
            </p>
        </div>
    );
}
