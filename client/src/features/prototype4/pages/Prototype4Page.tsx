import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection } from "../utils";
import { StudentData, VelocityMatrix, DEFAULT_VELOCITY_MATRIX } from "../types";

export default function Prototype4Page() {
    const [step, setStep] = useState<"wizard" | "dashboard">("wizard");

    const [studentData, setStudentData] = useState<StudentData>({
        quranStandard: 15,
        currentJuz: 1,
        currentPageInJuz: 1,
        avgLinesPerDay: 5,
        daysPerWeek: 5,
    });

    const [adjustedPace, setAdjustedPace] = useState(5);
    const [velocityMatrix, setVelocityMatrix] = useState<VelocityMatrix>(DEFAULT_VELOCITY_MATRIX);

    // Base projection (from wizard inputs, used for delta calculation)
    const baseProjection = useMemo(
        () => calculateProjection(studentData, studentData.avgLinesPerDay, DEFAULT_VELOCITY_MATRIX),
        [studentData]
    );

    // Adjusted projection (from slider and velocity matrix)
    const adjustedProjection = useMemo(
        () => calculateProjection(studentData, adjustedPace, velocityMatrix),
        [studentData, adjustedPace, velocityMatrix]
    );

    const handleCalculate = () => {
        setAdjustedPace(studentData.avgLinesPerDay);
        setVelocityMatrix(DEFAULT_VELOCITY_MATRIX);
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
        setVelocityMatrix(DEFAULT_VELOCITY_MATRIX);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-['Space_Grotesk'] selection:bg-cyan-500/30">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 md:p-8 flex justify-between items-center">
                <Link href="/labs">
                    <Button variant="ghost" size="sm" className="gap-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Labs
                    </Button>
                </Link>
                <div className="px-3 py-1 bg-cyan-950/30 border border-cyan-500/20 rounded-full text-[10px] tracking-widest uppercase text-cyan-400 font-bold">
                    Prototype 4
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-start justify-center px-4 py-8 relative z-10 overflow-y-auto">
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
                            velocityMatrix={velocityMatrix}
                            setVelocityMatrix={setVelocityMatrix}
                            onReset={handleReset}
                            studentData={studentData}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
