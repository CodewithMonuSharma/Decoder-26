"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Mail, Shield, Save, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch("/api/auth/me")
            .then((r) => r.json())
            .then((data) => {
                if (data.user) setUser(data.user);
                setLoading(false);
            });
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/auth/login";
    };

    if (loading) {
        return (
            <DashboardLayout title="Settings">
                <div className="animate-pulse space-y-4">
                    <div className="h-32 bg-gray-100 rounded-2xl" />
                    <div className="h-64 bg-gray-100 rounded-2xl" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title="Account Settings">
            <div className="max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your profile information and account preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Sidebar navigation for settings */}
                    <div className="space-y-1">
                        <button className="w-full text-left px-4 py-2 text-sm font-medium bg-teal-50 text-teal-700 rounded-lg">
                            Profile Information
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            Security & Password
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            Notifications
                        </button>
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout Session
                            </button>
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Profile Section */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="w-4 h-4 text-teal-600" />
                                Public Profile
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue={user?.name}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            readOnly
                                            defaultValue={user?.email}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-100 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1.5 ml-1">Email cannot be changed once the account is created.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assigned Role</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            readOnly
                                            defaultValue={user?.role}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-100 rounded-xl text-sm text-gray-500 capitalize cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-end">
                                <Button
                                    className="gap-2"
                                    onClick={() => {
                                        setSaving(true);
                                        setTimeout(() => setSaving(false), 800);
                                    }}
                                >
                                    {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                                </Button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="bg-red-50/30 border border-red-100 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-red-900 mb-2">Danger Zone</h3>
                            <p className="text-xs text-red-700/70 mb-4 leading-relaxed">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
