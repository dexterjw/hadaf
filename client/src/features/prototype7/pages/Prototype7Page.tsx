import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { AnimatePresence } from "framer-motion";

import WizardView from "../components/WizardView";
import DashboardView from "../components/DashboardView";
import { calculateProjection, calculateSimpleProjection } from "../utils";
import { 
    StudentData, 
    AdvancedSettings, 
    DEFAULT_VELOCITY_PHASES, 
    DEFAULT_HOLIDAYS 
} from "../types";

export default function Prototype7Page() {
    const [step, setStep] = useState<"wizard" | "dashboard">("wizard");
    const [studentData, setStudentData] = useState<StudentData>({
        quranStandard: 15,
        currentJuz: 1,
        currentPageInJuz: 1,
        avgLinesPerDay: 5,
        daysPerWeek: 5,
    });
    const [adjustedPace, setAdjustedPace] = useState(5);
    const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
        velocityPhases: DEFAULT_VELOCITY_PHASES,
        holidays: DEFAULT_HOLIDAYS,
        sickDaysPerYear: 10,
    });

    // Base projection uses the wizard's input pace
    const baseProjection = useMemo(
        () => calculateProjection(studentData, studentData.avgLinesPerDay, advancedSettings),
        [studentData, advancedSettings]
    );

    // Adjusted projection uses the slider pace (simple mode for real-time simulation)
    const adjustedProjection = useMemo(
        () => calculateSimpleProjection(studentData, adjustedPace, advancedSettings),
        [studentData, adjustedPace, advancedSettings]
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
        setAdvancedSettings({
            velocityPhases: DEFAULT_VELOCITY_PHASES,
            holidays: DEFAULT_HOLIDAYS,
            sickDaysPerYear: 10,
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-sans selection:bg-white/20">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[60vw] h-[50vh] bg-emerald-500/5 blur-[180px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vh] bg-blue-500/5 blur-[150px] rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 p-6 flex justify-between items-center border-b border-neutral-800/50">
                <Link href="/labs">
                    <Button variant="ghost" size="sm" className="gap-2 text-neutral-500 hover:text-white transition-colors">
                        ← Labs
                    </Button>
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-700/50 bg-neutral-900/50">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-medium text-neutral-300">Integrated</span>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500">Prototype 7</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10 overflow-hidden">
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
                            advancedSettings={advancedSettings}
                            setAdvancedSettings={setAdvancedSettings}
                            onReset={handleReset}
                        />
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
