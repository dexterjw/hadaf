import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface DailyActionCardProps {
  onAction: (type: "hit" | "miss" | "partial") => void;
}

export function DailyActionCard({ onAction }: DailyActionCardProps) {
  return (
    <motion.div 
      layout
      className="bg-card border border-border/50 rounded-2xl p-6 shadow-2xl w-full max-w-md mx-auto"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-muted-foreground text-sm uppercase tracking-wider font-medium mb-1">Today's Target</h3>
          <div className="font-display text-3xl font-bold">Page 142</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Manzil</div>
          <div className="font-mono text-xl">25m</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <ActionButton 
          type="miss" 
          icon={<X className="w-6 h-6" />} 
          label="Missed" 
          onClick={() => onAction("miss")} 
        />
        <ActionButton 
          type="partial" 
          icon={<Minus className="w-6 h-6" />} 
          label="Partial" 
          onClick={() => onAction("partial")} 
        />
        <ActionButton 
          type="hit" 
          icon={<Check className="w-6 h-6" />} 
          label="Hit" 
          onClick={() => onAction("hit")} 
        />
      </div>
    </motion.div>
  );
}

function ActionButton({ type, icon, label, onClick }: { type: string, icon: any, label: string, onClick: () => void }) {
  const styles = {
    miss: "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20",
    partial: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border",
    hit: "bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground border-accent/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-6 rounded-xl border transition-all duration-200 gap-2",
        // @ts-ignore
        styles[type]
      )}
    >
      {icon}
      <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
    </motion.button>
  );
}
