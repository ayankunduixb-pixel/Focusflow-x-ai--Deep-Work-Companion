import { motion } from "framer-motion";
import { Award, Lock, Shield, Swords, Trophy, Zap } from "lucide-react";

interface Props {
  xp: number;
  level: number;
}

const badges = [
  { icon: Zap, name: "First Spark", req: 50 },
  { icon: Shield, name: "Discipline I", req: 200 },
  { icon: Swords, name: "Warrior", req: 500 },
  { icon: Trophy, name: "Streak Master", req: 1000 },
  { icon: Award, name: "Deep Worker", req: 2000 },
];

export function Achievements({ xp, level }: Props) {
  const nextXp = level * 250;
  const pct = Math.min(100, ((xp % 250) / 250) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Progression</div>
          <h3 className="text-base font-semibold mt-1">Level {level}</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">XP</div>
          <div className="font-mono text-sm">{xp} / {nextXp}</div>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: "var(--gradient-ring)" }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2 mt-5">
        {badges.map((b) => {
          const unlocked = xp >= b.req;
          const Icon = unlocked ? b.icon : Lock;
          return (
            <div
              key={b.name}
              className={`aspect-square rounded-lg border flex flex-col items-center justify-center p-2 text-center transition ${
                unlocked
                  ? "border-white/12 bg-white/[0.04]"
                  : "border-white/[0.05] bg-white/[0.02] opacity-50"
              }`}
              title={`${b.name} · ${b.req} XP`}
            >
              <Icon size={15} className={unlocked ? "text-foreground" : "text-muted-foreground"} />
              <div className="text-[9px] mt-1 text-muted-foreground leading-tight">{b.name}</div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
