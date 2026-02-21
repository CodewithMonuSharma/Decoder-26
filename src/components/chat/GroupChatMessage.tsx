"use client";

interface GroupChatMessageProps {
    senderName: string;
    senderInitials: string;
    text: string;
    timestamp: string | Date;
    isOwn: boolean;
}

function formatTime(ts: string | Date): string {
    const d = new Date(ts);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

const AVATAR_COLORS = [
    "bg-indigo-500", "bg-teal-500", "bg-violet-500",
    "bg-rose-500", "bg-amber-500", "bg-cyan-500",
];

function getAvatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function GroupChatMessage({ senderName, senderInitials, text, timestamp, isOwn }: GroupChatMessageProps) {
    const avatarColor = getAvatarColor(senderName);

    if (isOwn) {
        return (
            <div className="flex items-end justify-end gap-2 group">
                <div className="flex flex-col items-end max-w-[72%]">
                    <span className="text-[11px] text-gray-400 mb-1 mr-1">{formatTime(timestamp)}</span>
                    <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-2xl rounded-br-sm shadow-sm text-sm leading-relaxed">
                        {text}
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mb-0.5 shadow-sm">
                    <span className="text-[11px] font-bold text-white">{senderInitials}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2 group">
            <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0 mb-0.5 shadow-sm`}>
                <span className="text-[11px] font-bold text-white">{senderInitials}</span>
            </div>
            <div className="flex flex-col max-w-[72%]">
                <span className="text-[11px] text-gray-500 font-medium mb-1 ml-1">{senderName}</span>
                <div className="bg-white border border-gray-100 text-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm shadow-sm text-sm leading-relaxed">
                    {text}
                </div>
                <span className="text-[10px] text-gray-400 ml-1 mt-1">{formatTime(timestamp)}</span>
            </div>
        </div>
    );
}
