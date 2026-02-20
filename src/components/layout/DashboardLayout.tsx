import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar title={title} />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
