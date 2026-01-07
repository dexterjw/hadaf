import { LogSabak } from "@/components/hadaf/LogSabak";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { Link } from "wouter";

export default function LogProgressPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-10 w-10 -ml-2 rounded-full hover:bg-muted/50">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Log Progress</h1>
                    <p className="text-muted-foreground">Record your daily memorization or revision.</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium tracking-wide">
                    Q1 GOAL: 1000 VERSES
                 </div>
                 <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Share2 className="w-4 h-4" />
                 </Button>
            </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <LogSabak />
        </div>
      </div>
    </div>
  );
}
