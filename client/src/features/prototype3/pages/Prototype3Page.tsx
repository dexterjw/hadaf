import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection } from "../utils";
import { StudentData } from "../types";

export default function Prototype3Page() {
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
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-['Space_Grotesk']">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-500/5 rounded-full blur-[150px]" />
                <div
                    className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6">
                <Link href="/labs">
                    <Button variant="ghost" size="sm" className="gap-2 text-neutral-400 hover:text-white hover:bg-white/5">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Labs
                    </Button>
                </Link>
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
                            onReset={handleReset}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
