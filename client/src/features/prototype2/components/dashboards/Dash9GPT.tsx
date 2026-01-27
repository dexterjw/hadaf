import React, { useState } from 'react';
import { UserSettings, CompletionData } from '@/features/prototype2/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    Play,
    CheckCircle2,
    Circle,
    Calendar,
    Flame,
    TrendingUp,
    TrendingDown,
    Minus,
    AlertTriangle,
    Clock,
    BookOpen,
    ChevronRight,
    Thermometer
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface Dash9GPTProps {
    settings: UserSettings;
    stats: CompletionData;
}

// Types for micro-reflections
type Feeling = 'easy' | 'ok' | 'hard' | null;
type Mistakes = 'few' | 'some' | 'many' | null;

interface TaskState {
    completed: boolean;
    feeling: Feeling;
    mistakes: Mistakes;
}

export default function Dash9GPT({ settings, stats }: Dash9GPTProps) {
    const today = new Date();
    const startDate = new Date(settings.startDate);
    const dayOfPlan = differenceInDays(today, startDate) + 1;

    // Task states
    const [sabak, setSabak] = useState<TaskState>({ completed: false, feeling: null, mistakes: null });
    const [dour, setDour] = useState<TaskState>({ completed: false, feeling: null, mistakes: null });
    const [manzil, setManzil] = useState<TaskState>({ completed: false, feeling: null, mistakes: null });

    // Determine status
    const getStatus = () => {
        const completedCount = [sabak.completed, dour.completed, manzil.completed].filter(Boolean).length;
        if (completedCount === 3) return { label: 'Complete', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
        if (completedCount >= 1) return { label: 'In Progress', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };

        // Check if behind based on current progress
        const expectedPage = Math.floor((dayOfPlan * settings.dailyGoalPages) + settings.startPage);
        if (settings.currentPage < expectedPage - 5) {
            return { label: 'Slightly behind', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
        }
        if (settings.currentPage >= expectedPage) {
            return { label: 'On track', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
        }
        return { label: 'On track', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    };

    const status = getStatus();

    // Focus type for today (alternates based on day)
    const focusType = dayOfPlan % 3 === 0 ? 'Retention Day' : dayOfPlan % 3 === 1 ? 'Build + Review Day' : 'Consolidation Day';

    // Mock data for weekly rhythm
    const weeklyRhythm = [
        { day: 'M', completed: 3, quality: 'easy' },
        { day: 'T', completed: 2, quality: 'ok' },
        { day: 'W', completed: 3, quality: 'ok' },
        { day: 'T', completed: 1, quality: 'hard' },
        { day: 'F', completed: 3, quality: 'easy' },
        { day: 'S', completed: 0, quality: null },
        { day: 'S', completed: 0, quality: null }, // Today placeholder
    ];

    // Mock retention data
    const errorTrend = 'down'; // 'up' | 'down' | 'flat'
    const hardSpots = [
        { surah: 'Al-Baqarah', lines: '255-265' },
        { surah: 'Al-Imran', lines: '18-25' },
    ];

    // Manzil slices (7 parts)
    const manzilSlices = [
        { part: 1, lastReviewed: 2, overdue: false },
        { part: 2, lastReviewed: 5, overdue: false },
        { part: 3, lastReviewed: 8, overdue: true },
        { part: 4, lastReviewed: 1, overdue: false },
        { part: 5, lastReviewed: 14, overdue: true },
        { part: 6, lastReviewed: 3, overdue: false },
        { part: 7, lastReviewed: 6, overdue: false },
    ];

    const overdueCount = manzilSlices.filter(s => s.overdue).length;

    // Recent activity log
    const activityLog = [
        { type: 'Sabak', lines: 12, feeling: 'ok', mistakes: 'few' },
        { type: 'Dour', lines: 30, feeling: 'easy', mistakes: 'few' },
        { type: 'Manzil', lines: 80, feeling: 'hard', mistakes: 'some' },
        { type: 'Sabak', lines: 10, feeling: 'easy', mistakes: 'few' },
        { type: 'Dour', lines: 25, feeling: 'ok', mistakes: 'some' },
    ];

    // Helper for ring balance visual
    const RingBalance = () => {
        const total = 3;
        const completed = [sabak.completed, dour.completed, manzil.completed].filter(Boolean).length;
        const missing = total - completed;

        return (
            <div className="flex items-center justify-center gap-1">
                {[sabak, dour, manzil].map((task, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${task.completed
                                ? i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'
                                : 'bg-muted-foreground/20'
                            }`}
                    />
                ))}
                {missing > 0 && (
                    <span className="text-[10px] text-muted-foreground ml-2">
                        {missing === 1 ? 'Almost there' : missing === 2 ? 'Keep going' : 'Start fresh'}
                    </span>
                )}
            </div>
        );
    };

    // Feeling button component
    const FeelingButtons = ({ value, onChange }: { value: Feeling; onChange: (f: Feeling) => void }) => (
        <div className="flex gap-1 mt-2">
            {(['easy', 'ok', 'hard'] as Feeling[]).map((f) => (
                <button
                    key={f}
                    onClick={() => onChange(f)}
                    className={`px-2 py-0.5 text-[10px] rounded-full transition-all ${value === f
                            ? f === 'easy' ? 'bg-emerald-500/20 text-emerald-400'
                                : f === 'ok' ? 'bg-amber-500/20 text-amber-400'
                                    : 'bg-red-500/20 text-red-400'
                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                        }`}
                >
                    {f === 'easy' ? 'Easy' : f === 'ok' ? 'OK' : 'Hard'}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500 pb-8">

            {/* 0) Top Bar */}
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/30">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{format(today, 'EEEE, MMM d')}</span>
                        <span className="text-foreground/60">•</span>
                        <span className="text-foreground font-medium">Day {dayOfPlan} of plan</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`${status.color} text-xs px-3 py-1`}>
                        {status.label}
                    </Badge>
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                        <Play className="w-3.5 h-3.5" />
                        Start today's session
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: Hero + Supporting Panels */}
                <div className="lg:col-span-8 space-y-6">

                    {/* 1) Today's Focus - Hero Card */}
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-medium">Today's Focus</CardTitle>
                                <RingBalance />
                            </div>
                            <p className="text-sm text-primary font-medium mt-1">
                                Today is a <span className="underline underline-offset-2">{focusType}</span>
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Sabak */}
                            <div className={`p-4 rounded-xl border transition-all ${sabak.completed ? 'bg-primary/5 border-primary/30' : 'bg-card/50 border-border/50 hover:border-border'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => setSabak(s => ({ ...s, completed: !s.completed }))}
                                            className="mt-0.5"
                                        >
                                            {sabak.completed
                                                ? <CheckCircle2 className="w-5 h-5 text-primary" />
                                                : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                                            }
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Sabak</Badge>
                                                <span className="text-sm font-medium">Memorize 12 lines</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Sūrah Al-Mulk, lines 40–52</p>
                                            {sabak.completed && <FeelingButtons value={sabak.feeling} onChange={(f) => setSabak(s => ({ ...s, feeling: f }))} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dour */}
                            <div className={`p-4 rounded-xl border transition-all ${dour.completed ? 'bg-blue-500/5 border-blue-500/30' : 'bg-card/50 border-border/50 hover:border-border'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => setDour(s => ({ ...s, completed: !s.completed }))}
                                            className="mt-0.5"
                                        >
                                            {dour.completed
                                                ? <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                                : <Circle className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
                                            }
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px]">Dour</Badge>
                                                <span className="text-sm font-medium">Review 30 lines</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Juz 29, lines 120–150</p>
                                            {dour.completed && <FeelingButtons value={dour.feeling} onChange={(f) => setDour(s => ({ ...s, feeling: f }))} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Manzil */}
                            <div className={`p-4 rounded-xl border transition-all ${manzil.completed ? 'bg-purple-500/5 border-purple-500/30' : 'bg-card/50 border-border/50 hover:border-border'}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => setManzil(s => ({ ...s, completed: !s.completed }))}
                                            className="mt-0.5"
                                        >
                                            {manzil.completed
                                                ? <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                                : <Circle className="w-5 h-5 text-muted-foreground hover:text-purple-500 transition-colors" />
                                            }
                                        </button>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 text-[10px]">Manzil</Badge>
                                                <span className="text-sm font-medium">Manzil rotation: 1/7 (80 lines)</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">Long-horizon retention cycle</p>
                                            {manzil.completed && <FeelingButtons value={manzil.feeling} onChange={(f) => setManzil(s => ({ ...s, feeling: f }))} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Adjustment suggestion - only show if behind */}
                            {status.label === 'Slightly behind' && (
                                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>Suggested: Keep Sabak same, reduce Dour by 10 lines today</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 2) Consistency & Momentum */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Flame className="w-4 h-4 text-orange-500" />
                                Consistency & Momentum
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-orange-500">6</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Current Streak</div>
                                    <div className="text-[10px] text-muted-foreground mt-0.5">Best: 12</div>
                                </div>
                                <Separator orientation="vertical" className="h-12" />
                                <div className="flex-1">
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">7-Day Rhythm</div>
                                    <div className="flex gap-2">
                                        {weeklyRhythm.map((day, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <div
                                                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-medium transition-all ${day.completed === 3
                                                            ? day.quality === 'easy' ? 'bg-emerald-500/80 text-white' : day.quality === 'ok' ? 'bg-amber-500/80 text-white' : 'bg-red-500/80 text-white'
                                                            : day.completed === 2
                                                                ? 'bg-secondary/80 text-muted-foreground'
                                                                : day.completed === 1
                                                                    ? 'bg-secondary/40 text-muted-foreground/60'
                                                                    : 'bg-secondary/20 text-muted-foreground/40'
                                                        }`}
                                                >
                                                    {day.completed === 3 ? '●' : day.completed === 2 ? '◐' : day.completed === 1 ? '○' : ''}
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{day.day}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3) This Week: Targets vs Reality */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                This Week: Targets vs Reality
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {/* Sabak */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Sabak</span>
                                        <span className="font-medium">48/60 lines</span>
                                    </div>
                                    <Progress value={80} className="h-1.5" />
                                    <div className="text-[10px] text-emerald-400">On pace</div>
                                </div>
                                {/* Dour */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Dour</span>
                                        <span className="font-medium">120/180 lines</span>
                                    </div>
                                    <Progress value={67} className="h-1.5" />
                                    <div className="text-[10px] text-amber-400">Needs 1 extra session</div>
                                </div>
                                {/* Manzil */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Manzil</span>
                                        <span className="font-medium">320/400 lines</span>
                                    </div>
                                    <Progress value={80} className="h-1.5" />
                                    <div className="text-[10px] text-emerald-400">On pace</div>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
                                If you complete today's plan, you'll be back on pace by Friday.
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Supporting Panels */}
                <div className="lg:col-span-4 space-y-6">

                    {/* 4) Retention Signals */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-rose-500" />
                                Retention Signals
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Error Trend */}
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${errorTrend === 'down' ? 'bg-emerald-500/10' : errorTrend === 'up' ? 'bg-red-500/10' : 'bg-secondary/50'
                                    }`}>
                                    {errorTrend === 'down' ? <TrendingDown className="w-4 h-4 text-emerald-500" /> :
                                        errorTrend === 'up' ? <TrendingUp className="w-4 h-4 text-red-500" /> :
                                            <Minus className="w-4 h-4 text-muted-foreground" />}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">Mistakes trending {errorTrend}</div>
                                    <div className="text-[10px] text-muted-foreground">Last 7 days</div>
                                </div>
                            </div>

                            {/* Hard Spots */}
                            <div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Hard Spots</div>
                                <div className="space-y-1.5">
                                    {hardSpots.map((spot, i) => (
                                        <div key={i} className="text-xs px-2 py-1.5 bg-secondary/30 rounded-md flex items-center justify-between">
                                            <span>{spot.surah}, {spot.lines}</span>
                                            <span className="text-orange-400">Warm</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recovery suggestion */}
                            <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
                                Tomorrow: Re-hit weak range first (15 lines)
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5) Manzil Coverage */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-500" />
                                Manzil Coverage
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* 7-slice wheel visualization */}
                            <div className="flex justify-center mb-4">
                                <div className="relative w-24 h-24">
                                    {manzilSlices.map((slice, i) => {
                                        const angle = (i * 360) / 7 - 90;
                                        const radian = (angle * Math.PI) / 180;
                                        const x = 48 + 32 * Math.cos(radian);
                                        const y = 48 + 32 * Math.sin(radian);
                                        return (
                                            <div
                                                key={i}
                                                className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-all ${slice.overdue
                                                        ? 'bg-red-500/80 text-white animate-pulse'
                                                        : 'bg-purple-500/30 text-purple-400'
                                                    }`}
                                                style={{ left: x - 10, top: y - 10 }}
                                                title={`Part ${slice.part}: ${slice.lastReviewed} days ago`}
                                            >
                                                {slice.part}
                                            </div>
                                        );
                                    })}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-[10px] text-muted-foreground">
                                            1/7
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {overdueCount > 0 && (
                                <div className="text-xs text-center text-red-400">
                                    {overdueCount} {overdueCount === 1 ? 'slice' : 'slices'} overdue
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 6) Activity Log */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <BookOpen className="w-4 h-4" />
                                    Activity Log
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                                    Add <ChevronRight className="w-3 h-3 ml-1" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {activityLog.slice(0, 5).map((entry, i) => (
                                    <div key={i} className="text-xs flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${entry.type === 'Sabak' ? 'border-primary/30 text-primary' :
                                                    entry.type === 'Dour' ? 'border-blue-500/30 text-blue-500' :
                                                        'border-purple-500/30 text-purple-500'
                                                }`}>
                                                {entry.type}
                                            </Badge>
                                            <span className="text-muted-foreground">{entry.lines} lines</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <span className={`w-1.5 h-1.5 rounded-full ${entry.feeling === 'easy' ? 'bg-emerald-500' :
                                                    entry.feeling === 'ok' ? 'bg-amber-500' : 'bg-red-500'
                                                }`} />
                                            <span className="capitalize">{entry.feeling}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
