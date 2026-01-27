import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealityPanelProps {
  onToggle: (impact: number) => void;
}

export function RealityPanel({ onToggle }: RealityPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-full text-muted-foreground hover:text-foreground text-sm font-medium gap-2 py-4 transition-colors"
      >
        <span>Reality Check</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-secondary/30 rounded-xl p-6 space-y-6 border border-border/50">
              <RealityToggle 
                label="Upcoming Travel" 
                impact={14} 
                onToggle={onToggle}
              />
              <RealityToggle 
                label="Exams / Busy Period" 
                impact={21} 
                onToggle={onToggle}
              />
              <RealityToggle 
                label="Ramadan Adjustment" 
                impact={7} 
                onToggle={onToggle}
              />
              
              <div className="flex items-start gap-3 mt-4 text-xs text-muted-foreground bg-background/50 p-3 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0 text-yellow-500" />
                <p>Toggling these will immediately adjust your finish date based on historical data.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RealityToggle({ label, impact, onToggle }: { label: string, impact: number, onToggle: (days: number) => void }) {
  const [active, setActive] = useState(false);

  const handleToggle = (checked: boolean) => {
    setActive(checked);
    onToggle(checked ? impact : -impact);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <label className="text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <p className="text-xs text-muted-foreground">
          +{impact} days delay
        </p>
      </div>
      <Switch
        checked={active}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
