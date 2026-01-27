import { Link } from "wouter";
import { ArrowRight, Sparkles, Rocket, Zap, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LabsPage() {
    const prototypes = [
        {
            id: "p1",
            name: "Hadaf Prototype 1",
            description: "Timeline-driven goal tracking with habit streaks and deep analytics.",
            status: "Live",
            icon: Sparkles,
            route: "/labs/p1",
            color: "bg-blue-500",
            gradient: "from-blue-500/10 via-purple-500/5 to-transparent",
        },
        {
            id: "p2",
            name: "Concept: Neural",
            description: "AI-first tracking experience with predictive behavioral modeling.",
            status: "In Development",
            icon: Rocket,
            route: "/labs/p2",
            color: "bg-emerald-500",
            gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
        },
        {
            id: "p3",
            name: "Project: Void",
            description: "Experimental interface for distraction-free deep work sessions.",
            status: "Planned",
            icon: Zap,
            route: "/labs/p3",
            color: "bg-orange-500",
            gradient: "from-orange-500/10 via-red-500/5 to-transparent",
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-foreground flex flex-col relative overflow-hidden selection:bg-primary/20 font-light">
            {/* Ambient Background & "Spice" */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Top Center Spotlight / "Glue" */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[600px] bg-gradient-to-b from-white/5 to-transparent blur-[120px] mix-blend-soft-light" />

                {/* Subtle colored orbs */}
                <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[100px] mix-blend-screen opacity-30" />
                <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] mix-blend-screen opacity-20" />

                {/* Noise texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] brightness-100 contrast-150" />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-24 relative z-10 flex flex-col items-center justify-center">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center space-y-8 mb-24 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] uppercase tracking-widest text-muted-foreground/70 backdrop-blur-md">
                        <FlaskConical className="w-3 h-3" />
                        <span>Research & Development</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/40 pb-4">
                        Labs
                    </h1>

                    <p className="text-lg text-neutral-400/80 font-extralight leading-relaxed max-w-xl mx-auto tracking-wide">
                        A playground for experimental interfaces and next-generation tracking concepts.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                    {prototypes.map((prototype, index) => {
                        const Icon = prototype.icon;
                        const isLive = prototype.status === "Live";

                        return (
                            <motion.div
                                key={prototype.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, ease: "easeOut" }}
                            >
                                <Link
                                    href={prototype.route}
                                    className={cn(
                                        "group relative block h-full overflow-hidden rounded-[2rem] bg-neutral-900/20 border border-white/5 transition-all duration-700 backdrop-blur-sm",
                                        isLive ? "hover:border-white/10 hover:bg-neutral-900/40 cursor-pointer" : "opacity-50 cursor-not-allowed hover:opacity-60"
                                    )}
                                >
                                    {/* Hover Gradient Spotlight */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-b",
                                            prototype.gradient
                                        )}
                                    />

                                    <div className="relative p-8 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-10">
                                            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05] group-hover:bg-white/[0.05] transition-colors duration-500">
                                                <Icon className="w-5 h-5 text-neutral-300" strokeWidth={1.5} />
                                            </div>
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium border",
                                                isLive
                                                    ? "bg-white/[0.03] text-neutral-300 border-white/[0.05]"
                                                    : "bg-transparent text-neutral-600 border-transparent"
                                            )}>
                                                {prototype.status}
                                            </span>
                                        </div>

                                        <div className="space-y-4 mb-8 flex-1">
                                            <h3 className="text-2xl font-light tracking-tight text-neutral-100 group-hover:text-white transition-colors">
                                                {prototype.name}
                                            </h3>
                                            <p className="text-neutral-500 leading-relaxed text-sm font-extralight tracking-wide">
                                                {prototype.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center text-xs font-medium tracking-widest uppercase text-neutral-600 group-hover:text-neutral-300 transition-colors">
                                            <span>{isLive ? "Enter Prototype" : "Awaiting Access"}</span>
                                            {isLive && (
                                                <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="mt-32 text-center"
                >
                    <p className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-light opacity-50">
                        Ideaverse Research Logic • Est. 2024
                    </p>
                </motion.div>
            </main>
        </div>
    );
}

