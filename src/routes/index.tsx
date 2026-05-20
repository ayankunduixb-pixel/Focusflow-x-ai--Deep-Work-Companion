import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Github } from "lucide-react";
import { FocusTimer } from "@/components/FocusTimer";
import { Dashboard } from "@/components/Dashboard";
import { QuoteEngine } from "@/components/QuoteEngine";
import { AmbientControls } from "@/components/AmbientControls";
import { AIAssistant } from "@/components/AIAssistant";
import { Achievements } from "@/components/Achievements";
import { GoalsTracker } from "@/components/GoalsTracker";
import { DistractionBlocker } from "@/components/DistractionBlocker";
import { BootScreen } from "@/components/BootScreen";
import { Particles, Clock, greet } from "@/components/Ambient";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "FocusFlow X — Deep Work Companion" },
      { name: "description", content: "An AI-powered deep focus companion for students. Pomodoro timer, ambient sounds, motivation engine, and gamified productivity tracking." },
    ],
  }),
});

function Index() {
  const [xp, setXp] = useState(180);
  const [sessions, setSessions] = useState(3);
  const [focusMinutes, setFocusMinutes] = useState(95);
  const [focusActive, setFocusActive] = useState(false);

  const level = Math.floor(xp / 250) + 1;
  const score = Math.min(100, Math.round((sessions * 12 + focusMinutes / 4)));
  const streak = 7;

  const handleComplete = (gained: number) => {
    setXp((x) => x + gained);
    setSessions((s) => s + 1);
    setFocusMinutes((m) => m + 25);
  };

  return (
    <div className="dark min-h-screen aurora-bg text-foreground relative">
      <BootScreen />
      <Particles />
      <DistractionBlocker active={focusActive} />

      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-6 md:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-hero)", boxShadow: "0 0 24px var(--neon)" }}>
              <Brain size={20} className="text-background" />
            </div>
            <div>
              <div className="text-sm font-display font-semibold tracking-tight">FocusFlow <span className="text-gradient">X</span></div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Deep Work Companion</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Clock />
            <div className="hidden md:flex items-center gap-2 glass px-3 py-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--cyan-glow)] pulse-soft" />
              <span className="text-xs text-muted-foreground">All systems nominal</span>
            </div>
          </div>
        </motion.header>

        {/* Hero greeting */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7 }}
          className="mb-10"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Welcome back</div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold leading-[1.05] tracking-tight">
            {greet("Ayan")} <span className="inline-block">👋</span>
            <br />
            <span className="text-gradient">Let's enter deep work.</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl">
            One session at a time. One day at a time. Your future self is being built right now.
          </p>
        </motion.section>

        {/* Hero grid */}
        <div className="grid lg:grid-cols-5 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 }}
            className="lg:col-span-3"
          >
            <FocusTimer
              onSessionComplete={handleComplete}
              focusActive={focusActive}
              setFocusActive={setFocusActive}
            />
          </motion.div>
          <div className="lg:col-span-2 space-y-6">
            <AmbientControls />
            <AIAssistant />
          </div>
        </div>

        {/* Dashboard */}
        <section className="mb-10">
          <div className="mb-5">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Analytics</div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold mt-1">Productivity intelligence</h2>
          </div>
          <Dashboard stats={{ focusMinutes, sessions, streak, score }} />
        </section>

        {/* Achievements + Goals */}
        <section className="grid lg:grid-cols-2 gap-6 mb-10">
          <Achievements xp={xp} level={level} />
          <GoalsTracker />
        </section>

        {/* Quote */}
        <section className="mb-10">
          <QuoteEngine />
        </section>

        {/* Footer */}
        <footer className="pt-10 mt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div>
            Built by <span className="text-foreground font-medium">Ayan Kundu</span> · Build One App A Day Challenge
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs">FocusFlow X v1.0</span>
            <Github size={14} />
          </div>
        </footer>
      </div>
    </div>
  );
}
