import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LineChart } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection } from "../utils";
import { StudentData, DEFAULT_HOLIDAYS } from "../types";

export default function Prototype8Page() {
    const [step, setStep] = useState<"wizard" | "dashboard">("wizard");
    const [studentData, setStudentData] = useState<StudentData>({
        quranStandard: 15,
        currentJuz: 1,
        currentPageInJuz: 1,
        avgLinesPerDay: 8,
        daysPerWeek: 5,
    });
    const [adjustedPace, setAdjustedPace] = useState(8);

    // Base projection uses wizard input
    const baseProjection = useMemo(
        () => calculateProjection(studentData, studentData.avgLinesPerDay, DEFAULT_HOLIDAYS),
        [studentData]
    );

    // Adjusted projection uses slider
    const adjustedProjection = useMemo(
        () => calculateProjection(studentData, adjustedPace, DEFAULT_HOLIDAYS),
        [studentData, adjustedPace]
    );

    const handleCalculate = () => {
        setAdjustedPace(studentData.avgLinesPerDay);
        setStep("dashboard");
    };

    const handleReset = () => {
        setStep("wizard");
        setStudentData({
            quranStandard: 15,
            currentJuz: 1,
            currentPageInJuz: 1,
            avgLinesPerDay: 8,
            daysPerWeek: 5,
        });
        setAdjustedPace(8);
    };

    return (
        <div className="min-h-screen h-screen bg-[#030303] text-white flex flex-col relative overflow-hidden font-sans selection:bg-sky-500/20">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-sky-500/5 blur-[200px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vh] bg-indigo-500/5 blur-[180px] rounded-full" />
                
                {/* Grid pattern */}
                <div 
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, #fff 1px, transparent 1px),
                            linear-gradient(to bottom, #fff 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 px-6 py-4 flex justify-between items-center">
                <Link href="/labs">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2 text-neutral-500 hover:text-white transition-colors"
                    >
                        ← Labs
                    </Button>
                </Link>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20">
                    <LineChart className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-medium text-white">Visual Timeline</span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 ml-1">P8</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center relative z-10 overflow-hidden">
                <AnimatePresence mode="wait">
                    {step === "wizard" ? (
                        <WizardView
                            key="wizard"
                            studentData={studentData}
                            setStudentData={setStudentData}
                            onCalculate={handleCalculate}
                        />
                    ) : (
                        <DashboardView
                            key="dashboard"
                            projection={adjustedProjection}
                            baseProjection={baseProjection}
                            adjustedPace={adjustedPace}
                            setAdjustedPace={setAdjustedPace}
                            onReset={handleReset}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
