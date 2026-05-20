import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export function DistractionBlocker({ active }: { active: boolean }) {
  const [show, setShow] = useState(false);
  const [recovery, setRecovery] = useState(100);

  useEffect(() => {
    if (!active) return;
    const onBlur = () => {
      setShow(true);
      setRecovery((r) => Math.max(0, r - 8));
    };
    const onFocus = () => setShow(false);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, [active]);

  useEffect(() => {
    const t = setInterval(() => setRecovery((r) => Math.min(100, r + 1)), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <div className="fixed top-4 right-4 z-30 glass px-3 py-2 text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: active ? "var(--neon)" : "rgba(255,255,255,0.3)", boxShadow: active ? "0 0 8px var(--neon)" : "none" }} />
        <span className="text-muted-foreground">Focus shield</span>
        <span className="font-mono">{recovery}%</span>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/90 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="text-center max-w-lg"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: "var(--gradient-hero)", boxShadow: "0 0 60px var(--neon)" }}
              >
                <AlertTriangle size={36} className="text-background" />
              </motion.div>
              <h2 className="text-4xl font-display font-semibold text-gradient mb-3">Stay focused.</h2>
              <p className="text-xl text-foreground/80 mb-2">Your future is watching.</p>
              <p className="text-sm text-muted-foreground">Return to this window to continue your session.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
