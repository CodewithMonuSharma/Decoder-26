"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, UserPlus, Mail, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/users")
            .then((r) => r.json())
            .then((data) => {
                setUsers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout title="Team Directory">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        View and manage all members of the CollabSpace community.
                    </p>
                </div>
                <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
            </div>

            {/* User Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">No members found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((user) => (
                        <div key={user._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center border border-teal-100">
                                    <span className="text-lg font-bold text-teal-600">
                                        {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                    </span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'mentor' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {user.role}
                                </span>
                            </div>

                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                                {user.name}
                            </h3>

                            <div className="space-y-2 mt-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail className="w-3.5 h-3.5" />
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
                                <Button variant="ghost" size="sm" className="text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                                    View Profile
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
