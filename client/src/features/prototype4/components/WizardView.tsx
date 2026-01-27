import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StudentData, QuranStandard } from "../types";
import { cn } from "@/lib/utils";

interface WizardViewProps {
    studentData: StudentData;
    setStudentData: (data: StudentData) => void;
    onCalculate: () => void;
}

const SCRIPT_OPTIONS: { value: QuranStandard; label: string; description: string }[] = [
    { value: 13, label: "13-Line", description: "Indo-Pak" },
    { value: 15, label: "15-Line", description: "Standard" },
    { value: 16, label: "16-Line", description: "Uthmani" },
];

const DAYS_OPTIONS: (4 | 5 | 6 | 7)[] = [4, 5, 6, 7];

export default function WizardView({ studentData, setStudentData, onCalculate }: WizardViewProps) {
    return (
        <motion.div
            key="wizard-p4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl"
        >
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                    <CalendarRange className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-5xl font-light tracking-tight text-white/90 mb-4">
                    Hifdh Timeline Planner
                </h1>
                <p className="text-lg text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
                    Configure your memorization journey and see when you'll complete.
                </p>
            </div>

            {/* Wizard Card */}
            <div className="bg-[#0a0a0a] border border-cyan-500/10 rounded-3xl p-10 shadow-2xl shadow-cyan-900/5 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="space-y-10 relative z-10">
                    
                    {/* Step 1: Script Selection - Card Based */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold ring-1 ring-cyan-500/40">
                                1
                            </span>
                            <div>
                                <Label className="text-base text-white font-medium">Quran Standard</Label>
                                <p className="text-sm text-neutral-500">Select your mushaf line format</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            {SCRIPT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setStudentData({ ...studentData, quranStandard: option.value })}
                                    className={cn(
                                        "relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group",
                                        studentData.quranStandard === option.value
                                            ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                                            : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                                        studentData.quranStandard === option.value
                                            ? "border-cyan-500 bg-cyan-500"
                                            : "border-white/30"
                                    )}>
                                        {studentData.quranStandard === option.value && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="w-2 h-2 bg-white rounded-full"
                                            />
                                        )}
                                    </div>
                                    
                                    <BookOpen className={cn(
                                        "w-6 h-6 mb-3 transition-colors",
                                        studentData.quranStandard === option.value
                                            ? "text-cyan-400"
                                            : "text-neutral-500 group-hover:text-neutral-400"
                                    )} />
                                    
                                    <div className={cn(
                                        "text-xl font-semibold mb-1 transition-colors",
                                        studentData.quranStandard === option.value
                                            ? "text-white"
                                            : "text-neutral-300"
                                    )}>
                                        {option.label}
                                    </div>
                                    <div className="text-sm text-neutral-500">
                                        {option.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Current Position */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold ring-1 ring-cyan-500/40">
                                2
                            </span>
                            <div>
                                <Label className="text-base text-white font-medium">Current Progress</Label>
                                <p className="text-sm text-neutral-500">Your current Juz and page position</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 max-w-md">
                            <div className="space-y-2">
                                <Label className="text-xs text-neutral-400 uppercase tracking-wide">Current Juz</Label>
                                <Select
                                    value={String(studentData.currentJuz)}
                                    onValueChange={(v) =>
                                        setStudentData({ ...studentData, currentJuz: Number(v) })
                                    }
                                >
                                    <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14 text-lg">
                                        <SelectValue placeholder="Juz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <SelectItem key={i + 1} value={String(i + 1)}>
                                                Juz {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs text-neutral-400 uppercase tracking-wide">Page in Juz</Label>
                                <Select
                                    value={String(studentData.currentPageInJuz)}
                                    onValueChange={(v) =>
                                        setStudentData({ ...studentData, currentPageInJuz: Number(v) })
                                    }
                                >
                                    <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14 text-lg">
                                        <SelectValue placeholder="Page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 20 }, (_, i) => (
                                            <SelectItem key={i + 1} value={String(i + 1)}>
                                                Page {i + 1}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Capacity */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold ring-1 ring-cyan-500/40">
                                3
                            </span>
                            <div>
                                <Label className="text-base text-white font-medium">Learning Capacity</Label>
                                <p className="text-sm text-neutral-500">Your daily pace and weekly schedule</p>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Active Days - Button Row */}
                            <div className="space-y-3">
                                <Label className="text-xs text-neutral-400 uppercase tracking-wide">Days per Week</Label>
                                <div className="flex gap-2">
                                    {DAYS_OPTIONS.map((days) => (
                                        <button
                                            key={days}
                                            onClick={() => setStudentData({ ...studentData, daysPerWeek: days })}
                                            className={cn(
                                                "flex-1 h-14 rounded-xl font-semibold text-lg transition-all duration-200",
                                                studentData.daysPerWeek === days
                                                    ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                                                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white border border-white/10"
                                            )}
                                        >
                                            {days}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Lines per Day */}
                            <div className="space-y-3 max-w-xs">
                                <Label className="text-xs text-neutral-400 uppercase tracking-wide">Lines per Day</Label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={45}
                                        value={studentData.avgLinesPerDay}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            setStudentData({ 
                                                ...studentData, 
                                                avgLinesPerDay: Math.min(45, Math.max(1, val))
                                            });
                                        }}
                                        className="bg-neutral-900/50 border-white/10 h-14 text-lg pr-20"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                                        lines/day
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-10 pt-10 border-t border-white/5 flex justify-end">
                    <Button
                        onClick={onCalculate}
                        className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                    >
                        Generate Forecast
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
