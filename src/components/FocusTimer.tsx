import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Play, Pause, RotateCcw, Maximize2, Minimize2, Coffee, Brain } from "lucide-react";

type Mode = "focus" | "break";
const FOCUS = 25 * 60;
const BREAK = 5 * 60;

interface Props {
  onSessionComplete: (xp: number) => void;
  focusActive: boolean;
  setFocusActive: (b: boolean) => void;
}

export function FocusTimer({ onSessionComplete, setFocusActive }: Props) {
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#a78bfa", "#60a5fa", "#ffffff"],
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
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [running, fireComplete]);

  useEffect(() => setFocusActive(running && mode === "focus"), [running, mode, setFocusActive]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key.toLowerCase() === "r") {
        setRunning(false);
        setRemaining(mode === "focus" ? FOCUS : BREAK);
      }
      if (e.key.toLowerCase() === "f") setFullscreen((f) => !f);
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const Ring = ({ size }: { size: number }) => {
    const stroke = size > 400 ? 10 : 8;
    const r = (size - stroke) / 2;
    const C = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 240)" />
            <stop offset="100%" stopColor="oklch(0.7 0.18 295)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" className="ring-track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - progress)}
          className="ring-progress"
        />
      </svg>
    );
  };

  const ModeChips = (
    <div className="inline-flex p-1 rounded-lg bg-white/[0.03] border border-white/[0.07]">
      <button
        onClick={() => { setMode("focus"); setRemaining(FOCUS); setRunning(false); }}
        className={`tab flex items-center gap-1.5 ${mode === "focus" ? "tab-active" : ""}`}
      >
        <Brain size={13} /> Focus · 25m
      </button>
      <button
        onClick={() => { setMode("break"); setRemaining(BREAK); setRunning(false); }}
        className={`tab flex items-center gap-1.5 ${mode === "break" ? "tab-active" : ""}`}
      >
        <Coffee size={13} /> Break · 5m
      </button>
    </div>
  );

  const TimerInner = ({ size }: { size: number }) => (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <Ring size={size} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {mode === "focus" ? "Deep focus" : "Recharge"}
          </div>
          <div className="font-mono font-light tabular-nums" style={{ fontSize: size * 0.2 }}>
            {mm}<span className="text-muted-foreground/40">:</span>{ss}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span
              className={`w-1.5 h-1.5 rounded-full ${running ? "bg-emerald-400 pulse-soft" : "bg-white/20"}`}
            />
            {running ? "In session" : "Paused"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="card-elevated p-6 md:p-10 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="relative flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Session</div>
              <div className="text-sm font-medium mt-0.5">Pomodoro</div>
            </div>
            {ModeChips}
          </div>

          <TimerInner size={300} />

          <div className="flex flex-wrap gap-2 justify-center mt-8">
            <button onClick={() => setRunning((r) => !r)} className="btn-accent">
              {running ? <Pause size={15} /> : <Play size={15} />}
              {running ? "Pause" : "Start session"}
            </button>
            <button
              onClick={() => { setRunning(false); setRemaining(mode === "focus" ? FOCUS : BREAK); }}
              className="btn-ghost"
            >
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={() => setFullscreen(true)} className="btn-ghost">
              <Maximize2 size={14} /> Deep Work
            </button>
          </div>

          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mt-6">
            Space · Start  ·  R · Reset  ·  F · Fullscreen
          </div>
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 ambient-bg" />
            <div className="absolute inset-0 grid-bg opacity-40" />

            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-6 right-6 btn-ghost z-10"
            >
              <Minimize2 size={14} /> Exit
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center"
            >
              <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-8">
                Deep Work Mode
              </div>
              <TimerInner size={Math.min(520, typeof window !== "undefined" ? window.innerWidth - 80 : 420)} />
              <div className="flex gap-2 mt-10">
                <button onClick={() => setRunning((r) => !r)} className="btn-accent">
                  {running ? <Pause size={15} /> : <Play size={15} />}
                  {running ? "Pause" : "Start"}
                </button>
                <button
                  onClick={() => { setRunning(false); setRemaining(mode === "focus" ? FOCUS : BREAK); }}
                  className="btn-ghost"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/85 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowComplete(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              className="card-elevated p-8 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-foreground flex items-center justify-center mb-4">
                <Brain size={22} className="text-background" />
              </div>
              <h3 className="text-xl font-semibold mb-1">Session complete</h3>
              <p className="text-sm text-muted-foreground mb-5">
                +50 XP earned. Take a short break and reset.
              </p>
              <button onClick={() => setShowComplete(false)} className="btn-accent w-full justify-center">
                Start break
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
