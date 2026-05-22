import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Flame, Target, TrendingUp, Zap } from "lucide-react";

interface Stats {
  focusMinutes: number;
  sessions: number;
  streak: number;
  score: number;
}

const baseWeekly = [
  { day: "Mon", min: 75 },
  { day: "Tue", min: 110 },
  { day: "Wed", min: 60 },
  { day: "Thu", min: 145 },
  { day: "Fri", min: 95 },
  { day: "Sat", min: 180 },
  { day: "Sun", min: 130 },
];

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  delay,
}: {
  icon: any;
  label: string;
  value: string;
  sub?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="card-surface p-4"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <Icon size={14} className="text-muted-foreground" />
      </div>
      <div className="text-2xl font-semibold mt-2 tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

export function Dashboard({ stats, weekly: weeklyProp }: { stats: Stats; weekly?: { day: string; min: number }[] }) {
  const hours = Math.floor(stats.focusMinutes / 60);
  const mins = stats.focusMinutes % 60;

  // Live weekly data — prefer real data from props, fall back to base
  const [weekly, setWeekly] = useState(weeklyProp ?? baseWeekly);
  useEffect(() => {
    if (weeklyProp && weeklyProp.length) setWeekly(weeklyProp);
  }, [weeklyProp]);

  const [range, setRange] = useState<"7d" | "30d">("7d");

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Target} label="Focus today" value={`${hours}h ${mins}m`} sub="+25m from last session" delay={0} />
        <StatCard icon={Zap} label="Sessions" value={`${stats.sessions}`} sub="Goal: 4/day" delay={0.04} />
        <StatCard icon={Flame} label="Streak" value={`${stats.streak} days`} sub="Personal best: 12" delay={0.08} />
        <StatCard icon={TrendingUp} label="Productivity" value={`${stats.score}%`} sub="Trending up" delay={0.12} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-surface p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Weekly deep work</div>
              <h3 className="text-base font-semibold mt-1">Minutes focused</h3>
            </div>
            <div className="inline-flex p-1 rounded-lg bg-white/[0.03] border border-white/[0.07]">
              <button onClick={() => setRange("7d")} className={`tab ${range === "7d" ? "tab-active" : ""}`}>7d</button>
              <button onClick={() => setRange("30d")} className={`tab ${range === "30d" ? "tab-active" : ""}`}>30d</button>
            </div>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.16 265)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="oklch(0.72 0.16 265)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="oklch(1 0 0 / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(1 0 0 / 0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.19 0.006 270)",
                    border: "1px solid oklch(1 0 0 / 0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                    boxShadow: "0 8px 24px -12px oklch(0 0 0 / 0.6)",
                  }}
                  labelStyle={{ color: "oklch(1 0 0 / 0.5)" }}
                  cursor={{ stroke: "oklch(1 0 0 / 0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="min"
                  stroke="oklch(0.78 0.14 240)"
                  strokeWidth={2}
                  fill="url(#areaFill)"
                  animationDuration={600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-surface p-5"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Flow state</div>
          <h3 className="text-base font-semibold mt-1 mb-5">Live metrics</h3>

          <div className="space-y-4">
            {[
              { label: "Concentration", v: stats.score },
              { label: "Consistency", v: Math.min(100, stats.streak * 12) },
              { label: "Endurance", v: Math.min(100, stats.sessions * 18) },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono text-foreground/80">{m.v}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${m.v}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-ring)" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">AI Insight</div>
            <p className="text-xs leading-relaxed text-foreground/85">
              Your peak focus window is between{" "}
              <span className="text-foreground font-medium">7–9 PM</span>. Stack hard tasks there.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
