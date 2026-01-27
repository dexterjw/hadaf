import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Command } from "lucide-react"; // Changed icon to Command for a more "system" feel, or maybe just a simple dot? Let's use Command for now as a placeholder for "Control".
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection } from "../utils";
import { StudentData } from "../types";

export default function Prototype5Page() {
    const [step, setStep] = useState<"wizard" | "dashboard">("wizard");
    const [studentData, setStudentData] = useState<StudentData>({
        quranStandard: 15,
        currentJuz: 1,
        currentPageInJuz: 1,
        avgLinesPerDay: 5,
        daysPerWeek: 5,
    });
    const [adjustedPace, setAdjustedPace] = useState(5);

    const baseProjection = useMemo(
        () => calculateProjection(studentData, studentData.avgLinesPerDay),
        [studentData]
    );

    const adjustedProjection = useMemo(
        () => calculateProjection(studentData, adjustedPace),
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
            avgLinesPerDay: 5,
            daysPerWeek: 5,
        });
        setAdjustedPace(5);
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white/20">
            {/* Elegant Background - Deep matte with very subtle light leak */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-neutral-800/20 blur-[150px] rounded-full opacity-50" />
            </div>

            {/* Header - Minimalist */}
            <header className="relative z-10 p-8 flex justify-between items-center">
                <Link href="/labs">
                    <Button variant="ghost" size="sm" className="gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Labs
                    </Button>
                </Link>

                {/* Status Indicator - Subtle */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">Kinetic</span>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
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
                            baseDaysNeeded={baseProjection.daysNeeded}
                            adjustedPace={adjustedPace}
                            setAdjustedPace={setAdjustedPace}
                            quranStandard={studentData.quranStandard}
                            onReset={handleReset}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
