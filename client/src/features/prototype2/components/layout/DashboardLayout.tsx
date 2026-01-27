import { useState, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import DashboardSidebar from './DashboardSidebar';
import Dash1Original from '../dashboards/Dash1Original';
import Dash2Gauge from '../dashboards/Dash2Gauge';
import Dash3Compact from '../dashboards/Dash3Compact';
import Dash4Expanded from '../dashboards/Dash4Expanded';
import Dash5Minimal from '../dashboards/Dash5Minimal';
import Dash7List from '../dashboards/Dash7List';
import Dash8Bento from '../dashboards/Dash8Bento';
import Dash9GPT from '../dashboards/Dash9GPT';
import Dash10Health from '../dashboards/Dash10Health';
import Dash13Goals from '../dashboards/Dash13Goals';
import Dash11Roadmap from '../analytics/Dash11Roadmap';
import Dash12Analytics from '../analytics/Dash12Analytics';
import HafizSettings from '../features/HafizSettings';
import HafizAICoach from '../features/HafizAICoach';
import { UserSettings, CompletionData, HafizTab, DEFAULT_SETTINGS } from '@/features/prototype2/types/hafiz';
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
    dash1: { title: 'Dashboard Original', subtitle: "Let's continue your blessed journey." },
    dash2: { title: 'Dashboard Gauge', subtitle: "Visual overview of your daily progress." },
    dash3: { title: 'Dashboard Compact', subtitle: "Comprehensive tracking and insights." },
    dash4: { title: 'Dashboard Expanded', subtitle: "Focus on consistency." },
    dash5: { title: 'Dashboard Minimal', subtitle: "Compact & data dense." },
    dash7: { title: 'Dashboard List', subtitle: "Holistic daily focus." },
    dash8: { title: 'Dashboard Bento', subtitle: "Modern modular overview." },
    dash9: { title: 'Dashboard GPT', subtitle: "Action-oriented, low cognitive load." },
    dash10: { title: 'Dashboard Health', subtitle: "Maintain the health of your memorized portions." },
    dash11: { title: 'Journey Roadmap', subtitle: 'Your complete path from start to finish.' },
    dash12: { title: 'Analytics', subtitle: 'Visualize your progress and future milestones.' },
    dash13: { title: 'Goal Progress', subtitle: "Track your pace against your targets." },
    settings: { title: 'Configuration', subtitle: 'Adjust your plan and personal details.' },
    coach: { title: 'AI Companion', subtitle: 'Ask for motivation, tafsir, or memorization tips.' },
};

export default function DashboardLayout() {
    const params = useParams<{ tab?: string }>();
    const [, setLocation] = useLocation();
    const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

    // Derive active tab from URL, default to 'dash1' if not specified or invalid
    const activeTab: HafizTab = (params.tab && ['dash1', 'dash2', 'dash3', 'dash4', 'dash5', 'dash7', 'dash8', 'dash9', 'dash10', 'dash11', 'dash12', 'dash13', 'settings', 'coach'].includes(params.tab))
        ? params.tab as HafizTab
        : 'dash1';

    // Navigation function to update URL
    const navigateToTab = (tab: HafizTab) => {
        setLocation(`/labs/p2/${tab}`);
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
                <DashboardSidebar activeTab={activeTab} setActiveTab={navigateToTab} userName={settings.name} />

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
                                                {activeTab === 'dash1' ? (
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
                            {activeTab === 'dash1' && (
                                <Dash1Original settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash2' && (
                                <Dash2Gauge settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash3' && (
                                <Dash3Compact settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash4' && (
                                <Dash4Expanded settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash5' && (
                                <Dash5Minimal settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash7' && (
                                <Dash7List settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash8' && (
                                <Dash8Bento settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash9' && (
                                <Dash9GPT settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash10' && (
                                <Dash10Health settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash11' && (
                                <Dash11Roadmap settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash12' && (
                                <Dash12Analytics settings={settings} stats={stats} />
                            )}
                            {activeTab === 'dash13' && (
                                <Dash13Goals settings={settings} stats={stats} />
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
