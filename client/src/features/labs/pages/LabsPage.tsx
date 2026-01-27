import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Rocket, Zap } from "lucide-react";

export default function LabsPage() {
    const prototypes = [
        {
            id: "p1",
            name: "Prototype 1",
            description: "Timeline-driven goal tracking with habit streaks and analytics",
            status: "Active",
            icon: Sparkles,
            route: "/labs/p1",
            gradient: "from-blue-500/20 to-purple-500/20",
        },
        {
            id: "p2",
            name: "Prototype 2",
            description: "Coming soon - Next iteration of the tracking experience",
            status: "Coming Soon",
            icon: Rocket,
            route: "/labs/p2",
            gradient: "from-green-500/20 to-teal-500/20",
        },
        {
            id: "p3",
            name: "Prototype 3",
            description: "Coming soon - Future experimental features",
            status: "Coming Soon",
            icon: Zap,
            route: "/labs/p3",
            gradient: "from-orange-500/20 to-pink-500/20",
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl mx-auto z-10 space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                        Labs
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experimental prototypes exploring different approaches to goal tracking and habit formation
                    </p>
                </div>

                {/* Prototype Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {prototypes.map((prototype) => {
                        const Icon = prototype.icon;
                        const isActive = prototype.status === "Active";

                        return (
                            <Card
                                key={prototype.id}
                                className={`relative overflow-hidden border-2 transition-all duration-300 ${isActive
                                        ? "hover:shadow-lg hover:scale-[1.02] cursor-pointer border-primary/20"
                                        : "opacity-60 border-muted"
                                    }`}
                            >
                                <Link href={prototype.route}>
                                    <div className="p-6 space-y-4">
                                        {/* Gradient background */}
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-br ${prototype.gradient} opacity-50`}
                                        />

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="p-3 rounded-lg bg-background/80 backdrop-blur-sm border">
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${isActive
                                                            ? "bg-primary/20 text-primary border border-primary/30"
                                                            : "bg-muted text-muted-foreground border border-muted-foreground/30"
                                                        }`}
                                                >
                                                    {prototype.status}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-semibold mb-2">
                                                {prototype.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                {prototype.description}
                                            </p>

                                            {isActive && (
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="w-full justify-between group"
                                                    >
                                                        <span>Explore</span>
                                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        );
                    })}
                </div>

                {/* Footer note */}
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Each prototype explores different concepts and user experiences.{" "}
                        <span className="text-foreground font-medium">Prototype 1</span> is currently available for testing.
                    </p>
                </div>
            </div>
        </div>
    );
}
