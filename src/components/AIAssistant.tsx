import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const tips = [
  "Try a 5-minute brain dump before starting — clear the mental tabs.",
  "After 3 sessions, take a longer 15-minute break. Recovery = retention.",
  "Drink water now. Dehydration drops focus by ~12%.",
  "Hard task first. Willpower is highest in your first 2 sessions.",
  "Switch sounds when you stall — novelty resets attention.",
  "Stand up, look at the horizon for 20 seconds. Reset your eyes.",
  "Burnout warning: 4+ hours without a real break? Pause now.",
  "Teach what you just learned out loud — locks it in memory.",
];

export function AIAssistant() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % tips.length), 9000);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
      className="glass p-6 relative overflow-hidden"
    >
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-25 blur-3xl" style={{ background: "var(--purple-glow)" }} />
      <div className="flex items-center gap-2 mb-3 relative">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
          <Sparkles size={16} className="text-background" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">AI Assistant</div>
          <div className="text-sm font-medium">Flow Coach</div>
        </div>
      </div>
      <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm leading-relaxed text-foreground/90 relative">
        {tips[i]}
      </motion.p>
      <div className="mt-4 flex gap-1 relative">
        {tips.map((_, idx) => (
          <div key={idx} className={`h-1 flex-1 rounded-full transition ${idx === i ? "bg-[var(--neon)]" : "bg-white/10"}`} />
        ))}
      </div>
    </motion.div>
  );
}
