import { useState, useMemo } from 'react';
import HafizSidebar from './HafizSidebar';
import HafizDashboard from './HafizDashboard';
import HafizAnalytics from './HafizAnalytics';
import HafizSettings from './HafizSettings';
import HafizAICoach from './HafizAICoach';
import { UserSettings, CompletionData, HafizTab, DEFAULT_SETTINGS } from '@/types/hafiz';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const tabTitles: Record<HafizTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: "Let's continue your blessed journey." },
    analytics: { title: 'Journey Analytics', subtitle: 'Visualize your progress and future milestones.' },
    settings: { title: 'Configuration', subtitle: 'Adjust your plan and personal details.' },
    coach: { title: 'AI Hifz Companion', subtitle: 'Ask for motivation, tafsir, or memorization tips.' },
};

export default function HafizLayout() {
    const [activeTab, setActiveTab] = useState<HafizTab>('dashboard');
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    // Derived state calculations
    const stats: CompletionData = useMemo(() => {
        const total = settings.totalPages;
        const current = settings.currentPage;
        const remaining = total - current;
        const rate = settings.dailyGoalPages || 1; // Avoid division by zero

        const daysLeft = Math.ceil(remaining / rate);
        const today = new Date();
        const completionDate = new Date(today);
        completionDate.setDate(today.getDate() + daysLeft);

        const percentage = Math.min(100, Math.max(0, (current / total) * 100));
        const juz = Math.floor(current / 20); // Roughly 20 pages per Juz

        return {
            daysRemaining: daysLeft,
            estimatedCompletionDate: completionDate,
            progressPercentage: percentage,
            juzCompleted: juz,
            pagesRemaining: remaining
        };
    }, [settings]);

    const currentTab = tabTitles[activeTab];

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-full bg-background text-foreground font-sans overflow-hidden">
                {/* Sidebar Navigation */}
                <HafizSidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={settings.name} />

                {/* Main Content Area */}
                <SidebarInset className="flex-1 h-full overflow-y-auto transition-all duration-300 ease-in-out bg-background">
                    <div className="max-w-7xl mx-auto h-full flex flex-col p-6 md:p-12 lg:p-16">

                        {/* Header with Sidebar Trigger and Breadcrumb */}
                        <header className="mb-10 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <SidebarTrigger className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors" />
                                {/* Modern minimal separator (just space or dot) - Removed vertical line */}

                                <Breadcrumb>
                                    <BreadcrumbList>
                                        <BreadcrumbItem>
                                            <BreadcrumbPage className="text-xl md:text-2xl font-light text-foreground tracking-tight">
                                                {activeTab === 'dashboard' ? (
                                                    <span className="flex items-center gap-2">
                                                        Salam, <span className="font-semibold">{settings.name}</span>
                                                    </span>
                                                ) : (
                                                    currentTab.title
                                                )}
                                            </BreadcrumbPage>
                                        </BreadcrumbItem>
                                    </BreadcrumbList>
                                </Breadcrumb>
                            </div>

                            <div className="hidden md:flex items-center gap-3">
                                <span className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Status</span>
                                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 rounded-full border-border bg-card/50 backdrop-blur-sm text-xs font-medium text-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_hsl(var(--accent))]"></span>
                                    <span>Active</span>
                                </Badge>
                            </div>
                        </header>

                        {/* Subtitle - Increased spacing */}
                        <div className="mb-12">
                            <h2 className="text-sm md:text-base text-muted-foreground font-light max-w-2xl leading-relaxed">
                                {currentTab.subtitle}
                            </h2>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 min-h-0">
                            {activeTab === 'dashboard' && (
                                <HafizDashboard settings={settings} stats={stats} />
                            )}
                            {activeTab === 'analytics' && (
                                <HafizAnalytics settings={settings} stats={stats} />
                            )}
                            {activeTab === 'settings' && (
                                <HafizSettings settings={settings} onSave={setSettings} />
                            )}
                            {activeTab === 'coach' && (
                                <HafizAICoach userName={settings.name} />
                            )}
                        </div>
                    </div>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}
