import { motion } from "framer-motion";
import { CloudRain, Coffee, Music2, Trees, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

const sounds = [
  { id: "rain", label: "Rain", icon: CloudRain, color: "var(--cyan-glow)" },
  { id: "cafe", label: "Café", icon: Coffee, color: "var(--purple-glow)" },
  { id: "lofi", label: "Lo-Fi", icon: Music2, color: "var(--neon)" },
  { id: "nature", label: "Nature", icon: Trees, color: "var(--cyan-glow)" },
];

export function AmbientControls() {
  const [active, setActive] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="glass p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ambient</div>
          <h3 className="text-xl font-display font-semibold mt-1">Study atmosphere</h3>
        </div>
        <button onClick={() => setMuted((m) => !m)} className="btn-ghost !p-2">
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sounds.map((s) => {
          const isOn = active === s.id;
          const Icon = s.icon;
          return (
            <motion.button
              key={s.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(isOn ? null : s.id)}
              className={`relative p-4 rounded-xl border text-left transition overflow-hidden ${
                isOn ? "border-white/30 bg-white/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              {isOn && (
                <div className="absolute inset-0 opacity-30 blur-2xl" style={{ background: s.color }} />
              )}
              <Icon size={20} className="relative mb-2" style={{ color: isOn ? s.color : undefined }} />
              <div className="text-sm font-medium relative">{s.label}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider relative">
                {isOn ? "● Playing" : "Tap to play"}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
