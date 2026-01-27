import { motion } from "framer-motion";
import { ArrowRight, Calculator } from "lucide-react";
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
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg"
        >
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 mb-6">
                    <Calculator className="w-8 h-8 text-fuchsia-400" />
                </div>
                <h1 className="text-4xl font-light tracking-[-0.02em] text-white/90 mb-3">
                    Dynamic Forecasting
                </h1>
                <p className="text-neutral-500 font-light">
                    Calculate your Quran memorization timeline
                </p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-8 space-y-8">
                {/* Script Standard */}
                <div className="space-y-3">
                    <Label className="text-sm text-neutral-400 font-medium">
                        Quran Script Standard
                    </Label>
                    <Select
                        value={String(studentData.quranStandard)}
                        onValueChange={(v) =>
                            setStudentData({ ...studentData, quranStandard: Number(v) as QuranStandard })
                        }
                    >
                        <SelectTrigger className="bg-[#0f0f0f] border-white/10 h-12">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="13">13 Lines (Indo-Pak)</SelectItem>
                            <SelectItem value="15">15 Lines (Standard)</SelectItem>
                            <SelectItem value="16">16 Lines (Uthmani)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Current Position */}
                <div className="space-y-3">
                    <Label className="text-sm text-neutral-400 font-medium">
                        Current Position
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-xs text-neutral-500">Juz</span>
                            <Select
                                value={String(studentData.currentJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-[#0f0f0f] border-white/10 h-12">
                                    <SelectValue />
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
                            <span className="text-xs text-neutral-500">Page in Juz</span>
                            <Select
                                value={String(studentData.currentPageInJuz)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, currentPageInJuz: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-[#0f0f0f] border-white/10 h-12">
                                    <SelectValue />
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

                {/* Capacity */}
                <div className="space-y-3">
                    <Label className="text-sm text-neutral-400 font-medium">
                        Memorization Capacity
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-xs text-neutral-500">Lines per Day</span>
                            <Select
                                value={String(studentData.avgLinesPerDay)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, avgLinesPerDay: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-[#0f0f0f] border-white/10 h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 45 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {i + 1} line{i !== 0 ? "s" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs text-neutral-500">Days per Week</span>
                            <Select
                                value={String(studentData.daysPerWeek)}
                                onValueChange={(v) =>
                                    setStudentData({ ...studentData, daysPerWeek: Number(v) })
                                }
                            >
                                <SelectTrigger className="bg-[#0f0f0f] border-white/10 h-12">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {i + 1} day{i !== 0 ? "s" : ""}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onCalculate}
                    className="w-full h-12 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-medium"
                >
                    Calculate Projection
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
}
