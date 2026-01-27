import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Rocket } from "lucide-react";

export default function Prototype2Page() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-md mx-auto text-center space-y-6 z-10">
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                        <Rocket className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">Prototype 2</h1>
                    <p className="text-lg text-muted-foreground">
                        This prototype is currently under development.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Check back soon for the next iteration of the tracking experience.
                    </p>
                </div>

                <div className="pt-6">
                    <Link href="/labs">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Labs
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
