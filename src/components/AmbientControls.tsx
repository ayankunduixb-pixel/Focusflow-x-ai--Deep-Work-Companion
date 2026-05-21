import { motion } from "framer-motion";
import { CloudRain, Coffee, Music2, Trees, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

const sounds = [
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "cafe", label: "Café", icon: Coffee },
  { id: "lofi", label: "Lo-Fi", icon: Music2 },
  { id: "nature", label: "Nature", icon: Trees },
];

export function AmbientControls() {
  const [active, setActive] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Ambient</div>
          <h3 className="text-sm font-medium mt-1">Study atmosphere</h3>
        </div>
        <button onClick={() => setMuted((m) => !m)} className="btn-ghost !p-2">
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {sounds.map((s) => {
          const isOn = active === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActive(isOn ? null : s.id)}
              className={`group flex items-center gap-2.5 p-3 rounded-lg border text-left transition ${
                isOn
                  ? "border-white/15 bg-white/[0.06]"
                  : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <Icon size={15} className={isOn ? "text-foreground" : "text-muted-foreground"} />
              <div className="flex-1">
                <div className="text-sm font-medium">{s.label}</div>
                <div className="text-[10px] text-muted-foreground">
                  {isOn ? "Playing" : "Tap"}
                </div>
              </div>
              {isOn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
