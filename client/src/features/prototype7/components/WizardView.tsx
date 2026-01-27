import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { StudentData, QuranStandard } from "../types";
import { useState } from "react";

interface WizardViewProps {
    studentData: StudentData;
    setStudentData: (data: StudentData) => void;
    onCalculate: () => void;
}

const QURAN_OPTIONS: { value: QuranStandard; label: string; description: string }[] = [
    { value: 13, label: "13-Line", description: "Indo-Pak Script" },
    { value: 15, label: "15-Line", description: "Standard" },
    { value: 16, label: "16-Line", description: "Uthmani" },
];

const DAYS_OPTIONS = [4, 5, 6, 7];

export default function WizardView({ studentData, setStudentData, onCalculate }: WizardViewProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: "Script Selection", description: "Choose your Mushaf type" },
        { title: "Current Progress", description: "Where are you now?" },
        { title: "Learning Capacity", description: "Set your pace" },
    ];

    const handleNext = () => {
        if (currentStep < 2) {
            setCurrentStep(currentStep + 1);
        } else {
            onCalculate();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 0:
                return true; // Script always has a default
            case 1:
                return studentData.currentJuz >= 1 && studentData.currentJuz <= 30;
            case 2:
                return studentData.avgLinesPerDay >= 1 && studentData.daysPerWeek >= 4;
            default:
                return true;
        }
    };

    return (
        <motion.div
            key="wizard-p7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto px-6"
        >
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-3 mb-12">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <button
                            onClick={() => index < currentStep && setCurrentStep(index)}
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                                index === currentStep
                                    ? "bg-white text-black scale-110"
                                    : index < currentStep
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30"
                                    : "bg-neutral-800/50 text-neutral-500 border border-neutral-700/50"
                            )}
                        >
                            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                        </button>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "w-12 h-0.5 transition-colors duration-300",
                                index < currentStep ? "bg-emerald-500/50" : "bg-neutral-700/50"
                            )} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Title */}
            <div className="text-center mb-10">
                <motion.h2
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-light text-white mb-2"
                >
                    {steps[currentStep].title}
                </motion.h2>
                <p className="text-neutral-500 text-sm">{steps[currentStep].description}</p>
            </div>

            {/* Step Content */}
            <motion.div
                key={`content-${currentStep}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="min-h-[280px]"
            >
                {currentStep === 0 && (
                    <div className="grid grid-cols-3 gap-4">
                        {QURAN_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setStudentData({ ...studentData, quranStandard: option.value })}
                                className={cn(
                                    "p-6 rounded-2xl border-2 transition-all duration-300 text-left",
                                    studentData.quranStandard === option.value
                                        ? "border-white bg-white/10 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]"
                                        : "border-neutral-700/50 bg-neutral-900/50 hover:border-neutral-600"
                                )}
                            >
                                <div className={cn(
                                    "text-4xl font-light mb-3 transition-colors",
                                    studentData.quranStandard === option.value ? "text-white" : "text-neutral-400"
                                )}>
                                    {option.value}
                                </div>
                                <div className="text-sm font-medium text-white mb-1">{option.label}</div>
                                <div className="text-xs text-neutral-500">{option.description}</div>
                            </button>
                        ))}
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-neutral-400 text-sm">Current Juz</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={studentData.currentJuz}
                                    onChange={(e) => setStudentData({ 
                                        ...studentData, 
                                        currentJuz: Math.min(30, Math.max(1, parseInt(e.target.value) || 1))
                                    })}
                                    className="h-14 text-2xl font-light bg-neutral-900/50 border-neutral-700 text-white text-center"
                                />
                                <p className="text-xs text-neutral-500 text-center">of 30</p>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-neutral-400 text-sm">Page in Juz</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={studentData.currentPageInJuz}
                                    onChange={(e) => setStudentData({ 
                                        ...studentData, 
                                        currentPageInJuz: Math.min(20, Math.max(1, parseInt(e.target.value) || 1))
                                    })}
                                    className="h-14 text-2xl font-light bg-neutral-900/50 border-neutral-700 text-white text-center"
                                />
                                <p className="text-xs text-neutral-500 text-center">of 20</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-neutral-800/30 border border-neutral-700/50">
                            <div className="text-xs text-neutral-500 mb-1">Overall Progress</div>
                            <div className="text-2xl font-light text-white">
                                {Math.round(((studentData.currentJuz - 1) * 20 + studentData.currentPageInJuz) / 604 * 100)}%
                                <span className="text-sm text-neutral-500 ml-2">
                                    ({(studentData.currentJuz - 1) * 20 + studentData.currentPageInJuz} of 604 pages)
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <Label className="text-neutral-400 text-sm">Active Days per Week</Label>
                            <div className="flex gap-3">
                                {DAYS_OPTIONS.map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setStudentData({ ...studentData, daysPerWeek: days })}
                                        className={cn(
                                            "flex-1 h-14 rounded-xl font-medium text-lg transition-all duration-300",
                                            studentData.daysPerWeek === days
                                                ? "bg-white text-black"
                                                : "bg-neutral-800/50 text-neutral-400 border border-neutral-700 hover:border-neutral-500"
                                        )}
                                    >
                                        {days}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-neutral-400 text-sm">Base Pace (Lines per Day)</Label>
                            <Input
                                type="number"
                                min={1}
                                max={45}
                                value={studentData.avgLinesPerDay}
                                onChange={(e) => setStudentData({ 
                                    ...studentData, 
                                    avgLinesPerDay: Math.min(45, Math.max(1, parseInt(e.target.value) || 5))
                                })}
                                className="h-14 text-2xl font-light bg-neutral-900/50 border-neutral-700 text-white text-center"
                            />
                            {studentData.avgLinesPerDay > 25 && (
                                <p className="text-xs text-amber-400 text-center">
                                    High pace - consider burnout risk
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="text-neutral-500 hover:text-white disabled:opacity-30"
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-white text-black hover:bg-neutral-200 px-8 h-12 rounded-full gap-2 disabled:opacity-50"
                >
                    {currentStep === 2 ? "Generate Forecast" : "Continue"}
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </motion.div>
    );
}
