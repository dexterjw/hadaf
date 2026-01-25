import { useState, useMemo } from 'react';
import HafizSidebar from './HafizSidebar';
import HafizDashboard from './HafizDashboard';
import HafizAnalytics from './HafizAnalytics';
import HafizSettings from './HafizSettings';
import HafizAICoach from './HafizAICoach';
import { UserSettings, CompletionData, HafizTab, DEFAULT_SETTINGS } from '@/types/hafiz';

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

    return (
        <div className="flex h-screen w-full bg-background bg-dots-dark text-foreground font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <HafizSidebar activeTab={activeTab} setActiveTab={setActiveTab} userName={settings.name} />

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto p-4 md:p-8 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto h-full flex flex-col">

                    {/* Header */}
                    <header className="mb-6 flex items-center justify-between pt-2">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground tracking-tight font-display">
                                {activeTab === 'dashboard' && `Salam, ${settings.name}`}
                                {activeTab === 'analytics' && 'Journey Analytics'}
                                {activeTab === 'settings' && 'Configuration'}
                                {activeTab === 'coach' && 'AI Hifz Companion'}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {activeTab === 'dashboard' && "Let's continue your blessed journey."}
                                {activeTab === 'analytics' && 'Visualize your progress and future milestones.'}
                                {activeTab === 'settings' && 'Adjust your plan and personal details.'}
                                {activeTab === 'coach' && 'Ask for motivation, tafsir, or memorization tips.'}
                            </p>
                        </div>

                        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground bg-card px-3 py-1.5 rounded-full shadow-sm border border-border">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            <span>On Track</span>
                        </div>
                    </header>

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
            </main>
        </div>
    );
}
