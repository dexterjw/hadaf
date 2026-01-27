import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            key="wizard-p6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl px-6"
        >
            <div className="space-y-12">
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-black dark:text-white leading-[0.9]">
                    Design your plan.
                </h1>

                <div className="space-y-6 text-xl md:text-3xl font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
                    <div className="flex flex-wrap items-baseline gap-3">
                        <span>I am memorizing from a</span>
                        <Select
                            value={String(studentData.quranStandard)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, quranStandard: Number(v) as QuranStandard })
                            }
                        >
                            <SelectTrigger className="w-auto min-w-[140px] h-12 border-0 border-b-2 border-neutral-300 dark:border-neutral-700 bg-transparent rounded-none px-0 text-3xl font-medium text-black dark:text-white focus:ring-0 focus:border-black dark:focus:border-white transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="13">13-line</SelectItem>
                                <SelectItem value="15">15-line</SelectItem>
                                <SelectItem value="16">16-line</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>Mushaf.</span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3">
                        <span>I am currently at Juz</span>
                        <Select
                            value={String(studentData.currentJuz)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, currentJuz: Number(v) })
                            }
                        >
                            <SelectTrigger className="w-auto min-w-[100px] h-12 border-0 border-b-2 border-neutral-300 dark:border-neutral-700 bg-transparent rounded-none px-0 text-3xl font-medium text-black dark:text-white focus:ring-0 focus:border-black dark:focus:border-white transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {Array.from({ length: 30 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>, Page</span>
                        <Select
                            value={String(studentData.currentPageInJuz)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, currentPageInJuz: Number(v) })
                            }
                        >
                            <SelectTrigger className="w-auto min-w-[100px] h-12 border-0 border-b-2 border-neutral-300 dark:border-neutral-700 bg-transparent rounded-none px-0 text-3xl font-medium text-black dark:text-white focus:ring-0 focus:border-black dark:focus:border-white transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {Array.from({ length: 20 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>.</span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3">
                        <span>My average pace is</span>
                        <Select
                            value={String(studentData.avgLinesPerDay)}
                            onValueChange={(v) =>
                                setStudentData({ ...studentData, avgLinesPerDay: Number(v) })
                            }
                        >
                            <SelectTrigger className="w-auto min-w-[100px] h-12 border-0 border-b-2 border-neutral-300 dark:border-neutral-700 bg-transparent rounded-none px-0 text-3xl font-medium text-black dark:text-white focus:ring-0 focus:border-black dark:focus:border-white transition-colors">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {Array.from({ length: 45 }, (_, i) => (
                                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span>lines/day.</span>
                    </div>
                </div>

                <div className="pt-12">
                    <Button
                        onClick={onCalculate}
                        className="h-16 px-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-lg hover:scale-105 transition-transform duration-300"
                    >
                        Review Plan
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
