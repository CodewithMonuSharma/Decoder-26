import Link from "next/link";
import {
  Github,
  Zap,
  MessageSquare,
  BarChart3,
  CheckSquare,
  Users,
  ArrowRight,
  Play,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Project Creation & Team Formation",
    description:
      "Create cross-institution projects, invite teammates, and assign roles like leader, contributor, and reviewer.",
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon: Github,
    title: "Mentor Review & Feedback",
    description:
      "Mentors can review submissions, provide feedback, approve milestones, and track team progress in real time.",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: CheckSquare,
    title: "Milestone & Progress Tracking",
    description:
      "Define project milestones and monitor completion status with structured progress tracking.",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    icon: Zap,
    title: "Secure Document Sharing",
    description:
      "Upload research papers, designs, and reports in a centralized workspace accessible to students and mentors.",
    iconBg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
  {
    icon: BarChart3,
    title: "Contribution Visibility Dashboard",
    description:
      "Visualize commits, tasks, and individual contributions to ensure fair evaluation and transparent teamwork.",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    icon: MessageSquare,
    title: "Real-Time Collaboration",
    description:
      "Integrated chat and notifications keep students and faculty aligned throughout the project lifecycle.",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
];

const stats = [
  { value: "1000+", label: "Student Collaborations", color: "text-teal-600" },
  { value: "300+", label: "Projects Created", color: "text-teal-600" },
  { value: "80+", label: "Mentors Connected", color: "text-teal-600" },
  { value: "95%", label: "Improved Visibility", color: "text-purple-600" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ─────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fillOpacity="0.9" />
                <circle cx="8" cy="8" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight text-[15px]">
              CollabSpace
            </span>
          </div>

          {/* Right CTA */}
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────── */}
      <section
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #e8f5f5 0%, #f0fafa 40%, #eef9f9 70%, #e0f2f2 100%)",
        }}
      >
        {/* Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 border border-teal-200 text-teal-700 rounded-full text-xs font-semibold mb-7 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
          AI-Powered Cross-Institution Project Collaboration
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.08] mb-5 max-w-4xl mx-auto">
          Collaborate, Track & Deliver Student Projects{" "}
          <span className="text-teal-600">Across Institutions</span>
        </h1>

        {/* Subheading */}
        <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed mb-9">
          A unified platform enabling students and mentors from different institutions to collaborate on projects, track milestones, share documents, and ensure transparent contribution tracking for better academic outcomes.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-gray-900/20"
          >
            Start Collaborating
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-gray-600 text-gray-600" />
            Explore Demo
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center flex-wrap gap-x-12 gap-y-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Powerful Features
            </h2>
            <p className="text-gray-500 text-sm">
              Everything you need for successful team collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-teal-100 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-[15px]">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-3xl px-10 py-14 text-center text-white"
            style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #115e59 100%)",
            }}
          >
            <h2 className="text-3xl font-extrabold mb-3">
              Build Better Projects Together — Beyond Institutional Boundaries
            </h2>
            <p className="text-teal-100 text-sm mb-8 max-w-xl mx-auto leading-relaxed">
              Empower students and mentors with a collaborative workspace designed to improve coordination, transparency, and successful project delivery.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all backdrop-blur-sm"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" />
                    <circle cx="8" cy="8" r="2.5" fill="white" fillOpacity="0.7" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-gray-900">CollabSpace</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[160px]">
                Empowering student collaboration across institutions.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Product
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                {["Features", "Pricing", "Documentation"].map((l) => (
                  <li key={l}><Link href="/" className="hover:text-teal-600 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Company
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                {["About", "Blog", "Careers"].map((l) => (
                  <li key={l}><Link href="/" className="hover:text-teal-600 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                Support
              </p>
              <ul className="space-y-2 text-xs text-gray-500">
                {["Help Center", "Contact", "Status"].map((l) => (
                  <li key={l}><Link href="/" className="hover:text-teal-600 transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© 2025 CollabSpace. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</Link>
              <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
