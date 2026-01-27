import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { StudentData, QuranStandard } from "../types";

interface WizardViewProps {
    studentData: StudentData;
    setStudentData: (data: StudentData) => void;
    onCalculate: () => void;
}

const QURAN_OPTIONS: { value: QuranStandard; label: string }[] = [
    { value: 13, label: "13-Line" },
    { value: 15, label: "15-Line" },
    { value: 16, label: "16-Line" },
];

export default function WizardView({ studentData, setStudentData, onCalculate }: WizardViewProps) {
    const totalPages = 604;
    const currentPage = (studentData.currentJuz - 1) * 20 + studentData.currentPageInJuz;
    const progressPercent = Math.round((currentPage / totalPages) * 100);

    return (
        <motion.div
            key="wizard-p8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-3xl mx-auto px-8"
        >
            {/* Hero */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 mb-6"
                >
                    <BookOpen className="w-4 h-4 text-sky-400" />
                    <span className="text-sm text-sky-300">Hifdh Timeline Planner</span>
                </motion.div>
                
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-light text-white tracking-tight mb-4"
                >
                    Visualize Your Journey
                </motion.h1>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-neutral-400 text-lg max-w-lg mx-auto"
                >
                    Set your parameters and see your personalized memorization timeline
                </motion.p>
            </div>

            {/* Configuration Cards */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
            >
                {/* Script Selection */}
                <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 rounded-2xl border border-neutral-800/60 p-6">
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                        Mushaf Standard
                    </h3>
                    <div className="flex gap-2">
                        {QURAN_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStudentData({ ...studentData, quranStandard: option.value })}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300",
                                    studentData.quranStandard === option.value
                                        ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                                        : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Days Per Week */}
                <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 rounded-2xl border border-neutral-800/60 p-6">
                    <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-4">
                        Active Days / Week
                    </h3>
                    <div className="flex gap-2">
                        {[4, 5, 6, 7].map((days) => (
                            <button
                                key={days}
                                onClick={() => setStudentData({ ...studentData, daysPerWeek: days })}
                                className={cn(
                                    "flex-1 py-3 rounded-xl text-lg font-medium transition-all duration-300",
                                    studentData.daysPerWeek === days
                                        ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                                        : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                )}
                            >
                                {days}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Progress & Pace Sliders */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-neutral-900/80 to-neutral-900/40 rounded-2xl border border-neutral-800/60 p-6 mb-10"
            >
                {/* Current Position */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                            Current Position
                        </h3>
                        <div className="text-right">
                            <span className="text-2xl font-light text-white">Juz {studentData.currentJuz}</span>
                            <span className="text-neutral-500 ml-2">Page {studentData.currentPageInJuz}</span>
                        </div>
                    </div>
                    
                    <Slider
                        value={[currentPage]}
                        onValueChange={(v) => {
                            const page = v[0];
                            const juz = Math.floor((page - 1) / 20) + 1;
                            const pageInJuz = ((page - 1) % 20) + 1;
                            setStudentData({ 
                                ...studentData, 
                                currentJuz: Math.min(30, Math.max(1, juz)),
                                currentPageInJuz: Math.min(20, Math.max(1, pageInJuz))
                            });
                        }}
                        min={1}
                        max={totalPages}
                        step={1}
                        className="mb-2"
                    />
                    
                    <div className="flex justify-between text-xs text-neutral-500">
                        <span>Start</span>
                        <span className="text-sky-400">{progressPercent}% Complete</span>
                        <span>Khatam</span>
                    </div>
                </div>

                {/* Base Pace */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
                            Daily Pace
                        </h3>
                        <div className="text-right">
                            <span className="text-2xl font-light text-white">{studentData.avgLinesPerDay}</span>
                            <span className="text-neutral-500 ml-2">lines/day</span>
                        </div>
                    </div>
                    
                    <Slider
                        value={[studentData.avgLinesPerDay]}
                        onValueChange={(v) => setStudentData({ ...studentData, avgLinesPerDay: v[0] })}
                        min={1}
                        max={45}
                        step={1}
                        className="mb-2"
                    />
                    
                    <div className="flex justify-between text-xs text-neutral-500">
                        <span>Gentle</span>
                        <span className={cn(
                            studentData.avgLinesPerDay > 25 ? "text-amber-400" : "text-neutral-500"
                        )}>
                            {studentData.avgLinesPerDay > 25 ? "High Intensity" : "Moderate"}
                        </span>
                        <span>Intense</span>
                    </div>
                </div>
            </motion.div>

            {/* Generate Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center"
            >
                <Button
                    onClick={onCalculate}
                    size="lg"
                    className="h-14 px-10 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-medium text-lg gap-3 shadow-xl shadow-sky-500/20 transition-all hover:scale-105"
                >
                    Generate Timeline
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </motion.div>
        </motion.div>
    );
}
