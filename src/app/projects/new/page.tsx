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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

const schema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(1, "Please select a category"),
    teamSize: z.string().min(1, "Please select a team size"),
});

type FormData = z.infer<typeof schema>;

const categories = ["AI / ML", "Web", "Mobile", "IoT", "Data Science", "Game Dev", "DevOps", "Research"];

export default function NewProjectPage() {
    const router = useRouter();
    const [techStack, setTechStack] = useState<string[]>([]);
    const [techInput, setTechInput] = useState("");

    const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const watchedName = watch("name", "");
    const watchedDescription = watch("description", "");

    const addTech = () => {
        if (techInput.trim() && !techStack.includes(techInput.trim())) {
            setTechStack([...techStack, techInput.trim()]);
            setTechInput("");
        }
    };

    const removeTech = (t: string) => setTechStack(techStack.filter((x) => x !== t));

    const onSubmit = async (data: FormData) => {
        const res = await fetch("/api/projects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: data.name,
                description: data.description,
                category: data.category,
                teamSize: parseInt(data.teamSize) || 1,
                techStack,
            }),
        });
        if (res.ok) {
            const project = await res.json();
            router.push(`/projects/${project.id || project._id}`);
        }
    };


    return (
        <DashboardLayout title="New Project">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Fill in the details to get your project started.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 space-y-5">
                        <div className="bg-white border border-border rounded-xl p-5 space-y-5">
                            {/* Project Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Project Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. AI Research Portal"
                                    className="h-10"
                                    {...register("name")}
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <Label htmlFor="description" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="What is your project about? What problem does it solve?"
                                    className="min-h-[100px] resize-none"
                                    {...register("description")}
                                />
                                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                            </div>

                            {/* Category + Team Size */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Category *</Label>
                                    <Select onValueChange={(v) => setValue("category", v)}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c} value={c}>{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Team Size *</Label>
                                    <Select onValueChange={(v) => setValue("teamSize", v)}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select size" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["1", "2", "3", "4", "5", "6", "7", "8+"].map((s) => (
                                                <SelectItem key={s} value={s}>{s} member{s !== "1" ? "s" : ""}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.teamSize && <p className="text-xs text-destructive">{errors.teamSize.message}</p>}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Tech Stack</Label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="e.g. React, Python, PostgreSQL"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                                        className="h-10 flex-1"
                                    />
                                    <Button type="button" variant="outline" size="icon" className="h-10 w-10 shrink-0" onClick={addTech}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                {techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {techStack.map((t) => (
                                            <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary rounded-lg border border-primary/20">
                                                {t}
                                                <button type="button" onClick={() => removeTech(t)} className="hover:text-red-600 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                {isSubmitting ? "Creating..." : "Create Project"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </div>
                    </form>

                    {/* Live Preview */}
                    <div className="lg:col-span-2">
                        <div className="sticky top-0">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Live Preview</p>
                            <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">Active</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2 text-[15px]">
                                    {watchedName || <span className="text-gray-400">Your Project Name</span>}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-4">
                                    {watchedDescription || <span className="text-gray-300">Project description will appear here...</span>}
                                </p>
                                {techStack.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {techStack.slice(0, 4).map((t) => (
                                            <span key={t} className="px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600 rounded-md">{t}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-100 flex justify-between">
                                    <span className="text-xs text-gray-400">0% complete</span>
                                    <span className="text-xs text-gray-400">0/0 tasks</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
