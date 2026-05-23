import { motion } from "framer-motion";
import { CloudRain, Coffee, Music2, Trees, Volume2, VolumeX, SkipForward } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SoundId = "rain" | "cafe" | "lofi" | "nature";

type Track = { title: string; url: string };

// Curated, hotlink-friendly tracks (archive.org public domain / CC).
// Each scene rotates through its playlist so sessions stay fresh.
const playlists: Record<SoundId, Track[]> = {
  lofi: [
    { title: "Lofi Study — Chill Beats", url: "https://archive.org/download/lofi-study-chill-beats/lofi-study-chill-beats.mp3" },
    { title: "Dreamy Lofi", url: "https://archive.org/download/dreamy-lofi/dreamy-lofi.mp3" },
    { title: "Midnight Lofi", url: "https://archive.org/download/midnight-lofi/midnight-lofi.mp3" },
  ],
  rain: [
    { title: "Heavy Rain on Roof", url: "https://archive.org/download/rain-on-roof/rain-on-roof.mp3" },
    { title: "Gentle Rainfall", url: "https://archive.org/download/gentle-rainfall/gentle-rainfall.mp3" },
  ],
  cafe: [
    { title: "Parisian Café Ambience", url: "https://archive.org/download/cafe-ambience-paris/cafe-ambience-paris.mp3" },
    { title: "Cozy Coffeehouse", url: "https://archive.org/download/cozy-coffeehouse/cozy-coffeehouse.mp3" },
  ],
  nature: [
    { title: "Forest Birds at Dawn", url: "https://archive.org/download/forest-birds-dawn/forest-birds-dawn.mp3" },
    { title: "Mountain Stream", url: "https://archive.org/download/mountain-stream/mountain-stream.mp3" },
  ],
};

// Fallback stream URLs (Internet radio) — used if direct files are unreachable.
const fallbackStreams: Record<SoundId, Track[]> = {
  lofi: [{ title: "Lofi Girl Radio", url: "https://play.streamafrica.net/lofiradio" }],
  rain: [{ title: "Rain Radio", url: "https://streams.calmradio.com/api/39/128/stream" }],
  cafe: [{ title: "Coffeehouse Radio", url: "https://streams.calmradio.com/api/231/128/stream" }],
  nature: [{ title: "Nature Radio", url: "https://streams.calmradio.com/api/41/128/stream" }],
};

const sounds: { id: SoundId; label: string; icon: typeof CloudRain; hint: string }[] = [
  { id: "lofi", label: "Lo-Fi Beats", icon: Music2, hint: "Chill study beats" },
  { id: "rain", label: "Rain", icon: CloudRain, hint: "Steady downpour" },
  { id: "cafe", label: "Café", icon: Coffee, hint: "Warm room tone" },
  { id: "nature", label: "Nature", icon: Trees, hint: "Forest & birds" },
];

export function AmbientControls() {
  const [active, setActive] = useState<SoundId | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const usedFallbackRef = useRef(false);

  // Ensure audio element exists
  useEffect(() => {
    const a = new Audio();
    a.preload = "auto";
    a.crossOrigin = "anonymous";
    audioRef.current = a;
    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  // Volume / mute sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  const playTrack = useCallback(async (id: SoundId, idx: number) => {
    const a = audioRef.current;
    if (!a) return;
    const list = playlists[id];
    const track = list[idx % list.length];
    usedFallbackRef.current = false;
    a.src = track.url;
    a.loop = true;
    setLoading(true);
    try {
      await a.play();
    } catch {
      // Fallback to streaming radio if direct file fails (CORS/404)
      const fb = fallbackStreams[id][0];
      usedFallbackRef.current = true;
      a.src = fb.url;
      a.loop = false;
      try { await a.play(); } catch {}
    } finally {
      setLoading(false);
    }
  }, []);

  const toggle = useCallback(
    async (id: SoundId) => {
      const a = audioRef.current;
      if (!a) return;
      if (active === id) {
        a.pause();
        setActive(null);
        return;
      }
      setActive(id);
      setTrackIndex(0);
      await playTrack(id, 0);
    },
    [active, playTrack]
  );

  const skip = useCallback(async () => {
    if (!active) return;
    const next = trackIndex + 1;
    setTrackIndex(next);
    await playTrack(active, next);
  }, [active, trackIndex, playTrack]);

  const currentTrack = active
    ? usedFallbackRef.current
      ? fallbackStreams[active][0]
      : playlists[active][trackIndex % playlists[active].length]
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Soundscapes</div>
          <h3 className="text-sm font-medium mt-1">Focus music</h3>
        </div>
        <div className="flex items-center gap-1">
          {active && (
            <button
              onClick={skip}
              className="btn-ghost !p-2"
              title="Next track"
              aria-label="Next track"
            >
              <SkipForward size={14} />
            </button>
          )}
          <button
            onClick={() => setMuted((m) => !m)}
            className="btn-ghost !p-2"
            title={muted ? "Unmute" : "Mute"}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
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
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{s.label}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {isOn ? (loading ? "Loading…" : "Playing") : s.hint}
                </div>
              </div>
              {isOn && !loading && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-soft" />}
            </button>
          );
        })}
      </div>

      {currentTrack && (
        <div className="mb-3 text-[11px] text-muted-foreground truncate">
          <span className="text-foreground/80">Now playing:</span> {currentTrack.title}
        </div>
      )}

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
          aria-label="Volume"
        />
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-7 text-right">
          {Math.round((muted ? 0 : volume) * 100)}
        </span>
      </div>
    </motion.div>
  );
}
