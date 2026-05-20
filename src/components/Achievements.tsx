import { motion } from "framer-motion";
import { Award, Lock, Shield, Swords, Trophy, Zap } from "lucide-react";

interface Props { xp: number; level: number; }

const badges = [
  { icon: Zap, name: "First Spark", req: 50, color: "var(--cyan-glow)" },
  { icon: Shield, name: "Discipline I", req: 200, color: "var(--neon)" },
  { icon: Swords, name: "Focus Warrior", req: 500, color: "var(--purple-glow)" },
  { icon: Trophy, name: "Streak Master", req: 1000, color: "var(--cyan-glow)" },
  { icon: Award, name: "Deep Worker", req: 2000, color: "var(--neon)" },
];

export function Achievements({ xp, level }: Props) {
  const nextXp = level * 250;
  const pct = Math.min(100, (xp % 250) / 250 * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gamification</div>
          <h3 className="text-xl font-display font-semibold mt-1">Focus Warrior</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Level</div>
          <div className="text-2xl font-display font-semibold text-gradient">{level}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground">{xp} XP</span>
          <span className="text-muted-foreground">{nextXp} XP</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
            className="h-full rounded-full"
            style={{ background: "var(--gradient-hero)", boxShadow: "0 0 16px var(--neon)" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3 mt-6">
        {badges.map((b) => {
          const unlocked = xp >= b.req;
          const Icon = unlocked ? b.icon : Lock;
          return (
            <motion.div
              key={b.name}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 text-center transition ${
                unlocked ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.02] opacity-50"
              }`}
              style={unlocked ? { boxShadow: `0 0 20px ${b.color}40` } : undefined}
              title={b.name}
            >
              <Icon size={18} style={{ color: unlocked ? b.color : undefined }} />
              <div className="text-[9px] uppercase tracking-wider mt-1 text-muted-foreground leading-tight">{b.name}</div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
