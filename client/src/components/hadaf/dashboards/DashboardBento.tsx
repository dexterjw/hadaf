import React from 'react';
import { UserSettings, CompletionData } from '@/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Flame,
    CheckCircle2,
    BookOpen,
    BarChart3,
    ArrowUpRight,
    Target,
    Zap,
    History
} from 'lucide-react';
import { WeeklyHeatmap } from '../charts/WeeklyHeatmap';

interface SegmentedProgressProps {
    value: number;
    totalSegments?: number;
    activeColorClass?: string;
    inactiveColorClass?: string;
}

const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
    value,
    totalSegments = 30,
    activeColorClass = "from-blue-400 to-blue-600", // Default gradient colors
    inactiveColorClass = "from-slate-100 to-slate-300 dark:from-slate-800 dark:to-slate-900"
}) => {
    // Calculate how many segments should be active based on percentage value (0-100)
    const activeSegments = Math.round((value / 100) * totalSegments);

    return (
        <div className="flex w-full gap-[3px] h-10 items-end"> {/* Taller h-10 for capsule look */}
            {Array.from({ length: totalSegments }).map((_, index) => (
                <div
                    key={index}
                    className={`
                    flex-1 rounded-full text-[0px] transition-all duration-500 ease-out h-full
                    bg-gradient-to-b ${index < activeSegments ? activeColorClass : inactiveColorClass}
                    ${index < activeSegments ? 'opacity-100 shadow-sm' : 'opacity-60'}
                `}
                />
            ))}
        </div>
    );
};

interface HafizDashboardSixProps {
    settings: UserSettings;
    stats: CompletionData;
}

export default function HafizDashboardSix({ settings, stats }: HafizDashboardSixProps) {
    // Bento Grids are usually characterized by varied cell sizes fitting into a cohesive grid.

    // Mock Heatmap Data (Smaller set for visual fit)
    const heatmapData = Array.from({ length: 90 }, (_, i) => ({
        date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000).toISOString(),
        intensity: Math.floor(Math.random() * 5),
        verses: Math.floor(Math.random() * 20),
        type: 'memorization' as const
    }));

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard <span className="text-muted-foreground font-light">Bento</span></h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

                {/* 1. HERO - Large Square (2x2) */}
                <Card className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-primary/10 via-background to-secondary/20 border-primary/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-primary/10 transition-colors duration-1000"></div>
                    <CardContent className="h-full flex flex-col justify-between p-8">
                        <div className="space-y-2">
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">Today's Focus</Badge>
                            <h2 className="text-4xl font-bold tracking-tight">Surah An-Naba</h2>
                            <p className="text-xl text-muted-foreground">Ayah 1 - 15</p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Progress</div>
                                <div className="flex-1 h-px bg-border"></div>
                            </div>

                            <div className="flex gap-4">
                                <Button size="lg" className="flex-1 shadow-lg shadow-primary/20">Start Session <Zap size={18} className="ml-2" /></Button>
                                <Button size="lg" variant="secondary" className="aspect-square p-0 flex items-center justify-center">
                                    <CheckCircle2 size={24} />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. STREAK - Tall (1x2) */}
                <Card className="md:col-span-1 md:row-span-2 flex flex-col bg-orange-500/5 border-orange-500/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-500">
                            <Flame size={20} /> Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6">
                        <div className="text-6xl font-black text-foreground mb-2 tracking-tighter">18</div>
                        <div className="text-sm text-muted-foreground uppercase font-bold tracking-widest mb-8">Day Streak</div>

                        <div className="w-full space-y-2 text-xs text-left">
                            <div className="flex justify-between">
                                <span>Best Streak</span>
                                <span className="font-bold">45 Days</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Total Active</span>
                                <span className="font-bold">142 Days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. DOUR STATUS - Small (1x1) */}
                <Card className="md:col-span-1 bg-blue-500/5 border-blue-500/20 group hover:border-blue-500/40 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                            Dour
                            <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">Surah Al-Mulk</div>
                        <div className="text-xs text-muted-foreground mb-4">Quality: Good (4/5)</div>
                        <Progress value={66} className="h-1.5 bg-blue-100 dark:bg-blue-900/20" indicatorClassName="bg-blue-500" />
                    </CardContent>
                </Card>

                {/* 4. MANZIL STATUS - Small (1x1) */}
                <Card className="md:col-span-1 bg-purple-500/5 border-purple-500/20 group hover:border-purple-500/40 transition-colors cursor-pointer">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex justify-between">
                            Manzil
                            <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold mb-1">Juz 29</div>
                        <div className="text-xs text-muted-foreground mb-4">Pages 562 - 581</div>
                        <Progress value={90} className="h-1.5 bg-purple-100 dark:bg-purple-900/20" indicatorClassName="bg-purple-500" />
                    </CardContent>
                </Card>

                {/* 5. CONSISTENCY MAP - Wide (2x1) */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                            <History size={18} /> Consistency Map
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WeeklyHeatmap data={heatmapData} />
                    </CardContent>
                </Card>

                {/* 6. WEEKLY TARGETS - Wide (2x1) */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Target size={18} /> Weekly Targets
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8"> {/* Vertical stack with comfortable spacing */}

                        {/* Sabak Target */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium">Revenue Growth (Sabak)</span>
                                <span className="text-sm font-bold text-blue-500">87%</span>
                            </div>
                            <SegmentedProgress
                                value={87}
                                totalSegments={35}
                                activeColorClass="from-blue-400 to-blue-600 shadow-[0_2px_4px_rgba(59,130,246,0.3)]"
                                inactiveColorClass="from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                            />
                        </div>

                        {/* Dour Target */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium">Operational Costs (Dour)</span>
                                <span className="text-sm font-bold text-indigo-500">58%</span>
                            </div>
                            <SegmentedProgress
                                value={58}
                                totalSegments={35}
                                activeColorClass="from-indigo-400 to-indigo-600 shadow-[0_2px_4px_rgba(99,102,241,0.3)]"
                                inactiveColorClass="from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                            />
                        </div>

                        {/* Manzil Target */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium">Top Performing (Manzil)</span>
                                <span className="text-sm font-bold text-emerald-500">76%</span>
                            </div>
                            <SegmentedProgress
                                value={76}
                                totalSegments={35}
                                activeColorClass="from-emerald-400 to-emerald-600 shadow-[0_2px_4px_rgba(16,185,129,0.3)]"
                                inactiveColorClass="from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
                            />
                        </div>

                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
