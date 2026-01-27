import { LayoutDashboard, TrendingUp, Settings, Sparkles, BookOpen, Search, Gauge, LayoutTemplate, Layers, List, Grid, Heart } from 'lucide-react';
import { HafizTab } from '@/features/dashboard/types/hafiz';
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

interface DashboardSidebarProps {
    activeTab: HafizTab;
    setActiveTab: (tab: HafizTab) => void;
    userName?: string;
}

// Main dashboard items - numbered D1 through D13
const menuItems = [
    { id: 'dash1' as HafizTab, label: 'D1 (Original)', icon: LayoutDashboard },
    { id: 'dash2' as HafizTab, label: 'D2 (Gauge)', icon: Gauge },
    { id: 'dash3' as HafizTab, label: 'D3 (Compact)', icon: LayoutDashboard },
    { id: 'dash4' as HafizTab, label: 'D4 (Expanded)', icon: LayoutDashboard },
    { id: 'dash5' as HafizTab, label: 'D5 (Minimal)', icon: LayoutDashboard },
    { id: 'dash7' as HafizTab, label: 'D7 (List)', icon: List },
    { id: 'dash8' as HafizTab, label: 'D8 (Bento)', icon: Grid },
    { id: 'dash9' as HafizTab, label: 'D9 (GPT)', icon: Sparkles },
    { id: 'dash10' as HafizTab, label: 'D10 (Health)', icon: Heart },
    { id: 'dash11' as HafizTab, label: 'D11 (Roadmap)', icon: Layers },
    { id: 'dash12' as HafizTab, label: 'D12 (Analytics)', icon: TrendingUp },
    { id: 'dash13' as HafizTab, label: 'D13 (Goals)', icon: TrendingUp },
];

// Items for "Other" category
const otherItems = [
    { id: 'coach' as HafizTab, label: 'AI Companion', icon: Sparkles },
    { id: 'settings' as HafizTab, label: 'Settings', icon: Settings },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, setActiveTab, userName = "Student" }) => {
    return (
        <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
            {/* Header Area */}
            <SidebarHeader className="p-4 pb-2 space-y-4">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:mx-auto">
                            <BookOpen size={18} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-xl tracking-tight group-data-[collapsible=icon]:hidden">
                            Hadaf
                        </span>
                    </div>
                    <div className="group-data-[collapsible=icon]:hidden">
                        <div className="h-7 w-7 rounded-lg border border-white/10 flex items-center justify-center text-muted-foreground hover:bg-white/5 cursor-pointer transition-colors">
                            <span className="sr-only">Toggle Sidebar</span>
                            <span className="text-xs">⌘</span>
                        </div>
                    </div>
                </div>

                {/* Search Bar - hidden when collapsed */}
                <div className="group-data-[collapsible=icon]:hidden mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-sidebar-foreground/50" />
                        <Input
                            placeholder="Search..."
                            className="pl-9 h-9 rounded-xl bg-sidebar-accent/50 border-sidebar-border/50 focus-visible:bg-sidebar-accent focus-visible:ring-1 focus-visible:ring-sidebar-ring/50 transition-all placeholder:text-muted-foreground/50 text-sm"
                        />
                        <div className="absolute right-2 top-2 flex items-center gap-1 pointer-events-none">
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-sidebar-border/50 bg-sidebar-accent/50 text-[10px] font-medium text-muted-foreground">
                                <span>⌘</span>
                                <span>K</span>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="px-3 py-2">
                {/* Dashboard Numbers Group */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/50 px-3 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
                        Dashboard Numbers
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab(item.id)}
                                        tooltip={item.label}
                                        className={`h-[42px] px-3 rounded-xl transition-all duration-300 group/menu-btn relative overflow-hidden group-data-[collapsible=icon]:justify-center ${isActive
                                            ? "text-sidebar-primary-foreground font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                            }`}
                                    >
                                        {/* Active Background Gradient - Using Orange (sidebar-primary) */}
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/20 via-sidebar-primary/10 to-transparent opacity-100" />
                                        )}
                                        {/* Active Left Glow Bar (subtle) */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-primary rounded-full shadow-[0_0_12px_hsl(var(--sidebar-primary))]" />
                                        )}

                                        <div className="relative flex items-center gap-3 z-10 w-full">
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                // Ensure icon is orange when active
                                                className={isActive ? "text-sidebar-primary drop-shadow-sm" : "group-hover/menu-btn:text-foreground transition-colors"}
                                            />
                                            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"} group-data-[collapsible=icon]:hidden`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                {/* Other Group */}
                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/50 px-3 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
                        Other
                    </SidebarGroupLabel>
                    <SidebarMenu className="space-y-1">
                        {otherItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        onClick={() => setActiveTab(item.id)}
                                        tooltip={item.label}
                                        className={`h-[42px] px-3 rounded-xl transition-all duration-300 group/menu-btn relative overflow-hidden group-data-[collapsible=icon]:justify-center ${isActive
                                            ? "text-sidebar-primary-foreground font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/20 via-sidebar-primary/10 to-transparent opacity-100" />
                                        )}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-primary rounded-full shadow-[0_0_12px_hsl(var(--sidebar-primary))]" />
                                        )}
                                        <div className="relative flex items-center gap-3 z-10 w-full">
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.5 : 2}
                                                className={isActive ? "text-sidebar-primary drop-shadow-sm" : "group-hover/menu-btn:text-foreground transition-colors"}
                                            />
                                            <span className={`text-sm ${isActive ? "font-medium" : "font-normal"} group-data-[collapsible=icon]:hidden`}>
                                                {item.label}
                                            </span>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>

                <div className="flex-1" />
            </SidebarContent>

            {/* Bottom Profile Snippet */}
            <SidebarFooter className="p-4 pt-2">
                {/* Promo Card - Workly style 'Boost' - Optional, keeping for now but simplified */}
                <div className="mb-4 px-1 group-data-[collapsible=icon]:hidden">
                    <div className="rounded-xl bg-gradient-to-br from-sidebar-primary/10 to-purple-500/10 border border-sidebar-border p-4 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles size={14} className="text-sidebar-primary" />
                            <span className="text-xs font-bold text-sidebar-primary">Hadaf AI</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            Personalized memorization tips.
                        </p>
                    </div>
                </div>

                <div className="group-data-[collapsible=icon]:p-0">
                    <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center p-2">
                        <Avatar className="w-8 h-8 rounded-full">
                            <AvatarFallback className="bg-sidebar-primary/20 text-sidebar-primary text-xs font-bold">
                                {userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent/50 transition-colors cursor-pointer group group-data-[collapsible=icon]:hidden">
                        <Avatar className="w-8 h-8 rounded-full border border-sidebar-border">
                            <AvatarFallback className="bg-sidebar-primary/10 text-sidebar-primary text-xs font-bold">
                                {userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-foreground truncate">{userName}</span>
                            <span className="text-[10px] text-muted-foreground truncate">student@hadaf.com</span>
                        </div>
                        <div className="ml-auto text-muted-foreground group-hover:text-foreground">
                            <Settings size={16} />
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default DashboardSidebar;
