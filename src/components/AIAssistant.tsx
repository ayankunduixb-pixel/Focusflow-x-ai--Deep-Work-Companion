import { motion } from "framer-motion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

const tips = [
  "Try a 5-minute brain dump before starting — clear the mental tabs.",
  "After 3 sessions, take a longer 15-minute break. Recovery equals retention.",
  "Drink water now. Mild dehydration drops focus by ~12%.",
  "Hard task first. Willpower is highest in your first two sessions.",
  "Switch sounds when you stall — novelty resets attention.",
  "Stand up, look at the horizon for 20 seconds. Reset your eyes.",
  "4+ hours without a real break? Pause now. Burnout compounds.",
  "Teach what you just learned out loud — it locks in memory.",
];

export function AIAssistant() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % tips.length), 12000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.07] flex items-center justify-center">
            <Sparkles size={13} className="text-foreground" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">AI Coach</div>
            <div className="text-sm font-medium">Flow tips</div>
          </div>
        </div>
        <button onClick={() => setI((v) => (v + 1) % tips.length)} className="btn-ghost !p-2">
          <RefreshCw size={13} />
        </button>
      </div>
      <motion.p
        key={i}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-sm leading-relaxed text-foreground/90 min-h-[60px]"
      >
        {tips[i]}
      </motion.p>
      <div className="mt-4 flex gap-1">
        {tips.map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 flex-1 rounded-full transition ${
              idx === i ? "bg-foreground/70" : "bg-white/8"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
