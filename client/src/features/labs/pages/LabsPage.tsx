import { Link } from "wouter";
import { ArrowRight, Sparkles, Rocket, Zap, FlaskConical } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function LabsPage() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the cursor follower
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Dynamic gradient background based on mouse position
    const backgroundStyle = useMotionTemplate`
        radial-gradient(
            600px circle at ${springX}px ${springY}px,
            rgba(255, 255, 255, 0.03),
            transparent 80%
        )
    `;

    const prototypes = [
        {
            id: "p1",
            name: "Hadaf Prototype 1",
            description: "Timeline-driven goal tracking with habit streaks and deep analytics.",
            status: "Live",
            icon: Sparkles,
            route: "/labs/p1",
            // Much subtler gradient usage
            neonColor: "from-cyan-500/10 to-blue-500/10",
        },
        {
            id: "p2",
            name: "Hadaf Prototype 2",
            description: "Comprehensive system with 10+ visualization modes, AI coaching, and deep analytics.",
            status: "Live",
            icon: Rocket,
            route: "/labs/p2",
            neonColor: "from-emerald-500/10 to-teal-500/10",
        },
        {
            id: "p3",
            name: "Project: Void",
            description: "Experimental interface for distraction-free deep work sessions.",
            status: "Planned",
            icon: Zap,
            route: "/labs/p3",
            neonColor: "from-fuchsia-500/10 to-pink-500/10",
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden font-['Space_Grotesk'] selection:bg-white/20">
            {/* Elegant, restrained background */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Mouse Follower Spotlight */}
                <motion.div
                    className="absolute inset-0 z-0 opacity-100 mix-blend-soft-light"
                    style={{ background: backgroundStyle }}
                />

                {/* Very subtle top glow */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[500px] bg-white/[0.03] blur-[150px] rounded-full" />

                {/* Hint of edge texture, but very faint */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/[0.02] blur-[150px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/[0.02] blur-[150px] rounded-full mix-blend-screen" />

                {/* Micro-grain for texture */}
                <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                    style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }} />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-8 py-32 relative z-10 flex flex-col items-center justify-center">

                {/* Header - Minimalist & Clean */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center space-y-8 mb-32 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.01] text-[10px] uppercase tracking-[0.25em] text-neutral-500 backdrop-blur-md">
                        <FlaskConical className="w-3 h-3 text-neutral-400" strokeWidth={1} />
                        <span className="font-medium">Research</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl font-light tracking-[-0.03em] text-white/90">
                        Labs
                    </h1>

                    <p className="text-lg text-neutral-500 font-light leading-relaxed tracking-wide max-w-xl mx-auto">
                        A collection of experimental interfaces and tracking concepts.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
                    {prototypes.map((prototype, index) => {
                        const Icon = prototype.icon;
                        const isLive = prototype.status === "Live";

                        return (
                            <motion.div
                                key={prototype.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.1 + 0.2,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="group h-full"
                            >
                                <Link
                                    href={prototype.route}
                                    className={cn(
                                        "relative block h-full overflow-hidden rounded-[24px] bg-[#0a0a0a] border border-white/[0.04] transition-all duration-700 ease-out",
                                        isLive
                                            ? "hover:border-white/[0.12] hover:bg-[#0c0c0c] cursor-pointer"
                                            : "opacity-40 cursor-not-allowed border-transparent bg-transparent"
                                    )}
                                >
                                    {/* Ultra-subtle spotlight gradient */}
                                    {isLive && (
                                        <div
                                            className={cn(
                                                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-tr",
                                                prototype.neonColor
                                            )}
                                        />
                                    )}

                                    <div className="relative p-10 h-full flex flex-col justify-between">
                                        <div className="space-y-6">
                                            {/* Top Row */}
                                            <div className="flex items-center justify-between">
                                                <div className={cn(
                                                    "p-3 rounded-full border transition-all duration-500",
                                                    isLive
                                                        ? "bg-white/[0.03] border-white/[0.06] group-hover:border-white/[0.1] text-white/80"
                                                        : "bg-transparent border-transparent text-neutral-700"
                                                )}>
                                                    <Icon className="w-5 h-5" strokeWidth={1} />
                                                </div>

                                                {/* Minimal Status Dot */}
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full transition-colors duration-500",
                                                        isLive ? "bg-emerald-500/50 group-hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]" : "bg-neutral-800"
                                                    )} />
                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-medium">
                                                        {isLive ? "Live" : "Soon"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4">
                                                <h3 className="text-2xl font-light tracking-[-0.02em] text-white/90 group-hover:text-white transition-colors">
                                                    {prototype.name}
                                                </h3>
                                                <p className="text-sm text-neutral-500 leading-relaxed font-light tracking-wide group-hover:text-neutral-400 transition-colors">
                                                    {prototype.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Subtle Arrow Reveal */}
                                        <div className="pt-12 flex items-center text-xs font-medium tracking-[0.2em] uppercase text-neutral-700 group-hover:text-white transition-colors duration-700">
                                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-100">
                                                Access
                                            </span>
                                            <ArrowRight className="w-3.5 h-3.5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-[0.19,1,0.22,1]" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-40 opacity-30 hover:opacity-100 transition-opacity duration-700">
                    <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] font-light">
                        Ideaverse Design • 2024
                    </p>
                </div>
            </main>
        </div>
    );
}
