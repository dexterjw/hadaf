import { useState } from "react";
import { Check, Plus, Sun, Moon, Activity, ShowerHead, Coffee, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TimelineEvent {
    id: string;
    title: string;
    time: string;
    duration: string;
    icon: React.ReactNode;
    color: string; // Tailwind color class for background/border accents
    textColor: string;
    completed: boolean;
}

export function DayAtAGlance() {
    const [events, setEvents] = useState<TimelineEvent[]>([
        {
            id: "1",
            title: "Morning Workout",
            time: "07:45 - 08:15",
            duration: "30 min",
            icon: <Activity className="w-5 h-5" />,
            color: "bg-pink-500",
            textColor: "text-pink-600",
            completed: true,
        },
        {
            id: "2",
            title: "Shower",
            time: "08:15 - 08:30",
            duration: "15 min",
            icon: <ShowerHead className="w-5 h-5" />,
            color: "bg-blue-500",
            textColor: "text-blue-600",
            completed: false,
        },
        {
            id: "3",
            title: "Breakfast",
            time: "08:30 - 09:00",
            duration: "30 min",
            icon: <Coffee className="w-5 h-5" />,
            color: "bg-amber-400",
            textColor: "text-amber-600",
            completed: false,
        },
        {
            id: "4",
            title: "Check Email",
            time: "09:00 - 09:15",
            duration: "15 min",
            icon: <Mail className="w-5 h-5" />,
            color: "bg-purple-500",
            textColor: "text-purple-600",
            completed: false,
        },
    ]);

    const toggleEvent = (id: string) => {
        setEvents(events.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 leading-tight">Your day at<br />a glance</h2>
                <p className="mt-2 text-gray-500">Easily view your scheduled time blocks in a clean and efficient timeline format.</p>
            </div>

            <div className="relative pl-4 space-y-6">
                {/* Continuous Timeline Line */}
                <div className="absolute left-[30px] top-4 bottom-10 w-0.5 bg-gray-200" />

                {/* Sun Icon at top */}
                <div className="relative flex items-center mb-6 pl-[10px]">
                    <Sun className="w-5 h-5 text-gray-400" />
                </div>

                {events.map((event, index) => (
                    <div key={event.id} className="relative flex items-start gap-4">
                        {/* Timeline Node */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <div className={cn(
                                "w-10 h-16 rounded-xl flex items-center justify-center shadow-sm text-white",
                                event.color
                            )}>
                                {event.icon}
                            </div>
                            {/* Connection to next node handled by absolute line, but we might need specific spacing */}
                        </div>

                        {/* Time Label (Absolute positioned relative to card/row) */}
                        {index > 0 && (
                            <div className="absolute -top-3 left-[50px] text-xs font-semibold text-gray-400">
                                {event.time.split(" - ")[0]}
                            </div>
                        )}

                        {/* Event Card */}
                        <Card className={cn(
                            "flex-1 p-4 border-0 shadow-sm transition-all",
                            event.completed ? "bg-gray-100" : "bg-gray-50",
                            "hover:shadow-md"
                        )}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className={cn("font-bold text-lg", event.completed && "line-through text-gray-500")}>
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium">
                                        {event.time} <span className="text-gray-400">({event.duration})</span>
                                    </p>
                                </div>
                                <div
                                    className={cn(
                                        "h-6 w-6 rounded border cursor-pointer flex items-center justify-center transition-colors",
                                        event.completed ? event.color : "border-gray-300 bg-white"
                                    )}
                                    onClick={() => toggleEvent(event.id)}
                                >
                                    {event.completed && <Check className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}

                {/* Moon Icon at bottom */}
                <div className="relative flex items-center mt-4 pl-[10px]">
                    <Moon className="w-4 h-4 text-gray-400" />
                </div>

                {/* End of day info + Create Event */}
                <div className="pl-16 pt-2 space-y-3">
                    <p className="text-sm text-gray-500">
                        End of day: 14 hrs, 44 min, 59 secs
                    </p>
                    <Button variant="outline" size="sm" className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white border-0 gap-2">
                        <Plus className="w-4 h-4" /> Create event
                    </Button>
                </div>

            </div>

            <div className="flex justify-between items-center mt-12">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-900 font-medium">
                    Back
                </Button>
                <Button className="bg-[#FF5733] hover:bg-[#FF5733]/90 text-white px-8 rounded-xl font-bold">
                    Continue
                </Button>
            </div>

        </div>
    );
}
