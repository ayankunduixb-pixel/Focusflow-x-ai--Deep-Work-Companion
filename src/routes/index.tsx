import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
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
      {
        name: "description",
        content:
          "An AI-powered deep focus companion for students. Pomodoro timer, ambient sounds, motivation engine, and gamified productivity tracking.",
      },
    ],
  }),
});

function Index() {
  const [xp, setXp] = useState(180);
  const [sessions, setSessions] = useState(3);
  const [focusMinutes, setFocusMinutes] = useState(95);
  const [focusActive, setFocusActive] = useState(false);

  const level = Math.floor(xp / 250) + 1;
  const score = Math.min(100, Math.round(sessions * 12 + focusMinutes / 4));
  const streak = 7;

  const handleComplete = (gained: number) => {
    setXp((x) => x + gained);
    setSessions((s) => s + 1);
    setFocusMinutes((m) => m + 25);
  };

  return (
    <div className="dark min-h-screen ambient-bg text-foreground relative">
      <BootScreen />
      <Particles />
      <DistractionBlocker active={focusActive} />

      {/* Top nav */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background font-semibold text-sm">F</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold tracking-tight">FocusFlow</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">X</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock />
            <span className="hidden md:inline chip">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
        {/* Hero greeting */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15, duration: 0.4 }}
          className="mb-10"
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Welcome back
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
            {greet("Ayan")}.<br />
            <span className="text-muted-foreground">Let's enter deep work.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-4 max-w-md">
            One session at a time. The future you is being built right now.
          </p>
        </motion.section>

        {/* Primary: Timer + side rail */}
        <section className="grid lg:grid-cols-3 gap-5 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.45 }}
            className="lg:col-span-2"
          >
            <FocusTimer
              onSessionComplete={handleComplete}
              focusActive={focusActive}
              setFocusActive={setFocusActive}
            />
          </motion.div>
          <div className="space-y-4">
            <GoalsTracker />
            <AmbientControls />
          </div>
        </section>

        {/* Analytics */}
        <section className="mb-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Analytics
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mt-1 tracking-tight">
                Productivity
              </h2>
            </div>
          </div>
          <Dashboard stats={{ focusMinutes, sessions, streak, score }} />
        </section>

        {/* Progression + AI Coach */}
        <section className="grid lg:grid-cols-2 gap-5 mb-12">
          <Achievements xp={xp} level={level} />
          <AIAssistant />
        </section>

        {/* Quote */}
        <section className="mb-16">
          <QuoteEngine />
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Built by{" "}
            <span className="text-foreground font-medium">Ayan Kundu</span> · Build
            One App A Day Challenge
          </div>
          <div className="flex items-center gap-3">
            <span>FocusFlow X · v1.0</span>
            <Github size={13} />
          </div>
        </footer>
      </main>
    </div>
  );
}
