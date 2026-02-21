"use client";

import { MessageSquare, Users, Circle } from "lucide-react";

interface GroupChatHeaderProps {
    teamId: string;
    memberCount?: number;
}

export function GroupChatHeader({ teamId, memberCount }: GroupChatHeaderProps) {
    const teamName = teamId === "demo" ? "Team Alpha" : `Team ${teamId}`;

    return (
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm">{teamName} · Group Chat</h3>
                <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Users className="w-3 h-3" />
                        {memberCount ?? "—"} members
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                        <Circle className="w-2 h-2 fill-emerald-400" />
                        Team active
                    </span>
                </div>
            </div>
            <div className="flex -space-x-2">
                {["AS", "PN", "RG"].map((initials, i) => (
                    <div
                        key={initials}
                        className="w-7 h-7 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center"
                        style={{ zIndex: 3 - i }}
                    >
                        <span className="text-[9px] font-bold text-white">{initials}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
