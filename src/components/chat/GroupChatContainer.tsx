"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GroupChatHeader } from "./GroupChatHeader";
import { GroupChatMessage } from "./GroupChatMessage";
import { GroupChatInput } from "./GroupChatInput";
import { Loader2 } from "lucide-react";

interface ChatMsg {
    _id: string;
    teamId: string;
    senderId: string;
    senderName: string;
    senderInitials: string;
    text: string;
    timestamp: string | Date;
}

interface GroupChatContainerProps {
    teamId: string;
    currentUser?: {
        name: string;
        initials: string;
        id: string;
    };
    memberCount?: number;
}

const POLL_INTERVAL = 3000; // 3s polling

export function GroupChatContainer({ teamId, currentUser, memberCount }: GroupChatContainerProps) {
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const latestTimestampRef = useRef<string>("");

    const me = currentUser ?? {
        name: "Arjun Sharma",
        initials: "AS",
        id: "current-user",
    };

    const fetchMessages = useCallback(async (silent = false) => {
        try {
            const res = await fetch(`/api/chat?teamId=${teamId}`, { cache: "no-store" });
            if (!res.ok) throw new Error();
            const data: ChatMsg[] = await res.json();
            setMessages(data);
            setError(false);
            if (data.length > 0) {
                latestTimestampRef.current = String(data[data.length - 1].timestamp);
            }
        } catch {
            if (!silent) setError(true);
        } finally {
            if (!silent) setLoading(false);
        }
    }, [teamId]);

    // Initial load
    useEffect(() => {
        fetchMessages(false);
    }, [fetchMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!loading) {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, loading]);

    // Polling for new messages
    useEffect(() => {
        const id = setInterval(() => fetchMessages(true), POLL_INTERVAL);
        return () => clearInterval(id);
    }, [fetchMessages]);

    const handleSend = async (text: string) => {
        // Optimistic update
        const optimistic: ChatMsg = {
            _id: `opt-${Date.now()}`,
            teamId,
            senderId: me.id,
            senderName: me.name,
            senderInitials: me.initials,
            text,
            timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teamId,
                    senderId: me.id,
                    senderName: me.name,
                    senderInitials: me.initials,
                    text,
                }),
            });
            if (res.ok) {
                const saved: ChatMsg = await res.json();
                // Replace optimistic with saved
                setMessages((prev) =>
                    prev.map((m) => (m._id === optimistic._id ? saved : m))
                );
            }
        } catch {
            // Keep optimistic message visible — it'll persist via demo data
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            style={{ height: "620px", display: "flex", flexDirection: "column" }}>

            <GroupChatHeader teamId={teamId} memberCount={memberCount} />

            {/* Message List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#e2e8f0 transparent" }}>

                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-gray-400">Unable to load messages. Check your connection.</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                            <span className="text-2xl">💬</span>
                        </div>
                        <p className="text-sm font-medium text-gray-500">No messages yet</p>
                        <p className="text-xs text-gray-400">Be the first to say something!</p>
                    </div>
                ) : (
                    <>
                        {/* Date separator: Today */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-3 py-0.5 rounded-full">Today</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {messages.map((msg) => (
                            <GroupChatMessage
                                key={msg._id}
                                senderName={msg.senderName}
                                senderInitials={msg.senderInitials}
                                text={msg.text}
                                timestamp={msg.timestamp}
                                isOwn={msg.senderId === me.id || msg.senderName === me.name}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            <GroupChatInput onSend={handleSend} />
        </div>
    );
}
