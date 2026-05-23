import { motion } from "framer-motion";
import { CloudRain, Coffee, Music2, Trees, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SoundId = "rain" | "cafe" | "lofi" | "nature";

const sounds: { id: SoundId; label: string; icon: typeof CloudRain; hint: string }[] = [
  { id: "rain", label: "Rain", icon: CloudRain, hint: "Steady downpour" },
  { id: "cafe", label: "Café", icon: Coffee, hint: "Warm room tone" },
  { id: "lofi", label: "Lo-Fi", icon: Music2, hint: "Soft chord pad" },
  { id: "nature", label: "Nature", icon: Trees, hint: "Wind & birds" },
];

// ---- Procedural Web Audio engine ---------------------------------------
// Each scene returns a disposer that cleanly tears down its nodes.

function makeNoiseBuffer(ctx: AudioContext, seconds = 2, type: "white" | "pink" | "brown" = "white") {
  const length = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (type === "white") {
      data[i] = white;
    } else if (type === "pink") {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else {
      // brown
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }
  }
  return buffer;
}

type Scene = (ctx: AudioContext, out: GainNode) => () => void;

const scenes: Record<SoundId, Scene> = {
  rain: (ctx, out) => {
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 3, "white");
    src.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 600;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 5000;
    src.connect(hp).connect(lp).connect(out);
    src.start();
    return () => {
      try { src.stop(); } catch {}
      src.disconnect();
      hp.disconnect();
      lp.disconnect();
    };
  },
  cafe: (ctx, out) => {
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, 4, "brown");
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    const gain = ctx.createGain();
    gain.gain.value = 0.6;
    src.connect(lp).connect(gain).connect(out);
    src.start();
    return () => {
      try { src.stop(); } catch {}
      src.disconnect();
      lp.disconnect();
      gain.disconnect();
    };
  },
  lofi: (ctx, out) => {
    // Soft sustained chord (Cmaj7-ish) with slow detune wobble
    const freqs = [220, 277.18, 329.63, 415.3];
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1200;
    lp.Q.value = 0.5;
    lp.connect(out);
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? "triangle" : "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.08;
      // Slow LFO on detune for warmth
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.1 + i * 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain).connect(o.detune);
      lfo.start();
      o.connect(g).connect(lp);
      o.start();
      oscs.push(o, lfo);
      gains.push(g, lfoGain);
    });
    // Light tape hiss
    const noise = ctx.createBufferSource();
    noise.buffer = makeNoiseBuffer(ctx, 2, "pink");
    noise.loop = true;
    const ng = ctx.createGain();
    ng.gain.value = 0.04;
    noise.connect(ng).connect(out);
    noise.start();
    return () => {
      oscs.forEach((o) => { try { o.stop(); } catch {} o.disconnect(); });
      gains.forEach((g) => g.disconnect());
      try { noise.stop(); } catch {}
      noise.disconnect();
      ng.disconnect();
      lp.disconnect();
    };
  },
  nature: (ctx, out) => {
    // Wind: pink noise with slow LFO on lowpass
    const wind = ctx.createBufferSource();
    wind.buffer = makeNoiseBuffer(ctx, 4, "pink");
    wind.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 800;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.15;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 400;
    lfo.connect(lfoGain).connect(lp.frequency);
    lfo.start();
    const windGain = ctx.createGain();
    windGain.gain.value = 0.7;
    wind.connect(lp).connect(windGain).connect(out);
    wind.start();

    // Occasional bird chirps
    let stopped = false;
    const chirp = () => {
      if (stopped) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const base = 1800 + Math.random() * 1400;
      o.frequency.setValueAtTime(base, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(base * 1.6, ctx.currentTime + 0.08);
      o.frequency.exponentialRampToValueAtTime(base * 0.9, ctx.currentTime + 0.16);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      o.connect(g).connect(out);
      o.start();
      o.stop(ctx.currentTime + 0.25);
      setTimeout(chirp, 1500 + Math.random() * 4500);
    };
    setTimeout(chirp, 1200);

    return () => {
      stopped = true;
      try { wind.stop(); } catch {}
      try { lfo.stop(); } catch {}
      wind.disconnect();
      lp.disconnect();
      lfo.disconnect();
      lfoGain.disconnect();
      windGain.disconnect();
    };
  },
};

export function AmbientControls() {
  const [active, setActive] = useState<SoundId | null>(null);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const disposeRef = useRef<(() => void) | null>(null);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = muted ? 0 : volume;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    return ctxRef.current;
  }, [muted, volume]);

  useEffect(() => {
    if (masterRef.current && ctxRef.current) {
      const target = muted ? 0 : volume;
      masterRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(
        target,
        ctxRef.current.currentTime + 0.15
      );
    }
  }, [muted, volume]);

  useEffect(() => {
    return () => {
      disposeRef.current?.();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  const toggle = useCallback(
    async (id: SoundId) => {
      const ctx = ensureCtx();
      if (!ctx || !masterRef.current) return;
      if (ctx.state === "suspended") {
        try { await ctx.resume(); } catch {}
      }

      // Stop current
      disposeRef.current?.();
      disposeRef.current = null;

      if (active === id) {
        setActive(null);
        return;
      }

      const dispose = scenes[id](ctx, masterRef.current);
      disposeRef.current = dispose;
      setActive(id);
    },
    [active, ensureCtx]
  );

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
        <button
          onClick={() => setMuted((m) => !m)}
          className="btn-ghost !p-2"
          title={muted ? "Unmute" : "Mute"}
          aria-label={muted ? "Unmute" : "Mute"}
        >
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
                  {isOn ? "Playing" : s.hint}
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
          aria-label="Volume"
        />
        <span className="text-[10px] font-mono text-muted-foreground tabular-nums w-7 text-right">
          {Math.round((muted ? 0 : volume) * 100)}
        </span>
      </div>
    </motion.div>
  );
}
