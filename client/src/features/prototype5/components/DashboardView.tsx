import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ProjectionResult } from "../utils";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { QuranStandard } from "../types";

interface DashboardViewProps {
    projection: ProjectionResult;
    baseDaysNeeded: number;
    adjustedPace: number;
    setAdjustedPace: (pace: number) => void;
    onReset: () => void;
    quranStandard: QuranStandard;
}

const getDifficultyColor = (pace: number) => {
    if (pace <= 10) return {
        text: "text-emerald-400",
        bg: "bg-emerald-500",
        border: "border-emerald-500",
        shadow: "shadow-emerald-500/50",
        stop: "#10b981", // emerald-500
        label: "Comfortable"
    };
    if (pace <= 20) return {
        text: "text-yellow-400",
        bg: "bg-yellow-500",
        border: "border-yellow-500",
        shadow: "shadow-yellow-500/50",
        stop: "#eab308", // yellow-500
        label: "Moderate"
    };
    if (pace <= 30) return {
        text: "text-orange-400",
        bg: "bg-orange-500",
        border: "border-orange-500",
        shadow: "shadow-orange-500/50",
        stop: "#f97316", // orange-500
        label: "Intense"
    };
    return {
        text: "text-red-500",
        bg: "bg-red-600",
        border: "border-red-600",
        shadow: "shadow-red-600/50",
        stop: "#dc2626", // red-600
        label: "Extreme"
    };
};

export default function DashboardView({
    projection,
    baseDaysNeeded,
    adjustedPace,
    setAdjustedPace,
    onReset,
    quranStandard
}: DashboardViewProps) {
    const timeDelta = baseDaysNeeded - projection.daysNeeded;
    const isFaster = timeDelta > 0;
    const styles = getDifficultyColor(adjustedPace);
    const pagesPerDay = (adjustedPace / quranStandard).toFixed(2);

    // For smooth "dial" interaction feel, we map the slider
    const [isDragging, setIsDragging] = useState(false);

    // Shake effect for extreme difficulty
    const [shake, setShake] = useState(0);

    useEffect(() => {
        if (adjustedPace > 30) {
            setShake(prev => prev + 1);
        }
    }, [adjustedPace]);

    // Calculate rotation: 0 to 45 lines -> -135deg to +135deg (270deg range)
    const maxPace = 45;
    const rotationRange = 270;
    const startRotation = -135;
    const currentRotation = startRotation + (adjustedPace / maxPace) * rotationRange;

    return (
        <motion.div
            key="dashboard-p5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{
                opacity: 1,
                scale: 1,
                x: adjustedPace > 30 ? [0, -2, 2, -2, 2, 0] : 0
            }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                x: { duration: 0.4 }
            }}
            className="w-full max-w-2xl flex flex-col items-center justify-between min-h-[600px] py-8"
        >
            {/* Top Stats - Minimalist Row */}
            <div className="w-full flex justify-between items-start px-8">
                <div className="text-left">
                    <div className="text-xs text-neutral-600 uppercase tracking-widest mb-1">Total Effort</div>
                    <div className="text-xl font-light text-neutral-300">{projection.totalLines.toLocaleString()} <span className="text-xs text-neutral-600 ml-1">LINES</span></div>
                </div>

                {/* Delta Indicator */}
                <AnimatePresence mode="wait">
                    {timeDelta !== 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-right"
                        >
                            <div className={`text-xs uppercase tracking-widest mb-1 ${isFaster ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                                {isFaster ? 'Saved' : 'Delayed'}
                            </div>
                            <div className={`text-xl font-light ${isFaster ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {Math.abs(timeDelta)} <span className="text-xs font-normal ml-1 opacity-60">DAYS</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* THE KINETIC RING */}
            <div className="relative w-[360px] h-[360px] flex items-center justify-center my-12">

                {/* 1. Track (Static Base) */}
                <div className="absolute inset-0 rounded-full border-[1.5px] border-white/[0.03]" />

                {/* 2. Active Arc (Dynamic Gradient) */}
                {/* SVG for perfect gradient arc control */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                    <circle
                        cx="50%"
                        cy="50%"
                        r="179"
                        fill="none"
                        stroke="url(#gradient-ring)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeDasharray={`${(adjustedPace / maxPace) * (2 * Math.PI * 179) * 0.75} ${2 * Math.PI * 179}`} // Partial stroke logic simplified for visual, 0.75 is approx 270deg
                        style={{ transition: "stroke-dasharray 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                    <defs>
                        <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={styles.stop} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={styles.stop} stopOpacity="1" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* 3. The Knob (Interactive Visual) */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ rotate: currentRotation }}
                    transition={{ type: "spring", stiffness: 150, damping: 25, mass: 0.8 }}
                >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center">
                        <div className={cn(
                            "w-3 h-3 rounded-full transition-all duration-300",
                            styles.bg,
                            styles.shadow,
                            isDragging ? 'scale-125' : 'scale-100',
                            "shadow-[0_0_15px_currentColor]"
                        )} />
                    </div>
                </motion.div>

                {/* 4. Center Projection (Hero Data) */}
                <div className={cn(
                    "relative z-10 text-center flex flex-col items-center justify-center w-[240px] h-[240px] rounded-full bg-[#080808] border transition-colors duration-500",
                    adjustedPace > 30 ? "border-red-900/40 shadow-2xl shadow-red-900/10" : "border-white/[0.02] shadow-2xl shadow-emerald-900/5"
                )}>
                    <motion.div
                        layout
                        className="text-neutral-500 text-[10px] tracking-[0.2em] uppercase mb-3 font-medium"
                    >
                        Completion Date
                    </motion.div>

                    <motion.div
                        key={projection.finishDate.toISOString()}
                        initial={{ opacity: 0.5, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-light tracking-tighter text-white tabular-nums"
                    >
                        {format(projection.finishDate, "MMM d")}
                    </motion.div>

                    <div className="text-neutral-600 text-sm mt-2 font-light">
                        {format(projection.finishDate, "yyyy")}
                    </div>

                    <div className="absolute bottom-8 text-[10px] text-neutral-700 bg-white/[0.02] px-3 py-1 rounded-full border border-white/[0.02]">
                        ~{Math.ceil(projection.daysNeeded / 30)} MONTHS
                    </div>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="w-full max-w-sm px-8 space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                        <div>
                            <Label className="text-xs text-neutral-500 font-medium uppercase tracking-wider block mb-1">Velocity</Label>
                            <span className={cn("text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5", styles.text)}>
                                {styles.label}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className={cn("text-2xl font-medium tabular-nums", styles.text)}>{adjustedPace} <span className="text-base font-normal text-neutral-600">lines</span></span>
                            <div className="text-xs text-neutral-500 font-medium mt-0.5 flex items-center justify-end gap-1">
                                <Copy className="w-3 h-3" />
                                {pagesPerDay} pages/day
                            </div>
                        </div>
                    </div>

                    <div className="relative h-12 flex items-center group">
                        {/* Custom Slider Styling */}
                        <Slider
                            value={[adjustedPace]}
                            onValueChange={(v) => setAdjustedPace(v[0])}
                            onPointerDown={() => setIsDragging(true)}
                            onPointerUp={() => setIsDragging(false)}
                            min={1}
                            max={45}
                            step={1}
                            className={cn("cursor-pointer transition-colors duration-300", styles.text)}
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <Button
                        onClick={onReset}
                        variant="link"
                        className="text-neutral-600 hover:text-white transition-colors text-xs tracking-wider uppercase h-auto p-0 opacity-50 hover:opacity-100"
                    >
                        Reset Configuration
                    </Button>
                </div>
            </div>

        </motion.div>
    );
}
