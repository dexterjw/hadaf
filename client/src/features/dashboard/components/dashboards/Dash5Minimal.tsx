import React from 'react';
import { UserSettings, CompletionData } from '@/features/dashboard/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Flame,
    CheckCircle2,
    Clock,
    TrendingUp,
    Minus,
    Calendar,
    Award,
    AlertCircle,
    BookOpen,
    Activity
} from 'lucide-react';
import { WeeklyHeatmap } from '../charts/WeeklyHeatmap';

interface HafizDashboardFourProps {
    settings: UserSettings;
    stats: CompletionData;
}

export default function Dash5Minimal({ settings, stats }: HafizDashboardFourProps) {
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
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">

            {/* HEADER - COMPACT */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-indigo-500/10 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-indigo-100">{settings.name}</h1>
                    <p className="text-xs text-indigo-300/70">Variation 2: Compact & Data Dense</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-indigo-400">Score</span>
                        <span className="text-xl font-mono leading-none">850</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-indigo-400">Streak</span>
                        <span className="text-xl font-mono leading-none">{streak}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* LEFT COL - MAIN ACTIONS (Size 8) */}
                <div className="md:col-span-8 space-y-6">

                    {/* TODAY'S FOCUS - HORIZONTAL CARDS */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <Clock size={14} className="text-indigo-500" /> Today's Tasks
                        </h2>
                        <div className="space-y-3">
                            {/* Sabak */}
                            <div className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors border-l-4 border-l-primary">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Surah An-Naba <span className="text-xs font-normal text-muted-foreground ml-2">Ayah 1-15</span></div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Sabak</div>
                                    </div>
                                </div>
                                <Button size="sm" className="h-8 text-xs">Start</Button>
                            </div>

                            {/* Dour */}
                            <div className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors border-l-4 border-l-indigo-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                        <TrendingUp size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Surah Al-Mulk <span className="text-xs font-normal text-muted-foreground ml-2">Full</span></div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Dour</div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full" />)}
                                    <div className="w-1 h-3 bg-muted rounded-full" />
                                </div>
                            </div>

                            {/* Manzil */}
                            <div className="group flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors border-l-4 border-l-purple-500">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">Juz 29 <span className="text-xs font-normal text-muted-foreground ml-2">P. 562-581</span></div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Manzil</div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500 text-[10px]">Complete</Badge>
                            </div>
                        </div>
                    </section>

                    {/* HEATMAP */}
                    <section>
                        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                            <Activity size={14} className="text-indigo-500" /> Consistency
                        </h2>
                        <Card className="border-indigo-500/20 bg-indigo-950/5">
                            <CardContent className="p-4">
                                <WeeklyHeatmap data={heatmapData} />
                            </CardContent>
                        </Card>
                    </section>

                </div>

                {/* RIGHT COL - STATS & LOGS (Size 4) */}
                <div className="md:col-span-4 space-y-6">

                    {/* TARGETS */}
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Velocities</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 space-y-4">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Sabak</span>
                                    <span className="text-muted-foreground">83%</span>
                                </div>
                                <Progress value={83} className="h-1.5" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Dour</span>
                                    <span className="text-muted-foreground">50%</span>
                                </div>
                                <Progress value={50} className="h-1.5 bg-muted" indicatorClassName="bg-indigo-500" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span>Manzil</span>
                                    <span className="text-muted-foreground">75%</span>
                                </div>
                                <Progress value={75} className="h-1.5 bg-muted" indicatorClassName="bg-purple-500" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ACTIVITY LOG - COMPACT */}
                    <Card>
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-medium">Log</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[200px]">
                                {[
                                    { time: "10:30 AM", title: "Finished Sabak", type: "sabak" },
                                    { time: "09:15 AM", title: "Dour Review", type: "dour" },
                                    { time: "Yesterday", title: "Manzil Missed", type: "missed" },
                                    { time: "2 Days ago", title: "Completed Juz 28", type: "milestone" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 text-xs border-b last:border-0">
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'missed' ? 'bg-red-500' : 'bg-indigo-500'}`} />
                                        <span className="flex-1 font-medium">{item.title}</span>
                                        <span className="text-muted-foreground text-[10px]">{item.time}</span>
                                    </div>
                                ))}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* WEAK AREAS */}
                    <Card className="border-red-500/10 bg-red-500/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 text-red-400 mb-2">
                                <AlertCircle size={14} />
                                <span className="text-xs font-bold uppercase">Focus Needed</span>
                            </div>
                            <div className="text-sm font-medium">Surah Al-Mursalat</div>
                            <div className="text-xs text-muted-foreground">Hesitation detected in last 3 sessions.</div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
