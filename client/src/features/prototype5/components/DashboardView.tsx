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
        text: "text-emerald-300",
        bg: "bg-emerald-400", // for slider thumb
        border: "border-emerald-400/30",
        shadow: "shadow-emerald-400/20",
        stop: "#6ee7b7", // emerald-300
        label: "Comfortable"
    };
    if (pace <= 20) return {
        text: "text-amber-200",
        bg: "bg-amber-300",
        border: "border-amber-300/30",
        shadow: "shadow-amber-300/20",
        stop: "#fcd34d", // amber-300
        label: "Moderate"
    };
    if (pace <= 30) return {
        text: "text-orange-300",
        bg: "bg-orange-400",
        border: "border-orange-400/30",
        shadow: "shadow-orange-400/20",
        stop: "#fb923c", // orange-400
        label: "Intense"
    };
    return {
        text: "text-rose-300",
        bg: "bg-rose-400",
        border: "border-rose-400/30",
        shadow: "shadow-rose-400/20",
        stop: "#fb7185", // rose-400
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

    // Geometry Constants
    const CX = 200;
    const CY = 180; // Vertically centered in 360 viewbox looks better? No, let's stick to a balanced point.
    const R_TRACK = 140;
    // We want the gauge to be open at the bottom.
    // Start at 135 degrees (Bottom Left in SVG coords).
    // Go clockwise to 45 degrees (Bottom Right in SVG coords).
    // This covers 270 degrees (135 -> 180 -> 270 -> 360/0 -> 45).
    const START_ANGLE_DEG = 135;
    const END_ANGLE_DEG = 45; // Effectively 405 degrees (45 + 360) for clockwise sweep
    const SWEEP_ARC_DEG = 270;

    // Helper to get coordinates on the circle
    const getCoord = (angleInDegrees: number, radius: number) => {
        const angleInRadians = angleInDegrees * Math.PI / 180;
        return {
            x: CX + radius * Math.cos(angleInRadians),
            y: CY + radius * Math.sin(angleInRadians)
        };
    };

    const startPoint = getCoord(START_ANGLE_DEG, R_TRACK);
    const endPoint = getCoord(END_ANGLE_DEG, R_TRACK);

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
                    <div className="text-xs text-neutral-600 uppercase tracking-widest mb-1 font-medium">Total Effort</div>
                    <div className="text-3xl font-light text-neutral-300">{projection.totalLines.toLocaleString()} <span className="text-sm text-neutral-600 ml-1 font-normal">lines</span></div>
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
                            <div className={`text-3xl font-light ${isFaster ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {Math.abs(timeDelta)} <span className="text-sm font-normal ml-1 opacity-60">days</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* THE RACING GAUGE */}
            <div className="relative w-[480px] h-[420px] flex items-center justify-center my-8">

                {/* SVG Gauge Container */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 360">
                    <defs>
                        <linearGradient id="gauge-gradient" x1="0%" y1="100%" x2="100%" y2="100%">
                            {/* Adjusted gradient to be lighter/softer as requested */}
                            <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.2" />   {/* Emerald-300 */}
                            <stop offset="40%" stopColor="#fcd34d" stopOpacity="0.6" />   {/* Amber-300 */}
                            <stop offset="80%" stopColor="#fb923c" stopOpacity="0.8" />   {/* Orange-400 */}
                            <stop offset="100%" stopColor="#fb7185" stopOpacity="1" />    {/* Rose-400 */}
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* 1. Track Background (270 degrees arc) */}
                    <path
                        d={`M ${CX + R_TRACK * Math.cos(135 * Math.PI / 180)} ${CY + R_TRACK * Math.sin(135 * Math.PI / 180)} A ${R_TRACK} ${R_TRACK} 0 1 1 ${CX + R_TRACK * Math.cos(45 * Math.PI / 180)} ${CY + R_TRACK * Math.sin(45 * Math.PI / 180)}`}
                        fill="none"
                        stroke="#222"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    {/* 2. Tick Marks */}
                    {Array.from({ length: 46 }).map((_, i) => {
                        // Map 0-45 steps to angle 135 -> 405 (270 deg span)
                        const angleDeg = 135 + (i / 45) * 270;
                        const isMajor = i % 5 === 0;
                        const rad = angleDeg * Math.PI / 180;

                        const rInner = isMajor ? R_TRACK - 12 : R_TRACK - 4;
                        const rOuter = R_TRACK + 10;

                        const x1 = CX + rInner * Math.cos(rad);
                        const y1 = CY + rInner * Math.sin(rad);
                        const x2 = CX + rOuter * Math.cos(rad);
                        const y2 = CY + rOuter * Math.sin(rad);

                        // Color logic
                        let tickColor = "#333";
                        if (i <= adjustedPace) {
                            if (i <= 10) tickColor = "#6ee7b7"; // Emerald-300
                            else if (i <= 20) tickColor = "#fcd34d"; // Amber-300
                            else if (i <= 30) tickColor = "#fb923c"; // Orange-400
                            else tickColor = "#fb7185"; // Rose-400
                        }

                        return (
                            <line
                                key={i}
                                x1={x1} y1={y1}
                                x2={x2} y2={y2}
                                stroke={tickColor}
                                strokeWidth={isMajor ? 3 : 1.5}
                                className="transition-colors duration-300"
                                opacity={i <= adjustedPace ? 1 : 0.2}
                            />
                        );
                    })}

                    {/* 3. The Needles/Arc Progress */}
                    {/* We draw a path that matches the background track but uses dasharray to fill it */}
                    <path
                        d={`M ${CX + R_TRACK * Math.cos(135 * Math.PI / 180)} ${CY + R_TRACK * Math.sin(135 * Math.PI / 180)} A ${R_TRACK} ${R_TRACK} 0 1 1 ${CX + R_TRACK * Math.cos(45 * Math.PI / 180)} ${CY + R_TRACK * Math.sin(45 * Math.PI / 180)}`}
                        fill="none"
                        stroke={`url(#gauge-gradient)`}
                        strokeWidth="6"
                        strokeLinecap="round"
                        // Calculation: Arc Length = R * Theta(rad). 270 deg = 4.71 rad. R=140. L ~= 660. 
                        strokeDasharray={`${(adjustedPace / 45) * 660} 1000`}
                        className="transition-all duration-500 ease-out"
                        filter="url(#glow)"
                        opacity="0.9"
                    />
                </svg>

                {/* 4. Center Projection (The Gauge Hub) */}
                <div className={cn(
                    "relative z-10 text-center flex flex-col items-center justify-center w-[240px] h-[240px] rounded-full bg-[#050505] border-2 transition-colors duration-500",
                    adjustedPace > 30 ? "border-rose-400/30 shadow-[0_0_60px_-10px_rgba(251,113,133,0.2)]" : "border-white/[0.05] shadow-[0_0_60px_-10px_rgba(16,185,129,0.1)]"
                )}>
                    <motion.div
                        layout
                        className="text-neutral-500 text-xs tracking-[0.25em] uppercase mb-4 font-semibold opacity-60"
                    >
                        Completion Estimate
                    </motion.div>

                    <motion.div
                        key={projection.finishDate.toISOString()}
                        initial={{ opacity: 0.5, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "text-7xl font-light tracking-tighter tabular-nums transition-colors duration-300 leading-none mb-2",
                            styles.text
                        )}
                    >
                        {format(projection.finishDate, "MMM d")}
                    </motion.div>

                    <div className="text-3xl text-neutral-500 font-light tracking-widest">
                        {format(projection.finishDate, "yyyy")}
                    </div>

                    {/* Months Badge - Restored & Lightened */}
                    <div className={cn(
                        "mt-5 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border transition-colors",
                        adjustedPace > 30 ? "bg-rose-400/10 border-rose-400/20 text-rose-400" : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400"
                    )}>
                        {Math.ceil(projection.daysNeeded / 30)} Months
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
                            <span className={cn("text-4xl font-light tabular-nums tracking-tight", styles.text)}>{adjustedPace} <span className="text-lg font-normal text-neutral-600 ml-1">lines</span></span>
                            <div className="text-sm text-neutral-500 font-medium mt-1 flex items-center justify-end gap-1.5">
                                <Copy className="w-4 h-4" />
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
