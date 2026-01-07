import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data for Surah Yasin (First 12 verses)
const SURAH_YASIN = [
  { number: 1, text: "يس" },
  { number: 2, text: "وَالْقُرْآنِ الْحَكِيمِ" },
  { number: 3, text: "إِنَّكَ لَمِنَ الْمُرْسَلِينَ" },
  { number: 4, text: "عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ" },
  { number: 5, text: "تَنزِيلَ الْعَزِيزِ الرَّحِيمِ" },
  { number: 6, text: "لِتُنذِرَ قَوْمًا مَّا أُنذِرَ آبَاؤُهُمْ فَهُمْ غَافِلُونَ" },
  { number: 7, text: "lَقَدْ حَقَّ الْقَوْلُ عَلَىٰ أَكْثَرِهِمْ فَهُمْ لَا يُؤْمِنُونَ" },
  { number: 8, text: "إِنَّا جَعَلْنَا فِي أَعْنَاقِهِمْ أَغْلَالًا فَهِيَ إِلَى الْأَذْقَانِ فَهُم مُّقْمَحُونَ" },
  { number: 9, text: "وَجَعَلْنَا مِن بَيْنِ أَيْدِيهِمْ سَدًّا وَمِنْ خَلْفِهِمْ سَدًّا فَأَغْشَيْنَاهُمْ فَهُمْ لَا يُبْصِرُونَ" },
  { number: 10, text: "وَسَوَاءٌ عَلَيْهِمْ أَأَنذَرْتَهُمْ أَمْ لَمْ تُنذِرْهُمْ لَا يُؤْمِنُونَ" },
  { number: 11, text: "إِنَّمَا تُنذِرُ مَنِ اتَّبَعَ الذِّكْرَ وَخَشِيَ الرَّحْمَٰنَ بِالْغَيْبِ ۖ فَبَشِّرْهُ بِمَغْفِرَةٍ وَأَجْرٍ كَرِيمٍ" },
  { number: 12, text: "إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ ۚ وَكُلَّ شَيْءٍ أَحْصَيْنَاهُ فِي إِمَامٍ مُّبِينٍ" },
];

interface QuranSelectorProps {
  onSelectionComplete: (range: { start: number; end: number }) => void;
}

export function QuranSelector({ onSelectionComplete }: QuranSelectorProps) {
  const [range, setRange] = useState<{ start: number | null; end: number | null }>({
    start: null,
    end: null,
  });
  const [hoveredAyah, setHoveredAyah] = useState<number | null>(null);

  const handleAyahClick = (ayahNumber: number) => {
    if (range.start === null) {
      // Start selection
      setRange({ start: ayahNumber, end: null });
    } else if (range.start !== null && range.end === null) {
      // Complete selection (ensure start is before end)
      if (ayahNumber < range.start) {
        setRange({ start: ayahNumber, end: range.start });
      } else {
        setRange({ start: range.start, end: ayahNumber });
      }
    } else {
      // Reset if clicked again
      setRange({ start: ayahNumber, end: null });
    }
  };

  const isSelected = (num: number) => {
    if (range.start !== null && range.end !== null) {
      return num >= range.start && num <= range.end;
    }
    if (range.start !== null) {
      return num === range.start;
    }
    return false;
  };

  const isInPreviewRange = (num: number) => {
    if (range.start !== null && range.end === null && hoveredAyah !== null) {
      const min = Math.min(range.start, hoveredAyah);
      const max = Math.max(range.start, hoveredAyah);
      return num >= min && num <= max;
    }
    return false;
  };

  // Auto-scroll logic could go here, but simple scroll area is fine for now

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold font-display">
            36
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Surah Yasin</h3>
            <p className="text-xs text-muted-foreground">Meccan • 83 Verses</p>
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
             Selection
           </p>
           {range.start ? (
             <div className="flex items-center gap-2 text-sm font-semibold bg-primary/5 px-2 py-1 rounded-md text-primary">
               <span>Ayah {range.start}</span>
               {range.end && (
                 <>
                   <ChevronRight className="w-3 h-3" />
                   <span>Ayah {range.end}</span>
                 </>
               )}
             </div>
           ) : (
             <span className="text-xs text-muted-foreground italic">Tap start ayah</span>
           )}
        </div>
      </div>

      {/* Quran Text Area */}
      <ScrollArea className="flex-1 bg-amber-50/30 dark:bg-zinc-950/30 relative">
        <div className="p-6 md:p-8 space-y-6 dir-rtl" dir="rtl">
          {/* Bismillah */}
          <div className="text-center mb-8 opacity-80 font-amiri text-2xl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>

          <div className="space-y-4">
            {SURAH_YASIN.map((ayah) => {
              const active = isSelected(ayah.number);
              const preview = isInPreviewRange(ayah.number);
              const isStart = range.start === ayah.number;
              const isEnd = range.end === ayah.number;

              return (
                <motion.div
                  key={ayah.number}
                  layoutId={`ayah-${ayah.number}`}
                  className={cn(
                    "relative group cursor-pointer transition-all duration-200 rounded-lg p-3 md:p-4 border-2 border-transparent",
                    active 
                      ? "bg-primary/10 border-primary/20 shadow-sm" 
                      : preview 
                        ? "bg-primary/5 border-dashed border-primary/10" 
                        : "hover:bg-muted/50"
                  )}
                  onClick={() => handleAyahClick(ayah.number)}
                  onMouseEnter={() => setHoveredAyah(ayah.number)}
                  onMouseLeave={() => setHoveredAyah(null)}
                >
                  {/* Selection Indicator Badges */}
                  {(isStart || isEnd) && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
                       <span className={cn(
                         "text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-sm",
                         isStart ? "bg-emerald-500" : "bg-blue-500"
                       )}>
                         {isStart ? "START" : "END"}
                       </span>
                    </div>
                  )}

                  <div className="flex gap-4 items-baseline">
                    {/* Text */}
                    <p className={cn(
                      "flex-1 text-right font-amiri text-2xl md:text-3xl leading-[2.2] text-foreground/90",
                      active && "text-primary font-medium"
                    )}>
                      {ayah.text}
                    </p>
                    
                    {/* Ayah End Marker */}
                    <div className={cn(
                        "flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center text-sm md:text-base font-serif relative",
                        active ? "border-primary text-primary bg-background" : "border-muted-foreground/30 text-muted-foreground/60"
                    )}>
                        {ayah.number.toLocaleString('ar-EG')}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          <div className="text-center py-8 text-muted-foreground text-sm">
            End of Juz 22
          </div>
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-background flex justify-between items-center">
        <Button 
            variant="ghost" 
            onClick={() => setRange({ start: null, end: null })}
            disabled={!range.start}
        >
            Reset
        </Button>
        <Button 
            onClick={() => range.start && range.end && onSelectionComplete({ start: range.start, end: range.end })}
            disabled={!range.start || !range.end}
            className="gap-2 px-8"
        >
            <Check className="w-4 h-4" />
            Confirm Selection
        </Button>
      </div>
    </div>
  );
}
