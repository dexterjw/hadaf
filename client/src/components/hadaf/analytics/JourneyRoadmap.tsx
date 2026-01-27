import React, { useState } from 'react';
import { UserSettings, CompletionData } from '@/types/hafiz';
import { Flag, Zap, Layers, MapPin, Mountain, Navigation, Moon, Star, TrendingUp, CircleDot, Check, ChevronRight, Sparkles, ArrowUpRight, Tornado, Activity, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JourneyRoadmapSidebarProps {
    settings: UserSettings;
    stats: CompletionData;
}

type VariationTab = 'timeline' | 'gps' | 'elevation' | 'constellation' | 'spiral' | 'echo' | 'focus';

const stages = [
    {
        id: 1,
        name: "The Foundation",
        subtitle: "Al-Ta'sis",
        range: [1, 10] as [number, number],
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        gradient: "from-emerald-500/20 to-emerald-500/5",
        accent: "#34d399",
        icon: Layers
    },
    {
        id: 2,
        name: "The Momentum",
        subtitle: "Al-Inqilaq",
        range: [11, 20] as [number, number],
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        gradient: "from-blue-500/20 to-blue-500/5",
        accent: "#60a5fa",
        icon: Zap
    },
    {
        id: 3,
        name: "The Mastery",
        subtitle: "Al-Itqan",
        range: [21, 30] as [number, number],
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        gradient: "from-purple-500/20 to-purple-500/5",
        accent: "#a78bfa",
        icon: Flag
    }
];

const variationTabs: { id: VariationTab; label: string; icon: React.ElementType }[] = [
    { id: 'timeline', label: 'Timeline', icon: CircleDot },
    { id: 'gps', label: 'GPS', icon: Navigation },
    { id: 'elevation', label: 'Elevation', icon: TrendingUp },
    { id: 'constellation', label: 'Stars', icon: Moon },
    { id: 'spiral', label: 'Spiral', icon: Tornado },
    { id: 'echo', label: 'Echo', icon: Activity },
    { id: 'focus', label: 'Focus', icon: Target },
];

// ============================================
// VARIATION 1: Vertical Timeline
// ============================================
const TimelineVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    return (
        <div className="relative py-4">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/30 via-blue-500/30 to-purple-500/30" />

            {/* Progress Line (animated) */}
            <motion.div
                className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500"
                initial={{ height: 0 }}
                animate={{ height: `${Math.min(100, ((currentJuz - 1) / 29) * 100)}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <div className="space-y-6">
                {stages.map((stage, i) => {
                    const isActive = currentJuz >= stage.range[0] && currentJuz <= stage.range[1];
                    const isPast = currentJuz > stage.range[1];
                    const stageProgress = isPast ? 100 : isActive
                        ? ((currentJuz - stage.range[0]) / (stage.range[1] - stage.range[0] + 1)) * 100
                        : 0;

                    return (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className="relative pl-14"
                        >
                            {/* Node */}
                            <div className={`
                                absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                ${isPast ? 'bg-foreground border-foreground' : isActive ? 'bg-card border-foreground' : 'bg-card border-muted-foreground/30'}
                                transition-all duration-300
                            `}>
                                {isPast ? (
                                    <Check size={10} className="text-background" />
                                ) : isActive ? (
                                    <motion.div
                                        className="w-2 h-2 rounded-full bg-foreground"
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                    />
                                ) : null}
                            </div>

                            {/* Content Card */}
                            <div className={`
                                p-4 rounded-2xl border transition-all duration-300
                                ${isActive ? 'bg-card border-border shadow-lg ring-1 ring-ring/20' : isPast ? 'bg-card/30 border-border/50' : 'bg-card/20 border-border/30'}
                            `}>
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className={`text-sm font-bold ${stage.color}`}>{stage.subtitle}</div>
                                        <h4 className={`text-base font-bold ${isPast ? 'text-muted-foreground' : 'text-foreground'}`}>
                                            {stage.name}
                                        </h4>
                                    </div>
                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${stage.bg} ${stage.color}`}>
                                        <stage.icon size={16} />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-3">
                                    <motion.div
                                        className={`h-full rounded-full`}
                                        style={{ backgroundColor: stage.accent }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stageProgress}%` }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                    />
                                </div>

                                {/* Juz Grid - Compact */}
                                <div className="grid grid-cols-10 gap-1">
                                    {Array.from({ length: 10 }).map((_, idx) => {
                                        const juzNum = stage.range[0] + idx;
                                        const jStatus = juzNum < currentJuz ? 'done' : juzNum === currentJuz ? 'current' : 'todo';

                                        return (
                                            <div
                                                key={juzNum}
                                                className={`
                                                    aspect-square rounded flex items-center justify-center text-[8px] font-bold
                                                    ${jStatus === 'done' ? 'bg-foreground/10 text-foreground/60' : ''}
                                                    ${jStatus === 'current' ? 'bg-foreground text-background shadow-sm' : ''}
                                                    ${jStatus === 'todo' ? 'bg-muted/30 text-muted-foreground/30' : ''}
                                                `}
                                            >
                                                {juzNum}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================
// VARIATION 2: GPS-Style Journey Map
// ============================================
const GPSVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    const getCurrentStage = () => {
        if (currentJuz <= 10) return 0;
        if (currentJuz <= 20) return 1;
        return 2;
    };
    const currentStageIdx = getCurrentStage();

    return (
        <div className="relative py-4">
            {/* Route Overview */}
            <div className="mb-6 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-border">
                <div className="flex items-center gap-2 mb-1">
                    <Navigation size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Route Navigation</span>
                </div>
                <div className="text-lg font-bold text-foreground">Juz {currentJuz} of 30</div>
                <div className="text-xs text-muted-foreground">~{30 - currentJuz} checkpoints remaining</div>
            </div>

            {/* Route Path */}
            <div className="space-y-3">
                {stages.map((stage, i) => {
                    const isActive = currentJuz >= stage.range[0] && currentJuz <= stage.range[1];
                    const isPast = currentJuz > stage.range[1];
                    const isFuture = currentJuz < stage.range[0];

                    return (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            {/* Turn Indicator */}
                            <div className={`
                                flex items-center gap-3 p-4 rounded-2xl border transition-all
                                ${isActive ? 'bg-gradient-to-r from-card via-card to-transparent border-border shadow-lg' : 'bg-card/30 border-border/50'}
                            `}>
                                {/* Location Pin */}
                                <div className={`
                                    relative w-12 h-12 rounded-2xl flex items-center justify-center
                                    ${isActive ? 'bg-blue-500' : isPast ? 'bg-foreground/20' : 'bg-muted/50'}
                                `}>
                                    {isActive ? (
                                        <>
                                            <MapPin size={20} className="text-white" />
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                                                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                            />
                                        </>
                                    ) : isPast ? (
                                        <Check size={20} className="text-foreground" />
                                    ) : (
                                        <CircleDot size={20} className="text-muted-foreground/50" />
                                    )}
                                </div>

                                {/* Destination Info */}
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? stage.color : 'text-muted-foreground'}`}>
                                        {isPast ? 'Completed' : isActive ? 'Currently in' : 'Upcoming'}
                                    </div>
                                    <div className={`text-base font-bold truncate ${isFuture ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                                        {stage.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Juz {stage.range[0]} – {stage.range[1]}
                                    </div>
                                </div>

                                {/* Distance/Progress */}
                                <div className="text-right">
                                    {isActive && (
                                        <div className="text-2xl font-bold text-foreground">
                                            {currentJuz - stage.range[0] + 1}<span className="text-sm text-muted-foreground">/10</span>
                                        </div>
                                    )}
                                    {isPast && (
                                        <div className="text-sm font-bold text-emerald-400">✓ Done</div>
                                    )}
                                    {isFuture && (
                                        <div className="text-sm text-muted-foreground/50">{stage.range[0] - currentJuz} away</div>
                                    )}
                                </div>
                            </div>

                            {/* Connecting Road */}
                            {i < stages.length - 1 && (
                                <div className="flex items-center gap-2 py-2 pl-6">
                                    <div className={`flex-1 h-0.5 ${i < currentStageIdx ? 'bg-foreground/20' : 'bg-border'}`}
                                        style={{ backgroundImage: i < currentStageIdx ? '' : 'repeating-linear-gradient(90deg, transparent, transparent 6px, var(--border) 6px, var(--border) 12px)' }}
                                    />
                                    <ChevronRight size={14} className={i < currentStageIdx ? 'text-foreground/40' : 'text-muted-foreground/30'} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* ETA Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-border"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Final Destination</div>
                        <div className="text-sm font-bold text-foreground">Complete Hifz</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{30 - currentJuz + 1}</div>
                        <div className="text-[10px] text-muted-foreground">juz remaining</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ============================================
// VARIATION 3: Elevation (Refined Climb)
// ============================================
const ElevationVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    // Current altitude derived from current Juz (1-30 scale mapped to 0-100%)
    const altitude = ((currentJuz - 1) / 29) * 100;

    return (
        <div className="relative py-4">
            {/* Altimeter Visualization */}
            <div className="relative mb-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-border overflow-hidden shadow-2xl">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Vertical Elevation Scale */}
                <div className="flex items-end justify-between relative z-10 h-64">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between h-full py-4 text-[10px] font-mono text-muted-foreground/50">
                        <span>30 JUZ</span>
                        <span>20 JUZ</span>
                        <span>10 JUZ</span>
                        <span>START</span>
                    </div>

                    {/* Gradient Curve Graph Area */}
                    <div className="relative flex-1 mx-4 h-full border-l border-b border-foreground/10">
                        {/* Ascent Path */}
                        <svg className="absolute inset-0 w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="elevationGradient" x1="0" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.5" />
                                </linearGradient>
                            </defs>
                            {/* Smooth Bezier Curve representing ideal path */}
                            <path d="M0,256 C50,250 100,150 180,0" fill="none" stroke="url(#elevationGradient)" strokeWidth="4" strokeLinecap="round" className="opacity-30" />

                            {/* Current Progress Area Fill */}
                            <motion.path
                                d={`M0,256 L0,${256 - (altitude * 2.56)}`}
                                stroke="#fff"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                className="opacity-50"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5 }}
                            />

                            {/* Current Position Point */}
                            <motion.circle
                                cx="0"
                                cy={256 - (altitude * 2.56)}
                                r="6"
                                fill="#fff"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, cx: 30 }} // Slight x offset for visual flair
                                transition={{ duration: 1.5, delay: 0.2 }}
                            />
                        </svg>

                        {/* Current Stats Floating Box */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-xl"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp size={14} className="text-emerald-400" />
                                <span className="text-[10px] uppercase font-bold text-white/80">Current Altitude</span>
                            </div>
                            <div className="text-2xl font-bold text-white tabular-nums">{Math.round(altitude)}%</div>
                            <div className="text-[10px] text-white/60">Ascending...</div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stages Grid (Glassmorphism Cards) */}
            <div className="grid grid-cols-1 gap-3">
                {stages.map((stage, i) => {
                    const isActive = currentJuz >= stage.range[0] && currentJuz <= stage.range[1];
                    const isPast = currentJuz > stage.range[1];
                    const isFuture = currentJuz < stage.range[0];

                    return (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className={`
                                relative overflow-hidden p-4 rounded-xl border transition-all duration-300
                                ${isActive ? 'bg-gradient-to-r from-card to-card/50 border-foreground/20 shadow-lg scale-[1.02]' : 'bg-card/20 border-border/40 hover:bg-card/40'}
                            `}
                        >
                            {/* Background Pattern for Active */}
                            {isActive && <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${stage.gradient} opacity-20 blur-2xl rounded-bl-full`} />}

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center border
                                        ${isActive ? `bg-foreground text-background border-foreground` : isPast ? `${stage.bg} ${stage.color} border-transparent` : 'bg-muted/10 text-muted-foreground border-transparent'}
                                    `}>
                                        <stage.icon size={18} />
                                    </div>
                                    <div>
                                        <div className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? stage.color : 'text-muted-foreground'}`}>
                                            Stage 0{stage.id}
                                        </div>
                                        <div className={`font-bold ${isPast ? 'text-muted-foreground line-through decoration-foreground/20' : 'text-foreground'}`}>
                                            {stage.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    {isActive && (
                                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                            <ArrowUpRight size={12} /> Active
                                        </div>
                                    )}
                                    {isPast && <Check size={16} className="text-muted-foreground" />}
                                    {isFuture && <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================
// VARIATION 4: Constellation (Replaces Stones)
// ============================================
const ConstellationVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    return (
        <div className="relative py-4">
            {/* Deep Space Container */}
            <div className="relative min-h-[500px] bg-[#0c0c14] rounded-3xl border border-white/5 overflow-hidden shadow-2xl p-6">

                {/* Space Background Effects */}
                <div className="absolute inset-0">
                    {/* Nebulas */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,rgba(168,85,247,0.1),transparent_50%)]" />

                    {/* Twinkling Stars Background */}
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-0.5 h-0.5 bg-white rounded-full"
                            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 + Math.random() * 3, delay: Math.random() * 2 }}
                        />
                    ))}
                </div>

                {/* Constellation Header */}
                <div className="relative z-10 flex items-center justify-between mb-8">
                    <div>
                        <h4 className="text-white font-display font-medium text-lg tracking-wide">The Constellation</h4>
                        <p className="text-indigo-300/50 text-xs">Juz {currentJuz} is currently shining</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Moon size={14} />
                    </div>
                </div>

                {/* Constellation Path */}
                <div className="relative z-10 space-y-12 pl-4">
                    {/* Connecting Line running through everything */}
                    <div className="absolute left-[31px] top-12 bottom-12 w-0.5 bg-gradient-to-b from-emerald-500/20 via-blue-500/20 to-purple-500/20" />

                    {stages.map((stage, stageIdx) => {
                        const isActiveStage = currentJuz >= stage.range[0] && currentJuz <= stage.range[1];

                        return (
                            <div key={stage.id} className="relative">
                                {/* Stage Label */}
                                <div className="absolute -left-4 -top-6 text-[10px] uppercase font-bold tracking-widest text-white/30 transform -rotate-90 origin-bottom-right">
                                    {stage.subtitle}
                                </div>

                                <motion.div
                                    className="relative grid grid-cols-5 gap-y-6 gap-x-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: stageIdx * 0.3 }}
                                >
                                    {Array.from({ length: 10 }).map((_, idx) => {
                                        const juzNum = stage.range[0] + idx;
                                        const isPast = juzNum < currentJuz;
                                        const isCurrent = juzNum === currentJuz;

                                        return (
                                            <div key={juzNum} className="relative flex flex-col items-center group">
                                                {/* Connecting lines between stars (visual only) */}
                                                {idx < 9 && <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white/5 -z-10" style={{ transform: 'translate(50%, 0)' }} />}

                                                {/* Star Node */}
                                                <motion.div
                                                    className={`
                                                        relative w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500
                                                        ${isCurrent ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-110 z-20' :
                                                            isPast ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                                                                'bg-white/5 text-white/20 border border-white/5'}
                                                    `}
                                                    animate={isCurrent ? { boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'] } : {}}
                                                    transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                                                >
                                                    {isCurrent ? <Star size={12} fill="black" /> : juzNum}
                                                </motion.div>

                                                {/* Tooltip on Hover */}
                                                <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-white/70 whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                                                    Juz {juzNum}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ============================================
// VARIATION 5: The Spiral (Ascent)
// ============================================
const SpiralVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    // We will render a spiral using SVG paths. 
    // The spiral goes upwards.
    const revolutions = 3;
    const pointsPerRev = 10;
    const totalPoints = 30; // 30 Juz

    // Generate spiral points
    const generateSpiralPoints = () => {
        const points = [];
        const centerX = 150;
        const centerY = 300; // Start from bottom
        const radiusStart = 100;
        const radiusEnd = 20;
        const height = 280;

        for (let i = 0; i < totalPoints; i++) {
            const progress = i / (totalPoints - 1); // 0 to 1
            const angle = progress * revolutions * 2 * Math.PI;
            const radius = radiusStart - (progress * (radiusStart - radiusEnd));
            const y = centerY - (progress * height);
            const x = centerX + Math.cos(angle) * radius;
            // storing 3D-ish coordinates: x, y, and z (for layering)
            const z = Math.sin(angle) * radius; // simplistic depth

            points.push({ x, y, z, val: i + 1 });
        }
        return points;
    };

    const points = generateSpiralPoints();

    // Create path string for the line
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="relative py-4 overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl" />

            <svg
                viewBox="0 0 300 350"
                className="w-full h-full overflow-visible"
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(167, 139, 250, 0.2))' }}
            >
                {/* Background Spiral Path */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    className="text-muted/10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Active Spiral Path (gradient) */}
                <defs>
                    <linearGradient id="spiralGrad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor="#34d399" />
                        <stop offset="50%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                </defs>

                {/* Only stroke up to current Juz */}
                {/* This is tricky with SVG path length, instead we mask or use dasharray. 
                     For simplicity in this vibe, we'll draw dots primarily. 
                  */}
            </svg>

            {/* Render Nodes absolutely positioned */}
            <div className="absolute inset-0 pointer-events-none">
                {/* We need to map the SVG coordinate space to CSS %. 
                     SVG viewBox is 0 0 300 350.
                  */}
            </div>

            {/* 
                Re-implementation: Doing it purely with mapped divs for easier interactivity and depth sorting 
             */}
            <div className="relative w-full h-[350px]">
                {/* SVG Line needs to be behind */}
                <svg
                    viewBox="0 0 300 350"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        d={pathD}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-border"
                    />
                    {/* Active Path Segment */}
                    {/* Construct a partial path for active segment? Too complex for quick SVG, 
                          using dots to show progress is cleaner for this variation. */}
                </svg>

                {points.map((p, i) => {
                    // Normalize coordinates to percentages for HTML positioning
                    const left = (p.x / 300) * 100;
                    const top = (p.y / 350) * 100;
                    const isDone = p.val < currentJuz;
                    const isCurrent = p.val === currentJuz;
                    const isFuture = p.val > currentJuz;

                    // Z-index sort: front points have higher z
                    // p.z ranges roughly -100 to 100
                    // z-index: 10 to 30
                    const zIndex = Math.floor(((p.z + 100) / 200) * 20) + 10;
                    const scale = 0.8 + ((p.z + 100) / 200) * 0.4; // 0.8 to 1.2 scale based on depth

                    return (
                        <motion.div
                            key={i}
                            className={`absolute flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer hover:scale-125 hover:z-50`}
                            style={{
                                left: `${left}%`,
                                top: `${top}%`,
                                width: isCurrent ? '32px' : '24px',
                                height: isCurrent ? '32px' : '24px',
                                marginLeft: isCurrent ? '-16px' : '-12px',
                                marginTop: isCurrent ? '-16px' : '-12px',
                                zIndex: isCurrent ? 50 : zIndex,
                                opacity: isFuture ? 0.4 : 1,
                                transform: `scale(${scale})`
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: scale }}
                            transition={{ delay: i * 0.02 }}
                        >
                            <div className={`
                                w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg
                                ${isDone ? 'bg-card text-muted-foreground border-border' : ''}
                                ${isCurrent ? 'bg-foreground text-background border-foreground ring-4 ring-foreground/20' : ''}
                                ${isFuture ? 'bg-card/30 text-muted-foreground/30 border-transparent' : ''}
                             `}>
                                {isDone ? <Check size={12} /> : p.val}
                            </div>

                            {isCurrent && (
                                <motion.div
                                    className="absolute -bottom-8 bg-foreground text-background text-[10px] py-1 px-2 rounded-md whitespace-nowrap"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    Current Juz
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="text-center mt-2 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                The Ascent
            </div>
        </div>
    );
};

// ============================================
// VARIATION 6: The Echo (Waveform)
// ============================================
const EchoVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    return (
        <div className="relative py-6 px-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Frequency</h4>
                    <div className="text-2xl font-light text-foreground">{Math.round((currentJuz / 30) * 100)}% <span className="text-xs text-muted-foreground">Resonance</span></div>
                </div>
                <Activity className="text-muted-foreground/50" />
            </div>

            <div className="flex items-end justify-between h-48 gap-[2px]">
                {Array.from({ length: 30 }).map((_, i) => {
                    const juzNum = i + 1;
                    const isDone = juzNum < currentJuz;
                    const isCurrent = juzNum === currentJuz;

                    // Generate a "waveform" pattern based on Juz index (fake data)
                    // Using sine wave + noise for aesthetic
                    const heightBase = 30 + (Math.sin(i * 0.5) * 20) + (Math.cos(i * 0.2) * 10);

                    return (
                        <motion.div
                            key={i}
                            className="group relative flex-1 flex flex-col justify-end items-center cursor-pointer"
                            initial={{ height: 0 }}
                            animate={{ height: '100%' }}
                            transition={{ delay: i * 0.03 }}
                        >
                            {/* Tooltip */}
                            <div className="absolute -top-8 bg-popover text-popover-foreground text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none mb-2 border border-border">
                                Juz {juzNum}
                            </div>

                            {/* Bar */}
                            <motion.div
                                className={`w-full rounded-t-sm transition-all duration-300 
                                        ${isDone ? 'bg-muted-foreground/40' : ''}
                                        ${isCurrent ? 'bg-foreground shadow-[0_0_15px_rgba(255,255,255,0.5)]' : ''}
                                        ${!isDone && !isCurrent ? 'bg-muted/20' : ''}
                                    `}
                                style={{ height: `${heightBase}%` }}
                                animate={isCurrent ? {
                                    height: [`${heightBase}%`, `${heightBase + 20}%`, `${heightBase}%`]
                                } : {}}
                                transition={isCurrent ? { repeat: Infinity, duration: 2, ease: "easeInOut" } : {}}
                            />

                            {/* Reflection (Echo effect) */}
                            <div
                                className={`w-full rounded-b-sm mt-[1px] opacity-20
                                        ${isDone ? 'bg-muted-foreground/40' : ''}
                                        ${isCurrent ? 'bg-foreground' : ''}
                                        ${!isDone && !isCurrent ? 'bg-muted/20' : ''}
                                    `}
                                style={{ height: `${heightBase * 0.4}%` }}
                            />
                        </motion.div>
                    );
                })}
            </div>

            {/* Status Line */}
            <div className="mt-8 h-px w-full bg-border relative">
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-foreground rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    initial={{ left: 0 }}
                    animate={{ left: `${((currentJuz - 1) / 29) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground/50 uppercase">
                <span>Start</span>
                <span>Finish</span>
            </div>
        </div>
    );
};

// ============================================
// VARIATION 7: The Focus (Minimalist Type)
// ============================================
const FocusVariation: React.FC<{ currentJuz: number }> = ({ currentJuz }) => {
    const completedPercentage = Math.round(((currentJuz - 1) / 30) * 100);

    return (
        <div className="relative py-8 px-4 flex flex-col items-center justify-center min-h-[400px]">

            {/* Big Number Display */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    className="text-[120px] leading-none font-display font-bold tracking-tighter text-foreground"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {currentJuz}
                </motion.div>
                <div className="text-sm uppercase tracking-[0.3em] text-muted-foreground mt-[-10px] mb-8 bg-background px-4">
                    Current Juz
                </div>
            </div>

            {/* Minimalist Grid of Remaining */}
            <div className="w-full max-w-[240px] grid grid-cols-10 gap-x-2 gap-y-2">
                {Array.from({ length: 30 }).map((_, i) => {
                    const juzNum = i + 1;
                    const isDone = juzNum < currentJuz;
                    const isCurrent = juzNum === currentJuz;

                    return (
                        <motion.div
                            key={i}
                            className={`
                                h-1 rounded-full transition-all duration-500
                                ${isDone ? 'bg-foreground' : ''}
                                ${isCurrent ? 'bg-gradient-to-r from-emerald-400 to-blue-500 w-full scale-110' : ''}
                                ${!isDone && !isCurrent ? 'bg-muted' : ''}
                            `}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: i * 0.02 }}
                        />
                    );
                })}
            </div>

            <div className="mt-12 w-full flex justify-between items-end border-b border-border pb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-muted-foreground">Progress</span>
                    <span className="text-xl font-mono">{completedPercentage}%</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-muted-foreground">Remaining</span>
                    <span className="text-xl font-mono">{30 - currentJuz + 1}</span>
                </div>
            </div>

            <div className="mt-4 p-4 bg-muted/20 border border-muted/50 rounded-xl w-full text-center">
                <div className="text-xs text-muted-foreground mb-1">Target Completion</div>
                <div className="text-sm font-medium text-foreground">Ramadan 1447</div>
            </div>
        </div>
    );
};

// ============================================ (End of new variations)

// ============================================
// MAIN COMPONENT
// ============================================
const JourneyRoadmapSidebar: React.FC<JourneyRoadmapSidebarProps> = ({ settings, stats }) => {
    const [activeVariation, setActiveVariation] = useState<VariationTab>('elevation'); // Default to new refined look
    const currentJuz = stats.juzCompleted + 1;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h3 className="text-2xl font-display font-medium text-foreground">Journey Roadmap</h3>
                <p className="text-muted-foreground text-sm">
                    Your complete path from start to finish — explore different visualizations.
                </p>
            </div>

            {/* Variation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-card rounded-2xl border border-border overflow-x-auto no-scrollbar">
                {variationTabs.map((tab) => {
                    const isActive = activeVariation === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveVariation(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium whitespace-nowrap
                                transition-all duration-200
                                ${isActive ? 'bg-foreground text-background shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                            `}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Variation Content */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeVariation === 'timeline' && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <TimelineVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'gps' && (
                        <motion.div
                            key="gps"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <GPSVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'elevation' && (
                        <motion.div
                            key="elevation"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ElevationVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'constellation' && (
                        <motion.div
                            key="constellation"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ConstellationVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'spiral' && (
                        <motion.div
                            key="spiral"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <SpiralVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'echo' && (
                        <motion.div
                            key="echo"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EchoVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                    {activeVariation === 'focus' && (
                        <motion.div
                            key="focus"
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                        >
                            <FocusVariation currentJuz={currentJuz} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default JourneyRoadmapSidebar;
