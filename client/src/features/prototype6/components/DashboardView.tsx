import { motion } from "framer-motion";
import { Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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

    // Calculate difference
    const timeDelta = baseDaysNeeded - projection.daysNeeded;

    const handlePaceChange = (delta: number) => {
        const newPace = Math.max(1, Math.min(45, adjustedPace + delta));
        setAdjustedPace(newPace);
    };

    return (
        <motion.div
            key="dashboard-p6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full flex flex-col justify-between py-12 px-6 max-w-4xl mx-auto"
        >
            {/* Header / Reset */}
            <div className="flex justify-between items-start">
                <Button
                    onClick={onReset}
                    variant="ghost"
                    className="gap-2 text-neutral-500 hover:text-black dark:hover:text-white pl-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Reset
                </Button>

                {/* Minimal Delta Indicator */}
                {timeDelta !== 0 && (
                    <div className="text-right">
                        <div className={`text-sm font-medium uppercase tracking-widest ${timeDelta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {timeDelta > 0 ? 'Saved' : 'Added'}
                        </div>
                        <div className="text-3xl font-light tabular-nums text-black dark:text-white">
                            {Math.abs(timeDelta)} <span className="text-sm text-neutral-400 font-normal align-top">DAYS</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Visual: Data & Date */}
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12">

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm md:text-base font-medium uppercase tracking-[0.2em] text-neutral-400"
                    >
                        Projected Completion
                    </motion.div>
                    <motion.h1
                        key={projection.finishDate.toISOString()}
                        className="text-6xl md:text-9xl font-bold tracking-tighter text-black dark:text-white leading-[0.85]"
                        initial={{ opacity: 0.8, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        {format(projection.finishDate, "MMM d")}
                        <span className="block text-[0.4em] font-light text-neutral-400 mt-2 tracking-normal">
                            {format(projection.finishDate, "yyyy")}
                        </span>
                    </motion.h1>
                </div>

                <div className="w-full max-w-sm border-t border-neutral-200 dark:border-neutral-800 pt-8 mt-8">
                    <div className="flex justify-between text-sm text-neutral-500 uppercase tracking-widest mb-4">
                        <span>Pace Control</span>
                        <span>{adjustedPace} lines/day</span>
                    </div>

                    <div className="flex items-center justify-between gap-6">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white"
                            onClick={() => handlePaceChange(-1)}
                            disabled={adjustedPace <= 1}
                        >
                            <Minus className="w-6 h-6" />
                        </Button>

                        <div className="text-6xl font-light tabular-nums text-black dark:text-white w-32 text-center">
                            {adjustedPace}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-colors text-black dark:text-white"
                            onClick={() => handlePaceChange(1)}
                            disabled={adjustedPace >= 45}
                        >
                            <Plus className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-8 text-center border-t border-neutral-200 dark:border-neutral-800 pt-8">
                <div>
                    <div className="text-3xl font-light mb-1 text-black dark:text-white">{projection.daysNeeded}</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Days Left</div>
                </div>
                <div>
                    <div className="text-3xl font-light mb-1 text-black dark:text-white">{projection.progressPercent}%</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Complete</div>
                </div>
                <div>
                    <div className="text-3xl font-light mb-1 text-black dark:text-white">{(projection.remainingLines / 1000).toFixed(1)}k</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Lines Left</div>
                </div>
            </div>

        </motion.div>
    );
}
