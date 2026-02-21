"use client";

import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search, Plus, ExternalLink, FileText, Mail, Calendar,
    Upload, PenLine, Link as LinkIcon, Download, Github, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConnectRepoCard from "@/components/github/ConnectRepoCard";
import CommitList from "@/components/github/CommitList";
import { GroupChatContainer } from "@/components/chat/GroupChatContainer";

// Stable teamId for this demo — in production this would come from the user's session
const TEAM_ID = "demo";

export default function TeamPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [newDoc, setNewDoc] = useState({ title: "", url: "", content: "", type: "link" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [addingDoc, setAddingDoc] = useState(false);
    const [connectedRepo, setConnectedRepo] = useState<any>(null);
    const [commitRefresh, setCommitRefresh] = useState(0);

    const loadRepo = useCallback(async () => {
        try {
            const res = await fetch(`/api/github/repo?teamId=${TEAM_ID}`);
            const data = await res.json();
            setConnectedRepo(data.repo || null);
        } catch { /* silent */ }
    }, []);

    useEffect(() => {
        Promise.all([
            fetch("/api/users").then(r => r.json()),
            fetch("/api/resources").then(r => r.json())
        ]).then(([userData, resourceData]) => {
            setUsers(Array.isArray(userData) ? userData : []);
            setResources(Array.isArray(resourceData) ? resourceData : []);
            setLoading(false);
        }).catch(() => setLoading(false));
        loadRepo();
    }, [loadRepo]);

    const handleAddResource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDoc.title) return;

        let res;
        if (newDoc.type === "file") {
            if (!selectedFile) return;
            const formData = new FormData();
            formData.append("title", newDoc.title);
            formData.append("type", "file");
            formData.append("file", selectedFile);

            res = await fetch("/api/resources", {
                method: "POST",
                body: formData
            });
        } else {
            res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newDoc)
            });
        }

        if (res.ok) {
            const data = await res.json();
            setResources([data, ...resources]);
            setNewDoc({ title: "", url: "", content: "", type: "link" });
            setSelectedFile(null);
            setAddingDoc(false);
        }
    };

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout title="Team & Resources">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Team & Resources</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your team and shared documentation.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="members">
                <TabsList className="mb-6 bg-white border border-gray-100 p-1 rounded-xl">
                    <TabsTrigger value="members" className="px-6 py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all text-sm font-medium">
                        Members
                    </TabsTrigger>
                    <TabsTrigger value="docs" className="px-6 py-2 rounded-lg data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all text-sm font-medium">
                        Documentation
                    </TabsTrigger>
                    <TabsTrigger value="github" className="px-6 py-2 rounded-lg data-[state=active]:bg-gray-900 data-[state=active]:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <Github className="w-3.5 h-3.5" /> GitHub
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="px-6 py-2 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="w-3.5 h-3.5" /> Group Chat
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members">
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
                </TabsContent>

                <TabsContent value="docs">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Shared Resources</h2>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => { setAddingDoc(true); setNewDoc({ ...newDoc, type: 'content' }) }}>
                                <PenLine className="w-4 h-4" /> Write
                            </Button>
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => { setAddingDoc(true); setNewDoc({ ...newDoc, type: 'file' }) }}>
                                <Upload className="w-4 h-4" /> Upload
                            </Button>
                            <Button size="sm" className="gap-2" onClick={() => { setAddingDoc(true); setNewDoc({ ...newDoc, type: 'link' }) }}>
                                <Plus className="w-4 h-4" /> Add Link
                            </Button>
                        </div>
                    </div>

                    {addingDoc && (
                        <form onSubmit={handleAddResource} className="mb-8 bg-teal-50/30 border border-teal-100 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Document Title</label>
                                    <input
                                        required
                                        placeholder="e.g. Project Roadmap"
                                        value={newDoc.title}
                                        onChange={e => setNewDoc({ ...newDoc, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                    />
                                </div>

                                {newDoc.type === 'link' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Notion / External URL</label>
                                        <input
                                            required
                                            type="url"
                                            placeholder="https://..."
                                            value={newDoc.url}
                                            onChange={e => setNewDoc({ ...newDoc, url: e.target.value })}
                                            className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                                        />
                                    </div>
                                )}

                                {newDoc.type === 'content' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Document Content</label>
                                        <textarea
                                            required
                                            rows={6}
                                            placeholder="Write your documentation here..."
                                            value={newDoc.content}
                                            onChange={e => setNewDoc({ ...newDoc, content: e.target.value })}
                                            className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
                                        />
                                    </div>
                                )}

                                {newDoc.type === 'file' && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Upload File</label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-10 w-10 text-gray-400" />
                                                <div className="flex text-sm text-gray-600">
                                                    <span className="relative rounded-md font-medium text-teal-600 hover:text-teal-500">
                                                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button variant="ghost" type="button" onClick={() => setAddingDoc(false)}>Cancel</Button>
                                    <Button type="submit">Save Resource</Button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loading ? (
                            [1, 2].map(i => <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />)
                        ) : resources.length === 0 ? (
                            <div className="md:col-span-2 py-12 text-center text-gray-400 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-sm italic">No resources added yet.</p>
                            </div>
                        ) : (
                            resources.map((res: any) => (
                                <div key={res._id} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-teal-200 transition-colors group">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-teal-600 group-hover:bg-teal-50 transition-colors shrink-0">
                                            {res.type === 'link' && <LinkIcon className="w-5 h-5" />}
                                            {res.type === 'content' && <FileText className="w-5 h-5" />}
                                            {res.type === 'file' && <Download className="w-5 h-5" />}
                                        </div>
                                        <div className="truncate">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{res.title}</h4>
                                            <p className="text-[10px] text-gray-400">
                                                {res.type.toUpperCase()} • {res.addedBy?.name} • {new Date(res.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {res.type === 'content' && (
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-teal-600" title="View Content" onClick={() => alert(res.content)}>
                                                <FileText className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {res.type !== 'content' && (
                                            <a
                                                href={res.type === 'file' ? res.fileUrl : res.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-gray-300 hover:text-teal-600 transition-colors"
                                            >
                                                {res.type === 'file' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                {/* ─── GitHub Tab ─────────────────────────────────── */}
                <TabsContent value="github">
                    <div className="space-y-6">
                        <ConnectRepoCard
                            teamId={TEAM_ID}
                            initialRepo={connectedRepo}
                            onSynced={() => setCommitRefresh((n) => n + 1)}
                        />
                        <CommitList teamId={TEAM_ID} refreshTrigger={commitRefresh} />
                    </div>
                </TabsContent>

                {/* ─── Group Chat Tab ──────────────────────────────── */}
                <TabsContent value="chat">
                    <GroupChatContainer
                        teamId={TEAM_ID}
                        memberCount={users.length || 5}
                        currentUser={undefined}
                    />
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
