import { motion } from "framer-motion";
import { CloudRain, Coffee, Music2, Trees, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sounds = [
  {
    id: "rain",
    label: "Rain",
    icon: CloudRain,
    src: "https://cdn.pixabay.com/audio/2022/03/10/audio_5b6b3e7c0a.mp3",
  },
  {
    id: "cafe",
    label: "Café",
    icon: Coffee,
    src: "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d564.mp3",
  },
  {
    id: "lofi",
    label: "Lo-Fi",
    icon: Music2,
    src: "https://cdn.pixabay.com/audio/2024/11/05/audio_4956b4edd1.mp3",
  },
  {
    id: "nature",
    label: "Nature",
    icon: Trees,
    src: "https://cdn.pixabay.com/audio/2022/03/15/audio_8e5f1c5b2a.mp3",
  },
];

export function AmbientControls() {
  const [active, setActive] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio();
    a.loop = true;
    a.preload = "auto";
    a.crossOrigin = "anonymous";
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
  }, [muted, volume]);

  const toggle = async (id: string) => {
    const a = audioRef.current;
    if (!a) return;
    const sound = sounds.find((s) => s.id === id);
    if (!sound) return;

    if (active === id) {
      a.pause();
      setActive(null);
      return;
    }

    try {
      if (a.src !== sound.src) {
        a.src = sound.src;
      }
      a.volume = muted ? 0 : volume;
      await a.play();
      setActive(id);
    } catch (err) {
      console.error("Audio play failed", err);
      setActive(null);
    }
  };

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
        <button onClick={() => setMuted((m) => !m)} className="btn-ghost !p-2" title={muted ? "Unmute" : "Mute"}>
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {sounds.map((s) => {
          const isOn = active === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
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
                  {isOn ? "Playing" : "Tap to play"}
                </div>
              </div>
              {isOn && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Volume2 size={12} className="text-muted-foreground" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 accent-foreground"
        />
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-7 text-right">
          {Math.round(volume * 100)}
        </span>
      </div>
    </motion.div>
  );
}
