import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
};

export function Particles({ count = 14 }: { count?: number }) {
  const [items, setItems] = useState<Particle[]>([]);

  useEffect(() => {
    setItems(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 20,
        duration: 28 + Math.random() * 24,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {items.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            background: "oklch(1 0 0 / 0.6)",
          }}
        />
      ))}
    </div>
  );
}

export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  return (
    <span className="font-mono text-xs text-muted-foreground tabular-nums">
      {time}
    </span>
  );
}

export function useGreeting(name = "Ayan") {
  const [g, setG] = useState(`Hello, ${name}`);
  useEffect(() => {
    const h = new Date().getHours();
    if (h < 5) setG(`Late night, ${name}`);
    else if (h < 12) setG(`Good morning, ${name}`);
    else if (h < 17) setG(`Good afternoon, ${name}`);
    else if (h < 22) setG(`Good evening, ${name}`);
    else setG(`Burning late, ${name}`);
  }, [name]);
  return g;
}

export function greet(name = "Ayan") {
  return `Hello, ${name}`;
}
