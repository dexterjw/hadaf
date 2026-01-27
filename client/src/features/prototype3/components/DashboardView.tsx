import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, RotateCcw, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProjectionResult } from "../utils";

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
    const timeDelta = baseDaysNeeded - projection.daysNeeded;

    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
        >
            <div className="text-center mb-10">
                <h1 className="text-4xl font-light tracking-[-0.02em] text-white/90 mb-3">
                    Your Projection
                </h1>
                <p className="text-neutral-500 font-light">
                    Adjust the pace slider to explore different scenarios
                </p>
            </div>

            {/* Main projection card */}
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 mb-6">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium mb-4">
                        <Calendar className="w-3 h-3" />
                        Projected Completion
                    </div>
                    <div className="text-5xl font-light tracking-tight text-white mb-2">
                        {projection.finishDate.toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                    <div className="text-neutral-500">
                        ~{Math.ceil(projection.daysNeeded / 30)} months from now
                    </div>
                </div>

                {/* Time delta indicator */}
                <AnimatePresence mode="wait">
                    {timeDelta !== 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`text-center py-4 px-6 rounded-xl mb-8 ${timeDelta > 0
                                ? "bg-emerald-500/10 border border-emerald-500/20"
                                : "bg-red-500/10 border border-red-500/20"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Clock className={`w-4 h-4 ${timeDelta > 0 ? "text-emerald-400" : "text-red-400"}`} />
                                <span className={`text-lg font-medium ${timeDelta > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                    {timeDelta > 0 ? `${timeDelta} days saved` : `${Math.abs(timeDelta)} days added`}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pace Slider */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm text-neutral-400 font-medium">
                            Daily Pace
                        </Label>
                        <span className="text-fuchsia-400 font-medium">
                            {adjustedPace} lines/day
                        </span>
                    </div>
                    <Slider
                        value={[adjustedPace]}
                        onValueChange={(v) => setAdjustedPace(v[0])}
                        min={1}
                        max={45}
                        step={1}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-neutral-600">
                        <span>1 line</span>
                        <span>45 lines</span>
                    </div>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 text-center">
                    <BookOpen className="w-5 h-5 text-neutral-500 mx-auto mb-2" />
                    <div className="text-2xl font-light text-white mb-1">
                        {projection.progressPercent}%
                    </div>
                    <div className="text-xs text-neutral-500">Progress</div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 text-center">
                    <TrendingUp className="w-5 h-5 text-neutral-500 mx-auto mb-2" />
                    <div className="text-2xl font-light text-white mb-1">
                        {projection.remainingLines.toLocaleString()}
                    </div>
                    <div className="text-xs text-neutral-500">Lines Left</div>
                </div>
                <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 text-center">
                    <Clock className="w-5 h-5 text-neutral-500 mx-auto mb-2" />
                    <div className="text-2xl font-light text-white mb-1">
                        {projection.daysNeeded}
                    </div>
                    <div className="text-xs text-neutral-500">Days</div>
                </div>
            </div>

            {/* Info note */}
            <div className="text-center text-xs text-neutral-600 mb-8">
                Includes 15% retention buffer for revision time
            </div>

            {/* Reset button */}
            <div className="text-center">
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="gap-2 border-white/10 text-neutral-400 hover:text-white hover:bg-white/5"
                >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                </Button>
            </div>
        </motion.div>
    );
}
