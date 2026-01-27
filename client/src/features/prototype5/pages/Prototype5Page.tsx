import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit } from "lucide-react";
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
        <div className="min-h-screen bg-[#020604] text-white flex flex-col relative overflow-hidden font-['Space_Mono'] selection:bg-emerald-500/30">
            {/* Background effects specific to P5 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
                />

                {/* Tech grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9811a_1px,transparent_1px),linear-gradient(to_bottom,#10b9811a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
            </div>

            {/* Header - Industrial / Sci-Fi Style */}
            <header className="relative z-10 p-8 flex justify-between items-center border-b border-white/[0.05]">
                <Link href="/labs">
                    <Button variant="ghost" size="sm" className="gap-2 text-emerald-500/60 hover:text-emerald-400 hover:bg-emerald-500/10 font-mono tracking-tighter uppercase text-xs">
                        <ArrowLeft className="w-3 h-3" />
                        System.Exit(LABS)
                    </Button>
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-950/20 border border-emerald-500/20 rounded-sm text-[10px] tracking-widest uppercase text-emerald-400 font-bold font-mono">
                    <BrainCircuit className="w-3 h-3" />
                    <span>Prototype V.0.5</span>
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
                            onReset={handleReset}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
