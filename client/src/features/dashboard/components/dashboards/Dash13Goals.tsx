
import React from 'react';
import GoalProgressCard from '../cards/GoalProgressCard';
import { UserSettings, CompletionData } from '@/features/dashboard/types/hafiz';
import { Separator } from '@/components/ui/separator';

interface Dash13GoalsProps {
    settings: UserSettings;
    stats: CompletionData;
}

const Dash13Goals: React.FC<Dash13GoalsProps> = ({ settings, stats }) => {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-5xl mx-auto">
            <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Goal Progress Monitor</h1>
                <p className="text-lg text-muted-foreground/80 font-light max-w-2xl leading-relaxed">
                    Monitoring your memorization pace against your targets.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GoalProgressCard variant="ahead" percentage={30} />
                <GoalProgressCard variant="behind" percentage={30} />
            </div>

            <Separator className="bg-border/40" />

            {/* Contextual Data Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-1 w-1 rounded-full bg-primary/50"></div>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                        Current Status Logic
                    </h3>
                </div>

                <div className="bg-muted/30 p-8 rounded-2xl border border-border/40 backdrop-blur-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Pages Memorized</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light tracking-tight text-foreground">{settings.currentPage}</span>
                                <span className="text-sm text-muted-foreground">/ {settings.totalPages}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-muted-foreground">Daily Goal</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-light tracking-tight text-foreground">{settings.dailyGoalPages}</span>
                                <span className="text-sm text-muted-foreground">pages/day</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dash13Goals;
