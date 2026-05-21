import { motion } from "framer-motion";
import { Check, Plus, Target } from "lucide-react";
import { useState } from "react";

interface Goal {
  id: number;
  text: string;
  done: boolean;
}

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
  const toggle = (id: number) =>
    setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const done = goals.filter((g) => g.done).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Today</div>
          <h3 className="text-base font-semibold mt-1">Goals</h3>
        </div>
        <div className="text-xs font-mono text-muted-foreground">
          {done}/{goals.length}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a goal…"
          className="input-bare"
        />
        <button onClick={add} className="btn-ghost !p-2.5">
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-1">
        {goals.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Target className="mx-auto mb-2 opacity-50" size={20} />
            No goals yet.
          </div>
        )}
        {goals.map((g) => (
          <motion.button
            key={g.id}
            layout
            onClick={() => toggle(g.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.04] transition text-left"
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center transition shrink-0 ${
                g.done ? "bg-foreground border-foreground" : "border-white/25"
              }`}
            >
              {g.done && <Check size={10} className="text-background" strokeWidth={3} />}
            </div>
            <span
              className={`text-sm flex-1 ${
                g.done ? "line-through text-muted-foreground" : "text-foreground/90"
              }`}
            >
              {g.text}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
