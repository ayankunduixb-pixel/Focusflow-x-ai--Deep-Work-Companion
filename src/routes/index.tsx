import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, LogOut } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast, Toaster } from "sonner";

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

import { supabase } from "@/integrations/supabase/client";
import { getUserStats, logFocusSession } from "@/lib/sessions.functions";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  head: () => ({
    meta: [
      { title: "FocusFlow X — Deep Work Companion" },
      { name: "description", content: "AI-powered deep focus companion: Pomodoro timer, analytics, ambient sounds, and gamified productivity." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [focusActive, setFocusActive] = useState(false);
  const [ready, setReady] = useState(false);

  // Final auth guard on client (handles direct refresh on SSR)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/auth" });
      else setReady(true);
    });
  }, [navigate]);

  const fetchStats = useServerFn(getUserStats);
  const logSession = useServerFn(logFocusSession);

  const { data: stats } = useQuery({
    queryKey: ["user-stats"],
    queryFn: () => fetchStats(),
    enabled: ready,
  });

  const handleComplete = async (gained: number) => {
    try {
      await logSession({ data: { mode: "focus", duration_minutes: 25, xp_earned: gained } });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
      toast.success("Session logged · +50 XP");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to log session");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const displayName =
    stats?.profile?.display_name ||
    stats?.profile?.email?.split("@")[0] ||
    "Friend";

  const focusMinutes = stats?.focusMinutesToday ?? 0;
  const sessions = stats?.sessionsToday ?? 0;
  const streak = stats?.streak ?? 0;
  const totalXp = stats?.totalXp ?? 0;
  const score = Math.min(100, Math.round(sessions * 12 + focusMinutes / 4));
  const level = Math.floor(totalXp / 250) + 1;
  const weekly = stats?.weekly;

  return (
    <div className="dark min-h-screen ambient-bg text-foreground relative overflow-x-hidden">
      <Toaster theme="dark" position="top-center" />
      <BootScreen />
      <Particles />
      <DistractionBlocker active={focusActive} />

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
              {displayName}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              title="Sign out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
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
            {greet(displayName)}.<br />
            <span className="text-muted-foreground">Let's enter deep work.</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-4 max-w-md">
            One session at a time. Every minute is saved to your account.
          </p>
        </motion.section>

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
          <Dashboard
            stats={{ focusMinutes, sessions, streak, score }}
            weekly={weekly}
          />
        </section>

        <section className="grid lg:grid-cols-2 gap-5 mb-12">
          <Achievements xp={totalXp} level={level} />
          <AIAssistant />
        </section>

        <section className="mb-16">
          <QuoteEngine />
        </section>

        <footer className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Built by <span className="text-foreground font-medium">Ayan Kundu</span> · Build One App A Day Challenge
          </div>
          <div className="flex items-center gap-3">
            <span>FocusFlow X · v1.0</span>
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              <Github size={13} />
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
