import React from 'react';
import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { WeeklyHeatmap } from '../charts/WeeklyHeatmap';
import {
    Flame,
    CheckCircle2,
    Clock,
    Calendar,
    ArrowRight,
    Target,
    Activity,
    BookOpen,
    History,
    TrendingUp,
    AlertCircle,
    Map
} from 'lucide-react';
import { format } from 'date-fns';

interface Dash7ListProps {
    settings: UserSettings;
    stats: CompletionData;
}

export default function Dash7List({ settings, stats }: Dash7ListProps) {
    const today = format(new Date(), 'EEEE, MMMM do');

    // Mock Data for "Mini Heatmap" - ideally passed down or fetched
    const heatmapData = Array.from({ length: 28 }, (_, i) => ({
        date: format(new Date(Date.now() - (27 - i) * 86400000), 'MMM d'),
        intensity: Math.floor(Math.random() * 5),
        verses: Math.floor(Math.random() * 20),
    }));

    // Mock Coverage Data (Grid of 30 Juz)
    const juzData = Array.from({ length: 30 }, (_, i) => ({
        juz: i + 1,
        status: i < 5 ? 'strong' : i < 10 ? 'weak' : 'new'
    }));

    const getJuzColor = (status: string) => {
        if (status === 'strong') return "bg-emerald-500/80 hover:bg-emerald-500";
        if (status === 'weak') return "bg-amber-500/80 hover:bg-amber-500";
        return "bg-secondary hover:bg-secondary/80";
    };

    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 pb-20">

            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-light tracking-tight text-foreground">
                        Salam, <span className="font-semibold">{settings.name}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {today}
                    </p>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-medium italic text-muted-foreground">
                        "The most beloved deed to Allah is the most regular and constant even if it were little."
                    </p>
                </div>
            </div>

            <Separator className="bg-border/40" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">

                {/* LEFT COLUMN: Main Focus Area (Span 8) */}
                <div className="col-span-1 md:col-span-8 space-y-6">

                    {/* 1. Today's Focus Panel */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" /> Today's Focus
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Sabak */}
                            <Card className="border-l-4 border-l-primary bg-card/50 hover:bg-card transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Sabak</Badge>
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                                    </div>
                                    <CardTitle className="text-xl mt-2">Surah An-Naba</CardTitle>
                                    <CardDescription>Ayah 1-10</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button size="sm" className="w-full mt-2" variant="secondary">Start</Button>
                                </CardContent>
                            </Card>

                            {/* Dour */}
                            <Card className="border-l-4 border-l-blue-500 bg-card/50 hover:bg-card transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Dour</Badge>
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground hover:text-blue-500 cursor-pointer transition-colors" />
                                    </div>
                                    <CardTitle className="text-xl mt-2">Juz 29</CardTitle>
                                    <CardDescription>Recent Revision</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button size="sm" className="w-full mt-2" variant="secondary">Start</Button>
                                </CardContent>
                            </Card>

                            {/* Manzil */}
                            <Card className="border-l-4 border-l-purple-500 bg-card/50 hover:bg-card transition-all">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">Manzil</Badge>
                                        <CheckCircle2 className="w-5 h-5 text-muted-foreground hover:text-purple-500 cursor-pointer transition-colors" />
                                    </div>
                                    <CardTitle className="text-xl mt-2">Juz 1-2</CardTitle>
                                    <CardDescription>Cycle Revision</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button size="sm" className="w-full mt-2" variant="secondary">Start</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>

                    {/* 2. Consistency Tracker */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Flame className="w-5 h-5 text-orange-500" /> Consistency Tracker
                        </h2>
                        <Card className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                                <div className="p-6 md:w-1/4 border-b md:border-b-0 md:border-r border-border/50 flex flex-col justify-center items-center bg-accent/5">
                                    <div className="text-4xl font-bold text-orange-500">12</div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium mt-1">Day Streak</div>
                                </div>
                                <div className="flex-1 p-2 h-[160px]">
                                    {/* Reusing existing heatmap logic but simplified/constrained container */}
                                    <WeeklyHeatmap data={heatmapData} />
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* 5. Coverage Map (Moved here for better layout balance) */}
                    <section>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Map className="w-5 h-5 text-blue-400" /> Coverage Map
                        </h2>
                        <Card className="p-6">
                            <div className="grid grid-cols-10 gap-2">
                                {juzData.map((j) => (
                                    <div
                                        key={j.juz}
                                        className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium cursor-pointer transition-transform hover:scale-110 ${getJuzColor(j.status)}`}
                                        title={`Juz ${j.juz}`}
                                    >
                                        {j.juz}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 mt-4 justify-end text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500/80"></div> Strong</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500/80"></div> Weak</div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div> Not Started</div>
                            </div>
                        </Card>
                    </section>

                </div>

                {/* RIGHT COLUMN: Stats & History (Span 4) */}
                <div className="col-span-1 md:col-span-4 space-y-6">

                    {/* 3. Weekly Overview */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" /> Weekly Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Completion Balance</span>
                                        <span className="font-bold">85%</span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                        <div className="text-2xl font-bold">140</div>
                                        <div className="text-xs text-muted-foreground">Verses</div>
                                    </div>
                                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                                        <div className="text-2xl font-bold">12hrs</div>
                                        <div className="text-xs text-muted-foreground">Focus Time</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Quality Signals */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Activity className="w-5 h-5 text-rose-500" /> Quality Signals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-sm">
                                    92%
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">Retention Score</div>
                                    <div className="text-xs text-muted-foreground">Based on last 3 revisions</div>
                                </div>
                            </div>

                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-sm font-semibold text-red-500">Weak Area Alert</div>
                                    <div className="text-xs text-muted-foreground leading-snug">
                                        Juz 28, Pages 540-545 require immediate attention.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 6. History & Reflection */}
                    <Card className="flex-1">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="w-5 h-5" /> Quick Log
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-sm text-muted-foreground italic">
                                    "Struggled a bit with Ayah 7 tajweed today, but managed to fix it."
                                </div>
                                <Button variant="outline" size="sm" className="w-full justify-start text-muted-foreground">
                                    <BookOpen className="w-4 h-4 mr-2" /> Add Journal Entry
                                </Button>
                                <Separator />
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="text-sm">
                                            <div className="font-medium text-xs text-muted-foreground mb-1">Yesterday</div>
                                            <div>Completed revision of Surah Mulk.</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
