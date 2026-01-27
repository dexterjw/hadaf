import { motion } from "framer-motion";
import { ArrowRight, Disc, BrainCircuit } from "lucide-react";
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
            key="wizard-p5"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="w-full max-w-md relative"
        >
            {/* Pulsing Core Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />

            <div className="bg-black/40 backdrop-blur-xl border border-emerald-500/20 rounded-[3rem] p-10 relative z-10 shadow-[0_0_50px_-10px_rgba(16,185,129,0.15)] flex flex-col items-center text-center space-y-10">

                <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                        <BrainCircuit className="w-8 h-8 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-3xl font-light tracking-wide text-white">
                        Neural Planner
                    </h1>
                </div>

                <div className="w-full space-y-6">
                    {/* Input Group 1 */}
                    <div className="space-y-2">
                        <Label className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                            Configuration
                        </Label>
                        <Select
                            value={String(studentData.quranStandard)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, quranStandard: Number(v) as QuranStandard })
                            }
                        >
                            <SelectTrigger className="bg-white/[0.03] border-emerald-500/20 h-14 rounded-2xl text-center justify-center font-light text-lg hover:bg-emerald-500/10 transition-colors">
                                <SelectValue placeholder="Script Standard" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#050505] border-emerald-500/20">
                                <SelectItem value="13">13 Lines (Indo-Pak)</SelectItem>
                                <SelectItem value="15">15 Lines (Standard)</SelectItem>
                                <SelectItem value="16">16 Lines (Uthmani)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Input Group 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <Select
                            value={String(studentData.currentJuz)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, currentJuz: Number(v) })
                            }
                        >
                            <SelectTrigger className="bg-white/[0.03] border-emerald-500/20 h-14 rounded-2xl text-center justify-center hover:bg-emerald-500/10 transition-colors">
                                <SelectValue placeholder="Juz" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#050505] border-emerald-500/20 h-64">
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
                            <SelectTrigger className="bg-white/[0.03] border-emerald-500/20 h-14 rounded-2xl text-center justify-center hover:bg-emerald-500/10 transition-colors">
                                <SelectValue placeholder="Page" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#050505] border-emerald-500/20 h-64">
                                {Array.from({ length: 20 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>Pg {i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Input Group 3 */}
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-2">
                            <Label className="text-xs text-neutral-500 uppercase tracking-widest">Base Velocity</Label>
                            <span className="text-emerald-400 font-mono text-sm">{studentData.avgLinesPerDay} lines</span>
                        </div>

                        <Select
                            value={String(studentData.avgLinesPerDay)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, avgLinesPerDay: Number(v) })
                            }
                        >
                            <SelectTrigger className="bg-emerald-500/10 border-emerald-500/30 h-16 rounded-2xl text-center justify-center font-medium text-xl text-emerald-400 hover:bg-emerald-500/20 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#050505] border-emerald-500/20 h-64">
                                {Array.from({ length: 45 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} Lines</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button
                    onClick={onCalculate}
                    className="w-full h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                    Initialize System
                </Button>
            </div>
        </motion.div>
    );
}
