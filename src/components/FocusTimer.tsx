import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from "lucide-react";

type Mode = "focus" | "break";
const FOCUS = 25 * 60;
const BREAK = 5 * 60;

interface Props {
  onSessionComplete: (xp: number) => void;
  focusActive: boolean;
  setFocusActive: (b: boolean) => void;
}

export function FocusTimer({ onSessionComplete, focusActive, setFocusActive }: Props) {
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(FOCUS);
  const [running, setRunning] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const total = mode === "focus" ? FOCUS : BREAK;
  const progress = 1 - remaining / total;

  const fireComplete = useCallback(() => {
    if (mode === "focus") {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#7c5cff", "#22d3ee", "#c084fc", "#ffffff"],
      });
      setShowComplete(true);
      onSessionComplete(50);
      setMode("break");
      setRemaining(BREAK);
    } else {
      setMode("focus");
      setRemaining(FOCUS);
    }
    setRunning(false);
  }, [mode, onSessionComplete]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(intervalRef.current!);
          fireComplete();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [running, fireComplete]);

  useEffect(() => setFocusActive(running && mode === "focus"), [running, mode, setFocusActive]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") { e.preventDefault(); setRunning((r) => !r); }
      if (e.key.toLowerCase() === "r") { setRunning(false); setRemaining(mode === "focus" ? FOCUS : BREAK); }
      if (e.key.toLowerCase() === "f") setFullscreen((f) => !f);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const ringSize = fullscreen ? 460 : 340;
  const stroke = 14;
  const r = (ringSize - stroke) / 2;
  const C = 2 * Math.PI * r;

  const Timer = (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-6">
        <span className={`text-xs px-3 py-1 rounded-full border ${mode === "focus" ? "bg-primary/20 border-primary/40 text-foreground" : "border-white/10 text-muted-foreground"}`}>Focus 25:00</span>
        <span className={`text-xs px-3 py-1 rounded-full border ${mode === "break" ? "bg-[var(--cyan-glow)]/20 border-[var(--cyan-glow)]/40 text-foreground" : "border-white/10 text-muted-foreground"}`}>Break 05:00</span>
      </div>

      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#7c5cff" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <circle cx={ringSize/2} cy={ringSize/2} r={r} strokeWidth={stroke} fill="none" className="ring-track" />
          <circle
            cx={ringSize/2}
            cy={ringSize/2}
            r={r}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            className="ring-progress"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
            {mode === "focus" ? "Deep Focus" : "Recharge"}
          </div>
          <div className="font-mono text-7xl md:text-8xl font-light tabular-nums">
            {mm}<span className="text-muted-foreground/60">:</span>{ss}
          </div>
          <div className="text-xs text-muted-foreground mt-3 pulse-soft">
            {running ? "● Session in progress" : "○ Paused"}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => setRunning((r) => !r)} className="btn-primary flex items-center gap-2">
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setRunning(false); setRemaining(mode === "focus" ? FOCUS : BREAK); }} className="btn-ghost flex items-center gap-2">
          <RotateCcw size={16} /> Reset
        </button>
        <button onClick={() => setFullscreen((f) => !f)} className="btn-ghost flex items-center gap-2">
          {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {fullscreen ? "Exit" : "Focus mode"}
        </button>
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-4">
        Space = Start/Pause · R = Reset · F = Fullscreen
      </div>
    </div>
  );

  return (
    <>
      <div className="glass-strong p-8 md:p-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative">{Timer}</div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 aurora-bg flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="relative">{Timer}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", damping: 18 }}
              className="glass-strong p-10 max-w-md text-center glow-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-3xl font-display font-semibold text-gradient mb-2">Session Complete</h3>
              <p className="text-muted-foreground mb-6">You earned <span className="text-foreground font-semibold">+50 XP</span>. Discipline compounds — keep stacking sessions.</p>
              <button onClick={() => setShowComplete(false)} className="btn-primary">Take your break</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
