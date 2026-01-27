import { motion, AnimatePresence } from "framer-motion";
import { Disc, Calendar, Zap, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    // Calculate rotation for the dial (max 45 lines)
    // 0 lines = -120deg, 45 lines = 120deg
    const maxPace = 45;
    const rotation = (adjustedPace / maxPace) * 240 - 120;

    const timeDelta = baseDaysNeeded - projection.daysNeeded;

    return (
        <motion.div
            key="dashboard-p5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="w-full max-w-2xl relative flex flex-col items-center"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" />

            {/* Time Delta HUD */}
            <div className="absolute top-0 right-0 md:-right-20 pointer-events-none">
                <AnimatePresence>
                    {timeDelta !== 0 && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="text-right"
                        >
                            <div className="text-4xl font-bold text-emerald-400 tabular-nums">
                                {Math.abs(timeDelta)}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-emerald-500/60 font-bold">
                                Days {timeDelta > 0 ? "Saved" : "Added"}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Main Dial Interface */}
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center mb-12">

                {/* Outer Ring (Static) */}
                <div className="absolute inset-0 rounded-full border border-emerald-500/10" />
                <div className="absolute inset-4 rounded-full border border-emerald-500/5 dashed-offset-4" style={{ borderStyle: 'dashed', opacity: 0.4 }} />

                {/* Active Pace Ring (Rotates) */}
                <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: rotation }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-6 h-6 bg-emerald-500 rounded-full drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[50%] bg-gradient-to-b from-emerald-500/50 to-transparent origin-bottom" />
                </motion.div>

                {/* Center Console */}
                <div className="w-[240px] h-[240px] rounded-full bg-[#050505] border border-emerald-500/20 shadow-[0_0_50px_-10px_rgba(16,185,129,0.1)] flex flex-col items-center justify-center relative z-10 backdrop-blur-xl">
                    <div className="text-emerald-500/50 text-[10px] tracking-[0.3em] font-bold uppercase mb-2">Target Lock</div>
                    <motion.div
                        key={projection.finishDate.toISOString()}
                        initial={{ scale: 1.1, opacity: 0.5, color: '#fff' }}
                        animate={{ scale: 1, opacity: 1, color: '#34d399' }}
                        className="text-4xl md:text-5xl font-bold tracking-tighter text-emerald-400 tabular-nums text-center leading-none"
                    >
                        {format(projection.finishDate, "MMM d")}
                        <span className="block text-lg text-emerald-500/40 font-normal mt-1">{format(projection.finishDate, "yyyy")}</span>
                    </motion.div>
                    <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                        {Math.ceil(projection.daysNeeded / 30)} MONTHS
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full max-w-sm space-y-8 relative z-20">
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Pace Control</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-light text-white">{adjustedPace}</span>
                            <span className="text-xs text-neutral-500">Lines/Day</span>
                        </div>
                    </div>
                    <Slider
                        value={[adjustedPace]}
                        onValueChange={(v) => setAdjustedPace(v[0])}
                        min={1}
                        max={45}
                        step={1}
                        className="py-4"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                        <div className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Total Lines</div>
                        <div className="text-xl font-light text-white">{projection.totalLines.toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                        <div className="text-neutral-500 text-xs uppercase tracking-widest mb-1">Buffer</div>
                        <div className="text-xl font-light text-white">15%</div>
                    </div>
                </div>

                <Button
                    onClick={onReset}
                    variant="ghost"
                    className="w-full text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/5 h-12 rounded-xl"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Simulation
                </Button>
            </div>
        </motion.div>
    );
}
