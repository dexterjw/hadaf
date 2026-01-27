import React, { useState } from 'react';
import { UserSettings, CompletionData } from '@/types/hafiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Heart,
    Flame,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Sparkles
} from 'lucide-react';
import { format } from 'date-fns';

interface HafizHealthyHeartDashboardProps {
    settings: UserSettings;
    stats: CompletionData;
}

type QualityState = 'solid' | 'shaky' | 'forgotten' | null;

// Mock data for Juz health (in real app, this would come from backend)
interface JuzHealth {
    juz: number;
    lastReviewed: number; // days ago
    quality: QualityState;
}

// Islamic Ayat about Quran for rotation
const inspirationalAyat = [
    "\"Indeed, it is We who sent down the Quran and indeed, We will be its guardian.\" - Al-Hijr 15:9",
    "\"And We have certainly made the Qur'an easy for remembrance.\" - Al-Qamar 54:17",
    "\"The month of Ramadan in which was revealed the Qur'an, a guidance for the people.\" - Al-Baqarah 2:185",
    "\"This is the Book about which there is no doubt, a guidance for those conscious of Allah.\" - Al-Baqarah 2:2",
];

export default function HafizHealthyHeartDashboard({ settings, stats }: HafizHealthyHeartDashboardProps) {
    const [sabakQuality, setSabakQuality] = useState<QualityState>(null);
    const [dourQuality, setDourQuality] = useState<QualityState>(null);
    const [healthMapExpanded, setHealthMapExpanded] = useState(false);

    // Current streak (mock data - would come from backend)
    const currentStreak = 12;

    // Rotate ayah based on day
    const today = new Date();
    const ayahIndex = today.getDate() % inspirationalAyat.length;
    const currentAyah = inspirationalAyat[ayahIndex];

    // Mock Juz health data
    const juzHealthData: JuzHealth[] = Array.from({ length: 30 }, (_, i) => ({
        juz: i + 1,
        lastReviewed: Math.floor(Math.random() * 20),
        quality: i % 5 === 0 ? 'shaky' : i % 7 === 0 ? null : 'solid'
    }));

    // Calculate health metrics
    const solidJuz = juzHealthData.filter(j => j.quality === 'solid' && j.lastReviewed <= 7).length;
    const fadingJuz = juzHealthData.filter(j => j.lastReviewed > 7).length;
    const shakyJuz = juzHealthData.filter(j => j.quality === 'shaky').length;
    const healthPercentage = Math.round((solidJuz / 30) * 100);

    // Weekly progress (mock data)
    const weeklyProgress = [
        { day: 'Mon', completed: true },
        { day: 'Tue', completed: true },
        { day: 'Wed', completed: true },
        { day: 'Thu', completed: true },
        { day: 'Fri', completed: true },
        { day: 'Sat', completed: false },
        { day: 'Sun', completed: false }, // Today
    ];

    const completedDays = weeklyProgress.filter(d => d.completed).length;
    const daysRemaining = 7 - completedDays;

    // Determine Juz tile color
    const getJuzTileColor = (juz: JuzHealth) => {
        if (juz.quality === 'shaky') {
            return 'border-2 border-red-500 bg-red-500/10';
        }
        if (juz.lastReviewed > 7) {
            return 'bg-muted-foreground/20 text-muted-foreground';
        }
        if (juz.quality === 'solid' && juz.lastReviewed <= 7) {
            return 'bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20';
        }
        return 'bg-secondary text-secondary-foreground';
    };

    // Quality button component
    const QualitySelector = ({
        value,
        onChange
    }: {
        value: QualityState;
        onChange: (quality: QualityState) => void
    }) => (
        <div className="flex gap-2 mt-3">
            {(['solid', 'shaky', 'forgotten'] as const).map((quality) => (
                <button
                    key={quality}
                    onClick={() => onChange(quality)}
                    className={`flex-1 px-3 py-2 text-xs rounded-lg font-medium transition-all ${value === quality
                            ? quality === 'solid'
                                ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50'
                                : quality === 'shaky'
                                    ? 'bg-amber-500/20 text-amber-400 border-2 border-amber-500/50'
                                    : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                            : 'bg-secondary/50 text-muted-foreground hover:bg-secondary border-2 border-transparent'
                        }`}
                >
                    {quality === 'solid' ? '🟢 Solid' : quality === 'shaky' ? '🟡 Shaky' : '🔴 Forgotten'}
                    <div className="text-[9px] opacity-70 mt-0.5">
                        {quality === 'solid' ? 'Fluent' : quality === 'shaky' ? 'Needs repair' : 'Re-memorize'}
                    </div>
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-8">

            {/* 1. HEADER: The Anchor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-light">
                        As-salamu alaykum, <span className="font-semibold text-primary">{settings.name}</span>
                    </h1>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Current Streak</span>
                            <span className="text-xl font-bold text-orange-500">{currentStreak} Days</span>
                        </div>
                    </div>
                </div>

                {/* The "Why" - Rotating Ayah */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 border border-primary/10">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                        {currentAyah}
                    </p>
                </div>
            </div>

            {/* 2. HERO SECTION: Today's Action (The Compass) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Card: The Advance (Sabak) */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 hover:border-primary/30 transition-all">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-1">Sabak</Badge>
                                    <CardTitle className="text-lg font-medium">The Advance</CardTitle>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Today's Goal</div>
                            <div className="text-xl font-semibold mt-1">Surah Al-Kahf</div>
                            <div className="text-sm text-muted-foreground">Ayah 1-5 (12 lines)</div>
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Ready to Recite?
                        </Button>
                    </CardContent>
                </Card>

                {/* Right Card: The Fortification (Dour/Manzil) */}
                <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-card via-card to-blue-500/5 hover:border-blue-500/30 transition-all">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] mb-1">Dour</Badge>
                                    <CardTitle className="text-lg font-medium">The Fortification</CardTitle>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="text-sm text-muted-foreground">Today's Review</div>
                            <div className="text-xl font-semibold mt-1">Juz 28</div>
                            <div className="text-sm text-muted-foreground">Pages 562-581 (30 lines)</div>
                        </div>

                        <div>
                            <div className="text-xs text-muted-foreground mb-2">How did your recitation feel?</div>
                            <QualitySelector value={dourQuality} onChange={setDourQuality} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 3. SECONDARY SECTION: Retention Health (The Pulse) */}
            <Card className="border border-border/50">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-rose-500" />
                            <CardTitle className="text-xl font-medium">Retention Health</CardTitle>
                        </div>
                        <Badge
                            variant="outline"
                            className={`text-sm px-3 py-1 ${healthPercentage >= 90
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                    : healthPercentage >= 70
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                                }`}
                        >
                            {healthPercentage}% Healthy
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* Summary Text */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="text-sm">
                            Your Hifdh Health is <span className="font-bold text-primary">{healthPercentage}%</span>.{' '}
                            {fadingJuz + shakyJuz > 0 && (
                                <span className="text-amber-400 font-medium">
                                    {fadingJuz + shakyJuz} {fadingJuz + shakyJuz === 1 ? 'Juz is' : 'Juz are'} at risk.
                                </span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setHealthMapExpanded(!healthMapExpanded)}
                            className="gap-2"
                        >
                            {healthMapExpanded ? (
                                <>Collapse <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>Expand <ChevronDown className="w-4 h-4" /></>
                            )}
                        </Button>
                    </div>

                    {/* Health Map - Islamic Geometric Tiles */}
                    {healthMapExpanded && (
                        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 p-4 rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 border border-border/30">
                            {juzHealthData.map((juz) => (
                                <div
                                    key={juz.juz}
                                    className={`
                                        aspect-square rounded-lg flex items-center justify-center
                                        text-xs font-bold transition-all duration-300 cursor-pointer
                                        hover:scale-110 hover:shadow-xl
                                        ${getJuzTileColor(juz)}
                                    `}
                                    title={`Juz ${juz.juz}: ${juz.quality || 'Not reviewed'} (${juz.lastReviewed} days ago)`}
                                >
                                    {juz.juz}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Call to Action */}
                    {(fadingJuz > 0 || shakyJuz > 0) && (
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
                            <span className="text-sm text-blue-400">
                                📖 Review {fadingJuz > 0 ? fadingJuz : shakyJuz} {fadingJuz > 0 ? 'fading' : 'shaky'} {fadingJuz > 0 ? (fadingJuz === 1 ? 'Juz' : 'Juz') : (shakyJuz === 1 ? 'Juz' : 'Juz')} to restore full health
                            </span>
                            <Button size="sm" variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                                Start Review
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 4. FOOTER: Weekly Context */}
            <Card className="border border-border/50">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium">This Week's Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        {/* Week View - 7 Dots */}
                        <div className="flex items-center gap-3">
                            {weeklyProgress.map((day, index) => (
                                <div key={index} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`
                                            w-10 h-10 rounded-full flex items-center justify-center
                                            transition-all duration-300 font-medium text-xs
                                            ${day.completed
                                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                                : 'bg-secondary/50 text-muted-foreground border-2 border-dashed border-border'
                                            }
                                        `}
                                    >
                                        {day.completed ? '✓' : ''}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground uppercase">{day.day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Weekly Target */}
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-sm text-muted-foreground">Weekly Goal</div>
                            <div className="text-2xl font-bold text-primary">{completedDays}/7 Days</div>
                            <div className="text-xs text-muted-foreground">
                                {daysRemaining > 0 ? `${daysRemaining} days left to complete` : 'Goal reached! 🎉'}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <Progress value={(completedDays / 7) * 100} className="h-2" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
