"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Filter, UserPlus, Github, Mail, BadgeCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL_SKILLS = ["React", "Node.js", "Python", "TypeScript", "Tailwind CSS", "MongoDB", "Figma", "Go", "Java", "Docker", "AWS"];

export default function DiscoverPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const skillsQuery = selectedSkills.length > 0 ? `&skills=${selectedSkills.join(",")}` : "";
            const res = await fetch(`/api/users/discover?query=${query}${skillsQuery}`);
            const data = await res.json();
            setUsers(data);
        } catch {
            // Fallback to mock
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [selectedSkills]);

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    return (
        <DashboardLayout title="Find Collaborators">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Search Header */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                    <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Discover New Talent</h1>
                    <p className="text-gray-500 mb-6 max-w-xl">Find students with exactly the skills you need for your next project. Keywords and skills help narrow it down.</p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, role, or keywords..."
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[15px]"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                            />
                        </div>
                        <Button onClick={fetchUsers} className="h-auto py-3.5 px-8 rounded-2xl shadow-lg shadow-primary/20">
                            Search Candidates
                        </Button>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-2">
                        {ALL_SKILLS.map(skill => (
                            <button
                                key={skill}
                                onClick={() => toggleSkill(skill)}
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${selectedSkills.includes(skill)
                                        ? "bg-primary text-white border-primary shadow-md"
                                        : "bg-white text-gray-600 border-gray-100 hover:border-gray-200"
                                    }`}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Area */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-lg font-bold text-gray-900">
                            {loading ? "Finding candidates..." : `${users.length} Potential Collaborators`}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {users.map((user) => (
                                <UserSearchCard key={user._id} user={user} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

function UserSearchCard({ user }: { user: any }) {
    return (
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform"
                >
                    {user.initials || user.name.charAt(0)}
                </div>
                <div className="flex gap-2">
                    <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-xl bg-gray-50 text-gray-400 hover:text-primary transition-colors">
                        <Github className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{user.name}</h3>
                    <BadgeCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{user.tagline || "Contributor"}</p>
            </div>

            <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed mb-5">
                {user.bio || "No bio provided yet."}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
                {(user.skills || []).map((skill: string) => (
                    <span key={skill} className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-bold">
                        {skill}
                    </span>
                ))}
            </div>

            <Button className="w-full rounded-2xl hover:gap-3 transition-all" variant="outline">
                Invite to Team <UserPlus className="w-4 h-4" />
            </Button>
        </div>
    );
}
