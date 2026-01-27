import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-sm"
        >
            <div className="space-y-12">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-medium tracking-tight text-white mb-2">
                        Initialize
                    </h1>
                    <p className="text-neutral-500 text-sm">
                        Configure your memorization parameters.
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Input 1 */}
                    <div className="space-y-2">
                        <Label className="text-xs text-neutral-500 font-medium ml-1">Script Standard</Label>
                        <Select
                            value={String(studentData.quranStandard)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, quranStandard: Number(v) as QuranStandard })
                            }
                        >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.05] h-12 rounded-lg text-neutral-200 hover:bg-white/[0.06] transition-colors focus:ring-0 focus:border-white/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-neutral-300">
                                <SelectItem value="13">13 Lines</SelectItem>
                                <SelectItem value="15">15 Lines</SelectItem>
                                <SelectItem value="16">16 Lines</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Inputs 2 & 3 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-neutral-500 font-medium ml-1">Current Juz</Label>
                            <Select
                                value={String(studentData.currentJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-white/[0.03] border-white/[0.05] h-12 rounded-lg text-neutral-200 hover:bg-white/[0.06] transition-colors focus:ring-0 focus:border-white/20">
                                    <SelectValue placeholder="1" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-white/10 text-neutral-300 max-h-[300px]">
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs text-neutral-500 font-medium ml-1">Page</Label>
                            <Select
                                value={String(studentData.currentPageInJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentPageInJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-white/[0.03] border-white/[0.05] h-12 rounded-lg text-neutral-200 hover:bg-white/[0.06] transition-colors focus:ring-0 focus:border-white/20">
                                    <SelectValue placeholder="1" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#111] border-white/10 text-neutral-300 max-h-[300px]">
                                    {Array.from({ length: 20 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Input 4 */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <Label className="text-xs text-neutral-500 font-medium">Average Pace</Label>
                            <span className="text-xs text-emerald-500/80 font-medium">{studentData.avgLinesPerDay} lines/day</span>
                        </div>
                        <Select
                            value={String(studentData.avgLinesPerDay)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, avgLinesPerDay: Number(v) })
                            }
                        >
                            <SelectTrigger className="bg-white/[0.03] border-white/[0.05] h-12 rounded-lg text-neutral-200 hover:bg-white/[0.06] transition-colors focus:ring-0 focus:border-white/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#111] border-white/10 text-neutral-300 max-h-[300px]">
                                {Array.from({ length: 45 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} Lines</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        onClick={onCalculate}
                        className="w-full h-12 rounded-lg bg-white text-black hover:bg-neutral-200 font-medium transition-all"
                    >
                        Proceed
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
