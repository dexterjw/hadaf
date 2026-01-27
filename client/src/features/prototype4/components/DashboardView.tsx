import { motion, AnimatePresence } from "framer-motion";
import { CalendarRange, Clock, RotateCcw, TrendingUp, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProjectionResult } from "../utils";
import { format } from "date-fns";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseDaysNeeded: number;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    onReset: () => void;
}

export default function DashboardView({
    projection,
    baseDaysNeeded,
    adjustedPace,
    setAdjustedPace,
    onReset
}: DashboardViewProps) {
    // Calculate percentage relative to base (max 100%)
    // If pace is faster, daysNeeded is smaller, so width is smaller.
    // If pace is slower (not possible via logic since we start at base or higher?), 
    // actually user can lower pace in slider? The FR says 1-45. Base might be 5. So yes.

    // We need a reference max width. Let's say 45 lines/day is 100% speed (smallest bar), 1 line/day is longest.
    // That's too extreme.
    // Let's make the current bar width relative to the screen.
    // But we want to show COMPARISON.
    // Maybe show "Original Plan" vs "Adjusted Plan" bars stacked.

    const timeDelta = baseDaysNeeded - projection.daysNeeded;
    const isFaster = timeDelta > 0;

    return (
        <motion.div
            key="dashboard-p4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl"
        >
            <div className="flex flex-col md:flex-row gap-8 items-start">

                {/* Left Panel: Controls */}
                <div className="w-full md:w-1/3 bg-[#0a0a0a] border border-cyan-500/10 rounded-3xl p-8 sticky top-8">
                    <div className="mb-8">
                        <Label className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 block">
                            Velocity Control
                        </Label>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-6xl font-light tracking-tighter text-white">
                                {adjustedPace}
                            </span>
                            <span className="text-lg text-neutral-500 font-medium mb-1.5 pl-1">
                                lines / day
                            </span>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Slider
                            value={[adjustedPace]}
                            onValueChange={(v) => setAdjustedPace(v[0])}
                            min={1}
                            max={45}
                            step={1}
                            className="py-4"
                        />

                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400 text-sm">Est. Duration</span>
                                <span className="text-white font-medium">{Math.ceil(projection.daysNeeded / 30)} Months</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-400 text-sm">Daily Effort</span>
                                <span className="text-white font-medium">~{Math.ceil(adjustedPace * 2)} mins</span>
                            </div>
                        </div>

                        <Button
                            onClick={onReset}
                            variant="ghost"
                            className="w-full text-neutral-500 hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset Parameters
                        </Button>
                    </div>
                </div>

                {/* Right Panel: Visualization */}
                <div className="w-full md:w-2/3 space-y-6">

                    {/* Header Card */}
                    <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/10 border border-cyan-500/20 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 blur-[100px] rounded-full mix-blend-screen" />

                        <div className="relative z-10 flex flex-col items-start gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20 mb-2">
                                <CalendarRange className="w-3 h-3" />
                                Target Date
                            </div>
                            <h2 className="text-5xl md:text-7xl font-light text-white tracking-tighter">
                                {format(projection.finishDate, "MMM d, yyyy")}
                            </h2>
                            <p className="text-neutral-400 text-lg font-light mt-2">
                                <span className="text-white font-medium">{projection.daysNeeded}</span> days remaining
                            </p>
                        </div>
                    </div>

                    {/* Timeline Interaction */}
                    <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl p-8 relative overflow-hidden min-h-[300px] flex flex-col justify-center">
                        <Label className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8 absolute top-8 left-8">
                            Timeline Compression
                        </Label>

                        <div className="space-y-12 relative z-10 mt-6">
                            {/* Base Timeline (Ghost) */}
                            {timeDelta !== 0 && (
                                <div className="space-y-2 opacity-30">
                                    <div className="flex justify-between text-xs text-neutral-500 font-medium tracking-widest uppercase">
                                        <span>Start</span>
                                        <span>Original Plan ({baseDaysNeeded}d)</span>
                                    </div>
                                    <div className="h-3 bg-white/10 rounded-full w-full relative">
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/50 rounded-full" />
                                    </div>
                                </div>
                            )}

                            {/* Active Timeline */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-cyan-400 font-medium tracking-widest uppercase">
                                    <span>Start</span>
                                    <motion.span
                                        layout
                                    >
                                        Adjusted ({projection.daysNeeded}d)
                                    </motion.span>
                                </div>

                                {/* Bar container */}
                                <div className="h-4 bg-white/[0.02] rounded-full w-full relative overflow-hidden">
                                    {/* This bar width represents the ratio of current days / base days (or max days) */}
                                    {/* If current is faster, it should be shorter than full width IF full width was base. */}
                                    {/* But base varies. Let's make "Full Width" = Longest possible duration (1 line/day approx equivalent or just baseDays if base is slower). */}
                                    {/* Simplified: Let active bar traverse 0 to 100%. User sees it shrink if they go faster than base. */}

                                    <motion.div
                                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                        initial={false}
                                        animate={{
                                            width: `${Math.min(100, (projection.daysNeeded / Math.max(baseDaysNeeded, projection.daysNeeded)) * 100)}%`
                                        }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    />
                                </div>
                            </div>

                            {/* Time Saved Delta */}
                            <AnimatePresence mode="popLayout">
                                {timeDelta !== 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="flex items-center gap-4 pt-4 border-t border-white/5"
                                    >
                                        <div className={`p-3 rounded-full ${isFaster ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {isFaster ? <Zap className="w-5 h-5 fill-current" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className={`text-2xl font-bold ${isFaster ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {Math.abs(timeDelta)} Days {isFaster ? 'Saved' : 'Added'}
                                            </div>
                                            <div className="text-sm text-neutral-500">
                                                By adjusting your pace to {adjustedPace} lines
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
