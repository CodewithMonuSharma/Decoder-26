import Link from "next/link";
import {
  Boxes,
  Users,
  CheckSquare,
  BarChart3,
  ArrowRight,
  Github,
  Twitter,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const features = [
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Bring your team together. Assign roles, manage members, and collaborate in real-time on every project.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: CheckSquare,
    title: "Task Management",
    description: "Break projects into tasks. Track progress with a clean kanban board and never miss a deadline.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visual dashboards and progress bars give you a clear snapshot of where every project stands.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Zap,
    title: "Fast Onboarding",
    description: "Create a project and invite your team in minutes. No complex setup, no learning curve.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Assign leads, developers, designers, and testers. Everyone knows their responsibilities.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Globe,
    title: "Always Accessible",
    description: "Work from anywhere. Your projects, tasks, and team are always one click away.",
    color: "bg-purple-50 text-purple-600",
  },
];

const steps = [
  { step: "01", title: "Create a Project", desc: "Name your project, set your tech stack, and describe your goals in under 2 minutes." },
  { step: "02", title: "Build Your Team", desc: "Invite teammates by email. Assign roles and responsibilities from the start." },
  { step: "03", title: "Collaborate & Ship", desc: "Assign tasks, track progress in real-time, and deliver your best project together." },
];

const demoProjects = [
  { name: "AI Research Portal", category: "AI / ML", progress: 65, status: "active", tech: ["Python", "FastAPI", "React"], members: ["AS", "PP", "RV"] },
  { name: "EcoTrack Mobile App", category: "Mobile", progress: 42, status: "active", tech: ["React Native", "Node.js"], members: ["PP", "KM"] },
  { name: "Campus Event Hub", category: "Web", progress: 80, status: "active", tech: ["Next.js", "Prisma", "TypeScript"], members: ["AS", "SK", "RV", "KM"] },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVBAR ─────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Boxes className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">CollabSpace</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              Sign in
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="h-8 text-xs gap-1.5">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section className="pt-20 pb-16 px-6 text-center relative overflow-hidden">
        {/* Subtle background mesh */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-primary/8 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Tag line */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-6 border border-primary/20">
            <Star className="w-3 h-3 fill-primary" />
            Built for student teams that ship
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-5">
            Collaborate on Projects{" "}
            <span className="text-primary">Like Never Before</span>
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto mb-8">
            Manage teams, tasks, and progress — all in one clean workspace.
            From idea to submission, CollabSpace keeps your team aligned and productive.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/auth/signup">
              <Button size="lg" className="h-11 px-7 gap-2 text-[15px] font-semibold shadow-lg shadow-primary/25">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="h-11 px-7 text-[15px]">
                View Demo
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-4">No account needed to explore. Free for all students.</p>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ──────────────────── */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-xl shadow-gray-200/60">
            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded text-xs text-gray-400 px-6 py-0.5 max-w-xs truncate">
                  collabspace.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard mock */}
            <div className="flex h-[420px]">
              {/* Sidebar mock */}
              <div className="w-52 bg-white border-r border-gray-200 p-3 hidden sm:block">
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <div className="w-5 h-5 rounded bg-primary/90" />
                  <span className="text-[11px] font-bold text-gray-800">CollabSpace</span>
                </div>
                {["Dashboard", "Projects", "Tasks", "Team", "Settings"].map((item, i) => (
                  <div key={item} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-0.5 ${i === 1 ? "bg-primary/10" : ""}`}>
                    <div className={`w-3 h-3 rounded ${i === 1 ? "bg-primary" : "bg-gray-300"}`} />
                    <span className={`text-[11px] font-medium ${i === 1 ? "text-primary" : "text-gray-500"}`}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Main mock */}
              <div className="flex-1 p-4 overflow-hidden">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[
                    { label: "Projects", value: "3" },
                    { label: "Tasks Done", value: "9" },
                    { label: "Members", value: "5" },
                    { label: "Progress", value: "62%" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-lg p-2.5">
                      <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
                      <p className="text-base font-bold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Projects */}
                <p className="text-[11px] font-semibold text-gray-700 mb-2">Your Projects</p>
                <div className="grid grid-cols-1 gap-2">
                  {demoProjects.map((p) => (
                    <div key={p.name} className="bg-white border border-gray-100 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="px-1.5 py-0.5 text-[9px] font-medium bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">Active</span>
                            <span className="text-[9px] text-gray-400">{p.category}</span>
                          </div>
                          <p className="text-[12px] font-semibold text-gray-900">{p.name}</p>
                        </div>
                        <div className="flex -space-x-1">
                          {p.members.map((m) => (
                            <div key={m} className="w-4 h-4 rounded-full bg-indigo-100 border border-white flex items-center justify-center">
                              <span className="text-[7px] font-bold text-indigo-700">{m[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1">
                          <div className="bg-primary rounded-full h-1" style={{ width: `${p.progress}%` }} />
                        </div>
                        <span className="text-[9px] font-semibold text-gray-600">{p.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to collaborate</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A focused set of tools to help student teams plan, build, and deliver projects — without the noise.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const { icon: Icon } = f;
              return (
                <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all">
                  <div className={`w-9 h-9 rounded-lg ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Up and running in minutes</h2>
            <p className="text-gray-500">No onboarding maze. Just three steps to your first project.</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-8 left-8 right-8 h-px bg-gray-200 hidden md:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={s.step} className="relative text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-5 font-bold text-lg shadow-lg shadow-primary/25 relative z-10">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section className="py-20 px-6 bg-primary">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to ship your best project?</h2>
          <p className="text-primary-foreground/80 mb-8 text-[15px]">
            Join thousands of students already using CollabSpace to build amazing things together.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="h-11 px-8 font-semibold gap-2">
              Start Collaborating Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Boxes className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-900">CollabSpace</span>
          </div>
          <div className="flex items-center gap-5 text-sm text-gray-500">
            <span>© 2025 CollabSpace. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <a href="#" className="hover:text-gray-700 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="hover:text-gray-700 transition-colors"><Twitter className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
