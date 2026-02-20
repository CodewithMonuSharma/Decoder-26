"use client";

import { useEffect, useState } from "react";
import { User, TrendingUp, CheckCircle2, FolderKanban, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function MentorStudentList() {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/mentor/students")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setStudents(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (students.length === 0) {
        return (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 italic">No students assigned to you yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Student Progress Tracking</h3>
            <div className="grid grid-cols-1 gap-4">
                {students.map((student) => (
                    <div key={student._id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 font-bold border border-teal-100">
                                    {student.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors uppercase text-sm tracking-tight">{student.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">Joined {new Date(student.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-600 rounded-full">
                                <Zap className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">{student.impactScore}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Execution Progress</span>
                                <span className="text-teal-600">{student.progress}%</span>
                            </div>
                            <Progress value={student.progress} className="h-2 bg-gray-50" />
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-50">
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Projects</p>
                                <div className="flex items-center justify-center gap-1 text-gray-700">
                                    <FolderKanban className="w-3 h-3" />
                                    <span className="text-xs font-bold">{student.projectsCount}</span>
                                </div>
                            </div>
                            <div className="text-center border-x border-gray-100 px-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Tasks</p>
                                <div className="flex items-center justify-center gap-1 text-gray-700">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span className="text-xs font-bold">{student.tasksCount}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Impact</p>
                                <div className="flex items-center justify-center gap-1 text-gray-700">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs font-bold">+{Math.floor(student.progress / 5)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
