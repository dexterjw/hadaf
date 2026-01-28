import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft, TrendingUp, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { format, differenceInMonths } from "date-fns";

import { ProjectionResult } from "../utils";
import { QuranStandard } from "../types";
import TimelineView from "./TimelineView";
import MarhalaVariations from "./MarhalaVariations";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseProjection: ProjectionResult;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    onReset: () => void;
    quranStandard: QuranStandard;
}

export default function DashboardView({
    projection,
    baseProjection,
    adjustedPace,
    setAdjustedPace,
    onReset,
    quranStandard,
}: DashboardViewProps) {
    const timeDelta = baseProjection.daysNeeded - projection.daysNeeded;
    const monthsDelta = differenceInMonths(baseProjection.finishDate, projection.finishDate);

    return (
        <motion.div
            key="dashboard-p8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex flex-col font-sans"
        >
            {/* Top Bar - Minimal */}
            <div className="flex items-center justify-between px-6 py-5">
                <Button
                    onClick={onReset}
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-neutral-500 hover:text-white font-light"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back</span>
                </Button>

                {/* Central: Completion Date Hero */}
                <div className="flex flex-col items-center">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-[0.2em] mb-1">
                        Target Completion
                    </div>
                    <motion.div
                        key={projection.finishDate.toISOString()}
                        initial={{ opacity: 0.5, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-light text-white tracking-tight"
                    >
                        {format(projection.finishDate, "MMMM d, yyyy")}
                    </motion.div>
                </div>

                {/* Delta Badge */}
                <div className="w-28 flex justify-end">
                    <AnimatePresence mode="wait">
                        {timeDelta !== 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5",
                                    timeDelta > 0
                                        ? "bg-emerald-500/10 text-emerald-400/90"
                                        : "bg-rose-500/10 text-rose-400/90"
                                )}
                            >
                                {timeDelta > 0 ? (
                                    <>
                                        <TrendingUp className="w-3 h-3" />
                                        {monthsDelta > 0 ? `${monthsDelta}mo ↑` : `${Math.abs(timeDelta)}d ↑`}
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3" />
                                        {Math.abs(monthsDelta) > 0 ? `${Math.abs(monthsDelta)}mo ↓` : `${Math.abs(timeDelta)}d ↓`}
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left: Stats Panel (Minimal) */}
                <div className="w-64 px-6 py-4 flex flex-col border-r border-neutral-800/20">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-baseline justify-between mb-2">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Progress</span>
                            <span className="text-xl font-light text-sky-400 tabular-nums">{projection.progressPercent}%</span>
                        </div>
                        <div className="w-full h-0.5 bg-neutral-800/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${projection.progressPercent}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-sky-500/80 to-indigo-500/80"
                            />
                        </div>
                    </div>

                    {/* Stats - Vertical List (No Boxes) */}
                    <div className="space-y-5 mb-auto">
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Months</span>
                            <span className="text-lg font-light text-white tabular-nums">{projection.estimatedMonths}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Days</span>
                            <span className="text-lg font-light text-white tabular-nums">{projection.daysNeeded}</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Lines Left</span>
                            <span className="text-lg font-light text-white tabular-nums">{(projection.remainingLines / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex justify-between items-baseline">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Breaks</span>
                            <span className="text-lg font-light text-neutral-400 tabular-nums">{projection.breakPeriods.length}</span>
                        </div>
                    </div>

                    {/* Pace Slider - Bottom */}
                    <div className="pt-6 mt-6 border-t border-neutral-800/20">
                        <div className="flex items-baseline justify-between mb-4">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-[0.15em]">Pace</span>
                            <div className="text-right">
                                <span className={cn(
                                    "text-xl font-light tabular-nums",
                                    adjustedPace > 25 ? "text-amber-400" : "text-white"
                                )}>
                                    {adjustedPace}
                                </span>
                                <span className="text-[10px] text-neutral-600 ml-1">lines/day</span>
                            </div>
                        </div>

                        <Slider
                            value={[adjustedPace]}
                            onValueChange={(v) => setAdjustedPace(v[0])}
                            min={1}
                            max={45}
                            step={1}
                            className="mb-2"
                        />

                        <div className="flex justify-between text-[9px] text-neutral-600 tracking-wider">
                            <span>1</span>
                            <span className="text-neutral-500">≈ {(adjustedPace / quranStandard).toFixed(1)} pages/day</span>
                            <span>45</span>
                        </div>

                        {adjustedPace > 25 && (
                            <div className="mt-3 text-[10px] text-amber-400/70 text-center font-light">
                                ⚠ High burnout risk
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Timeline (The Hero) - Full width, no borders/boxes */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-neutral-950/30">
                    <MarhalaVariations
                        dates={projection.milestones || {
                            marhala1: new Date(),
                            marhala2: new Date(),
                            marhala3: new Date()
                        }}
                        today={new Date()}
                    />
                </div>
            </div>
        </motion.div>
    );
}
