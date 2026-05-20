import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Flame, Target, TrendingUp, Zap } from "lucide-react";

interface Stats {
  focusMinutes: number;
  sessions: number;
  streak: number;
  score: number;
}

const weekly = [
  { day: "Mon", min: 75 },
  { day: "Tue", min: 110 },
  { day: "Wed", min: 60 },
  { day: "Thu", min: 145 },
  { day: "Fri", min: 95 },
  { day: "Sat", min: 180 },
  { day: "Sun", min: 130 },
];

function StatCard({ icon: Icon, label, value, accent, delay }: { icon: any; label: string; value: string; accent: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="glass p-5 relative overflow-hidden group"
    >
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition`} style={{ background: accent }} />
      <div className="flex items-center justify-between relative">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <Icon size={16} className="text-muted-foreground" />
      </div>
      <div className="text-3xl font-display font-semibold mt-3 relative">{value}</div>
    </motion.div>
  );
}

export function Dashboard({ stats }: { stats: Stats }) {
  const hours = Math.floor(stats.focusMinutes / 60);
  const mins = stats.focusMinutes % 60;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Focus today" value={`${hours}h ${mins}m`} accent="var(--neon)" delay={0} />
        <StatCard icon={Zap} label="Sessions" value={`${stats.sessions}`} accent="var(--cyan-glow)" delay={0.05} />
        <StatCard icon={Flame} label="Streak" value={`${stats.streak} days`} accent="var(--purple-glow)" delay={0.1} />
        <StatCard icon={TrendingUp} label="Productivity" value={`${stats.score}%`} accent="var(--neon)" delay={0.15} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weekly Deep Work</div>
              <h3 className="text-xl font-display font-semibold mt-1">Minutes focused</h3>
            </div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "rgba(20,20,30,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                />
                <Area type="monotone" dataKey="min" stroke="#22d3ee" strokeWidth={2.5} fill="url(#areaFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="glass p-6"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Focus Level</div>
          <h3 className="text-xl font-display font-semibold mt-1 mb-6">Flow state meter</h3>

          <div className="space-y-5">
            {[
              { label: "Concentration", v: stats.score },
              { label: "Consistency", v: Math.min(100, stats.streak * 12) },
              { label: "Endurance", v: Math.min(100, stats.sessions * 18) },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-mono">{m.v}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${m.v}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: "var(--gradient-hero)" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-muted-foreground">AI Insight</div>
            <p className="text-sm mt-1">Your peak focus window is between <span className="text-foreground font-medium">7–9 PM</span>. Stack hard tasks there.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
