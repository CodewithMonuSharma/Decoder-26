"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Search, User, Crown, Check, GraduationCap } from "lucide-react";

const schema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Please select a category"),
    teamSize: z.string().min(1, "Please select team capacity"),
});

type FormData = z.infer<typeof schema>;

const categories = ["AI / ML", "Web", "Mobile", "IoT", "Data Science", "Game Dev", "DevOps", "Research"];

export default function NewProjectPage() {
    const router = useRouter();
    const [techStack, setTechStack] = useState<string[]>([]);
    const [techInput, setTechInput] = useState("");

    // Team Management State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [invitedMembers, setInvitedMembers] = useState<any[]>([]);
    const [leaderId, setLeaderId] = useState<string | null>(null);
    const [searching, setSearching] = useState(false);

    // Mentor Invitation State
    const [mentorSearchQuery, setMentorSearchQuery] = useState("");
    const [mentorSearchResults, setMentorSearchResults] = useState<any[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<any | null>(null);
    const [mentorSearching, setMentorSearching] = useState(false);

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const watchedName = watch("name", "");
    const watchedCategory = watch("category", "");
    const watchedTeamSize = watch("teamSize", "");

    // User Search Effect
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.length >= 2) {
                setSearching(true);
                try {
                    const res = await fetch(`/api/users/search?q=${searchQuery}`);
                    const data = await res.json();
                    setSearchResults(data.filter((u: any) => u.role === "student"));
                } catch (e) {
                    console.error("Search failed:", e);
                } finally {
                    setSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Mentor Search Effect
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (mentorSearchQuery.length >= 2) {
                setMentorSearching(true);
                try {
                    const res = await fetch(`/api/users/search?q=${mentorSearchQuery}`);
                    const data = await res.json();
                    setMentorSearchResults(data.filter((u: any) => u.role === "mentor"));
                } catch (e) {
                    console.error("Mentor search failed:", e);
                } finally {
                    setMentorSearching(false);
                }
            } else {
                setMentorSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [mentorSearchQuery]);

    const addTech = () => {
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput("");
        }
    };

    const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

    const inviteMember = (user: any) => {
        if (!invitedMembers.find(m => m._id === user._id)) {
            setInvitedMembers([...invitedMembers, {
                ...user,
                userId: user._id,
                role: "Lead", // Default choice for lead selection
                joinedDate: new Date().toISOString(),
                status: "active",
                initials: user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
            }]);
            setSearchQuery("");
            setSearchResults([]);
        }
    };

    const removeMember = (userId: string) => {
        setInvitedMembers(invitedMembers.filter(m => m._id !== userId));
        if (leaderId === userId) setLeaderId(null);
    };

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    description: data.description,
                    category: data.category,
                    teamSize: parseInt(data.teamSize) || 1,
                    techStack,
                    members: invitedMembers.map(m => ({
                        ...m,
                        role: leaderId === m._id ? "Lead" : "Developer"
                    })),
                    leaderId: leaderId,
                    invitedMentorId: selectedMentor?._id || null,
                }),
            });
            if (res.ok) {
                const project = await res.json();
                router.push(`/projects/${project.id || project._id}`);
            }
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    return (
        <DashboardLayout title="New Project">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-teal-500 pl-4">Create New Project</h2>
                    <p className="text-sm text-gray-500 mt-1 ml-5">Launch your mission and assemble your dream team.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Form Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Project Core Details */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-800">Project Mission</h3>
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="name" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter project name..."
                                        className="h-11 rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all shadow-none"
                                        {...register("name")}
                                    />
                                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="description" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mission Briefing *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the objectives and challenges..."
                                        className="min-h-[120px] rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white transition-all resize-none shadow-none"
                                        {...register("description")}
                                    />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category *</Label>
                                        <Select onValueChange={(v) => setValue("category", v)}>
                                            <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/30 shadow-none">
                                                <SelectValue placeholder="Industry" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                {categories.map((c) => (
                                                    <SelectItem key={c} value={c} className="rounded-lg">{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Team Capacity *</Label>
                                        <Select onValueChange={(v) => setValue("teamSize", v)}>
                                            <SelectTrigger className="h-11 rounded-xl border-gray-100 bg-gray-50/30 shadow-none">
                                                <SelectValue placeholder="Max Members" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                                {["1", "2", "3", "4", "5", "10", "15", "20+"].map((s) => (
                                                    <SelectItem key={s} value={s} className="rounded-lg">{s} Members</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.teamSize && <p className="text-xs text-red-500 mt-1">{errors.teamSize.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Stack Building</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="React, AWS..."
                                            value={techInput}
                                            onChange={(e) => setTechInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                            className="h-11 rounded-xl border-gray-100 bg-gray-50/30 shadow-none"
                                        />
                                        <Button type="button" variant="outline" size="icon" className="h-11 w-11 shrink-0 rounded-xl" onClick={addTech}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {techStack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {techStack.map((t) => (
                                                <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gray-50 text-gray-700 rounded-lg border border-gray-100 hover:border-teal-200 transition-colors">
                                                    {t}
                                                    <button type="button" onClick={() => removeTech(t)} className="text-gray-400 hover:text-red-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Team Assembly */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <h3 className="font-bold text-gray-800">Team Assembly</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">Invited: {invitedMembers.length}</span>
                                </div>

                                {/* User Search */}
                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50 shadow-none focus:bg-white transition-all"
                                    />

                                    {searching && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />}

                                    {searchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                            {searchResults.map((u) => (
                                                <button
                                                    key={u._id}
                                                    type="button"
                                                    onClick={() => inviteMember(u)}
                                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                            {u.name[0]}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-gray-900">{u.name}</p>
                                                            <p className="text-[10px] text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Invited List & Leader Choice */}
                                {invitedMembers.length > 0 ? (
                                    <div className="space-y-3">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Appoint Team Leader</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {invitedMembers.map((m) => (
                                                <div
                                                    key={m._id}
                                                    onClick={() => setLeaderId(m._id)}
                                                    className={`relative p-4 rounded-xl border transition-all cursor-pointer group ${leaderId === m._id ? 'bg-teal-50 border-teal-200 ring-2 ring-teal-500/10' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${leaderId === m._id ? 'bg-teal-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                                            {m.initials}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-bold text-gray-900 truncate">{m.name}</h4>
                                                            <p className="text-[10px] text-gray-500 truncate">{m.email}</p>
                                                        </div>
                                                        {leaderId === m._id && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeMember(m._id); }}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        {!leaderId && <p className="text-[10px] text-amber-600 font-medium italic">Please select one member as the Team Leader.</p>}
                                    </div>
                                ) : (
                                    <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                        <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-xs text-gray-500">No team members invited yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Mentor Guidance Section */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-gray-800">Mentor Guidance</h3>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Find a mentor to guide your project..."
                                        value={mentorSearchQuery}
                                        onChange={(e) => setMentorSearchQuery(e.target.value)}
                                        className="pl-10 h-11 rounded-xl border-gray-100 bg-gray-50 shadow-none focus:bg-white transition-all"
                                    />

                                    {mentorSearching && <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />}

                                    {mentorSearchResults.length > 0 && (
                                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                                            {mentorSearchResults.map((m) => (
                                                <button
                                                    key={m._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedMentor(m);
                                                        setMentorSearchQuery("");
                                                        setMentorSearchResults([]);
                                                    }}
                                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xs uppercase">
                                                            {m.name[0]}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-sm font-bold text-gray-900">{m.name}</p>
                                                            <p className="text-[10px] text-gray-500">{m.email}</p>
                                                        </div>
                                                    </div>
                                                    <Plus className="w-4 h-4 text-gray-400" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedMentor && (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-200">
                                                {selectedMentor.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-emerald-900 text-sm">{selectedMentor.name}</h4>
                                                <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                                    <Check className="w-3 h-3" /> Mentor Selected
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100"
                                            onClick={() => setSelectedMentor(null)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                                <p className="text-[10px] text-gray-400 italic">The mentor will receive a request to join after you deploy the project.</p>
                            </div>

                            {/* Final Actions */}
                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !leaderId || invitedMembers.length === 0}
                                    className="h-12 px-8 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg shadow-teal-500/20 disabled:grayscale transition-all flex-1"
                                >
                                    {isSubmitting ? "Orchestrating..." : "Deploy Mission"}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => router.back()} className="h-12 px-8 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50">
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Meta Sidebar / Summary */}
                    <div className="lg:col-span-4 sticky top-6">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl space-y-6">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Configuration Overview</h4>

                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Project Manager</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">ME</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">You (Creator)</p>
                                            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">Access: Admin</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Team Leadership</p>
                                    {leaderId ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
                                                <Crown className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 truncate max-w-[150px]">
                                                    {invitedMembers.find(m => m._id === leaderId)?.name}
                                                </p>
                                                <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Role: Team Leader</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No leader appointed yet.</p>
                                    )}
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Project Mentor</p>
                                    {selectedMentor ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                                <GraduationCap className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 truncate max-w-[150px]">
                                                    {selectedMentor.name}
                                                </p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Status: Requesting</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No mentor invited yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-3">Live Mission Preview</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Project Name</span>
                                        <span className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{watchedName || "—"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Stack Size</span>
                                        <span className="text-xs font-bold text-gray-900">{techStack.length} tools</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Team Capacity</span>
                                        <span className="text-xs font-bold text-gray-900">{watchedTeamSize || "—"} Members</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500">Deployment Status</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                            <span className="text-xs font-bold text-gray-900">Ready</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
