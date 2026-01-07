import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuranSelector } from "./QuranSelector";
import { CalendarIcon, Bookmark, BookOpen, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function LogSabak() {
  const [logType, setLogType] = useState<"sabak" | "manzil">("sabak");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null);

  const handleSubmit = () => {
    // Logic to save log would go here
    console.log("Logging:", { logType, date, selectedRange });
    // Reset or show success
    setSelectedRange(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Panel: Configuration */}
      <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
        <Card className="border-muted/40 shadow-sm">
          <CardHeader>
            <CardTitle>Log Progress</CardTitle>
            <CardDescription>Record your daily memorization or revision.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Type Selection */}
            <div className="space-y-3">
              <Label>Activity Type</Label>
              <RadioGroup 
                defaultValue="sabak" 
                value={logType} 
                onValueChange={(v) => setLogType(v as "sabak" | "manzil")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="sabak" id="sabak" className="peer sr-only" />
                  <Label
                    htmlFor="sabak"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <Bookmark className="mb-3 h-6 w-6 text-emerald-500" />
                    <span className="font-semibold">Sabak</span>
                    <span className="text-xs text-muted-foreground mt-1">New Memorization</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="manzil" id="manzil" className="peer sr-only" />
                  <Label
                    htmlFor="manzil"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                  >
                    <RotateCcw className="mb-3 h-6 w-6 text-amber-500" />
                    <span className="font-semibold">Manzil</span>
                    <span className="text-xs text-muted-foreground mt-1">Revision</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Location Context */}
            <div className="space-y-2">
                <Label>Juz / Surah</Label>
                <Select defaultValue="yasin">
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yasin">Surah Yasin (Juz 22-23)</SelectItem>
                    <SelectItem value="mulk">Surah Al-Mulk (Juz 29)</SelectItem>
                    <SelectItem value="kahf">Surah Al-Kahf (Juz 15)</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Summary of Selection */}
            {selectedRange && (
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20 animate-in fade-in slide-in-from-top-2">
                    <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Ready to Log
                    </h4>
                    <p className="text-sm text-foreground/80">
                        {logType === 'sabak' ? 'Memorized' : 'Reviewed'} <span className="font-bold">{selectedRange.end - selectedRange.start + 1} verses</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Surah Yasin • Ayah {selectedRange.start} - {selectedRange.end}
                    </p>
                    <Button onClick={handleSubmit} className="w-full mt-4">
                        Save Log
                    </Button>
                </div>
            )}

          </CardContent>
        </Card>
        
        {/* Tip Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg p-4 border border-indigo-500/10 text-xs text-muted-foreground">
            <p className="flex gap-2">
                <BookOpen className="w-4 h-4 shrink-0 text-indigo-500" />
                <span>
                    <strong>Pro Tip:</strong> Tap the start verse, then tap the end verse to quickly select a range.
                </span>
            </p>
        </div>
      </div>

      {/* Right Panel: Quran Selector */}
      <div className="lg:col-span-8 h-full min-h-[500px]">
        <QuranSelector onSelectionComplete={setSelectedRange} />
      </div>
    </div>
  );
}

// Missing icon import helper
import { CheckCircle2 } from "lucide-react";
