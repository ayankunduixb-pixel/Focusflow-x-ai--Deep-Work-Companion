import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes: Record<string, string[]> = {
  Discipline: [
    "Discipline is choosing between what you want now and what you want most.",
    "Small disciplines repeated daily lead to great achievements won slowly.",
    "Motivation gets you going. Discipline keeps you growing.",
  ],
  Success: [
    "Success is the sum of small efforts repeated day in and day out.",
    "You don't have to be great to start, but you have to start to be great.",
    "The future depends on what you do today.",
  ],
  Consistency: [
    "Consistency is what transforms average into excellence.",
    "It's not what we do once in a while that shapes our lives, but what we do consistently.",
    "Show up every day. That's the secret.",
  ],
  Coding: [
    "First, solve the problem. Then, write the code.",
    "Code is like humor. When you have to explain it, it's bad.",
    "The best error message is the one that never shows up.",
  ],
  Exams: [
    "Hard work beats talent when talent doesn't work hard.",
    "The expert in anything was once a beginner.",
    "You are one study session away from a better future.",
  ],
};

const categories = Object.keys(quotes);

export function QuoteEngine() {
  const [cat, setCat] = useState("Discipline");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 10000);
    return () => clearInterval(t);
  }, []);

  const list = quotes[cat];
  const quote = list[idx % list.length];

  return (
    <div className="card-surface p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Daily reminder</div>
          <h3 className="text-base font-semibold mt-1">Mindset</h3>
        </div>
        <div className="flex gap-1 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setIdx(0);
              }}
              className={`tab ${c === cat ? "tab-active" : ""}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[88px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={quote}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-xl md:text-2xl font-display font-medium leading-snug tracking-tight text-foreground/95"
          >
            "{quote}"
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
