import { motion } from "framer-motion";
import { Check, Plus, Target } from "lucide-react";
import { useState } from "react";

interface Goal { id: number; text: string; done: boolean; }

export function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, text: "Finish DSA: Graphs chapter", done: true },
    { id: 2, text: "4 deep work sessions", done: false },
    { id: 3, text: "Read 20 pages of textbook", done: false },
  ]);
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    setGoals((g) => [...g, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };
  const toggle = (id: number) => setGoals((g) => g.map((x) => x.id === id ? { ...x, done: !x.done } : x));
  const done = goals.filter((g) => g.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Daily Goals</div>
          <h3 className="text-xl font-display font-semibold mt-1">Today's mission</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Progress</div>
          <div className="font-mono">{done}/{goals.length}</div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a goal…"
          className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm outline-none focus:border-[var(--neon)]/50"
        />
        <button onClick={add} className="btn-ghost !p-2"><Plus size={16} /></button>
      </div>

      <div className="space-y-2">
        {goals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Target className="mx-auto mb-2 opacity-50" size={24} />
            No goals yet. Set one to begin.
          </div>
        )}
        {goals.map((g) => (
          <motion.button
            key={g.id} layout
            onClick={() => toggle(g.id)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition text-left"
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
              g.done ? "bg-[var(--neon)] border-[var(--neon)]" : "border-white/30"
            }`}>
              {g.done && <Check size={12} className="text-background" />}
            </div>
            <span className={`text-sm flex-1 ${g.done ? "line-through text-muted-foreground" : ""}`}>{g.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
