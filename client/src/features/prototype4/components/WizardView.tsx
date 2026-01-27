import { motion } from "framer-motion";
import { ArrowRight, Calculator, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StudentData, QuranStandard } from "../types";

interface WizardViewProps {
    studentData: StudentData;
    setStudentData: (data: StudentData) => void;
    onCalculate: () => void;
}

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
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-6 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                    <CalendarRange className="w-8 h-8 text-cyan-400" />
                </div>
                <h1 className="text-5xl font-light tracking-tight text-white/90 mb-4">
                    Timeline Planner
                </h1>
                <p className="text-lg text-neutral-400 font-light max-w-lg mx-auto leading-relaxed">
                    Map your memorization journey on a visual timeline.
                </p>
            </div>

            <div className="bg-[#0a0a0a] border border-cyan-500/10 rounded-3xl p-10 shadow-2xl shadow-cyan-900/5 backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {/* Step 1 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold ring-1 ring-cyan-500/40">1</span>
                            <Label className="text-sm text-neutral-300 font-medium">Standard</Label>
                        </div>
                        <Select
                            value={String(studentData.quranStandard)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, quranStandard: Number(v) as QuranStandard })
                            }
                        >
                            <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14 text-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="13">13 Lines</SelectItem>
                                <SelectItem value="15">15 Lines</SelectItem>
                                <SelectItem value="16">16 Lines</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold ring-1 ring-cyan-500/40">2</span>
                            <Label className="text-sm text-neutral-300 font-medium">Position</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                value={String(studentData.currentJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14">
                                    <SelectValue placeholder="Juz" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>Juz {i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(studentData.currentPageInJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentPageInJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14">
                                    <SelectValue placeholder="Page" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>Pg {i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold ring-1 ring-cyan-500/40">3</span>
                            <Label className="text-sm text-neutral-300 font-medium">Velocity</Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select
                                value={String(studentData.avgLinesPerDay)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, avgLinesPerDay: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14">
                                    <SelectValue placeholder="Lines" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 45 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} Lines/Day</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(studentData.daysPerWeek)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, daysPerWeek: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-neutral-900/50 border-white/10 h-14">
                                    <SelectValue placeholder="Days" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} Days/Wk</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 flex justify-end">
                    <Button
                        onClick={onCalculate}
                        className="h-14 px-8 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-lg transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
                    >
                        Visualize Timeline
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
