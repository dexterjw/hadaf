import React from 'react';
import { UserSettings, CompletionData } from '@/features/dashboard/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Flame,
    CheckCircle2,
    Clock,
    TrendingUp,
    TrendingDown,
    Minus,
    Calendar,
    Award,
    AlertCircle,
    BookOpen
} from 'lucide-react';
import { WeeklyHeatmap } from '../charts/WeeklyHeatmap';

interface HafizDashboardFourProps {
    settings: UserSettings;
    stats: CompletionData;
}

export default function Dash4Expanded({ settings, stats }: HafizDashboardFourProps) {
    // Mock Data for UI
    const streak = 18;
    const bestStreak = 45;

    // Mock Heatmap Data
    const heatmapData = Array.from({ length: 180 }, (_, i) => ({
        date: new Date(Date.now() - (179 - i) * 24 * 60 * 60 * 1000).toISOString(),
        intensity: Math.floor(Math.random() * 5),
        verses: Math.floor(Math.random() * 20),
        type: 'memorization' as const
    }));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. TOP BAR (Persistent) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{settings.name}</h1>
                    <p className="text-muted-foreground">Variation 1: Focus on Consistency</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="px-3 py-1 bg-teal-500/10 text-teal-500 border-teal-500/20 gap-2">
                        <Award size={14} />
                        Strong Hifdh Health
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 bg-pink-500/10 text-pink-500 border-pink-500/20 gap-2">
                        <Flame size={14} />
                        {streak} Day Streak
                    </Badge>
                </div>
            </div>

            {/* MOVED: CONSISTENCY & STREAK to TOP */}
            <section>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <Card className="lg:col-span-1 border-teal-500/20">
                        <CardHeader>
                            <CardTitle>Consistency Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-500/10 rounded-full text-pink-500">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{streak} Days</div>
                                    <div className="text-xs text-muted-foreground">Current Streak</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-teal-500/10 rounded-full text-teal-500">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{bestStreak} Days</div>
                                    <div className="text-xs text-muted-foreground">All-time Best</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-3 h-full">
                        <WeeklyHeatmap data={heatmapData} />
                    </div>
                </div>
            </section>

            <Separator />

            {/* 2. TODAY’S FOCUS (Hero Section) */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-primary/10 p-1.5 rounded-md text-primary"><Clock size={16} /></span>
                    Today's Focus
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sabak */}
                    <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sabak (New Lesson)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold">Surah An-Naba</div>
                                    <div className="text-sm text-muted-foreground">Ayah 1-15</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                                        <Clock size={12} className="mr-1" /> Pending
                                    </Badge>
                                    <Button size="sm" variant="outline">Start</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dour */}
                    <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dour (Recent Revision)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold">Surah Al-Mulk</div>
                                    <div className="text-sm text-muted-foreground">Full Surah</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-4 bg-primary rounded-sm" />)}
                                        <div className="w-1.5 h-4 bg-muted rounded-sm" />
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">Good Quality</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Manzil */}
                    <Card className="border-t-4 border-t-purple-500 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Manzil (Long-term)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-2xl font-bold">Juz 29</div>
                                    <div className="text-sm text-muted-foreground">Pages 562 - 581</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                        <CheckCircle2 size={12} className="mr-1" /> Completed
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">Verified by Teacher</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* 4. WEEKLY TARGETS */}
            <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="bg-primary/10 p-1.5 rounded-md text-primary"><Calendar size={16} /></span>
                    Weekly Targets
                </h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Sabak Target</span>
                                    <span className="text-muted-foreground">5 / 6 Days</span>
                                </div>
                                <Progress value={83} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Dour Target</span>
                                    <span className="text-muted-foreground">3 / 6 Days</span>
                                </div>
                                <Progress value={50} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">Manzil Target</span>
                                    <span className="text-muted-foreground">1.5 / 2 Juz</span>
                                </div>
                                <Progress value={75} className="h-2 bg-muted" indicatorClassName="bg-purple-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 6. MANZIL COVERAGE - SWAPPED ORDER */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 p-1.5 rounded-md text-primary"><BookOpen size={16} /></span>
                        Manzil Coverage
                    </h2>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base">Juz Revision Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1.5">
                                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                                    /* Random logic for demo */
                                    let color = "bg-muted text-muted-foreground";
                                    if (juz >= 28) color = "bg-teal-500 text-white"; // Recent
                                    if (juz === 15) color = "bg-pink-500 text-white"; // Overdue
                                    if (juz === 16) color = "bg-yellow-500 text-white"; // Due soon

                                    return (
                                        <div
                                            key={juz}
                                            className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${color}`}
                                            title={`Juz ${juz}`}
                                        >
                                            {juz}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Oldest Unrevised</div>
                                    <div className="font-semibold">Juz 15 (14 days ago)</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Avg Revision Gap</div>
                                    <div className="font-semibold">6 Days</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* 5. DOUR QUALITY TRACKER */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 p-1.5 rounded-md text-primary"><TrendingUp size={16} /></span>
                        Dour Quality
                    </h2>
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="text-base">Quality Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg">
                                <div>
                                    <div className="text-sm text-muted-foreground">Consistency Score</div>
                                    <div className="text-2xl font-bold text-teal-500">92%</div>
                                </div>
                                <div className="text-teal-500 flex flex-col items-center">
                                    <TrendingUp size={20} />
                                    <span className="text-xs">Improving</span>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <AlertCircle size={14} className="text-pink-500" />
                                    Weak Areas (Needs Attention)
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm p-2 rounded-md border border-pink-500/20 bg-pink-500/5">
                                        <span>Surah Al-Mursalat</span>
                                        <Badge variant="outline" className="text-pink-500 border-pink-500/30 text-[10px]">Hesitation</Badge>
                                    </div>
                                    <div className="flex items-center justify-between text-sm p-2 rounded-md border border-yellow-500/20 bg-yellow-500/5">
                                        <span>Juz 28, Page 544</span>
                                        <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 text-[10px]">Minor Errors</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
