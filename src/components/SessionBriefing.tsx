import { motion } from "framer-motion";
import { Activity, Brain, Clock3, Target, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  focusMinutes: number;
  sessions: number;
  streak: number;
  score: number;
}

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function peakWindow(hour: number) {
  if (hour < 6) return { label: "Pre-dawn calm", window: "5–7 AM", tone: "Low-friction planning" };
  if (hour < 11) return { label: "Morning peak", window: "8–11 AM", tone: "Hardest task first" };
  if (hour < 14) return { label: "Midday plateau", window: "12–2 PM", tone: "Admin & shallow work" };
  if (hour < 18) return { label: "Afternoon rebound", window: "3–6 PM", tone: "Creative synthesis" };
  if (hour < 22) return { label: "Evening flow", window: "7–9 PM", tone: "Deep, uninterrupted work" };
  return { label: "Late window", window: "10 PM–12 AM", tone: "Reflection & review" };
}

export function SessionBriefing({ focusMinutes, sessions, streak, score }: Props) {
  const now = useNow();
  const hour = now?.getHours() ?? 9;
  const peak = peakWindow(hour);

  const nextGoal = Math.max(0, 4 - sessions);
  const readiness = Math.min(
    100,
    Math.round(60 + streak * 3 + Math.max(0, 30 - focusMinutes / 4) * 0.4),
  );

  const rows = [
    { icon: Clock3, label: "Peak window", value: peak.window, sub: peak.tone },
    { icon: Target, label: "Sessions left", value: `${nextGoal}`, sub: "to hit daily goal" },
    { icon: TrendingUp, label: "Momentum", value: `${score}%`, sub: streak > 0 ? `${streak}-day streak` : "Start the streak" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.07] flex items-center justify-center">
            <Brain size={13} className="text-foreground" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Neural briefing
            </div>
            <div className="text-sm font-medium">{peak.label}</div>
          </div>
        </div>
        <span className="chip">
          <Activity size={10} />
          Live
        </span>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Focus readiness
          </span>
          <span className="font-mono text-sm tabular-nums">{readiness}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${readiness}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-ring)" }}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.label}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                <Icon size={13} className="text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {r.label}
                </div>
                <div className="text-sm font-medium truncate">{r.value}</div>
              </div>
              <div className="text-[10px] text-muted-foreground text-right max-w-[45%] truncate">
                {r.sub}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
