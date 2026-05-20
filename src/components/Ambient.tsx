import { useEffect, useState } from "react";

export function Particles({ count = 28 }: { count?: number }) {
  const [items] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 15,
      duration: 16 + Math.random() * 18,
      hue: Math.random() > 0.5 ? "var(--cyan-glow)" : "var(--purple-glow)",
    }))
  );

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
            background: `radial-gradient(circle, ${p.hue}, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

export function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return <span className="font-mono text-sm text-muted-foreground tabular-nums">{time}</span>;
}

export function greet(name = "Ayan") {
  const h = new Date().getHours();
  if (h < 5) return `Late night focus, ${name}`;
  if (h < 12) return `Good morning, ${name}`;
  if (h < 17) return `Good afternoon, ${name}`;
  if (h < 22) return `Good evening, ${name}`;
  return `Burning the midnight oil, ${name}`;
}
