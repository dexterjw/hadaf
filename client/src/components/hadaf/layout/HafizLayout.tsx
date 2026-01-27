import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import HafizSidebar from './HafizSidebar';
import DashboardOriginal from '../dashboards/DashboardOriginal';
import DashboardGauge from '../dashboards/DashboardGauge';
import DashboardCompact from '../dashboards/DashboardCompact';
import DashboardExpanded from '../dashboards/DashboardExpanded';
import DashboardMinimal from '../dashboards/DashboardMinimal';
import DashboardHealth from '../dashboards/DashboardHealth';
import DashboardList from '../dashboards/DashboardList';
import DashboardBento from '../dashboards/DashboardBento';
import DashboardGPT from '../dashboards/DashboardGPT';
import DashboardGoals from '../dashboards/DashboardGoals';
import HafizAnalytics from '../HafizAnalytics';
import JourneyRoadmap from '../analytics/JourneyRoadmap';
import HafizSettings from '../features/HafizSettings';
import HafizAICoach from '../features/HafizAICoach';
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
    'dashboard-1': { title: 'Dashboard One', subtitle: "Visual overview of your daily progress." },
    'dashboard-4': { title: 'Dashboard Four', subtitle: "Comprehensive Hifdh tracking and insights." },
    'dashboard-4-v1': { title: 'Dashboard Four V1', subtitle: "Variation 1: Focus on Consistency." },
    'dashboard-4-v2': { title: 'Dashboard Four V2', subtitle: "Variation 2: Compact & Data Dense." },
    'dashboard-4-v3': { title: 'Dashboard Four V3', subtitle: "Variation 3: Focus Mode." },
    'dashboard-5': { title: 'Dashboard Five', subtitle: "Holistic Daily Focus." },
    'dashboard-6': { title: 'Dashboard Bento', subtitle: "Modern modular overview." },
    'dashboard-7-gpt': { title: 'Dashboard Six (GPT)', subtitle: "Action-oriented, low cognitive load." },
    'dashboard-healthy-heart': { title: 'Healthy Heart', subtitle: "Maintain the health of your memorized portions." },
    'dashboard-13': { title: 'Goal Progress', subtitle: "Track your pace against your targets." },
    'journey-roadmap': { title: 'Journey Roadmap', subtitle: 'Your complete path from start to finish.' },
    analytics: { title: 'Journey Analytics', subtitle: 'Visualize your progress and future milestones.' },
    settings: { title: 'Configuration', subtitle: 'Adjust your plan and personal details.' },
    coach: { title: 'AI Hifz Companion', subtitle: 'Ask for motivation, tafsir, or memorization tips.' },
};

export default function HafizLayout() {
    const params = useParams<{ tab?: string }>();
    const [, setLocation] = useLocation();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    // Derive active tab from URL, default to 'dashboard' if not specified or invalid
    const activeTab: HafizTab = (params.tab && ['dashboard', 'dashboard-1', 'dashboard-4', 'dashboard-4-v1', 'dashboard-4-v2', 'dashboard-4-v3', 'dashboard-5', 'dashboard-6', 'dashboard-7-gpt', 'dashboard-healthy-heart', 'dashboard-13', 'journey-roadmap', 'analytics', 'settings', 'coach'].includes(params.tab))
        ? params.tab as HafizTab
        : 'dashboard';

    // Navigation function to update URL
    const navigateToTab = (tab: HafizTab) => {
        setLocation(`/hafiz/${tab}`);
    };

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
                <HafizSidebar activeTab={activeTab} setActiveTab={navigateToTab} userName={settings.name} />

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
                                <DashboardOriginal settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-1' && (
                                <DashboardGauge settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-4' && (
                                <DashboardCompact settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-4-v1' && (
                                <DashboardExpanded settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-4-v2' && (
                                <DashboardMinimal settings={settings} stats={stats} />
                            )}

                            {activeTab === 'dashboard-5' && (
                                <DashboardList settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-6' && (
                                <DashboardBento settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-7-gpt' && (
                                <DashboardGPT settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-healthy-heart' && (
                                <DashboardHealth settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dashboard-13' && (
                                <DashboardGoals settings={settings} stats={stats} />
                            )}
                            {activeTab === 'journey-roadmap' && (
                                <JourneyRoadmap settings={settings} stats={stats} />
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
