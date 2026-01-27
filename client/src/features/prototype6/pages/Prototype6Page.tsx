import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Spline } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection } from "../utils";
import { StudentData } from "../types";

export default function Prototype6Page() {
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
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
            {/* Force Dark Mode Wrapper if needed, but assuming global dark mode. 
                I'll explicitly add 'dark' class to wrapper just in case. */}
            <div className="absolute inset-0 dark bg-black text-white flex flex-col">

                {/* Header - Absolute Minimalist */}
                <header className="relative z-10 p-12 flex justify-between items-start">
                    <Link href="/labs">
                        <Button variant="link" className="p-0 text-neutral-500 hover:text-white dark:hover:text-white font-medium text-sm tracking-wide transition-colors">
                            ← LABS
                        </Button>
                    </Link>
                    <div className="bg-white text-black px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full">
                        Minimalist
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 flex items-center justify-center relative z-10">
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
        </div>
    );
}
