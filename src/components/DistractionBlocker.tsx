import { AnimatePresence, motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
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
      <div className="fixed bottom-4 right-4 z-30 card-surface px-3 py-2 text-xs flex items-center gap-2">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            active ? "bg-emerald-400 pulse-soft" : "bg-white/20"
          }`}
        />
        <span className="text-muted-foreground">Focus shield</span>
        <span className="font-mono text-foreground/80">{recovery}%</span>
      </div>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="text-center max-w-sm"
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-5 flex items-center justify-center bg-white/[0.06] border border-white/10">
                <ShieldAlert size={22} className="text-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 tracking-tight">Stay focused</h2>
              <p className="text-sm text-muted-foreground">
                Return to this window to continue your session.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
