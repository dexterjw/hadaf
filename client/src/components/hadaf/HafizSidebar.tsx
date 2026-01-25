import { LayoutDashboard, TrendingUp, Settings, Sparkles, BookOpen, Search } from 'lucide-react';
import { HafizTab } from '@/types/hafiz';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface HafizSidebarProps {
    activeTab: HafizTab;
    setActiveTab: (tab: HafizTab) => void;
    userName?: string;
}

const menuItems = [
    { id: 'dashboard' as HafizTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics' as HafizTab, label: 'Analytics', icon: TrendingUp },
    { id: 'coach' as HafizTab, label: 'AI Companion', icon: Sparkles },
    { id: 'settings' as HafizTab, label: 'Settings', icon: Settings },
];

const HafizSidebar: React.FC<HafizSidebarProps> = ({ activeTab, setActiveTab, userName = "Student" }) => {
    return (
        <Sidebar collapsible="icon" className="border-r-0 bg-sidebar-background">
            {/* Header Area */}
            <SidebarHeader className="p-4 pb-2 space-y-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:mx-auto">
                        <BookOpen size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">
                        Hadaf
                    </span>
                    <div className="ml-auto group-data-[collapsible=icon]:hidden">
                        <div className="h-6 w-6 rounded border border-input flex items-center justify-center text-muted-foreground hover:bg-accent cursor-pointer">
                            <span className="sr-only">Toggle Sidebar</span>
                            <span className="text-xs">⌘</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar - hidden when collapsed */}
                <div className="group-data-[collapsible=icon]:hidden">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors"
                        />
                        <div className="absolute right-2 top-2.5 flex items-center gap-1 pointer-events-none">
                            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="px-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70 font-medium px-2 mb-2 group-data-[collapsible=icon]:hidden">
                        Platform
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab(item.id)}
                                        tooltip={item.label}
                                        className={`h-10 transition-all duration-200 group/menu-btn relative overflow-hidden ${isActive
                                            ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                            }`}
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className={isActive ? "text-primary drop-shadow-sm" : "group-hover/menu-btn:text-foreground transition-colors"}
                                        />
                                        <span className="ml-1">{item.label}</span>
                                        {isActive && (
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-l-full shadow-[0_0_8px_hsl(var(--primary))]" />
                                        )}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Add a spacer to push the promo card to the bottom if needed, or just let it sit */}
                <div className="flex-1" />

                {/* Promo Card - Workly style 'Boost with AI' */}
                <div className="mt-auto px-2 pb-4 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-xl border border-border bg-gradient-to-b from-card to-background p-4 shadow-sm relative overflow-hidden group">
                        {/* Decorative background glow */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/20 transition-all" />

                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-primary fill-primary/20" />
                            <span className="font-semibold text-sm">Hadaf AI Coach</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            Get personalized insights and memorization tips from your AI companion.
                        </p>
                        <button
                            onClick={() => setActiveTab('coach')}
                            className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 text-primary-foreground text-xs font-semibold shadow-md active:scale-95 transition-transform hover:brightness-110 flex items-center justify-center gap-2"
                        >
                            Open Coach <Sparkles size={12} />
                        </button>
                    </div>
                </div>
            </SidebarContent>

            {/* Bottom Profile Snippet */}
            <SidebarFooter className="p-4 pt-2">
                <div className="group-data-[collapsible=icon]:p-0">
                    <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/20 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 rounded-full border-2 border-background shadow-sm shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                    {userName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                                <span className="text-sm font-semibold text-foreground truncate max-w-[100px]">{userName}</span>
                                <span className="text-[10px] text-muted-foreground truncate">student@hadaf.com</span>
                            </div>
                        </div>
                        <div className="group-data-[collapsible=icon]:hidden text-muted-foreground group-hover:text-foreground transition-colors">
                            <Search className="w-4 h-4 rotate-45" /> {/* Simulating the chevron/arrow icon from image */}
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default HafizSidebar;
