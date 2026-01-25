import { LayoutDashboard, TrendingUp, Settings, BookOpen, Sparkles } from 'lucide-react';
import { HafizTab } from '@/types/hafiz';

interface HafizSidebarProps {
    activeTab: HafizTab;
    setActiveTab: (tab: HafizTab) => void;
    userName?: string;
}

const HafizSidebar: React.FC<HafizSidebarProps> = ({ activeTab, setActiveTab, userName = "Student" }) => {
    const menuItems = [
        { id: 'dashboard' as HafizTab, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'analytics' as HafizTab, label: 'Analytics', icon: TrendingUp },
        { id: 'coach' as HafizTab, label: 'AI Companion', icon: Sparkles },
        { id: 'settings' as HafizTab, label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col justify-between py-6 z-20">

            {/* Logo Area */}
            <div className="px-6 mb-8 flex items-center justify-center lg:justify-start gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
                    <BookOpen size={16} />
                </div>
                <span className="hidden lg:block text-lg font-bold text-foreground tracking-tight">Hafiz</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-xl transition-all duration-200 group
                ${isActive
                                    ? 'bg-secondary text-foreground ring-1 ring-border'
                                    : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                                }`}
                        >
                            <Icon
                                size={20}
                                className={`transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}
                                strokeWidth={2}
                            />
                            <span className={`hidden lg:block text-sm font-medium`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Profile Snippet */}
            <div className="px-4 mt-auto">
                <div className="hidden lg:flex items-center gap-3 p-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {userName.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{userName}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Student</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default HafizSidebar;
